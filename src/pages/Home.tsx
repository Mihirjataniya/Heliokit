import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Copy,
  Terminal,
  Palette,
  Sparkles,
  Layers,
  Zap,
  Code2,
  Github,
} from 'lucide-react'
import { MeteorShower } from '@/components/heliokit/meteor-shower/MeteorShower'
import { BoxFlipText } from '@/components/heliokit/box-flip-text/BoxFlipText'
import { CrystalText } from '@/components/heliokit/crystal-text/CrystalText'

/* ------------------------------------------------------------------ *
 * Landing page for HelioKit — a CLI + copy-paste React component lib.
 * The page DOGFOODS the library: the hero background, the flipping
 * headline word and the showcase tiles are all real HelioKit
 * components rendered live.
 * ------------------------------------------------------------------ */

const INSTALL_CMD = 'npx heliokit add meteor-shower'

const COMPONENTS = [
  'meteor-shower', 'crystal-text', 'glitch-card', 'nebula-background',
  'card-stack-3d', 'pixel-spotlight', 'text-reflection', 'glossy-dock',
  'box-flip-text', 'brutal-pricing', 'flip-form', 'focus-highlight',
  'image-reveal-marquee', 'product-card', 'social-grid', 'accordion',
  'text-loader', 'counter', 'flashlight', 'toast',
]

const FEATURES = [
  { icon: Terminal, title: 'One-command install', body: 'npx heliokit add <name> drops the source straight into your repo. No runtime dependency, no lock-in.' },
  { icon: Code2, title: 'You own the code', body: 'Components copy in as plain .tsx. Read them, edit them, delete a prop — yours from the first paste.' },
  { icon: Sparkles, title: 'Motion, built in', body: 'Framer-motion + canvas animations tuned per component, perf-gated so off-screen work stays idle.' },
  { icon: Palette, title: 'Token-driven theming', body: 'Everything reads from CSS variables. Flip a class for light mode or reskin the whole kit in one file.' },
  { icon: Zap, title: 'Tailwind v4 + React 19', body: 'Modern stack out of the box. TypeScript types ship with every component, no @types hunting.' },
  { icon: Layers, title: 'Full-page templates', body: 'Compose the primitives or grab a ready template — SaaS landing, financial overview, kanban board.' },
]

const TEMPLATES = [
  { slug: 'saas-landing-page', name: 'SaaS Landing', desc: 'Hero, pricing, FAQ — six components wired together.' },
  { slug: 'financial-overview', name: 'Financial Overview', desc: 'Dashboard with charts, KPIs and activity feed.' },
  { slug: 'kanban-board', name: 'Kanban Board', desc: 'Monochrome drag-ready board layout.' },
]

