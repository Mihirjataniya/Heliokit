"use client"

import { useState } from "react"
import TextReflection from "./TextReflection";

const COLORS: [string, string][] = [
  ["#a6a4a4", "Steel"],
  ["#00bfff", "Cyan"],
  ["#ff4fa3", "Magenta"],
  ["#ffd166", "Gold"],
  ["#9b8cff", "Violet"],
  ["#3ee6b0", "Mint"],
]

export default function TextReflectionDemo() {
  const [color, setColor] = useState("#a6a4a4")

  return (
    <section className="relative w-full">
      <div className="absolute left-1/2 top-54 z-20 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[rgba(10,16,26,.45)] px-4 py-2.5 backdrop-blur-md">
        <span className="text-[11px] font-semibold tracking-[0.1em] text-white/55 uppercase">Colour</span>
        {COLORS.map(([value, label]) => (
          <button
            key={value}
            title={label}
            onClick={() => setColor(value)}
            className="h-6 w-6 cursor-pointer rounded-full transition-all"
            style={{
              background: value,
              border: `2px solid ${value === color ? "#fff" : "rgba(255,255,255,.25)"}`,
              boxShadow: value === color ? "0 0 0 3px rgba(255,255,255,.18)" : "none",
            }}
          />
        ))}
      </div>

      <TextReflection key={color} textData="HELIOKIT" color={color} />
    </section>
  )
}
