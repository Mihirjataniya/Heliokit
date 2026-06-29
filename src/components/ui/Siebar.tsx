import { useNavigate, useLocation } from "react-router-dom"

const menuItems = [
    { id: "accordion", label: "Accordion" },
    { id: 'brutal-pricing', label: 'Brutal Pricing' },
    { id: 'card-stack', label: 'Card Stack' },
    { id: 'card-stack-3d', label: 'Card Stack 3D' },
    { id: 'crystal-text', label: 'Crystal Text' },
    { id: "toasts", label: "Custom Toasts" },
    { id: 'flip-form', label: 'Flip Form' },
    { id: 'focus-highlight', label: 'Focus Highlight' },
    { id: 'glitch-card', label: 'Glitch Card' },
    { id: 'glossy-dock', label: 'Glossy Dock' },
    { id: 'image-reveal-marquee', label: 'Image Reveal Marquee' },
    { id: 'meteor-shower', label: 'Meteor Shower' },
    { id: 'nebulla-background', label: 'Nebulla Background' },
    { id: 'pixel-spotlight', label: 'Pixel Spotlight' },
    { id: 'product-card', label: 'Product Card' },
    { id: 'social-grid', label: 'Social Grid' },
    { id: 'text-loader', label: 'Text Loader' },
    { id: 'text-reflection', label: 'Text Reflection' },
]

/**
 * Left rail for the components section — in-flow + sticky so the flex layout
 * offsets the content automatically (no manual margins). Hidden under md.
 */
export default function Sidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    const isActiveItem = (itemId: string) => location.pathname === `/components/${itemId}`

    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-border-primary py-4 font-primary md:block sidebar-scroll">
            <button
                onClick={() => navigate(`/components`)}
                className="w-[88%] flex flex-col items-start font-navbar mx-4 mb-2 py-2 transition-all duration-200 group relative text-text-primary/70 hover:bg-background-primary/10 hover:text-text-primary border-b border-border-primary cursor-pointer"
            >
                <span>Components</span>
            </button>

            <div className="space-y-1 px-3">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => navigate(`/components/${item.id}`)}
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
        </aside>
    )
}
