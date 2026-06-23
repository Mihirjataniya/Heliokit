import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { templateBySlug } from '@/templates/registry'

/**
 * Renders a single template as a standalone full page — no site chrome, the
 * way it ships. Unknown slugs get a minimal not-found notice.
 */
const TemplateRoute: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const entry = templateBySlug(slug)

    if (!entry) {
        return (
            <div className="min-h-screen bg-background-primary px-6 py-24 font-primary text-text-primary">
                <div className="mx-auto max-w-6xl">
                    <h1 className="font-heading text-3xl font-bold">Template not found</h1>
                    <p className="mt-3 text-text-primary/65">
                        No template at this URL.{' '}
                        <Link to="/templates" className="underline decoration-text-primary/30 underline-offset-4 hover:decoration-text-primary">
                            Back to gallery
                        </Link>
                        .
                    </p>
                </div>
            </div>
        )
    }

    return <div className="min-h-screen bg-background-primary">{entry.element}</div>
}

export default TemplateRoute
