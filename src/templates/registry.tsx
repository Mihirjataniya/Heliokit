import type React from 'react'
import SaasLanding from '@/pages/templates/SaasLanding'

/**
 * Templates registry — full-page compositions built from HelioKit components.
 * `slug` is the URL segment after /templates. Add a template: drop a TSX page
 * in src/pages/templates and append an entry here.
 */

export type TemplateEntry = {
    slug: string
    title: string
    blurb: string
    /** Components the template is assembled from — shown on the gallery card. */
    uses: string[]
    element: React.ReactNode
}

export const TEMPLATES: TemplateEntry[] = [
    {
        slug: 'saas-landing-page',
        title: 'SaaS Landing Page',
        blurb: 'A full product-analytics marketing page — meteor hero, stat band, feature spotlights, pricing, testimonials, and a reflected footer.',
        uses: ['Meteor Shower', 'Crystal Text', 'Focus Highlight', 'Brutal Pricing', 'Accordion', 'Text Reflection'],
        element: <SaasLanding />,
    },
]

export const templateBySlug = (slug?: string): TemplateEntry | undefined =>
    TEMPLATES.find((t) => t.slug === slug)

export const templatePath = (slug: string): string => `/templates/${slug}`
