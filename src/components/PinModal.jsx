import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useApp } from '../context/AppContext';

const PinModal = ({ onSuccess, onCancel, userName }) => {
    const { lang } = useApp();
    const [pin, setPin] = useState(['', '', '', '']);
    const [error, setError] = useState('');
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const inputs = useRef([]);

    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    const handleChange = (val, idx) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...pin];
        next[idx] = val;
        setPin(next);
        setError('');
        if (val && idx < 3) inputs.current[idx + 1]?.focus();
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
            inputs.current[idx - 1]?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const entered = pin.join('');
        if (entered.length < 4) {
            setError(lang === 'bn' ? '৪ সংখ্যার PIN দিন' : 'Enter 4-digit PIN');
            return;
        }
        setLoading(true);
        await new Promise(r => setTimeout(r, 300));
        setLoading(false);
        onSuccess(entered);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                    className="bg-base-100 rounded-3xl border border-base-300 shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-6"
                >
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FaShieldAlt className="text-primary text-2xl" />
                    </div>

                    {/* Title */}
                    <div className="text-center">
                        <h2 className="text-xl font-bold text-neutral">
                            {lang === 'bn' ? 'ড্যাশবোর্ড PIN' : 'Dashboard PIN'}
                        </h2>
                        <p className="text-neutral/50 text-sm mt-1">
                            {lang === 'bn'
                                ? `${userName || 'আপনার'} ড্যাশবোর্ড সুরক্ষিত। PIN দিন।`
                                : `${userName || 'Your'} dashboard is protected. Enter PIN.`}
                        </p>
                    </div>

                    {/* PIN inputs */}
                    <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-full">
                        <div className="flex gap-3 justify-center">
                            {pin.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={el => inputs.current[i] = el}
                                    type={show ? 'text' : 'password'}
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={e => handleChange(e.target.value, i)}
                                    onKeyDown={e => handleKeyDown(e, i)}
                                    className={`w-14 h-14 text-center text-2xl font-bold rounded-2xl border-2 bg-base-200 text-neutral outline-none transition-all
                                        ${error ? 'border-error' : digit ? 'border-primary' : 'border-base-300 focus:border-primary'}`}
                                />
                            ))}
                        </div>

                        {/* Show/hide toggle */}
                        <button type="button" onClick={() => setShow(p => !p)}
                            className="flex items-center gap-1.5 text-xs text-neutral/40 hover:text-neutral transition-colors">
                            {show ? <FaEyeSlash /> : <FaEye />}
                            {show
                                ? (lang === 'bn' ? 'লুকান' : 'Hide')
                                : (lang === 'bn' ? 'দেখান' : 'Show')}
                        </button>

                        {error && (
                            <p className="text-error text-xs font-semibold">{error}</p>
                        )}

                        <button type="submit" disabled={loading || pin.join('').length < 4}
                            className="w-full py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                            {loading && <TbFidgetSpinner className="animate-spin" />}
                            {lang === 'bn' ? 'প্রবেশ করুন' : 'Enter Dashboard'}
                        </button>
                    </form>

                    {/* Cancel */}
                    {onCancel && (
                        <button onClick={onCancel}
                            className="flex items-center gap-1.5 text-sm text-neutral/40 hover:text-neutral transition-colors">
                            <FaTimes className="text-xs" />
                            {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                        </button>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PinModal;
