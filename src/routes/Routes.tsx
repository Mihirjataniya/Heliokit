import { lazy } from 'react'
import type { RouteRecord } from 'vite-react-ssg'
import RootProviders from '@/layouts/RootProviders'

// Route-level code splitting: each page/layout is its own chunk, so the initial
// download only includes the route being visited (keeps heavy deps like
// react-syntax-highlighter, framer-motion, and the canvas components out of the
// first load). The <Suspense> in RootProviders covers these while they load,
// and vite-react-ssg awaits them when pre-rendering to static HTML.
const Home = lazy(() => import('@/pages/Home'))
const Components = lazy(() => import('@/pages/Components'))
const PrimaryLayout = lazy(() => import('@/layouts/PrimaryLayout'))
const ComponentsLayout = lazy(() => import('@/layouts/ComponentsLayout'))
const ComponentPreview = lazy(() => import('@/components/ui/ComponentPreview'))
const DocsLayout = lazy(() => import('@/layouts/DocsLayout'))
const DocsRoute = lazy(() => import('@/pages/docs/DocsRoute'))
const TemplatesIndex = lazy(() => import('@/pages/templates/TemplatesIndex'))
const TemplateRoute = lazy(() => import('@/pages/templates/TemplateRoute'))
const TemplatesLayout = lazy(() => import('@/layouts/TemplatesLayout'))
const TemplateDoc = lazy(() => import('@/pages/templates/TemplateDoc'))
const Themes = lazy(() => import('@/pages/Themes'))
const Trial = lazy(() => import('@/pages/Trial'))

export const routes: RouteRecord[] = [
  {
    // Top-level providers layout — wraps every route with the Redux store,
    // toast context and the lazy-route <Suspense> boundary.
    path: '/',
    element: <RootProviders />,
    children: [
      {
        Component: PrimaryLayout,
        children: [
          { index: true, Component: Home },
          {
            path: 'components',
            Component: ComponentsLayout,
            children: [
              { index: true, Component: Components },
              { path: ':componentName', Component: ComponentPreview },
            ],
          },
          {
            path: 'docs',
            Component: DocsLayout,
            children: [
              { index: true, Component: DocsRoute },
              { path: ':slug', Component: DocsRoute },
            ],
          },
          {
            path: 'templates',
            Component: TemplatesLayout,
            children: [
              { index: true, Component: TemplatesIndex },
              { path: ':slug', Component: TemplateDoc },
            ],
          },
          { path: 'themes', Component: Themes },
          { path: 'trial', Component: Trial },
        ],
      },
      // Standalone full-page template preview — rendered OUTSIDE PrimaryLayout so
      // there's no site navbar or chrome. The template fills the viewport as its
      // own page. This is what the doc-page iframe and "Open full preview" load.
      { path: 'templates/:slug/full', Component: TemplateRoute },
    ],
  },
]
