import type React from "react"
import { useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { Menu, X } from "lucide-react"
import LogoWhite from '@/assets/Logo-white.png'
import LohoDark from '@/assets/Logo-Dark.png'

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navItems = [
    { name: "Components", to: "/components" },
    { name: "Docs", to: "/docs" },
    { name: "Themes", to: "/themes" },
    { name: "Templates", to: "/templates" },
  ]

  return (
   <nav className="sticky top-0 z-50 border-b border-border-primary text-text-primary py-2 px-4 md:px-12 flex items-center justify-between relative bg-background-primary backdrop-blur-md">
    
      <Link to={"/"} className="flex items-center">
        <img src={LogoWhite} alt="Logo (Dark Mode)" className="block light:hidden h-10 md:h-16" />
        <img src={LohoDark} alt="Logo (Light Mode)" className="hidden light:block h-10 md:h-16" />
        <p className="text-xl md:text-[32px] font-logo">HELIOKIT</p>
      </Link>

      <div className="hidden md:flex items-center gap-8 font-navbar text-lg">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `px-4 py-1.5 rounded-xl transition ${
                isActive
                  ? "bg-white/10 backdrop-blur-md border border-white/20 text-text-primary shadow-sm"
                  : "text-text-primary/70 hover:text-text-primary"
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      <button className="md:hidden text-text-primary p-2" onClick={toggleMenu} aria-label="Toggle menu">
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className="absolute top-full left-0 right-0 z-50 md:hidden w-full"
        style={{
          transition: "all 500ms cubic-bezier(0.22, 1, 0.36, 1)",
          clipPath: isMenuOpen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
          opacity: isMenuOpen ? 1 : 0,
          pointerEvents: isMenuOpen ? "auto" : "none",
        }}
      >
        <div
          className="bg-background-primary border-b border-border-primary"
          style={{
            transform: isMenuOpen ? "translateY(0)" : "translateY(-20px)",
            transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            transitionDelay: isMenuOpen ? "50ms" : "0ms",
          }}
        >
          <div className="flex flex-col font-navbar py-4 px-6">
            {navItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={{
                  opacity: isMenuOpen ? 1 : 0,
                  transform: isMenuOpen ? "translateY(0)" : "translateY(-10px)",
                  transition: "all 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transitionDelay: isMenuOpen ? `${100 + index * 50}ms` : "0ms",
                }}
                className={({ isActive }) =>
                  `px-4 py-3 my-1 rounded-xl ${
                    isActive
                      ? "bg-white/10 backdrop-blur-md border border-white/20 text-text-primary shadow-sm"
                      : "text-text-primary/70 hover:text-text-primary hover:translate-x-1"
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
