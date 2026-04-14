import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [lang, setLang] = useState('bn');
    const [theme, setTheme] = useState(() => localStorage.getItem('sk-theme') || 'smartkids');
    // Active class course — guardian sets this, child views it
    const [activeClassCourseId, setActiveClassCourseId] = useState(
        () => localStorage.getItem('sk-active-class') || null
    );

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sk-theme', theme);
    }, [theme]);

    useEffect(() => {
        if (activeClassCourseId) localStorage.setItem('sk-active-class', activeClassCourseId);
        else localStorage.removeItem('sk-active-class');
    }, [activeClassCourseId]);

    const toggleTheme = () => setTheme(t => t === 'smartkids' ? 'smartkids-dark' : 'smartkids');
    const toggleLang = () => setLang(l => l === 'bn' ? 'en' : 'bn');

    return (
        <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme, activeClassCourseId, setActiveClassCourseId }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
