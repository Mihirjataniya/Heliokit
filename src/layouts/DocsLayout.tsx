import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import DocsSidebar from '@/components/ui/DocsSidebar'

/**
 * Docs chrome — left nav + centred content column. Same shell as
 * ComponentsLayout so docs and components feel like one site.
 */
const DocsLayout = () => {
    const [, setSidebarOpen] = useState(true)

    return (
        <div className="flex min-h-screen">
            <DocsSidebar onToggle={setSidebarOpen} />
            <div className="w-full">
                <div className="bg-background-primary lg:ml-64 xl:ml-96 transition-all duration-300">
                    <div className="flex">
                        <main className="min-w-0 flex-1 max-w-4xl px-6 mt-12 md:mt-10">
                            <Outlet />
                        </main>
                        <aside className="hidden shrink-0 xl:block xl:w-72 2xl:w-80" aria-hidden />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocsLayout
