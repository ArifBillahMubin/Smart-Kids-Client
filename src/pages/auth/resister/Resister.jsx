import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { TbFidgetSpinner } from 'react-icons/tb';
import { FaUser, FaChild } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import useAuth from '../../../hooks/useAuth';
import { imageUpload } from '../../../utils';
import heroImg from '../../../assets/hero.png';

const t = {
    en: {
        title: 'Sign Up', sub: 'Welcome to',
        imgTitle: "Start Your Child's Learning Journey",
        imgSub: 'AI-powered education for Classes 1-5. Track progress, stay connected.',
        parentName: 'Parent Name', parentNamePh: 'Enter your full name',
        parentImg: 'Parent Photo', 
        email: 'Email Address', emailPh: 'Enter your email',
        childName: "Child's Name", childNamePh: "Enter child's name",
        childClass: "Child's Class", childClassPh: 'Select class',
        childImg: "Child's Photo",
        pass: 'Password', passPh: '••••••••',
        btn: 'Continue',
        googleDivider: 'Signup with Google',
        googleBtn: 'Continue with Google',
        haveAcc: 'Already have an account?', loginLink: 'Login',
        err: {
            req: 'This field is required',
            emailInvalid: 'Enter a valid email',
            passMin: 'At least 6 characters',
        },
    },
    bn: {
        title: 'সাইন আপ', sub: 'স্বাগতম',
        imgTitle: 'আপনার সন্তানের শেখার যাত্রা শুরু করুন',
        imgSub: 'ক্লাস ১-৫ এর জন্য AI-চালিত শিক্ষা। অগ্রগতি ট্র্যাক করুন।',
        parentName: 'অভিভাবকের নাম', parentNamePh: 'আপনার পূর্ণ নাম লিখুন',
        parentImg: 'অভিভাবকের ছবি',
        email: 'ইমেইল ঠিকানা', emailPh: 'আপনার ইমেইল লিখুন',
        childName: 'সন্তানের নাম', childNamePh: 'সন্তানের নাম লিখুন',
        childClass: 'সন্তানের শ্রেণি', childClassPh: 'শ্রেণি নির্বাচন করুন',
        childImg: 'সন্তানের ছবি',
        pass: 'পাসওয়ার্ড', passPh: '••••••••',
        btn: 'চালিয়ে যান',
        googleDivider: 'Google দিয়ে সাইনআপ',
        googleBtn: 'Google দিয়ে চালিয়ে যান',
        haveAcc: 'ইতিমধ্যে অ্যাকাউন্ট আছে?', loginLink: 'লগইন করুন',
        err: {
            req: 'এই তথ্যটি আবশ্যক',
            emailInvalid: 'সঠিক ইমেইল দিন',
            passMin: 'কমপক্ষে ৬ অক্ষর',
        },
    },
};

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

