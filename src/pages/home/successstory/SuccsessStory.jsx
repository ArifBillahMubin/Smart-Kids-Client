import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';
import 'swiper/css';
import 'swiper/css/pagination';
import { useApp } from '../../../context/AppContext';

const content = {
    en: {
        badge: '💬 Real Stories', title: 'Success', highlight: 'Stories',
        sub: 'Real stories from parents across Bangladesh',
        stories: [
            { name: 'Fatema Begum', role: 'Mother of Rafi, Class 3', location: 'Dhaka', avatar: 'FB', color: 'bg-primary', rating: 5, text: "SmartKids transformed my son's life. In just 3 months his math score went from 45 to 85. He now sits down to study on his own — that never happened before!" },
            { name: 'Karim Uddin', role: 'Father of Nadia, Class 2', location: 'Chittagong', avatar: 'KU', color: 'bg-secondary', rating: 5, text: "My daughter was very weak in English. After SmartKids interactive lessons she can now write small sentences on her own. Even her teachers are amazed at her progress." },
            { name: 'Sumaiya Akter', role: 'Mother of Arif, Class 4', location: 'Sylhet', avatar: 'SA', color: 'bg-accent', rating: 5, text: "Good teachers are hard to find in rural areas. SmartKids gives my son the same opportunities as city kids. I can see daily reports from the parent dashboard — amazing!" },
            { name: 'Rahim Mia', role: 'Father of Tanha, Class 1', location: 'Rajshahi', avatar: 'RM', color: 'bg-success', rating: 5, text: "My daughter joined SmartKids at just 6 years old. She studies like it's a game. She's now much better in both Bangla and English. The whole family is happy." },
            { name: 'Nasrin Jahan', role: 'Mother of Sabbir, Class 5', location: 'Khulna', avatar: 'NJ', color: 'bg-primary', rating: 5, text: "SmartKids helped a lot before the Class 5 board exam. The science and math practice sets are excellent. My son won a scholarship in the talent pool this year!" },
            { name: 'Jahangir Alam', role: 'Father of Mim, Class 3', location: 'Barisal', avatar: 'JA', color: 'bg-secondary', rating: 5, text: "The reward system motivates my daughter to study every day. When she gets stars and badges she gets so happy that she wants to study even more. Truly amazing platform." },
        ],
    },
    bn: {
        badge: '💬 সত্যিকারের গল্প', title: 'সাফল্যের', highlight: 'গল্প',
        sub: 'সারা বাংলাদেশের অভিভাবকদের সত্যিকারের অভিজ্ঞতা',
        stories: [
            { name: 'ফাতেমা বেগম', role: 'রাফির মা, ক্লাস ৩', location: 'ঢাকা', avatar: 'FB', color: 'bg-primary', rating: 5, text: 'SmartKids পরিবর্তন এনেছে আমার ছেলের জীবনে। মাত্র ৩ মাসে গণিতে তার নম্বর ৪৫ থেকে ৮৫ হয়েছে। প্রতিদিন নিজে থেকেই পড়তে বসে — এটা আগে কখনো হতো না!' },
            { name: 'করিম উদ্দিন', role: 'নাদিয়ার বাবা, ক্লাস ২', location: 'চট্টগ্রাম', avatar: 'KU', color: 'bg-secondary', rating: 5, text: 'আমার মেয়ে ইংরেজিতে খুব দুর্বল ছিল। SmartKids-এর ইন্টারেক্টিভ লেসন দেখে সে এখন নিজেই ছোট ছোট বাক্য লিখতে পারে। শিক্ষকরাও অবাক হয়ে গেছেন।' },
            { name: 'সুমাইয়া আক্তার', role: 'আরিফের মা, ক্লাস ৪', location: 'সিলেট', avatar: 'SA', color: 'bg-accent', rating: 5, text: 'গ্রামে ভালো শিক্ষক পাওয়া কঠিন। SmartKids আমার ছেলেকে শহরের বাচ্চাদের মতো সুযোগ দিচ্ছে। প্যারেন্ট ড্যাশবোর্ড থেকে প্রতিদিনের রিপোর্ট দেখতে পাই।' },
            { name: 'রহিম মিয়া', role: 'তানহার বাবা, ক্লাস ১', location: 'রাজশাহী', avatar: 'RM', color: 'bg-success', rating: 5, text: 'আমার মেয়ে মাত্র ৬ বছর বয়সে SmartKids-এ যোগ দিয়েছে। গেমের মতো পড়াশোনা করে সে। বাংলা ও ইংরেজি দুটোতেই এখন অনেক ভালো।' },
            { name: 'নাসরিন জাহান', role: 'সাব্বিরের মা, ক্লাস ৫', location: 'খুলনা', avatar: 'NJ', color: 'bg-primary', rating: 5, text: 'ক্লাস ফাইভের বোর্ড পরীক্ষার আগে SmartKids অনেক সাহায্য করেছে। আমার ছেলে এবার ট্যালেন্টপুলে বৃত্তি পেয়েছে!' },
            { name: 'জাহাঙ্গীর আলম', role: 'মিমের বাবা, ক্লাস ৩', location: 'বরিশাল', avatar: 'JA', color: 'bg-secondary', rating: 5, text: 'SmartKids-এর রিওয়ার্ড সিস্টেম আমার মেয়েকে প্রতিদিন পড়তে অনুপ্রাণিত করে। স্টার ও ব্যাজ পেলে সে এত খুশি হয় যে নিজেই আরো পড়তে চায়।' },
        ],
    },
};

const SuccsessStory = () => {
    const { lang } = useApp();
    const c = content[lang];

    return (
        <section className="py-20 px-6 bg-base-200 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">{c.badge}</span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-neutral">{c.title} <span className="text-primary">{c.highlight}</span></h2>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.3 }} className="h-1 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto mt-4" />
                    <p className="text-neutral/50 text-sm mt-3">{c.sub}</p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}>
                    <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3500, disableOnInteraction: false }}
                        pagination={{ clickable: true, el: '.story-dots' }} loop speed={700} spaceBetween={20}
                        breakpoints={{ 0: { slidesPerView: 1 }, 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}>
                        {c.stories.map((s, i) => (
                            <SwiperSlide key={i}>
                                <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.25 }}
                                    className="bg-base-100 border border-base-300 rounded-3xl p-6 flex flex-col gap-5 h-full hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-center justify-between">
                                        <FaQuoteLeft className="text-primary text-3xl opacity-80" />
                                        <div className="flex gap-0.5">
                                            {Array(s.rating).fill(0).map((_, j) => <FaStar key={j} className="text-secondary text-xs" />)}
                                        </div>
                                    </div>
                                    <p className="text-neutral/70 text-sm leading-relaxed flex-1">{s.text}</p>
                                    <div className="flex items-center gap-3 pt-3 border-t border-base-300">
                                        <div className={`${s.color} w-11 h-11 rounded-full flex items-center justify-center text-neutral-content font-bold text-sm shrink-0`}>
                                            {s.avatar}
                                        </div>
                                        <div>
                                            <p className="text-neutral font-semibold text-sm">{s.name}</p>
                                            <p className="text-neutral/40 text-xs">{s.role}</p>
                                            <p className="text-primary text-xs">{s.location}</p>
                                        </div>
                                    </div>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                    <div className="story-dots flex justify-center gap-2 mt-8" />
                </motion.div>
            </div>
        </section>
    );
};

export default SuccsessStory;
