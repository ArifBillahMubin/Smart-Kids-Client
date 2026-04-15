import { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaHome, FaChartLine, FaBook, FaFileAlt, FaUser,
    FaUsers, FaCog, FaBars, FaTimes, FaSignOutAlt,
    FaGraduationCap, FaTachometerAlt, FaBell, FaShieldAlt, FaStar
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import logo from '../assets/SmartKids_logo_final.png';
import useAuth from '../hooks/useAuth';
import { useApp } from '../context/AppContext';

const guardianNav = [
    { label: 'Overview',       labelBn: 'সারসংক্ষেপ',     to: '/dashboard',                icon: <FaTachometerAlt /> },
    { label: 'Child Progress', labelBn: 'সন্তানের অগ্রগতি', to: '/dashboard/child-progress', icon: <FaChartLine /> },
    { label: 'My Courses',     labelBn: 'আমার কোর্স',      to: '/dashboard/my-courses',     icon: <FaBook /> },
    { label: 'My Class',       labelBn: 'আমার ক্লাস',      to: '/my-class',                 icon: <FaGraduationCap /> },
    { label: 'Reports',        labelBn: 'রিপোর্ট',          to: '/dashboard/reports',        icon: <FaFileAlt /> },
    { label: 'Profile',        labelBn: 'প্রোফাইল',         to: '/dashboard/profile',        icon: <FaUser /> },
];

const adminNav = [
    { label: 'Overview',       labelBn: 'সারসংক্ষেপ',    to: '/admin',              icon: <FaTachometerAlt /> },
    { label: 'Manage Users',   labelBn: 'ব্যবহারকারী',    to: '/admin/users',        icon: <FaUsers /> },
    { label: 'Manage Courses', labelBn: 'কোর্স ব্যবস্থাপনা', to: '/admin/courses',   icon: <FaGraduationCap /> },
    { label: 'Reviews',        labelBn: 'রিভিউ',           to: '/admin/reviews',      icon: <FaStar /> },
    { label: 'Reports',        labelBn: 'রিপোর্ট',         to: '/admin/reports',      icon: <FaFileAlt /> },
];

const DashboardLayout = () => {
    const { lang } = useApp();
    const { user, logOut } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isAdmin = location.pathname.startsWith('/admin');
    const navItems = isAdmin ? adminNav : guardianNav;

    const handleLogout = async () => {
        await logOut();
        toast.success('Logged out');
        navigate('/');
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-5 border-b border-base-300">
                <NavLink to="/">
                    <img src={logo} alt="SmartKids" className="h-8 w-auto" />
                </NavLink>
                <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isAdmin ? 'bg-error/15 text-error' : 'bg-primary/15 text-primary'}`}>
                        {isAdmin ? (lang === 'bn' ? 'অ্যাডমিন' : 'Admin') : (lang === 'bn' ? 'অভিভাবক' : 'Guardian')}
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
                {navItems.map(item => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/dashboard' || item.to === '/admin'}
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${isActive
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-neutral/60 hover:bg-primary/8 hover:text-primary'}`
                        }
                    >
                        <span className="text-base">{item.icon}</span>
                        {lang === 'bn' ? item.labelBn : item.label}
                    </NavLink>
                ))}
            </nav>

            {/* User + Logout */}
            <div className="p-3 border-t border-base-300">
                {user && (
                    <div className="flex items-center gap-3 px-3 py-2 mb-2">
                        <img
                            src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=4F9CF9&color=fff`}
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                            alt=""
                        />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-neutral truncate">{user.displayName}</p>
                            <p className="text-xs text-neutral/40 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold text-error hover:bg-error/8 transition-colors">
                    <FaSignOutAlt /> {lang === 'bn' ? 'সাইন আউট' : 'Sign Out'}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-base-200">

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex flex-col w-64 bg-base-100 border-r border-base-300 shrink-0 fixed h-full">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 h-full w-64 bg-base-100 border-r border-base-300 z-50 lg:hidden"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                {/* Top bar */}
                <header className="bg-base-100 border-b border-base-300 h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
                    <button onClick={() => setSidebarOpen(true)}
                        className="lg:hidden w-9 h-9 rounded-xl border border-base-300 flex items-center justify-center">
                        <FaBars className="text-sm" />
                    </button>
                    <div className="hidden lg:block">
                        <h1 className="text-lg font-bold text-neutral">
                            {isAdmin
                                ? (lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড' : 'Admin Dashboard')
                                : (lang === 'bn' ? 'অভিভাবক ড্যাশবোর্ড' : 'Guardian Dashboard')}
                        </h1>
                    </div>
                    <div className="flex items-center gap-3 ml-auto">
                        <button className="relative w-9 h-9 rounded-xl border border-base-300 flex items-center justify-center">
                            <FaBell className="text-sm text-neutral/60" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
                        </button>
                        {user && (
                            <img
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=4F9CF9&color=fff`}
                                className="w-9 h-9 rounded-full object-cover border-2 border-primary/30"
                                alt=""
                            />
                        )}
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
