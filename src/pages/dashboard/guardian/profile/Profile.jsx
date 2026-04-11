import { motion } from 'framer-motion';
import { FaEdit, FaUser, FaEnvelope, FaPhone, FaChild, FaGraduationCap } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';

const Profile = () => {
    const { lang } = useApp();
    const { user } = useAuth();

    const fields = [
        { icon: <FaUser />, labelEn: 'Parent Name', labelBn: 'অভিভাবকের নাম', value: user?.displayName || 'N/A' },
        { icon: <FaEnvelope />, labelEn: 'Email', labelBn: 'ইমেইল', value: user?.email || 'N/A' },
        { icon: <FaPhone />, labelEn: 'Phone', labelBn: 'ফোন', value: '01XXXXXXXXX' },
        { icon: <FaChild />, labelEn: "Child's Name", labelBn: 'সন্তানের নাম', value: 'Rafi Ahmed' },
        { icon: <FaGraduationCap />, labelEn: "Child's Class", labelBn: 'সন্তানের শ্রেণি', value: 'Class 3' },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'প্রোফাইল' : 'Profile'}</h2>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 rounded-3xl border border-base-300 p-6">
                {/* Avatar */}
                <div className="flex items-center gap-5 mb-8 pb-6 border-b border-base-300">
                    <div className="relative">
                        <img
                            src={user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=4F9CF9&color=fff&size=80`}
                            className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                            alt=""
                        />
                        <button className="absolute bottom-0 right-0 w-7 h-7 bg-primary rounded-full flex items-center justify-center text-white text-xs">
                            <FaEdit />
                        </button>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral">{user?.displayName}</h3>
                        <p className="text-neutral/50 text-sm">{lang === 'bn' ? 'অভিভাবক' : 'Guardian'}</p>
                    </div>
                </div>

                {/* Fields */}
                <div className="flex flex-col gap-4">
                    {fields.map((f, i) => (
                        <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-base-200">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                {f.icon}
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-neutral/40 font-medium">{lang === 'bn' ? f.labelBn : f.labelEn}</p>
                                <p className="text-sm font-semibold text-neutral">{f.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <button className="mt-6 w-full py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                    <FaEdit /> {lang === 'bn' ? 'প্রোফাইল সম্পাদনা করুন' : 'Edit Profile'}
                </button>
            </motion.div>
        </div>
    );
};

export default Profile;
