import type React from 'react'
import SaasLanding from '@/pages/templates/SaasLanding'
import saasCode from '@/pages/templates/SaasLanding.tsx?raw'
import FinancialOverview from '@/pages/templates/FinancialOverview'
import financialCode from '@/pages/templates/FinancialOverview.tsx?raw'
import KanbanBoard from '@/pages/templates/KanbanBoard'
import kanbanCode from '@/pages/templates/KanbanBoard.tsx?raw'



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
    /** Optional "Render the page" snippet. Omit to fall back to a bare `<Component />`.
     *  Use it to show a template's props (custom data, callbacks) in the docs. */
    usage?: string
}

export const TEMPLATES: TemplateEntry[] = [
    {
        slug: 'saas-landing-page',
        title: 'SaaS Landing Page',
        blurb: 'A full product-analytics marketing page — meteor hero, stat band, feature spotlights, pricing, testimonials, and a reflected footer. Ships the demo "Pulse" copy by default, or swap in your own sections through the `data` prop.',
        uses: ['Meteor Shower', 'Crystal Text', 'Focus Highlight', 'Brutal Pricing', 'Accordion', 'Text Reflection'],
        element: <SaasLanding />,
        fileName: 'SaasLanding.tsx',
        rawCode: saasCode,
        componentsUsed: ['meteor-shower', 'crystal-text', 'text-reflection', 'focus-highlight', 'accordion', 'brutal-pricing'],
        selfContained: false,
        usage: `import { Activity } from 'lucide-react'
import SaasLanding, { type Feature } from '@/pages/templates/SaasLanding'

export default function Page() {
  // Omit \`data\` (or any field) to render the built-in "Pulse" demo page.
  const features: Feature[] = [
    { icon: Activity, title: 'Realtime funnels', body: 'Spot drop-off the moment it starts.' },
    // …
  ]

  return <SaasLanding data={{ features, pricing: myPlans, faq: myFaq }} />
}`,
    },
    {
        slug: 'financial-overview',
        title: 'Financial Overview',
        blurb: 'A dark finance dashboard — KPI sparklines, an interactive revenue/MRR chart, an expense donut, a P&L waterfall, and a live transactions table. Renders a seeded demo model by default, or feed your own figures through the `data` prop.',
        uses: ['Area Chart', 'Donut', 'P&L Waterfall', 'KPI Sparklines', 'Data Table'],
        element: <FinancialOverview />,
        fileName: 'FinancialOverview.tsx',
        rawCode: financialCode,
        componentsUsed: [],
        selfContained: true,
        usage: `import FinancialOverview, { type Day, type Txn } from '@/pages/templates/FinancialOverview'

export default function Page() {
  // Omit \`data\` (or any field) to render the built-in seeded demo dashboard.
  const days: Day[] = loadDailyMetrics()   // oldest → newest, one calendar day apart
  const txns: Txn[] = loadTransactions()   // each \`idx\` points at its day in \`days\`

  return <FinancialOverview data={{ days, txns }} />
}`,
    },
    {
        slug: 'kanban-board',
        title: 'Kanban Board',
        blurb: 'A draggable sprint board — five WIP-limited columns, label-tagged task cards with priority, assignees, checklists and due dates. Drag between columns, filter by member, search, and add tasks inline. Seeds a demo set by default, or drive it with your own cards, members and columns via the `data` prop and listen for changes with `onCardsChange`.',
        uses: ['Drag & Drop', 'Task Cards', 'WIP Limits', 'Member Filter', 'Inline Composer'],
        element: <KanbanBoard />,
        fileName: 'KanbanBoard.tsx',
        rawCode: kanbanCode,
        componentsUsed: [],
        selfContained: true,
        usage: `import KanbanBoard, { type Card } from '@/pages/templates/KanbanBoard'

export default function Page() {
  // Omit \`data\` (or any field) to render the built-in demo board.
  return (
    <KanbanBoard
      data={{ cards: myCards, members: myMembers, columns: myColumns }}
      onCardsChange={(cards: Card[]) => saveToApi(cards)}
    />
  )
}`,
    },
]

export const templateBySlug = (slug?: string): TemplateEntry | undefined =>
    TEMPLATES.find((t) => t.slug === slug)

export const templatePath = (slug: string): string => `/templates/${slug}`
export const templateFullPath = (slug: string): string => `/templates/${slug}/full`
