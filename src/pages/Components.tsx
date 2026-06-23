import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'

import MeteorShower from '@/components/heliokit/meteor-shower/MeteorShower'
import { CrystalText } from '@/components/heliokit/crystal-text/CrystalText'
import TextReflection from '@/components/heliokit/text-reflection/TextReflection'
import { CardStack3D } from '@/components/heliokit/card-stack-3d/CardStack3D'
import type { CardStack3DItem } from '@/components/heliokit/card-stack-3d/CardStack3D'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/heliokit/accordion/Accordion'
import { Marquee, MarqueeTrack, MarqueeWord } from '@/components/heliokit/image-reveal-marquee/Marquee'
import { FocusHighlight } from '@/components/heliokit/focus-highlight/FocusHighlight'

const MONO = '#e0e0e0'
/** Drop screenshots at public/previews/<id>.png — see public/previews/README.md. */
const previewSrc = (id: string) => `/previews/${id}.png`

type Item = { id: string; label: string; blurb: string; tag: string }

const COMPONENTS: Item[] = [
    { id: 'accordion', label: 'Accordion', blurb: 'Collapsible panels with smooth height transitions.', tag: 'Layout' },
    { id: 'brutal-pricing', label: 'Brutal Pricing', blurb: 'Neo-brutalist pricing cards with hard shadows.', tag: 'Marketing' },
    { id: 'card-stack', label: 'Card Stack', blurb: 'Layered cards that shuffle on interaction.', tag: 'Cards' },
    { id: 'card-stack-3d', label: 'Card Stack 3D', blurb: 'Perspective-driven 3D stack with depth and tilt.', tag: 'Cards' },
    { id: 'crystal-text', label: 'Crystal Text', blurb: 'Refracting glass headline that writes itself on.', tag: 'Text' },
    { id: 'toasts', label: 'Custom Toasts', blurb: 'Stackable, dismissible toast notifications.', tag: 'Feedback' },
    { id: 'flip-form', label: 'Flip Form', blurb: 'Form that flips between front and back faces.', tag: 'Forms' },
    { id: 'focus-highlight', label: 'Focus Highlight', blurb: 'Spotlight that follows focused elements.', tag: 'Effects' },
    { id: 'glitch-card', label: 'Glitch Card', blurb: 'RGB-split glitch animation on hover.', tag: 'Cards' },
    { id: 'glossy-dock', label: 'Glossy Dock', blurb: 'macOS-style magnifying icon dock.', tag: 'Navigation' },
    { id: 'image-reveal-marquee', label: 'Image Reveal Marquee', blurb: 'Infinite marquee revealing images on hover.', tag: 'Media' },
    { id: 'meteor-shower', label: 'Meteor Shower', blurb: 'Animated falling-meteor starfield backdrop.', tag: 'Background' },
    { id: 'nebulla-background', label: 'Nebulla Background', blurb: 'Soft animated nebula gradient backdrop.', tag: 'Background' },
    { id: 'pixel-spotlight', label: 'Pixel Spotlight', blurb: 'Pixelated spotlight that decodes an image.', tag: 'Effects' },
    { id: 'product-card', label: 'Product Card', blurb: 'E-commerce card with hover details.', tag: 'Cards' },
    { id: 'social-grid', label: 'Social Grid', blurb: 'Bento-style grid of social links.', tag: 'Layout' },
    { id: 'text-loader', label: 'Text Loader', blurb: 'Animated text-based loading indicator.', tag: 'Feedback' },
    { id: 'text-reflection', label: 'Text Reflection', blurb: 'Headline with a mirrored, fading reflection.', tag: 'Text' },
]

const SectionHeader = ({ eyebrow, title, sub, to }: { eyebrow: string; title: string; sub: string; to?: string }) => (
    <div className="mb-6 flex items-end justify-between gap-4">
        <div>
            <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">{eyebrow}</span>
            <h2 className="mt-1 font-heading text-2xl font-semibold">{title}</h2>
            <p className="mt-1 text-sm text-text-primary/55">{sub}</p>
        </div>
        {to && (
            <Link to={to} className="hidden shrink-0 items-center gap-1 font-navbar text-sm text-text-primary/70 transition hover:text-text-primary sm:flex">
                View <ArrowUpRight size={15} />
            </Link>
        )}
    </div>
)

