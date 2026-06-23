"use client"

import { useMemo, useState } from "react"
import { CardStack3D } from "./CardStack3D"
import type { CardStack3DItem } from "./CardStack3D"

interface Entry {
  idx: string
  kind: string
  cat: string
  title: string
  meta: string
  action: string
  excerpt: string
  isMusic: boolean
  art: string
}

const ENTRIES: Entry[] = [
  { idx: "01", kind: "ESSAY", cat: "Field Notes", title: "The Architecture of Silence", meta: "Lena Vos · 8 min read", action: "Read essay", isMusic: false, art: "linear-gradient(152deg,#2c2c2e 0%,#0b0b0c 70%)", excerpt: "How empty rooms keep time — a study of the spaces we build to hear ourselves think, and the quiet engineering that makes them possible." },
  { idx: "02", kind: "SOUND", cat: "Mixtape", title: "Midnight Press", meta: "Compiled by NOCTURNE · 47 min", action: "Play mixtape", isMusic: true, art: "radial-gradient(120% 90% at 28% 18%,#343436 0%,#070708 72%)", excerpt: "Forty-seven minutes recorded between two and four a.m. — dub, tape hiss, and the low hum of a city that refuses to sleep." },
  { idx: "03", kind: "ESSAY", cat: "Dispatch", title: "Cities That Sleep Standing Up", meta: "Arman Reyes · 6 min read", action: "Read essay", isMusic: false, art: "linear-gradient(200deg,#242426 0%,#040405 65%)", excerpt: "A night walk through districts that never fully close, where neon quietly does the work the sun used to do." },
  { idx: "04", kind: "SOUND", cat: "Album", title: "Low Frequencies", meta: "HALV · 39 min", action: "Play album", isMusic: true, art: "linear-gradient(160deg,#1f1f21 0%,#040404 78%)", excerpt: "Nine tracks pressed in mono. Bass you feel before you hear it, mastered for headphones and long, empty drives." },
  { idx: "05", kind: "ESSAY", cat: "Essay", title: "On the Texture of Late Light", meta: "Mira Sol · 5 min read", action: "Read essay", isMusic: false, art: "radial-gradient(110% 110% at 72% 6%,#313133 0%,#08080a 70%)", excerpt: "Why the last hour of daylight feels heavier than the rest — notes on grain, shadow, and the weight of memory." },
  { idx: "06", kind: "SOUND", cat: "Session", title: "Static & Snow", meta: "Live at Room 9 · 22 min", action: "Play session", isMusic: true, art: "linear-gradient(135deg,#28282a 0%,#030304 76%)", excerpt: "A single take, one microphone, no overdubs. Recorded the night the heating broke and nobody wanted to stop." },
]

const bars = (seed: number) =>
  Array.from({ length: 22 }, (_, k) => {
    const v = Math.abs(Math.sin(k * 0.68 + seed * 1.3)) * 64 + 16 + (k % 4) * 5
    return Math.max(10, Math.min(100, Math.round(v)))
  })

const Equalizer = ({ seed, large = false }: { seed: number; large?: boolean }) => (
  <div
    className="absolute flex items-end"
    style={{ left: large ? 28 : 18, right: large ? 28 : 18, bottom: large ? 30 : 18, gap: large ? 4 : 3, height: large ? 74 : 52 }}
  >
    {bars(seed).map((h, k) => (
      <div key={k} style={{ flex: 1, height: `${h}%`, background: `rgba(255,255,255,${large ? 0.36 : 0.34})`, borderRadius: 1 }} />
    ))}
  </div>
)

const CardFace = ({ e, i }: { e: Entry; i: number }) => (
  <div className="flex h-full flex-col p-[19px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
    <div className="flex flex-none items-center justify-between text-[11px] tracking-[.18em] text-white/50">
      <span>{e.idx}</span>
      <span>{e.kind}</span>
    </div>
    <div className="relative my-[15px] min-h-0 flex-1 overflow-hidden rounded-[9px]" style={{ background: e.art, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.05)" }}>
      <span className="absolute select-none" style={{ right: -4, bottom: -44, fontFamily: "'Spectral', serif", fontWeight: 500, fontSize: 180, lineHeight: 1, color: "rgba(255,255,255,.05)" }}>{e.idx}</span>
      {e.isMusic && <Equalizer seed={i} />}
    </div>
    <div className="mb-[9px] flex-none text-[10px] uppercase tracking-[.22em] text-white/40">{e.cat}</div>
    <div className="flex-none" style={{ fontFamily: "'Spectral', serif", fontWeight: 500, fontSize: 25, lineHeight: 1.1, letterSpacing: "-.01em", color: "#f3f3f3" }}>{e.title}</div>
    <div className="mt-[13px] flex flex-none items-center justify-between text-[10px] tracking-[.12em] text-white/40">
      <span>{e.meta}</span>
    </div>
  </div>
)

export default function CardStack3DDemo() {
  const [count] = useState(ENTRIES.length)

  const cards: CardStack3DItem[] = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const e = ENTRIES[i % ENTRIES.length]
        const idx = String(i + 1).padStart(2, "0")
        const entry = { ...e, idx }
        return {
          key: i,
          face: <CardFace e={entry} i={i} />,
        }
      }),
    [count],
  )

  return (
    <div className="relative w-full overflow-hidden" style={{ background: "radial-gradient(130% 95% at 50% 28%, #0c0c0e 0%, #060607 55%, #020203 100%)" }}>
      <CardStack3D cards={cards} height={620} />


    </div>
  )
}
