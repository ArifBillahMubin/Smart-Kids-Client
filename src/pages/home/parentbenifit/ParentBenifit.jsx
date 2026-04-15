import { motion } from 'framer-motion';
import { FaChartLine, FaShieldAlt, FaBell, FaComments, FaStar, FaLock, FaTrophy, FaHeadset } from 'react-icons/fa';
import { useApp } from '../../../context/AppContext';

const icons = [
    { icon: <FaChartLine size={24} />, bg: 'bg-primary/15',   iconColor: 'text-primary',   ring: 'ring-primary/30' },
    { icon: <FaShieldAlt size={24} />, bg: 'bg-secondary/15', iconColor: 'text-secondary', ring: 'ring-secondary/30' },
    { icon: <FaBell size={24} />,      bg: 'bg-warning/15',   iconColor: 'text-warning',   ring: 'ring-warning/30' },
    { icon: <FaComments size={24} />,  bg: 'bg-success/15',   iconColor: 'text-success',   ring: 'ring-success/30' },
    { icon: <FaStar size={24} />,      bg: 'bg-accent/15',    iconColor: 'text-accent',    ring: 'ring-accent/30' },
    { icon: <FaLock size={24} />,      bg: 'bg-primary/15',   iconColor: 'text-primary',   ring: 'ring-primary/30' },
    { icon: <FaTrophy size={24} />,    bg: 'bg-secondary/15', iconColor: 'text-secondary', ring: 'ring-secondary/30' },
    { icon: <FaHeadset size={24} />,   bg: 'bg-accent/15',    iconColor: 'text-accent',    ring: 'ring-accent/30' },
];

const content = {
    en: {
        badge: '⭐ For Parents', title: 'Parent', highlight: 'Benefits',
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
        badge: '⭐ অভিভাবকদের জন্য', title: 'অভিভাবক', highlight: 'সুবিধাসমূহ',
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

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const cardAnim = {
    hidden: { opacity: 0, y: 40, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: 'easeOut' } },
};

const ParentBenifit = () => {
    const { lang } = useApp();
    const c = content[lang];

    return (
        <section className="py-20 px-6 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="blob absolute -top-20 -left-20 w-64 h-64 bg-primary/10 -z-10" />
            <div className="blob absolute -bottom-20 -right-20 w-56 h-56 bg-secondary/10 -z-10" />

            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="mb-12">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
                        {c.badge}
                    </span>
                    <h2 className="text-3xl md:text-4xl text-neutral">
                        {c.title} <span className="text-primary">{c.highlight}</span>
                    </h2>
                    <p className="text-neutral/50 mt-2 text-sm max-w-md">{c.sub}</p>
                </motion.div>

                <motion.div
                    key={lang}
                    variants={container}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
                >
                    {c.items.map((b, i) => (
                        <motion.div
                            key={`${lang}-${i}`}
                            variants={cardAnim}
                            whileHover={{ scale: 1.06, rotate: 1, y: -4 }}
                            whileTap={{ scale: 0.97 }}
                            className={`${icons[i].bg} rounded-3xl p-6 flex flex-col items-center text-center gap-4 cursor-pointer border border-base-300 card-glow transition-shadow duration-300`}
                        >
                            <motion.div
                                animate={{ y: [0, -8, 0] }}
                                transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.12, ease: 'easeInOut' }}
                                className={`bg-base-100 ${icons[i].iconColor} w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm ring-2 ${icons[i].ring}`}
                            >
                                {icons[i].icon}
                            </motion.div>
                            <div>
                                <h3 className="font-bold text-neutral text-base">{b.title}</h3>
                                <p className="text-neutral/50 text-xs mt-1 leading-relaxed">{b.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default ParentBenifit;
