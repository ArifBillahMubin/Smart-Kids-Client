import { motion } from 'framer-motion';
import { FaPlay, FaLock, FaCheckCircle, FaClock } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';

const courses = [
    { title: 'Mathematics Class 3', titleBn: 'গণিত ক্লাস ৩', subject: 'Math', progress: 83, lessons: 24, done: 20, color: 'bg-primary', emoji: '🔢', status: 'active' },
    { title: 'Science Wonders', titleBn: 'বিজ্ঞানের জগৎ', subject: 'Science', progress: 72, lessons: 18, done: 13, color: 'bg-success', emoji: '🔬', status: 'active' },
    { title: 'English Grammar', titleBn: 'ইংরেজি ব্যাকরণ', subject: 'English', progress: 90, lessons: 20, done: 18, color: 'bg-accent', emoji: '📖', status: 'active' },
    { title: 'Bangla Literature', titleBn: 'বাংলা সাহিত্য', subject: 'Bangla', progress: 100, lessons: 16, done: 16, color: 'bg-secondary', emoji: '📝', status: 'completed' },
    { title: 'Coding for Kids', titleBn: 'শিশুদের কোডিং', subject: 'Coding', progress: 0, lessons: 12, done: 0, color: 'bg-warning', emoji: '💻', status: 'locked' },
];

const MyCourses = () => {
    const { lang } = useApp();

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'আমার কোর্সসমূহ' : 'My Courses'}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((c, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Header */}
                        <div className={`${c.color} p-5 flex items-center justify-between`}>
                            <span className="text-4xl">{c.emoji}</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.status === 'completed' ? 'bg-white/30 text-white' : c.status === 'locked' ? 'bg-black/20 text-white' : 'bg-white/30 text-white'}`}>
                                {c.status === 'completed' ? (lang === 'bn' ? 'সম্পন্ন' : 'Completed') : c.status === 'locked' ? (lang === 'bn' ? 'লক' : 'Locked') : (lang === 'bn' ? 'চলমান' : 'Active')}
                            </span>
                        </div>
                        {/* Body */}
                        <div className="p-5 flex flex-col gap-3">
                            <h3 className="font-bold text-neutral">{lang === 'bn' ? c.titleBn : c.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-neutral/50">
                                <FaClock /> {c.done}/{c.lessons} {lang === 'bn' ? 'লেসন' : 'lessons'}
                            </div>
                            <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${c.progress}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                    className={`h-full ${c.color} rounded-full`} />
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-neutral">{c.progress}%</span>
                                <button className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full transition-all ${c.status === 'locked' ? 'bg-base-300 text-neutral/40 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90'}`}
                                    disabled={c.status === 'locked'}>
                                    {c.status === 'locked' ? <FaLock /> : c.status === 'completed' ? <FaCheckCircle /> : <FaPlay />}
                                    {c.status === 'locked' ? (lang === 'bn' ? 'লক' : 'Locked') : c.status === 'completed' ? (lang === 'bn' ? 'পুনরায় দেখুন' : 'Review') : (lang === 'bn' ? 'চালিয়ে যান' : 'Continue')}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default MyCourses;
