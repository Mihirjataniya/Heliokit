import { LiquidPlasma } from './LiquidPlasma'

const LiquidPlasmaDemo = () => {
  return (
    <div
      className="relative h-[600px] w-full overflow-hidden rounded-xl"
      style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <LiquidPlasma speed={0.5} density={8} swirl={0.15} gloss={0.3} relief={0.25} />

      {/* demo overlay — your real app content sits on top of the background */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        {/* nav */}
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #fff, #ff7a9c)',
                boxShadow: '0 0 14px rgba(255,120,160,0.8)',
              }}
            />
            <span className="text-base font-semibold tracking-wide text-white/95">Prism</span>
          </div>
          <div className="flex items-center gap-7">
            <span className="text-sm text-white/70">Product</span>
            <span className="text-sm text-white/70">Pricing</span>
            <span className="text-sm text-white/70">Docs</span>
            <span
              className="rounded-full px-4 py-2 text-sm font-semibold text-[rgba(20,16,28,0.95)]"
              style={{ background: 'linear-gradient(180deg, #ffffff, #ffe0ec)', boxShadow: '0 4px 18px rgba(255,150,190,0.35)' }}
            >
              Sign in
            </span>
          </div>
        </div>

        {/* hero */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] text-xs font-medium tracking-[0.14em] text-white/90 backdrop-blur"
            style={{ border: '1px solid rgba(255,255,255,0.28)', background: 'rgba(255,255,255,0.08)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#fff', boxShadow: '0 0 10px #fff' }} />
            LIVE BACKGROUND
          </span>
          <h1
            className="m-0 font-semibold leading-[1.02] tracking-[-0.02em] text-white"
            style={{ fontSize: 'clamp(30px, 4.4vw, 64px)', textShadow: '0 2px 40px rgba(0,0,0,0.45)' }}
          >
            Move the cursor,
            <br />
            stir the plasma
          </h1>
          <p
            className="m-0 max-w-[560px] leading-[1.55] text-white/80"
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)', textShadow: '0 1px 18px rgba(0,0,0,0.4)' }}
          >
            A drop-in WebGL2 backdrop — dead-straight rainbow frosting flowing over a glossy fluid relief that pushes and
            flows back around your pointer.
          </p>
          <div className="mt-1.5 flex gap-3.5">
            <span
              className="rounded-xl px-[26px] py-[13px] text-[15px] font-semibold text-[#20101c]"
              style={{ background: 'linear-gradient(180deg, #ffffff, #ffe4ee)', boxShadow: '0 8px 30px rgba(255,150,190,0.4)' }}
            >
              Get started
            </span>
            <span
              className="rounded-xl px-[26px] py-[13px] text-[15px] font-medium text-white/95 backdrop-blur"
              style={{ border: '1px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.08)' }}
            >
              View demo
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiquidPlasmaDemo
