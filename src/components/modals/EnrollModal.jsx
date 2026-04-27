import { Fragment, useState } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaBook, FaClock, FaGraduationCap, FaUsers, FaStar, FaCheckCircle, FaTimes, FaLock } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../context/AppContext';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { createCheckoutSession } from '../../utils';
import confetti from 'canvas-confetti';

const t = {
    en: {
        title: 'Enroll in Course',
        free: 'Free', freeNote: 'Completely Free',
        includes: 'This course includes:',
        lessons: 'lessons', duration: 'duration', level: 'level', students: 'students enrolled',
        loginRequired: 'Please sign in to enroll in this course.',
        loginBtn: 'Sign In to Enroll',
        enrollFreeBtn: 'Enroll Now — Free',
        enrollPaidBtn: 'Pay & Enroll',
        enrolledBtn: '✅ Enrolled!',
        cancel: 'Cancel',
        note: 'You can start learning immediately after enrolling.',
        paidNote: 'Secure payment via Stripe.',
    },
    bn: {
        title: 'কোর্সে ভর্তি হন',
        free: 'বিনামূল্যে', freeNote: 'সম্পূর্ণ বিনামূল্যে',
        includes: 'এই কোর্সে রয়েছে:',
        lessons: 'লেসন', duration: 'সময়কাল', level: 'স্তর', students: 'শিক্ষার্থী ভর্তি',
        loginRequired: 'এই কোর্সে ভর্তি হতে সাইন ইন করুন।',
        loginBtn: 'সাইন ইন করুন',
        enrollFreeBtn: 'এখনই ভর্তি হন — বিনামূল্যে',
        enrollPaidBtn: 'পেমেন্ট করুন ও ভর্তি হন',
        enrolledBtn: '✅ ভর্তি হয়েছেন!',
        cancel: 'বাতিল',
        note: 'ভর্তির পরপরই শেখা শুরু করতে পারবেন।',
        paidNote: 'Stripe এর মাধ্যমে নিরাপদ পেমেন্ট।',
    },
};

