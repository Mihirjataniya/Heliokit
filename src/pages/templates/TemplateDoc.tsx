import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { templateBySlug, templateFullPath } from '@/templates/registry'
import { buildTemplateSteps } from './templateSteps'
import ScaledFramePreview from './ScaledFramePreview'
import TemplateStepList from './TemplateStepList'

/**
 * Template doc page: header + a scaled live preview (with an open-in-fullscreen
 * button) + generated integration steps. The preview iframe and the button
 * both point at the standalone /templates/:slug/full route.
 */
const TemplateDoc: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const entry = templateBySlug(slug)

    if (!entry) {
        return (
            <div className="font-primary text-text-primary">
                <h1 className="font-heading text-3xl font-bold">Template not found</h1>
                <p className="mt-3 text-text-primary/65">
                    No template at this URL.{' '}
                    <Link to="/templates" className="underline decoration-text-primary/30 underline-offset-4 hover:decoration-text-primary">
                        Back to gallery
                    </Link>
                    .
                </p>
            </div>
        )
    }

    const fullPath = templateFullPath(entry.slug)
    const steps = buildTemplateSteps(entry)

    return (
        <div className="font-primary text-text-primary">
            <header className="mb-6">
                <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">Template</span>
                <h1 className="mt-2 font-heading text-3xl font-bold tracking-tight md:text-4xl">{entry.title}</h1>
                <p className="mt-3 max-w-2xl leading-relaxed text-text-primary/65">{entry.blurb}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {entry.uses.map((u) => (
                        <span key={u} className="rounded-md border border-border-primary px-2 py-0.5 text-[11px] uppercase tracking-wide text-text-primary/45">
                            {u}
                        </span>
                    ))}
                </div>
            </header>

            {/* Preview */}
            <div className="mb-3 flex items-center justify-between">
                <span className="font-navbar text-[11px] uppercase tracking-[0.24em] text-text-primary/40">Preview</span>
                <a
                    href={fullPath}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border-primary px-3 py-1.5 text-sm text-text-primary/80 transition hover:bg-text-primary/5"
                >
                    Open full preview <ArrowUpRight size={15} />
                </a>
            </div>
            <ScaledFramePreview src={fullPath} title={`${entry.title} preview`} />

            <div className="mt-12">
                <TemplateStepList steps={steps} />
            </div>
        </div>
    )
}

export default TemplateDoc
