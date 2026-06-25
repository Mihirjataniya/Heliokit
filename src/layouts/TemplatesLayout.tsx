import React from 'react'
import { Outlet } from 'react-router-dom'
import TemplatesSidebar from '@/components/ui/TemplatesSidebar'

/** Sidebar + content shell for the /templates section (gallery and doc pages). */
const TemplatesLayout: React.FC = () => (
    <div className="flex min-h-screen bg-background-primary">
        <TemplatesSidebar />
        <main className="min-w-0 flex-1 px-6 py-10 md:px-10">
            <div className="mx-auto max-w-5xl">
                <Outlet />
            </div>
        </main>
    </div>
)

export default TemplatesLayout
