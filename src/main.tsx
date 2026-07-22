import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from '@/routes/Routes'
import './index.css'

/**
 * vite-react-ssg entry. Owns the router: `vite-react-ssg build` renders every
 * static route in `routes` to real HTML (so crawlers get full markup + meta),
 * and the same entry hydrates on the client. Providers live in RootProviders,
 * the top route in `routes`.
 */
export const createRoot = ViteReactSSG({ routes })
