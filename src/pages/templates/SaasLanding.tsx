import React, { useEffect, useRef, useState } from 'react'
import {
    Zap, Crown, Rocket, ArrowRight, Activity, Bell, PlayCircle,
    Code2, BarChart3, Sparkles, Quote,
} from 'lucide-react'

import MeteorShower from '@/components/heliokit/meteor-shower/MeteorShower'
import { CrystalText } from '@/components/heliokit/crystal-text/CrystalText'
import TextReflection from '@/components/heliokit/text-reflection/TextReflection'
import { FocusHighlight } from '@/components/heliokit/focus-highlight/FocusHighlight'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/heliokit/accordion/Accordion'
import { PricingCard } from '@/components/heliokit/brutal-pricing/Pricing'

const MONO = '#e0e0e0'

/* Icons are passed as components (lucide-react or your own) so custom data can
 * bring its own glyphs. */
type IconType = React.ComponentType<{ size?: number; className?: string }>

export type Stat = { figure: string; label: string }
export type Feature = { icon: IconType; title: string; body: string }
export type Spotlight = { eyebrow: string; title: string; body: string; bullets: string[]; bars: number[] }
export type Step = { icon: IconType; title: string; body: string }
export type Testimonial = { quote: string; name: string; role: string }
export type PricingTier = {
    name: string; price: string; period: string; description: string
    features: string[]; cta: string; icon: IconType
    variant: 'light' | 'dark'; hoverColor: 'blue' | 'green' | 'pink'; popular?: boolean
}
/** A single FAQ entry: `[question, answer]`. */
export type FaqItem = [string, string]

const DEFAULT_NAV = ['Product', 'Features', 'Pricing', 'Docs', 'Changelog']

const DEFAULT_LOGOS = ['Northwind', 'Acme Co', 'Lumen', 'Forge', 'Cobalt', 'Vertex']

const DEFAULT_STATS: Stat[] = [
    { figure: '120M+', label: 'Events tracked daily' },
    { figure: '12K+', label: 'Product teams onboard' },
    { figure: '99.9%', label: 'Uptime SLA' },
    { figure: '40+', label: 'Native integrations' },
]

const DEFAULT_FEATURES: Feature[] = [
    { icon: Activity, title: 'Realtime funnels', body: 'Watch users move through your product as it happens. Spot drop-off the moment it starts, not a day later.' },
    { icon: PlayCircle, title: 'Session replay', body: 'Replay any session to see exactly what a user saw and clicked. Jump straight from a funnel step to the moment.' },
    { icon: Bell, title: 'Smart alerts', body: 'Get pinged in Slack the second a metric breaks its baseline. Anomaly detection runs on every event stream.' },
]

const DEFAULT_SPOTLIGHTS: Spotlight[] = [
    {
        eyebrow: 'Dashboards',
        title: 'Every metric, one canvas',
        body: 'Build dashboards from any event without SQL. Drag a chart, pick a metric, share a link. Your whole team reads the same numbers.',
        bullets: ['No-code chart builder', 'Shareable read-only links', 'Auto-refreshing tiles'],
        bars: [62, 88, 40, 95, 71, 54],
    },
    {
        eyebrow: 'Cohorts',
        title: 'Find the users that matter',
        body: 'Slice any audience by behaviour, then track how each cohort retains over time. Export to your warehouse or sync to your CRM in a click.',
        bullets: ['Behavioural cohorts', 'Retention curves', 'Reverse-ETL sync'],
        bars: [30, 45, 58, 66, 73, 80],
    },
]

const DEFAULT_STEPS: Step[] = [
    { icon: Code2, title: 'Drop in the SDK', body: 'One snippet. Web, mobile, or server — install in under five minutes.' },
    { icon: BarChart3, title: 'See events flow', body: 'Your live event stream appears instantly. No schema setup, no waiting.' },
    { icon: Sparkles, title: 'Act on insight', body: 'Build funnels, set alerts, and ship the fix before churn happens.' },
]

