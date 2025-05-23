import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/ui/Siebar';
import { Breadcrumb } from '@/components/ui/BreadCrumb';
const ComponentsLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth < 768) {
                setSidebarOpen(false);
            }
            else {
                setSidebarOpen(true);
            }
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);
    return (_jsxs("div", { className: "flex min-h-screen", children: [_jsx(Sidebar, { onToggle: setSidebarOpen }), _jsx("div", { className: 'w-full', children: _jsxs("div", { className: `bg-background-primary lg:ml-64 xl:ml-96 transition-all duration-300 w-full max-w-4xl mt-12 md:mt-10  px-6`, children: [_jsx(Breadcrumb, {}), _jsx(Outlet, {})] }) })] }));
};
export default ComponentsLayout;
