import { useRef, useCallback, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import Tilt from 'react-parallax-tilt';
import confetti from 'canvas-confetti';
import { Player } from '@lottiefiles/react-lottie-player';
import { FaChevronLeft, FaChevronRight, FaArrowRight, FaPlay } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import { useApp } from '../../../context/AppContext';

const slides = {
    en: [
        {
            typeSeq: ['Learn Math 🔢', 1500, 'Learn Science 🔬', 1500, 'Learn English 📖', 1500, 'Learn Coding 💻', 1500],
            title: 'Unlock Your Child\'s',
            highlight: 'Potential',
            desc: 'AI-powered learning for Classes 1-5. Fun, interactive, and curriculum-aligned.',
            btn: 'Start Free Trial',
            lottie: 'https://assets2.lottiefiles.com/packages/lf20_wd1udlcz.json',
            accent: '#4F9CF9',
        },
        {
            typeSeq: ['Fun Lessons 🎨', 1500, 'Smart Quizzes 🧠', 1500, 'Cool Rewards 🏆', 1500, 'Happy Kids 😊', 1500],
            title: 'Learning Made',
            highlight: 'Fun & Joyful',
            desc: 'Interactive lessons that keep kids engaged, motivated, and excited every single day.',
            btn: 'Explore Courses',
            lottie: 'https://assets3.lottiefiles.com/packages/lf20_fcfjwiyb.json',
            accent: '#FF9F43',
        },
        {
            typeSeq: ['Math Skills 📐', 1500, 'Reading Skills 📚', 1500, 'Science Skills 🔭', 1500, 'Life Skills 🌟', 1500],
            title: 'Build Strong',
            highlight: 'Foundations',
            desc: 'Curriculum-aligned content for Math, Science, Reading and more — all in one place.',
            btn: 'Get Started Free',
            lottie: 'https://assets9.lottiefiles.com/packages/lf20_touohxv0.json',
            accent: '#26de81',
        },
    ],
    bn: [
        {
            typeSeq: ['গণিত শেখো 🔢', 1500, 'বিজ্ঞান শেখো 🔬', 1500, 'ইংরেজি শেখো 📖', 1500, 'কোডিং শেখো 💻', 1500],
            title: 'সন্তানের সম্ভাবনা',
            highlight: 'উন্মোচন করো',
            desc: 'ক্লাস ১-৫ এর জন্য AI-চালিত শিক্ষা। মজাদার, ইন্টারেক্টিভ এবং পাঠ্যক্রম অনুযায়ী।',
            btn: 'ট্রায়াল শুরু করুন',
            lottie: 'https://assets2.lottiefiles.com/packages/lf20_wd1udlcz.json',
            accent: '#4F9CF9',
        },
        {
            typeSeq: ['মজার লেসন 🎨', 1500, 'স্মার্ট কুইজ 🧠', 1500, 'দারুণ পুরস্কার 🏆', 1500, 'খুশি বাচ্চা 😊', 1500],
            title: 'শেখাকে করো',
            highlight: 'আনন্দময়',
            desc: 'ইন্টারেক্টিভ লেসন যা বাচ্চাদের প্রতিদিন শেখার প্রতি আগ্রহী ও অনুপ্রাণিত রাখে।',
            btn: 'কোর্স দেখুন',
            lottie: 'https://assets3.lottiefiles.com/packages/lf20_fcfjwiyb.json',
            accent: '#FF9F43',
        },
        {
            typeSeq: ['গণিত দক্ষতা 📐', 1500, 'পড়ার দক্ষতা 📚', 1500, 'বিজ্ঞান দক্ষতা 🔭', 1500, 'জীবন দক্ষতা 🌟', 1500],
            title: 'শক্তিশালী',
            highlight: 'ভিত্তি গড়ো',
            desc: 'গণিত, বিজ্ঞান, পড়া ও আরো অনেক কিছু — সব একটি জায়গায় পাঠ্যক্রম অনুযায়ী।',
            btn: 'বিনামূল্যে শুরু করুন',
            lottie: 'https://assets9.lottiefiles.com/packages/lf20_touohxv0.json',
            accent: '#26de81',
        },
    ],
};

// light/dark bg per slide
const slideBgs = {
    light: [
        'from-[#EEF6FF] via-[#F0F9FF] to-[#E8F5FF]',
        'from-[#FFF8EE] via-[#FFF3E0] to-[#FFF8F0]',
        'from-[#EDFFF5] via-[#F0FFF4] to-[#E8FFF2]',
    ],
    dark: [
        'from-[#0F172A] via-[#0F1F3A] to-[#0A1628]',
        'from-[#1A0F00] via-[#1F1500] to-[#180E00]',
        'from-[#001A0F] via-[#001F12] to-[#00180A]',
    ],
};

const fireConfetti = (accent) => {
    confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: [accent, '#FF9F43', '#F472B6', '#4ADE80', '#60A5FA'],
        scalar: 1.1,
    });
};

