import { MeteorShower } from './MeteorShower'

const MeteorShowerDemo = () => {
  return (
    <div
      className="relative h-[600px] w-full overflow-hidden rounded-xl"
      style={{ background: '#05060f', fontFamily: "'Space Grotesk', system-ui, sans-serif" }}
    >
      <MeteorShower accentColor="#8fdcff" asteroidFrequency={3} fallSpeed={0.7} starDensity={2.5} meteorOpacity={0.22} />

      {/* demo overlay — your real app content sits on top of the background */}
      <div className="pointer-events-none absolute inset-0 flex flex-col">
        {/* nav */}
        <div className="flex items-center justify-between px-8 py-5">
          <div className="flex items-center gap-3">
            <div
              className="h-3 w-3 rounded-full"
              style={{
                background: 'radial-gradient(circle at 35% 30%, #cdecff, #4aa8e8)',
                boxShadow: '0 0 14px rgba(120,200,255,0.8)',
              }}
            />
            <span className="text-base font-semibold tracking-wide text-[rgba(235,242,255,0.95)]">Lumen</span>
          </div>
          <div className="flex items-center gap-7">
            <span className="text-sm text-[rgba(210,222,245,0.62)]">Product</span>
            <span className="text-sm text-[rgba(210,222,245,0.62)]">Pricing</span>
            <span className="text-sm text-[rgba(210,222,245,0.62)]">Docs</span>
            <span
              className="rounded-full px-4 py-2 text-sm font-semibold text-[rgba(15,18,35,0.95)]"
              style={{ background: 'linear-gradient(180deg, #eaf6ff, #bfe2ff)', boxShadow: '0 4px 18px rgba(120,190,255,0.35)' }}
            >
              Sign in
            </span>
          </div>
        </div>

        {/* hero */}
        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
          <span
            className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] text-xs font-medium tracking-[0.14em] text-[rgba(190,212,255,0.85)] backdrop-blur"
            style={{ border: '1px solid rgba(150,190,255,0.28)', background: 'rgba(120,170,255,0.07)' }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#7fe0ff', boxShadow: '0 0 10px #7fe0ff' }} />
            LIVE BACKGROUND
          </span>
          <h1
            className="m-0 font-bold leading-[1.02] tracking-[-0.02em] text-[#f3f7ff]"
            style={{ fontSize: 'clamp(40px, 6.4vw, 88px)', textShadow: '0 2px 40px rgba(60,110,220,0.45)' }}
          >
            Built among
            <br />
            the falling stars
          </h1>
          <p
            className="m-0 max-w-[560px] leading-[1.55] text-[rgba(206,218,242,0.72)]"
            style={{ fontSize: 'clamp(15px, 1.6vw, 19px)' }}
          >
            A drop-in animated backdrop for your web app — a deep galactic sky, drifting nebula, and meteors that streak
            down and burst on impact.
          </p>
          <div className="mt-1.5 flex gap-3.5">
            <span
              className="rounded-xl px-[26px] py-[13px] text-[15px] font-semibold text-[#0c1024]"
              style={{ background: 'linear-gradient(180deg, #f1f8ff, #c4e4ff)', boxShadow: '0 8px 30px rgba(120,190,255,0.4)' }}
            >
              Get started
            </span>
            <span
              className="rounded-xl px-[26px] py-[13px] text-[15px] font-medium text-[rgba(225,235,255,0.92)] backdrop-blur"
              style={{ border: '1px solid rgba(170,200,255,0.3)', background: 'rgba(140,180,255,0.06)' }}
            >
              View demo
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeteorShowerDemo
