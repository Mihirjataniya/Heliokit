import React, { useCallback, useMemo, useState } from 'react'

const E = React.createElement

const css = (s: string): React.CSSProperties => {
    const out: Record<string, string> = {}
    for (const decl of s.split(';')) {
        const i = decl.indexOf(':')
        if (i < 0) continue
        const key = decl.slice(0, i).trim()
        const val = decl.slice(i + 1).trim()
        if (!key) continue
        const camel = key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())
        out[camel] = val
    }
    return out as React.CSSProperties
}

/* ── time constants ────────────────────────────────────────────────────── */
const DAY = 86400000
const START = Date.UTC(2025, 8, 1)
const TODAY = Date.UTC(2026, 5, 24)

/* ── data generation (deterministic) ──────────────────────────────────────
 * mulberry32-style seeded PRNG so the dashboard renders identically every time. */
function makeRng(seed: number) {
    let a = seed >>> 0
    return function () {
        a |= 0
        a = (a + 0x6d2b79f5) | 0
        let t = Math.imul(a ^ (a >>> 15), 1 | a)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

type Day = {
    t: number
    revenue: number
    payroll: number
    marketing: number
    infra: number
    tooling: number
    office: number
    other: number
    expenses: number
    profit: number
    cashflow: number
    mrr: number
    newMrr: number
    churnedMrr: number
    capex: number
}

type Txn = {
    idx: number
    t: number
    inflow: boolean
    desc: string
    sub: string
    cat: string
    amount: number
    status: string
}

function buildData(): { days: Day[]; N: number } {
    const r = makeRng(20260624)
    const N = Math.round((TODAY - START) / DAY) + 1
    const days: Day[] = []
    let mrr = 132000
    for (let i = 0; i < N; i++) {
        const t = START + i * DAY
        const d = new Date(t)
        const dow = d.getUTCDay()
        const weekend = dow === 0 || dow === 6
        const wf = weekend ? 0.55 + r() * 0.12 : 0.95 + r() * 0.18
        const growth = 1 + i * 0.0013
        const seasonal = 1 + 0.07 * Math.sin(i / 26)
        let revenue = 3700 * growth * seasonal * wf * (0.9 + r() * 0.22)
        if (r() < 0.045) revenue += 4200 + r() * 9000
        const payroll = (1680 + i * 0.55) * (0.99 + r() * 0.02)
        const marketing = revenue * 0.16 * (0.55 + r() * 0.95) + (r() < 0.05 ? 1800 + r() * 3200 : 0)
        const infra = 240 + revenue * 0.032 * (0.8 + r() * 0.4)
        const tooling = 205 + i * 0.05
        const office = 160 + r() * 40
        const other = revenue * 0.045 * (0.4 + r() * 1.0)
        const expenses = payroll + marketing + infra + tooling + office + other
        const profit = revenue - expenses
        const capex = r() < 0.03 ? 2200 + r() * 7000 : 0
        const inflow = revenue * (0.9 + r() * 0.16)
        const cashflow = inflow - (expenses + capex)
        const newMrr = 320 + r() * 900 + i * 1.4
        const churnedMrr = 170 + r() * 430 + i * 0.3
        mrr = mrr + newMrr - churnedMrr
        days.push({ t, revenue, payroll, marketing, infra, tooling, office, other, expenses, profit, cashflow, mrr, newMrr, churnedMrr, capex })
    }
    return { days, N }
}

function buildTxns(days: Day[], N: number): Txn[] {
    const r = makeRng(77123)
    const customers = ['Acme Robotics', 'Northwind Labs', 'Vela Health', 'Quanta Systems', 'Brightwave', 'Mercato', 'Orbital Freight', 'Lumen AI', 'Tessellate', 'Harbor & Co', 'Pinnacle Group', 'Stratus Cloud', 'Foundry XYZ', 'Cobalt Studio', 'Meridian Bank', 'Vector Mobility']
    const plans: [string, number][] = [['Starter', 490], ['Team', 990], ['Growth', 1990], ['Business', 4900], ['Enterprise', 9900]]
    const vendors: [string, string, number, number][] = [['AWS', 'Infrastructure', 1400, 4200], ['Google Workspace', 'Software', 180, 520], ['Datadog', 'Infrastructure', 640, 1600], ['Gusto Payroll', 'Payroll', 38000, 52000], ['Figma', 'Software', 144, 144], ['HubSpot', 'Marketing', 900, 2400], ['WeWork', 'Office', 4200, 4200], ['Stripe Fees', 'Fees', 320, 1400], ['LinkedIn Ads', 'Marketing', 1200, 5200], ['Notion', 'Software', 96, 260]]
    const txns: Txn[] = []
    let id = 2200
    for (let i = 0; i < N; i++) {
        const t = days[i].t
        const d = new Date(t)
        const dom = d.getUTCDate()
        const nIn = r() < 0.6 ? 1 : r() < 0.25 ? 2 : 0
        for (let k = 0; k < nIn; k++) {
            const c = customers[Math.floor(r() * customers.length)]
            const pl = plans[Math.floor(r() * plans.length)]
            const seats = 1 + Math.floor(r() * 8)
            const amt = pl[1] * (pl[1] >= 4900 ? 1 : seats)
            const st = r() < 0.9 ? 'Completed' : r() < 0.6 ? 'Pending' : 'Failed'
            txns.push({ idx: i, t, inflow: true, desc: c, sub: pl[0] + ' plan · INV-' + id++, cat: 'Subscription', amount: amt, status: st })
        }
        if (r() < 0.4) {
            const v = vendors[Math.floor(r() * vendors.length)]
            if (v[0] === 'Gusto Payroll' && dom !== 1 && dom !== 15) continue
            const amt = Math.round(v[2] + r() * (v[3] - v[2]))
            txns.push({ idx: i, t, inflow: false, desc: v[0], sub: v[1] + ' · ' + ['Card', 'ACH', 'Wire'][Math.floor(r() * 3)], cat: v[1], amount: amt, status: r() < 0.95 ? 'Completed' : 'Pending' })
        }
    }
    return txns
}

/* ── formatting helpers ───────────────────────────────────────────────── */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const money = (v: number) => {
    const neg = v < 0
    v = Math.abs(Math.round(v))
    const s = '$' + v.toLocaleString('en-US')
    return neg ? '-' + s : s
}
const compact = (v: number) => {
    const neg = v < 0
    const a = Math.abs(v)
    let s: string
    if (a >= 1e6) s = '$' + (a / 1e6).toFixed(a >= 1e7 ? 1 : 2) + 'M'
    else if (a >= 1e3) s = '$' + (a / 1e3).toFixed(a >= 1e4 ? 0 : 1) + 'K'
    else s = '$' + Math.round(a)
    return neg ? '-' + s : s
}
const pct = (d: number | null) => {
    if (d == null || !isFinite(d)) return '—'
    const p = d * 100
    return (p > 0 ? '+' : '') + p.toFixed(1) + '%'
}
const dShort = (t: number) => {
    const d = new Date(t)
    return MONTHS[d.getUTCMonth()] + ' ' + d.getUTCDate()
}
const dFull = (t: number) => {
    const d = new Date(t)
    return dShort(t) + ', ' + d.getUTCFullYear()
}
const iso = (t: number) => {
    const d = new Date(t)
    const p = (n: number) => String(n).padStart(2, '0')
    return d.getUTCFullYear() + '-' + p(d.getUTCMonth() + 1) + '-' + p(d.getUTCDate())
}
const hexA = (hex: string, a: number) => {
    const h = hex.replace('#', '')
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'
}
const idxFor = (N: number, Y: number, M: number, D: number) =>
    Math.max(0, Math.min(N - 1, Math.round((Date.UTC(Y, M, D) - START) / DAY)))
const idxIso = (N: number, s: string): number | null => {
    if (!s) return null
    const p = s.split('-').map(Number)
    if (p.length < 3 || p.some(isNaN)) return null
    return idxFor(N, p[0], p[1] - 1, p[2])
}

/* ── chart builders (inline SVG via React.createElement) ───────────────── */
function buildSpark(vals: number[], color: string) {
    const n = vals.length
    if (!n) return null
    const min = Math.min.apply(null, vals)
    const max = Math.max.apply(null, vals)
    const rg = max - min || 1
    const W = 100
    const H = 30
    const xf = (i: number) => (n > 1 ? (i / (n - 1)) * W : W / 2)
    const yf = (v: number) => H - 2 - ((v - min) / rg) * (H - 5)
    let line = ''
    vals.forEach((v, i) => { line += (i ? 'L' : 'M') + xf(i).toFixed(2) + ' ' + yf(v).toFixed(2) + ' ' })
    const area = 'M0 ' + H + ' ' + vals.map((v, i) => 'L' + xf(i).toFixed(2) + ' ' + yf(v).toFixed(2)).join(' ') + ' L' + W + ' ' + H + ' Z'
    const gid = 'sg' + Math.random().toString(36).slice(2, 7)
    return E('svg', { viewBox: '0 0 100 30', preserveAspectRatio: 'none', style: { width: '100%', height: 34, display: 'block' } },
        E('defs', null, E('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, E('stop', { offset: '0%', stopColor: color, stopOpacity: 0.3 }), E('stop', { offset: '100%', stopColor: color, stopOpacity: 0 }))),
        E('path', { d: area, fill: 'url(#' + gid + ')' }),
        E('path', { d: line, fill: 'none', stroke: color, strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', vectorEffect: 'non-scaling-stroke' }))
}

function buildRevenue(slice: Day[], acc: string, hoverIdx: number | null, setHover: (i: number | null) => void) {
    const n = slice.length
    const W = 1000, H = 336, X0 = 58, X1 = 956, Y0 = 24, Y1 = 298
    const rev = slice.map((d) => d.revenue)
    const mrr = slice.map((d) => d.mrr)
    const rMax = Math.max.apply(null, rev) * 1.15 || 1
    let mMin = Math.min.apply(null, mrr)
    let mMax = Math.max.apply(null, mrr)
    if (mMin === mMax) { mMin *= 0.98; mMax *= 1.02 }
    const mPad = (mMax - mMin) * 0.18
    mMin -= mPad; mMax += mPad
    const xf = (i: number) => (n > 1 ? X0 + (i / (n - 1)) * (X1 - X0) : (X0 + X1) / 2)
    const yR = (v: number) => Y1 - (v / rMax) * (Y1 - Y0)
    const yM = (v: number) => Y1 - ((v - mMin) / ((mMax - mMin) || 1)) * (Y1 - Y0)
    let line = '', mline = ''
    rev.forEach((v, i) => { line += (i ? 'L' : 'M') + xf(i).toFixed(1) + ' ' + yR(v).toFixed(1) + ' ' })
    mrr.forEach((v, i) => { mline += (i ? 'L' : 'M') + xf(i).toFixed(1) + ' ' + yM(v).toFixed(1) + ' ' })
    const area = 'M' + xf(0).toFixed(1) + ' ' + Y1 + ' ' + rev.map((v, i) => 'L' + xf(i).toFixed(1) + ' ' + yR(v).toFixed(1)).join(' ') + ' L' + xf(n - 1).toFixed(1) + ' ' + Y1 + ' Z'
    const yticks: { y: number; label: string }[] = []
    for (let k = 0; k <= 4; k++) { const v = (rMax * k) / 4; yticks.push({ y: yR(v), label: compact(v) }) }
    const mticks: { y: number; label: string }[] = []
    for (let k = 0; k <= 4; k++) { const v = mMin + ((mMax - mMin) * k) / 4; mticks.push({ y: yM(v), label: compact(v) }) }
    const step = Math.max(1, Math.floor((n - 1) / 5))
    const xticks: { x: number; label: string }[] = []
    for (let i = 0; i < n; i += step) xticks.push({ x: xf(i), label: dShort(slice[i].t) })
    if (!xticks.length || xticks[xticks.length - 1].x < xf(n - 1) - 1) xticks.push({ x: xf(n - 1), label: dShort(slice[n - 1].t) })
    const hi = hoverIdx
    const hv = hi != null && hi >= 0 && hi < n ? { x: xf(hi), ry: yR(rev[hi]), my: yM(mrr[hi]), date: dShort(slice[hi].t), rev: money(rev[hi]), mrr: money(mrr[hi]) } : null
    const gid = 'rg' + Math.random().toString(36).slice(2, 6)
    const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
        const r = e.currentTarget.getBoundingClientRect()
        const fx = (e.clientX - r.left) / r.width
        let idx = Math.round(fx * (n - 1))
        idx = Math.max(0, Math.min(n - 1, idx))
        setHover(idx)
    }
    const onLeave = () => setHover(null)
    const ch: React.ReactNode[] = []
    ch.push(E('defs', { key: 'd' }, E('linearGradient', { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, E('stop', { offset: '0%', stopColor: acc, stopOpacity: 0.32 }), E('stop', { offset: '100%', stopColor: acc, stopOpacity: 0.02 }))))
    yticks.forEach((t, i) => {
        ch.push(E('line', { key: 'g' + i, x1: X0, y1: t.y, x2: X1, y2: t.y, stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }))
        ch.push(E('text', { key: 'yl' + i, x: X0 - 9, y: t.y + 3.5, textAnchor: 'end', fill: '#565d69', fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }, t.label))
    })
    mticks.forEach((t, i) => ch.push(E('text', { key: 'ml' + i, x: X1 + 9, y: t.y + 3.5, textAnchor: 'start', fill: '#4a515d', fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }, t.label)))
    xticks.forEach((t, i) => ch.push(E('text', { key: 'xl' + i, x: t.x, y: Y1 + 22, textAnchor: 'middle', fill: '#565d69', fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }, t.label)))
    ch.push(E('path', { key: 'area', d: area, fill: 'url(#' + gid + ')' }))
    ch.push(E('path', { key: 'rl', d: line, fill: 'none', stroke: acc, strokeWidth: 2.2, strokeLinejoin: 'round', strokeLinecap: 'round' }))
    ch.push(E('path', { key: 'mln', d: mline, fill: 'none', stroke: '#aab6c9', strokeWidth: 1.5, strokeDasharray: '5 4', opacity: 0.85, strokeLinejoin: 'round' }))
    if (hv) {
        ch.push(E('line', { key: 'hv', x1: hv.x, y1: Y0, x2: hv.x, y2: Y1, stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }))
        ch.push(E('circle', { key: 'hcr', cx: hv.x, cy: hv.ry, r: 4, fill: acc, stroke: '#0d0f13', strokeWidth: 2 }))
        ch.push(E('circle', { key: 'hcm', cx: hv.x, cy: hv.my, r: 3.5, fill: '#aab6c9', stroke: '#0d0f13', strokeWidth: 2 }))
        const bw = 150, bh = 72, bx = hv.x > X1 - bw ? hv.x - bw - 12 : hv.x + 12, by = Y0 + 4
        ch.push(E('g', { key: 'tt' },
            E('rect', { x: bx, y: by, width: bw, height: bh, rx: 9, fill: '#15181e', stroke: 'rgba(255,255,255,0.13)', strokeWidth: 1 }),
            E('text', { x: bx + 13, y: by + 21, fill: '#8b93a3', fontSize: 11, fontFamily: "'JetBrains Mono',monospace" }, hv.date),
            E('circle', { cx: bx + 16, cy: by + 38, r: 3.5, fill: acc }),
            E('text', { x: bx + 27, y: by + 41, fill: '#e8ecf4', fontSize: 12.5, fontFamily: "'JetBrains Mono',monospace" }, hv.rev),
            E('circle', { cx: bx + 16, cy: by + 57, r: 3.5, fill: '#aab6c9' }),
            E('text', { x: bx + 27, y: by + 60, fill: '#aab6c9', fontSize: 12.5, fontFamily: "'JetBrains Mono',monospace" }, hv.mrr)))
    }
    return E('svg', { viewBox: '0 0 ' + W + ' ' + H, style: { width: '100%', height: 'auto', display: 'block', cursor: 'crosshair' }, onMouseMove: onMove, onMouseLeave: onLeave }, ch)
}

function buildDonut(segs: { value: number; color: string }[], totalText: string) {
    const cx = 100, cy = 100, rO = 82, rI = 56
    let ang = -Math.PI / 2
    const total = segs.reduce((s, x) => s + x.value, 0) || 1
    const gap = 0.045
    const paths = segs.map((s, i) => {
        const frac = s.value / total
        const a0 = ang + gap / 2, a1 = ang + frac * 2 * Math.PI - gap / 2
        ang += frac * 2 * Math.PI
        const p = (r: number, a: number) => [cx + r * Math.cos(a), cy + r * Math.sin(a)]
        const c0 = p(rO, a0), c1 = p(rO, a1), c2 = p(rI, a1), c3 = p(rI, a0)
        const large = a1 - a0 > Math.PI ? 1 : 0
        const d = 'M' + c0[0].toFixed(2) + ' ' + c0[1].toFixed(2) + ' A' + rO + ' ' + rO + ' 0 ' + large + ' 1 ' + c1[0].toFixed(2) + ' ' + c1[1].toFixed(2) + ' L' + c2[0].toFixed(2) + ' ' + c2[1].toFixed(2) + ' A' + rI + ' ' + rI + ' 0 ' + large + ' 0 ' + c3[0].toFixed(2) + ' ' + c3[1].toFixed(2) + ' Z'
        return E('path', { key: i, d, fill: s.color })
    })
    return E('svg', { viewBox: '0 0 200 200', style: { width: 182, height: 182, display: 'block' } }, paths,
        E('text', { x: 100, y: 95, textAnchor: 'middle', fill: '#f4f6fb', fontSize: 21, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }, totalText),
        E('text', { x: 100, y: 114, textAnchor: 'middle', fill: '#6b7280', fontSize: 9.5, letterSpacing: 1.2, fontFamily: "'Space Grotesk',sans-serif" }, 'TOTAL OPEX'))
}

function buildWaterfall(cur: Agg, acc: string) {
    const W = 1000, H = 300, X0 = 44, X1 = 964, Y0 = 26, Y1 = 250
    const steps: { label: string; val?: number; kind: string }[] = [
        { label: 'Revenue', val: cur.revenue, kind: 'pos' },
        { label: 'Payroll', val: -cur.payroll, kind: 'dec' },
        { label: 'Marketing', val: -cur.marketing, kind: 'dec' },
        { label: 'Infra', val: -cur.infra, kind: 'dec' },
        { label: 'Other Opex', val: -(cur.tooling + cur.office + cur.other), kind: 'dec' },
        { label: 'Net Profit', kind: 'net' },
    ]
    const maxV = cur.revenue * 1.05 || 1
    const yf = (v: number) => Y1 - (v / maxV) * (Y1 - Y0)
    const slotW = (X1 - X0) / steps.length
    const barW = Math.min(86, slotW * 0.5)
    const decColors = ['#5b6472', '#535b69', '#4b5360', '#434a57']
    let cum = 0
    const bars: { x: number; y: number; w: number; h: number; color: string; label: string; val: number; cx: number; top: number }[] = []
    const lvls: number[] = []
    steps.forEach((s, i) => {
        const cxc = X0 + i * slotW + slotW / 2
        const x = cxc - barW / 2
        let top: number, bot: number, color: string, valv: number
        if (s.kind === 'pos') { valv = s.val as number; top = yf(s.val as number); bot = yf(0); color = acc; cum = s.val as number }
        else if (s.kind === 'dec') {
            const before = cum
            cum = cum + (s.val as number)
            top = yf(before); bot = yf(cum)
            if (top > bot) { const t = top; top = bot; bot = t }
            color = decColors[(i - 1) % decColors.length]; valv = s.val as number
        } else { valv = cum; top = yf(Math.max(cum, 0)); bot = yf(Math.min(cum, 0)); color = cum >= 0 ? acc : '#ff6b78' }
        bars.push({ x, y: top, w: barW, h: Math.max(2, bot - top), color, label: s.label, val: valv, cx: cxc, top })
        lvls.push(cum)
    })
    const els: React.ReactNode[] = []
    els.push(E('line', { key: 'base', x1: X0, y1: Y1, x2: X1, y2: Y1, stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }))
    for (let i = 0; i < bars.length - 1; i++) {
        const y = yf(lvls[i])
        els.push(E('line', { key: 'c' + i, x1: bars[i].cx + barW / 2, y1: y, x2: bars[i + 1].cx - barW / 2, y2: y, stroke: 'rgba(255,255,255,0.16)', strokeWidth: 1, strokeDasharray: '3 3' }))
    }
    bars.forEach((b, i) => {
        els.push(E('rect', { key: 'b' + i, x: b.x, y: b.y, width: b.w, height: b.h, rx: 3, fill: b.color }))
        els.push(E('text', { key: 'v' + i, x: b.cx, y: b.top - 9, textAnchor: 'middle', fill: b.color === acc ? acc : '#9aa2b1', fontSize: 11.5, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace" }, (b.val >= 0 ? '+' : '−') + compact(Math.abs(b.val))))
        els.push(E('text', { key: 'l' + i, x: b.cx, y: Y1 + 21, textAnchor: 'middle', fill: '#6b7280', fontSize: 11, fontFamily: "'Space Grotesk',sans-serif" }, b.label))
    })
    return E('svg', { viewBox: '0 0 ' + W + ' ' + H, style: { width: '100%', height: 'auto', display: 'block' } }, els)
}

/* ── aggregation ──────────────────────────────────────────────────────── */
type Agg = {
    revenue: number; payroll: number; marketing: number; infra: number; tooling: number
    office: number; other: number; cashflow: number; churn: number; newMrr: number
    expenses: number; profit: number; mrr: number; customers: number
}
function agg(days: Day[], a: number, b: number): Agg | null {
    if (a < 0 || b < 0 || a > b) return null
    const o: Record<string, number> = { revenue: 0, payroll: 0, marketing: 0, infra: 0, tooling: 0, office: 0, other: 0, cashflow: 0, churn: 0, newMrr: 0 }
    for (let i = a; i <= b; i++) {
        const d = days[i]
        o.revenue += d.revenue; o.payroll += d.payroll; o.marketing += d.marketing; o.infra += d.infra
        o.tooling += d.tooling; o.office += d.office; o.other += d.other; o.cashflow += d.cashflow
        o.churn += d.churnedMrr; o.newMrr += d.newMrr
    }
    o.expenses = o.payroll + o.marketing + o.infra + o.tooling + o.office + o.other
    o.profit = o.revenue - o.expenses
    o.mrr = days[b].mrr
    o.customers = Math.round(days[b].mrr / 240)
    return o as Agg
}

const RANGE_DEFS: [string, string][] = [
    ['last7', 'Last 7d'], ['last30', 'Last 30d'], ['thisMonth', 'This month'],
    ['lastMonth', 'Last month'], ['quarter', 'Quarter'], ['custom', 'Custom'],
]

const ACC = '#3d7dff'

const FinancialOverview: React.FC = () => {
    const { days, N } = useMemo(() => buildData(), [])
    const txnsAll = useMemo(() => buildTxns(days, N), [days, N])

    const [rangeKey, setRangeKey] = useState('last30')
    const [customStart, setCustomStart] = useState('2026-06-01')
    const [customEnd, setCustomEnd] = useState('2026-06-24')
    const [compareOn, setCompareOn] = useState(true)
    const [hoverIdx, setHoverIdx] = useState<number | null>(null)

    const setHover = useCallback((i: number | null) => setHoverIdx((prev) => (i !== prev ? i : prev)), [])
    const setRange = (k: string) => { setRangeKey(k); setHoverIdx(null) }

    /* resolve the active date window from the selected range */
    const { s, e } = useMemo(() => {
        const e0 = N - 1
        let s0: number, e2 = e0
        const key = rangeKey
        if (key === 'last7') s0 = e0 - 6
        else if (key === 'last30') s0 = e0 - 29
        else if (key === 'quarter') s0 = e0 - 89
        else if (key === 'thisMonth') s0 = idxFor(N, 2026, 5, 1)
        else if (key === 'lastMonth') { s0 = idxFor(N, 2026, 4, 1); e2 = idxFor(N, 2026, 4, 31) }
        else if (key === 'custom') {
            let a = idxIso(N, customStart), b = idxIso(N, customEnd)
            if (a == null || b == null) { a = e0 - 29; b = e0 }
            if (a > b) { const t = a; a = b; b = t }
            s0 = a; e2 = b
        } else s0 = e0 - 29
        s0 = Math.max(0, s0)
        return { s: s0, e: e2 }
    }, [rangeKey, customStart, customEnd, N])

    const cur = agg(days, s, e)!
    const len = e - s + 1
    const pe = s - 1
    const ps = pe - len + 1
    const prev = agg(days, ps, pe)
    const slice = days.slice(s, e + 1)

    /* range selector buttons */
    const base = "padding:7px 12px;border-radius:8px;font-size:12.5px;font-weight:500;cursor:pointer;font-family:'Space Grotesk',sans-serif;white-space:nowrap;transition:all .15s"
    const activeStyle: React.CSSProperties = { ...css(base), border: '1px solid ' + hexA(ACC, 0.5), background: hexA(ACC, 0.16), color: '#dfe7ff' }
    const idleStyle: React.CSSProperties = { ...css(base), border: '1px solid transparent', background: 'transparent', color: '#8b93a3' }

    /* KPI cards */
    const defs = [
        { label: 'Net Revenue', cur: cur.revenue, prev: prev && prev.revenue, key: 'revenue', up: true },
        { label: 'MRR', cur: cur.mrr, prev: prev && prev.mrr, key: 'mrr', up: true },
        { label: 'Net Profit', cur: cur.profit, prev: prev && prev.profit, key: 'profit', up: true },
        { label: 'Total Expenses', cur: cur.expenses, prev: prev && prev.expenses, key: 'expenses', up: false },
        { label: 'Cash Flow', cur: cur.cashflow, prev: prev && prev.cashflow, key: 'cashflow', up: true },
        { label: 'Churned MRR', cur: cur.churn, prev: prev && prev.churn, key: 'churnedMrr', up: false },
    ] as const
    const kpis = defs.map((df) => {
        const dl = df.prev != null && df.prev !== 0 ? (df.cur - df.prev) / Math.abs(df.prev) : null
        const dir = dl == null ? 0 : dl > 0 ? 1 : dl < 0 ? -1 : 0
        const good = dir === 0 ? null : df.up ? dir > 0 : dir < 0
        const arrow = dir > 0 ? '▲' : dir < 0 ? '▼' : '•'
        const cc = good === null ? '#7c8597' : good ? ACC : '#ff6b78'
        const cbg = good === null ? 'rgba(255,255,255,0.05)' : good ? hexA(ACC, 0.13) : 'rgba(255,107,120,0.13)'
        const chipStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10.5, fontWeight: 600, fontFamily: "'JetBrains Mono',monospace", padding: '3px 7px', borderRadius: 6, color: cc, background: cbg }
        const sparkColor = df.up ? ACC : '#7c8597'
        const vals = slice.map((d) => d[df.key as keyof Day] as number)
        return { label: df.label, value: money(df.cur), arrow, deltaText: pct(dl), chipStyle, sparkEl: buildSpark(vals, sparkColor), prevText: 'prev ' + compact(df.prev || 0) }
    })

    /* secondary stat band */
    const grossM = ((cur.revenue - (cur.infra + cur.tooling)) / cur.revenue) * 100
    const arpu = cur.mrr / (cur.customers || 1)
    const mrrStart = days[s - 1] ? days[s - 1].mrr : slice[0].mrr
    const expansion = cur.newMrr * 0.35
    const nrr = ((mrrStart - cur.churn + expansion) / (mrrStart || 1)) * 100
    const custDelta = prev ? cur.customers - prev.customers : null
    const secondary = [
        { label: 'Active Customers', value: cur.customers.toLocaleString('en-US'), sub: custDelta != null ? (custDelta >= 0 ? '+' : '') + custDelta : '' },
        { label: 'ARPU', value: money(arpu), sub: '/ mo' },
        { label: 'Gross Margin', value: grossM.toFixed(1) + '%', sub: '' },
        { label: 'Net Revenue Retention', value: nrr.toFixed(0) + '%', sub: nrr >= 100 ? 'healthy' : 'watch' },
    ]

    /* expense donut */
    const segDefs: [string, number, string][] = [
        ['Payroll', cur.payroll, ACC], ['Marketing', cur.marketing, '#6f9bff'], ['Infrastructure', cur.infra, '#9bb8ff'],
        ['Tooling & SaaS', cur.tooling, '#ccd8f2'], ['Office', cur.office, '#5b6472'], ['Other', cur.other, '#3a414e'],
    ]
    const segTotal = segDefs.reduce((a, x) => a + x[1], 0) || 1
    const donutSegments = segDefs.map((d) => ({
        label: d[0], color: d[2], value: d[1], valueText: compact(d[1]), pctText: ((d[1] / segTotal) * 100).toFixed(1) + '%',
        dotStyle: { width: 9, height: 9, borderRadius: 3, background: d[2], flexShrink: 0, display: 'inline-block' } as React.CSSProperties,
    }))
    const donutChart = buildDonut(donutSegments.map((x) => ({ value: x.value, color: x.color })), compact(segTotal))
    const waterfallChart = buildWaterfall(cur, ACC)
    const revenueChart = buildRevenue(slice, ACC, hoverIdx, setHover)

    /* transactions table */
    const pool = txnsAll.filter((t) => t.idx >= s && t.idx <= e).sort((a, b) => b.idx - a.idx).slice(0, 12)
    const txns = pool.map((t) => {
        const ok = t.status === 'Completed', pend = t.status === 'Pending'
        const bg = ok ? hexA(ACC, 0.13) : pend ? 'rgba(234,179,8,0.14)' : 'rgba(255,107,120,0.14)'
        const col = ok ? ACC : pend ? '#e9c46a' : '#ff6b78'
        return {
            date: dShort(t.t), desc: t.desc, sub: t.sub, cat: t.cat,
            amountText: (t.inflow ? '+' : '−') + money(Math.abs(t.amount)),
            amtStyle: { fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 600, color: t.inflow ? '#e8ecf4' : '#9aa2b1', textAlign: 'right' } as React.CSSProperties,
            status: t.status,
            badgeStyle: { fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: bg, color: col, fontFamily: "'Space Grotesk',sans-serif", whiteSpace: 'nowrap' } as React.CSSProperties,
        }
    })

    const compareStyle: React.CSSProperties = { ...css(base), padding: '7px 13px', borderRadius: 9, border: '1px solid ' + (compareOn ? hexA(ACC, 0.4) : 'rgba(255,255,255,0.1)'), background: compareOn ? hexA(ACC, 0.12) : 'transparent', color: compareOn ? '#dfe7ff' : '#8b93a3' }

    const rangeLabel = dFull(slice[0].t) + ' – ' + dFull(slice[slice.length - 1].t)
    const updatedText = dShort(TODAY) + ', 2026'
    const revCurrent = money(slice[slice.length - 1].revenue)
    const mrrCurrent = money(slice[slice.length - 1].mrr)
    const showCustom = rangeKey === 'custom'
    const txnCount = txns.length

    return (
        <div style={{ fontFamily: "'Space Grotesk',system-ui,sans-serif", color: '#e8ecf4', background: '#060708', WebkitFontSmoothing: 'antialiased' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');
                .ns-scroll::-webkit-scrollbar{width:8px;height:8px;}
                .ns-scroll::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:4px;}
                .ns-scroll::-webkit-scrollbar-track{background:transparent;}
                .fo-root input[type=date]::-webkit-calendar-picker-indicator{filter:invert(0.7);cursor:pointer;}
                @media (max-width:1100px){
                    .fo-grid-6{grid-template-columns:repeat(3,1fr)!important;}
                    .fo-grid-main{grid-template-columns:1fr!important;}
                    .fo-grid-bottom{grid-template-columns:1fr!important;}
                }
                @media (max-width:720px){
                    .fo-root{padding:18px 14px 48px!important;}
                    .fo-grid-4{grid-template-columns:repeat(2,1fr)!important;}
                    .fo-grid-6{grid-template-columns:repeat(2,1fr)!important;}
                }
            `}</style>

            <div className="fo-root" style={css('min-height:100vh;background:radial-gradient(1300px 520px at 72% -12%, rgba(61,125,255,0.09), transparent 58%);padding:26px 30px 64px')}>
                <div style={css('max-width:1500px;margin:0 auto')}>

                    {/* top bar */}
                    <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:28px')}>
                        <div style={css('display:flex;align-items:center;gap:12px')}>
                            <svg width="27" height="27" viewBox="0 0 24 24"><path d="M12 2 L20 12 L12 22 L4 12 Z" fill={ACC} /><path d="M12 7.5 L16 12 L12 16.5 L8 12 Z" fill="#070809" /></svg>
                            <div style={css('display:flex;flex-direction:column;line-height:1.12')}>
                                <span style={css('font-size:15px;font-weight:600;letter-spacing:-0.01em')}>Northstar</span>
                                <span style={css('font-size:10px;color:#6b7280;font-weight:500;letter-spacing:0.1em;text-transform:uppercase')}>Revenue Intelligence</span>
                            </div>
                        </div>
                        <div style={css('display:flex;align-items:center;gap:14px')}>
                            <button style={css("display:flex;align-items:center;gap:7px;padding:8px 14px;background:#0d0f13;border:1px solid rgba(255,255,255,0.09);border-radius:9px;color:#cdd5e3;font-size:12.5px;font-weight:500;cursor:pointer;font-family:'Space Grotesk',sans-serif")}>↓&nbsp; Export report</button>
                            <div style={css('display:flex;align-items:center;gap:9px;padding:5px 13px 5px 5px;background:#0d0f13;border:1px solid rgba(255,255,255,0.07);border-radius:30px')}>
                                <div style={css('width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#27313f,#0e1116);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:600;color:#cdd9f5')}>AC</div>
                                <div style={css('display:flex;flex-direction:column;line-height:1.15')}>
                                    <span style={css('font-size:12.5px;font-weight:500')}>Ava Chen</span>
                                    <span style={css('font-size:10px;color:#6b7280')}>Finance Lead</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* title + range controls */}
                    <div style={css('display:flex;align-items:flex-end;justify-content:space-between;gap:22px;flex-wrap:wrap;margin-bottom:18px')}>
                        <div>
                            <h1 style={css('margin:0;font-size:28px;font-weight:600;letter-spacing:-0.025em')}>Financial Overview</h1>
                            <div style={css("margin-top:7px;font-size:12.5px;color:#8b93a3;font-family:'JetBrains Mono',monospace")}>{rangeLabel} <span style={css('color:#454c58')}>·</span> Updated {updatedText}</div>
                        </div>
                        <div style={css('display:flex;align-items:center;gap:10px;flex-wrap:wrap')}>
                            <div style={css('display:flex;gap:4px;background:#0d0f13;border:1px solid rgba(255,255,255,0.07);border-radius:11px;padding:4px')}>
                                {RANGE_DEFS.map(([k, label]) => (
                                    <button key={k} onClick={() => setRange(k)} style={k === rangeKey ? activeStyle : idleStyle}>{label}</button>
                                ))}
                            </div>
                            <button onClick={() => setCompareOn((v) => !v)} style={compareStyle}>{compareOn ? 'Comparing vs prev.' : 'Compare period'}</button>
                        </div>
                    </div>

                    {/* custom range */}
                    {showCustom && (
                        <div style={css('display:flex;align-items:center;gap:11px;margin:0 0 18px;padding:12px 16px;background:#0b0d11;border:1px solid rgba(61,125,255,0.18);border-radius:11px')}>
                            <span style={css('font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#7c8597;font-weight:500')}>Custom range</span>
                            <input type="date" value={customStart} min={iso(START)} max={iso(TODAY)} onChange={(ev) => { setCustomStart(ev.target.value); setRangeKey('custom'); setHoverIdx(null) }} style={css("background:#11141a;border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#e8ecf4;padding:6px 10px;font-family:'JetBrains Mono',monospace;font-size:12px;color-scheme:dark;outline:none")} />
                            <span style={css('color:#6b7280')}>→</span>
                            <input type="date" value={customEnd} min={iso(START)} max={iso(TODAY)} onChange={(ev) => { setCustomEnd(ev.target.value); setRangeKey('custom'); setHoverIdx(null) }} style={css("background:#11141a;border:1px solid rgba(255,255,255,0.12);border-radius:8px;color:#e8ecf4;padding:6px 10px;font-family:'JetBrains Mono',monospace;font-size:12px;color-scheme:dark;outline:none")} />
                        </div>
                    )}

                    {/* secondary stat band */}
                    <div className="fo-grid-4" style={css('display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.07);border-radius:13px;overflow:hidden;margin-bottom:16px')}>
                        {secondary.map((sx) => (
                            <div key={sx.label} style={css('background:#0b0d11;padding:15px 19px;display:flex;flex-direction:column;gap:6px')}>
                                <span style={css('font-size:10px;text-transform:uppercase;letter-spacing:0.09em;color:#6b7280;font-weight:500')}>{sx.label}</span>
                                <div style={css('display:flex;align-items:baseline;gap:8px')}>
                                    <span style={css("font-family:'JetBrains Mono',monospace;font-size:20px;font-weight:600;letter-spacing:-0.01em;color:#f4f6fb")}>{sx.value}</span>
                                    <span style={css("font-size:11px;color:#6b7280;font-family:'JetBrains Mono',monospace")}>{sx.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* KPI grid */}
                    <div className="fo-grid-6" style={css('display:grid;grid-template-columns:repeat(6,1fr);gap:13px;margin-bottom:13px')}>
                        {kpis.map((k) => (
                            <div key={k.label} style={css('background:#0d0f13;border:1px solid rgba(255,255,255,0.07);border-radius:14px;padding:16px 16px 13px;display:flex;flex-direction:column;gap:11px;min-height:152px')}>
                                <div style={css('display:flex;align-items:flex-start;justify-content:space-between;gap:8px')}>
                                    <span style={css('font-size:10.5px;text-transform:uppercase;letter-spacing:0.06em;color:#7c8597;font-weight:500')}>{k.label}</span>
                                    {compareOn && <span style={k.chipStyle}>{k.arrow} {k.deltaText}</span>}
                                </div>
                                <div style={css("font-family:'JetBrains Mono',monospace;font-size:23px;font-weight:600;letter-spacing:-0.025em;color:#f4f6fb")}>{k.value}</div>
                                <div style={css('margin-top:auto')}>{k.sparkEl}</div>
                                {compareOn && <div style={css("font-size:10px;color:#565d69;font-family:'JetBrains Mono',monospace")}>{k.prevText}</div>}
                            </div>
                        ))}
                    </div>

                    {/* revenue + expense */}
                    <div className="fo-grid-main" style={css('display:grid;grid-template-columns:1.55fr 1fr;gap:13px;margin-bottom:13px')}>
                        <div style={css('background:#0d0f13;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px 20px 14px')}>
                            <div style={css('display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px')}>
                                <div style={css('display:flex;flex-direction:column;gap:2px')}>
                                    <span style={css('font-size:14px;font-weight:600;color:#f4f6fb')}>Revenue &amp; MRR</span>
                                    <span style={css('font-size:11px;color:#6b7280')}>Daily revenue against monthly recurring revenue</span>
                                </div>
                                <div style={css('display:flex;gap:16px;align-items:center')}>
                                    <div style={css('display:flex;align-items:center;gap:6px')}><span style={{ width: 8, height: 8, borderRadius: 2, background: ACC, display: 'inline-block' }} /><span style={css('font-size:11px;color:#9aa2b1')}>Revenue</span><span style={css("font-size:11.5px;font-family:'JetBrains Mono',monospace;color:#e8ecf4")}>{revCurrent}</span></div>
                                    <div style={css('display:flex;align-items:center;gap:6px')}><span style={{ width: 8, height: 8, borderRadius: 2, background: '#aab6c9', display: 'inline-block' }} /><span style={css('font-size:11px;color:#9aa2b1')}>MRR</span><span style={css("font-size:11.5px;font-family:'JetBrains Mono',monospace;color:#e8ecf4")}>{mrrCurrent}</span></div>
                                </div>
                            </div>
                            <div style={css('margin-top:8px')}>{revenueChart}</div>
                        </div>

                        <div style={css('background:#0d0f13;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px')}>
                            <div style={css('display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:4px')}>
                                <div style={css('display:flex;flex-direction:column;gap:2px')}>
                                    <span style={css('font-size:14px;font-weight:600;color:#f4f6fb')}>Expense Breakdown</span>
                                    <span style={css('font-size:11px;color:#6b7280')}>By category, selected period</span>
                                </div>
                            </div>
                            <div style={css('display:flex;align-items:center;gap:16px;margin-top:8px')}>
                                <div style={css('flex-shrink:0')}>{donutChart}</div>
                                <div style={css('display:flex;flex-direction:column;gap:9px;flex:1;min-width:0')}>
                                    {donutSegments.map((g) => (
                                        <div key={g.label} style={css('display:flex;align-items:center;gap:9px')}>
                                            <span style={g.dotStyle} />
                                            <span style={css('font-size:12px;color:#cdd5e3;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{g.label}</span>
                                            <span style={css("font-size:12px;font-family:'JetBrains Mono',monospace;color:#e8ecf4")}>{g.valueText}</span>
                                            <span style={css("font-size:10.5px;font-family:'JetBrains Mono',monospace;color:#6b7280;width:42px;text-align:right")}>{g.pctText}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* waterfall + transactions */}
                    <div className="fo-grid-bottom" style={css('display:grid;grid-template-columns:1fr 1.28fr;gap:13px')}>
                        <div style={css('background:#0d0f13;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px')}>
                            <div style={css('display:flex;flex-direction:column;gap:2px;margin-bottom:6px')}>
                                <span style={css('font-size:14px;font-weight:600;color:#f4f6fb')}>Profit &amp; Loss Waterfall</span>
                                <span style={css('font-size:11px;color:#6b7280')}>Revenue to net profit, selected period</span>
                            </div>
                            <div style={css('margin-top:8px')}>{waterfallChart}</div>
                        </div>

                        <div style={css('background:#0d0f13;border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:20px 20px 8px;display:flex;flex-direction:column')}>
                            <div style={css('display:flex;align-items:center;justify-content:space-between;margin-bottom:12px')}>
                                <div style={css('display:flex;flex-direction:column;gap:2px')}>
                                    <span style={css('font-size:14px;font-weight:600;color:#f4f6fb')}>Recent Transactions</span>
                                    <span style={css('font-size:11px;color:#6b7280')}>{txnCount} entries in range</span>
                                </div>
                                <button style={css("font-size:11.5px;color:#8b93a3;background:transparent;border:none;cursor:pointer;font-family:'Space Grotesk',sans-serif")}>View all →</button>
                            </div>
                            <div style={css('display:grid;grid-template-columns:66px 1.5fr 0.9fr 88px 92px;column-gap:10px;gap:0;padding:0 0 9px;border-bottom:1px solid rgba(255,255,255,0.07)')}>
                                <span style={css('font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#565d69;font-weight:500')}>Date</span>
                                <span style={css('font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#565d69;font-weight:500')}>Description</span>
                                <span style={css('font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#565d69;font-weight:500')}>Category</span>
                                <span style={css('font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#565d69;font-weight:500')}>Status</span>
                                <span style={css('font-size:10px;text-transform:uppercase;letter-spacing:0.07em;color:#565d69;font-weight:500;text-align:right')}>Amount</span>
                            </div>
                            <div className="ns-scroll" style={css('overflow-y:auto;max-height:344px;padding-right:8px')}>
                                {txns.map((t, i) => (
                                    <div key={i} style={css('display:grid;grid-template-columns:66px 1.5fr 0.9fr 88px 92px;column-gap:10px;align-items:center;gap:0;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.045)')}>
                                        <span style={css("font-size:11.5px;color:#7c8597;font-family:'JetBrains Mono',monospace")}>{t.date}</span>
                                        <div style={css('display:flex;flex-direction:column;gap:1px;min-width:0;padding-right:10px')}>
                                            <span style={css('font-size:12.5px;font-weight:500;color:#e8ecf4;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{t.desc}</span>
                                            <span style={css('font-size:10.5px;color:#565d69;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')}>{t.sub}</span>
                                        </div>
                                        <span style={css('font-size:11.5px;color:#8b93a3')}>{t.cat}</span>
                                        <div><span style={t.badgeStyle}>{t.status}</span></div>
                                        <span style={t.amtStyle}>{t.amountText}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default FinancialOverview
