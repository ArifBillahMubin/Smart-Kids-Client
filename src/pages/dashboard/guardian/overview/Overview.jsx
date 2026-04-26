import { motion } from 'framer-motion';
import { FaBook, FaTrophy, FaClock, FaStar, FaFire, FaArrowRight } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const Overview = () => {
    const { lang } = useApp();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: enrollments = [], isLoading } = useQuery({
        queryKey: ['enrollments', user?.email],
        queryFn: () => axiosSecure.get(`/enrollments/${user.email}`).then(r => r.data),
        enabled: !!user?.email,
    });

    const paidCount = enrollments.filter(e => e.payment).length;
    const freeCount = enrollments.filter(e => !e.payment).length;

    const stats = [
        { icon: <FaBook />, color: 'text-primary', bg: 'bg-primary/10', labelEn: 'Courses Enrolled', labelBn: 'ভর্তি কোর্স', value: enrollments.length },
        { icon: <FaTrophy />, color: 'text-secondary', bg: 'bg-secondary/10', labelEn: 'Paid Courses', labelBn: 'পেইড কোর্স', value: paidCount },
        { icon: <FaStar />, color: 'text-success', bg: 'bg-success/10', labelEn: 'Free Courses', labelBn: 'বিনামূল্যে কোর্স', value: freeCount },
        { icon: <FaClock />, color: 'text-accent', bg: 'bg-accent/10', labelEn: 'Active', labelBn: 'সক্রিয়', value: enrollments.length },
    ];

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-primary/20 via-base-100 to-secondary/10 rounded-3xl p-6 border border-base-300 flex items-center justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-2xl font-bold text-neutral">
                        {lang === 'bn'
                            ? `স্বাগতম, ${user?.displayName?.split(' ')[0] || 'অভিভাবক'}!`
                            : `Welcome back, ${user?.displayName?.split(' ')[0] || 'Guardian'}!`}
                    </h2>
                    <p className="text-neutral/50 text-sm mt-1">
                        {lang === 'bn' ? 'আপনার সন্তানের শেখার সারসংক্ষেপ।' : "Here's your child's learning summary."}
                    </p>
                </div>
                {enrollments.length > 0 && (
                    <div className="flex items-center gap-2 bg-success/15 text-success px-4 py-2 rounded-full text-sm font-bold">
                        <FaFire /> {enrollments.length} {lang === 'bn' ? 'টি কোর্সে ভর্তি' : 'courses enrolled'}
                    </div>
                )}
            </motion.div>

            {/* Stats */}
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

            {/* Recent enrollments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="bg-base-100 rounded-3xl p-6 border border-base-300">
                <div className="flex items-center justify-between mb-5">
                    <h3 className="font-bold text-neutral">{lang === 'bn' ? 'সাম্প্রতিক কোর্সসমূহ' : 'Recent Enrollments'}</h3>
                    <Link to="/dashboard/my-courses" className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                        {lang === 'bn' ? 'সব দেখুন' : 'View all'} <FaArrowRight className="text-xs" />
                    </Link>
                </div>

                {enrollments.length === 0 ? (
                    <div className="text-center py-10">
                        <FaBook className="text-primary/20 text-5xl mx-auto mb-3" />
                        <p className="text-neutral/50 text-sm mb-4">
                            {lang === 'bn' ? 'এখনো কোনো কোর্সে ভর্তি হননি' : 'No courses enrolled yet'}
                        </p>
                        <Link to="/courses"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all">
                            {lang === 'bn' ? 'কোর্স দেখুন' : 'Browse Courses'}
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {enrollments.slice(0, 5).map((e, i) => (
                            <div key={e._id || i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-base-200 transition-colors">
                                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center shrink-0">
                                    <FaBook className="text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-neutral text-sm truncate">{e.courseTitle}</p>
                                    <p className="text-neutral/40 text-xs">
                                        {new Date(e.enrolledAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${e.payment ? 'bg-primary/15 text-primary' : 'bg-success/15 text-success'}`}>
                                    {e.payment ? (lang === 'bn' ? 'পেইড' : 'Paid') : (lang === 'bn' ? 'ফ্রি' : 'Free')}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Overview;
