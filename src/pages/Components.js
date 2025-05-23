import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CodeandPreview } from '@/components/ui/CodeandPreview';
import { ChevronRight } from 'lucide-react';
import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
const Components = () => {
    return (_jsxs("div", { className: 'text-text-primary font-primary', children: [_jsx("h1", { className: 'mt-4 font-heading text-3xl font-bold', children: "Accordion" }), _jsx("p", { className: 'mt-2 text-base text-text-primary/70 tracking-wide', children: "Interactive headings that toggle the display of their content panels. Useful for showing related information without overwhelming the interface." }), _jsx("div", { className: 'my-4', children: _jsx(CodeandPreview, {}) })] }));
};
export default Components;
