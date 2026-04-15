import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRedo } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';
import { getEnrollments, getLessonProgress, getQuizResults, resetCourseProgress, getLessons } from '../../../../utils';
import ReviewModal from '../../../../components/modals/ReviewModal';

const COLORS = ['bg-primary', 'bg-success', 'bg-accent', 'bg-secondary', 'bg-warning'];

const badges = [
    { icon: '🏆', labelEn: 'First Enrollment', labelBn: 'প্রথম ভর্তি', check: (e) => e.length >= 1 },
    { icon: '📚', labelEn: '3 Courses', labelBn: '৩টি কোর্স', check: (e) => e.length >= 3 },
    { icon: '✅', labelEn: 'First Lesson Done', labelBn: 'প্রথম লেসন শেষ', check: (_, p) => p.some(x => x.completed) },
    { icon: '🔥', labelEn: '5 Lessons Done', labelBn: '৫টি লেসন শেষ', check: (_, p) => p.filter(x => x.completed).length >= 5 },
    { icon: '🧠', labelEn: 'First Quiz', labelBn: 'প্রথম কুইজ', check: (_, __, q) => q.length >= 1 },
    { icon: '⭐', labelEn: 'Perfect Score', labelBn: 'পারফেক্ট স্কোর', check: (_, __, q) => q.some(x => x.score === x.total) },
    { icon: '🎓', labelEn: 'Course Complete', labelBn: 'কোর্স সম্পন্ন', check: (_, p, __, lessons) => {
        if (!lessons.length) return false;
        const courseIds = [...new Set(lessons.map(l => l.courseId))];
        return courseIds.some(cid => {
            const courseLessons = lessons.filter(l => l.courseId === cid);
            const done = p.filter(x => x.courseId === cid && x.completed).length;
            return courseLessons.length > 0 && done >= courseLessons.length;
        });
    }},
];