/** Screenshot thumbnail with a graceful monogram fallback when the file is missing. */
const Preview = ({ id, label, className = '' }: { id: string; label: string; className?: string }) => {
    const [broken, setBroken] = useState(false)
    if (broken) {
        return (
            <div className={`flex items-center justify-center bg-gradient-to-br from-white/[0.07] to-transparent ${className}`}>
                <span className="font-heading text-5xl font-semibold text-text-primary/25">{label.charAt(0)}</span>
            </div>
        )
    }
    return (
        <img
            src={previewSrc(id)}
            alt={`${label} preview`}
            loading="lazy"
            onError={() => setBroken(true)}
            className={`object-cover ${className}`}
        />
    )
}

/**
 * Card face for the 3D stack.
 *  - mode="face": the in-stack visual. No click handler — the stack itself lifts
 *    the card to centre on the first click.
 *  - mode="open": the centred view. Clicking it navigates. The stack disables
 *    pointer events on opened cards, so re-enable them here (pointerEvents auto).
 */
const FeaturedCard = ({ item, mode, onOpen }: { item: Item; mode: 'face' | 'open'; onOpen?: () => void }) => {
    const open = mode === 'open'
    return (
        <div
            onClick={open ? (e) => { e.stopPropagation(); onOpen?.() } : undefined}
            style={open ? { pointerEvents: 'auto' } : undefined}
            className={`flex h-full flex-col font-heading text-text-primary ${open ? 'cursor-pointer' : ''}`}
        >
            <div className="relative h-[60%] w-full overflow-hidden bg-black">
                <Preview id={item.id} label={item.label} className="h-full w-full" />
                <span className="absolute left-3 top-3 rounded-md bg-black/55 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-text-primary/70 backdrop-blur-sm">
                    {item.tag}
                </span>
            </div>
            <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                    <div className="text-2xl font-semibold leading-tight">{item.label}</div>
                    <p className="mt-2 text-sm leading-relaxed text-text-primary/55">{item.blurb}</p>
                </div>
                <div className="mt-3 flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-text-primary/70">
                    {open ? <>View component <ArrowUpRight size={14} /></> : 'Click to expand'}
                </div>
            </div>
        </div>
    )
}

const FAQ: [string, string][] = [
    ['What is HelioKit?', 'A set of copy-paste React + Tailwind components — animated, accessible, and monochrome by default. No install, no lock-in: paste the file and ship.'],
    ['How do I add a component?', 'Open any component, copy the source or run the CLI. Each ships as a single self-contained file with its props documented on its page.'],
    ['Can I restyle them?', 'Yes — every component is plain Tailwind + props. Swap the accent, override classes, or fork the file. Nothing is locked behind a theme.'],
    ['Is it free?', 'Yes — use it in personal and commercial work.'],
]

