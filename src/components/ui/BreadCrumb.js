import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
export function Breadcrumb() {
    const location = useLocation();
    const segments = location.pathname.split("/").filter(Boolean);
    const breadcrumbs = segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const isLast = index === segments.length - 1;
        return {
            name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " "),
            href,
            isLast,
        };
    });
    return (_jsx("nav", { className: "text-sm font-navbar flex items-center gap-1 text-text-primary", "aria-label": "breadcrumb", children: breadcrumbs.map((crumb, index) => (_jsxs(Fragment, { children: [index > 0 && _jsx(ChevronRight, { size: 16, className: "text-gray-400 mx-1" }), crumb.isLast ? (_jsx("span", { className: "cursor-pointer text-text-primary", children: crumb.name })) : (_jsx(Link, { to: crumb.href, className: "text-text-primary hover:underline", children: crumb.name }))] }, crumb.href))) }));
}
