import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { TEMPLATES, templatePath } from '@/templates/registry'

/** Gallery of full-page templates. */
const TemplatesIndex: React.FC = () => (
    <div className="mx-auto max-w-6xl px-6 py-16 font-primary text-text-primary">
        <header className="mb-10">
            <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">Templates</span>
            <h1 className="mt-2 font-heading text-4xl font-bold tracking-tight">Ready-made pages</h1>
            <p className="mt-3 max-w-2xl text-lg text-text-primary/65">
                Full pages assembled entirely from HelioKit components. Open one, then copy the sections you want.
            </p>
        </header>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {TEMPLATES.map((t) => (
                <Link
                    key={t.slug}
                    to={templatePath(t.slug)}
                    className="group flex flex-col rounded-2xl border border-border-primary p-6 transition-colors hover:bg-text-primary/[0.03]"
                >
                    <div className="flex items-start justify-between">
                        <h2 className="font-heading text-xl font-semibold">{t.title}</h2>
                        <ArrowUpRight size={18} className="text-text-primary/30 transition group-hover:text-text-primary" />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-text-primary/60">{t.blurb}</p>
                    <div className="mt-5 flex flex-wrap gap-2">
                        {t.uses.map((u) => (
                            <span key={u} className="rounded-md border border-border-primary px-2 py-0.5 text-[11px] uppercase tracking-wide text-text-primary/45">
                                {u}
                            </span>
                        ))}
                    </div>
                </Link>
            ))}
        </div>
    </div>
)

export default TemplatesIndex