const Components: React.FC = () => {
    const navigate = useNavigate()
    const go = (id: string) => navigate(`/components/${id}`)

    // Pause the hero's expensive canvases (MeteorShower RAF + CrystalText backdrop-blur)
    // when scrolled out of view, so the rest of the page (marquee) stays smooth.
    const heroRef = useRef<HTMLElement>(null)
    const [heroVisible, setHeroVisible] = useState(true)
    useEffect(() => {
        const el = heroRef.current
        if (!el) return
        const io = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), { rootMargin: '120px' })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    const featuredItems = useMemo(
        () => COMPONENTS.filter((c) => ['pixel-spotlight', 'crystal-text', 'text-loader', 'brutal-pricing', 'social-grid', 'glitch-card'].includes(c.id)),
        [],
    )
    const featured = useMemo<CardStack3DItem[]>(
        () =>
            featuredItems.map((item) => ({
                key: item.id,
                // 1st click lifts the card to centre; 2nd click (on the centred card) navigates.
                face: <FeaturedCard item={item} mode="face" />,
                expanded: <FeaturedCard item={item} mode="open" onOpen={() => go(item.id)} />,
            })),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [featuredItems],
    )

    return (
        <div className="font-primary text-text-primary pb-28">
            {/* ── HERO — fills the center column, CrystalText refracting MeteorShower ─ */}
            <section ref={heroRef} className="relative mt-6 w-full overflow-hidden rounded-2xl border border-border-primary">
                {heroVisible && <MeteorShower accentColor={MONO} starDensity={2.4} meteorOpacity={0.3} />}
                <div
                    className="absolute inset-0 z-[1]"
                    style={{ background: 'radial-gradient(65% 60% at 50% 42%, rgba(1,1,1,0.7) 0%, rgba(1,1,1,0.2) 55%, rgba(1,1,1,0) 100%)' }}
                />
                <div className="relative z-10 flex min-h-[78vh] flex-col items-center justify-center px-6 py-20 text-center">

                    <div className="w-full max-w-3xl">
                        <CrystalText text="heliokit" height={300} />
                    </div>

                    <p className="mt-6 max-w-xl font-heading text-base text-text-primary/75 md:text-lg">
                        Copy-paste React + Tailwind components — animated, accessible, monochrome by default.
                        Everything below is built from them.
                    </p>
                    <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={() => go('accordion')}
                            className="rounded-lg bg-text-primary px-6 py-3 font-navbar text-sm font-medium text-background-primary transition hover:opacity-90"
                        >
                            Browse components
                        </button>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-border-primary px-6 py-3 font-navbar text-sm text-text-primary/80 transition hover:bg-text-primary/5"
                        >
                            GitHub
                        </a>
                    </div>
                </div>
            </section>

            {/* Featured — clickable 3D stack */}
            <section className="mt-24">
                    <SectionHeader
                        eyebrow="Featured"
                        title="Six to start with"
                        sub="Click a card to bring it forward, then click it again to open. Built with Card Stack 3D."
                        to="/components/card-stack-3d"
                    />
                    <div
                        className="relative overflow-hidden rounded-2xl border border-border-primary"
                        style={{ background: 'radial-gradient(130% 95% at 50% 28%, #0c0c0e 0%, #060607 55%, #020203 100%)' }}
                    >
                        <CardStack3D cards={featured} height={560} cardWidth={300} cardHeight={400} openScale={1} />
                    </div>
                </section>

                {/* Showcase — image-reveal marquee of every component */}
                <section className="mt-24">
                    <SectionHeader
                        eyebrow="In motion"
                        title="Hover to peek"
                        sub="Component names scroll by — hover one to reveal its preview. Built with Image Reveal Marquee."
                    />
                    <div className="overflow-x-clip rounded-2xl border border-border-primary py-12">
                        <Marquee direction="left" fontSize="text-7xl" speed={3.5}>
                            <MarqueeTrack>
                                {COMPONENTS.slice(0, 9).map((item) => (
                                    <MarqueeWord key={item.id} text={item.label} image={previewSrc(item.id)} imageWidth={260} imageHeight={160} />
                                ))}
                            </MarqueeTrack>
                        </Marquee>
                        <Marquee direction="right" fontSize="text-7xl" speed={3.5}>
                            <MarqueeTrack className="mt-16">
                                {COMPONENTS.slice(9).map((item) => (
                                    <MarqueeWord key={item.id} text={item.label} image={previewSrc(item.id)} imageWidth={260} imageHeight={160} />
                                ))}
                            </MarqueeTrack>
                        </Marquee>
                    </div>
                </section>

                {/* FAQ — Accordion doing real content work, mono */}
                <section className="mt-24">
                    <SectionHeader
                        eyebrow="Questions"
                        title="Good to know"
                        sub="The list below is the Accordion component, restyled to the theme."
                        to="/components/accordion"
                    />
                    <Accordion type="single" className="w-full">
                        {FAQ.map(([q, a], i) => (
                            <AccordionItem key={i} value={`faq-${i}`}>
                                <AccordionTrigger>{q}</AccordionTrigger>
                                <AccordionContent>{a}</AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </section>

                {/* Index — every component */}
                <section className="mt-24">
                    <SectionHeader eyebrow="Library" title="All components" sub={`Browse all ${COMPONENTS.length}.`} />
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {COMPONENTS.map((item) => (
                            <FocusHighlight.Root
                                key={item.id}
                                className="rounded-xl"
                                accentColor={MONO}
                                borderColor="rgba(224,224,224,0.7)"
                                glowColor="rgba(224,224,224,0.16)"
                                triggerOnHover
                                ariaLabel={`${item.label} card`}
                            >
                                <Link
                                    to={`/components/${item.id}`}
                                    className="group flex h-full flex-col rounded-xl border border-border-primary p-5 transition-colors duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="font-heading text-base font-medium">{item.label}</h3>
                                        <ArrowUpRight size={16} className="text-text-primary/30 transition group-hover:text-text-primary" />
                                    </div>
                                    <p className="mt-1 flex-1 text-sm text-text-primary/55">{item.blurb}</p>
                                    <span className="mt-4 w-fit rounded-md border border-border-primary px-2 py-0.5 text-[11px] uppercase tracking-wide text-text-primary/45">
                                        {item.tag}
                                    </span>
                                </Link>
                            </FocusHighlight.Root>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="mt-24 flex flex-col items-center border-t border-border-primary pt-16 text-center">
                    <div className="flex w-full justify-center overflow-x-hidden pb-28">
                        <TextReflection textData="HELIOKIT" />
                    </div>
                    <p className="text-sm text-text-primary/50">Monochrome components for builders</p>
                </footer>
        </div>
    )
}

export default Components
