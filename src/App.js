import { jsx as _jsx } from "react/jsx-runtime";
import './App.css';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { routes } from '@/Routes/Routes';
function AppRoutes() {
    return useRoutes(routes);
}
function App() {
    return (_jsx(BrowserRouter, { children: _jsx(AppRoutes, {}) }));
}
export default App;
