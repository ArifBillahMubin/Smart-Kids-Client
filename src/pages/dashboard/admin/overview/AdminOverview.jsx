import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaStar, FaChartLine, FaArrowRight, FaUserCheck } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const AdminOverview = () => {
    const { lang } = useApp();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: stats, isLoading: sLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: () => axiosSecure.get('/admin/stats').then(r => r.data),
    });

    const { data: users = [], isLoading: uLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => axiosSecure.get('/admin/users').then(r => r.data),
    });

    const { data: analytics, isLoading: aLoading } = useQuery({
        queryKey: ['adminAnalytics'],
        queryFn: () => axiosSecure.get('/admin/analytics').then(r => r.data),
    });

    const isLoading = sLoading || uLoading || aLoading;

    const statCards = [
        { icon: <FaUsers />, color: 'text-primary', bg: 'bg-primary/10', labelEn: 'Total Users', labelBn: 'মোট ব্যবহারকারী', value: stats?.users || 0 },
        { icon: <FaBook />, color: 'text-secondary', bg: 'bg-secondary/10', labelEn: 'Total Courses', labelBn: 'মোট কোর্স', value: stats?.courses || 0 },
        { icon: <FaUserCheck />, color: 'text-success', bg: 'bg-success/10', labelEn: 'Enrollments', labelBn: 'ভর্তি', value: stats?.enrollments || 0 },
        { icon: <FaStar />, color: 'text-warning', bg: 'bg-warning/10', labelEn: 'Reviews', labelBn: 'রিভিউ', value: stats?.reviews || 0 },
    ];

    const recentUsers = users.slice(0, 5);

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-error/10 via-base-100 to-primary/10 rounded-3xl p-6 border border-base-300">
                <h2 className="text-2xl font-bold text-neutral">
                    {lang === 'bn' ? `অ্যাডমিন ড্যাশবোর্ড 🛡️` : `Admin Dashboard 🛡️`}
                </h2>
                <p className="text-neutral/50 text-sm mt-1">
                    {lang === 'bn' ? 'সম্পূর্ণ প্ল্যাটফর্মের সারসংক্ষেপ' : 'Complete platform overview'}
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={container} initial="hidden" animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                    <motion.div key={i} variants={card} whileHover={{ scale: 1.03, y: -3 }}
                        className="bg-base-100 rounded-3xl p-5 border border-base-300 flex flex-col gap-3">
                        <div className={`${s.bg} ${s.color} w-11 h-11 rounded-2xl flex items-center justify-center text-lg`}>{s.icon}</div>
                        <div>
                            <p className="text-2xl font-bold text-neutral">{s.value.toLocaleString()}</p>
                            <p className="text-neutral/50 text-xs mt-0.5">{lang === 'bn' ? s.labelBn : s.labelEn}</p>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent users */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bg-base-100 rounded-3xl p-6 border border-base-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-neutral">{lang === 'bn' ? 'সাম্প্রতিক ব্যবহারকারী' : 'Recent Users'}</h3>
                        <Link to="/admin/users" className="text-primary text-xs font-bold flex items-center gap-1 hover:gap-2 transition-all">
                            {lang === 'bn' ? 'সব দেখুন' : 'View all'} <FaArrowRight className="text-xs" />
                        </Link>
                    </div>
                    <div className="flex flex-col gap-2">
                        {recentUsers.map((u, i) => (
                            <div key={u._id || i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-base-200 transition-colors">
                                <img src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=4F9CF9&color=fff`}
                                    className="w-9 h-9 rounded-full object-cover shrink-0" alt="" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-neutral text-sm truncate">{u.name}</p>
                                    <p className="text-neutral/40 text-xs truncate">{u.email}</p>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${u.role === 'admin' ? 'bg-error/15 text-error' : 'bg-primary/15 text-primary'}`}>
                                    {u.role || 'guardian'}
                                </span>
                            </div>
                        ))}
                        {recentUsers.length === 0 && <p className="text-neutral/40 text-sm text-center py-4">No users yet</p>}
                    </div>
                </motion.div>

                {/* Top courses */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    className="bg-base-100 rounded-3xl p-6 border border-base-300">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-neutral">{lang === 'bn' ? 'জনপ্রিয় কোর্স' : 'Top Courses'}</h3>
                        <FaChartLine className="text-primary" />
                    </div>
                    <div className="flex flex-col gap-3">
                        {analytics?.topCourses?.map((c, i) => (
                            <div key={c._id || i} className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 ${i === 0 ? 'bg-warning' : i === 1 ? 'bg-neutral/40' : 'bg-accent/60'}`}>
                                    {i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-neutral truncate">{c.title}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex-1 h-1.5 bg-base-300 rounded-full overflow-hidden">
                                            <div className="h-full bg-primary rounded-full"
                                                style={{ width: `${analytics.topCourses[0]?.count ? (c.count / analytics.topCourses[0].count) * 100 : 0}%` }} />
                                        </div>
                                        <span className="text-xs text-neutral/50 shrink-0">{c.count}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {!analytics?.topCourses?.length && <p className="text-neutral/40 text-sm text-center py-4">No enrollment data yet</p>}
                    </div>
                </motion.div>
            </div>

            {/* Quick actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-base-100 rounded-3xl p-6 border border-base-300">
                <h3 className="font-bold text-neutral mb-4">{lang === 'bn' ? 'দ্রুত কার্যক্রম' : 'Quick Actions'}</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                        { label: 'Add Course', labelBn: 'নতুন কোর্স', to: '/admin/courses', color: 'bg-primary/10 text-primary hover:bg-primary hover:text-white' },
                        { label: 'Manage Users', labelBn: 'ব্যবহারকারী', to: '/admin/users', color: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white' },
                        { label: 'View Reviews', labelBn: 'রিভিউ দেখুন', to: '/admin/reviews', color: 'bg-success/10 text-success hover:bg-success hover:text-white' },
                        { label: 'Reports', labelBn: 'রিপোর্ট', to: '/admin/reports', color: 'bg-accent/10 text-accent hover:bg-accent hover:text-white' },
                    ].map((a, i) => (
                        <Link key={i} to={a.to}
                            className={`py-3 px-4 rounded-2xl text-sm font-bold transition-all text-center ${a.color}`}>
                            {lang === 'bn' ? a.labelBn : a.label}
                        </Link>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default AdminOverview;
