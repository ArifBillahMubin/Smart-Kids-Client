import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { TbFidgetSpinner } from 'react-icons/tb';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useApp } from '../../../context/AppContext';
import useAuth from '../../../hooks/useAuth';
import { saveUser, getUserByEmail } from '../../../utils';
import GoogleInfoModal from '../../../components/GoogleInfoModal';
import authImg from '../../../assets/login_page-removebg-preview.png';
import logo from '../../../assets/SmartKids_logo_final.png';

const t = {
    en: {
        welcome: 'Welcome Back! 👋',
        sub: 'Sign in to continue your child\'s learning journey',
        imgTitle: 'Continue the Journey',
        imgSub: 'Track progress, access courses and stay connected with teachers.',
        email: 'Email Address', emailPh: 'Enter your email',
        pass: 'Password', passPh: '••••••••',
        forgot: 'Forgot password?',
        btn: 'Sign In',
        googleBtn: 'Continue with Google',
        or: 'or continue with',
        noAcc: "Don't have an account?", registerLink: 'Sign Up',
        err: { req: 'Required', emailInvalid: 'Invalid email' },
    },
    bn: {
        welcome: 'আবার স্বাগতম! 👋',
        sub: 'আপনার সন্তানের শেখার যাত্রা চালিয়ে যেতে সাইন ইন করুন',
        imgTitle: 'যাত্রা চালিয়ে যান',
        imgSub: 'অগ্রগতি ট্র্যাক করুন, কোর্স দেখুন এবং শিক্ষকদের সাথে যুক্ত থাকুন।',
        email: 'ইমেইল ঠিকানা', emailPh: 'আপনার ইমেইল লিখুন',
        pass: 'পাসওয়ার্ড', passPh: '••••••••',
        forgot: 'পাসওয়ার্ড ভুলে গেছেন?',
        btn: 'সাইন ইন করুন',
        googleBtn: 'Google দিয়ে চালিয়ে যান',
        or: 'অথবা',
        noAcc: 'অ্যাকাউন্ট নেই?', registerLink: 'সাইন আপ করুন',
        err: { req: 'আবশ্যক', emailInvalid: 'সঠিক ইমেইল দিন' },
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
    const [googleUser, setGoogleUser] = useState(null);
    const [googleLoading, setGoogleLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    // Redirect based on role
    const redirectByRole = async (email) => {
        try {
            const dbUser = await getUserByEmail(email);
            if (dbUser?.role === 'admin') navigate('/admin', { replace: true });
            else navigate('/dashboard', { replace: true });
        } catch {
            navigate('/dashboard', { replace: true });
        }
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await signIn(data.email, data.password);
            toast.success(lang === 'bn' ? 'সাইন ইন সফল!' : 'Login Successful!');
            await redirectByRole(data.email);
        } catch (err) { toast.error(err?.message); }
        finally { setLoading(false); }
    };

    // Step 1: Google sign in → check if new user
    const handleGoogle = async () => {
        try {
            setGoogleLoading(true);
            const { user } = await signInWithGoogle();

            let dbUser = null;
            try {
                dbUser = await getUserByEmail(user.email);
            } catch {
                dbUser = null;
            }

            if (dbUser?._id) {
                toast.success(lang === 'bn' ? 'সাইন ইন সফল!' : 'Login Successful!');
                if (dbUser.role === 'admin') navigate('/admin', { replace: true });
                else navigate('/dashboard', { replace: true });
            } else {
                setGoogleUser(user); // show modal
            }
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    // Step 2: After modal submit — save to DB with all fields
    const handleGoogleModalComplete = async (extraData) => {
        setGoogleLoading(true);
        try {
            await saveUser({
                name: extraData.parentName || googleUser.displayName,
                email: googleUser.email,
                photoURL: googleUser.photoURL,
                phone: extraData.phone,
                childName: extraData.childName,
                childClass: extraData.childClass,
                childImageURL: extraData.childImageURL || '',
                dashboardPin: extraData.dashboardPin,
                role: 'guardian',
            });
            setGoogleUser(null);
            toast.success(lang === 'bn' ? 'সাইন আপ সফল!' : 'Signup Successful!');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err?.message);
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <>
        {googleUser && (
            <GoogleInfoModal googleUser={googleUser} onComplete={handleGoogleModalComplete} loading={googleLoading} />
        )}
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            {/* ── Left: Image Panel ── */}
            <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-base-200 to-secondary/10 p-12 relative overflow-hidden">
                {/* Blobs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/20 rounded-full blur-3xl" />

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
            <div className="flex items-center justify-center p-6 sm:p-12 bg-base-100">
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile logo */}
                    <img src={logo} alt="SmartKids" className="h-10 mb-8 md:hidden" />

                    <h1 className="text-3xl text-neutral mb-1">{c.welcome}</h1>
                    <p className="text-neutral/50 text-sm mb-8">{c.sub}</p>

                    {/* Google */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleGoogle} type="button"
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 border-base-300 bg-base-100 hover:border-primary/40 hover:bg-primary/5 transition-all font-semibold text-neutral text-sm mb-5"
                    >
                        {googleLoading ? <TbFidgetSpinner className="animate-spin text-xl" /> : <><FcGoogle size={22} /> {c.googleBtn}</>}
                    </motion.button>

                    {/* Divider */}
                    <div className="flex items-center gap-3 mb-5">
                        <div className="flex-1 h-px bg-base-300" />
                        <span className="text-neutral/40 text-xs font-medium">{c.or}</span>
                        <div className="flex-1 h-px bg-base-300" />
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        {/* Email */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-semibold text-neutral/70">{c.email}</label>
                            <div className="relative">
                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                                <input type="email" placeholder={c.emailPh}
                                    className={`w-full pl-10 pr-4 py-3 rounded-2xl border-2 bg-base-100 text-neutral outline-none transition-all focus:border-primary ${errors.email ? 'border-error' : 'border-base-300'}`}
                                    {...register('email', { required: c.err.req, pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: c.err.emailInvalid } })} />
                            </div>
                            {errors.email && <p className="text-error text-xs">{errors.email.message}</p>}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <div className="flex justify-between">
                                <label className="text-sm font-semibold text-neutral/70">{c.pass}</label>
                                <Link to="/forgot-password" className="text-xs text-primary hover:underline">{c.forgot}</Link>
                            </div>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                                <input type={showPass ? 'text' : 'password'} placeholder={c.passPh}
                                    className={`w-full pl-10 pr-12 py-3 rounded-2xl border-2 bg-base-100 text-neutral outline-none transition-all focus:border-primary ${errors.password ? 'border-error' : 'border-base-300'}`}
                                    {...register('password', { required: c.err.req })} />
                                <button type="button" onClick={() => setShowPass(p => !p)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
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

                    <p className="text-center text-sm text-neutral/50 mt-6">
                        {c.noAcc}{' '}
                        <Link to="/register" className="text-primary font-bold hover:underline">{c.registerLink}</Link>
                    </p>
                </motion.div>
            </div>
        </div>
        </>
    );
};

export default Login;
