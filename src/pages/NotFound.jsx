import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaHome, FaBook } from 'react-icons/fa';
import { Player } from '@lottiefiles/react-lottie-player';
import { useApp } from '../context/AppContext';

const NotFound = () => {
    const { lang } = useApp();

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center max-w-md"
            >
                {/* Lottie animation */}
                <Player
                    autoplay loop
                    src="https://assets8.lottiefiles.com/packages/lf20_kcsr6fcp.json"
                    style={{ width: 280, height: 280, margin: '0 auto' }}
                />

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-6xl font-extrabold text-primary mb-3"
                >
                    404
                </motion.h1>

                <h2 className="text-2xl font-bold text-neutral mb-2">
                    {lang === 'bn' ? 'পেজটি পাওয়া যায়নি' : 'Page Not Found'}
                </h2>
                <p className="text-neutral/50 text-sm mb-8">
                    {lang === 'bn'
                        ? 'আপনি যে পেজটি খুঁজছেন সেটি সরানো হয়েছে বা বিদ্যমান নেই।'
                        : "The page you're looking for has been moved or doesn't exist."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/"
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-md">
                        <FaHome /> {lang === 'bn' ? 'হোমে ফিরুন' : 'Go Home'}
                    </Link>
                    <Link to="/courses"
                        className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-base-300 text-neutral font-semibold hover:bg-base-200 transition-all">
                        <FaBook /> {lang === 'bn' ? 'কোর্স দেখুন' : 'Browse Courses'}
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default NotFound;
