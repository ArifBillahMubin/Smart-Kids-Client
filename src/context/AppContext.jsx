import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [lang, setLang] = useState('bn'); // 'bn' | 'en'
    const [theme, setTheme] = useState(() => localStorage.getItem('sk-theme') || 'smartkids');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sk-theme', theme);
    }, [theme]);

    const toggleTheme = () =>
        setTheme(t => t === 'smartkids' ? 'smartkids-dark' : 'smartkids');

    const toggleLang = () => setLang(l => l === 'bn' ? 'en' : 'bn');

    return (
        <AppContext.Provider value={{ lang, toggleLang, theme, toggleTheme }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);
