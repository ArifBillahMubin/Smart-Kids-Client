import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useApp } from '../context/AppContext';

const API = import.meta.env.VITE_API_URL;

const ChatBot = () => {
    const { lang } = useApp();
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: lang === 'bn'
                ? 'হ্যালো! আমি Kido 🤖 SmartKids এর AI assistant। কীভাবে সাহায্য করতে পারি?'
                : 'Hello! I\'m Kido 🤖 SmartKids AI assistant. How can I help you?'
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);
        try {
            const res = await fetch(`${API}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    history: messages,
                }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
        } catch {
            setMessages(prev => [...prev, { role: 'model', text: lang === 'bn' ? 'দুঃখিত, কিছু সমস্যা হয়েছে।' : 'Sorry, something went wrong.' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* FAB button */}
            <button
                onClick={() => setOpen(p => !p)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all hover:scale-110">
                {open ? <FaTimes className="text-lg" /> : <FaRobot className="text-xl" />}
            </button>

            {/* Chat window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-base-100 rounded-3xl shadow-2xl border border-base-300 flex flex-col overflow-hidden"
                        style={{ height: '480px' }}>

                        {/* Header */}
                        <div className="bg-primary px-5 py-4 flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                                <FaRobot className="text-white text-lg" />
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm">Kido AI</p>
                                <p className="text-white/70 text-xs">{lang === 'bn' ? 'SmartKids সহকারী' : 'SmartKids Assistant'}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
                                        ${msg.role === 'user'
                                            ? 'bg-primary text-white rounded-br-sm'
                                            : 'bg-base-200 text-neutral rounded-bl-sm'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-base-200 px-4 py-2.5 rounded-2xl rounded-bl-sm flex items-center gap-2">
                                        <TbFidgetSpinner className="animate-spin text-primary text-sm" />
                                        <span className="text-xs text-neutral/50">{lang === 'bn' ? 'লিখছে...' : 'Typing...'}</span>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-base-300 flex gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder={lang === 'bn' ? 'কিছু জিজ্ঞেস করুন...' : 'Ask something...'}
                                className="flex-1 px-4 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all"
                            />
                            <button
                                onClick={sendMessage}
                                disabled={!input.trim() || loading}
                                className="w-10 h-10 rounded-2xl bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all disabled:opacity-40">
                                <FaPaperPlane className="text-xs" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ChatBot;
