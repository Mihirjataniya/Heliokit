import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from '@/components/ui/Siebar'
import { Breadcrumb } from '@/components/ui/BreadCrumb'

const ComponentsLayout = () => {
  const location = useLocation()
  // The /components landing is a full-bleed showcase — no breadcrumb there.
  const isIndex = location.pathname.replace(/\/$/, '') === '/components'

  return (
    <div className="flex min-h-screen bg-background-primary">
      <Sidebar />
      <main className={isIndex ? 'min-w-0 flex-1 max-w-5xl mx-auto px-6' : 'min-w-0 flex-1 max-w-4xl mx-auto px-6 mt-12 md:mt-10'}>
        {!isIndex && <Breadcrumb />}
        <Outlet />
      </main>
    </div>
  )
}

export default ComponentsLayout