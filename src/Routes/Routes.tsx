// routes/index.tsx
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

// Route-level code splitting: each page/layout is its own chunk, so the initial
// download only includes the route being visited (keeps heavy deps like
// react-syntax-highlighter, framer-motion, and the canvas components out of the
// first load). A top-level <Suspense> in App.tsx covers these while they load.
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

export const routes: RouteObject[] = [
  {
    element: <PrimaryLayout />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/components',
        element: <ComponentsLayout />, 
        children: [
          {
            index: true, 
            element: <Components />
          },
          {
            path: ':componentName',
            element: <ComponentPreview />
          }
        ]
      },
      {
        path: '/docs',
        element: <DocsLayout />,
        children: [
          {
            index: true,
            element: <DocsRoute />
          },
          {
            path: ':slug',
            element: <DocsRoute />
          }
        ]
      },
      {
        path: '/templates',
        element: <TemplatesLayout />,
        children: [
          {
            index: true,
            element: <TemplatesIndex />
          },
          {
            path: ':slug',
            element: <TemplateDoc />
          }
        ]
      },
      {
        path: '/themes',
        element: <Themes />
      },
      {
        path: '/trial',
        element: <Trial />
      }
    ]
  },
  // Standalone full-page template preview — rendered OUTSIDE PrimaryLayout so
  // there's no site navbar or chrome. The template fills the viewport as its
  // own page, the way it would when shipped. This is what the doc-page iframe
  // and the "Open full preview" button load.
  {
    path: '/templates/:slug/full',
    element: <TemplateRoute />
  }
]



// {
//   path: '/components',
//   element: <ComponentsLayout />,
//   children: [
//     { index: true, element: <Components /> },

//     {
//       path: ':group',
//       element: <ComponentGroupLayout />,
//       children: [
//         { path: ':componentName', element: <ComponentPreview /> }
//       ]
//     },

//     { path: ':componentName', element: <ComponentPreview /> }
//   ]
// }


// src/pages/ComponentGroupLayout.tsx

// import { Outlet, useLocation } from 'react-router-dom'

// const ComponentGroupLayout = () => {
//   const location = useLocation()
//   const group = location.pathname.split('/')[2] // e.g., "button-list"

//   const GroupIndexMap: Record<string, JSX.Element> = {
//     'button-list': <ButtonListIndex />,
//     'card-list': <CardListIndex />,
//     'form-controls': <FormControlsIndex />,
//     // add others here
//   }

//   const IndexComponent = GroupIndexMap[group]

//   return (
//     <>
//       {location.pathname.endsWith(group) ? IndexComponent : <Outlet />}
//     </>
//   )
// }

// export const componentMap = {
//   Accordion: () => import('@/datamodules/Accordion.data'),
//   Toasts: () => import('@/datamodules/Toast.data'),
//   ButtonList: {
//     Button: () => import('@/datamodules/ButtonList/Button.data'),
//     IconButton: () => import('@/datamodules/ButtonList/IconButton.data')
//   },
//   FormControls: {
//     Switch: () => import('@/datamodules/FormControls/Switch.data')
//   }
// }

// const ComponentPreview = () => {
//   const { group, componentName } = useParams()

//   // Determine path segments
//   const parts = componentName
//     ? [group, componentName].filter(Boolean)
//     : [group]

//   // Capitalize each part to match componentMap keys
//   const keyParts = parts.map(part => part?.charAt(0).toUpperCase() + part?.slice(1))

//   // Walk the map: componentMap['ButtonList']['Button']
//   let loader = componentMap
//   for (const part of keyParts) {
//     loader = loader?.[part]
//   }

//   const [PreviewComponent, setPreviewComponent] = useState<React.FC | null>(null)

//   useEffect(() => {
//     if (typeof loader !== 'function') return
//     loader().then((mod) => {
//       setPreviewComponent(() => mod.PreviewComponent)
//       // dispatch other stuff if needed
//     })
//   }, [loader])

//   if (typeof loader !== 'function') {
//     return <div className="text-red-500">Component not found</div>
//   }