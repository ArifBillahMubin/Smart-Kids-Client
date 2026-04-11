import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { TbFidgetSpinner } from 'react-icons/tb';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone, FaChild } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import useAuth from '../../../hooks/useAuth';
import { imageUpload } from '../../../utils';
import authImg from '../../../assets/login_page-removebg-preview.png';
import logo from '../../../assets/SmartKids_logo_final.png';

const t = {
    en: {
        welcome: 'Create Account 🎉',
        sub: "Join SmartKids and start your child's learning journey today",
        imgTitle: 'Start the Journey',
        imgSub: 'AI-powered education for Classes 1-5. Fun, interactive, and curriculum-aligned.',
        parentName: 'Parent Name', parentNamePh: 'Your full name',
        email: 'Email', emailPh: 'Your email address',
        phone: 'Phone', phonePh: '01XXXXXXXXX',
        childName: "Child's Name", childNamePh: "Child's full name",
        childClass: "Child's Class", childClassPh: 'Select class',
        parentImg: 'Parent Photo', childImg: "Child's Photo",
        pass: 'Password', passPh: '••••••••',
        btn: 'Create Account',
        googleBtn: 'Sign up with Google',
        or: 'or sign up with email',
        haveAcc: 'Already have an account?', loginLink: 'Sign In',
        err: { req: 'Required', emailInvalid: 'Invalid email', passMin: 'Min 6 characters', passPattern: 'Need uppercase, lowercase & number' },
    },
    bn: {
        welcome: 'অ্যাকাউন্ট তৈরি করুন 🎉',
        sub: 'SmartKids-এ যোগ দিন এবং আজই সন্তানের শেখার যাত্রা শুরু করুন',
        imgTitle: 'যাত্রা শুরু করুন',
        imgSub: 'ক্লাস ১-৫ এর জন্য AI-চালিত শিক্ষা। মজাদার, ইন্টারেক্টিভ এবং পাঠ্যক্রম অনুযায়ী।',
        parentName: 'অভিভাবকের নাম', parentNamePh: 'আপনার পূর্ণ নাম',
        email: 'ইমেইল', emailPh: 'আপনার ইমেইল',
        phone: 'ফোন', phonePh: '০১XXXXXXXXX',
        childName: 'সন্তানের নাম', childNamePh: 'সন্তানের পূর্ণ নাম',
        childClass: 'সন্তানের শ্রেণি', childClassPh: 'শ্রেণি নির্বাচন করুন',
        parentImg: 'অভিভাবকের ছবি', childImg: 'সন্তানের ছবি',
        pass: 'পাসওয়ার্ড', passPh: '••••••••',
        btn: 'অ্যাকাউন্ট তৈরি করুন',
        googleBtn: 'Google দিয়ে সাইন আপ',
        or: 'অথবা ইমেইল দিয়ে',
        haveAcc: 'ইতিমধ্যে অ্যাকাউন্ট আছে?', loginLink: 'সাইন ইন করুন',
        err: { req: 'আবশ্যক', emailInvalid: 'সঠিক ইমেইল দিন', passMin: 'কমপক্ষে ৬ অক্ষর', passPattern: 'বড়, ছোট হাতের অক্ষর ও সংখ্যা থাকতে হবে' },
    },
};

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

const ImgUpload = ({ label, id, name, reg, error, preview, onPreview, icon }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-sm font-semibold text-neutral/70">{label}</label>
        <label htmlFor={id} className={`flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed cursor-pointer transition-all hover:border-primary/50 hover:bg-primary/5 ${error ? 'border-error' : 'border-base-300'}`}>
            {preview
                ? <img src={preview} className="h-full w-full object-cover rounded-2xl" alt="" />
                : <div className="flex flex-col items-center gap-1 text-neutral/30">
                    {icon}
                    <span className="text-xs">Click to upload</span>
                </div>}
        </label>
        <input id={id} type="file" accept="image/*" className="hidden"
            {...reg(name, { required: t.en.err.req })}
            onChange={(e) => { reg(name).onChange(e); const f = e.target.files[0]; if (f) onPreview(URL.createObjectURL(f)); }} />
        {error && <p className="text-error text-xs">{error.message}</p>}
    </div>
);

