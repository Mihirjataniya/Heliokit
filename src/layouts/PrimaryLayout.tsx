import Navbar from '@/components/ui/Navbar'
import React from 'react'
import { Outlet } from 'react-router-dom'


const PrimaryLayout: React.FC = () => {
    return (
        <div className='min-h-screen w-full bg-background-primary'>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default PrimaryLayout
