import { motion } from 'framer-motion';
import { FaDownload, FaUsers, FaBook, FaChartLine } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';

const monthlyData = [
    { month: 'Jan', users: 820, courses: 45, revenue: 120000 },
    { month: 'Feb', users: 1050, courses: 52, revenue: 145000 },
    { month: 'Mar', users: 1380, courses: 58, revenue: 180000 },
    { month: 'Apr', users: 1842, courses: 64, revenue: 240000 },
];

const AdminReports = () => {
    const { lang } = useApp();
    const maxUsers = Math.max(...monthlyData.map(d => d.users));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'অ্যাডমিন রিপোর্ট' : 'Admin Reports'}</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
                    <FaDownload /> {lang === 'bn' ? 'রিপোর্ট ডাউনলোড' : 'Export Report'}
                </button>
            </div>

            {/* Monthly growth chart */}
            <div className="bg-base-100 rounded-3xl border border-base-300 p-6">
                <h3 className="font-bold text-neutral mb-6">{lang === 'bn' ? 'মাসিক ব্যবহারকারী বৃদ্ধি' : 'Monthly User Growth'}</h3>
                <div className="flex items-end gap-6 h-48">
                    {monthlyData.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-2">
                            <span className="text-xs font-bold text-neutral">{d.users.toLocaleString()}</span>
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${(d.users / maxUsers) * 100}%` }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className="w-full bg-gradient-to-t from-primary to-primary/40 rounded-t-2xl"
                                style={{ height: `${(d.users / maxUsers) * 100}%` }}
                            />
                            <span className="text-xs text-neutral/40 font-medium">{d.month}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Monthly table */}
            <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-base-200 text-neutral/50 text-xs font-bold uppercase">
                                <th className="px-5 py-4 text-left">{lang === 'bn' ? 'মাস' : 'Month'}</th>
                                <th className="px-5 py-4 text-center"><FaUsers className="inline mr-1" />{lang === 'bn' ? 'নতুন ব্যবহারকারী' : 'New Users'}</th>
                                <th className="px-5 py-4 text-center"><FaBook className="inline mr-1" />{lang === 'bn' ? 'কোর্স' : 'Courses'}</th>
                                <th className="px-5 py-4 text-center"><FaChartLine className="inline mr-1" />{lang === 'bn' ? 'আয়' : 'Revenue'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {monthlyData.map((d, i) => (
                                <motion.tr key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="border-t border-base-300 hover:bg-base-200/50 transition-colors">
                                    <td className="px-5 py-4 font-semibold text-neutral">{d.month} 2026</td>
                                    <td className="px-5 py-4 text-center font-bold text-primary">{d.users.toLocaleString()}</td>
                                    <td className="px-5 py-4 text-center font-bold text-secondary">{d.courses}</td>
                                    <td className="px-5 py-4 text-center font-bold text-success">৳{(d.revenue / 1000).toFixed(0)}K</td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminReports;
