import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaEnvelope, FaPhone, FaChild, FaGraduationCap, FaShieldAlt, FaEdit, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useApp } from '../../../../context/AppContext';
import useAuth from '../../../../hooks/useAuth';
import { getUserByEmail, updateUserProfile_DB } from '../../../../utils';

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

const Profile = () => {
    const { lang } = useApp();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [editing, setEditing] = useState(false);
    const [showPin, setShowPin] = useState(false);

    const { data: dbUser, isLoading } = useQuery({
        queryKey: ['user', user?.email],
        queryFn: () => getUserByEmail(user.email),
        enabled: !!user?.email,
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const openEdit = () => {
        reset({
            name: dbUser?.name || user?.displayName || '',
            phone: dbUser?.phone || '',
            childName: dbUser?.childName || '',
            childClass: dbUser?.childClass || '',
            dashboardPin: dbUser?.dashboardPin || '',
        });
        setEditing(true);
    };

    const updateMutation = useMutation({
        mutationFn: (data) => updateUserProfile_DB(user.email, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user', user?.email] });
            toast.success(lang === 'bn' ? 'প্রোফাইল আপডেট হয়েছে!' : 'Profile updated!');
            setEditing(false);
        },
        onError: () => toast.error(lang === 'bn' ? 'আপডেট ব্যর্থ হয়েছে' : 'Update failed'),
    });

    const onSubmit = (data) => updateMutation.mutate(data);

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    const fields = [
        { icon: <FaUser />, labelEn: 'Parent Name', labelBn: 'অভিভাবকের নাম', value: dbUser?.name || user?.displayName || '—' },
        { icon: <FaEnvelope />, labelEn: 'Email', labelBn: 'ইমেইল', value: dbUser?.email || user?.email || '—' },
        { icon: <FaPhone />, labelEn: 'Phone', labelBn: 'ফোন', value: dbUser?.phone || '—' },
        { icon: <FaChild />, labelEn: "Child's Name", labelBn: 'সন্তানের নাম', value: dbUser?.childName || '—' },
        { icon: <FaGraduationCap />, labelEn: "Child's Class", labelBn: 'সন্তানের শ্রেণি', value: dbUser?.childClass || '—' },
        { icon: <FaShieldAlt />, labelEn: 'Dashboard PIN', labelBn: 'ড্যাশবোর্ড PIN', value: dbUser?.dashboardPin ? '••••' : '—' },
    ];

    return (
        <div className="flex flex-col gap-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'প্রোফাইল' : 'Profile'}</h2>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-base-100 rounded-3xl border border-base-300 p-6">

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-6 pb-6 border-b border-base-300 flex-wrap">
                    <div className="flex items-center gap-4">
                        <img
                            src={dbUser?.photoURL || user?.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || 'U')}&background=4F9CF9&color=fff&size=80`}
                            className="w-20 h-20 rounded-full object-cover border-4 border-primary/20"
                            alt="Parent"
                        />
                        <div>
                            <h3 className="text-xl font-bold text-neutral">{dbUser?.name || user?.displayName}</h3>
                            <p className="text-neutral/50 text-sm">{lang === 'bn' ? 'অভিভাবক' : 'Guardian'}</p>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary mt-1 inline-block">
                                {dbUser?.role || 'guardian'}
                            </span>
                        </div>
                    </div>
                    {dbUser?.childImageURL && (
                        <div className="flex items-center gap-3 ml-auto">
                            <img src={dbUser.childImageURL} className="w-16 h-16 rounded-full object-cover border-4 border-secondary/20" alt="Child" />
                            <div>
                                <p className="text-sm font-bold text-neutral">{dbUser.childName}</p>
                                <p className="text-xs text-neutral/50">{dbUser.childClass}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* View mode */}
                <AnimatePresence mode="wait">
                    {!editing ? (
                        <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="flex flex-col gap-3">
                            {fields.map((f, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-base-200">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">{f.icon}</div>
                                    <div className="flex-1">
                                        <p className="text-xs text-neutral/40 font-medium">{lang === 'bn' ? f.labelBn : f.labelEn}</p>
                                        <p className="text-sm font-semibold text-neutral">{f.value}</p>
                                    </div>
                                </div>
                            ))}
                            <button onClick={openEdit}
                                className="mt-3 w-full py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                <FaEdit /> {lang === 'bn' ? 'প্রোফাইল সম্পাদনা করুন' : 'Edit Profile'}
                            </button>
                        </motion.div>
                    ) : (
                        /* Edit mode */
                        <motion.form key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                            {/* Parent Name */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-neutral/70">{lang === 'bn' ? 'অভিভাবকের নাম' : 'Parent Name'}</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                    <input placeholder="Your full name"
                                        className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.name ? 'border-error' : 'border-base-300'}`}
                                        {...register('name', { required: lang === 'bn' ? 'আবশ্যক' : 'Required' })} />
                                </div>
                                {errors.name && <p className="text-error text-xs">{errors.name.message}</p>}
                            </div>

                            {/* Phone */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-neutral/70">{lang === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                    <input placeholder="01XXXXXXXXX"
                                        className="w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all"
                                        {...register('phone')} />
                                </div>
                            </div>

                            {/* Child Name + Class */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-neutral/70">{lang === 'bn' ? 'সন্তানের নাম' : "Child's Name"}</label>
                                    <div className="relative">
                                        <FaChild className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                        <input placeholder="Child's name"
                                            className="w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all"
                                            {...register('childName')} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-neutral/70">{lang === 'bn' ? 'সন্তানের শ্রেণি' : "Child's Class"}</label>
                                    <select className="w-full px-3 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all"
                                        {...register('childClass')}>
                                        <option value="">{lang === 'bn' ? 'শ্রেণি নির্বাচন' : 'Select class'}</option>
                                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Dashboard PIN */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-neutral/70">{lang === 'bn' ? 'ড্যাশবোর্ড PIN (৪ সংখ্যা)' : 'Dashboard PIN (4 digits)'}</label>
                                <div className="relative">
                                    <FaShieldAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                    <input type={showPin ? 'text' : 'password'} placeholder="••••" maxLength={4}
                                        className={`w-full pl-9 pr-10 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary tracking-widest transition-all ${errors.dashboardPin ? 'border-error' : 'border-base-300'}`}
                                        {...register('dashboardPin', {
                                            pattern: { value: /^\d{4}$/, message: lang === 'bn' ? 'ঠিক ৪ সংখ্যা' : 'Must be 4 digits' }
                                        })} />
                                    <button type="button" onClick={() => setShowPin(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                                        {showPin ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                                {errors.dashboardPin && <p className="text-error text-xs">{errors.dashboardPin.message}</p>}
                                <p className="text-neutral/40 text-xs">{lang === 'bn' ? 'সন্তানকে ড্যাশবোর্ড থেকে দূরে রাখতে PIN ব্যবহার করুন।' : 'Use PIN to prevent child from accessing guardian dashboard.'}</p>
                            </div>

                            <div className="flex gap-3 pt-2 border-t border-base-300">
                                <button type="button" onClick={() => setEditing(false)}
                                    className="flex-1 py-3 rounded-2xl border-2 border-base-300 text-neutral font-bold hover:bg-base-200 transition-all flex items-center justify-center gap-2">
                                    <FaTimes /> {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                                </button>
                                <button type="submit" disabled={updateMutation.isPending}
                                    className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                    {updateMutation.isPending && <TbFidgetSpinner className="animate-spin" />}
                                    {lang === 'bn' ? 'সংরক্ষণ করুন' : 'Save Changes'}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Profile;
