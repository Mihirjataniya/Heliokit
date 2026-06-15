"use client"

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react"
import type { CSSProperties } from "react"
import { motion } from "framer-motion"

/** Built-in backgrounds the crystal refracts. Pass a key or any CSS background string. */
export const crystalBackgrounds: Record<string, string> = {
  icy: "radial-gradient(140% 115% at 50% -12%, #9cc0e0 0%, #4a73a0 28%, #243f5c 58%, #0c1928 100%), radial-gradient(38% 26% at 22% 16%, rgba(255,255,255,.20), transparent 70%), radial-gradient(30% 20% at 74% 12%, rgba(255,255,255,.16), transparent 72%)",
  reef: "radial-gradient(120% 95% at 50% 0%, #76e6cf 0%, #1fa893 38%, #0e6064 74%, #06303c 100%)",
  sunset: "radial-gradient(125% 105% at 50% 120%, #ffd589 0%, #ff8f5c 28%, #ff5e86 54%, #9243b4 84%, #3b2363 100%)",
  aurora: "radial-gradient(80% 62% at 20% 30%, rgba(58,230,176,.5), transparent 60%), radial-gradient(72% 62% at 82% 24%, rgba(128,96,255,.5), transparent 60%), radial-gradient(95% 85% at 50% 105%, rgba(42,128,210,.4), transparent 60%), linear-gradient(#070b16,#05070f)",
  studio: "radial-gradient(125% 95% at 50% 28%, #2c313d 0%, #14171f 56%, #090b10 100%)",
}

export interface CrystalTextProps {
  /** Word to render in crystal script */
  text?: string
  /** Optional backdrop. A `crystalBackgrounds` key, any CSS background, or leave
   *  unset to render transparent and refract whatever sits behind the component. */
  background?: string
  /** Auto-fit the font size to the word width */
  autoFit?: boolean
  /** Fixed font size (px). Overrides autoFit when set */
  fontSize?: number
  /** Write-on reveal duration in ms */
  duration?: number
  /** Replay the write-on whenever this value changes */
  replayToken?: number
  /** Loop the write-on forever */
  loop?: boolean
  /** Pause between loops, ms */
  loopDelay?: number
  /** Stage height in px (the 700×300 artwork scales to fit) */
  height?: number
  className?: string
}

const EASE = [0.5, 0.05, 0.3, 1] as const
const STAGE_W = 700
const STAGE_H = 300

/**
 * CrystalText — iOS-style frosted glass cursive lettering that refracts the
 * background behind it and writes itself on with a left-to-right reveal.
 *
 * The glass is built from stacked layers: an SVG text mask drives a refracted
 * background copy and a translucent backdrop-blurred body, over which sit
 * specular tube shading, a luminous core (feMorphology erode + flood), a
 * multiply edge, a cast shadow and an outer glow.
 */
