import { useEffect, useRef } from 'react'

interface Asteroid {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  speed: number
}

interface BurstParticle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  max: number
  r: number
}

interface Burst {
  x: number
  y: number
  age: number
  parts: BurstParticle[]
}

interface Twinkle {
  x: number
  y: number
  r: number
  phase: number
  sp: number
}

export interface MeteorShowerProps {
  /** Streak / impact accent colour (hex). */
  accentColor?: string
  /** Asteroids spawned per second. */
  asteroidFrequency?: number
  /** Multiplier on how fast asteroids fall. */
  fallSpeed?: number
  /** Multiplier on the number of stars rendered. */
  starDensity?: number
  /** Global opacity of meteors + bursts (0 = invisible, 1 = full). */
  meteorOpacity?: number
  /** Extra classes for the wrapper. */
  className?: string
}

export const MeteorShower = ({
  accentColor = '#8fdcff',
  asteroidFrequency = 3,
  fallSpeed = 0.7,
  starDensity = 2.5,
  meteorOpacity = 0.22,
  className = '',
}: MeteorShowerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Live-read props that only affect the animation loop, so dragging a slider
  // doesn't force a full background rebuild.
  const liveRef = useRef({ accentColor, asteroidFrequency, fallSpeed, meteorOpacity })
  liveRef.current = { accentColor, asteroidFrequency, fallSpeed, meteorOpacity }

  // starDensity is the only knob that rebuilds the (expensive) static sky.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    let bg: HTMLCanvasElement | null = null
    let twinkles: Twinkle[] = []
    const asteroids: Asteroid[] = []
    const bursts: Burst[] = []
    let spawnAcc = 0
    let lastT = 0
    let raf = 0
    // Pause the RAF entirely while the canvas is scrolled out of view — the draw
    // loop (additive blends + shadowBlur) is the page's heaviest per-frame cost.
    let paused = false

    const hexToRgb = (hex: string) => {
      let hStr = (hex || '#8fdcff').replace('#', '')
      if (hStr.length === 3) hStr = hStr.split('').map((ch) => ch + ch).join('')
      const n = parseInt(hStr, 16)
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
    }

    const gauss = () => {
      let u = 0
      let v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    }

    const buildBackground = () => {
      const density = starDensity
      const bgCanvas = document.createElement('canvas')
      bgCanvas.width = w
      bgCanvas.height = h
      const c = bgCanvas.getContext('2d')
      if (!c) return

      // ---- deep blue-black base ----
      c.fillStyle = '#04050d'
      c.fillRect(0, 0, w, h)

      // ---- galactic band geometry ----
      const span = Math.hypot(w, h)
      const ang = -0.42 // upper-left -> lower-right
      const dx = Math.cos(ang)
      const dy = Math.sin(ang)
      const nx = -dy
      const ny = dx // perpendicular axis
      const cx = w * 0.5
      const cy = h * 0.48 // band centre-line
      const coreU = span * 0.16 // bright bulge along band (toward lower-right)
      const corePt = { x: cx + dx * coreU, y: cy + dy * coreU }
      const sigmaV = h * 0.2 // band half-thickness
      const perp = (x: number, y: number) => (x - cx) * nx + (y - cy) * ny
      const alongC = (x: number, y: number) => (x - cx) * dx + (y - cy) * dy - coreU
      // band luminance 0..1 — drives star density & brightness
      const bandLum = (x: number, y: number) => {
        const v = perp(x, y)
        const fall = Math.exp(-(v * v) / (2 * sigmaV * sigmaV))
        const a = alongC(x, y)
        const longFall = Math.exp(-(a * a) / (2 * (span * 0.5) * (span * 0.5)))
        return fall * (0.45 + 0.55 * longFall)
      }

      c.globalCompositeOperation = 'lighter'

      // ---- 1. blue/violet haze structure of the band ----
      for (let i = 0; i < 70; i++) {
        const u = (i / 69 - 0.5) * span * 1.15
        const off = gauss() * sigmaV * 0.6
        const bx = cx + dx * u + nx * off
        const by = cy + dy * u + ny * off
        const dc = Math.min(Math.abs(u - coreU) / (span * 0.5), 1)
        const inten = 1 - dc
        const r = 70 + Math.random() * 150 + inten * 90
        const a = (0.014 + Math.random() * 0.022) * (0.4 + inten)
        const warm = Math.max(0, inten - 0.6) * 2.2
        const cr = (78 + warm * 130) | 0
        const cg = (96 + warm * 22) | 0
        const cb = (178 + Math.random() * 36) | 0
        const rg = c.createRadialGradient(bx, by, 0, bx, by, r)
        rg.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`)
        rg.addColorStop(1, `rgba(${cr},${cg},${cb},0)`)
        c.fillStyle = rg
        c.fillRect(bx - r, by - r, r * 2, r * 2)
      }

      // ---- 2. dense uniform faint starfield across the WHOLE sky ----
      const uni = Math.round((w * h / 42) * density)
      for (let i = 0; i < uni; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        const lum = bandLum(x, y)
        const a = (0.13 + Math.random() * 0.34) * (0.4 + 0.6 * lum)
        const t = Math.random()
        const col = t < 0.62 ? `rgba(206,218,255,${a})` : t < 0.86 ? `rgba(166,190,255,${a})` : `rgba(255,238,220,${a})`
        c.fillStyle = col
        c.fillRect(x, y, 1, 1)
      }

      // ---- 3. extra-dense fine grain along the band (the "milky" texture) ----
      const grain = Math.round(78000 * density)
      for (let i = 0; i < grain; i++) {
        const u = (Math.random() - 0.5) * span * 1.2
        const v = gauss() * sigmaV
        const x = cx + dx * u + nx * v
        const y = cy + dy * u + ny * v
        if (x < 0 || x > w || y < 0 || y > h) continue
        const dc = Math.min(Math.abs(u - coreU) / (span * 0.5), 1)
        const lum = Math.exp(-(v * v) / (2 * sigmaV * sigmaV)) * (1 - dc * 0.5)
        if (Math.random() > lum) continue // density follows the band profile
        const a = (0.1 + Math.random() * 0.4) * (0.4 + 0.6 * lum)
        const t = Math.random()
        const col =
          t < 0.6
            ? `rgba(200,215,255,${a})`
            : t < 0.84
              ? `rgba(160,184,255,${a})`
              : t < 0.96
                ? `rgba(255,236,218,${a})`
                : `rgba(255,255,255,${a})`
        c.fillStyle = col
        c.fillRect(x, y, 1, 1)
      }

      // ---- 4. faint reddish nebula dabs near the core ----
      for (let i = 0; i < 5; i++) {
        const u = coreU + (Math.random() - 0.5) * span * 0.16
        const v = gauss() * sigmaV * 0.45
        const bx = cx + dx * u + nx * v
        const by = cy + dy * u + ny * v
        const r = 24 + Math.random() * 55
        const rg = c.createRadialGradient(bx, by, 0, bx, by, r)
        rg.addColorStop(0, `rgba(255,112,102,${0.05 + Math.random() * 0.06})`)
        rg.addColorStop(1, 'rgba(255,112,102,0)')
        c.fillStyle = rg
        c.fillRect(bx - r, by - r, r * 2, r * 2)
      }

      c.globalCompositeOperation = 'source-over'

      // ---- 5. dark dust rifts carving the band ----
      for (let i = 0; i < 11; i++) {
        const u = coreU + (Math.random() - 0.4) * span * 0.55
        const v = gauss() * sigmaV * 0.7
        const bx = cx + dx * u + nx * v
        const by = cy + dy * u + ny * v
        const r = 45 + Math.random() * 130
        const rg = c.createRadialGradient(bx, by, 0, bx, by, r)
        rg.addColorStop(0, `rgba(4,5,12,${0.5 + Math.random() * 0.4})`)
        rg.addColorStop(1, 'rgba(4,5,12,0)')
        c.fillStyle = rg
        c.fillRect(bx - r, by - r, r * 2, r * 2)
      }

      // ---- 6. bright resolved stars w/ glow + diffraction spikes ----
      c.globalCompositeOperation = 'lighter'
      twinkles = []
      const bright = Math.round((w * h / 2200) * density)
      for (let i = 0; i < bright; i++) {
        let x: number
        let y: number
        if (Math.random() < 0.5) {
          const u = (Math.random() - 0.5) * span * 1.2
          const v = gauss() * sigmaV * 1.4
          x = cx + dx * u + nx * v
          y = cy + dy * u + ny * v
        } else {
          x = Math.random() * w
          y = Math.random() * h
        }
        if (x < 0 || x > w || y < 0 || y > h) continue
        const mag = Math.pow(Math.random(), 2.6)
        const r = 0.4 + mag * 1.05
        const a = 0.34 + mag * 0.38
        const t = Math.random()
        const col = t < 0.2 ? `rgba(176,198,255,${a})` : t < 0.3 ? `rgba(255,224,198,${a})` : `rgba(232,240,255,${a})`
        c.beginPath()
        c.arc(x, y, r, 0, Math.PI * 2)
        c.fillStyle = col
        c.fill()
        if (mag > 0.66) {
          const gr = r * 4
          const g2 = c.createRadialGradient(x, y, 0, x, y, gr)
          g2.addColorStop(0, `rgba(186,208,255,${0.28 * a})`)
          g2.addColorStop(1, 'rgba(186,208,255,0)')
          c.fillStyle = g2
          c.fillRect(x - gr, y - gr, gr * 2, gr * 2)
          if (mag > 0.88) {
            const sp = r * 3.6
            c.strokeStyle = `rgba(206,222,255,${0.2 * a})`
            c.lineWidth = 0.5
            c.beginPath()
            c.moveTo(x - sp, y)
            c.lineTo(x + sp, y)
            c.moveTo(x, y - sp)
            c.lineTo(x, y + sp)
            c.stroke()
          }
          if (twinkles.length < 110) {
            twinkles.push({ x, y, r: r * 0.8, phase: Math.random() * Math.PI * 2, sp: 1.0 + Math.random() * 2.4 })
          }
        }
      }
      c.globalCompositeOperation = 'source-over'

      // ---- 7. gentle vignette to settle the edges ----
      const vg = c.createRadialGradient(corePt.x, corePt.y, Math.min(w, h) * 0.18, w * 0.5, h * 0.5, span * 0.66)
      vg.addColorStop(0, 'rgba(3,4,10,0)')
      vg.addColorStop(1, 'rgba(2,2,7,0.6)')
      c.fillStyle = vg
      c.fillRect(0, 0, w, h)

      bg = bgCanvas
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = canvas.clientWidth || window.innerWidth
      h = canvas.clientHeight || window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildBackground()
    }

    const spawn = () => {
      const speed = (250 + Math.random() * 280) * (liveRef.current.fallSpeed ?? 1)
      const a = 1.0 + (Math.random() - 0.5) * 0.12 // consistent down-right diagonal
      const x = -w * 0.15 + Math.random() * w * 1.05
      asteroids.push({
        x,
        y: -40 - Math.random() * h * 0.3,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed,
        size: 0.45 + Math.random() * 0.8,
        speed,
      })
    }

    const burst = (x: number, y: number) => {
      const parts: BurstParticle[] = []
      const n = 11 + ((Math.random() * 12) | 0)
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI * 0.1 - Math.random() * Math.PI * 0.8
        const sp = 55 + Math.random() * 200
        parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 0.55 + Math.random() * 0.5, r: 1 + Math.random() * 1.8 })
      }
      bursts.push({ x, y, age: 0, parts })
    }

    const loop = (now: number) => {
      if (paused) { raf = 0; return }
      if (!lastT) lastT = now
      let dt = (now - lastT) / 1000
      lastT = now
      dt = Math.min(dt, 0.05)

      const rgb = hexToRgb(liveRef.current.accentColor)
      const RA = (a: number) => `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`

      // clear the FULL device buffer first — dpr rounding can leave a thin
      // edge column the bg redraw misses, where additive meteor pixels would
      // otherwise pile up into a bright vertical residue.
      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = '#05060f'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      // background
      if (bg) ctx.drawImage(bg, 0, 0, w, h)

      // twinkles
      ctx.globalCompositeOperation = 'lighter'
      if (twinkles) {
        const ts = now / 1000
        for (const s of twinkles) {
          const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(ts * s.sp + s.phase))
          ctx.beginPath()
          ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${a})`
          ctx.fill()
        }
      }

      // spawn
      const freq = liveRef.current.asteroidFrequency ?? 0.9
      spawnAcc += dt * freq
      while (spawnAcc >= 1) {
        spawn()
        spawnAcc -= 1
      }

      // keep meteors very subtle / in the background
      ctx.globalAlpha = liveRef.current.meteorOpacity ?? 0.22

      // asteroids
      for (let i = asteroids.length - 1; i >= 0; i--) {
        const a = asteroids[i]
        a.x += a.vx * dt
        a.y += a.vy * dt

        if (a.y >= h) {
          burst(a.x, h)
          asteroids.splice(i, 1)
          continue
        }
        if (a.x < -120 || a.x > w + 120) {
          asteroids.splice(i, 1)
          continue
        }

        const dirx = a.vx / a.speed
        const diry = a.vy / a.speed
        const tail = Math.min(Math.max(a.speed * 0.7, 420), 1000)
        const ex = a.x - dirx * tail
        const ey = a.y - diry * tail

        // soft accent glow streak
        const g = ctx.createLinearGradient(a.x, a.y, ex, ey)
        g.addColorStop(0, RA(0.8))
        g.addColorStop(0.35, RA(0.2))
        g.addColorStop(1, RA(0))
        ctx.lineCap = 'round'
        ctx.strokeStyle = g
        ctx.lineWidth = a.size * 1.4
        ctx.shadowColor = RA(0.9)
        ctx.shadowBlur = 10
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(ex, ey)
        ctx.stroke()

        // bright white core streak
        const ex2 = a.x - dirx * tail * 0.45
        const ey2 = a.y - diry * tail * 0.45
        const g2 = ctx.createLinearGradient(a.x, a.y, ex2, ey2)
        g2.addColorStop(0, 'rgba(255,255,255,0.95)')
        g2.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.strokeStyle = g2
        ctx.lineWidth = a.size * 0.55
        ctx.shadowBlur = 6
        ctx.shadowColor = 'rgba(255,255,255,0.9)'
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(ex2, ey2)
        ctx.stroke()

        // glowing head
        ctx.shadowBlur = 0
        const hr = a.size * 1.7
        const hg = ctx.createRadialGradient(a.x, a.y, 0, a.x, a.y, hr)
        hg.addColorStop(0, 'rgba(255,255,255,1)')
        hg.addColorStop(0.4, RA(0.85))
        hg.addColorStop(1, RA(0))
        ctx.fillStyle = hg
        ctx.beginPath()
        ctx.arc(a.x, a.y, hr, 0, Math.PI * 2)
        ctx.fill()
      }

      // bursts
      for (let i = bursts.length - 1; i >= 0; i--) {
        const b = bursts[i]
        b.age += dt

        // ground flash glow
        if (b.age < 0.4) {
          const fa = 1 - b.age / 0.4
          const fr = 16 + b.age * 120
          const fg = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, fr)
          fg.addColorStop(0, RA(0.5 * fa))
          fg.addColorStop(1, RA(0))
          ctx.fillStyle = fg
          ctx.fillRect(b.x - fr, b.y - fr, fr * 2, fr * 2)
        }

        // expanding ring (additive blend gives the glow — no costly shadowBlur)
        if (b.age < 0.5) {
          const ra = 1 - b.age / 0.5
          const rr = 4 + b.age * 90
          ctx.strokeStyle = RA(0.8 * ra)
          ctx.lineWidth = 1.5 * ra + 0.4
          ctx.beginPath()
          ctx.arc(b.x, b.y, rr, Math.PI, Math.PI * 2)
          ctx.stroke()
        }

        // particles — drawn under 'lighter' compositing, so they bloom without
        // a per-particle shadowBlur (which was the loop's worst per-frame cost).
        let alive = false
        ctx.shadowBlur = 0
        for (const p of b.parts) {
          p.life += dt
          if (p.life >= p.max) continue
          alive = true
          p.vy += 480 * dt
          p.vx *= 0.985
          p.x += p.vx * dt
          p.y += p.vy * dt
          const pa = 1 - p.life / p.max
          ctx.fillStyle = Math.random() < 0.4 ? `rgba(255,255,255,${pa})` : RA(pa)
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r * (0.4 + pa * 0.6), 0, Math.PI * 2)
          ctx.fill()
        }
        if (!alive && b.age >= 0.5) bursts.splice(i, 1)
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      raf = requestAnimationFrame(loop)
    }

    resize()
    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    raf = requestAnimationFrame(loop)

    // Suspend the loop when the canvas leaves the viewport, resume on return.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (paused) {
            paused = false
            lastT = 0 // avoid a dt spike after the pause
            if (!raf) raf = requestAnimationFrame(loop)
          }
        } else {
          paused = true
        }
      },
      { rootMargin: '120px' },
    )
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', onResize)
    }
  }, [starDensity])

  return (
    <div className={`absolute inset-0 h-full w-full overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  )
}

export default MeteorShower
