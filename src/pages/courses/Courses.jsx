import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaStar, FaUsers, FaBook, FaClock, FaSearch, FaArrowRight } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useApp } from '../../context/AppContext';
import { getCourses } from '../../utils';

const filters = {
    en: ['All', 'Mathematics', 'Science', 'English', 'Bangla', 'Coding', 'Arts'],
    bn: ['সব', 'গণিত', 'বিজ্ঞান', 'ইংরেজি', 'বাংলা', 'কোডিং', 'শিল্পকলা'],
};
const filterMap = {
    'All': null, 'Mathematics': 'Mathematics', 'Science': 'Science',
    'English': 'English', 'Bangla': 'Bangla', 'Coding': 'Coding', 'Arts': 'Arts',
    'সব': null, 'গণিত': 'Mathematics', 'বিজ্ঞান': 'Science',
    'ইংরেজি': 'English', 'বাংলা': 'Bangla', 'কোডিং': 'Coding', 'শিল্পকলা': 'Arts',
};

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const card = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const Courses = () => {
    const { lang } = useApp();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    // Fetch courses from API
    useEffect(() => {
        getCourses()
            .then(data => setCourses(data))
            .catch(() => setCourses([]))
            .finally(() => setLoading(false));
    }, []);

    const subject = filterMap[activeFilter];
    const filtered = courses.filter(c => {
        const matchSubject = !subject || c.subject === subject;
        const title = lang === 'bn' ? (c.titleBn || c.title) : c.title;
        const matchSearch = !search || title.toLowerCase().includes(search.toLowerCase());
        return matchSubject && matchSearch;
    });

    return (
        <div className="min-h-screen bg-base-200">
            {/* Hero */}
            <div className="bg-gradient-to-br from-primary/15 via-base-100 to-secondary/10 py-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl text-neutral mb-3">
                        {lang === 'bn' ? 'আমাদের' : 'Explore Our'} <span className="text-primary">{lang === 'bn' ? 'কোর্সসমূহ' : 'Courses'}</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                        className="text-neutral/50 text-base max-w-xl mx-auto mb-8">
                        {lang === 'bn'
                            ? 'ক্লাস ১-৫ এর জন্য AI-চালিত, পাঠ্যক্রম-সামঞ্জস্যপূর্ণ কোর্স। সম্পূর্ণ বিনামূল্যে।'
                            : 'AI-powered, curriculum-aligned courses for Classes 1-5. Completely free.'}
                    </motion.p>

                    {/* Search */}
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="relative max-w-md mx-auto">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral/30" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={lang === 'bn' ? 'কোর্স খুঁজুন...' : 'Search courses...'}
                            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral outline-none focus:border-primary transition-all shadow-sm" />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-10">
                {/* Filter tabs */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {filters[lang].map((f, i) => (
                        <motion.button key={i} whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeFilter === f ? 'bg-primary text-white shadow-sm' : 'bg-base-100 text-neutral/60 border border-base-300 hover:border-primary/40'}`}>
                            {f}
                        </motion.button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-24">
                        <TbFidgetSpinner className="animate-spin text-primary text-4xl" />
                    </div>
                )}

                {/* Course grid */}
                {!loading && (
                    <motion.div variants={container} initial="hidden" animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map(course => (
                            <motion.div key={course._id} variants={card} whileHover={{ y: -6 }}
                                className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden hover:shadow-lg transition-shadow group">
                                {/* Card header */}
                                <div className={`bg-gradient-to-br ${course.color || 'from-primary to-primary/60'} p-6 flex items-center justify-between`}>
                                    <span className="text-5xl">{course.emoji}</span>
                                    <div className="text-right">
                                        <span className="text-white/80 text-xs font-semibold block">{lang === 'bn' ? (course.classBn || course.class) : course.class}</span>
                                        <span className={`font-bold text-sm mt-1 block ${course.priceAmount === 0 ? 'text-white' : 'text-warning'}`}>
                                            {course.priceAmount === 0
                                                ? (lang === 'bn' ? 'বিনামূল্যে' : 'Free')
                                                : `৳${course.priceAmount}`}
                                        </span>
                                    </div>
                                </div>

                                {/* Card body */}
                                <div className="p-5 flex flex-col gap-3">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary w-fit">
                                        {lang === 'bn' ? (course.subjectBn || course.subject) : course.subject}
                                    </span>
                                    <h3 className="font-bold text-neutral text-lg leading-tight">
                                        {lang === 'bn' ? (course.titleBn || course.title) : course.title}
                                    </h3>
                                    <p className="text-neutral/50 text-sm leading-relaxed line-clamp-2">
                                        {lang === 'bn' ? (course.descriptionBn || course.description) : course.description}
                                    </p>

                                    <div className="flex items-center gap-4 text-xs text-neutral/50 pt-1">
                                        <span className="flex items-center gap-1"><FaBook className="text-primary" />{course.lessons} {lang === 'bn' ? 'লেসন' : 'lessons'}</span>
                                        <span className="flex items-center gap-1"><FaClock className="text-secondary" />{lang === 'bn' ? (course.durationBn || course.duration) : course.duration}</span>
                                        <span className="flex items-center gap-1"><FaUsers className="text-accent" />{(course.enrolled || 0).toLocaleString()}</span>
                                    </div>

                                    <div className="flex items-center gap-1.5">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar key={i} className={`text-xs ${i < Math.floor(course.rating || 0) ? 'text-warning' : 'text-base-300'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-neutral">{course.rating || '—'}</span>
                                        <span className="text-xs text-neutral/40">({course.reviews || 0})</span>
                                    </div>

                                    {/* Use _id for MongoDB data */}
                                    <Link to={`/courses/${course._id}`}
                                        className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all group-hover:shadow-md">
                                        {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'} <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}

                {!loading && filtered.length === 0 && (
                    <div className="text-center py-20 text-neutral/40">
                        <p className="text-5xl mb-4">🔍</p>
                        <p className="font-semibold">{lang === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি' : 'No courses found'}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Courses;
