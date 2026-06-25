"use client"

import { useEffect, useId, useRef, useState } from "react"
import type { CSSProperties, MouseEvent, ReactNode } from "react"

export interface CardStack3DItem {
  /** Content rendered on the card while it sits in the stack. Any JSX. */
  face: ReactNode
  /** Content shown inside the card once it opens (flattened and centred).
   *  Falls back to `face` when omitted. Pass `null` to make a card non-openable. */
  expanded?: ReactNode | null
  /** Stable key. Falls back to the array index. */
  key?: string | number
}

export interface CardStack3DProps {
  /** The cards, front to back. Add as many as you want. */
  cards: CardStack3DItem[]
  /** Stage height in px. */
  height?: number
  /** Card face size in px. */
  cardWidth?: number
  cardHeight?: number
  /** Per-card depth-cascade offsets. Each card behind the front is pushed by
   *  these amounts (x/y are the small "peek", z is the depth pull-apart). */
  spreadX?: number
  spreadY?: number
  spreadZ?: number
  /** 3D scene perspective in px. Lower = stronger foreshortening. */
  perspective?: number
  /** Base side-view tilt of the whole stack, in degrees (rotateY). */
  tilt?: number
  /** Tilt the whole stack toward the cursor (parallax). */
  parallax?: boolean
  /** Enable click-to-open → the card itself flattens and centres. */
  openable?: boolean
  /** How much the opened card scales up at centre. */
  openScale?: number
  /** Fired when a card opens (index) or the reader closes (null). */
  onOpenChange?: (index: number | null) => void
  className?: string
}

const STACK_EASE = "cubic-bezier(.16,1,.3,1)"

/**
 * CardStack3D — a front-left isometric depth cascade of glass panels. Cards are
 * parallel "pages pulled apart" in Z; the whole stack parallax-tilts toward the
 * cursor. Click a card and it lifts out of the pile, flattens to face you and
 * settles enlarged at centre while the rest blur and recede. Card faces and
 * their opened bodies are both plain JSX, so the stack holds whatever you put
 * in it, for any number of cards.
 */
export const CardStack3D = ({
  cards,
  height = 600,
  cardWidth = 322,
  cardHeight = 468,
  spreadX = 8,
  spreadY = 7,
  spreadZ = 96,
  perspective = 1600,
  tilt = 38,
  parallax = true,
  openable = true,
  openScale = 1.15,
  onOpenChange,
  className = "",
}: CardStack3DProps) => {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "")
  const hoverClass = `cs3d-card-${rawId}`

  const containerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [pointer, setPointer] = useState({ x: 0, y: 0 })
  // Skip compositing the 3D scene (preserve-3d + heavy shadows) while off screen.
  const [inView, setInView] = useState(true)
  const moveRaf = useRef(0)

  const isOpen = open !== null

  const setOpenState = (next: number | null) => {
    setOpen(next)
    onOpenChange?.(next)
  }

  // Escape closes the opened card.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenState(null)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  // Pause the scene when scrolled out of view.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "200px" })
    io.observe(el)
    return () => { io.disconnect(); if (moveRaf.current) cancelAnimationFrame(moveRaf.current) }
  }, [])

  // Parallax freezes while a card is open.
  const mx = isOpen || !parallax ? 0 : pointer.x
  const my = isOpen || !parallax ? 0 : pointer.y
  const tiltX = (1.5 - my * 2.6).toFixed(2)
  const tiltY = (tilt + mx * 4).toFixed(2)
  const stackTransform = `translateX(60px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`

  const N = cards.length

  const onMove = (e: MouseEvent) => {
    if (!parallax) return
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    // Coalesce mousemove into one state update per frame.
    if (moveRaf.current) return
    moveRaf.current = requestAnimationFrame(() => {
      moveRaf.current = 0
      setPointer({ x, y })
    })
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={onMove}
      onMouseLeave={() => setPointer({ x: 0, y: 0 })}
      onClick={() => isOpen && setOpenState(null)}
      style={{ position: "relative", width: "100%", height, overflow: "hidden", isolation: "isolate" }}
    >
      {/* scoped hover glow — only the front face is interactive while closed */}
      <style>{`
        .${hoverClass}{ transition: transform .7s ${STACK_EASE}, opacity .55s ease, filter .55s ease, box-shadow .35s ease; }
        .${hoverClass}:hover{
          box-shadow:
            inset 1.5px 0 0 rgba(175,210,255,.45),
            inset 0 1.5px 0 rgba(255,255,255,.12),
            inset -1.5px 0 0 rgba(0,0,0,.55),
            0 55px 95px rgba(0,0,0,.7),
            0 0 0 1px rgba(135,180,255,.5),
            0 0 26px rgba(95,155,255,.6),
            0 0 70px rgba(80,140,255,.34) !important;
        }
      `}</style>

      {/* 3D STAGE — only composited while on screen */}
      {inView && (
      <div style={{ position: "absolute", inset: 0, perspective, perspectiveOrigin: "42% 46%", zIndex: 10 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            pointerEvents: "none",
            transition: `transform .3s cubic-bezier(.22,1,.36,1)`,
            transform: stackTransform,
          }}
        >
          {cards.map((card, i) => {
            const fanX = -i * spreadX
            const fanY = -i * spreadY
            const fanZ = -i * spreadZ
            const canOpen = openable && card.expanded !== null

            let transform: string
            let opacity = 1
            let filter = "none"
            let zIndex = N - i

            if (open === i) {
              // The clicked card itself pulls out of the pile, flattens to face
              // the viewer (cancelling the stack's tilt) and settles enlarged at
              // centre. No separate overlay — this is the opened view.
              transform = `translate(-50%,-50%) rotateY(${(-tilt).toFixed(2)}deg) rotateX(-1.5deg) translate3d(-60px, -10px, 130px) scale(${openScale})`
              opacity = 1
              zIndex = N + 20
            } else if (open !== null) {
              // The rest recede deeper and blur back.
              transform = `translate(-50%,-50%) translate3d(${fanX}px, ${fanY}px, ${fanZ - 70}px)`
              opacity = 0.38
              filter = "blur(5px) brightness(.55)"
            } else {
              transform = `translate(-50%,-50%) translate3d(${fanX}px, ${fanY}px, ${fanZ}px)`
            }

            const frame: CSSProperties = {
              position: "absolute",
              left: "50%",
              top: "50%",
              width: cardWidth,
              height: cardHeight,
              transformOrigin: "center center",
              transform,
              opacity,
              filter,
              zIndex,
              cursor: canOpen ? "pointer" : "default",
              pointerEvents: open === null ? "auto" : "none",
              borderRadius: 15,
              overflow: "hidden",
              background: "#090909",
              border: "1px solid rgba(255,255,255,.06)",
              boxShadow:
                "inset 1.5px 0 0 rgba(255,255,255,.16), inset 0 1.5px 0 rgba(255,255,255,.07), inset -1.5px 0 0 rgba(0,0,0,.75), inset 0 -2px 0 rgba(0,0,0,.6), 0 55px 95px rgba(0,0,0,.72), 0 12px 32px rgba(0,0,0,.6)",
            }

            return (
              <div
                key={card.key ?? i}
                className={hoverClass}
                style={frame}
                onClick={(e) => {
                  e.stopPropagation()
                  if (canOpen) setOpenState(i)
                }}
              >
                <div style={{ position: "absolute", inset: 0 }}>
                  {open === i ? (card.expanded ?? card.face) : card.face}
                </div>
              </div>
            )
          })}
        </div>
      </div>
      )}

      {/* Close affordance — click anywhere or Esc also closes. */}
      {openable && isOpen && (
        <button
          onClick={() => setOpenState(null)}
          aria-label="Close"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            zIndex: 60,
            width: 30,
            height: 30,
            borderRadius: 999,
            background: "rgba(255,255,255,.08)",
            border: "1px solid rgba(255,255,255,.15)",
            color: "#ddd",
            fontSize: 12,
            lineHeight: 1,
            cursor: "pointer",
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}
