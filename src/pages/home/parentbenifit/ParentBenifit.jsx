import React from 'react';
import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaBell, FaComments, FaStar, FaLock, FaTrophy, FaHeadset } from 'react-icons/fa';
import { useApp } from '../../../context/AppContext';

const icons = [
    { icon: <FaChartLine size={26} />, bg: 'bg-primary/10',   iconColor: 'text-primary' },
    { icon: <FaShieldAlt size={26} />, bg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: <FaBell size={26} />,      bg: 'bg-warning/10',   iconColor: 'text-warning' },
    { icon: <FaComments size={26} />,  bg: 'bg-success/10',   iconColor: 'text-success' },
    { icon: <FaStar size={26} />,      bg: 'bg-accent/10',    iconColor: 'text-accent' },
    { icon: <FaLock size={26} />,      bg: 'bg-primary/10',   iconColor: 'text-primary' },
    { icon: <FaTrophy size={26} />,    bg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: <FaHeadset size={26} />,   bg: 'bg-accent/10',    iconColor: 'text-accent' },
];

const content = {
    en: {
        badge: '⭐ For Parents',
        title: 'Parent', highlight: 'Benefits',
        sub: "Everything you need to stay connected with your child's learning journey.",
        items: [
            { title: 'Track Growth',   desc: 'Detailed weekly performance reports' },
            { title: 'Safe Learning',  desc: 'Curated content for Classes 1-5' },
            { title: 'Smart Alerts',   desc: 'Get notified on milestones & progress' },
            { title: 'Live Feedback',  desc: 'Real-time teacher-parent communication' },
            { title: 'Reward System',  desc: 'Kids earn stars & badges for learning' },
            { title: 'Privacy First',  desc: "Your child's data is always protected" },
            { title: 'Leaderboards',   desc: 'Friendly competition to boost motivation' },
            { title: '24/7 Support',   desc: 'Always here when parents need help' },
        ],
    },
    bn: {
        badge: '⭐ অভিভাবকদের জন্য',
        title: 'অভিভাবক', highlight: 'সুবিধাসমূহ',
        sub: 'আপনার সন্তানের শেখার যাত্রায় সংযুক্ত থাকতে যা যা দরকার।',
        items: [
            { title: 'অগ্রগতি ট্র্যাক',   desc: 'বিস্তারিত সাপ্তাহিক পারফরম্যান্স রিপোর্ট' },
            { title: 'নিরাপদ শিক্ষা',     desc: 'ক্লাস ১-৫ এর জন্য কিউরেটেড কন্টেন্ট' },
            { title: 'স্মার্ট অ্যালার্ট',  desc: 'মাইলস্টোন ও অগ্রগতিতে নোটিফিকেশন' },
            { title: 'লাইভ ফিডব্যাক',     desc: 'শিক্ষক-অভিভাবক রিয়েল-টাইম যোগাযোগ' },
            { title: 'পুরস্কার সিস্টেম',   desc: 'শেখার জন্য স্টার ও ব্যাজ অর্জন' },
            { title: 'গোপনীয়তা',          desc: 'আপনার সন্তানের ডেটা সবসময় সুরক্ষিত' },
            { title: 'লিডারবোর্ড',         desc: 'বন্ধুত্বপূর্ণ প্রতিযোগিতায় অনুপ্রেরণা' },
            { title: '২৪/৭ সাপোর্ট',      desc: 'অভিভাবকদের যেকোনো সময় সাহায্য' },
        ],
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.92 },
    visible: (d) => ({ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, delay: d, ease: 'easeOut' } }),
};

const ParentBenifit = () => {
    const { lang } = useApp();
    const c = content[lang];

    return (
        <section className="py-16 px-6 max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-10">
                <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
                    {c.badge}
                </span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-neutral">
                    {c.title} <span className="text-primary">{c.highlight}</span>
                </h2>
                <p className="text-neutral/50 mt-2 text-sm max-w-md">{c.sub}</p>
            </motion.div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {c.items.map((b, i) => (
                    <motion.div
                        key={`${lang}-${i}`}
                        custom={i * 0.1}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        whileHover={{ scale: 1.06, rotate: 1 }}
                        whileTap={{ scale: 0.97 }}
                        className={`${icons[i].bg} rounded-3xl p-6 flex flex-col items-center text-center gap-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300 border border-base-300`}
                    >
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.1, ease: 'easeInOut' }}
                            className={`bg-base-100 ${icons[i].iconColor} w-16 h-16 rounded-full flex items-center justify-center shadow-sm`}
                        >
                            {icons[i].icon}
                        </motion.div>
                        <div>
                            <h3 className="font-bold text-neutral text-base">{b.title}</h3>
                            <p className="text-neutral/50 text-xs mt-1 leading-relaxed">{b.desc}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default ParentBenifit;
