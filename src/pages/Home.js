import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useState } from 'react';
const Home = () => {
    const [isLightMode, setIsLightMode] = useState(false);
    useEffect(() => {
        setIsLightMode(document.documentElement.classList.contains('light'));
    }, []);
    return (_jsx("div", { className: '' }));
};
export default Home;
