import BoxFlipTextDemo from "@/components/heliokit/box-flip-text/BoxFlipTextDemo"

const usageSnippet = `import { BoxFlipText } from '@/components/box-flip-text/BoxFlipText'

export function Example() {
  return (
    <BoxFlipText
      words={["Design", "Build", "Ship it"]}
      interval={2000}   // hold each word, ms
      duration={650}    // flip speed, ms
      fontSize={96}
      color="#f4f6fb"
    />
  )
}`

const manualComponentCode = `"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { AnimatePresence, motion } from "framer-motion"

export interface BoxFlipTextProps {
  words?: string[]
  interval?: number
  duration?: number
  fontSize?: number
  color?: string
  loop?: boolean
  className?: string
}

const EASE = [0.66, 0, 0.34, 1] as const

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
    if (document.fonts?.ready) document.fonts.ready.then(read).catch(() => {})
  }, [words, fontSize])

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "120px" })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!inView || words.length < 2) return
    if (!loop && index >= words.length - 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1 >= words.length ? (loop ? 0 : i) : i + 1))
    }, interval)
    return () => clearInterval(id)
  }, [inView, interval, words.length, loop, index])

  const lineH = Math.round(fontSize * 1.18)
  // Outer element rotates about the box centre; inner is pushed out by depth.
  // Composed transform is rotateX()·translateZ() so the face orbits the centre
  // and sweeps over the top edge instead of flipping in place.
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
    transform: \`translateZ(\${depth}px)\`,
    backfaceVisibility: "hidden",
  }

  return (
    <div ref={stageRef} className={className} style={{ display: "flex", justifyContent: "center", lineHeight: 1 }}>
      <div
        ref={measureRef}
        aria-hidden
        style={{ position: "absolute", visibility: "hidden", pointerEvents: "none", height: 0, overflow: "hidden", whiteSpace: "nowrap", fontSize, fontWeight: 700, lineHeight: 1 }}
      >
        {words.map((w, i) => (
          <span key={i} style={{ display: "inline-block" }}>{w}</span>
        ))}
      </div>

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

export default BoxFlipText`

export const PreviewComponent = BoxFlipTextDemo

export const code = usageSnippet

export const description =
  "A word sits on the front face of an invisible 3D box; on each tick the box rotates up so the word rolls over the top edge while the next rises from below. Auto-fits each word and loops through the array."

export const cliSteps = [
  {
    id: 1,
    title: "Install the peer dependency",
    commands: ["npm install framer-motion"],
  },
  {
    id: 2,
    title: "Add the component with the HelioKit CLI",
    commands: ["npx heliokit@latest add box-flip-text"],
  },
  {
    id: 3,
    title: "Use the component",
    codeSnippets: [
      { filename: "components/Example.tsx", language: "tsx", code: usageSnippet },
    ],
  },
]

export const manualSteps = [
  {
    id: 1,
    title: "Install the dependency",
    commands: ["npm install framer-motion"],
  },
  {
    id: 2,
    title: "Create the component file",
    codeSnippets: [
      { filename: "src/components/box-flip-text/BoxFlipText.tsx", language: "tsx", code: manualComponentCode },
    ],
  },
  {
    id: 3,
    title: "Use it in your app",
    codeSnippets: [
      { filename: "components/Example.tsx", language: "tsx", code: usageSnippet },
    ],
  },
]

export const propsData = [
  {
    componentName: "BoxFlipText",
    props: [
      { propName: "words", description: "Words cycled through, one at a time", type: "string[]", defaultValue: `["Design", "Build", "Ship it"]` },
      { propName: "interval", description: "How long each word is held before flipping, ms", type: "number", defaultValue: "2000" },
      { propName: "duration", description: "Flip animation duration, ms", type: "number", defaultValue: "650" },
      { propName: "fontSize", description: "Font size in px", type: "number", defaultValue: "96" },
      { propName: "color", description: "Text colour (any CSS colour)", type: "string", defaultValue: `"#f4f6fb"` },
      { propName: "loop", description: "Loop forever; when false it stops on the last word", type: "boolean", defaultValue: "true" },
      { propName: "className", description: "Wrapper class", type: "string", defaultValue: `""` },
    ],
  },
]
