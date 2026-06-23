import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { docBySlug } from '@/docs/registry'

/**
 * Renders the doc page matching the :slug param (index = empty slug).
 * Unknown slugs get a small not-found notice rather than a blank screen.
 */
const DocsRoute: React.FC = () => {
    const { slug } = useParams<{ slug: string }>()
    const entry = docBySlug(slug)

    if (!entry) {
        return (
            <div className="font-primary text-text-primary py-20">
                <h1 className="font-heading text-3xl font-bold">Page not found</h1>
                <p className="mt-3 text-text-primary/65">
                    No docs page at this URL.{' '}
                    <Link to="/docs" className="underline decoration-text-primary/30 underline-offset-4 hover:decoration-text-primary">
                        Back to Introduction
                    </Link>
                    .
                </p>
            </div>
        )
    }

    return <>{entry.element}</>
}

export default DocsRoute
