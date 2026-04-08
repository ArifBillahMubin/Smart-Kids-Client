import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import { FcGoogle } from 'react-icons/fc';
import { TbFidgetSpinner } from 'react-icons/tb';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import useAuth from '../../../hooks/useAuth';
import heroImg from '../../../assets/login_page-removebg-preview.png';

const t = {
    en: {
        title: 'Sign In', sub: 'Welcome back to',
        imgTitle: 'Continue Your Learning Journey',
        imgSub: 'Track your child\'s progress, access courses and stay connected with teachers.',
        email: 'Email Address', emailPh: 'Enter your email',
        pass: 'Password', passPh: '••••••••',
        forgot: 'Forgot password?',
        btn: 'Sign In',
        googleDivider: 'Or sign in with',
        googleBtn: 'Continue with Google',
        noAcc: "Don't have an account?", registerLink: 'Sign Up',
        err: {
            req: 'This field is required',
            emailInvalid: 'Enter a valid email',
        },
    },
    bn: {
        title: 'সাইন ইন', sub: 'আবার স্বাগতম',
        imgTitle: 'শেখার যাত্রা চালিয়ে যান',
        imgSub: 'আপনার সন্তানের অগ্রগতি ট্র্যাক করুন, কোর্স দেখুন এবং শিক্ষকদের সাথে যুক্ত থাকুন।',
        email: 'ইমেইল ঠিকানা', emailPh: 'আপনার ইমেইল লিখুন',
        pass: 'পাসওয়ার্ড', passPh: '••••••••',
        forgot: 'পাসওয়ার্ড ভুলে গেছেন?',
        btn: 'সাইন ইন করুন',
        googleDivider: 'অথবা এর মাধ্যমে সাইন ইন করুন',
        googleBtn: 'Google দিয়ে চালিয়ে যান',
        noAcc: 'অ্যাকাউন্ট নেই?', registerLink: 'সাইন আপ করুন',
        err: {
            req: 'এই তথ্যটি আবশ্যক',
            emailInvalid: 'সঠিক ইমেইল দিন',
        },
    },
};

const Login = () => {
    const { lang } = useApp();
    const c = t[lang];
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state || '/';
    const { signIn, signInWithGoogle, loading, setLoading } = useAuth();
    const [showPass, setShowPass] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success(lang === 'bn' ? 'সাইন ইন সফল হয়েছে' : 'Login Successful');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        try {
            await signInWithGoogle();
            toast.success(lang === 'bn' ? 'সাইন ইন সফল হয়েছে' : 'Login Successful');
            navigate(from, { replace: true });
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
                    <img src={heroImg} alt="SmartKids login" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-neutral/75" />
                    <div className="absolute inset-0 flex flex-col justify-center px-10 space-y-4 text-white">
                        <h2 className="text-3xl font-bold leading-tight">{c.imgTitle}</h2>
                        <p className="text-sm md:text-base text-white/85 max-w-md">{c.imgSub}</p>
                        <p className="text-xs text-white/70">SmartKids — AI Powered Learning Platform</p>
                    </div>
                </div>

                {/* ── RIGHT: Form Panel ── */}
                <div className="flex flex-col justify-center p-6 sm:p-10">
                    <div className="mb-6 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-primary">{c.title}</h1>
                        <p className="text-sm text-neutral/50 mt-1">
                            {c.sub} <span className="font-semibold text-primary">SmartKids</span>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm text-neutral/70">{c.email}</label>
                            <input type="email" placeholder={c.emailPh}
                                className={`w-full px-3 py-2 border rounded-md border-base-300 bg-base-100 text-neutral focus:outline-primary ${errors.email ? 'border-error' : ''}`}
                                {...register('email', {
                                    required: c.err.req,
                                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: c.err.emailInvalid }
                                })} />
                            {errors.email && <p className="text-error text-xs mt-1">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex justify-between mb-1">
                                <label className="text-sm text-neutral/70">{c.pass}</label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">{c.forgot}</Link>
                            </div>
                            <div className="relative">
                                <input type={showPass ? 'text' : 'password'} placeholder={c.passPh}
                                    autoComplete="current-password"
                                    className={`w-full px-3 py-2 border rounded-md border-base-300 bg-base-100 text-neutral focus:outline-primary pr-10 ${errors.password ? 'border-error' : ''}`}
                                    {...register('password', { required: c.err.req })} />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                                    {showPass ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
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
                        {c.noAcc}{' '}
                        <Link to="/register" className="text-primary font-medium hover:underline">{c.registerLink}</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
