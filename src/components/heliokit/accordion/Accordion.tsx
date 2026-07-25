import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import type { ReactNode, ReactElement } from 'react'

const AccordionContext = createContext<{
  openItems: string[],
  toggleItem: (id: string) => void,
  allowMultiple: boolean
}>({
  openItems: [],
  toggleItem: () => { },
  allowMultiple: false,
})

interface AccordionProps {
  children: ReactNode
  type?: 'single' | 'multiple'
  className?: string
}

export const Accordion = ({ children, type = 'single', className }: AccordionProps) => {
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    const isOpen = openItems.includes(id)

    if (type === 'multiple') {
      setOpenItems((prev) =>
        isOpen ? prev.filter((item) => item !== id) : [...prev, id]
      )
    } else {
      setOpenItems(isOpen ? [] : [id])
    }
  }

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple: type === 'multiple' }}>
      <div className={`space-y-3 ${className}`}>{children}</div>
    </AccordionContext.Provider>
  )
}

/* ---------------------------------------------------------------------------
 * Beam border
 *
 * Two mirrored halves start at bottom-centre, travel in opposite directions
 * along the edges and meet at top-centre.
 *
 * Geometry is built from the measured pixel size of the box and the viewBox
 * matches it 1:1, so the stroke width is identical on every edge (a square
 * viewBox with preserveAspectRatio="none" scales the stroke per axis and makes
 * the vertical edges several times thicker than the horizontal ones).
 *
 * Both halves are the same length (width + height), so they arrive together,
 * and the beam travels off the end of the path instead of being drawn onto it,
 * which leaves no permanent outline and therefore no seam where the two halves
 * meet.
 * ------------------------------------------------------------------------ */

const BEAM_DURATION = 1.1
const BEAM_EASE: [number, number, number, number] = [0.4, 0, 0.2, 1]
const BEAM_RADIUS = 13
const BEAM_INSET = 2.5

/** Trailing comet layers, longest (dimmest) first. */
const BEAM_LAYERS = [
  { segment: 0.3, width: 3.5, opacity: 0.22, blurred: true },
  { segment: 0.18, width: 1.4, opacity: 0.5, blurred: false },
  { segment: 0.055, width: 1.4, opacity: 1, blurred: false },
]

const MAX_SEGMENT = Math.max(...BEAM_LAYERS.map((layer) => layer.segment))
/** Head travel needed for the longest tail to clear the end of the path. */
const HEAD_TRAVEL = 1 + MAX_SEGMENT

const buildHalfPaths = (width: number, height: number) => {
  const left = BEAM_INSET
  const top = BEAM_INSET
  const right = width - BEAM_INSET
  const bottom = height - BEAM_INSET
  const r = Math.max(0, Math.min(BEAM_RADIUS, (right - left) / 2, (bottom - top) / 2))
  const centre = width / 2

  return {
    // bottom-centre -> bottom-left -> up -> top-left -> top-centre
    leftHalf: [
      `M ${centre} ${bottom}`,
      `H ${left + r}`,
      `A ${r} ${r} 0 0 1 ${left} ${bottom - r}`,
      `V ${top + r}`,
      `A ${r} ${r} 0 0 1 ${left + r} ${top}`,
      `H ${centre}`,
    ].join(' '),
    // bottom-centre -> bottom-right -> up -> top-right -> top-centre
    rightHalf: [
      `M ${centre} ${bottom}`,
      `H ${right - r}`,
      `A ${r} ${r} 0 0 0 ${right} ${bottom - r}`,
      `V ${top + r}`,
      `A ${r} ${r} 0 0 0 ${right - r} ${top}`,
      `H ${centre}`,
    ].join(' '),
  }
}

interface BeamLayerProps {
  d: string
  head: MotionValue<number>
  segment: number
  width: number
  opacity: number
  filterId?: string
}

/**
 * One comet layer. `head` is the shared position of the beam tip along the
 * path, so every layer moves at exactly the same speed regardless of easing.
 *
 * framer-motion normalises the path to the SVG attribute `pathLength=1` and
 * renders the visible run as `stroke-dasharray: ${pathLength} ${pathSpacing}`
 * at `stroke-dashoffset: -pathOffset`, so the drawn run covers
 * [pathOffset, pathOffset + segment]. Spacing is HEAD_TRAVEL, which keeps the
 * dash period longer than the whole travel so the pattern can never repeat
 * back into the start of the path. pathLength/pathSpacing go through `initial`
 * because that is what puts them into the element's animated values.
 */
const BeamLayer = ({ d, head, segment, width, opacity, filterId }: BeamLayerProps) => {
  const pathOffset = useTransform(head, (position) => position - segment)

  return (
    <motion.path
      d={d}
      fill="none"
      stroke="white"
      strokeOpacity={opacity}
      strokeWidth={width}
      strokeLinecap="round"
      initial={{ pathLength: segment, pathSpacing: HEAD_TRAVEL }}
      style={{ pathOffset }}
      filter={filterId ? `url(#${filterId})` : undefined}
    />
  )
}

