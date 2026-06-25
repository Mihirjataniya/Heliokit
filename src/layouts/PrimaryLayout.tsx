import Navbar from '@/components/ui/Navbar'
import React, { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

/** Reset scroll to top on every route change (SPA navigation keeps the old scroll otherwise). */
const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation()
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [pathname])
    return null
}

const PrimaryLayout: React.FC = () => {
    return (
        <div className='min-h-screen w-full overflow-x-clip bg-background-primary'>
            <ScrollToTop />
            <Navbar />
            <Outlet />
        </div>
    )
}

export default PrimaryLayout
