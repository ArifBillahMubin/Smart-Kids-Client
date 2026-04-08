import React from 'react';
import { FaFacebookF, FaYoutube, FaTwitter, FaInstagram } from 'react-icons/fa';
import logo from '../../../assets/SmartKids_logo_final.png';
import { useApp } from '../../../context/AppContext';

const content = {
    en: {
        tagline: 'Empowering young minds through fun, interactive, and smart learning experiences.',
        linksTitle: 'Quick Links',
        links: [{ label: 'Home', href: '/' }, { label: 'Courses', href: '/courses' }, { label: 'About Us', href: '/about' }, { label: 'Blog', href: '/blog' }, { label: 'Contact', href: '/contact' }],
        catsTitle: 'Categories',
        cats: ['Math & Science', 'Reading & Writing', 'Arts & Crafts', 'Coding for Kids', 'Languages'],
        newsTitle: 'Stay Updated',
        newsSub: 'Get the latest courses and learning tips delivered to your inbox.',
        placeholder: 'Your email address',
        subscribe: 'Subscribe',
        followTitle: 'Follow Us',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service',
        copy: 'SmartKids. All rights reserved.',
    },
    bn: {
        tagline: 'মজাদার, ইন্টারেক্টিভ এবং স্মার্ট শিক্ষার মাধ্যমে তরুণ মেধাবীদের ক্ষমতায়ন।',
        linksTitle: 'দ্রুত লিংক',
        links: [{ label: 'হোম', href: '/' }, { label: 'কোর্স', href: '/courses' }, { label: 'আমাদের সম্পর্কে', href: '/about' }, { label: 'ব্লগ', href: '/blog' }, { label: 'যোগাযোগ', href: '/contact' }],
        catsTitle: 'বিষয়সমূহ',
        cats: ['গণিত ও বিজ্ঞান', 'পড়া ও লেখা', 'শিল্প ও কারুকাজ', 'শিশুদের কোডিং', 'ভাষা শিক্ষা'],
        newsTitle: 'আপডেট পান',
        newsSub: 'সর্বশেষ কোর্স ও শেখার টিপস সরাসরি আপনার ইনবক্সে পান।',
        placeholder: 'আপনার ইমেইল ঠিকানা',
        subscribe: 'সাবস্ক্রাইব',
        followTitle: 'আমাদের অনুসরণ করুন',
        privacy: 'গোপনীয়তা নীতি',
        terms: 'সেবার শর্তাবলী',
        copy: 'SmartKids. সর্বস্বত্ব সংরক্ষিত।',
    },
};

const Footer = () => {
    const { lang } = useApp();
    const c = content[lang];

    return (
        <footer className="bg-base-300 text-neutral mt-16">
            <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="flex flex-col gap-4 lg:col-span-1">
                    <img src={logo} alt="SmartKids Logo" className="w-36" />
                    <p className="text-sm leading-relaxed text-neutral/70">{c.tagline}</p>
                    <div className="flex gap-3 mt-2">
                        {[
                            { icon: <FaFacebookF size={14} />, label: 'Facebook', cls: 'bg-primary/10 hover:bg-primary text-primary' },
                            { icon: <FaYoutube size={14} />, label: 'YouTube', cls: 'bg-secondary/10 hover:bg-secondary text-secondary' },
                            { icon: <FaTwitter size={14} />, label: 'Twitter', cls: 'bg-accent/10 hover:bg-accent text-accent' },
                            { icon: <FaInstagram size={14} />, label: 'Instagram', cls: 'bg-success/10 hover:bg-success text-success' },
                        ].map(s => (
                            <a key={s.label} href="#" aria-label={s.label} className={`w-9 h-9 rounded-full ${s.cls} hover:text-white flex items-center justify-center transition-all duration-200`}>
                                {s.icon}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="font-bold text-base mb-4 text-neutral after:content-[''] after:block after:w-8 after:h-0.5 after:bg-primary after:mt-1">{c.linksTitle}</h3>
                    <ul className="flex flex-col gap-2 text-sm text-neutral/70">
                        {c.links.map(link => (
                            <li key={link.label}>
                                <a href={link.href} className="hover:text-primary inline-flex items-center gap-1 transition-all duration-200">
                                    <span className="text-primary text-xs">›</span> {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Categories */}
                <div>
                    <h3 className="font-bold text-base mb-4 text-neutral after:content-[''] after:block after:w-8 after:h-0.5 after:bg-secondary after:mt-1">{c.catsTitle}</h3>
                    <ul className="flex flex-col gap-2 text-sm text-neutral/70">
                        {c.cats.map(cat => (
                            <li key={cat}>
                                <a href="#" className="hover:text-secondary inline-flex items-center gap-1 transition-all duration-200">
                                    <span className="text-secondary text-xs">›</span> {cat}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="font-bold text-base mb-4 text-neutral after:content-[''] after:block after:w-8 after:h-0.5 after:bg-accent after:mt-1">{c.newsTitle}</h3>
                    <p className="text-sm text-neutral/70 mb-4">{c.newsSub}</p>
                    <div className="flex flex-col gap-2">
                        <input type="email" placeholder={c.placeholder} className="input input-bordered input-sm w-full bg-base-100 focus:outline-primary text-sm" />
                        <button className="btn btn-primary btn-sm w-full text-white">{c.subscribe}</button>
                    </div>
                </div>
            </div>

            <div className="border-t border-neutral/10" />
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral/50">
                <span>© {new Date().getFullYear()} {c.copy}</span>
                <div className="flex gap-4">
                    <a href="#" className="hover:text-primary transition-colors">{c.privacy}</a>
                    <a href="#" className="hover:text-primary transition-colors">{c.terms}</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