const BeamBorder = ({ width, height, onFinish }: { width: number, height: number, onFinish: () => void }) => {
  const uid = useId().replace(/:/g, '')
  const glowId = `beam-glow-${uid}`
  const head = useMotionValue(0)

  // Bottom-centre split flash, then the arrival flash at top-centre.
  const splitOpacity = useTransform(head, [0, 0.05, 0.2], [0.9, 0.7, 0])
  const splitScale = useTransform(head, [0, 0.2], [0.4, 1.6])
  const meetOpacity = useTransform(head, [0.9, 1, 1.22], [0, 1, 0])
  const meetScale = useTransform(head, [0.9, 1.22], [0.4, 1.6])

  const finish = useRef(onFinish)
  finish.current = onFinish

  useEffect(() => {
    const controls = animate(head, HEAD_TRAVEL, {
      duration: BEAM_DURATION,
      ease: BEAM_EASE,
      onComplete: () => finish.current(),
    })
    return () => controls.stop()
  }, [head])

  const { leftHalf, rightHalf } = buildHalfPaths(width, height)

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="absolute inset-0 overflow-visible"
    >
      <defs>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
      </defs>

      <motion.ellipse
        cx={width / 2}
        cy={height - BEAM_INSET}
        rx={9}
        ry={4}
        fill="white"
        filter={`url(#${glowId})`}
        style={{ opacity: splitOpacity, scale: splitScale }}
      />
      <motion.ellipse
        cx={width / 2}
        cy={BEAM_INSET}
        rx={9}
        ry={4}
        fill="white"
        filter={`url(#${glowId})`}
        style={{ opacity: meetOpacity, scale: meetScale }}
      />

      {[leftHalf, rightHalf].map((d, half) =>
        BEAM_LAYERS.map((layer, index) => (
          <BeamLayer
            key={`${half}-${index}`}
            d={d}
            head={head}
            segment={layer.segment}
            width={layer.width}
            opacity={layer.opacity}
            filterId={layer.blurred ? glowId : undefined}
          />
        ))
      )}
    </svg>
  )
}

interface AccordionItemProps {
  children: ReactNode
  value: string
}

export const AccordionItem = ({ children, value }: AccordionItemProps) => {
  const { openItems } = useContext(AccordionContext)
  const isOpen = openItems.includes(value)

  const boxRef = useRef<HTMLDivElement | null>(null)
  const [box, setBox] = useState({ width: 0, height: 0 })
  // Monotonic id, so a rapid re-open never collides with a beam still exiting.
  const [beamRun, setBeamRun] = useState<number | null>(null)
  const nextRun = useRef(0)
  const wasOpen = useRef(isOpen)

  useEffect(() => {
    if (isOpen && !wasOpen.current) {
      nextRun.current += 1
      setBeamRun(nextRun.current)
    } else if (!isOpen && wasOpen.current) {
      // Collapsing resizes the box mid-flight, so drop any beam still running.
      setBeamRun(null)
    }
    wasOpen.current = isOpen
  }, [isOpen])

  // The box grows while the content expands, so keep the geometry live.
  useEffect(() => {
    const el = boxRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setBox((prev) => (prev.width === width && prev.height === height ? prev : { width, height }))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      className="relative w-full cursor-pointer overflow-hidden rounded-[14px] shadow-[0_0_15px_rgba(255,255,255,0.1)] border border-white/20"
      style={{
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px -12px rgba(255, 255, 255, 0.1), 0 0 30px rgba(255, 255, 255, 0.05)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Background gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none z-0"></div>
      <div className="absolute -inset-[1px] bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none z-0"></div>

      {/* Beam animation */}
      <div ref={boxRef} className="absolute inset-0 pointer-events-none z-10">
        <AnimatePresence>
          {beamRun !== null && box.width > 0 && (
            <motion.div
              key={beamRun}
              className="absolute inset-0"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BeamBorder
                width={box.width}
                height={box.height}
                onFinish={() => setBeamRun((current) => (current === beamRun ? null : current))}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Child content */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as ReactElement<any>, { isOpen, value })
        }
        return child
      })}
    </motion.div>
  )
}

interface AccordionTriggerProps {
  children: ReactNode
  value?: string
  isOpen?: boolean
}

export const AccordionTrigger = ({ children, value, isOpen }: AccordionTriggerProps) => {
  const { toggleItem } = useContext(AccordionContext)

  return (
    <button
      onClick={() => toggleItem(value!)}
      className="w-full p-6 flex items-center justify-between text-left relative z-20 group"
    >
      <h3 className="text-xl font-semibold text-white group-hover:text-gray-300 transition-colors duration-300">
        {children}
      </h3>
      <motion.div
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="text-gray-300 group-hover:text-white transition-colors duration-300"
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </button>
  )
}

interface AccordionContentProps {
  children: ReactNode
  value?: string
  isOpen?: boolean
}

export const AccordionContent = ({ children, value, isOpen }: AccordionContentProps) => (
  <AnimatePresence initial={false}>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden relative z-20"
      >
        <div className="px-6 pb-6">
          <motion.p
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-gray-300 leading-relaxed"
          >
            {children}
          </motion.p>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
)
