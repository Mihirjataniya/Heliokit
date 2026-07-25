import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import DocsSidebar from '@/components/ui/DocsSidebar'

/**
 * Docs chrome — left nav + centred content column. Same shell as
 * ComponentsLayout so docs and components feel like one site.
 */
const DocsLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true)

    return (
        <div className="min-h-screen bg-background-primary">
            {/* Fixed rail — out of flow, so the content column offsets itself by
                exactly the rail width (w-64) and centres in what's left. */}
            <DocsSidebar onToggle={setSidebarOpen} />
            <div className={`transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
                <main className="min-w-0 max-w-4xl mx-auto px-6 mt-12 md:mt-10">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default DocsLayout