export const CrystalText = ({
  text = "hello",
  background,
  autoFit = true,
  fontSize,
  duration = 4000,
  replayToken = 0,
  loop = false,
  loopDelay = 600,
  height = 460,
  className = "",
}: CrystalTextProps) => {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, "")
  const maskId = `ct-mask-${rawId}`
  const tubeId = `ct-tube-${rawId}`
  const coreId = `ct-core-${rawId}`
  const edgeId = `ct-edge-${rawId}`

  const bg = background ? crystalBackgrounds[background] ?? background : undefined

  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [fs, setFs] = useState(fontSize ?? 232)

  // Scale the fixed 700×300 stage to fit the container width.
  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      setScale(Math.min(1, (w * 0.94) / STAGE_W, (h * 0.86) / STAGE_H))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Auto-fit font size to the word width (canvas measureText).
  useEffect(() => {
    if (fontSize) {
      setFs(fontSize)
      return
    }
    if (!autoFit) {
      setFs(232)
      return
    }
    let cancelled = false
    const compute = () => {
      if (cancelled) return
      const ctx = document.createElement("canvas").getContext("2d")
      if (!ctx) return
      ctx.font = '700 100px "Dancing Script", cursive'
      const width = ctx.measureText(text || " ").width || 1
      setFs(Math.max(46, Math.min(232, Math.round(590 / (width / 100)))))
    }
    if (document.fonts?.ready) document.fonts.ready.then(compute)
    else compute()
    return () => {
      cancelled = true
    }
  }, [text, autoFit, fontSize])

  // Shared <text> attributes for every layer.
  const textProps = {
    x: 350,
    y: 208,
    textAnchor: "middle" as const,
    fontFamily: "'Dancing Script', cursive",
    fontWeight: 700,
    fontSize: fs,
  }

  const dur = duration / 1000
  const repeat = loop
    ? { repeat: Infinity, repeatType: "loop" as const, repeatDelay: loopDelay / 1000 }
    : {}

  const fullLayer: CSSProperties = { position: "absolute", inset: 0, overflow: "visible" }

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", width: "100%", height, overflow: "hidden", background: bg ?? "transparent" }}
    >
      {/* GLYPH STAGE */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: STAGE_W,
          height: STAGE_H,
          transform: `translate(-50%,-50%) scale(${scale})`,
        }}
      >
        {/* reveal wrapper: clip-path animates left->right to "write" */}
        <motion.div
          key={`wrap-${replayToken}`}
          style={{ position: "absolute", inset: 0 }}
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: "inset(0 0% 0 0)" }}
          transition={{ duration: dur, ease: EASE, ...repeat }}
        >
          {/* defs */}
          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width={STAGE_W} height={STAGE_H}>
                <text {...textProps} fill="#fff" stroke="#fff" strokeWidth={9} paintOrder="stroke">
                  {text}
                </text>
              </mask>
              <filter id={tubeId} x="-15%" y="-40%" width="130%" height="180%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="b" />
                <feSpecularLighting in="b" surfaceScale="5" specularConstant="0.9" specularExponent="13" lightingColor="#f1f1f3" result="s">
                  <fePointLight x="250" y="-20" z="160" />
                </feSpecularLighting>
                <feComposite in="s" in2="SourceAlpha" operator="in" />
              </filter>
              <filter id={coreId} x="-15%" y="-40%" width="130%" height="180%">
                <feMorphology in="SourceAlpha" operator="erode" radius="5" result="er" />
                <feGaussianBlur in="er" stdDeviation="3.5" result="g" />
                <feFlood floodColor="#fbfbfc" result="c" />
                <feComposite in="c" in2="g" operator="in" />
              </filter>
              <filter id={edgeId} x="-15%" y="-40%" width="130%" height="180%">
                <feMorphology in="SourceAlpha" operator="erode" radius="2.5" result="er" />
                <feComposite in="SourceAlpha" in2="er" operator="out" result="ring" />
                <feGaussianBlur in="ring" stdDeviation="1.4" result="rb" />
                <feFlood floodColor="#0a1a30" floodOpacity="0.7" result="col" />
                <feComposite in="col" in2="rb" operator="in" />
              </filter>
            </defs>
          </svg>

          {/* 0 · soft outer luminance */}
          <svg width={STAGE_W} height={STAGE_H} viewBox="0 0 700 300" style={{ ...fullLayer, mixBlendMode: "screen", opacity: 0.5 }}>
            <text {...textProps} fill="#eceef1" stroke="#eceef1" strokeWidth={6} paintOrder="stroke" style={{ filter: "blur(12px)" }}>
              {text}
            </text>
          </svg>

          {/* 1 · cast shadow */}
          <svg width={STAGE_W} height={STAGE_H} viewBox="0 0 700 300" style={fullLayer}>
            <text {...textProps} fill="rgba(4,10,20,0.32)" stroke="rgba(4,10,20,0.32)" strokeWidth={9} paintOrder="stroke" style={{ filter: "blur(10px)", transform: "translateY(17px)" }}>
              {text}
            </text>
          </svg>

          {/* 2 · refract whatever sits behind the component */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              WebkitBackdropFilter: "blur(2px) saturate(1.35) brightness(1.05)",
              backdropFilter: "blur(2px) saturate(1.35) brightness(1.05)",
              WebkitMaskImage: `url(#${maskId})`,
              maskImage: `url(#${maskId})`,
            }}
          />

          {/* 3 · translucent glass body tint */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(160deg,rgba(238,239,241,.3),rgba(208,210,214,.14) 50%,rgba(232,233,236,.24))",
              WebkitBackdropFilter: "blur(1.5px) brightness(1.05) contrast(1.04)",
              backdropFilter: "blur(1.5px) brightness(1.05) contrast(1.04)",
              WebkitMaskImage: `url(#${maskId})`,
              maskImage: `url(#${maskId})`,
            }}
          />

          {/* 4 · broad soft tube shading (rounded volume) */}
          <svg width={STAGE_W} height={STAGE_H} viewBox="0 0 700 300" style={{ ...fullLayer, mixBlendMode: "screen", opacity: 0.85 }}>
            <text {...textProps} fill="#fff" stroke="#fff" strokeWidth={9} paintOrder="stroke" style={{ filter: `url(#${tubeId})` }}>
              {text}
            </text>
          </svg>

          {/* 5 · luminous core glow down the stroke centres */}
          <svg width={STAGE_W} height={STAGE_H} viewBox="0 0 700 300" style={{ ...fullLayer, mixBlendMode: "screen" }}>
            <text {...textProps} fill="#fff" style={{ filter: `url(#${coreId})` }}>
              {text}
            </text>
          </svg>

          {/* 6 · refractive edge definition */}
          <svg width={STAGE_W} height={STAGE_H} viewBox="0 0 700 300" style={{ ...fullLayer, mixBlendMode: "multiply", opacity: 0.45 }}>
            <text {...textProps} fill="#0a1a2e" style={{ filter: `url(#${edgeId})` }}>
              {text}
            </text>
          </svg>
        </motion.div>
      </div>
    </div>
  )
}
