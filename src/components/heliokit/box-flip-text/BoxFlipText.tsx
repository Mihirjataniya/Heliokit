"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface BoxFlipTextProps {
  /** Words cycled through, one at a time */
  words?: string[]
  /** How long each word is held before flipping, ms */
  interval?: number
  /** Flip animation duration, ms */
  duration?: number
  /** Font size in px */
  fontSize?: number
  /** Text colour (any CSS colour) */
  color?: string
  /** Loop forever; when false it stops on the last word */
  loop?: boolean
  className?: string
}

// A snappy ease that overshoots slightly into place — reads like a solid box
// face rolling over rather than a soft fade.
const EASE = [0.66, 0, 0.34, 1] as const

/**
 * BoxFlipText — a single word sits on the front face of an invisible 3D box.
 * On each tick the box rotates up on the X-axis: the current word tilts back
 * and away over the top edge while the next word rolls up into view from the
 * bottom, with real perspective depth. The container width animates to fit
 * each word. Loops through the array.
 */
export const BoxFlipText = ({
  words = ["Design", "Build", "Ship it"],
  interval = 2000,
  duration = 650,
  fontSize = 96,
  color = "#f4f6fb",
  loop = true,
  className = "",
}: BoxFlipTextProps) => {
  const [index, setIndex] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const measureRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  // The 3D stage is cheap, but pausing the timer off-screen avoids needless
  // re-renders when the component is scrolled away.
  const [inView, setInView] = useState(true)

  // Measure each word against the real rendered font so the box hugs it.
  useLayoutEffect(() => {
    const el = measureRef.current
    if (!el) return
    const read = () => {
      const ws = Array.from(el.children).map((c) => (c as HTMLElement).offsetWidth)
      setWidths(ws)
    }
    read()
    // Re-measure once webfonts settle, in case the metrics shift.
    if (document.fonts?.ready) document.fonts.ready.then(read).catch(() => {})
  }, [words, fontSize])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Advance the active word.
  useEffect(() => {
    if (!inView || words.length < 2) return
    if (!loop && index >= words.length - 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1 >= words.length ? (loop ? 0 : i) : i + 1))
    }, interval)
    return () => clearInterval(id)
  }, [inView, interval, words.length, loop, index])

  const lineH = Math.round(fontSize * 1.18)
  // Each face sits half the box-depth out front. The OUTER element rotates
  // about the box centre; the INNER element is pushed out by `depth`. Because
  // the rotation is applied by the parent and the push-out by the child, the
  // composed transform is rotateX()·translateZ() — the face orbits the centre
  // and sweeps across the box's outer surface (front → over the top edge)
  // instead of flipping in place.
  const depth = lineH / 2
  const activeWidth = widths[index]

  const faceTextStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    whiteSpace: "nowrap",
    fontSize,
    fontWeight: 700,
    lineHeight: 1,
    color,
    transform: `translateZ(${depth}px)`,
    backfaceVisibility: "hidden",
  }

  return (
    <div ref={stageRef} className={className} style={{ display: "flex", justifyContent: "center", lineHeight: 1 }}>
      {/* hidden measurer — same type styling, used only to size the box */}
      <div
        ref={measureRef}
        aria-hidden
        style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", height: 0, overflow: "hidden", whiteSpace: "nowrap", fontSize, fontWeight: 700, lineHeight: 1 }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ display: "inline-block" }}>{w}</span>
        ))}
      </div>

      {/* 3D stage: perspective lives here, the box rotates inside */}
      <motion.div
        style={{ position: "relative", height: lineH, perspective: 900, transformStyle: "preserve-3d" }}
        animate={{ width: activeWidth ?? "auto" }}
        transition={{ duration: duration / 1000, ease: EASE }}
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={index}
            style={{ position: "absolute", inset: 0, transformOrigin: "center center", transformStyle: "preserve-3d" }}
            initial={{ rotateX: -90 }}
            animate={{ rotateX: 0 }}
            exit={{ rotateX: 90 }}
            transition={{ duration: duration / 1000, ease: EASE }}
          >
            <span style={faceTextStyle}>{words[index]}</span>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default BoxFlipText
