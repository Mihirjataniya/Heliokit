import Navbar from '@/components/ui/Navbar'
import React, { type ReactNode } from 'react'
import { Outlet } from 'react-router-dom'


const PrimaryLayout: React.FC = () => {
    return (
        <div className='h-screen w-full bg-background-primary'>
            <Navbar />
            <Outlet />
        </div>
    )
}

export default PrimaryLayout
