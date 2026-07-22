import React from 'react'
import { Link } from 'react-router-dom'
import { Palette, ArrowUpRight } from 'lucide-react'
import Seo from '@/seo/Seo'

/** Placeholder until the theming editor ships. Keeps /themes from rendering blank. */
const Themes: React.FC = () => (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center font-primary text-text-primary">
        <Seo
            path="/themes"
            title="Themes"
            description="Token-driven theming for HelioKit. A live editor to tune the monochrome palette and fonts, preview real components, and copy the @theme block into your project — coming soon."
        />
        <span className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl border border-border-primary text-text-primary/70">
            <Palette size={24} />
        </span>
        <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">Themes</span>
        <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">Coming soon</h1>
        <p className="mt-4 max-w-md text-text-primary/60">
            A live token editor — tune the monochrome palette and fonts, preview real components, and copy the
            <code className="mx-1 rounded border border-border-primary bg-text-primary/[0.06] px-1.5 py-0.5 font-mono text-[13px]">@theme</code>
            block into your project.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/components" className="rounded-lg bg-text-primary px-6 py-3 font-navbar text-sm font-medium text-background-primary transition hover:opacity-90">
                Browse components
            </Link>
            <Link to="/docs/installation" className="flex items-center gap-1 rounded-lg border border-border-primary px-6 py-3 font-navbar text-sm text-text-primary/80 transition hover:bg-text-primary/5">
                Theming basics <ArrowUpRight size={15} />
            </Link>
        </div>
    </div>
)

export default Themes
