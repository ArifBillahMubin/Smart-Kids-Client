import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaBars, FaTimes, FaChevronDown, FaSignOutAlt, FaUser, FaTachometerAlt } from 'react-icons/fa';
import logo from '../../../assets/SmartKids_logo_final.png';
import { useApp } from '../../../context/AppContext';
import useAuth from '../../../hooks/useAuth';

const navItems = {
    en: [
        { label: 'Home', to: '/' },
        { label: 'Courses', to: '/courses' },
        { label: 'My Class', to: '/my-class' },
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
    ],
    bn: [
        { label: 'হোম', to: '/' },
        { label: 'কোর্স', to: '/courses' },
        { label: 'আমার ক্লাস', to: '/my-class' },
        { label: 'আমাদের', to: '/about' },
        { label: 'যোগাযোগ', to: '/contact' },
    ],
};

const Navbar = () => {
    const { lang, toggleLang, theme, toggleTheme } = useApp();
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const isDark = theme === 'smartkids-dark';
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropOpen, setDropOpen] = useState(false);
    const links = navItems[lang];

    const handleLogout = async () => {
        await logOut();
        setDropOpen(false);
        navigate('/');
    };

    return (
        <nav className="bg-base-100/80 backdrop-blur-md border-b border-base-300 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

                {/* Logo */}
                <NavLink to="/" className="shrink-0">
                    <img src={logo} alt="SmartKids" className="h-9 w-auto" />
                </NavLink>

                {/* Desktop nav links */}
                <ul className="hidden lg:flex items-center gap-1">
                    {links.map(item => (
                        <li key={item.to}>
                            <NavLink to={item.to}
                                className={({ isActive }) =>
                                    `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-neutral/70 hover:text-primary hover:bg-primary/5'}`
                                }>
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Right controls */}
                <div className="flex items-center gap-2">

                    {/* Lang toggle */}
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={toggleLang}
                        className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-base-300 text-xs font-bold hover:border-primary/40 transition-all"
                    >
                        <span className={lang === 'en' ? 'text-primary' : 'text-neutral/40'}>EN</span>
                        <span className="text-neutral/30">|</span>
                        <span className={lang === 'bn' ? 'text-secondary' : 'text-neutral/40'}>বাং</span>
                    </motion.button>

                    {/* Theme toggle */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="w-9 h-9 rounded-full border border-base-300 flex items-center justify-center hover:border-primary/40 transition-all"
                    >
                        <AnimatePresence mode="wait">
                            <motion.span
                                key={isDark ? 'sun' : 'moon'}
                                initial={{ rotate: -90, opacity: 0 }}
                                animate={{ rotate: 0, opacity: 1 }}
                                exit={{ rotate: 90, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isDark
                                    ? <FaSun className="text-warning text-sm" />
                                    : <FaMoon className="text-primary text-sm" />}
                            </motion.span>
                        </AnimatePresence>
                    </motion.button>

                    {/* User / Sign In */}
                    {user ? (
                        <div className="relative">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setDropOpen(p => !p)}
                                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-base-300 hover:border-primary/40 transition-all"
                            >
                                <img
                                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=4F9CF9&color=fff`}
                                    className="w-8 h-8 rounded-full object-cover"
                                    alt={user.displayName}
                                />
                                <span className="hidden sm:block text-sm font-semibold text-neutral max-w-[80px] truncate">
                                    {user.displayName?.split(' ')[0]}
                                </span>
                                <FaChevronDown className={`text-neutral/40 text-xs transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <AnimatePresence>
                                {dropOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                        transition={{ duration: 0.18 }}
                                        className="absolute right-0 top-12 w-56 bg-base-100 border border-base-300 rounded-2xl shadow-xl overflow-hidden z-50"
                                    >
                                        {/* User info */}
                                        <div className="px-4 py-3 border-b border-base-300 flex items-center gap-3">
                                            <img
                                                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=4F9CF9&color=fff`}
                                                className="w-10 h-10 rounded-full object-cover"
                                                alt=""
                                            />
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-neutral text-sm truncate">{user.displayName}</p>
                                                <p className="text-neutral/40 text-xs truncate">{user.email}</p>
                                            </div>
                                        </div>
                                        {/* Menu items */}
                                        <div className="p-1.5 flex flex-col gap-0.5">
                                            <NavLink to="/dashboard" onClick={() => setDropOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral/70 hover:bg-primary/8 hover:text-primary transition-colors">
                                                <FaTachometerAlt className="text-primary text-xs" />
                                                {lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
                                            </NavLink>
                                            <NavLink to="/profile" onClick={() => setDropOpen(false)}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-neutral/70 hover:bg-primary/8 hover:text-primary transition-colors">
                                                <FaUser className="text-primary text-xs" />
                                                {lang === 'bn' ? 'প্রোফাইল' : 'Profile'}
                                            </NavLink>
                                            <button onClick={handleLogout}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-error hover:bg-error/8 transition-colors w-full text-left">
                                                <FaSignOutAlt className="text-xs" />
                                                {lang === 'bn' ? 'সাইন আউট' : 'Sign Out'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="hidden sm:flex items-center gap-2">
                            <NavLink to="/login"
                                className="px-4 py-2 rounded-full text-sm font-semibold text-neutral/70 hover:text-primary transition-colors">
                                {lang === 'bn' ? 'সাইন ইন' : 'Sign In'}
                            </NavLink>
                            <NavLink to="/register"
                                className="px-4 py-2 rounded-full text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-all shadow-sm hover:shadow-md">
                                {lang === 'bn' ? 'শুরু করুন' : 'Get Started'}
                            </NavLink>
                        </div>
                    )}

                    {/* Mobile menu button */}
                    <button onClick={() => setMobileOpen(p => !p)}
                        className="lg:hidden w-9 h-9 rounded-full border border-base-300 flex items-center justify-center">
                        {mobileOpen ? <FaTimes className="text-sm" /> : <FaBars className="text-sm" />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden border-t border-base-300 bg-base-100 overflow-hidden"
                    >
                        <div className="px-4 py-3 flex flex-col gap-1">
                            {links.map(item => (
                                <NavLink key={item.to} to={item.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) =>
                                        `px-4 py-2.5 rounded-xl text-sm font-semibold ${isActive ? 'bg-primary/10 text-primary' : 'text-neutral/70'}`
                                    }>
                                    {item.label}
                                </NavLink>
                            ))}
                            <div className="flex items-center gap-2 pt-2 border-t border-base-300 mt-1">
                                <button onClick={toggleLang} className="flex-1 py-2 rounded-xl border border-base-300 text-xs font-bold text-center">
                                    {lang === 'en' ? 'বাংলা' : 'English'}
                                </button>
                                {!user && (
                                    <NavLink to="/login" onClick={() => setMobileOpen(false)}
                                        className="flex-1 py-2 rounded-xl bg-primary text-white text-xs font-bold text-center">
                                        {lang === 'bn' ? 'সাইন ইন' : 'Sign In'}
                                    </NavLink>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
