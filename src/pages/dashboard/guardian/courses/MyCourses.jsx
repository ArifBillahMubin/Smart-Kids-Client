import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { FaPlay, FaCheckCircle, FaClock, FaBook, FaStar, FaTimes } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';
import { getEnrollments } from '../../../../utils';

const MyCourses = () => {
    const { lang, activeClassCourseId, setActiveClassCourseId } = useApp();
    const { user } = useAuth();
    const navigate = useNavigate();

    const { data: enrollments = [], isLoading } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: () => getEnrollments(user.email),
        enabled: !!user?.email,
    });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral">
                    {lang === 'bn' ? 'আমার কোর্সসমূহ' : 'My Courses'}
                </h2>
                <span className="text-sm text-neutral/50">
                    {enrollments.length} {lang === 'bn' ? 'টি কোর্স' : 'courses'}
                </span>
            </div>

            {/* Active class banner */}
            {activeClassCourseId && (() => {
                const active = enrollments.find(e => e.courseId === activeClassCourseId);
                return active ? (
                    <div className="flex items-center justify-between bg-success/10 border border-success/30 rounded-2xl px-5 py-3">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-success animate-pulse" />
                            <div>
                                <p className="text-xs font-bold text-success uppercase tracking-wide">
                                    {lang === 'bn' ? 'সক্রিয় ক্লাস' : 'Active Class'}
                                </p>
                                <p className="text-sm font-semibold text-neutral">{active.courseTitle}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => navigate('/my-class')}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success text-white text-xs font-bold hover:bg-success/90 transition-all">
                                <FaPlay className="text-xs" /> {lang === 'bn' ? 'ক্লাসে যান' : 'Go to Class'}
                            </button>
                            <button onClick={() => setActiveClassCourseId(null)}
                                className="w-7 h-7 rounded-xl bg-success/20 text-success hover:bg-error/20 hover:text-error flex items-center justify-center transition-all"
                                title={lang === 'bn' ? 'সরিয়ে দিন' : 'Remove'}>
                                <FaTimes className="text-xs" />
                            </button>
                        </div>
                    </div>
                ) : null;
            })()}

            {enrollments.length === 0 ? (
                <div className="bg-base-100 rounded-3xl border border-base-300 p-16 text-center">
                    <p className="text-5xl mb-4">📚</p>
                    <h3 className="font-bold text-neutral text-lg mb-2">
                        {lang === 'bn' ? 'এখনো কোনো কোর্সে ভর্তি হননি' : 'No courses enrolled yet'}
                    </h3>
                    <p className="text-neutral/50 text-sm mb-6">
                        {lang === 'bn' ? 'কোর্স ব্রাউজ করুন এবং শেখা শুরু করুন' : 'Browse courses and start learning'}
                    </p>
                    <button onClick={() => navigate('/courses')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                        {lang === 'bn' ? 'কোর্স দেখুন' : 'Browse Courses'}
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {enrollments.map((e, i) => {
                        const isActive = activeClassCourseId === e.courseId;
                        return (
                            <motion.div key={e._id || i}
                                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.08 }}
                                whileHover={{ y: -4 }}
                                className={`rounded-3xl border overflow-hidden hover:shadow-md transition-all ${isActive ? 'border-success shadow-success/20 shadow-md' : 'border-base-300 bg-base-100'}`}>

                                {/* Active indicator strip */}
                                {isActive && <div className="h-1 bg-gradient-to-r from-success to-primary" />}

                                {/* Header */}
                                <div className={`p-5 flex items-center justify-between ${isActive ? 'bg-success/5' : 'bg-gradient-to-r from-primary/10 to-secondary/5'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isActive ? 'bg-success/20' : 'bg-primary/20'}`}>
                                            📖
                                        </div>
                                        <div>
                                            <p className="font-bold text-neutral text-sm leading-tight">{e.courseTitle}</p>
                                            <p className="text-neutral/50 text-xs mt-0.5">
                                                {e.payment
                                                    ? (lang === 'bn' ? '💳 পেইড' : '💳 Paid')
                                                    : (lang === 'bn' ? '🆓 বিনামূল্যে' : '🆓 Free')}
                                            </p>
                                        </div>
                                    </div>
                                    {isActive
                                        ? <span className="flex items-center gap-1 text-xs font-bold text-success bg-success/15 px-2.5 py-1 rounded-full">
                                            <FaStar className="text-xs" /> {lang === 'bn' ? 'সক্রিয়' : 'Active'}
                                          </span>
                                        : <FaCheckCircle className="text-success text-xl shrink-0" />}
                                </div>

                                {/* Body */}
                                <div className="p-5 flex flex-col gap-3 bg-base-100">
                                    <div className="flex items-center gap-3 text-xs text-neutral/50">
                                        <span className="flex items-center gap-1">
                                            <FaClock className="text-secondary" />
                                            {lang === 'bn' ? 'ভর্তি:' : 'Enrolled:'}
                                            {' '}{new Date(e.enrolledAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {e.transactionId && (
                                        <div className="bg-base-200 rounded-xl px-3 py-2">
                                            <p className="text-xs text-neutral/40">{lang === 'bn' ? 'ট্রানজেকশন:' : 'Transaction:'}</p>
                                            <p className="text-xs font-mono text-neutral/60 truncate">{e.transactionId}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        {isActive ? (
                                            <button onClick={() => navigate('/my-class')}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-success text-white font-bold text-sm hover:bg-success/90 transition-all">
                                                <FaPlay className="text-xs" />
                                                {lang === 'bn' ? 'ক্লাসে যান' : 'Go to Class'}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => { setActiveClassCourseId(e.courseId); navigate('/my-class'); }}
                                                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all">
                                                <FaBook className="text-xs" />
                                                {lang === 'bn' ? 'এই কোর্স সেট করুন' : 'Set as Active'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
