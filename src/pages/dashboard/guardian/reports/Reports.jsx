import { motion } from 'framer-motion';
import { FaDownload, FaCalendar, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';

const reports = [
    { week: 'Week 1 (Apr 1-7)', weekBn: 'সপ্তাহ ১ (এপ্রিল ১-৭)', math: 88, science: 75, english: 92, bangla: 85, trend: 'up' },
    { week: 'Week 2 (Apr 8-14)', weekBn: 'সপ্তাহ ২ (এপ্রিল ৮-১৪)', math: 82, science: 80, english: 88, bangla: 90, trend: 'down' },
    { week: 'Week 3 (Apr 15-21)', weekBn: 'সপ্তাহ ৩ (এপ্রিল ১৫-২১)', math: 90, science: 85, english: 94, bangla: 88, trend: 'up' },
    { week: 'Week 4 (Apr 22-28)', weekBn: 'সপ্তাহ ৪ (এপ্রিল ২২-২৮)', math: 85, science: 72, english: 90, bangla: 92, trend: 'up' },
];

const Reports = () => {
    const { lang } = useApp();

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'পারফরম্যান্স রিপোর্ট' : 'Performance Reports'}</h2>
                <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
                    <FaDownload /> {lang === 'bn' ? 'ডাউনলোড' : 'Download'}
                </button>
            </div>

            <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-base-200 text-neutral/60 text-xs font-bold uppercase">
                                <th className="px-5 py-4 text-left">{lang === 'bn' ? 'সপ্তাহ' : 'Week'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'গণিত' : 'Math'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'বিজ্ঞান' : 'Science'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'ইংরেজি' : 'English'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'বাংলা' : 'Bangla'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'ট্রেন্ড' : 'Trend'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((r, i) => (
                                <motion.tr key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="border-t border-base-300 hover:bg-base-200/50 transition-colors">
                                    <td className="px-5 py-4 text-sm font-semibold text-neutral">{lang === 'bn' ? r.weekBn : r.week}</td>
                                    {[r.math, r.science, r.english, r.bangla].map((score, j) => (
                                        <td key={j} className="px-5 py-4 text-center">
                                            <span className={`text-sm font-bold ${score >= 85 ? 'text-success' : score >= 70 ? 'text-warning' : 'text-error'}`}>{score}%</span>
                                        </td>
                                    ))}
                                    <td className="px-5 py-4 text-center">
                                        {r.trend === 'up'
                                            ? <span className="inline-flex items-center gap-1 text-success text-xs font-bold"><FaArrowUp />Up</span>
                                            : <span className="inline-flex items-center gap-1 text-error text-xs font-bold"><FaArrowDown />Down</span>}
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Reports;