const textAnim = { hidden: {}, visible: { transition: { staggerChildren: 0.13 } } };
const itemAnim = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } } };

const Banner = () => {
    const { lang, theme } = useApp();
    const data = slides[lang];
    const isDark = theme === 'smartkids-dark';
    const swiperRef = useRef(null);
    const [activeIdx, setActiveIdx] = useState(0);
    const particlesInit = useCallback(async (engine) => { await loadSlim(engine); }, []);

    const particleOptions = {
        background: { color: { value: 'transparent' } },
        fpsLimit: 60,
        particles: {
            number: { value: 28, density: { enable: true, area: 900 } },
            color: { value: ['#4F9CF9', '#FF9F43', '#F472B6', '#4ADE80', '#FDE68A'] },
            shape: { type: ['circle', 'star'] },
            opacity: { value: { min: 0.2, max: 0.5 } },
            size: { value: { min: 3, max: 8 } },
            move: { enable: true, speed: 1.2, direction: 'none', random: true, outModes: 'out' },
        },
        detectRetina: true,
    };

    return (
        <div className="w-full relative" style={{ minHeight: 'calc(100vh - 64px)' }}>
            <Swiper
                onSwiper={(s) => { swiperRef.current = s; }}
                onSlideChange={(s) => setActiveIdx(s.realIndex)}
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                pagination={{ clickable: true, el: '.banner-dots' }}
                loop speed={1000}
                style={{ minHeight: 'calc(100vh - 64px)' }}
            >
                {data.map((slide, i) => (
                    <SwiperSlide key={i} style={{ minHeight: 'calc(100vh - 64px)' }}>
                        <div className={`w-full min-h-[calc(100vh-64px)] bg-gradient-to-br ${slideBgs[isDark ? 'dark' : 'light'][i]} relative overflow-hidden flex items-center`}>

                            {/* Particles */}
                            <Particles
                                id={`particles-${i}`}
                                init={particlesInit}
                                options={particleOptions}
                                className="absolute inset-0 z-0"
                            />

                            {/* Soft blurred blobs */}
                            <div className="absolute top-[-80px] right-[-80px] w-[340px] h-[340px] rounded-full blur-3xl opacity-30 pointer-events-none"
                                style={{ background: slide.accent }} />
                            <div className="absolute bottom-[-60px] left-[-60px] w-[260px] h-[260px] rounded-full blur-3xl opacity-20 pointer-events-none"
                                style={{ background: '#F472B6' }} />

                            {/* Content */}
                            <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-12 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                                {/* Left */}
                                <motion.div
                                    key={`text-${i}-${lang}`}
                                    variants={textAnim}
                                    initial="hidden"
                                    animate="visible"
                                    className="flex flex-col gap-6"
                                >
                                    {/* Typewriter pill */}
                                    <motion.div variants={itemAnim}>
                                        <span className="inline-flex items-center gap-2 font-bold text-sm px-5 py-2 rounded-full shadow-sm"
                                            style={{
                                                background: isDark ? `${slide.accent}22` : `${slide.accent}18`,
                                                color: slide.accent,
                                                border: `1px solid ${slide.accent}33`
                                            }}>
                                            <TypeAnimation
                                                key={`${i}-${lang}`}
                                                sequence={slide.typeSeq}
                                                wrapper="span"
                                                speed={55}
                                                repeat={Infinity}
                                            />
                                        </span>
                                    </motion.div>

                                    {/* Heading */}
                                    <motion.h1 variants={itemAnim}
                                        className={`text-4xl sm:text-5xl lg:text-6xl leading-tight ${isDark ? 'text-white' : 'text-neutral'}`}>
                                        {slide.title} <br />
                                        <span className="relative inline-block">
                                            <span style={{ color: slide.accent }}>{slide.highlight}</span>
                                            {/* Underline squiggle */}
                                            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                                <path d="M2 8 Q50 2 100 8 Q150 14 198 8" stroke={slide.accent} strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.5" />
                                            </svg>
                                        </span>
                                    </motion.h1>

                                    {/* Description */}
                                    <motion.p variants={itemAnim}
                                        className={`text-base sm:text-lg max-w-md leading-relaxed ${isDark ? 'text-white/65' : 'text-neutral/65'}`}>
                                        {slide.desc}
                                    </motion.p>

                                    {/* Buttons */}
                                    <motion.div variants={itemAnim} className="flex flex-wrap gap-3">
                                        <motion.button
                                            whileHover={{ scale: 1.07, boxShadow: `0 8px 30px ${slide.accent}55` }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => fireConfetti(slide.accent)}
                                            style={{ background: slide.accent }}
                                            className="flex items-center gap-2 text-white font-bold px-7 py-3.5 rounded-full shadow-lg text-base transition-all"
                                        >
                                            {slide.btn} <FaArrowRight />
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            className={`flex items-center gap-2 font-semibold px-6 py-3.5 rounded-full text-base border ${isDark ? 'bg-white/10 backdrop-blur-sm text-white border-white/20' : 'bg-white/70 backdrop-blur-sm text-neutral border-white/80'}`}
                                        >
                                            <FaPlay className="text-xs" style={{ color: slide.accent }} />
                                            {lang === 'bn' ? 'ভিডিও দেখুন' : 'Watch Video'}
                                        </motion.button>
                                    </motion.div>

                                    {/* Trust badges */}
                                    <motion.div variants={itemAnim} className="flex items-center gap-4 flex-wrap">
                                        {['12K+ Students', '500+ Courses', '4.9 ⭐'].map((badge, j) => (
                                            <span key={j} className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${isDark ? 'text-white/60 bg-white/10 border-white/15' : 'text-neutral/60 bg-white/60 backdrop-blur-sm border-white/70'}`}>
                                                {badge}
                                            </span>
                                        ))}
                                    </motion.div>
                                </motion.div>

                                {/* Right — Tilt + Lottie */}
                                <motion.div
                                    key={`lottie-${i}`}
                                    initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                    transition={{ duration: 0.9, delay: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                                    className="flex justify-center md:justify-end"
                                >
                                    <Tilt
                                        tiltMaxAngleX={12}
                                        tiltMaxAngleY={12}
                                        glareEnable={true}
                                        glareMaxOpacity={0.08}
                                        glareColor="#ffffff"
                                        glarePosition="all"
                                        scale={1.04}
                                        transitionSpeed={600}
                                        className="w-64 h-64 sm:w-80 sm:h-80 lg:w-[420px] lg:h-[420px]"
                                    >
                                        <Player
                                            autoplay loop
                                            src={slide.lottie}
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </Tilt>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Nav arrows */}
            <button onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all flex items-center justify-center text-neutral">
                <FaChevronLeft />
            </button>
            <button onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white hover:scale-110 transition-all flex items-center justify-center text-neutral">
                <FaChevronRight />
            </button>

            {/* Slide dots */}
            <div className="banner-dots absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2" />
        </div>
    );
};

export default Banner;
