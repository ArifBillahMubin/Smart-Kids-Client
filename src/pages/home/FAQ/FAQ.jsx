import React from 'react';
import { motion } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';
import { useApp } from '../../../context/AppContext';

const content = {
    en: {
        badge: '❓ FAQ', title: 'Frequently Asked', highlight: 'Questions',
        sub: 'Find answers to the most common questions from parents.',
        items: [
            { q: 'What age group is SmartKids for?', a: 'SmartKids is designed for students in Classes 1-5, i.e., children aged 6-11. All our content is aligned with the national curriculum.' },
            { q: 'Which subjects are covered?', a: 'Math, Science, Bangla, English, and Computer Basics — interactive lessons, quizzes, and practice sets are available for all 5 subjects.' },
            { q: 'How can I track my child\'s progress?', a: 'From our Parent Dashboard you can see daily lesson completion, quiz scores, weekly reports, and teacher feedback in real time.' },
            { q: 'Can it be used without internet?', a: 'Currently it\'s a fully online platform. We are soon launching an offline mode where lessons can be downloaded and studied without internet.' },
            { q: 'Is SmartKids available in Bangla?', a: 'Yes, all content is available in Bangla for Bangla-medium students. Separate content is also available for English-medium students.' },
            { q: 'What does the Free plan include?', a: 'The Free plan includes the first 2 chapters of each subject, 5 quizzes, and basic progress reports. Upgrade to Premium for all features.' },
            { q: 'How does AI help with learning?', a: 'Our AI analyzes each child\'s learning pace and weaknesses to suggest personalized lessons. It gives more practice on topics where the child struggles.' },
            { q: 'Can I cancel my subscription?', a: 'Yes, you can cancel anytime. After cancellation, you can continue using all features until the end of the current billing period.' },
        ],
    },
    bn: {
        badge: '❓ সচরাচর জিজ্ঞাসা', title: 'সচরাচর জিজ্ঞাসা', highlight: 'প্রশ্নসমূহ',
        sub: 'অভিভাবকদের সবচেয়ে বেশি জিজ্ঞাসিত প্রশ্নের উত্তর এখানে পাবেন।',
        items: [
            { q: 'SmartKids কোন বয়সের বাচ্চাদের জন্য?', a: 'SmartKids মূলত Class 1 থেকে Class 5 এর শিক্ষার্থীদের জন্য তৈরি, অর্থাৎ ৬ থেকে ১১ বছর বয়সী বাচ্চাদের জন্য। আমাদের সব কন্টেন্ট জাতীয় পাঠ্যক্রম অনুযায়ী তৈরি।' },
            { q: 'কোন কোন বিষয় পড়ানো হয়?', a: 'গণিত, বিজ্ঞান, বাংলা, ইংরেজি, এবং কম্পিউটার বেসিক — এই ৫টি বিষয়ে ইন্টারেক্টিভ লেসন, কুইজ এবং প্র্যাকটিস সেট পাওয়া যায়।' },
            { q: 'অভিভাবক হিসেবে আমি কীভাবে সন্তানের অগ্রগতি দেখব?', a: 'আমাদের Parent Dashboard থেকে আপনি প্রতিদিনের লেসন কমপ্লিশন, কুইজ স্কোর, সাপ্তাহিক রিপোর্ট এবং শিক্ষকের ফিডব্যাক সরাসরি দেখতে পাবেন।' },
            { q: 'কি ইন্টারনেট ছাড়া ব্যবহার করা যাবে?', a: 'এখন সম্পূর্ণ অনলাইন প্ল্যাটফর্ম। তবে আমরা শীঘ্রই অফলাইন মোড আনছি যেখানে লেসন ডাউনলোড করে পড়া যাবে।' },
            { q: 'SmartKids কি সম্পূর্ণ বাংলায়?', a: 'হ্যাঁ, বাংলা মাধ্যমের শিক্ষার্থীদের জন্য সব কন্টেন্ট বাংলায় পাওয়া যায়। ইংরেজি মাধ্যমের জন্যও আলাদা কন্টেন্ট আছে।' },
            { q: 'Free plan এ কী কী পাওয়া যায়?', a: 'Free plan এ প্রতিটি বিষয়ের প্রথম ২টি চ্যাপ্টার, ৫টি কুইজ এবং বেসিক প্রগ্রেস রিপোর্ট পাওয়া যায়। সব ফিচার পেতে Premium plan নিন।' },
            { q: 'AI কীভাবে শেখার সাহায্য করে?', a: 'আমাদের AI প্রতিটি বাচ্চার শেখার গতি ও দুর্বলতা বিশ্লেষণ করে personalized লেসন সাজেস্ট করে। যে টপিকে দুর্বল, সেখানে বেশি প্র্যাকটিস দেয়।' },
            { q: 'সাবস্ক্রিপশন বাতিল করা যাবে কি?', a: 'হ্যাঁ, যেকোনো সময় সাবস্ক্রিপশন বাতিল করা যাবে। বাতিল করলে বর্তমান billing period শেষ হওয়া পর্যন্ত সব ফিচার ব্যবহার করতে পারবেন।' },
        ],
    },
};

const FAQ = () => {
    const { lang } = useApp();
    const c = content[lang];

    return (
        <section className="py-16 px-6 bg-base-100">
            <div className="max-w-4xl mx-auto">
                <motion.div key={`faq-header-${lang}`} initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.5 }} className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-semibold px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
                        <FaQuestionCircle /> {c.badge}
                    </span>
                    <h2 className="text-3xl md:text-4xl font-extrabold text-neutral">{c.title} <span className="text-primary">{c.highlight}</span></h2>
                    <p className="text-neutral/50 text-sm mt-2">{c.sub}</p>
                </motion.div>
                <div className="flex flex-col gap-3">
                    {c.items.map((faq, i) => (
                        <motion.div key={`${lang}-${i}`} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }} transition={{ duration: 0.4, delay: i * 0.07 }}>
                            <div className="collapse collapse-arrow bg-base-200 rounded-2xl border-2 border-base-300 hover:border-primary/40 hover:bg-primary/5 transition-all duration-200">
                                <input type="radio" name="faq-accordion" defaultChecked={i === 0} />
                                <div className="collapse-title font-semibold text-neutral text-sm md:text-base pr-10">{faq.q}</div>
                                <div className="collapse-content text-neutral/60 text-sm leading-relaxed"><p className="pt-1">{faq.a}</p></div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
