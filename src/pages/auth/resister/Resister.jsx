import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash, FaGraduationCap } from 'react-icons/fa';
import { NavLink } from 'react-router';
import { useApp } from '../../../context/AppContext';

const content = {
    en: {
        title: 'Create Account',
        sub: 'Join SmartKids and start your child\'s learning journey',
        name: 'Full Name', namePh: 'Enter your full name',
        email: 'Email Address', emailPh: 'Enter your email',
        phone: 'Phone Number', phonePh: 'Enter your phone number',
        role: 'Register As', parent: 'Parent', student: 'Student',
        class: 'Class', classPh: 'Select class',
        pass: 'Password', passPh: 'Create a password',
        confirm: 'Confirm Password', confirmPh: 'Re-enter password',
        btn: 'Create Account',
        login: 'Already have an account?', loginLink: 'Sign In',
        errors: {
            nameReq: 'Name is required',
            nameMin: 'Name must be at least 3 characters',
            emailReq: 'Email is required',
            emailInvalid: 'Invalid email address',
            phoneReq: 'Phone number is required',
            phoneInvalid: 'Invalid phone number',
            passReq: 'Password is required',
            passMin: 'Password must be at least 6 characters',
            passPattern: 'Must include uppercase, lowercase and number',
            confirmReq: 'Please confirm your password',
            confirmMatch: 'Passwords do not match',
        },
    },
    bn: {
        title: 'অ্যাকাউন্ট তৈরি করুন',
        sub: 'SmartKids-এ যোগ দিন এবং আপনার সন্তানের শেখার যাত্রা শুরু করুন',
        name: 'পূর্ণ নাম', namePh: 'আপনার পূর্ণ নাম লিখুন',
        email: 'ইমেইল ঠিকানা', emailPh: 'আপনার ইমেইল লিখুন',
        phone: 'ফোন নম্বর', phonePh: 'আপনার ফোন নম্বর লিখুন',
        role: 'নিবন্ধন করুন', parent: 'অভিভাবক', student: 'শিক্ষার্থী',
        class: 'শ্রেণি', classPh: 'শ্রেণি নির্বাচন করুন',
        pass: 'পাসওয়ার্ড', passPh: 'পাসওয়ার্ড তৈরি করুন',
        confirm: 'পাসওয়ার্ড নিশ্চিত করুন', confirmPh: 'পাসওয়ার্ড পুনরায় লিখুন',
        btn: 'অ্যাকাউন্ট তৈরি করুন',
        login: 'ইতিমধ্যে অ্যাকাউন্ট আছে?', loginLink: 'সাইন ইন করুন',
        errors: {
            nameReq: 'নাম আবশ্যক',
            nameMin: 'নাম কমপক্ষে ৩ অক্ষরের হতে হবে',
            emailReq: 'ইমেইল আবশ্যক',
            emailInvalid: 'সঠিক ইমেইল ঠিকানা দিন',
            phoneReq: 'ফোন নম্বর আবশ্যক',
            phoneInvalid: 'সঠিক ফোন নম্বর দিন',
            passReq: 'পাসওয়ার্ড আবশ্যক',
            passMin: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
            passPattern: 'বড় হাতের, ছোট হাতের অক্ষর ও সংখ্যা থাকতে হবে',
            confirmReq: 'পাসওয়ার্ড নিশ্চিত করুন',
            confirmMatch: 'পাসওয়ার্ড মিলছে না',
        },
    },
};

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

const Field = ({ label, error, children }) => (
    <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-neutral/80">{label}</label>
        {children}
        {error && <p className="text-error text-xs mt-0.5">{error}</p>}
    </div>
);

const Resister = () => {
    const { lang } = useApp();
    const c = content[lang];
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [role, setRole] = useState('parent');

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const password = watch('password');

    const onSubmit = (data) => {
        console.log({ ...data, role });
        // TODO: connect to backend
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-base-200">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-lg bg-base-100 rounded-3xl shadow-xl p-8 border border-base-300"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <FaGraduationCap className="text-primary text-2xl" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-neutral">{c.title}</h1>
                    <p className="text-neutral/50 text-sm mt-1">{c.sub}</p>
                </div>

                {/* Role Toggle */}
                <div className="flex bg-base-200 rounded-2xl p-1 mb-6">
                    {['parent', 'student'].map(r => (
                        <button key={r} type="button" onClick={() => setRole(r)}
                            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${role === r ? 'bg-primary text-white shadow-sm' : 'text-neutral/60 hover:text-neutral'}`}>
                            {r === 'parent' ? c.parent : c.student}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* Name */}
                    <Field label={c.name} error={errors.name?.message}>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                            <input {...register('name', {
                                required: c.errors.nameReq,
                                minLength: { value: 3, message: c.errors.nameMin }
                            })}
                                placeholder={c.namePh}
                                className={`input input-bordered w-full pl-9 bg-base-100 ${errors.name ? 'input-error' : ''}`} />
                        </div>
                    </Field>

                    {/* Email */}
                    <Field label={c.email} error={errors.email?.message}>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                            <input {...register('email', {
                                required: c.errors.emailReq,
                                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: c.errors.emailInvalid }
                            })}
                                type="email" placeholder={c.emailPh}
                                className={`input input-bordered w-full pl-9 bg-base-100 ${errors.email ? 'input-error' : ''}`} />
                        </div>
                    </Field>

                    {/* Phone */}
                    <Field label={c.phone} error={errors.phone?.message}>
                        <div className="relative">
                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                            <input {...register('phone', {
                                required: c.errors.phoneReq,
                                pattern: { value: /^[0-9+\-\s]{10,15}$/, message: c.errors.phoneInvalid }
                            })}
                                placeholder={c.phonePh}
                                className={`input input-bordered w-full pl-9 bg-base-100 ${errors.phone ? 'input-error' : ''}`} />
                        </div>
                    </Field>

                    {/* Class — only for student */}
                    {role === 'student' && (
                        <Field label={c.class} error={errors.class?.message}>
                            <select {...register('class', { required: role === 'student' })}
                                className={`select select-bordered w-full bg-base-100 ${errors.class ? 'select-error' : ''}`}>
                                <option value="">{c.classPh}</option>
                                {classes.map(cl => <option key={cl} value={cl}>{cl}</option>)}
                            </select>
                        </Field>
                    )}

                    {/* Password */}
                    <Field label={c.pass} error={errors.password?.message}>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                            <input {...register('password', {
                                required: c.errors.passReq,
                                minLength: { value: 6, message: c.errors.passMin },
                                pattern: { value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: c.errors.passPattern }
                            })}
                                type={showPass ? 'text' : 'password'} placeholder={c.passPh}
                                className={`input input-bordered w-full pl-9 pr-10 bg-base-100 ${errors.password ? 'input-error' : ''}`} />
                            <button type="button" onClick={() => setShowPass(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                                {showPass ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </Field>

                    {/* Confirm Password */}
                    <Field label={c.confirm} error={errors.confirmPassword?.message}>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                            <input {...register('confirmPassword', {
                                required: c.errors.confirmReq,
                                validate: val => val === password || c.errors.confirmMatch
                            })}
                                type={showConfirm ? 'text' : 'password'} placeholder={c.confirmPh}
                                className={`input input-bordered w-full pl-9 pr-10 bg-base-100 ${errors.confirmPassword ? 'input-error' : ''}`} />
                            <button type="button" onClick={() => setShowConfirm(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </Field>

                    {/* Submit */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="btn btn-primary w-full rounded-full text-white font-bold mt-2">
                        {c.btn}
                    </motion.button>
                </form>

                {/* Login link */}
                <p className="text-center text-sm text-neutral/50 mt-6">
                    {c.login}{' '}
                    <NavLink to="/login" className="text-primary font-semibold hover:underline">{c.loginLink}</NavLink>
                </p>
            </motion.div>
        </div>
    );
};

export default Resister;
