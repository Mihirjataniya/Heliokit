import type React from 'react'
import SaasLanding from '@/pages/templates/SaasLanding'
import saasCode from '@/pages/templates/SaasLanding.tsx?raw'
import FinancialOverview from '@/pages/templates/FinancialOverview'
import financialCode from '@/pages/templates/FinancialOverview.tsx?raw'



export type TemplateEntry = {
    slug: string
    title: string
    blurb: string
    /** Components the template is assembled from — shown on the gallery card. */
    uses: string[]
    /** Live element, rendered standalone at /templates/:slug/full. */
    element: React.ReactNode
    /** Page filename under src/pages/templates — the unit the CLI copies. */
    fileName: string
    /** Full page source, used for the copy block + manual install step. */
    rawCode: string
    /** HelioKit component slugs the page imports (empty if self-contained). */
    componentsUsed: string[]
    /** True when the page needs no HelioKit components or Tailwind theme. */
    selfContained: boolean
}

export const TEMPLATES: TemplateEntry[] = [
    {
        slug: 'saas-landing-page',
        title: 'SaaS Landing Page',
        blurb: 'A full product-analytics marketing page — meteor hero, stat band, feature spotlights, pricing, testimonials, and a reflected footer.',
        uses: ['Meteor Shower', 'Crystal Text', 'Focus Highlight', 'Brutal Pricing', 'Accordion', 'Text Reflection'],
        element: <SaasLanding />,
        fileName: 'SaasLanding.tsx',
        rawCode: saasCode,
        componentsUsed: ['meteor-shower', 'crystal-text', 'text-reflection', 'focus-highlight', 'accordion', 'brutal-pricing'],
        selfContained: false,
    },
    {
        slug: 'financial-overview',
        title: 'Financial Overview',
        blurb: 'A dark finance dashboard — KPI sparklines, an interactive revenue/MRR chart, an expense donut, a P&L waterfall, and a live transactions table. All figures generated from a seeded model.',
        uses: ['Area Chart', 'Donut', 'P&L Waterfall', 'KPI Sparklines', 'Data Table'],
        element: <FinancialOverview />,
        fileName: 'FinancialOverview.tsx',
        rawCode: financialCode,
        componentsUsed: [],
        selfContained: true,
    },
]

export const templateBySlug = (slug?: string): TemplateEntry | undefined =>
    TEMPLATES.find((t) => t.slug === slug)

export const templatePath = (slug: string): string => `/templates/${slug}`
export const templateFullPath = (slug: string): string => `/templates/${slug}/full`
