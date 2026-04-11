import { motion } from 'framer-motion';
import { FaBook, FaTrophy, FaClock, FaStar, FaArrowUp, FaFire } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';

const stats = [
    { icon: <FaBook />, color: 'text-primary', bg: 'bg-primary/10', labelEn: 'Courses Enrolled', labelBn: 'ভর্তি কোর্স', value: 6 },
    { icon: <FaTrophy />, color: 'text-secondary', bg: 'bg-secondary/10', labelEn: 'Badges Earned', labelBn: 'অর্জিত ব্যাজ', value: 12 },
    { icon: <FaClock />, color: 'text-accent', bg: 'bg-accent/10', labelEn: 'Hours Learned', labelBn: 'শেখার ঘণ্টা', value: 48 },
    { icon: <FaStar />, color: 'text-warning', bg: 'bg-warning/10', labelEn: 'Stars Collected', labelBn: 'সংগৃহীত স্টার', value: 320 },
];

const recentActivity = [
    { subject: 'Mathematics', topic: 'Fractions', score: 92, time: '2h ago', color: 'bg-primary' },
    { subject: 'Science', topic: 'Solar System', score: 88, time: '1d ago', color: 'bg-success' },
    { subject: 'English', topic: 'Grammar', score: 75, time: '2d ago', color: 'bg-accent' },
    { subject: 'Bangla', topic: 'Poem Reading', score: 95, time: '3d ago', color: 'bg-secondary' },
];

const weeklyProgress = [
    { day: 'Mon', value: 60 }, { day: 'Tue', value: 80 }, { day: 'Wed', value: 45 },
    { day: 'Thu', value: 90 }, { day: 'Fri', value: 70 }, { day: 'Sat', value: 85 }, { day: 'Sun', value: 55 },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Overview = () => {
    const { lang } = useApp();
    const { user } = useAuth();

    return (
        <div className="flex flex-col gap-6">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-primary/20 via-base-100 to-secondary/10 rounded-3xl p-6 border border-base-300 flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral">
                        {lang === 'bn' ? `স্বাগতম, ${user?.displayName?.split(' ')[0] || 'অভিভাবক'}! 👋` : `Welcome back, ${user?.displayName?.split(' ')[0] || 'Guardian'}! 👋`}
                    </h2>
                    <p className="text-neutral/50 text-sm mt-1">
                        {lang === 'bn' ? 'আপনার সন্তানের আজকের অগ্রগতি দেখুন।' : "Here's your child's learning summary for today."}
                    </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-success/15 text-success px-4 py-2 rounded-full text-sm font-bold">
                    <FaFire /> {lang === 'bn' ? '৭ দিনের স্ট্রিক!' : '7 Day Streak!'}
                </div>
            </motion.div>

            {/* Stat cards */}
            <motion.div variants={container} initial="hidden" animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div key={i} variants={card} whileHover={{ scale: 1.03, y: -3 }}
                        className="bg-base-100 rounded-3xl p-5 border border-base-300 flex flex-col gap-3">
                        <div className={`${s.bg} ${s.color} w-11 h-11 rounded-2xl flex items-center justify-center text-lg`}>{s.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-neutral">{s.value}</p>
                            <p className="text-neutral/50 text-xs mt-0.5">{lang === 'bn' ? s.labelBn : s.labelEn}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly progress bar chart */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-base-100 rounded-3xl p-6 border border-base-300">
                    <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'সাপ্তাহিক অগ্রগতি' : 'Weekly Progress'}</h3>
                    <div className="flex items-end gap-3 h-36">
                        {weeklyProgress.map((d, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${d.value}%` }}
                                    transition={{ duration: 0.6, delay: i * 0.08 }}
                                    className="w-full bg-primary/20 rounded-t-xl relative overflow-hidden"
                                    style={{ height: `${d.value}%` }}
                                >
                                    <div className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-xl" style={{ height: '40%' }} />
                                </motion.div>
                                <span className="text-xs text-neutral/40 font-medium">{d.day}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Child info card */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    className="bg-base-100 rounded-3xl p-6 border border-base-300 flex flex-col gap-4">
                    <h3 className="font-bold text-neutral">{lang === 'bn' ? 'সন্তানের তথ্য' : "Child's Info"}</h3>
                    <div className="flex flex-col items-center gap-3 py-2">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl">🧒</div>
                        <div className="text-center">
                            <p className="font-bold text-neutral">Rafi Ahmed</p>
                            <p className="text-xs text-neutral/50">Class 3 · Age 8</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {[{ label: 'Math', pct: 85 }, { label: 'Science', pct: 72 }, { label: 'English', pct: 90 }].map((s, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-neutral/60">{s.label}</span>
                                    <span className="font-bold text-neutral">{s.pct}%</span>
                                </div>
                                <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                                        className="h-full bg-primary rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-base-100 rounded-3xl p-6 border border-base-300">
                <h3 className="font-bold text-neutral mb-4">{lang === 'bn' ? 'সাম্প্রতিক কার্যক্রম' : 'Recent Activity'}</h3>
                <div className="flex flex-col gap-3">
                    {recentActivity.map((a, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-base-200 transition-colors">
                            <div className={`${a.color} w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                                {a.subject[0]}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-neutral text-sm">{a.subject}</p>
                                <p className="text-neutral/40 text-xs">{a.topic}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-success text-sm flex items-center gap-1"><FaArrowUp className="text-xs" />{a.score}%</p>
                                <p className="text-neutral/40 text-xs">{a.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Overview;
