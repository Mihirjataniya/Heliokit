import React from 'react'
import LogoWhite from '@/assets/Logo-white.png'
import LogoDark from '@/assets/Logo-Dark.png'
import { NavLink } from 'react-router-dom'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {


    const navItems = [
        { name: 'Components', to: '/components' },
        { name: 'Docs', to: '/docs' },
        { name: 'Themes', to: '/themes' },
        { name: 'Templates', to: '/templates' },
    ]

    return (
        <nav className='border-b border-border-primary text-text-primary py-2 px-12 flex items-center justify-between'>
            <Link to={'/'} className='flex items-center'>
                <img src={LogoWhite} alt="Logo (Dark Mode)" className="block light:hidden h-16" />
                <img src={LogoDark} alt="Logo (Light Mode)" className="hidden light:block h-16" />
                <p className='text-[32px] font-logo'>HELIOKIT</p>
            </Link>
            <div className='flex items-center gap-8 font-navbar text-lg'>
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            `px-4 py-1.5 rounded-xl transition ${isActive
                                ? 'bg-white/10 backdrop-blur-md border border-white/20 text-text-primary shadow-sm'
                                : 'text-text-primary/70 hover:text-text-primary'
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </div>
        </nav>
    )
}

export default Navbar
