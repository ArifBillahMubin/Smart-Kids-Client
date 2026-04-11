import { motion } from 'framer-motion';
import { FaMedal, FaStar, FaFire, FaCheckCircle } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';

const subjects = [
    { name: 'Mathematics', nameBn: 'গণিত', score: 85, total: 100, color: 'bg-primary', lessons: 24, done: 20 },
    { name: 'Science', nameBn: 'বিজ্ঞান', score: 72, total: 100, color: 'bg-success', lessons: 18, done: 13 },
    { name: 'English', nameBn: 'ইংরেজি', score: 90, total: 100, color: 'bg-accent', lessons: 20, done: 18 },
    { name: 'Bangla', nameBn: 'বাংলা', score: 88, total: 100, color: 'bg-secondary', lessons: 16, done: 14 },
    { name: 'Coding', nameBn: 'কোডিং', score: 65, total: 100, color: 'bg-warning', lessons: 12, done: 8 },
];

const badges = [
    { icon: '🏆', label: 'Top Scorer', labelBn: 'সেরা স্কোরার', earned: true },
    { icon: '🔥', label: '7 Day Streak', labelBn: '৭ দিনের স্ট্রিক', earned: true },
    { icon: '📚', label: 'Bookworm', labelBn: 'বইপ্রেমী', earned: true },
    { icon: '⭐', label: '100 Stars', labelBn: '১০০ স্টার', earned: false },
    { icon: '🚀', label: 'Fast Learner', labelBn: 'দ্রুত শিক্ষার্থী', earned: false },
    { icon: '🎯', label: 'Perfect Score', labelBn: 'পারফেক্ট স্কোর', earned: false },
];

const ChildProgress = () => {
    const { lang } = useApp();

    return (
        <div className="flex flex-col gap-6">
            <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-2xl font-bold text-neutral">
                {lang === 'bn' ? 'সন্তানের অগ্রগতি' : "Child's Progress"}
            </motion.h2>

            {/* Subject progress */}
            <div className="bg-base-100 rounded-3xl p-6 border border-base-300">
                <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'বিষয়ভিত্তিক অগ্রগতি' : 'Subject-wise Progress'}</h3>
                <div className="flex flex-col gap-5">
                    {subjects.map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}>
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <span className="font-semibold text-neutral text-sm">{lang === 'bn' ? s.nameBn : s.name}</span>
                                    <span className="text-neutral/40 text-xs ml-2">{s.done}/{s.lessons} {lang === 'bn' ? 'লেসন' : 'lessons'}</span>
                                </div>
                                <span className="font-bold text-neutral">{s.score}%</span>
                            </div>
                            <div className="h-3 bg-base-300 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                    className={`h-full ${s.color} rounded-full`} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Badges */}
            <div className="bg-base-100 rounded-3xl p-6 border border-base-300">
                <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'অর্জিত ব্যাজ' : 'Badges & Achievements'}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {badges.map((b, i) => (
                        <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.08 }}
                            className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 ${b.earned ? 'border-primary/30 bg-primary/5' : 'border-base-300 opacity-40'}`}>
                            <span className="text-3xl">{b.icon}</span>
                            <span className="text-xs font-semibold text-neutral text-center leading-tight">
                                {lang === 'bn' ? b.labelBn : b.label}
                            </span>
                            {b.earned && <FaCheckCircle className="text-success text-xs" />}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChildProgress;