const DEFAULT_TESTIMONIALS: Testimonial[] = [
    { quote: 'Pulse replaced three tools and a weekly export script. We catch drop-off the same day it happens now.', name: 'Maya Reyes', role: 'Head of Growth, Lumen' },
    { quote: 'Set up in an afternoon. Session replay alone paid for the whole plan in the first week.', name: 'Daniel Okafor', role: 'Founder, Forge' },
    { quote: 'The Slack alerts are uncanny. It flagged a checkout regression before our on-call did.', name: 'Priya Nair', role: 'Staff Eng, Vertex' },
]

const DEFAULT_PRICING: PricingTier[] = [
    {
        name: 'HOBBY', price: '$0', period: '/FOREVER', description: 'FOR SIDE PROJECTS',
        features: ['10K EVENTS / MONTH', '1 PROJECT', '7-DAY RETENTION', 'COMMUNITY SUPPORT'],
        cta: 'START FREE', icon: Zap, variant: 'light' as const, hoverColor: 'blue' as const,
    },
    {
        name: 'GROWTH', price: '$79', period: '/MONTH', description: 'FOR SCALING TEAMS',
        features: ['1M EVENTS / MONTH', 'UNLIMITED PROJECTS', '1-YEAR RETENTION', 'SLACK ALERTS', 'SESSION REPLAY'],
        cta: 'START TRIAL', icon: Crown, variant: 'dark' as const, hoverColor: 'green' as const, popular: true,
    },
    {
        name: 'SCALE', price: '$299', period: '/MONTH', description: 'FOR ORGANISATIONS',
        features: ['UNLIMITED EVENTS', 'SSO + SAML', 'DATA WAREHOUSE EXPORT', 'DEDICATED SUPPORT', 'CUSTOM SLA'],
        cta: 'CONTACT SALES', icon: Rocket, variant: 'light' as const, hoverColor: 'pink' as const,
    },
]

const DEFAULT_FAQ: FaqItem[] = [
    ['How long does setup take?', 'Most teams are sending events within five minutes. Drop the SDK snippet into your app and your live stream appears immediately — no schema or warehouse setup required.'],
    ['Do you sample my data?', 'No. Every plan ingests 100% of your events. Funnels, replays, and alerts run on the full stream, so your numbers are never estimates.'],
    ['Can I export my data?', 'Yes. Growth and Scale plans include reverse-ETL sync and a one-click warehouse export to Snowflake, BigQuery, or Postgres.'],
    ['Is Pulse GDPR compliant?', 'Yes. Data is encrypted in transit and at rest, hosted in your chosen region, and we sign a DPA on request. PII can be masked at the SDK level.'],
    ['What counts as an event?', 'Any tracked action — a pageview, click, or custom event. Identify calls and session metadata are free and never count against your limit.'],
]

/* A tiny faux chart so spotlight rows have a real-looking product visual. */
const MockChart = ({ bars }: { bars: number[] }) => (
    <div className="rounded-2xl border border-border-primary bg-text-primary/[0.03] p-6">
        <div className="mb-4 flex items-center justify-between">
            <span className="font-navbar text-xs uppercase tracking-[0.2em] text-text-primary/40">Weekly active</span>
            <span className="rounded-md border border-border-primary px-2 py-0.5 text-[11px] text-text-primary/50">Live</span>
        </div>
        <div className="flex h-40 items-end gap-3">
            {bars.map((h, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-text-primary/15 to-text-primary/45" style={{ height: `${h}%` }} />
            ))}
        </div>
    </div>
)

/**
 * SaaS Landing template — a full marketing page for a fictional product
 * analytics tool ("Pulse"), assembled from HelioKit components: Meteor Shower,
 * Crystal Text, Counter, Focus Highlight, Brutal Pricing, Accordion, and
 * Text Reflection.
 */