const STATS = [
  { value: '20+', label: 'Components' },
  { value: '3', label: 'Templates' },
  { value: 'MIT', label: 'License' },
  { value: '0', label: 'Runtime deps' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

const Home: React.FC = () => {
  const [copied, setCopied] = useState(false)

  const copyInstall = async () => {
    try {
      await navigator.clipboard.writeText(INSTALL_CMD)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — ignore */
    }
  }

  return (
    <main className="relative overflow-x-clip bg-background-primary text-text-primary">
      <PageStyles />

      {/* =========================== HERO =========================== */}
      <section className="relative flex min-h-[92vh] flex-col items-center justify-center overflow-hidden px-4 py-24 text-center">
        {/* live component: animated canvas background */}
        <MeteorShower accentColor="#8b8bff" asteroidFrequency={4} meteorOpacity={0.4} starDensity={3} />
        {/* legibility gradient over the canvas */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background-primary/40 via-background-primary/20 to-background-primary" />

        <div className="relative z-10 flex flex-col items-center">
          <motion.div
            initial="hidden" animate="show" variants={fadeUp}
            className="mb-8 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-sm font-navbar text-text-primary/85 backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            v1.0 · copy-paste React components
          </motion.div>

          <motion.h1
            initial="hidden" animate="show" custom={1} variants={fadeUp}
            className="font-heading text-5xl font-extrabold leading-[1.02] tracking-tight md:text-7xl"
          >
            Interfaces that
          </motion.h1>

          {/* live component: 3D box-roll headline word */}
          <motion.div
            initial="hidden" animate="show" custom={2} variants={fadeUp}
            className="mt-1 flex justify-center"
          >
            <BoxFlipText
              words={['feel alive', 'glitch', 'shimmer', 'flip', 'breathe']}
              fontSize={72}
              interval={2200}
              color="#c7c7ff"
            />
          </motion.div>

          <motion.p
            initial="hidden" animate="show" custom={3} variants={fadeUp}
            className="mt-6 max-w-2xl font-primary text-lg text-text-primary/75 md:text-xl"
          >
            A set of animated, themeable React components you install with a single command —
            straight into your codebase, no black-box package to fight.
          </motion.p>

          {/* install command */}
          <motion.div
            initial="hidden" animate="show" custom={4} variants={fadeUp}
            className="mt-9 flex w-full max-w-md items-center justify-between gap-3 rounded-xl border border-white/15 bg-black/40 px-4 py-3 backdrop-blur"
          >
            <code className="flex items-center gap-2 truncate font-primary text-sm md:text-base">
              <span className="text-emerald-400">$</span>
              <span className="truncate">{INSTALL_CMD}</span>
            </code>
            <button
              onClick={copyInstall}
              aria-label="Copy install command"
              className="flex shrink-0 items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs transition hover:bg-white/10"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial="hidden" animate="show" custom={5} variants={fadeUp}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
          >
            <Link
              to="/components"
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-text-primary px-6 py-3 font-navbar text-base font-medium text-background-primary transition hover:opacity-90"
            >
              <span className="hk-shine absolute inset-0" />
              Browse components
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/docs"
              className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-navbar text-base backdrop-blur transition hover:bg-white/10"
            >
              Read the docs
            </Link>
          </motion.div>
        </div>
      </section>

      {/* =========================== MARQUEE =========================== */}
      <section className="relative border-y border-border-primary py-6">
        <div className="hk-fade-x flex flex-col gap-4">
          <Marquee items={COMPONENTS} />
          <Marquee items={[...COMPONENTS].reverse()} reverse />
        </div>
      </section>

      {/* =========================== STATS =========================== */}
      <section className="mx-auto max-w-5xl px-4 pt-20">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={fadeUp}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border-primary bg-border-primary sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-background-primary px-4 py-6 text-center">
              <div className="font-heading text-3xl font-bold md:text-4xl">{s.value}</div>
              <div className="mt-1 font-navbar text-sm text-text-primary/60">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* =========================== LIVE SHOWCASE =========================== */}
      <Section
        eyebrow="Dogfooded"
        title="Everything here is a HelioKit component"
        subtitle="The hero canvas, the flipping word above, the crystal below — all shipped by the CLI."
      >
        <motion.div variants={fadeUp} className="grid gap-5 lg:grid-cols-2">
          {/* crystal-text tile */}
          <ShowcaseTile slug="crystal-text">
            <CrystalText text="HELIOKIT" background="aurora" duration={0} height={320} className="h-full w-full" />
          </ShowcaseTile>
          {/* meteor-shower tile */}
          <ShowcaseTile slug="meteor-shower">
            <div className="relative h-[320px] w-full">
              <MeteorShower accentColor="#7ae2ff" asteroidFrequency={5} meteorOpacity={0.5} starDensity={3.5} />
            </div>
          </ShowcaseTile>
        </motion.div>
      </Section>

      {/* =========================== FEATURES =========================== */}
      <Section
        eyebrow="Why HelioKit"
        title="Built to get out of your way"
        subtitle="No wrappers, no config ceremony. Add a component and keep moving."
      >
        <div className="grid gap-px overflow-hidden rounded-2xl border border-border-primary bg-border-primary sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} variants={fadeUp} custom={i} className="group bg-background-primary p-7">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border-primary bg-white/5 transition group-hover:bg-white/10">
                <f.icon size={20} />
              </div>
              <h3 className="font-heading text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 font-primary text-sm leading-relaxed text-text-primary/65">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* =========================== TERMINAL =========================== */}
      <Section
        eyebrow="Workflow"
        title="Three commands, then you're building"
        subtitle="Init once, add what you need, ship a whole template when you're in a hurry."
      >
        <motion.div variants={fadeUp} className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border-primary bg-black/40 backdrop-blur">
          <div className="flex items-center gap-2 border-b border-border-primary px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-red-500/70" />
            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <span className="h-3 w-3 rounded-full bg-green-500/70" />
            <span className="ml-2 font-navbar text-xs text-text-primary/50">terminal</span>
          </div>
          <div className="space-y-4 p-5 font-primary text-sm md:text-base">
            <TerminalLine cmd="npx heliokit init" out="✔ Config written to .heliokitrc" />
            <TerminalLine cmd="npx heliokit add crystal-text meteor-shower" out="✔ Copied 2 components to src/components" />
            <TerminalLine cmd="npx heliokit add-template saas-landing-page" out="✔ Template + 6 components added" />
          </div>
        </motion.div>
      </Section>

      {/* =========================== TEMPLATES =========================== */}
      <Section
        eyebrow="Templates"
        title="Skip the blank page"
        subtitle="Full pages assembled from HelioKit primitives — grab one and customise."
      >
        <div className="grid gap-5 md:grid-cols-3">
          {TEMPLATES.map((t, i) => (
            <motion.div key={t.slug} variants={fadeUp} custom={i}>
              <Link
                to={`/templates/${t.slug}`}
                className="group flex h-full flex-col justify-between rounded-2xl border border-border-primary bg-white/5 p-6 transition hover:border-text-primary/40 hover:bg-white/10"
              >
                <div>
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-border-primary bg-background-primary">
                    <Layers size={20} />
                  </div>
                  <h3 className="font-heading text-lg font-semibold">{t.name}</h3>
                  <p className="mt-2 font-primary text-sm leading-relaxed text-text-primary/65">{t.desc}</p>
                </div>
                <span className="mt-6 flex items-center gap-2 font-navbar text-sm text-text-primary/70 transition group-hover:text-text-primary">
                  Preview
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* =========================== FINAL CTA =========================== */}
      <section className="relative mx-auto max-w-6xl px-4 pb-28">
        <motion.div
          initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-border-primary"
        >
          <div className="absolute inset-0">
            <MeteorShower accentColor="#8b8bff" asteroidFrequency={3} meteorOpacity={0.3} starDensity={2} />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-background-primary/55" />
          <div className="relative px-6 py-16 text-center md:py-24">
            <h2 className="mx-auto max-w-2xl font-heading text-3xl font-bold md:text-5xl">
              Start building with HelioKit today
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-primary text-text-primary/75">
              Free, open source, and yours to modify. One command away.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/components"
                className="group flex items-center gap-2 rounded-xl bg-text-primary px-6 py-3 font-navbar font-medium text-background-primary transition hover:opacity-90"
              >
                Get started
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="https://www.npmjs.com/package/heliokit"
                target="_blank" rel="noreferrer"
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-navbar backdrop-blur transition hover:bg-white/10"
              >
                <Github size={18} />
                View on npm
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* =========================== FOOTER =========================== */}
      <footer className="border-t border-border-primary">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-text-primary/60 sm:flex-row">
          <span className="font-logo text-base text-text-primary">HELIOKIT</span>
          <nav className="flex gap-6 font-navbar">
            <Link to="/components" className="transition hover:text-text-primary">Components</Link>
            <Link to="/docs" className="transition hover:text-text-primary">Docs</Link>
            <Link to="/templates" className="transition hover:text-text-primary">Templates</Link>
            <Link to="/themes" className="transition hover:text-text-primary">Themes</Link>
          </nav>
          <span className="font-primary">MIT © {new Date().getFullYear()} Mihir Jataniya</span>
        </div>
      </footer>
    </main>
  )
}

/* ------------------------------ helpers ------------------------------ */

const Marquee: React.FC<{ items: string[]; reverse?: boolean }> = ({ items, reverse }) => (
  <div className="flex w-max gap-3" style={{ animation: `hk-marquee ${reverse ? '38s' : '32s'} linear infinite${reverse ? ' reverse' : ''}` }}>
    {[...items, ...items].map((c, i) => (
      <Link
        key={c + i}
        to={`/components/${c}`}
        className="whitespace-nowrap rounded-full border border-border-primary bg-white/5 px-4 py-2 font-primary text-sm text-text-primary/70 transition hover:border-text-primary/40 hover:text-text-primary"
      >
        {c}
      </Link>
    ))}
  </div>
)

const ShowcaseTile: React.FC<{ slug: string; children: React.ReactNode }> = ({ slug, children }) => (
  <Link
    to={`/components/${slug}`}
    className="group relative block overflow-hidden rounded-2xl border border-border-primary bg-black/30 transition hover:border-text-primary/40"
  >
    {children}
    <div className="pointer-events-none absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/70 to-transparent px-4 py-3">
      <span className="font-primary text-sm text-white/90">{slug}</span>
      <span className="flex items-center gap-1 font-navbar text-xs text-white/70 transition group-hover:text-white">
        Open <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
      </span>
    </div>
  </Link>
)

const Section: React.FC<{ eyebrow: string; title: string; subtitle: string; children: React.ReactNode }> = ({
  eyebrow, title, subtitle, children,
}) => (
  <motion.section
    initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
    variants={{ show: { transition: { staggerChildren: 0.05 } } }}
    className="relative mx-auto max-w-6xl px-4 py-20"
  >
    <div className="mx-auto mb-12 max-w-2xl text-center">
      <motion.span variants={fadeUp} className="font-navbar text-sm uppercase tracking-[0.2em] text-indigo-300/70">
        {eyebrow}
      </motion.span>
      <motion.h2 variants={fadeUp} className="mt-3 font-heading text-3xl font-bold md:text-4xl">
        {title}
      </motion.h2>
      <motion.p variants={fadeUp} className="mt-3 font-primary text-text-primary/65">
        {subtitle}
      </motion.p>
    </div>
    {children}
  </motion.section>
)

const TerminalLine: React.FC<{ cmd: string; out: string }> = ({ cmd, out }) => (
  <div>
    <div className="flex items-center gap-2">
      <span className="text-emerald-400">$</span>
      <span className="text-text-primary">{cmd}</span>
    </div>
    <div className="mt-1 pl-5 text-text-primary/55">{out}</div>
  </div>
)

/** Keyframes the page relies on — scoped, no external CSS needed. */
const PageStyles: React.FC = () => (
  <style>{`
    @keyframes hk-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    @keyframes hk-shine {
      0% { transform: translateX(-120%); }
      60%, 100% { transform: translateX(220%); }
    }
    .hk-shine {
      background: linear-gradient(100deg, transparent, rgba(255,255,255,0.55), transparent);
      animation: hk-shine 2.8s ease-in-out infinite;
    }
    .hk-fade-x {
      -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
      mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
    }
    @media (prefers-reduced-motion: reduce) {
      .hk-shine { animation: none; }
    }
  `}</style>
)

export default Home
