import React from 'react';
import { NavLink } from 'react-router';
import { FaSun, FaMoon } from 'react-icons/fa';
import logo from '../../../assets/SmartKids_logo_final.png';
import { useApp } from '../../../context/AppContext';
import useAuth from '../../../hooks/useAuth';
import toast from 'react-hot-toast';

const navItems = {
    en: [
        { label: 'Home',     to: '/' },
        { label: 'Courses',  to: '/courses' },
        { label: 'About',    to: '/about' },
        { label: 'Contact',  to: '/contact' },
    ],
    bn: [
        { label: 'হোম',      to: '/' },
        { label: 'কোর্স',    to: '/courses' },
        { label: 'আমাদের',   to: '/about' },
        { label: 'যোগাযোগ', to: '/contact' },
    ],
};

const Navbar = () => {
    const { lang, toggleLang, theme, toggleTheme } = useApp();
    const links = navItems[lang];
    const isDark = theme === 'smartkids-dark';
    const {user,logOut} = useAuth();

    console.log(user);

    const handleLogout = () => {
        logOut()
            .then(() => {
                 toast.success(lang === 'bn' ? 'সাইন আউট সফল হয়েছে' : 'Sign Out Successful');
            });
    };


    const navLinks = links.map(item => (
        <li key={item.to}>
            <NavLink
                to={item.to}
                className={({ isActive }) =>
                    isActive ? 'text-primary font-semibold' : 'font-medium'
                }
            >
                {item.label}
            </NavLink>
        </li>
    ));

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50 px-4">

            {/* Start — logo + mobile menu */}
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow">
                        {navLinks}
                    </ul>
                </div>
                <NavLink to="/">
                    <img src={logo} alt="SmartKids" className="w-36" />
                </NavLink>
            </div>

            {/* Center — nav links */}
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-1">
                    {navLinks}
                </ul>
            </div>

            {/* End — lang toggle + theme toggle + CTA */}
            <div className="navbar-end flex items-center gap-2">

                {/* Language Toggle */}
                <label className="swap swap-rotate btn btn-ghost btn-sm gap-1 font-bold text-xs border border-base-300 rounded-full px-3">
                    <input type="checkbox" checked={lang === 'en'} onChange={toggleLang} />
                    <span className="swap-on text-primary">EN</span>
                    <span className="swap-off text-secondary">বাং</span>
                </label>

                {/* Theme Toggle */}
                <label className="swap swap-rotate btn btn-ghost btn-sm btn-circle border border-base-300">
                    <input type="checkbox" checked={isDark} onChange={toggleTheme} />
                    <FaSun className="swap-on text-warning text-base" />
                    <FaMoon className="swap-off text-primary text-base" />
                </label>

                {/* User / CTA */}
                {user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="flex items-center gap-2 cursor-pointer">
                            <img
                                src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=60A5FA&color=fff`}
                                alt={user.displayName}
                                className="w-9 h-9 rounded-full object-cover border-2 border-primary"
                            />
                            <span className="hidden sm:block text-sm font-semibold text-neutral max-w-[100px] truncate">
                                {user.displayName?.split(' ')[0]}
                            </span>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-2xl shadow-lg border border-base-300 z-50 mt-3 w-52 p-2">
                            <li className="px-3 py-2 border-b border-base-300 mb-1">
                                <div className="flex items-center gap-3 pointer-events-none">
                                    <img
                                        src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=60A5FA&color=fff`}
                                        className="w-10 h-10 rounded-full object-cover"
                                        alt=""
                                    />
                                    <div>
                                        <p className="font-semibold text-neutral text-sm">{user.displayName}</p>
                                        <p className="text-neutral/50 text-xs truncate">{user.email}</p>
                                    </div>
                                </div>
                            </li>
                            <li><NavLink to="/dashboard" className="text-sm">{lang === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}</NavLink></li>
                            <li><NavLink to="/profile" className="text-sm">{lang === 'bn' ? 'প্রোফাইল' : 'Profile'}</NavLink></li>
                            <li>
                                <button onClick={handleLogout} className="text-sm text-error w-full text-left">
                                    {lang === 'bn' ? 'সাইন আউট' : 'Sign Out'}
                                </button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <NavLink to="/login" className="btn btn-primary btn-sm rounded-full text-white hidden sm:flex">
                        {lang === 'bn' ? 'সাইন ইন' : 'Sign In'}
                    </NavLink>
                )}
            </div>
        </div>
    );
};

export default Navbar;
