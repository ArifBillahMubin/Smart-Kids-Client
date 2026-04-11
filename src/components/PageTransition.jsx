import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router';

const PageTransition = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

export default PageTransition;
