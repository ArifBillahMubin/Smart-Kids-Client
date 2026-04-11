import { motion } from 'framer-motion';
import { FaUsers, FaBook, FaChartLine, FaMoneyBill, FaUserCheck, FaExclamationTriangle } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';

const stats = [
    { icon: <FaUsers />, color: 'text-primary', bg: 'bg-primary/10', labelEn: 'Total Users', labelBn: 'মোট ব্যবহারকারী', value: '12,480', change: '+8%' },
    { icon: <FaBook />, color: 'text-secondary', bg: 'bg-secondary/10', labelEn: 'Total Courses', labelBn: 'মোট কোর্স', value: '524', change: '+12%' },
    { icon: <FaUserCheck />, color: 'text-success', bg: 'bg-success/10', labelEn: 'Active Today', labelBn: 'আজ সক্রিয়', value: '1,842', change: '+5%' },
    { icon: <FaMoneyBill />, color: 'text-warning', bg: 'bg-warning/10', labelEn: 'Revenue', labelBn: 'আয়', value: '৳2.4L', change: '+18%' },
];

const recentUsers = [
    { name: 'Fatema Begum', email: 'fatema@email.com', role: 'Guardian', status: 'active', joined: '2 min ago' },
    { name: 'Karim Uddin', email: 'karim@email.com', role: 'Guardian', status: 'active', joined: '15 min ago' },
    { name: 'Sumaiya Akter', email: 'sumaiya@email.com', role: 'Guardian', status: 'pending', joined: '1h ago' },
    { name: 'Rahim Mia', email: 'rahim@email.com', role: 'Guardian', status: 'active', joined: '2h ago' },
    { name: 'Nasrin Jahan', email: 'nasrin@email.com', role: 'Guardian', status: 'inactive', joined: '1d ago' },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const AdminOverview = () => {
    const { lang } = useApp();

    return (
        <div className="flex flex-col gap-6">
            <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-r from-error/10 via-base-100 to-primary/10 rounded-3xl p-6 border border-base-300">
                <h2 className="text-2xl font-bold text-neutral">
                    {lang === 'bn' ? 'অ্যাডমিন ড্যাশবোর্ড 🛡️' : 'Admin Dashboard 🛡️'}
                </h2>
                <p className="text-neutral/50 text-sm mt-1">
                    {lang === 'bn' ? 'সম্পূর্ণ প্ল্যাটফর্মের সারসংক্ষেপ' : 'Complete platform overview and management'}
                </p>
            </motion.div>

            {/* Stats */}
            <motion.div variants={container} initial="hidden" animate="visible"
                className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <motion.div key={i} variants={card} whileHover={{ scale: 1.03, y: -3 }}
                        className="bg-base-100 rounded-3xl p-5 border border-base-300">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`${s.bg} ${s.color} w-11 h-11 rounded-2xl flex items-center justify-center text-lg`}>{s.icon}</div>
                            <span className="text-xs font-bold text-success bg-success/10 px-2 py-1 rounded-full">{s.change}</span>
                        </div>
                        <p className="text-2xl font-bold text-neutral">{s.value}</p>
                        <p className="text-neutral/50 text-xs mt-0.5">{lang === 'bn' ? s.labelBn : s.labelEn}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent users */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="lg:col-span-2 bg-base-100 rounded-3xl p-6 border border-base-300">
                    <h3 className="font-bold text-neutral mb-4">{lang === 'bn' ? 'সাম্প্রতিক ব্যবহারকারী' : 'Recent Users'}</h3>
                    <div className="flex flex-col gap-2">
                        {recentUsers.map((u, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-base-200 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                                    {u.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-neutral text-sm truncate">{u.name}</p>
                                    <p className="text-neutral/40 text-xs truncate">{u.email}</p>
                                </div>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full shrink-0 ${u.status === 'active' ? 'bg-success/15 text-success' : u.status === 'pending' ? 'bg-warning/15 text-warning' : 'bg-base-300 text-neutral/40'}`}>
                                    {u.status}
                                </span>
                                <span className="text-xs text-neutral/30 shrink-0 hidden sm:block">{u.joined}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Quick actions */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                    className="bg-base-100 rounded-3xl p-6 border border-base-300 flex flex-col gap-3">
                    <h3 className="font-bold text-neutral mb-2">{lang === 'bn' ? 'দ্রুত কার্যক্রম' : 'Quick Actions'}</h3>
                    {[
                        { label: 'Add New Course', labelBn: 'নতুন কোর্স যোগ করুন', color: 'bg-primary/10 text-primary hover:bg-primary hover:text-white' },
                        { label: 'View All Users', labelBn: 'সব ব্যবহারকারী দেখুন', color: 'bg-secondary/10 text-secondary hover:bg-secondary hover:text-white' },
                        { label: 'Generate Report', labelBn: 'রিপোর্ট তৈরি করুন', color: 'bg-success/10 text-success hover:bg-success hover:text-white' },
                        { label: 'System Settings', labelBn: 'সিস্টেম সেটিংস', color: 'bg-accent/10 text-accent hover:bg-accent hover:text-white' },
                    ].map((a, i) => (
                        <button key={i} className={`w-full py-3 px-4 rounded-2xl text-sm font-bold transition-all text-left ${a.color}`}>
                            {lang === 'bn' ? a.labelBn : a.label}
                        </button>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default AdminOverview;