const ChildProgress = () => {
    const { lang } = useApp();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [reviewCourse, setReviewCourse] = useState(null);

    const { data: enrollments = [], isLoading: eLoading } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: () => getEnrollments(user.email),
        enabled: !!user?.email,
    });

    const { data: allProgress = [], isLoading: pLoading } = useQuery({
        queryKey: ['allProgress', user?.email],
        queryFn: async () => {
            const results = await Promise.all(enrollments.map(e => getLessonProgress(user.email, e.courseId)));
            return results.flat();
        },
        enabled: !!user?.email && enrollments.length > 0,
    });

    const { data: allQuizResults = [], isLoading: qLoading } = useQuery({
        queryKey: ['allQuizResults', user?.email],
        queryFn: async () => {
            const results = await Promise.all(enrollments.map(e => getQuizResults(user.email, e.courseId)));
            return results.flat();
        },
        enabled: !!user?.email && enrollments.length > 0,
    });

    const { data: allLessons = [], isLoading: lLoading } = useQuery({
        queryKey: ['allLessons', enrollments.map(e => e.courseId).join(',')],
        queryFn: async () => {
            const results = await Promise.all(enrollments.map(e => getLessons(e.courseId)));
            return results.flat();
        },
        enabled: enrollments.length > 0,
    });

    const resetMutation = useMutation({
        mutationFn: ({ courseId }) => resetCourseProgress(user.email, courseId),
        onSuccess: (_, { courseTitle }) => {
            queryClient.invalidateQueries({ queryKey: ['allProgress', user?.email] });
            queryClient.invalidateQueries({ queryKey: ['allQuizResults', user?.email] });
            queryClient.invalidateQueries({ queryKey: ['lessonProgress', user?.email] });
            toast.success(lang === 'bn' ? `${courseTitle} রিস্টার্ট হয়েছে!` : `${courseTitle} restarted!`);
        },
    });

    const handleRestart = async (enrollment) => {
        const result = await Swal.fire({
            title: lang === 'bn' ? 'কোর্স রিস্টার্ট করবেন?' : 'Restart Course?',
            text: lang === 'bn' ? 'সব অগ্রগতি ও কুইজ ফলাফল মুছে যাবে।' : 'All progress and quiz results will be deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: lang === 'bn' ? 'হ্যাঁ, রিস্টার্ট করুন' : 'Yes, restart',
            cancelButtonText: lang === 'bn' ? 'বাতিল' : 'Cancel',
        });
        if (result.isConfirmed) {
            resetMutation.mutate({ courseId: enrollment.courseId, courseTitle: enrollment.courseTitle });
        }
    };

    const isLoading = eLoading || pLoading || qLoading || lLoading;

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    const completedLessons = allProgress.filter(p => p.completed).length;
    const avgScore = allQuizResults.length
        ? Math.round(allQuizResults.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / allQuizResults.length)
        : 0;

    return (
        <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-neutral">
                {lang === 'bn' ? 'সন্তানের অগ্রগতি' : "Child's Progress"}
            </h2>

            {/* Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                    { icon: '📚', labelEn: 'Courses', labelBn: 'কোর্স', value: enrollments.length, color: 'text-primary' },
                    { icon: '✅', labelEn: 'Lessons Done', labelBn: 'লেসন শেষ', value: completedLessons, color: 'text-success' },
                    { icon: '🧠', labelEn: 'Avg Quiz Score', labelBn: 'গড় কুইজ স্কোর', value: `${avgScore}%`, color: 'text-accent' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-base-100 rounded-3xl p-5 border border-base-300 flex flex-col gap-2">
                        <span className="text-3xl">{s.icon}</span>
                        <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                        <p className="text-neutral/50 text-xs">{lang === 'bn' ? s.labelBn : s.labelEn}</p>
                    </motion.div>
                ))}
            </div>

            {/* Course progress with restart */}
            {enrollments.length > 0 && (
                <div className="bg-base-100 rounded-3xl p-6 border border-base-300">
                    <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'কোর্সভিত্তিক অগ্রগতি' : 'Course-wise Progress'}</h3>
                    <div className="flex flex-col gap-5">
                        {enrollments.map((e, i) => {
                            const courseLessons = allLessons.filter(l => l.courseId === e.courseId);
                            const courseProgress = allProgress.filter(p => p.courseId === e.courseId);
                            const done = courseProgress.filter(p => p.completed).length;
                            const total = courseLessons.length;
                            const pct = total ? Math.round((done / total) * 100) : 0;
                            const isComplete = total > 0 && done >= total;

                            return (
                                <motion.div key={e._id || i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                                    <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-neutral text-sm">{e.courseTitle}</span>
                                            {isComplete && (
                                                <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
                                                    <FaCheckCircle className="text-xs" /> {lang === 'bn' ? 'সম্পন্ন' : 'Complete'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-neutral/40 text-xs">{done}/{total} {lang === 'bn' ? 'লেসন' : 'lessons'}</span>
                                            <span className="font-bold text-neutral text-sm">{pct}%</span>
                                            {/* Restart button */}
                                            <button onClick={() => handleRestart(e)}
                                                disabled={resetMutation.isPending}
                                                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-warning/10 text-warning hover:bg-warning hover:text-white transition-all font-bold disabled:opacity-50"
                                                title={lang === 'bn' ? 'রিস্টার্ট' : 'Restart'}>
                                                <FaRedo className="text-xs" /> {lang === 'bn' ? 'রিস্টার্ট' : 'Restart'}
                                            </button>
                                            {/* Review button — only if complete */}
                                            {isComplete && (
                                                <button onClick={() => setReviewCourse(e)}
                                                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all font-bold">
                                                    ⭐ {lang === 'bn' ? 'রিভিউ' : 'Review'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="h-3 bg-base-300 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                            transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                                            className={`h-full ${isComplete ? 'bg-success' : COLORS[i % COLORS.length]} rounded-full`} />
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
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-4">
                    {badges.map((b, i) => {
                        const earned = b.check(enrollments, allProgress, allQuizResults, allLessons);
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

            {/* Review Modal */}
            {reviewCourse && (
                <ReviewModal
                    isOpen={!!reviewCourse}
                    onClose={() => setReviewCourse(null)}
                    course={{ _id: reviewCourse.courseId, title: reviewCourse.courseTitle, color: 'from-primary to-primary/60' }}
                    userEmail={user?.email}
                    userName={user?.displayName}
                />
            )}
        </div>
    );
};

export default ChildProgress;
