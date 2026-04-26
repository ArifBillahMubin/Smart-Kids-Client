import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaChartBar, FaTrophy, FaBook } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const ScoreBar = ({ score, total }) => {
    const pct = total ? Math.round((score / total) * 100) : 0;
    const color = pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-error';
    return (
        <div className="flex items-center gap-2 w-full">
            <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6 }}
                    className={`h-full ${color} rounded-full`} />
            </div>
            <span className={`text-xs font-bold shrink-0 w-10 text-right ${pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-error'}`}>
                {pct}%
            </span>
        </div>
    );
};

const Reports = () => {
    const { lang } = useApp();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: enrollments = [], isLoading: eLoading } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: () => axiosSecure.get(`/enrollments/${user.email}`).then(r => r.data),
        enabled: !!user?.email,
    });

    const { data: allQuizResults = [], isLoading: qLoading } = useQuery({
        queryKey: ['allQuizResults', user?.email],
        queryFn: async () => {
            const results = await Promise.all(
                enrollments.map(e => axiosSecure.get(`/quiz-results/${user.email}/${e.courseId}`).then(r => r.data))
            );
            return results.flat();
        },
        enabled: !!user?.email && enrollments.length > 0,
    });

    const { data: allProgress = [], isLoading: pLoading } = useQuery({
        queryKey: ['allProgress', user?.email],
        queryFn: async () => {
            const results = await Promise.all(
                enrollments.map(e => axiosSecure.get(`/lesson-progress/${user.email}/${e.courseId}`).then(r => r.data))
            );
            return results.flat();
        },
        enabled: !!user?.email && enrollments.length > 0,
    });

    const { data: allLessons = [], isLoading: lLoading } = useQuery({
        queryKey: ['allLessons', enrollments.map(e => e.courseId).join(',')],
        queryFn: async () => {
            const results = await Promise.all(
                enrollments.map(e => axiosSecure.get(`/lessons/${e.courseId}`).then(r => r.data))
            );
            return results.flat();
        },
        enabled: enrollments.length > 0,
    });

    const isLoading = eLoading || qLoading || pLoading || lLoading;

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    const completedLessons = allProgress.filter(p => p.completed).length;
    const avgScore = allQuizResults.length
        ? Math.round(allQuizResults.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / allQuizResults.length)
        : 0;
    const passedCount = allQuizResults.filter(q => q.passed).length;

    // Helper — get lesson title by lessonId
    const getLessonTitle = (lessonId) => {
        const lesson = allLessons.find(l => l._id === lessonId);
        if (!lesson) return lessonId;
        return lang === 'bn' ? (lesson.titleBn || lesson.title) : lesson.title;
    };

    // Group quiz results by course
    const byCourse = enrollments.map(e => ({
        ...e,
        results: allQuizResults.filter(r => r.courseId === e.courseId),
        progress: allProgress.filter(p => p.courseId === e.courseId),
    }));

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-neutral">
                {lang === 'bn' ? 'পারফরম্যান্স রিপোর্ট' : 'Performance Reports'}
            </h2>

            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { icon: <FaBook />, labelEn: 'Enrolled', labelBn: 'ভর্তি', value: enrollments.length, color: 'text-primary', bg: 'bg-primary/10' },
                    { icon: <FaCheckCircle />, labelEn: 'Lessons Done', labelBn: 'লেসন শেষ', value: completedLessons, color: 'text-success', bg: 'bg-success/10' },
                    { icon: <FaChartBar />, labelEn: 'Avg Score', labelBn: 'গড় স্কোর', value: `${avgScore}%`, color: 'text-accent', bg: 'bg-accent/10' },
                    { icon: <FaTrophy />, labelEn: 'Quizzes Passed', labelBn: 'কুইজ পাস', value: passedCount, color: 'text-warning', bg: 'bg-warning/10' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-base-100 rounded-3xl p-5 border border-base-300 flex flex-col gap-3">
                        <div className={`${s.bg} ${s.color} w-10 h-10 rounded-2xl flex items-center justify-center text-lg`}>{s.icon}</div>
                        <div>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                            <p className="text-neutral/50 text-xs mt-0.5">{lang === 'bn' ? s.labelBn : s.labelEn}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Per-course breakdown */}
            {byCourse.map((course, ci) => (
                <motion.div key={course.courseId || ci}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ci * 0.1 }}
                    className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden">

                    {/* Course header */}
                    <div className="flex items-center justify-between px-6 py-4 bg-base-200 border-b border-base-300">
                        <div>
                            <h3 className="font-bold text-neutral">{course.courseTitle}</h3>
                            <p className="text-neutral/50 text-xs mt-0.5">
                                {course.progress.filter(p => p.completed).length}/{course.progress.length} {lang === 'bn' ? 'লেসন সম্পন্ন' : 'lessons completed'}
                                {course.results.length > 0 && ` · ${course.results.length} ${lang === 'bn' ? 'কুইজ' : 'quizzes'}`}
                            </p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${course.payment ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success'}`}>
                            {course.payment ? (lang === 'bn' ? 'পেইড' : 'Paid') : (lang === 'bn' ? 'ফ্রি' : 'Free')}
                        </span>
                    </div>

                    {/* Quiz results per lesson */}
                    {course.results.length > 0 ? (
                        <div className="divide-y divide-base-300">
                            {course.results.map((r, i) => {
                                const pct = Math.round((r.score / r.total) * 100);
                                return (
                                    <motion.div key={r._id || i}
                                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                        className="flex items-center gap-4 px-6 py-4 hover:bg-base-200/50 transition-colors">

                                        {/* Lesson icon + title */}
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-sm font-bold text-white ${pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-error'}`}>
                                            {r.score}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-neutral text-sm truncate">
                                                {getLessonTitle(r.lessonId)}
                                            </p>
                                            <div className="mt-1.5">
                                                <ScoreBar score={r.score} total={r.total} />
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-1 shrink-0">
                                            <span className="text-xs font-bold text-neutral">{r.score}/{r.total}</span>
                                            {r.passed
                                                ? <span className="flex items-center gap-1 text-success text-xs font-bold"><FaCheckCircle />{lang === 'bn' ? 'পাস' : 'Pass'}</span>
                                                : <span className="flex items-center gap-1 text-error text-xs font-bold"><FaTimesCircle />{lang === 'bn' ? 'ফেল' : 'Fail'}</span>}
                                            <span className="text-neutral/30 text-xs">
                                                {r.attemptedAt ? new Date(r.attemptedAt).toLocaleDateString() : '—'}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="px-6 py-8 text-center text-neutral/40 text-sm">
                            {lang === 'bn' ? 'এখনো কোনো কুইজ দেওয়া হয়নি' : 'No quizzes taken yet'}
                        </div>
                    )}
                </motion.div>
            ))}

            {enrollments.length === 0 && (
                <div className="bg-base-100 rounded-3xl border border-base-300 p-16 text-center">
                    <FaChartBar className="text-neutral/20 text-5xl mx-auto mb-4" />
                    <p className="text-neutral/50">{lang === 'bn' ? 'এখনো কোনো কোর্সে ভর্তি হননি' : 'No courses enrolled yet'}</p>
                </div>
            )}
        </div>
    );
};

export default Reports;
