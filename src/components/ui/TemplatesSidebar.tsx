import React from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutTemplate } from 'lucide-react'
import { TEMPLATES, templatePath } from '@/templates/registry'

/**
 * Left rail for the templates section — links to the gallery and each template
 * doc page. Sticky so it tracks scroll within the templates layout.
 */
const TemplatesSidebar: React.FC = () => (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r border-border-primary px-4 py-8 font-primary md:block">
        <NavLink
            to="/templates"
            end
            className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-text-primary/10 text-text-primary' : 'text-text-primary/60 hover:text-text-primary'}`
            }
        >
            <LayoutTemplate size={16} /> All templates
        </NavLink>

        <div className="mt-6 mb-2 px-3 font-navbar text-[10px] uppercase tracking-[0.2em] text-text-primary/35">Templates</div>
        <nav className="flex flex-col gap-0.5">
            {TEMPLATES.map((t) => (
                <NavLink
                    key={t.slug}
                    to={templatePath(t.slug)}
                    className={({ isActive }) =>
                        `rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-text-primary/10 font-medium text-text-primary' : 'text-text-primary/60 hover:text-text-primary'}`
                    }
                >
                    {t.title}
                </NavLink>
            ))}
        </nav>
    </aside>
)

export default TemplatesSidebar
