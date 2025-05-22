import { Outlet } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Sidebar from '@/components/ui/Siebar'

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
    <div className="flex min-h-screen">
      <Sidebar onToggle={setSidebarOpen} />
      <div 
        className={`bg-background-primary mx-auto max-w-5xl transition-all duration-300 `}
      >
        <Outlet />
      </div>
    </div>
  )
}

export default ComponentsLayout