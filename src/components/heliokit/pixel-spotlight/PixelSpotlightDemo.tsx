"use client"

import { useState } from "react"
import { PixelSpotlight } from "./PixelSpotlight"

const IMAGE = "/demo/pixel-spotlight/portrait.jpg"

const TINTS: [string, string][] = [
  ["#e9e9e9", "Bone"],
  ["#7dd3fc", "Ice"],
  ["#a3e635", "Acid"],
  ["#f0abfc", "Orchid"],
]

export default function PixelSpotlightDemo() {
  const [color, setColor] = useState("#e9e9e9")
  const [radius, setRadius] = useState(130)
  const [cell, setCell] = useState(8)

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <PixelSpotlight image={IMAGE} height={520} dotColor={color} radius={radius} cellSize={cell} />

      <div className="pointer-events-none absolute left-6 top-5 z-10 text-[11px] tracking-[.24em] text-white/45 uppercase">
        Move your cursor — spotlight decodes the image
      </div>

      {/* controls */}
      <div className="absolute left-1/2 bottom-6 flex -translate-x-1/2 flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-2xl border border-white/10 bg-[rgba(10,10,12,.6)] px-5 py-3 backdrop-blur-md">
        <div className="flex items-center gap-2">
          {TINTS.map(([hex, label]) => (
            <button
              key={hex}
              title={label}
              onClick={() => setColor(hex)}
              className="h-6 w-6 cursor-pointer rounded-full transition-all"
              style={{
                background: hex,
                border: `2px solid ${hex === color ? "#fff" : "rgba(255,255,255,.25)"}`,
                boxShadow: hex === color ? "0 0 0 3px rgba(255,255,255,.16)" : "none",
              }}
            />
          ))}
        </div>

        <label className="flex items-center gap-2 text-[10px] tracking-[.16em] text-white/55 uppercase">
          Spot
          <input type="range" min={60} max={240} value={radius} onChange={(e) => setRadius(+e.target.value)} className="accent-white" />
        </label>

        <label className="flex items-center gap-2 text-[10px] tracking-[.16em] text-white/55 uppercase">
          Dots
          <input type="range" min={5} max={16} value={cell} onChange={(e) => setCell(+e.target.value)} className="accent-white" />
        </label>
      </div>
    </div>
  )
}
