import { jsx as _jsx } from "react/jsx-runtime";
import Home from '@/pages/Home';
import Components from '@/pages/Components';
import PrimaryLayout from '@/layouts/PrimaryLayout';
import ComponentsLayout from '@/layouts/ComponentsLayout';
export const routes = [
    {
        element: _jsx(PrimaryLayout, {}),
        children: [
            {
                path: '/',
                element: _jsx(Home, {})
            },
            {
                path: '/components',
                element: _jsx(ComponentsLayout, {}),
                children: [
                    {
                        index: true,
                        element: _jsx(Components, {})
                    },
                ]
            }
        ]
    }
];
