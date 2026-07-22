import { Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/store'
import { ToastProvider } from '@/components/heliokit/toast/Toast'

/** Shown while a lazily-loaded route chunk is downloading. */
function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background-primary">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-text-primary/20 border-t-text-primary/70" />
    </div>
  )
}

/**
 * App-wide providers, mounted as the top route so both the site chrome and the
 * standalone full-page template preview share one Redux store + toast context.
 * The <Suspense> here covers every lazily-loaded route element below it.
 */
const RootProviders: React.FC = () => (
  <Provider store={store}>
    <ToastProvider
      defaultDuration={3000}
      defaultTheme="dark"
      defaultPosition="bottom-center"
    >
      <Suspense fallback={<RouteFallback />}>
        <Outlet />
      </Suspense>
    </ToastProvider>
  </Provider>
)

export default RootProviders
