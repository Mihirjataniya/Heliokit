import { Suspense } from 'react'
import { BrowserRouter, useRoutes } from 'react-router-dom'
import { routes } from '@/routes/Routes'

function AppRoutes() {
  return useRoutes(routes)
}

/** Shown while a lazily-loaded route chunk is downloading. */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-primary/20 border-t-text-primary/70" />
    </div>
  )
}

function App() {

  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  )
}

export default App
