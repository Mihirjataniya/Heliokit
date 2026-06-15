import PixelSpotlightDemo from "@/components/heliokit/pixel-spotlight/PixelSpotlightDemo"

const usageSnippet = `import { PixelSpotlight } from '@/components/pixel-spotlight/PixelSpotlight'

export function Example() {
  return (
    <PixelSpotlight
      image="/portrait.jpg"   // same-origin or CORS-enabled
      height={520}
      dotColor="#e9e9e9"
      cellSize={8}             // grid pitch — smaller = finer dots
      radius={130}             // spotlight size
      softness={50}            // feathered edge
    />
  )
}`

const manualComponentCode = `"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CSSProperties, MouseEvent } from "react"

export interface PixelSpotlightProps {
  /** The image to encode as dots and reveal under the spotlight. Must be
   *  same-origin or CORS-enabled (the dot layer reads its pixels). */
  image: string
  /** Stage height in px. Width fills the parent. */
  height?: number
  /** How the image maps into the stage. */
  fit?: "cover" | "contain"
  /** Grid pitch in px — distance between dot centres. Smaller = finer. */
  cellSize?: number
  /** Single tint for every dot. */
  dotColor?: string
  /** Max dot radius as a fraction of half a cell (1 = touching). */
  dotScale?: number
  /** Cells dimmer than this (0–1 luminance) stay empty. */
  brightnessThreshold?: number
  /** Spotlight radius in px. */
  radius?: number
  /** Feathered edge width in px. */
  softness?: number
  /** Stage background (shows through empty cells). */
  background?: string
  className?: string
}

export const PixelSpotlight = ({
  image,
  height = 480,
  fit = "cover",
  cellSize = 8,
  dotColor = "#e9e9e9",
  dotScale = 1,
  brightnessThreshold = 0.06,
  radius = 130,
  softness = 50,
  background = "#000",
  className = "",
}: PixelSpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const revealRef = useRef<HTMLImageElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const [active, setActive] = useState(false)

  const draw = useCallback(() => {
    const cont = containerRef.current
    const canvas = canvasRef.current
    const img = imgRef.current
    if (!cont || !canvas || !img) return

    const W = cont.clientWidth
    const H = height
    if (W === 0) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = \`\${W}px\`
    canvas.style.height = \`\${H}px\`
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const cols = Math.max(1, Math.round(W / cellSize))
    const rows = Math.max(1, Math.round(H / cellSize))
    const cw = W / cols
    const ch = H / rows

    const sc = document.createElement("canvas")
    sc.width = cols
    sc.height = rows
    const sctx = sc.getContext("2d", { willReadFrequently: true })
    if (!sctx) return
    const iw = img.naturalWidth
    const ih = img.naturalHeight
    const scale = fit === "cover" ? Math.max(W / iw, H / ih) : Math.min(W / iw, H / ih)
    const dw = iw * scale
    const dh = ih * scale
    const dx = (W - dw) / 2
    const dy = (H - dh) / 2
    const fx = cols / W
    const fy = rows / H
    sctx.clearRect(0, 0, cols, rows)
    sctx.drawImage(img, dx * fx, dy * fy, dw * fx, dh * fy)

    let data: Uint8ClampedArray
    try {
      data = sctx.getImageData(0, 0, cols, rows).data
    } catch {
      return // tainted canvas (image lacks CORS headers) — leave the layer blank
    }

    const maxR = (Math.min(cw, ch) / 2) * dotScale
    ctx.fillStyle = dotColor
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const i = (r * cols + c) * 4
        if (data[i + 3] < 8) continue
        const lum = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
        if (lum < brightnessThreshold) continue
        const rr = Math.pow(lum, 0.9) * maxR
        if (rr < 0.3) continue
        ctx.globalAlpha = Math.min(1, 0.35 + lum * 0.85)
        ctx.beginPath()
        ctx.arc((c + 0.5) * cw, (r + 0.5) * ch, rr, 0, Math.PI * 2)
        ctx.fill()
      }
    }
    ctx.globalAlpha = 1
  }, [height, fit, cellSize, dotColor, dotScale, brightnessThreshold])

  const drawRef = useRef(draw)
  drawRef.current = draw

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      imgRef.current = img
      drawRef.current()
    }
    img.src = image
    return () => {
      img.onload = null
    }
  }, [image])

  useEffect(() => {
    drawRef.current()
  }, [draw])

  useEffect(() => {
    const cont = containerRef.current
    if (!cont) return
    const ro = new ResizeObserver(() => drawRef.current())
    ro.observe(cont)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const rev = revealRef.current
    if (!rev) return
    rev.style.setProperty("--r", \`\${radius}px\`)
    rev.style.setProperty("--s", \`\${softness}px\`)
    rev.style.setProperty("--x", "50%")
    rev.style.setProperty("--y", "50%")
  }, [radius, softness])

  const onMove = (e: MouseEvent) => {
    const cont = containerRef.current
    const rev = revealRef.current
    if (!cont || !rev) return
    const rect = cont.getBoundingClientRect()
    rev.style.setProperty("--x", \`\${e.clientX - rect.left}px\`)
    rev.style.setProperty("--y", \`\${e.clientY - rect.top}px\`)
  }

  const maskGradient =
    "radial-gradient(circle var(--r) at var(--x) var(--y), #000 0, #000 calc(var(--r) - var(--s)), transparent var(--r))"

  const revealStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: fit,
    opacity: active ? 1 : 0,
    transition: "opacity .35s ease",
    WebkitMaskImage: maskGradient,
    maskImage: maskGradient,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    pointerEvents: "none",
    userSelect: "none",
  }

  return (
    <div
      ref={containerRef}
      className={className}
      onMouseMove={onMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      style={{ position: "relative", width: "100%", height, overflow: "hidden", background, cursor: "crosshair" }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0 }} />
      <img ref={revealRef} src={image} alt="" crossOrigin="anonymous" draggable={false} style={revealStyle} />
    </div>
  )
}`

