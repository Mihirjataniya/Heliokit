// routes/index.tsx
import type { RouteObject } from 'react-router-dom'
import Home from '@/pages/Home'
import Components from '@/pages/Components'
import PrimaryLayout from '@/layouts/PrimaryLayout'
import ComponentsLayout from '@/layouts/ComponentsLayout'
import ComponentPreview from '@/components/ui/ComponentPreview'
import DocsLayout from '@/layouts/DocsLayout'
import DocsRoute from '@/pages/docs/DocsRoute'
import TemplatesIndex from '@/pages/templates/TemplatesIndex'
import TemplateRoute from '@/pages/templates/TemplateRoute'
import Themes from '@/pages/Themes'
import Trial from '@/pages/Trial'

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
        element: <TemplatesIndex />
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
  // Standalone full-page template previews — rendered OUTSIDE PrimaryLayout so
  // there's no site navbar or chrome. The template fills the viewport as its
  // own page, the way it would when shipped.
  {
    path: '/templates/:slug',
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