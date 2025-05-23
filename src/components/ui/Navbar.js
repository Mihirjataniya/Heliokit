import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import LogoWhite from '@/assets/Logo-white.png';
import LohoDark from '@/assets/Logo-Dark.png';
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const navItems = [
        { name: "Components", to: "/components" },
        { name: "Docs", to: "/docs" },
        { name: "Themes", to: "/themes" },
        { name: "Templates", to: "/templates" },
    ];
    return (_jsxs("nav", { className: "sticky top-0 z-50 border-b border-border-primary text-text-primary py-2 px-4 md:px-12 flex items-center justify-between relative bg-background-primary backdrop-blur-md", children: [_jsxs(Link, { to: "/", className: "flex items-center", children: [_jsx("img", { src: LogoWhite, alt: "Logo (Dark Mode)", className: "block light:hidden h-10 md:h-16" }), _jsx("img", { src: LohoDark, alt: "Logo (Light Mode)", className: "hidden light:block h-10 md:h-16" }), _jsx("p", { className: "text-xl md:text-[32px] font-logo", children: "HELIOKIT" })] }), _jsx("div", { className: "hidden md:flex items-center gap-8 font-navbar text-lg", children: navItems.map((item) => (_jsx(NavLink, { to: item.to, className: ({ isActive }) => `px-4 py-1.5 rounded-xl transition ${isActive
                        ? "bg-white/10 backdrop-blur-md border border-white/20 text-text-primary shadow-sm"
                        : "text-text-primary/70 hover:text-text-primary"}`, children: item.name }, item.to))) }), _jsx("button", { className: "md:hidden text-text-primary p-2", onClick: toggleMenu, "aria-label": "Toggle menu", children: isMenuOpen ? _jsx(X, { size: 24 }) : _jsx(Menu, { size: 24 }) }), _jsx("div", { className: "absolute top-full left-0 right-0 z-50 md:hidden w-full", style: {
                    transition: "all 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                    clipPath: isMenuOpen ? "inset(0 0 0 0)" : "inset(0 0 100% 0)",
                    opacity: isMenuOpen ? 1 : 0,
                    pointerEvents: isMenuOpen ? "auto" : "none",
                }, children: _jsx("div", { className: "bg-background-primary border-b border-border-primary", style: {
                        transform: isMenuOpen ? "translateY(0)" : "translateY(-20px)",
                        transition: "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
                        transitionDelay: isMenuOpen ? "50ms" : "0ms",
                    }, children: _jsx("div", { className: "flex flex-col font-navbar py-4 px-6", children: navItems.map((item, index) => (_jsx(NavLink, { to: item.to, style: {
                                opacity: isMenuOpen ? 1 : 0,
                                transform: isMenuOpen ? "translateY(0)" : "translateY(-10px)",
                                transition: "all 400ms cubic-bezier(0.22, 1, 0.36, 1)",
                                transitionDelay: isMenuOpen ? `${100 + index * 50}ms` : "0ms",
                            }, className: ({ isActive }) => `px-4 py-3 my-1 rounded-xl ${isActive
                                ? "bg-white/10 backdrop-blur-md border border-white/20 text-text-primary shadow-sm"
                                : "text-text-primary/70 hover:text-text-primary hover:translate-x-1"}`, onClick: () => setIsMenuOpen(false), children: item.name }, item.to))) }) }) })] }));
};
export default Navbar;
