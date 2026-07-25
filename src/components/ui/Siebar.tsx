import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { PanelRightClose, PanelRightOpen } from "lucide-react"

const menuItems = [
    { id: "accordion", label: "Accordion" },
    { id: 'box-flip-text', label: 'Box Flip Text' },
    { id: 'brutal-pricing', label: 'Brutal Pricing' },
    { id: 'calendar', label: 'Calendar' },
    { id: 'card-stack', label: 'Card Stack' },
    { id: 'card-stack-3d', label: 'Card Stack 3D' },
    { id: 'crystal-text', label: 'Crystal Text' },
    { id: "toasts", label: "Custom Toasts" },
    { id: 'flip-form', label: 'Flip Form' },
    { id: 'focus-highlight', label: 'Focus Highlight' },
    { id: 'glitch-card', label: 'Glitch Card' },
    { id: 'glossy-dock', label: 'Glossy Dock' },
    { id: 'image-reveal-marquee', label: 'Image Reveal Marquee' },
    { id: 'liquid-plasma', label: 'Liquid Plasma' },
    { id: 'meteor-shower', label: 'Meteor Shower' },
    { id: 'nebulla-background', label: 'Nebulla Background' },
    { id: 'pixel-spotlight', label: 'Pixel Spotlight' },
    { id: 'product-card', label: 'Product Card' },
    { id: 'social-grid', label: 'Social Grid' },
    { id: 'text-loader', label: 'Text Loader' },
    { id: 'text-reflection', label: 'Text Reflection' },
]

/** Shared list body — same markup for the desktop rail and the mobile drawer. */
const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const isActiveItem = (itemId: string) => location.pathname === `/components/${itemId}`

    const go = (path: string) => {
        navigate(path)
        onNavigate?.()
    }

    return (
        <>
            <button
                onClick={() => go(`/components`)}
                className="w-[88%] flex flex-col items-start font-navbar mx-4 mb-2 py-2 transition-all duration-200 group relative text-text-primary/70 hover:bg-background-primary/10 hover:text-text-primary border-b border-border-primary cursor-pointer"
            >
                <span>Components</span>
            </button>

            <div className="space-y-1 px-3">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => go(`/components/${item.id}`)}
                        className={`w-full flex font-navbar items-center py-2 px-4 rounded-lg transition-all duration-200 group relative cursor-pointer
                        ${isActiveItem(item.id)
                                ? "bg-gradient-to-r from-purple-700/20 to-blue-600/10 text-text-primary"
                                : "text-text-primary/70 hover:bg-background-primary/10 hover:text-text-primary"
                            }`}
                    >
                        {isActiveItem(item.id) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-700 to-blue-600 rounded-r-full" />
                        )}

                        <span className={isActiveItem(item.id) ? "font-medium" : ""}>{item.label}</span>

                        {isActiveItem(item.id) && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>
                ))}
            </div>
        </>
    )
}

/**
 * Left rail for the components section — in-flow + sticky so the flex layout
 * offsets the content automatically (no manual margins). Under md the rail is
 * hidden and the same list is reachable through a floating trigger + drawer.
 */
export default function Sidebar() {
    const location = useLocation()
    const [isOpen, setIsOpen] = useState(false)

    /* Route changes close the drawer, including back/forward navigation. */
    useEffect(() => setIsOpen(false), [location.pathname])

    useEffect(() => {
        if (!isOpen) return

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') setIsOpen(false)
        }
        window.addEventListener('keydown', onKeyDown)

        /* Growing past md swaps the drawer for the rail — close it so the
           scroll lock below can't outlive a drawer nobody can see. */
        const desktop = window.matchMedia('(min-width: 768px)')
        const onBreakpoint = () => { if (desktop.matches) setIsOpen(false) }
        desktop.addEventListener('change', onBreakpoint)

        /* Stop the page behind the drawer from scrolling with it. */
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        return () => {
            window.removeEventListener('keydown', onKeyDown)
            desktop.removeEventListener('change', onBreakpoint)
            document.body.style.overflow = previousOverflow
        }
    }, [isOpen])

    return (
        <>
            <aside className="sticky top-(--nav-h) hidden h-[calc(100dvh-var(--nav-h))] w-64 shrink-0 overflow-y-auto overscroll-contain border-r border-border-primary py-4 font-primary md:block sidebar-scroll">
                <SidebarNav />
            </aside>

            {/* Mobile trigger — absolute, not fixed, so it scrolls away with the
                page. Anchored to the layout wrapper's relative box. */}
            <button
                type="button"
                onClick={() => setIsOpen(true)}
                aria-label="Open components menu"
                aria-expanded={isOpen}
                className="absolute left-2 top-2 z-40 cursor-pointer p-1 text-text-primary transition-colors md:hidden"
            >
                <PanelRightClose />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setIsOpen(false)}
                        />

                        <motion.aside
                            role="dialog"
                            aria-modal="true"
                            aria-label="Components"
                            className="fixed bottom-0 left-0 top-(--nav-h) z-40 flex w-72 max-w-[82%] flex-col border-r border-border-primary bg-background-primary py-4 font-primary md:hidden"
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 420, damping: 40 }}
                        >
                            <div className="mb-2 flex items-center justify-end px-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    aria-label="Close components menu"
                                    className="cursor-pointer p-1 text-text-primary transition-colors"
                                >
                                    <PanelRightOpen />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto overscroll-contain sidebar-scroll">
                                <SidebarNav onNavigate={() => setIsOpen(false)} />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    )
}
