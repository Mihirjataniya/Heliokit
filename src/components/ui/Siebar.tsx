import { useState, useEffect, useRef } from "react"
import { PanelRightClose, PanelRightOpen } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { label } from "framer-motion/client"


export default function Sidebar({ onToggle }: { onToggle?: (isOpen: boolean) => void }) {
    const [isOpen, setIsOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)
    const sidebarRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()
    const location = useLocation()

    const menuItems = [
        { id: "accordion", label: "Accordion" },
        { id: "toasts", label: "Custom Toasts" },
        // { id: "counter", label: "Counter Animation" },
        { id: 'image-marquee', label: "Image Marquee" },
        { id: 'product-card', label: 'Product Card' },
        { id: 'nebulla-background', label: 'Nebulla Background' },
        { id: 'brutal-pricing', label: 'Brutal Pricing' },
        { id: 'glitch-card', label: 'Glitch Card' },
        { id: 'glossy-dock' , label : 'Glossy Dock'},
        { id: 'text-reflection', label: 'Text Reflection' }
    ]

    const isActiveItem = (itemId: string) => {
        return location.pathname === `/components/${itemId}`
    }

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth < 768) {
                setIsOpen(false)
                onToggle?.(false)
            } else {
                setIsOpen(true)
                onToggle?.(true)
            }
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [onToggle])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [isMobile, isOpen])

    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "auto"
        }

        return () => {
            document.body.style.overflow = "auto"
        }
    }, [isMobile, isOpen])

    const toggleSidebar = () => {
        setIsOpen((prev) => {
            const newState = !prev
            onToggle?.(newState)
            return newState
        })
    }

    const handleItemClick = (itemId: string) => {
        itemId = itemId.replace(/\s+/g, "_")
        navigate(`/components/${itemId}`)
        if (isMobile) {
            setIsOpen(false)
            onToggle?.(false)
        }
    }

    return (
        <>
            {isMobile && isOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}
            <div
                ref={sidebarRef}
                className={`fixed top-16 md:top-24 left-0 z-40 ${isOpen ? "w-64" : "w-0 md:w-0"}  h-[calc(100vh-96px)]  bg-background-primary border-gray-700 transition-all duration-300 ease-in-out flex flex-col ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"} `}
            >

                <button
                    onClick={toggleSidebar}
                    className={` absolute top-0 -right-10 text-text-primary transition-colors duration-200 cursor-pointer `}
                    aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
                >
                    {isOpen ? <PanelRightOpen /> : <PanelRightClose />}
                </button>

                {/* Menu Items */}
                <div className="flex-1 overflow-y-auto py-4 sidebar-scroll">
                    <button
                        onClick={() => navigate(`/components`)}
                        className={` w-[88%] flex flex-col items-start font-navbar mx-4 mb-2 py-2 transition-all duration-200 group relative  text-text-primary/70 hover:bg-background-primary/10 hover:text-text-primary border-b border-border-primary cursor-pointer`}
                    >
                        <span className="">Components</span>

                    </button>
                    <div className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                                className={` w-full flex font-navbar items-center py-2 px-4 rounded-lg transition-all duration-200 group relative cursor-pointer
                                ${isActiveItem(item.id) ? "bg-gradient-to-r from-purple-700/20 to-blue-600/10 text-text-primary"
                                        : "text-text-primary/70 hover:bg-background-primary/10 hover:text-text-primary cursro-pointer"
                                    }
                  `}
                            >
                                {isActiveItem(item.id) && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-700 to-blue-600 rounded-r-full" />
                                )}

                                <span className={`${isActiveItem(item.id) ? "font-medium" : ""}"`}>{item.label}</span>

                                {isActiveItem(item.id) && <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600" />}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}