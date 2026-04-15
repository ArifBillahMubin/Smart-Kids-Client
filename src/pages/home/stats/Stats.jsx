import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from 'react-spring';
import { FaUserGraduate, FaBookOpen, FaChalkboardTeacher, FaStar, FaSmile } from 'react-icons/fa';
import { Player } from '@lottiefiles/react-lottie-player';
import { useApp } from '../../../context/AppContext';

const statsData = {
    en: [
        { icon: <FaUserGraduate />, value: 12000, suffix: '+', label: 'Happy Students', color: 'text-primary', bg: 'bg-primary/10' },
        { icon: <FaBookOpen />, value: 500, suffix: '+', label: 'Courses Available', color: 'text-secondary', bg: 'bg-secondary/10' },
        { icon: <FaChalkboardTeacher />, value: 80, suffix: '+', label: 'Expert Teachers', color: 'text-accent', bg: 'bg-accent/10' },
        { icon: <FaStar />, value: 4.9, suffix: '', label: 'Average Rating', color: 'text-warning', bg: 'bg-warning/10', decimal: true },
        { icon: <FaSmile />, value: 98, suffix: '%', label: 'Parent Satisfaction', color: 'text-success', bg: 'bg-success/10' },
    ],
    bn: [
        { icon: <FaUserGraduate />, value: 12000, suffix: '+', label: 'খুশি শিক্ষার্থী', color: 'text-primary', bg: 'bg-primary/10' },
        { icon: <FaBookOpen />, value: 500, suffix: '+', label: 'কোর্স উপলব্ধ', color: 'text-secondary', bg: 'bg-secondary/10' },
        { icon: <FaChalkboardTeacher />, value: 80, suffix: '+', label: 'বিশেষজ্ঞ শিক্ষক', color: 'text-accent', bg: 'bg-accent/10' },
        { icon: <FaStar />, value: 4.9, suffix: '', label: 'গড় রেটিং', color: 'text-warning', bg: 'bg-warning/10', decimal: true },
        { icon: <FaSmile />, value: 98, suffix: '%', label: 'অভিভাবক সন্তুষ্টি', color: 'text-success', bg: 'bg-success/10' },
    ],
};

const headings = {
    en: { badge: '🏆 Our Numbers', title: 'Trusted by Thousands of', highlight: 'Families', sub: "SmartKids is growing every day — here's what we've achieved together." },
    bn: { badge: '🏆 আমাদের সংখ্যা', title: 'হাজারো পরিবারের', highlight: 'বিশ্বাস', sub: 'SmartKids প্রতিদিন বাড়ছে — একসাথে আমরা যা অর্জন করেছি।' },
};

const SpringCounter = ({ value, decimal, suffix, color, inView }) => {
    const { number } = useSpring({
        from: { number: 0 },
        to: { number: inView ? value : 0 },
        config: { duration: 2000 },
    });

    return (
        <animated.span className={`text-4xl font-extrabold ${color}`}>
            {number.to(n => (decimal ? n.toFixed(1) : Math.floor(n)) + suffix)}
        </animated.span>
    );
};

const StatCard = ({ stat, inView, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ scale: 1.06, y: -6 }}
        className="flex flex-col items-center text-center gap-4 bg-base-100 border border-base-300 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
        <div className={`${stat.bg} ${stat.color} w-16 h-16 rounded-2xl flex items-center justify-center text-2xl`}>
            {stat.icon}
        </div>
        <div>
            <SpringCounter value={stat.value} decimal={stat.decimal} suffix={stat.suffix} color={stat.color} inView={inView} />
            <p className="text-neutral/60 text-sm mt-1 font-medium">{stat.label}</p>
        </div>
    </motion.div>
);

const Stats = () => {
    const { lang } = useApp();
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    const h = headings[lang];
    const stats = statsData[lang];

    useEffect(() => {
        setInView(false);
        const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); else setInView(false); }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [lang]);

    return (
        <section ref={ref} className="py-16 px-6 bg-base-200">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.5 }} className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">{h.badge}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-neutral">{h.title} <span className="text-primary">{h.highlight}</span></h2>
                    <p className="text-neutral/50 text-sm mt-2 max-w-md mx-auto">{h.sub}</p>
                </motion.div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
                    {stats.map((s, i) => <StatCard key={i} stat={s} inView={inView} index={i} />)}
                </div>

                {/* Lottie celebration at bottom */}
                <div className="flex justify-center mt-6">
                    <Player autoplay loop src="https://assets10.lottiefiles.com/packages/lf20_jR229r.json"
                        style={{ width: 120, height: 120 }} />
                </div>
            </div>
        </section>
    );
};

export default Stats;
