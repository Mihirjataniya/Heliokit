import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/ui/Siebar'
import { Breadcrumb } from '@/components/ui/BreadCrumb'

const ComponentsLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

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
    <div className="flex w-full min-h-screen">
      <Sidebar onToggle={setSidebarOpen} />
      <div className='w-full flex items-center justify-center'>
        <div
          className={`bg-background-primary transition-all duration-300 max-w-4xl mt-12 md:mt-10 px-6`}
        >
          <Breadcrumb />
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default ComponentsLayout