const ImageField = ({ label, id, register: reg, name, error, preview, onPreview }) => (
    <div>
        <label className="block mb-1 text-sm text-neutral/70">{label}</label>
        <label htmlFor={id}
            className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer hover:bg-base-200 transition ${error ? 'border-error' : 'border-base-300'}`}>
            {preview
                ? <img src={preview} alt="preview" className="h-full w-full object-cover rounded-lg" />
                : <div className="flex flex-col items-center gap-1 text-neutral/40">
                    {name === 'parentImage' ? <FaUser size={20} /> : <FaChild size={20} />}
                    <span className="text-xs">PNG, JPG (max 2MB)</span>
                </div>
            }
        </label>
        <input id={id} type="file" accept="image/*" className="hidden"
            {...reg(name, { required: t.en.err.req })}
            onChange={(e) => {
                reg(name).onChange(e);
                const file = e.target.files[0];
                if (file) onPreview(URL.createObjectURL(file));
            }} />
        {error && <p className="text-error text-xs mt-1">{error.message}</p>}
    </div>
);

const Resister = () => {
    const { lang } = useApp();
    const c = t[lang];
    const navigate = useNavigate();
    const { createUser, updateUserProfile, signInWithGoogle, loading, setLoading } = useAuth();

    const [parentPreview, setParentPreview] = useState(null);
    const [childPreview, setChildPreview] = useState(null);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Upload both images to imgbb
            const parentImageURL = await imageUpload(data.parentImage[0]);
            const childImageURL = await imageUpload(data.childImage[0]);

            // Create Firebase user
            await createUser(data.email, data.password);

            // Update profile with parent name + photo
            await updateUserProfile(data.parentName, parentImageURL);

            // TODO: save to DB
            // await saveOrUpdateUser({ parentName: data.parentName, email: data.email, parentImageURL, childName: data.childName, childClass: data.childClass, childImageURL })

            console.log({ ...data, parentImageURL, childImageURL });
            toast.success(lang === 'bn' ? 'সাইনআপ সফল হয়েছে' : 'Signup Successful');
            navigate('/');
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            const { user } = await signInWithGoogle();
            // TODO: await saveOrUpdateUser({ name: user.displayName, email: user.email, imageURL: user.photoURL })
            console.log(user);
            toast.success(lang === 'bn' ? 'সাইনআপ সফল হয়েছে' : 'Signup Successful');
            navigate('/');
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center py-16 px-4">
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">

                {/* ── LEFT: Image Panel ── */}
                <div className="relative hidden md:block">
                    <img src={heroImg} alt="SmartKids signup" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-neutral/75" />
                    <div className="absolute inset-0 flex flex-col justify-center px-10 space-y-4 text-white">
                        <h2 className="text-3xl font-bold leading-tight">{c.imgTitle}</h2>
                        <p className="text-sm md:text-base text-white/85 max-w-md">{c.imgSub}</p>
                        <p className="text-xs text-white/70">SmartKids — AI Powered Learning Platform</p>
                    </div>
                </div>

                {/* ── RIGHT: Form Panel ── */}
                <div className="flex flex-col justify-center p-6 sm:p-10 overflow-y-auto max-h-screen">
                    <div className="mb-5 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-primary">{c.title}</h1>
                        <p className="text-sm text-neutral/50 mt-1">{c.sub} <span className="font-semibold text-primary">SmartKids</span></p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Parent Name */}
                        <div>
                            <label className="block mb-1 text-sm text-neutral/70">{c.parentName}</label>
                            <input type="text" placeholder={c.parentNamePh}
                                className={`w-full px-3 py-2 border rounded-md border-base-300 bg-base-100 focus:outline-primary ${errors.parentName ? 'border-error' : ''}`}
                                {...register('parentName', { required: c.err.req })} />
                            {errors.parentName && <p className="text-error text-xs mt-1">{errors.parentName.message}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm text-neutral/70">{c.email}</label>
                            <input type="email" placeholder={c.emailPh}
                                className={`w-full px-3 py-2 border rounded-md border-base-300 bg-base-100 focus:outline-primary ${errors.email ? 'border-error' : ''}`}
                                {...register('email', {
                                    required: c.err.req,
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: c.err.emailInvalid }
                                })} />
                            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Child Name + Class */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block mb-1 text-sm text-neutral/70">{c.childName}</label>
                                <input type="text" placeholder={c.childNamePh}
                                    className={`w-full px-3 py-2 border rounded-md border-base-300 bg-base-100 focus:outline-primary ${errors.childName ? 'border-error' : ''}`}
                                    {...register('childName', { required: c.err.req })} />
                                {errors.childName && <p className="text-error text-xs mt-1">{errors.childName.message}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm text-neutral/70">{c.childClass}</label>
                                <select className={`w-full px-3 py-2 border rounded-md border-base-300 bg-base-100 focus:outline-primary ${errors.childClass ? 'border-error' : ''}`}
                                    {...register('childClass', { required: c.err.req })}>
                                    <option value="">{c.childClassPh}</option>
                                    {classes.map(cl => <option key={cl} value={cl}>{cl}</option>)}
                                </select>
                                {errors.childClass && <p className="text-error text-xs mt-1">{errors.childClass.message}</p>}
                            </div>
                        </div>

                        {/* Parent Image + Child Image */}
                        <div className="grid grid-cols-2 gap-3">
                            <ImageField label={c.parentImg} id="parentImage" register={register}
                                name="parentImage" error={errors.parentImage}
                                preview={parentPreview} onPreview={setParentPreview} />
                            <ImageField label={c.childImg} id="childImage" register={register}
                                name="childImage" error={errors.childImage}
                                preview={childPreview} onPreview={setChildPreview} />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1 text-sm text-neutral/70">{c.pass}</label>
                            <input type="password" placeholder={c.passPh} autoComplete="new-password"
                                className={`w-full px-3 py-2 border rounded-md border-base-300 bg-base-100 focus:outline-primary ${errors.password ? 'border-error' : ''}`}
                                {...register('password', {
                                    required: c.err.req,
                                    minLength: { value: 6, message: c.err.passMin }
                                })} />
                            {errors.password && <p className="text-error text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        {/* Submit */}
                        <button type="submit"
                            className="bg-primary w-full rounded-md py-3 text-white font-medium hover:bg-primary/90 transition">
                            {loading ? <TbFidgetSpinner className="animate-spin m-auto text-xl" /> : c.btn}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center pt-4 space-x-1">
                        <div className="flex-1 h-px bg-base-300" />
                        <p className="px-3 text-sm text-neutral/50">{c.googleDivider}</p>
                        <div className="flex-1 h-px bg-base-300" />
                    </div>

                    {/* Google */}
                    <div onClick={handleGoogleSignIn}
                        className="flex justify-center items-center space-x-2 border mt-3 p-2 border-base-300 rounded-md cursor-pointer hover:bg-base-200 transition">
                        <FcGoogle size={28} />
                        <p className="text-sm font-medium text-neutral/70">{c.googleBtn}</p>
                    </div>

                    <p className="mt-4 text-sm text-center text-neutral/50">
                        {c.haveAcc}{' '}
                        <Link to="/login" className="text-primary font-medium hover:underline">{c.loginLink}</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Resister;
