import React from 'react';
import { motion } from 'framer-motion';
import { FaBullseye, FaEye, FaHeart, FaLightbulb, FaUsers, FaRocket } from 'react-icons/fa';
import heroImg from '../../../assets/hero.png';
import { useApp } from '../../../context/AppContext';

const fadeLeft = { hidden: { opacity: 0, x: -60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeRight = { hidden: { opacity: 0, x: 60 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } } };
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: d, ease: 'easeOut' } }) };

const content = {
    en: {
        missionBadge: 'Our Mission',
        visionBadge: 'Our Vision',
        missionPoints: [
            { icon: <FaHeart className="text-accent" />, label: 'Why', color: 'text-accent', text: 'We are passionate about empowering young minds in Classes 1-5. Every child deserves access to high-quality, joyful, and affordable learning — regardless of background.' },
            { icon: <FaLightbulb className="text-secondary" />, label: 'What', color: 'text-secondary', text: 'We provide AI-powered, curriculum-aligned courses covering Math, Science, Reading, Coding and more — designed to be fun, interactive, and effective for early learners.' },
            { icon: <FaUsers className="text-primary" />, label: 'How', color: 'text-primary', text: 'We nurture kids in a safe, personalized environment with smart progress tracking, parent dashboards, and dedicated support — so every child can thrive at their own pace.' },
        ],
        visionPoints: [
            { icon: <FaRocket className="text-secondary" />, text: 'Be the most trusted AI learning platform for primary school children across South Asia.' },
            { icon: <FaBullseye className="text-accent" />, text: 'Make every child confident, curious, and ready for the future through smart early education.' },
            { icon: <FaEye className="text-primary" />, text: 'Build a world where parents and teachers work together seamlessly to unlock every child\'s potential.' },
        ],
    },
    bn: {
        missionBadge: 'আমাদের লক্ষ্য',
        visionBadge: 'আমাদের দৃষ্টিভঙ্গি',
        missionPoints: [
            { icon: <FaHeart className="text-accent" />, label: 'কেন', color: 'text-accent', text: 'আমরা ক্লাস ১-৫ এর শিশুদের সম্ভাবনা বিকাশে আবেগের সাথে কাজ করি। প্রতিটি শিশু মানসম্পন্ন, আনন্দময় এবং সাশ্রয়ী শিক্ষার সুযোগ পাওয়ার যোগ্য।' },
            { icon: <FaLightbulb className="text-secondary" />, label: 'কী', color: 'text-secondary', text: 'আমরা AI-চালিত, পাঠ্যক্রম-সামঞ্জস্যপূর্ণ কোর্স প্রদান করি — গণিত, বিজ্ঞান, পড়া, কোডিং এবং আরো অনেক কিছু — যা মজাদার, ইন্টারেক্টিভ এবং কার্যকর।' },
            { icon: <FaUsers className="text-primary" />, label: 'কীভাবে', color: 'text-primary', text: 'আমরা শিশুদের নিরাপদ, ব্যক্তিগতকৃত পরিবেশে লালন করি — স্মার্ট প্রগ্রেস ট্র্যাকিং, প্যারেন্ট ড্যাশবোর্ড এবং নিবেদিত সাপোর্ট সহ।' },
        ],
        visionPoints: [
            { icon: <FaRocket className="text-secondary" />, text: 'দক্ষিণ এশিয়ার প্রাথমিক বিদ্যালয়ের শিশুদের জন্য সবচেয়ে বিশ্বস্ত AI শিক্ষা প্ল্যাটফর্ম হওয়া।' },
            { icon: <FaBullseye className="text-accent" />, text: 'স্মার্ট প্রাথমিক শিক্ষার মাধ্যমে প্রতিটি শিশুকে আত্মবিশ্বাসী, কৌতূহলী এবং ভবিষ্যতের জন্য প্রস্তুত করা।' },
            { icon: <FaEye className="text-primary" />, text: 'এমন একটি বিশ্ব গড়া যেখানে অভিভাবক ও শিক্ষকরা একসাথে প্রতিটি শিশুর সম্ভাবনা উন্মোচন করতে কাজ করেন।' },
        ],
    },
};

const OurMissionAndVision = () => {
    const { lang } = useApp();
    const c = content[lang];

    return (
        <section className="py-20 px-6 bg-[#0F172A] overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col gap-20">

                {/* MISSION */}
                <div>
                    <motion.div key={`mission-${lang}`} initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp} className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white inline-flex items-center gap-3">
                            <FaBullseye className="text-primary" /> {c.missionBadge}
                            <span className="text-primary animate-pulse">_</span>
                        </h2>
                        <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.3 }} className="h-1 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mt-4" />
                    </motion.div>
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <motion.div variants={fadeLeft} initial="hidden" whileInView="visible" viewport={{ once: false }} className="flex-1">
                            <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
                                <img src={heroImg} alt="Our Mission" className="w-full h-80 object-contain bg-base-200 p-6" />
                            </div>
                        </motion.div>
                        <motion.div variants={fadeRight} initial="hidden" whileInView="visible" viewport={{ once: false }} className="flex-1 flex flex-col gap-6">
                            {c.missionPoints.map((p, i) => (
                                <motion.div key={`${lang}-m-${i}`} custom={i * 0.15} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false }} className="flex gap-4 items-start">
                                    <div className="mt-1 text-xl">{p.icon}</div>
                                    <p className="text-white/80 text-sm leading-relaxed">
                                        <span className={`font-bold ${p.color}`}>{p.label}: </span>{p.text}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </div>

                {/* VISION */}
                <div>
                    <motion.div key={`vision-${lang}`} initial="hidden" whileInView="visible" viewport={{ once: false }} variants={fadeUp} className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white inline-flex items-center gap-3">
                            <FaEye className="text-secondary" /> {c.visionBadge}
                            <span className="text-secondary animate-pulse">_</span>
                        </h2>
                        <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: false }} transition={{ duration: 0.8, delay: 0.3 }} className="h-1 bg-gradient-to-r from-secondary to-primary rounded-full mx-auto mt-4" />
                    </motion.div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {c.visionPoints.map((v, i) => (
                            <motion.div key={`${lang}-v-${i}`} custom={i * 0.2} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: false }} whileHover={{ scale: 1.04, y: -6 }}
                                className="bg-white/5 border border-white/10 rounded-3xl p-7 flex flex-col items-center text-center gap-4 hover:bg-white/10 transition-colors duration-300 cursor-pointer">
                                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, delay: i * 0.5, ease: 'easeInOut' }} className="text-4xl">
                                    {v.icon}
                                </motion.div>
                                <p className="text-white/75 text-sm leading-relaxed">{v.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default OurMissionAndVision;
