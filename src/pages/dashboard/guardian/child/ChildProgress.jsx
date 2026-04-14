import { motion } from 'framer-motion';
import { FaCheckCircle, FaTrophy, FaMedal } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';
import { getEnrollments, getLessonProgress, getQuizResults } from '../../../../utils';

const COLORS = ['bg-primary', 'bg-success', 'bg-accent', 'bg-secondary', 'bg-warning'];

const badges = [
    { icon: '🏆', labelEn: 'First Enrollment', labelBn: 'প্রথম ভর্তি', check: (e) => e.length >= 1 },
    { icon: '📚', labelEn: '3 Courses', labelBn: '৩টি কোর্স', check: (e) => e.length >= 3 },
    { icon: '✅', labelEn: 'First Lesson Done', labelBn: 'প্রথম লেসন শেষ', check: (_, p) => p.some(x => x.completed) },
    { icon: '🔥', labelEn: '5 Lessons Done', labelBn: '৫টি লেসন শেষ', check: (_, p) => p.filter(x => x.completed).length >= 5 },
    { icon: '🧠', labelEn: 'First Quiz', labelBn: 'প্রথম কুইজ', check: (_, __, q) => q.length >= 1 },
    { icon: '⭐', labelEn: 'Perfect Score', labelBn: 'পারফেক্ট স্কোর', check: (_, __, q) => q.some(x => x.score === x.total) },
];

const ChildProgress = () => {
    const { lang } = useApp();
    const { user } = useAuth();

    const { data: enrollments = [], isLoading: eLoading } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: () => getEnrollments(user.email),
        enabled: !!user?.email,
    });

    // Get progress for all enrolled courses
    const { data: allProgress = [], isLoading: pLoading } = useQuery({
        queryKey: ['allProgress', user?.email],
        queryFn: async () => {
            const results = await Promise.all(
                enrollments.map(e => getLessonProgress(user.email, e.courseId))
            );
            return results.flat();
        },
        enabled: !!user?.email && enrollments.length > 0,
    });

    // Get quiz results for all courses
    const { data: allQuizResults = [], isLoading: qLoading } = useQuery({
        queryKey: ['allQuizResults', user?.email],
        queryFn: async () => {
            const results = await Promise.all(
                enrollments.map(e => getQuizResults(user.email, e.courseId))
            );
            return results.flat();
        },
        enabled: !!user?.email && enrollments.length > 0,
    });

    const isLoading = eLoading || pLoading || qLoading;

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    const completedLessons = allProgress.filter(p => p.completed).length;
    const totalLessons = allProgress.length;
    const avgScore = allQuizResults.length
        ? Math.round(allQuizResults.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / allQuizResults.length)
        : 0;

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-neutral">
                {lang === 'bn' ? 'সন্তানের অগ্রগতি' : "Child's Progress"}
            </h2>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { icon: '📚', labelEn: 'Courses', labelBn: 'কোর্স', value: enrollments.length, color: 'bg-primary/10 text-primary' },
                    { icon: '✅', labelEn: 'Lessons Done', labelBn: 'লেসন শেষ', value: completedLessons, color: 'bg-success/10 text-success' },
                    { icon: '🧠', labelEn: 'Avg Quiz Score', labelBn: 'গড় কুইজ স্কোর', value: `${avgScore}%`, color: 'bg-accent/10 text-accent' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-base-100 rounded-3xl p-5 border border-base-300 flex flex-col gap-2">
                        <span className="text-3xl">{s.icon}</span>
                        <p className={`text-2xl font-bold ${s.color.split(' ')[1]}`}>{s.value}</p>
                        <p className="text-neutral/50 text-xs">{lang === 'bn' ? s.labelBn : s.labelEn}</p>
                    </motion.div>
                ))}
            </div>

            {/* Course progress */}
            {enrollments.length > 0 && (
                <div className="bg-base-100 rounded-3xl p-6 border border-base-300">
                    <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'কোর্সভিত্তিক অগ্রগতি' : 'Course-wise Progress'}</h3>
                    <div className="flex flex-col gap-5">
                        {enrollments.map((e, i) => {
                            const courseProgress = allProgress.filter(p => p.courseId === e.courseId);
                            const done = courseProgress.filter(p => p.completed).length;
                            const total = courseProgress.length;
                            const pct = total ? Math.round((done / total) * 100) : 0;
                            return (
                                <motion.div key={e._id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <span className="font-semibold text-neutral text-sm">{e.courseTitle}</span>
                                            <span className="text-neutral/40 text-xs ml-2">{done}/{total} {lang === 'bn' ? 'লেসন' : 'lessons'}</span>
                                        </div>
                                        <span className="font-bold text-neutral">{pct}%</span>
                                    </div>
                                    <div className="h-3 bg-base-300 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                            className={`h-full ${COLORS[i % COLORS.length]} rounded-full`} />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Badges */}
            <div className="bg-base-100 rounded-3xl p-6 border border-base-300">
                <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'অর্জিত ব্যাজ' : 'Badges & Achievements'}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                    {badges.map((b, i) => {
                        const earned = b.check(enrollments, allProgress, allQuizResults);
                        return (
                            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.08 }}
                                className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 ${earned ? 'border-primary/30 bg-primary/5' : 'border-base-300 opacity-40'}`}>
                                <span className="text-3xl">{b.icon}</span>
                                <span className="text-xs font-semibold text-neutral text-center leading-tight">
                                    {lang === 'bn' ? b.labelBn : b.labelEn}
                                </span>
                                {earned && <FaCheckCircle className="text-success text-xs" />}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChildProgress;
