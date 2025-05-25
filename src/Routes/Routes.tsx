// routes/index.tsx
import type { RouteObject } from 'react-router-dom'
import Home from '@/pages/Home'
import Components from '@/pages/Components'
import PrimaryLayout from '@/layouts/PrimaryLayout'
import ComponentsLayout from '@/layouts/ComponentsLayout'
import ComponentPreview from '@/components/ui/ComponentPreview'

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
      }
    ]
  }
]
