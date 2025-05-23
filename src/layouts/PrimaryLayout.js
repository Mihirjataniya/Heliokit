import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Navbar from '@/components/ui/Navbar';
import React from 'react';
import { Outlet } from 'react-router-dom';
const PrimaryLayout = () => {
    return (_jsxs("div", { className: 'min-h-screen w-full bg-background-primary', children: [_jsx(Navbar, {}), _jsx(Outlet, {})] }));
};
export default PrimaryLayout;