export const PreviewComponent = PixelSpotlightDemo

export const code = usageSnippet

export const description =
  "Renders any image as a grid of single-tint dots — dot size and opacity follow each cell's brightness, dark areas stay empty — then reveals the real photo through a soft circular spotlight that follows the cursor and fades back to dots when you leave."

export const cliSteps = [
  {
    id: 1,
    title: "Add the component with the HelioKit CLI",
    commands: ["npx heliokit@latest add pixel-spotlight"],
  },
  {
    id: 2,
    title: "Use the component",
    codeSnippets: [
      { filename: "components/Example.tsx", language: "tsx", code: usageSnippet },
    ],
  },
]

export const manualSteps = [
  {
    id: 1,
    title: "Create the component file",
    codeSnippets: [
      { filename: "src/components/pixel-spotlight/PixelSpotlight.tsx", language: "tsx", code: manualComponentCode },
    ],
  },
  {
    id: 2,
    title: "Use it in your app",
    codeSnippets: [
      { filename: "components/Example.tsx", language: "tsx", code: usageSnippet },
    ],
  },
]

export const propsData = [
  {
    componentName: "PixelSpotlight",
    props: [
      { propName: "image", description: "Image to encode as dots and reveal under the spotlight. Must be same-origin or CORS-enabled.", type: "string", defaultValue: "—" },
      { propName: "height", description: "Stage height in px (width fills the parent)", type: "number", defaultValue: "480" },
      { propName: "fit", description: "How the image maps into the stage", type: `"cover" | "contain"`, defaultValue: `"cover"` },
      { propName: "cellSize", description: "Grid pitch in px between dot centres (smaller = finer)", type: "number", defaultValue: "8" },
      { propName: "dotColor", description: "Single tint for every dot", type: "string", defaultValue: `"#e9e9e9"` },
      { propName: "dotScale", description: "Max dot radius as a fraction of half a cell (1 = touching)", type: "number", defaultValue: "1" },
      { propName: "brightnessThreshold", description: "Cells dimmer than this (0–1 luminance) stay empty", type: "number", defaultValue: "0.06" },
      { propName: "radius", description: "Spotlight radius in px", type: "number", defaultValue: "130" },
      { propName: "softness", description: "Feathered edge width in px", type: "number", defaultValue: "50" },
      { propName: "background", description: "Stage background (shows through empty cells)", type: "string", defaultValue: `"#000"` },
      { propName: "className", description: "Wrapper class", type: "string", defaultValue: `""` },
    ],
  },
]