export type SaasLandingData = {
    /** Any field omitted falls back to the built-in "Pulse" demo content. */
    nav?: string[]
    logos?: string[]
    stats?: Stat[]
    features?: Feature[]
    spotlights?: Spotlight[]
    steps?: Step[]
    testimonials?: Testimonial[]
    pricing?: PricingTier[]
    faq?: FaqItem[]
}

export type SaasLandingProps = {
    /** Feed your own marketing copy. Omit (or omit a field) for the demo content. */
    data?: SaasLandingData
}

const SaasLanding: React.FC<SaasLandingProps> = ({ data }) => {
    /* Props drive every section; each falls back to the demo content when omitted,
     * so <SaasLanding /> with no props still renders the full showcase page. */
    const NAV = data?.nav ?? DEFAULT_NAV
    const LOGOS = data?.logos ?? DEFAULT_LOGOS
    const STATS = data?.stats ?? DEFAULT_STATS
    const FEATURES = data?.features ?? DEFAULT_FEATURES
    const SPOTLIGHTS = data?.spotlights ?? DEFAULT_SPOTLIGHTS
    const STEPS = data?.steps ?? DEFAULT_STEPS
    const TESTIMONIALS = data?.testimonials ?? DEFAULT_TESTIMONIALS
    const PRICING = data?.pricing ?? DEFAULT_PRICING
    const FAQ = data?.faq ?? DEFAULT_FAQ

    // MeteorShower runs an unconditional RAF (canvas shadowBlur = expensive). Pause
    // it by unmounting once the hero scrolls out of view, so the long page below
    // stays smooth. Mirrors the gating on the Components page.
    const heroRef = useRef<HTMLElement>(null)
    const [heroVisible, setHeroVisible] = useState(true)
    useEffect(() => {
        const el = heroRef.current
        if (!el) return
        const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { rootMargin: '120px' })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <div className="font-primary text-text-primary">
            {/* ── Hero ─────────────────────────────────────────────────────── */}
            <section ref={heroRef} className="relative w-full overflow-hidden border-b border-border-primary">
                {heroVisible && <MeteorShower accentColor={MONO} starDensity={2.4} meteorOpacity={0.3} />}
                <div
                    className="absolute inset-0 z-[1]"
                    style={{ background: 'radial-gradient(65% 60% at 50% 42%, rgba(1,1,1,0.7) 0%, rgba(1,1,1,0.2) 55%, rgba(1,1,1,0) 100%)' }}
                />

                <div className="relative z-10">
                    {/* page nav (static — the sticky template bar sits above it) */}
                    <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
                        <span className="font-logo text-xl tracking-wide">PULSE</span>
                        <div className="hidden items-center gap-7 font-navbar text-sm text-text-primary/70 md:flex">
                            {NAV.map((n) => (
                                <span key={n} className="cursor-pointer transition hover:text-text-primary">{n}</span>
                            ))}
                        </div>
                        <button className="rounded-lg border border-border-primary px-4 py-2 font-navbar text-sm text-text-primary/80 transition hover:bg-text-primary/5">
                            Sign in
                        </button>
                    </nav>

                    <div className="flex min-h-[78vh] flex-col items-center justify-center px-6 pb-24 pt-10 text-center">
                        <span className="mb-6 rounded-full border border-border-primary px-4 py-1.5 font-navbar text-xs uppercase tracking-[0.22em] text-text-primary/60">
                            Product analytics, in realtime
                        </span>
                        <div className="w-full max-w-3xl">
                            <CrystalText text="pulse" height={300} />
                        </div>
                        <p className="mt-6 max-w-xl font-heading text-base text-text-primary/75 md:text-lg">
                            See every user action the moment it happens. Funnels, session replay, and anomaly
                            alerts on 100% of your events — no sampling, no SQL.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                            <button className="flex items-center gap-2 rounded-lg bg-text-primary px-6 py-3 font-navbar text-sm font-medium text-background-primary transition hover:opacity-90">
                                Start free <ArrowRight size={16} />
                            </button>
                            <button className="rounded-lg border border-border-primary px-6 py-3 font-navbar text-sm text-text-primary/80 transition hover:bg-text-primary/5">
                                Book a demo
                            </button>
                        </div>
                        <p className="mt-4 text-xs text-text-primary/40">No credit card · 10K events free every month</p>
                    </div>
                </div>
            </section>

            {/* ── Logo cloud ───────────────────────────────────────────────── */}
            <section className="border-b border-border-primary px-6 py-12">
                <p className="mb-8 text-center font-navbar text-xs uppercase tracking-[0.24em] text-text-primary/40">
                    Trusted by product teams at
                </p>
                <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-6">
                    {LOGOS.map((l) => (
                        <span key={l} className="font-heading text-xl font-semibold text-text-primary/35 transition hover:text-text-primary/70">
                            {l}
                        </span>
                    ))}
                </div>
            </section>

            {/* ── Stats ────────────────────────────────────────────────────── */}
            <section className="border-b border-border-primary px-6 py-20">
                <div className="mx-auto grid max-w-5xl grid-cols-2 gap-y-10 md:grid-cols-4">
                    {STATS.map((s) => (
                        <div key={s.label} className="flex flex-col items-center gap-2 text-center">
                            <span className="font-heading text-4xl font-bold tracking-tight text-text-primary md:text-5xl">{s.figure}</span>
                            <span className="text-sm text-text-primary/55">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ─────────────────────────────────────────────────── */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <div className="mb-12 text-center">
                    <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">Features</span>
                    <h2 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">Built for teams that move fast</h2>
                    <p className="mx-auto mt-3 max-w-xl text-text-primary/60">
                        Everything you need to understand your product — and nothing you don't.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {FEATURES.map(({ icon: Icon, title, body }) => (
                        <FocusHighlight.Root
                            key={title}
                            className="rounded-xl"
                            accentColor={MONO}
                            borderColor="rgba(224,224,224,0.7)"
                            glowColor="rgba(224,224,224,0.16)"
                            triggerOnHover
                            ariaLabel={`${title} card`}
                        >
                            <div className="flex h-full flex-col rounded-xl border border-border-primary p-6">
                                <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border-primary text-text-primary/80">
                                    <Icon size={20} />
                                </span>
                                <h3 className="font-heading text-lg font-semibold">{title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-text-primary/60">{body}</p>
                            </div>
                        </FocusHighlight.Root>
                    ))}
                </div>
            </section>

            {/* ── Spotlight rows ───────────────────────────────────────────── */}
            <section className="border-y border-border-primary bg-text-primary/[0.02]">
                <div className="mx-auto max-w-6xl px-6 py-24">
                    <div className="flex flex-col gap-24">
                        {SPOTLIGHTS.map((sp, i) => (
                            <div key={sp.title} className={`grid items-center gap-12 md:grid-cols-2 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                                <div>
                                    <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">{sp.eyebrow}</span>
                                    <h3 className="mt-2 font-heading text-2xl font-semibold md:text-3xl">{sp.title}</h3>
                                    <p className="mt-4 max-w-md leading-relaxed text-text-primary/60">{sp.body}</p>
                                    <ul className="mt-6 space-y-3">
                                        {sp.bullets.map((b) => (
                                            <li key={b} className="flex items-center gap-3 text-sm text-text-primary/75">
                                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border-primary text-[10px]">✓</span>
                                                {b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <MockChart bars={sp.bars} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ─────────────────────────────────────────────── */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <div className="mb-12 text-center">
                    <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">How it works</span>
                    <h2 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">Live in three steps</h2>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    {STEPS.map(({ icon: Icon, title, body }, i) => (
                        <div key={title} className="relative rounded-xl border border-border-primary p-6">
                            <span className="absolute -top-3 left-6 rounded-md bg-background-primary px-2 font-navbar text-xs uppercase tracking-wide text-text-primary/40">
                                Step {i + 1}
                            </span>
                            <Icon size={22} className="text-text-primary/80" />
                            <h3 className="mt-4 font-heading text-lg font-semibold">{title}</h3>
                            <p className="mt-2 text-sm leading-relaxed text-text-primary/60">{body}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Testimonials ─────────────────────────────────────────────── */}
            <section className="border-y border-border-primary bg-text-primary/[0.02] px-6 py-24">
                <div className="mx-auto max-w-6xl">
                    <h2 className="mb-12 text-center font-heading text-3xl font-semibold md:text-4xl">Teams ship faster on Pulse</h2>
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {TESTIMONIALS.map((t) => (
                            <div key={t.name} className="flex flex-col rounded-xl border border-border-primary p-6">
                                <Quote size={20} className="text-text-primary/30" />
                                <p className="mt-4 flex-1 text-sm leading-relaxed text-text-primary/75">"{t.quote}"</p>
                                <div className="mt-6">
                                    <div className="font-heading text-sm font-semibold">{t.name}</div>
                                    <div className="text-xs text-text-primary/50">{t.role}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Pricing ──────────────────────────────────────────────────── */}
            <section className="px-6 py-24">
                <div className="mb-12 text-center">
                    <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">Pricing</span>
                    <h2 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">Pricing that scales with you</h2>
                    <p className="mx-auto mt-3 max-w-xl text-text-primary/60">Start free. Upgrade when your event volume does.</p>
                </div>
                <div className="mx-auto grid w-full max-w-5xl grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {PRICING.map((card, i) => (
                        <PricingCard key={card.name} {...card} size="sm" index={i} />
                    ))}
                </div>
            </section>

            {/* ── FAQ ──────────────────────────────────────────────────────── */}
            <section className="mx-auto max-w-3xl px-6 py-24">
                <div className="mb-10 text-center">
                    <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">FAQ</span>
                    <h2 className="mt-2 font-heading text-3xl font-semibold md:text-4xl">Questions, answered</h2>
                </div>
                <Accordion type="single" className="w-full">
                    {FAQ.map(([q, a], i) => (
                        <AccordionItem key={i} value={`faq-${i}`}>
                            <AccordionTrigger>{q}</AccordionTrigger>
                            <AccordionContent>{a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </section>

            {/* ── CTA band ─────────────────────────────────────────────────── */}
            <section className="border-y border-border-primary px-6 py-24 text-center">
                <h2 className="mx-auto max-w-2xl font-heading text-3xl font-semibold md:text-4xl">
                    Start understanding your product today
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-text-primary/60">
                    Free for your first 10K events every month. No credit card, no sales call.
                </p>
                <button className="mt-8 inline-flex items-center gap-2 rounded-lg bg-text-primary px-7 py-3 font-navbar text-sm font-medium text-background-primary transition hover:opacity-90">
                    Get started free <ArrowRight size={16} />
                </button>
            </section>

            {/* ── Footer ───────────────────────────────────────────────────── */}
            <footer className="overflow-hidden">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 md:grid-cols-4">
                    {[
                        ['Product', ['Features', 'Pricing', 'Integrations', 'Changelog']],
                        ['Company', ['About', 'Blog', 'Careers', 'Contact']],
                        ['Resources', ['Docs', 'API', 'Status', 'Community']],
                        ['Legal', ['Privacy', 'Terms', 'DPA', 'Security']],
                    ].map(([head, items]) => (
                        <div key={head as string}>
                            <div className="font-heading text-sm font-semibold">{head as string}</div>
                            <ul className="mt-4 space-y-2">
                                {(items as string[]).map((it) => (
                                    <li key={it} className="cursor-pointer text-sm text-text-primary/55 transition hover:text-text-primary">{it}</li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="flex w-full justify-center overflow-x-hidden pb-20">
                    <TextReflection textData="PULSE" />
                </div>
                <p className="pb-10 text-center text-sm text-text-primary/40">© 2026 Pulse Analytics · Built with HelioKit</p>
            </footer>
        </div>
    )
}

export default SaasLanding
