import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaBook } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { verifyPayment } from '../../utils';
import { useApp } from '../../context/AppContext';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
    const { lang } = useApp();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [enrollment, setEnrollment] = useState(null);

    useEffect(() => {
        console.log('=== SESSION ID ===', sessionId);
        if (!sessionId) { setStatus('error'); return; }

        verifyPayment(sessionId)
            .then(data => {
                console.log('=== VERIFY PAYMENT RESPONSE ===', data);
                if (data.success) {
                    setEnrollment(data);
                    setStatus('success');
                    // Confetti celebration
                    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 }, colors: ['#4F9CF9', '#FF9F43', '#F472B6', '#4ADE80', '#FDE68A'] });
                } else {
                    setStatus('error');
                }
            })
            .catch(() => setStatus('error'));
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-base-100 rounded-3xl border border-base-300 shadow-xl p-10 max-w-md w-full text-center"
            >
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <TbFidgetSpinner className="animate-spin text-primary text-5xl" />
                        <p className="text-neutral/60 font-medium">
                            {lang === 'bn' ? 'পেমেন্ট যাচাই করা হচ্ছে...' : 'Verifying payment...'}
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-5">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}>
                            <FaCheckCircle className="text-success text-7xl" />
                        </motion.div>
                        <div>
                            <h1 className="text-2xl font-bold text-neutral">
                                {lang === 'bn' ? 'পেমেন্ট সফল!' : 'Payment Successful!'}
                            </h1>
                            <p className="text-neutral/50 text-sm mt-2">
                                {lang === 'bn'
                                    ? 'আপনি সফলভাবে কোর্সে ভর্তি হয়েছেন।'
                                    : 'You have been successfully enrolled in the course.'}
                            </p>
                        </div>

                        {enrollment?.transactionId && (
                            <div className="bg-base-200 rounded-2xl p-4 w-full text-left">
                                <p className="text-xs text-neutral/40 font-medium uppercase tracking-wide mb-1">
                                    {lang === 'bn' ? 'ট্রানজেকশন আইডি' : 'Transaction ID'}
                                </p>
                                <p className="text-xs font-mono text-neutral/70 break-all">{enrollment.transactionId}</p>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 w-full">
                            <Link to="/dashboard/my-courses"
                                className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                <FaBook />
                                {lang === 'bn' ? 'আমার কোর্স দেখুন' : 'View My Courses'}
                            </Link>
                            <Link to="/courses"
                                className="w-full py-3 rounded-2xl border-2 border-base-300 text-neutral font-semibold hover:bg-base-200 transition-all text-sm">
                                {lang === 'bn' ? 'আরো কোর্স দেখুন' : 'Browse More Courses'}
                            </Link>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-5">
                        <FaTimesCircle className="text-error text-7xl" />
                        <div>
                            <h1 className="text-2xl font-bold text-neutral">
                                {lang === 'bn' ? 'পেমেন্ট ব্যর্থ হয়েছে' : 'Payment Failed'}
                            </h1>
                            <p className="text-neutral/50 text-sm mt-2">
                                {lang === 'bn'
                                    ? 'কিছু একটা সমস্যা হয়েছে। আবার চেষ্টা করুন।'
                                    : 'Something went wrong. Please try again.'}
                            </p>
                        </div>
                        <Link to="/courses"
                            className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                            {lang === 'bn' ? 'কোর্সে ফিরুন' : 'Back to Courses'}
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
