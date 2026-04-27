import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router';
import { FaStar, FaUsers, FaBook, FaClock, FaCheckCircle, FaPlay, FaArrowLeft, FaGraduationCap, FaChevronDown, FaChevronUp, FaQuoteLeft } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../context/AppContext';
import { getCourseById, getCourseReviews } from '../../utils';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import EnrollModal from '../../components/modals/EnrollModal';

const CourseDetails = () => {
    const { id } = useParams();
    const { lang } = useApp();
    const [openWeek, setOpenWeek] = useState(0);
    const [enrolled, setEnrolled] = useState(false);
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);

    // useQuery — fetch course by id
    const { data: course, isLoading } = useQuery({
        queryKey: ['course', id],
        queryFn: () => getCourseById(id),
    });

    const { data: reviews = [] } = useQuery({
        queryKey: ['courseReviews', id],
        queryFn: () => getCourseReviews(id),
        enabled: !!id,
    });

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <TbFidgetSpinner className="animate-spin text-primary text-4xl" />
        </div>
    );

    if (!course) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <FaBook className="text-neutral/20 text-5xl mx-auto mb-4" />
                <p className="text-neutral font-bold text-xl">{lang === 'bn' ? 'কোর্স পাওয়া যায়নি' : 'Course not found'}</p>
                <Link to="/courses" className="mt-4 inline-block text-primary hover:underline">← {lang === 'bn' ? 'কোর্সে ফিরুন' : 'Back to Courses'}</Link>
            </div>
        </div>
    );

    const handleEnroll = () => setEnrolled(true);

    return (
        <>
        <div className="min-h-screen bg-base-200">
            {/* Hero */}
            <div className={`bg-gradient-to-br ${course.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative max-w-7xl mx-auto px-6 py-14">
                    <Link to="/courses" className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-6 transition-colors">
                        <FaArrowLeft /> {lang === 'bn' ? 'সব কোর্স' : 'All Courses'}
                    </Link>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
                        {/* Left */}
                        <div className="lg:col-span-2">
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <span className="text-6xl mb-4 block">{course.emoji}</span>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                                    {lang === 'bn' ? course.titleBn : course.title}
                                </h1>
                                <p className="text-white/80 text-base leading-relaxed max-w-2xl mb-5">
                                    {lang === 'bn' ? course.descriptionBn : course.description}
                                </p>
                                <div className="flex flex-wrap gap-4 text-white/90 text-sm">
                                    <span className="flex items-center gap-1.5"><FaStar className="text-warning" />{course.rating || '—'} ({course.reviews || 0} {lang === 'bn' ? 'রিভিউ' : 'reviews'})</span>
                                    <span className="flex items-center gap-1.5"><FaUsers />{(course.enrolled || 0).toLocaleString()} {lang === 'bn' ? 'শিক্ষার্থী' : 'students'}</span>
                                    <span className="flex items-center gap-1.5"><FaBook />{course.lessons} {lang === 'bn' ? 'লেসন' : 'lessons'}</span>
                                    <span className="flex items-center gap-1.5"><FaClock />{lang === 'bn' ? course.durationBn : course.duration}</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Enroll card — desktop */}
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                            className="hidden lg:block bg-base-100 rounded-3xl p-6 shadow-2xl border border-base-300">
                            <EnrollButton course={course} lang={lang} enrolled={enrolled} onOpen={() => setEnrollModalOpen(true)} />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* What you'll learn */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
                        className="bg-base-100 rounded-3xl border border-base-300 p-6">
                        <h2 className="text-xl font-bold text-neutral mb-5">
                            {lang === 'bn' ? 'আপনি যা শিখবেন' : "What You'll Learn"}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {(lang === 'bn' ? course.whatYouLearnBn : course.whatYouLearn).map((item, i) => (
                                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                                    className="flex items-start gap-3">
                                    <FaCheckCircle className="text-success mt-0.5 shrink-0" />
                                    <span className="text-neutral/70 text-sm">{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Curriculum */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
                        className="bg-base-100 rounded-3xl border border-base-300 p-6">
                        <h2 className="text-xl font-bold text-neutral mb-5">
                            {lang === 'bn' ? 'পাঠ্যক্রম' : 'Course Curriculum'}
                        </h2>
                        <div className="flex flex-col gap-3">
                            {course.curriculum.map((week, i) => (
                                <div key={i} className="border border-base-300 rounded-2xl overflow-hidden">
                                    <button onClick={() => setOpenWeek(openWeek === i ? -1 : i)}
                                        className="w-full flex items-center justify-between px-5 py-4 hover:bg-base-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{i + 1}</span>
                                            <div className="text-left">
                                                <p className="font-semibold text-neutral text-sm">{lang === 'bn' ? week.topicBn : week.topic}</p>
                                                <p className="text-neutral/40 text-xs">{lang === 'bn' ? week.weekBn : week.week} · {week.lessons} {lang === 'bn' ? 'লেসন' : 'lessons'}</p>
                                            </div>
                                        </div>
                                        {openWeek === i ? <FaChevronUp className="text-neutral/40 text-xs" /> : <FaChevronDown className="text-neutral/40 text-xs" />}
                                    </button>
                                    {openWeek === i && (
                                        <div className="px-5 pb-4 flex flex-col gap-2">
                                            {[...Array(week.lessons)].map((_, j) => (
                                                <div key={j} className="flex items-center gap-3 py-2 border-t border-base-300">
                                                    <FaPlay className="text-primary text-xs shrink-0" />
                                                    <span className="text-neutral/60 text-sm">
                                                        {lang === 'bn' ? `লেসন ${j + 1}: ${week.topicBn}` : `Lesson ${j + 1}: ${week.topic}`}
                                                    </span>
                                                    <span className="ml-auto text-xs text-neutral/30">~10 min</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Requirements */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
                        className="bg-base-100 rounded-3xl border border-base-300 p-6">
                        <h2 className="text-xl font-bold text-neutral mb-4">
                            {lang === 'bn' ? 'প্রয়োজনীয়তা' : 'Requirements'}
                        </h2>
                        <ul className="flex flex-col gap-2">
                            {(lang === 'bn' ? course.requirementsBn : course.requirements).map((r, i) => (
                                <li key={i} className="flex items-center gap-3 text-neutral/70 text-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />{r}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Instructor */}
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
                        className="bg-base-100 rounded-3xl border border-base-300 p-6">
                        <h2 className="text-xl font-bold text-neutral mb-5">
                            {lang === 'bn' ? 'শিক্ষক' : 'Instructor'}
                        </h2>
                        <div className="flex items-center gap-4">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${course.color} flex items-center justify-center text-white text-2xl font-bold shrink-0`}>
                                {(lang === 'bn' ? course.instructorBn : course.instructor)[0]}
                            </div>
                            <div>
                                <p className="font-bold text-neutral">{lang === 'bn' ? course.instructorBn : course.instructor}</p>
                                <p className="text-neutral/50 text-sm">{lang === 'bn' ? course.instructorRoleBn : course.instructorRole}</p>
                                <div className="flex items-center gap-1 mt-1">
                                    <FaStar className="text-warning text-xs" />
                                    <span className="text-xs font-bold text-neutral">{course.rating}</span>
                                    <span className="text-xs text-neutral/40">· {course.reviews} {lang === 'bn' ? 'রিভিউ' : 'reviews'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Reviews */}
                    {reviews.length > 0 && (
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
                            className="bg-base-100 rounded-3xl border border-base-300 p-6">
                            <h2 className="text-xl font-bold text-neutral mb-5">
                                {lang === 'bn' ? 'শিক্ষার্থীদের রিভিউ' : 'Student Reviews'}
                            </h2>
                            {/* Avg rating summary */}
                            <div className="flex items-center gap-4 mb-5 pb-5 border-b border-base-300">
                                <div className="text-center">
                                    <p className="text-4xl font-bold text-warning">
                                        {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)}
                                    </p>
                                    <div className="flex gap-0.5 justify-center mt-1">
                                        {[1,2,3,4,5].map(s => (
                                            <FaStar key={s} className={`text-xs ${s <= Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) ? 'text-warning' : 'text-base-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-neutral/40 mt-1">{reviews.length} {lang === 'bn' ? 'রিভিউ' : 'reviews'}</p>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    {[5,4,3,2,1].map(star => {
                                        const count = reviews.filter(r => r.rating === star).length;
                                        const pct = (count / reviews.length) * 100;
                                        return (
                                            <div key={star} className="flex items-center gap-2 text-xs">
                                                <span className="text-neutral/50 w-3">{star}</span>
                                                <FaStar className="text-warning text-xs shrink-0" />
                                                <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
                                                    <div className="h-full bg-warning rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                                <span className="text-neutral/40 w-4 text-right">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            {/* Review cards */}
                            <div className="flex flex-col gap-4">
                                {reviews.slice(0, 5).map((r, i) => (
                                    <motion.div key={r._id || i}
                                        initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: false }} transition={{ delay: i * 0.06 }}
                                        className="flex gap-4 p-4 rounded-2xl bg-base-200">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                                            {r.userName?.[0] || '?'}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between flex-wrap gap-1">
                                                <p className="font-semibold text-neutral text-sm">{r.userName}</p>
                                                <div className="flex gap-0.5">
                                                    {[1,2,3,4,5].map(s => (
                                                        <FaStar key={s} className={`text-xs ${s <= r.rating ? 'text-warning' : 'text-base-300'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-neutral/60 text-sm mt-1 leading-relaxed">{r.comment}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Enroll card — mobile/tablet */}
                <div className="lg:hidden">
                    <div className="bg-base-100 rounded-3xl p-6 border border-base-300 shadow-md">
                        <EnrollButton course={course} lang={lang} enrolled={enrolled} onOpen={() => setEnrollModalOpen(true)} />
                    </div>
                </div>

                {/* Tags */}
                <div className="hidden lg:block">
                    <div className="bg-base-100 rounded-3xl p-5 border border-base-300">
                        <h3 className="font-bold text-neutral mb-3 text-sm">{lang === 'bn' ? 'ট্যাগ' : 'Tags'}</h3>
                        <div className="flex flex-wrap gap-2">
                            {course.tags.map((tag, i) => (
                                <span key={i} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">{tag}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Enroll Modal */}
        <EnrollModal
            isOpen={enrollModalOpen}
            onClose={() => setEnrollModalOpen(false)}
            course={course}
            enrolled={enrolled}
            onEnrolled={() => setEnrolled(true)}
            enrolling={false}
        />
        </>
    );
};

// Simple card with price info + open modal button
const EnrollButton = ({ course, lang, enrolled, onOpen }) => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const { data: enrollments = [] } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: () => axiosSecure.get(`/enrollments/${user?.email}`).then(r => r.data),
        enabled: !!user?.email,
    });
    const isEnrolled = enrolled || enrollments.some(e => e.courseId === course?._id);

    return (
    <div className="flex flex-col gap-4">
        <div className="text-center">
            {course.priceAmount === 0 ? (
                <>
                    <p className="text-3xl font-bold text-success">{lang === 'bn' ? 'বিনামূল্যে' : 'Free'}</p>
                    <p className="text-neutral/40 text-xs mt-1">{lang === 'bn' ? 'সম্পূর্ণ বিনামূল্যে' : 'Completely Free'}</p>
                </>
            ) : (
                <>
                    <p className="text-3xl font-bold text-primary">৳{course.priceAmount}</p>
                    <p className="text-neutral/40 text-xs mt-1 line-through">৳{Math.round(course.priceAmount * 1.5)}</p>
                    <span className="text-xs font-bold bg-error/15 text-error px-2 py-0.5 rounded-full">33% OFF</span>
                </>
            )}
        </div>
        <motion.button
            whileHover={{ scale: isEnrolled ? 1 : 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={isEnrolled ? undefined : onOpen}
            className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all ${isEnrolled ? 'bg-success text-white cursor-default' : 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg'}`}>
            {isEnrolled
                ? (lang === 'bn' ? 'ভর্তি হয়েছেন!' : 'Enrolled!')
                : (lang === 'bn' ? 'এখনই ভর্তি হন' : 'Enroll Now')}
        </motion.button>
        <div className="flex flex-col gap-2 pt-2 border-t border-base-300">
            {[
                { icon: <FaBook />, en: `${course.lessons} lessons`, bn: `${course.lessons}টি লেসন` },
                { icon: <FaClock />, en: course.duration, bn: course.durationBn },
                { icon: <FaGraduationCap />, en: course.level, bn: course.levelBn },
                { icon: <FaUsers />, en: `${(course.enrolled || 0).toLocaleString()} enrolled`, bn: `${(course.enrolled || 0).toLocaleString()} ভর্তি` },
            ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-neutral/60">
                    <span className="text-primary">{item.icon}</span>
                    {lang === 'bn' ? item.bn : item.en}
                </div>
            ))}
        </div>
    </div>
    );
};

export default CourseDetails;