const Resister = () => {
    const { lang } = useApp();
    const c = t[lang];
    const navigate = useNavigate();
    const { createUser, updateUserProfile, signInWithGoogle, loading, setLoading } = useAuth();
    const [showPass, setShowPass] = useState(false);
    const [parentPreview, setParentPreview] = useState(null);
    const [childPreview, setChildPreview] = useState(null);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const parentImageURL = await imageUpload(data.parentImage[0]);
            const childImageURL = await imageUpload(data.childImage[0]);
            await createUser(data.email, data.password);
            await updateUserProfile(data.parentName, parentImageURL);
            console.log({ ...data, parentImageURL, childImageURL });
            toast.success(lang === 'bn' ? 'অ্যাকাউন্ট তৈরি সফল!' : 'Account Created!');
            navigate('/');
        } catch (err) { toast.error(err?.message); }
        finally { setLoading(false); }
    };

    const handleGoogle = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            toast.success(lang === 'bn' ? 'সাইন আপ সফল!' : 'Signup Successful!');
            navigate('/');
        } catch (err) { toast.error(err?.message); }
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            {/* ── Left: Image Panel ── */}
            <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-secondary/20 via-base-200 to-primary/10 p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />

                <img src={logo} alt="SmartKids" className="h-12 mb-8 relative z-10" />
                <motion.img
                    src={authImg}
                    alt="Learning"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-full max-w-sm object-contain relative z-10 drop-shadow-2xl"
                />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="text-center mt-8 relative z-10"
                >
                    <h2 className="text-2xl font-bold text-neutral">{c.imgTitle}</h2>
                    <p className="text-neutral/50 text-sm mt-2 max-w-xs">{c.imgSub}</p>
                </motion.div>
            </div>

            {/* ── Right: Form Panel ── */}
            <div className="flex items-center justify-center p-6 sm:p-10 bg-base-100 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md py-8"
                >
                    <img src={logo} alt="SmartKids" className="h-10 mb-6 md:hidden" />

                    <h1 className="text-3xl text-neutral mb-1">{c.welcome}</h1>
                    <p className="text-neutral/50 text-sm mb-6">{c.sub}</p>

                    {/* Google */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleGoogle} type="button"
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 border-base-300 bg-base-100 hover:border-primary/40 hover:bg-primary/5 transition-all font-semibold text-neutral text-sm mb-4"
                    >
                        <FcGoogle size={22} /> {c.googleBtn}
                    </motion.button>

                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex-1 h-px bg-base-300" />
                        <span className="text-neutral/40 text-xs font-medium">{c.or}</span>
                        <div className="flex-1 h-px bg-base-300" />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                        {/* Parent Name + Phone */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-neutral/70">{c.parentName}</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                    <input placeholder={c.parentNamePh}
                                        className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.parentName ? 'border-error' : 'border-base-300'}`}
                                        {...register('parentName', { required: c.err.req })} />
                                </div>
                                {errors.parentName && <p className="text-error text-xs">{errors.parentName.message}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-neutral/70">{c.phone}</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                    <input placeholder={c.phonePh}
                                        className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.phone ? 'border-error' : 'border-base-300'}`}
                                        {...register('phone', { required: c.err.req })} />
                                </div>
                                {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-neutral/70">{c.email}</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                <input type="email" placeholder={c.emailPh}
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.email ? 'border-error' : 'border-base-300'}`}
                                    {...register('email', { required: c.err.req, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: c.err.emailInvalid } })} />
                            </div>
                            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                        </div>

                        {/* Child Name + Class */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-neutral/70">{c.childName}</label>
                                <div className="relative">
                                    <FaChild className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                    <input placeholder={c.childNamePh}
                                        className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.childName ? 'border-error' : 'border-base-300'}`}
                                        {...register('childName', { required: c.err.req })} />
                                </div>
                                {errors.childName && <p className="text-error text-xs">{errors.childName.message}</p>}
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-semibold text-neutral/70">{c.childClass}</label>
                                <select className={`w-full px-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.childClass ? 'border-error' : 'border-base-300'}`}
                                    {...register('childClass', { required: c.err.req })}>
                                    <option value="">{c.childClassPh}</option>
                                    {classes.map(cl => <option key={cl} value={cl}>{cl}</option>)}
                                </select>
                                {errors.childClass && <p className="text-error text-xs">{errors.childClass.message}</p>}
                            </div>
                        </div>

                        {/* Photos */}
                        <div className="grid grid-cols-2 gap-3">
                            <ImgUpload label={c.parentImg} id="parentImg" name="parentImage"
                                reg={register} error={errors.parentImage}
                                preview={parentPreview} onPreview={setParentPreview}
                                icon={<FaUser size={20} />} />
                            <ImgUpload label={c.childImg} id="childImg" name="childImage"
                                reg={register} error={errors.childImage}
                                preview={childPreview} onPreview={setChildPreview}
                                icon={<FaChild size={20} />} />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-neutral/70">{c.pass}</label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                <input type={showPass ? 'text' : 'password'} placeholder={c.passPh}
                                    className={`w-full pl-9 pr-10 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.password ? 'border-error' : 'border-base-300'}`}
                                    {...register('password', { required: c.err.req, minLength: { value: 6, message: c.err.passMin }, pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: c.err.passPattern } })} />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                            {errors.password && <p className="text-error text-xs">{errors.password.message}</p>}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all shadow-md hover:shadow-lg mt-1"
                        >
                            {loading ? <TbFidgetSpinner className="animate-spin m-auto text-xl" /> : c.btn}
                        </motion.button>
                    </form>

                    <p className="text-center text-sm text-neutral/50 mt-5">
                        {c.haveAcc}{' '}
                        <Link to="/login" className="text-primary font-bold hover:underline">{c.loginLink}</Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Resister;
