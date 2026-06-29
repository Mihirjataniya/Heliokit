"use client"

import { useState } from "react"
import { CrystalText, crystalBackgrounds } from "./CrystalText"

const SWATCHES: [string, string][] = [
  ["icy", "Glacier"],
  ["reef", "Reef"],
  ["sunset", "Sunset"],
  ["aurora", "Aurora"],
  ["studio", "Studio"],
]

// Pastel tints read best — they recolour the glass's luminous glow, not its
// specular highlight. `undefined` keeps the neutral frosted white.
const TINTS: [string | undefined, string, string][] = [
  [undefined, "#e9edf2", "Frost"],
  ["#bfe3ff", "#bfe3ff", "Ice"],
  ["#bafadf", "#bafadf", "Mint"],
  ["#ffe6a8", "#ffe6a8", "Gold"],
  ["#ffc7d9", "#ffc7d9", "Rose"],
  ["#cdbcff", "#cdbcff", "Lilac"],
]

export default function CrystalTextDemo() {
  const [draft, setDraft] = useState("hello")
  const [word, setWord] = useState("hello")
  const [bg, setBg] = useState("icy")
  const [tint, setTint] = useState<string | undefined>(undefined)
  const [token, setToken] = useState(0)

  const write = () => {
    setWord(draft || "hello")
    setToken((t) => t + 1)
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-white/10">
      <CrystalText text={word} background={bg} tint={tint} replayToken={token} height={560} />

      {/* type your own word */}
      <div className="absolute left-1/2 bottom-24 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-[rgba(10,16,26,.5)] py-[7px] pr-[7px] pl-[18px] backdrop-blur-md">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && write()}
          placeholder="Type anything…"
          maxLength={14}
          spellCheck={false}
          className="w-[230px] border-none bg-transparent text-2xl font-bold text-white outline-none"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        />
        <button
          onClick={write}
          className="inline-flex h-9 items-center justify-center rounded-full bg-white px-4 text-[13px] font-bold text-[#10202f] transition hover:bg-[#e8eef5]"
        >
          Write
        </button>
      </div>

      {/* background switcher */}
      <div className="absolute left-1/2 bottom-8 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/10 bg-[rgba(10,16,26,.45)] px-4 py-2.5 backdrop-blur-md">
        <span className="text-[11px] font-semibold tracking-[0.1em] text-white/55 uppercase">Behind</span>
        {SWATCHES.map(([key, label]) => (
          <button
            key={key}
            title={label}
            onClick={() => setBg(key)}
            className="h-6 w-6 cursor-pointer rounded-full transition-all"
            style={{
              background: crystalBackgrounds[key],
              backgroundSize: "cover",
              border: `2px solid ${key === bg ? "#fff" : "rgba(255,255,255,.25)"}`,
              boxShadow: key === bg ? "0 0 0 3px rgba(255,255,255,.18)" : "none",
            }}
          />
        ))}
        <button
          onClick={() => setToken((t) => t + 1)}
          title="Replay"
          className="ml-1.5 flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/85 transition hover:bg-white/20"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>

        <span className="ml-1 h-5 w-px bg-white/15" />
        <span className="text-[11px] font-semibold tracking-[0.1em] text-white/55 uppercase">Tint</span>
        {TINTS.map(([value, swatch, label]) => (
          <button
            key={label}
            title={label}
            onClick={() => setTint(value)}
            className="h-6 w-6 cursor-pointer rounded-full transition-all"
            style={{
              background: swatch,
              border: `2px solid ${value === tint ? "#fff" : "rgba(255,255,255,.25)"}`,
              boxShadow: value === tint ? "0 0 0 3px rgba(255,255,255,.18)" : "none",
            }}
          />
        ))}
      </div>
    </div>
  )
}
