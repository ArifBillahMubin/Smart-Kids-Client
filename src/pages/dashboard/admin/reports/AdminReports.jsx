import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaChartBar, FaTrophy } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../../context/AppContext';
import { getAdminStats, getAdminAnalytics, getCourses } from '../../../../utils';

const AdminReports = () => {
    const { lang } = useApp();

    const { data: stats, isLoading: sLoading } = useQuery({ queryKey: ['adminStats'], queryFn: getAdminStats });
    const { data: analytics, isLoading: aLoading } = useQuery({ queryKey: ['adminAnalytics'], queryFn: getAdminAnalytics });
    const { data: courses = [], isLoading: cLoading } = useQuery({ queryKey: ['courses'], queryFn: getCourses });

    const isLoading = sLoading || aLoading || cLoading;

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    const maxEnroll = analytics?.topCourses?.[0]?.count || 1;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'অ্যাডমিন রিপোর্ট' : 'Admin Reports'}</h2>
            </div>

            {/* Platform stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { icon: <FaUsers />, labelEn: 'Total Users', labelBn: 'মোট ব্যবহারকারী', value: stats?.users || 0, color: 'text-primary', bg: 'bg-primary/10' },
                    { icon: <FaBook />, labelEn: 'Total Courses', labelBn: 'মোট কোর্স', value: stats?.courses || 0, color: 'text-secondary', bg: 'bg-secondary/10' },
                    { icon: <FaChartBar />, labelEn: 'Enrollments', labelBn: 'ভর্তি', value: stats?.enrollments || 0, color: 'text-success', bg: 'bg-success/10' },
                    { icon: <FaTrophy />, labelEn: 'Reviews', labelBn: 'রিভিউ', value: stats?.reviews || 0, color: 'text-warning', bg: 'bg-warning/10' },
                ].map((s, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className="bg-base-100 rounded-3xl p-5 border border-base-300 flex flex-col gap-3">
                        <div className={`${s.bg} ${s.color} w-10 h-10 rounded-2xl flex items-center justify-center text-lg`}>{s.icon}</div>
                        <div>
                            <p className={`text-2xl font-bold ${s.color}`}>{s.value.toLocaleString()}</p>
                            <p className="text-neutral/50 text-xs mt-0.5">{lang === 'bn' ? s.labelBn : s.labelEn}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top courses by enrollment */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="bg-base-100 rounded-3xl p-6 border border-base-300">
                    <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'জনপ্রিয় কোর্স (ভর্তি অনুযায়ী)' : 'Top Courses by Enrollment'}</h3>
                    <div className="flex flex-col gap-4">
                        {analytics?.topCourses?.map((c, i) => (
                            <div key={c._id || i} className="flex flex-col gap-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="font-semibold text-neutral truncate flex-1 mr-2">{c.title}</span>
                                    <span className="text-neutral/50 shrink-0">{c.count} {lang === 'bn' ? 'জন' : 'enrolled'}</span>
                                </div>
                                <div className="h-2.5 bg-base-300 rounded-full overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${(c.count / maxEnroll) * 100}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="h-full bg-primary rounded-full" />
                                </div>
                            </div>
                        ))}
                        {!analytics?.topCourses?.length && (
                            <p className="text-neutral/40 text-sm text-center py-8">No enrollment data yet</p>
                        )}
                    </div>
                </motion.div>

                {/* Quiz pass rates */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    className="bg-base-100 rounded-3xl p-6 border border-base-300">
                    <h3 className="font-bold text-neutral mb-5">{lang === 'bn' ? 'কুইজ পাস রেট' : 'Quiz Pass Rates'}</h3>
                    <div className="flex flex-col gap-4">
                        {analytics?.quizStats?.map((q, i) => {
                            const course = courses.find(c => c._id === q._id);
                            const passRate = q.total ? Math.round((q.passed / q.total) * 100) : 0;
                            const avgScore = Math.round(q.avgScore || 0);
                            return (
                                <div key={q._id || i} className="flex flex-col gap-1.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-semibold text-neutral truncate flex-1 mr-2">
                                            {course?.title || q._id}
                                        </span>
                                        <span className={`shrink-0 font-bold ${passRate >= 70 ? 'text-success' : passRate >= 50 ? 'text-warning' : 'text-error'}`}>
                                            {passRate}% pass
                                        </span>
                                    </div>
                                    <div className="h-2.5 bg-base-300 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${passRate}%` }}
                                            transition={{ duration: 0.8, delay: i * 0.1 }}
                                            className={`h-full rounded-full ${passRate >= 70 ? 'bg-success' : passRate >= 50 ? 'bg-warning' : 'bg-error'}`} />
                                    </div>
                                    <p className="text-xs text-neutral/40">{q.total} attempts · avg {avgScore}%</p>
                                </div>
                            );
                        })}
                        {!analytics?.quizStats?.length && (
                            <p className="text-neutral/40 text-sm text-center py-8">No quiz data yet</p>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* All courses table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden">
                <div className="px-6 py-4 border-b border-base-300">
                    <h3 className="font-bold text-neutral">{lang === 'bn' ? 'সব কোর্সের সারসংক্ষেপ' : 'All Courses Summary'}</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-base-200 text-neutral/50 text-xs font-bold uppercase">
                                <th className="px-5 py-4 text-left">{lang === 'bn' ? 'কোর্স' : 'Course'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'বিষয়' : 'Subject'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'মূল্য' : 'Price'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'ভর্তি' : 'Enrolled'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courses.map((c, i) => (
                                <motion.tr key={c._id || i}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                    className="border-t border-base-300 hover:bg-base-200/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl">{c.emoji}</span>
                                            <span className="font-semibold text-neutral text-sm">{c.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center text-sm text-neutral/60">{c.subject}</td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`text-xs font-bold ${c.priceAmount ? 'text-primary' : 'text-success'}`}>
                                            {c.priceAmount ? `৳${c.priceAmount}` : (lang === 'bn' ? 'বিনামূল্যে' : 'Free')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-center text-sm font-bold text-neutral">
                                        {(c.enrolled || 0).toLocaleString()}
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${c.status === 'published' ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                                            {c.status}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminReports;
