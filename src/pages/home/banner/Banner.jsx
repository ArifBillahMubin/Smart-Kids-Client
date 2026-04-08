import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { FaChevronLeft, FaChevronRight, FaGraduationCap, FaBookOpen, FaRocket, FaArrowRight } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import heroImg from '../../../assets/hero.png';
import { useApp } from '../../../context/AppContext';

const content = {
    en: [
        { icon: <FaGraduationCap className="text-success" />, badge: 'CLASSES 1-5',     title: 'Unlock Their', highlight: 'Potential',     desc: 'The AI-powered learning companion for Classes 1-5. Trusted by parents to build strong foundations.', btn: 'Start Parent Trial',     bg: 'bg-primary/10 border border-primary/20',     accent: 'text-secondary' },
        { icon: <FaBookOpen className="text-accent" />,       badge: 'SMART LEARNING',  title: 'Learn With',   highlight: 'Fun & Joy',     desc: 'Interactive lessons designed to keep kids engaged, motivated, and excited about learning every day.', btn: 'Explore Courses',        bg: 'bg-secondary/10 border border-secondary/20', accent: 'text-accent'    },
        { icon: <FaRocket className="text-primary" />,        badge: 'GROW FASTER',     title: 'Build Strong', highlight: 'Foundations',   desc: 'Curriculum-aligned content for Math, Science, Reading and more — all in one place.',                  btn: 'Get Started Free',       bg: 'bg-success/10 border border-success/20',     accent: 'text-success'   },
    ],
    bn: [
        { icon: <FaGraduationCap className="text-success" />, badge: 'ক্লাস ১-৫',        title: 'সম্ভাবনা',   highlight: 'উন্মোচন করো',  desc: 'ক্লাস ১-৫ এর জন্য AI-চালিত শেখার সঙ্গী। অভিভাবকদের বিশ্বাসে শক্তিশালী ভিত্তি গড়ে তোলে।', btn: 'ট্রায়াল শুরু করুন',   bg: 'bg-primary/10 border border-primary/20',     accent: 'text-secondary' },
        { icon: <FaBookOpen className="text-accent" />,       badge: 'স্মার্ট লার্নিং',  title: 'শেখো',        highlight: 'আনন্দের সাথে', desc: 'ইন্টারেক্টিভ লেসন যা বাচ্চাদের প্রতিদিন শেখার প্রতি আগ্রহী ও অনুপ্রাণিত রাখে।',             btn: 'কোর্স দেখুন',          bg: 'bg-secondary/10 border border-secondary/20', accent: 'text-accent'    },
        { icon: <FaRocket className="text-primary" />,        badge: 'দ্রুত এগিয়ে যাও',  title: 'শক্তিশালী',  highlight: 'ভিত্তি গড়ো',  desc: 'গণিত, বিজ্ঞান, পড়া ও আরো অনেক কিছু — সব একটি জায়গায় পাঠ্যক্রম অনুযায়ী।',                  btn: 'বিনামূল্যে শুরু করুন', bg: 'bg-success/10 border border-success/20',     accent: 'text-success'   },
    ],
};

const Banner = () => {
    const { lang } = useApp();
    const slides = content[lang];
    const swiperRef = useRef(null);

    return (
        <div className="w-full relative py-4">
            <Swiper
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                autoplay={{ delay: 4500, disableOnInteraction: false }}
                pagination={{ clickable: true, el: '.swiper-dots' }}
                loop
                speed={800}
            >
                {slides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <div className={`${slide.bg} rounded-2xl min-h-[420px]`}>
                            <div className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-10">
                                {/* Text */}
                                <div className="flex-1 flex flex-col gap-5 text-left">
                                    <span className="inline-flex items-center gap-2 bg-success/20 text-success font-semibold text-xs px-4 py-1.5 rounded-full w-fit tracking-widest uppercase">
                                        {slide.icon} {slide.badge}
                                    </span>
                                    <h1 className="text-4xl md:text-5xl font-extrabold text-neutral leading-tight">
                                        {slide.title} <br />
                                        <span className={slide.accent}>{slide.highlight}</span>
                                    </h1>
                                    <p className="text-neutral/60 text-base max-w-md leading-relaxed">{slide.desc}</p>
                                    <button className="btn bg-secondary border-none text-neutral font-bold rounded-full px-8 w-fit hover:scale-105 transition-transform duration-200 text-base mt-1 flex items-center gap-2">
                                        {slide.btn} <FaArrowRight className="text-sm" />
                                    </button>
                                </div>
                                {/* Image */}
                                <div className="flex-1 flex justify-center md:justify-end">
                                    <div className="bg-base-100 rounded-3xl shadow-xl p-5 w-72 h-72 md:w-80 md:h-80 flex items-center justify-center border border-base-300">
                                        <img src={heroImg} alt="SmartKids learning" className="w-full h-full object-contain drop-shadow-md" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom nav — use swiperRef */}
            <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-base-100 border border-base-300 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center text-neutral"
                aria-label="Previous"
            >
                <FaChevronLeft />
            </button>
            <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-base-100 border border-base-300 shadow-md hover:shadow-lg hover:scale-110 transition-all duration-200 flex items-center justify-center text-neutral"
                aria-label="Next"
            >
                <FaChevronRight />
            </button>

            {/* Dots */}
            <div className="swiper-dots flex justify-center gap-2 mt-4 pb-2" />
        </div>
    );
};

export default Banner;
