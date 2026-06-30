"use client"

import BoxFlipText from "./BoxFlipText"

export default function BoxFlipTextDemo() {
  return (
    <section
      className="flex w-full flex-col items-center justify-center gap-6 overflow-hidden rounded-2xl border border-white/10 px-6 py-24"
      style={{ background: "radial-gradient(900px 360px at 50% -10%, rgba(255,255,255,0.06), transparent 60%), #060708", fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/40">Built for</span>

      <BoxFlipText
        words={["Designers", "Engineers", "Founders", "Indie hackers", "Teams"]}
        interval={1900}
        duration={680}
        fontSize={92}
        color="#f4f6fb"
      />

      <p className="max-w-md text-center text-sm leading-relaxed text-white/45">
        One word rolls over the top of an invisible 3D box as the next rises from below.
      </p>
    </section>
  )
}
