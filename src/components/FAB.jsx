import React from 'react';
import { motion } from 'framer-motion';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useApp } from '../context/AppContext';

const FAB = () => {
    const { theme, toggleTheme } = useApp();
    const isDark = theme === 'smartkids-dark';

    return (
        <motion.button
            onClick={toggleTheme}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="fixed bottom-6 right-6 z-50 w-13 h-13 rounded-full shadow-xl flex items-center justify-center text-xl btn btn-primary border-none"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to Light' : 'Switch to Dark'}
        >
            <motion.div
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.3 }}
            >
                {isDark ? <FaSun className="text-warning" /> : <FaMoon className="text-neutral-content" />}
            </motion.div>
        </motion.button>
    );
};

export default FAB;
