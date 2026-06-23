import { Outlet, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/ui/Siebar'
import { Breadcrumb } from '@/components/ui/BreadCrumb'

const ComponentsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()
  // The /components landing is a full-bleed showcase — no breadcrumb there.
  const isIndex = location.pathname.replace(/\/$/, '') === '/components'

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="flex min-h-screen">
      <Sidebar onToggle={setSidebarOpen} />
      <div className='w-full'>
        <div className="bg-background-primary lg:ml-64 xl:ml-96 transition-all duration-300">
          {/* Center = main content, Right = reserved rail (future). Left rail is the sidebar. */}
          <div className="flex">
            <main className={isIndex ? 'min-w-0 flex-1 max-w-5xl px-6' : 'min-w-0 flex-1 max-w-4xl px-6 mt-12 md:mt-10'}>
              {!isIndex && <Breadcrumb />}
              <Outlet />
            </main>
            <aside className="hidden shrink-0 xl:block xl:w-72 2xl:w-80" aria-hidden />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComponentsLayout