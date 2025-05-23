import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef } from "react";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
export default function Sidebar({ onToggle }) {
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    const [activeItem, setActiveItem] = useState("home");
    const sidebarRef = useRef(null);
    const menuItems = [
        { id: "home", label: "Home" },
    ];
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setIsOpen(false);
                onToggle?.(false);
            }
            else {
                setIsOpen(true);
                onToggle?.(true);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, [onToggle]);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isMobile && isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMobile, isOpen]);
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "auto";
        }
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isMobile, isOpen]);
    const toggleSidebar = () => {
        setIsOpen((prev) => {
            const newState = !prev;
            onToggle?.(newState);
            return newState;
        });
    };
    return (_jsxs(_Fragment, { children: [isMobile && isOpen && (_jsx("div", { className: "fixed inset-0 z-30 bg-black transition-opacity", onClick: () => setIsOpen(false) })), _jsxs("div", { ref: sidebarRef, className: `fixed top-16 md:top-24 left-0 z-40 ${isOpen ? "w-64" : "w-0 md:w-0"}  h-[calc(100vh-96px)]  bg-background-primary border-gray-700 transition-all duration-300 ease-in-out flex flex-col ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"} `, children: [_jsx("button", { onClick: toggleSidebar, className: ` absolute top-0 -right-10 text-text-primary transition-colors duration-200 `, "aria-label": isOpen ? "Close sidebar" : "Open sidebar", children: isOpen ? _jsx(PanelRightOpen, {}) : _jsx(PanelRightClose, {}) }), _jsx("div", { className: "flex-1 overflow-y-auto py-4 sidebar-scroll", children: _jsx("div", { className: "space-y-1 px-3", children: menuItems.map((item) => (_jsxs("button", { onClick: () => setActiveItem(item.id), className: ` w-full flex font-navbar items-center py-3 px-4 rounded-lg transition-all duration-200 group relative
                                ${activeItem === item.id ? "bg-gradient-to-r from-purple-700/20 to-blue-600/10 text-text-primary"
                                    : "text-text-primary/70 hover:bg-background-primary/10 hover:text-text-primary"}
                  `, children: [activeItem === item.id && (_jsx("div", { className: "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-purple-700 to-blue-600 rounded-r-full" })), _jsx("span", { className: `${activeItem === item.id ? "font-medium" : ""}`, children: item.label }), activeItem === item.id && _jsx("div", { className: "absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-600" })] }, item.id))) }) })] })] }));
}
