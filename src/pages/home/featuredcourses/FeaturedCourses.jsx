import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { FaStar, FaUsers, FaBook, FaArrowRight } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery } from '@tanstack/react-query';
import { useApp } from '../../../context/AppContext';
import { getCourses } from '../../../utils';

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const card = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };

const FeaturedCourses = () => {
    const { lang } = useApp();

    const { data: allCourses = [], isLoading } = useQuery({
        queryKey: ['courses'],
        queryFn: getCourses,
    });

    // Show only published courses, max 3
    const featured = allCourses.filter(c => c.status === 'published').slice(0, 3);

    return (
        <section className="py-16 px-6 bg-base-100">
            <div className="max-w-7xl mx-auto">
                <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false }}
                    className="flex items-end justify-between mb-10 flex-wrap gap-4">
                    <div>
                        <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary text-xs font-bold px-4 py-1.5 rounded-full mb-3 tracking-widest uppercase">
                            📚 {lang === 'bn' ? 'জনপ্রিয় কোর্স' : 'Popular Courses'}
                        </span>
                        <h2 className="text-3xl md:text-4xl text-neutral">
                            {lang === 'bn' ? 'বৈশিষ্ট্যযুক্ত' : 'Featured'} <span className="text-primary">{lang === 'bn' ? 'কোর্সসমূহ' : 'Courses'}</span>
                        </h2>
                    </div>
                    <Link to="/courses" className="flex items-center gap-2 text-primary font-bold text-sm hover:gap-3 transition-all">
                        {lang === 'bn' ? 'সব কোর্স দেখুন' : 'View All Courses'} <FaArrowRight />
                    </Link>
                </motion.div>

                {isLoading && (
                    <div className="flex justify-center py-16">
                        <TbFidgetSpinner className="animate-spin text-primary text-4xl" />
                    </div>
                )}

                {!isLoading && featured.length === 0 && (
                    <div className="text-center py-16 text-neutral/40">
                        <p className="text-4xl mb-3">📚</p>
                        <p>{lang === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি' : 'No courses available yet'}</p>
                    </div>
                )}

                {!isLoading && featured.length > 0 && (
                    <motion.div key={`featured-${lang}`} variants={container} initial="hidden" whileInView="visible" viewport={{ once: false }}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featured.map(course => (
                            <motion.div key={course._id} variants={card} whileHover={{ y: -6 }}
                                className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden hover:shadow-lg transition-shadow group">
                                <div className={`bg-gradient-to-br ${course.color || 'from-primary to-primary/60'} p-6 flex items-center justify-between`}>
                                    <span className="text-5xl">{course.emoji}</span>
                                    <div className="text-right">
                                        <span className="text-white/80 text-xs font-semibold block">{lang === 'bn' ? (course.classBn || course.class) : course.class}</span>
                                        <div className="flex items-center gap-1 justify-end mt-1">
                                            <FaStar className="text-warning text-xs" />
                                            <span className="text-white font-bold text-sm">{course.rating || '—'}</span>
                                        </div>
                                        <span className={`text-xs font-bold block mt-0.5 ${!course.priceAmount ? 'text-white/90' : 'text-warning'}`}>
                                            {!course.priceAmount ? (lang === 'bn' ? 'বিনামূল্যে' : 'Free') : `৳${course.priceAmount}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5 flex flex-col gap-3">
                                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-primary/10 text-primary w-fit">
                                        {lang === 'bn' ? (course.subjectBn || course.subject) : course.subject}
                                    </span>
                                    <h3 className="font-bold text-neutral text-lg">{lang === 'bn' ? (course.titleBn || course.title) : course.title}</h3>
                                    <p className="text-neutral/50 text-sm line-clamp-2">{lang === 'bn' ? (course.descriptionBn || course.description) : course.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-neutral/50">
                                        <span className="flex items-center gap-1"><FaBook className="text-primary" />{course.lessons} {lang === 'bn' ? 'লেসন' : 'lessons'}</span>
                                        <span className="flex items-center gap-1"><FaUsers className="text-accent" />{(course.enrolled || 0).toLocaleString()}</span>
                                    </div>
                                    <Link to={`/courses/${course._id}`}
                                        className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all">
                                        {lang === 'bn' ? 'বিস্তারিত দেখুন' : 'View Details'} <FaArrowRight className="text-xs" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};

export default FeaturedCourses;
