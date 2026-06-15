"use client"

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

/**
 * PixelSpotlight — renders an image as a grid of single-tint dots whose size and
 * opacity track each cell's brightness (dark cells stay empty), then reveals the
 * real photo through a soft circular spotlight that follows the cursor. The dot
 * layer is drawn once to a canvas; the spotlight is a CSS radial mask over a copy
 * of the image, so cursor tracking never re-renders React or repaints the dots.
 */
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

  // Paint the dot layer. Runs on load, on prop change and on resize — never on move.
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
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const cols = Math.max(1, Math.round(W / cellSize))
    const rows = Math.max(1, Math.round(H / cellSize))
    const cw = W / cols
    const ch = H / rows

    // Sample the image into a cols×rows grid using the same cover/contain map.
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

  // Load the image (CORS so its pixels are readable), then paint.
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

  // Repaint when any drawing prop changes.
  useEffect(() => {
    drawRef.current()
  }, [draw])

  // Repaint on container resize.
  useEffect(() => {
    const cont = containerRef.current
    if (!cont) return
    const ro = new ResizeObserver(() => drawRef.current())
    ro.observe(cont)
    return () => ro.disconnect()
  }, [])

  // Seed the spotlight CSS variables (radius / softness / centre position).
  useEffect(() => {
    const rev = revealRef.current
    if (!rev) return
    rev.style.setProperty("--r", `${radius}px`)
    rev.style.setProperty("--s", `${softness}px`)
    rev.style.setProperty("--x", "50%")
    rev.style.setProperty("--y", "50%")
  }, [radius, softness])

  const onMove = (e: MouseEvent) => {
    const cont = containerRef.current
    const rev = revealRef.current
    if (!cont || !rev) return
    const rect = cont.getBoundingClientRect()
    rev.style.setProperty("--x", `${e.clientX - rect.left}px`)
    rev.style.setProperty("--y", `${e.clientY - rect.top}px`)
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
}