const EnrollModal = ({ isOpen, onClose, course, enrolled, onEnrolled }) => {
    const { lang } = useApp();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const c = t[lang];
    const [loading, setLoading] = useState(false);

    const { data: enrollments = [] } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: () => axiosSecure.get(`/enrollments/${user.email}`).then(r => r.data),
        enabled: !!user?.email,
    });

    const alreadyEnrolled = enrollments.some(e => e.courseId === course?._id);
    // Use prop enrolled OR DB check
    const isEnrolled = enrolled || alreadyEnrolled;

    if (!course) return null;

    const isFree = !course.priceAmount || course.priceAmount === 0;

    const handleEnroll = async () => {
        if (!user) return;
        setLoading(true);
        try {
            if (isFree) {
                await axiosSecure.post('/enrollments', {
                    courseId:    course._id,
                    courseTitle: course.title,
                    userEmail:   user.email,
                    userName:    user.displayName,
                    payment:     false,
                    enrolledAt:  new Date(),
                });
                confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#4F9CF9', '#FF9F43', '#F472B6', '#4ADE80'] });
                toast.success(lang === 'bn' ? 'সফলভাবে ভর্তি হয়েছেন!' : 'Enrolled successfully!');
                onEnrolled?.();
                onClose();
            } else {
                // Paid — redirect to Stripe
                const { url } = await createCheckoutSession({
                    courseId:    course._id,
                    courseTitle: course.title,
                    description: course.description || '',
                    priceAmount: course.priceAmount,
                    userEmail:   user.email,
                    userName:    user.displayName,
                });
                window.location.href = url;
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const includes = [
        { icon: <FaBook className="text-primary" />,       label: `${course.lessons || 0} ${c.lessons}` },
        { icon: <FaClock className="text-secondary" />,    label: lang === 'bn' ? (course.durationBn || course.duration) : course.duration },
        { icon: <FaGraduationCap className="text-accent" />, label: lang === 'bn' ? (course.levelBn || course.level) : course.level },
        { icon: <FaUsers className="text-success" />,      label: `${(course.enrolled || 0).toLocaleString()} ${c.students}` },
    ];

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                {/* Backdrop */}
                <TransitionChild as={Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild as={Fragment}
                            enter="ease-out duration-250" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="bg-base-100 rounded-3xl w-full max-w-md border border-base-300 shadow-2xl overflow-hidden">

                                {/* Course header */}
                                <div className={`bg-gradient-to-br ${course.color || 'from-primary to-primary/60'} p-6 relative`}>
                                    <button onClick={onClose}
                                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
                                        <FaTimes className="text-sm" />
                                    </button>
                                    <div className="flex items-center gap-4">
                                        <span className="text-5xl">{course.emoji}</span>
                                        <div>
                                            <DialogTitle className="text-white font-bold text-lg leading-tight">
                                                {lang === 'bn' ? (course.titleBn || course.title) : course.title}
                                            </DialogTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-white/80 text-xs">{lang === 'bn' ? (course.classBn || course.class) : course.class}</span>
                                                <span className="text-white/40">·</span>
                                                <div className="flex items-center gap-1">
                                                    <FaStar className="text-warning text-xs" />
                                                    <span className="text-white/80 text-xs">{course.rating || '—'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col gap-5">
                                    {/* Price */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-neutral/60 text-sm font-medium">{c.title}</span>
                                        {isFree ? (
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-success">{c.free}</p>
                                                <p className="text-xs text-neutral/40">{c.freeNote}</p>
                                            </div>
                                        ) : (
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-primary">৳{course.priceAmount}</p>
                                                <p className="text-xs text-neutral/40 line-through">৳{Math.round(course.priceAmount * 1.5)}</p>
                                                <span className="text-xs font-bold bg-error/15 text-error px-2 py-0.5 rounded-full">33% OFF</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Includes */}
                                    <div>
                                        <p className="text-sm font-semibold text-neutral mb-3">{c.includes}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {includes.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2 text-sm text-neutral/70">
                                                    {item.icon} {item.label}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* What you'll learn preview */}
                                    {course.whatYouLearn?.length > 0 && (
                                        <div className="bg-base-200 rounded-2xl p-4 flex flex-col gap-2">
                                            {course.whatYouLearn.slice(0, 3).map((item, i) => (
                                                <div key={i} className="flex items-start gap-2 text-xs text-neutral/70">
                                                    <FaCheckCircle className="text-success mt-0.5 shrink-0" />
                                                    {item}
                                                </div>
                                            ))}
                                            {course.whatYouLearn.length > 3 && (
                                                <p className="text-xs text-primary font-semibold">+{course.whatYouLearn.length - 3} more...</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Note */}
                                    <p className="text-xs text-neutral/40 text-center flex items-center justify-center gap-1">
                                        {!isFree && <FaLock className="text-xs" />}
                                        {isFree ? c.note : c.paidNote}
                                    </p>

                                    {/* Action buttons */}
                                    {!user ? (
                                        <div className="flex flex-col gap-2">
                                            <p className="text-center text-sm text-neutral/50">{c.loginRequired}</p>
                                            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                                onClick={() => { onClose(); navigate('/login'); }}
                                                className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                                                {c.loginBtn}
                                            </motion.button>
                                        </div>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button onClick={onClose}
                                                className="flex-1 py-3 rounded-2xl border-2 border-base-300 text-neutral font-semibold hover:bg-base-200 transition-all text-sm">
                                                {c.cancel}
                                            </button>
                                            <motion.button
                                                whileHover={{ scale: isEnrolled ? 1 : 1.02 }}
                                                whileTap={{ scale: 0.97 }}
                                                onClick={isEnrolled ? undefined : handleEnroll}
                                                disabled={loading || isEnrolled}
                                                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isEnrolled ? 'bg-success text-white cursor-default' : 'bg-primary text-white hover:bg-primary/90 shadow-md'} disabled:opacity-70`}>
                                                {loading && <TbFidgetSpinner className="animate-spin" />}
                                                {isEnrolled ? c.enrolledBtn : isFree ? c.enrollFreeBtn : c.enrollPaidBtn}
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default EnrollModal;
