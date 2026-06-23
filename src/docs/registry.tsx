import type React from 'react'
import Introduction from '@/pages/docs/Introduction'
import Installation from '@/pages/docs/Installation'
import CliUsage from '@/pages/docs/CliUsage'

/**
 * Docs registry — single source of truth for doc pages and the sidebar nav.
 * `slug` is the URL segment after /docs (empty slug = the /docs index).
 * Add a page: drop a TSX file in src/pages/docs and append an entry here.
 */

export type DocEntry = {
    slug: string
    title: string
    group: string
    element: React.ReactNode
}

export const DOCS: DocEntry[] = [
    { slug: '', title: 'Introduction', group: 'Getting Started', element: <Introduction /> },
    { slug: 'installation', title: 'Installation', group: 'Getting Started', element: <Installation /> },
    { slug: 'cli', title: 'CLI Usage', group: 'Reference', element: <CliUsage /> },
]

/** Lookup by slug. The index ('/docs') resolves to the empty-slug entry. */
export const docBySlug = (slug?: string): DocEntry | undefined =>
    DOCS.find((d) => d.slug === (slug ?? ''))

/** Grouped, order-preserving nav model for the sidebar. */
export const DOC_GROUPS: { label: string; items: DocEntry[] }[] = DOCS.reduce(
    (groups, entry) => {
        const existing = groups.find((g) => g.label === entry.group)
        if (existing) existing.items.push(entry)
        else groups.push({ label: entry.group, items: [entry] })
        return groups
    },
    [] as { label: string; items: DocEntry[] }[],
)

/** Build the route path for a doc slug ('' → /docs). */
export const docPath = (slug: string): string => (slug ? `/docs/${slug}` : '/docs')
