import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaQuestionCircle, FaArrowLeft, FaCheckCircle, FaLock, FaChevronDown, FaChevronUp, FaYoutube } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useApp } from '../../../../context/AppContext';
import { getLessons, getQuizByLesson, getCourseById } from '../../../../utils';

// ── Video Player ──
const VideoPlayer = ({ url, type }) => {
    if (!url) return (
        <div className="w-full aspect-video bg-base-300 rounded-2xl flex items-center justify-center">
            <p className="text-neutral/40 text-sm">No video available</p>
        </div>
    );

    // YouTube embed
    if (type === 'youtube' || url.includes('youtube') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) return (
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full"
                    allowFullScreen
                    title="Lesson video"
                />
            </div>
        );
    }

    // Cloudinary or direct video
    return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <video src={url} controls className="w-full h-full bg-black" />
        </div>
    );
};

// ── Quiz Component ──
const QuizSection = ({ lessonId, lang }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', lessonId],
        queryFn: () => getQuizByLesson(lessonId),
    });

    if (isLoading) return <div className="flex justify-center py-6"><TbFidgetSpinner className="animate-spin text-primary text-2xl" /></div>;
    if (!quiz) return (
        <div className="bg-base-200 rounded-2xl p-5 text-center text-neutral/40 text-sm">
            {lang === 'bn' ? 'এই লেসনে কোনো কুইজ নেই' : 'No quiz for this lesson'}
        </div>
    );

    const score = submitted ? quiz.questions.filter((q, i) => Number(answers[i]) === q.correct).length : 0;

    return (
        <div className="bg-base-100 rounded-3xl border border-base-300 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-neutral flex items-center gap-2">
                    <FaQuestionCircle className="text-accent" /> {quiz.title}
                </h3>
                {submitted && (
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${score === quiz.questions.length ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                        {score}/{quiz.questions.length} {lang === 'bn' ? 'সঠিক' : 'correct'}
                    </span>
                )}
            </div>

            <div className="flex flex-col gap-5">
                {quiz.questions.map((q, qi) => (
                    <div key={qi} className="flex flex-col gap-3">
                        <p className="font-semibold text-neutral text-sm">
                            {qi + 1}. {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                                const isSelected = Number(answers[qi]) === oi;
                                const isCorrect = oi === q.correct;
                                let cls = 'border-base-300 bg-base-200 text-neutral/70';
                                if (submitted) {
                                    if (isCorrect) cls = 'border-success bg-success/10 text-success font-semibold';
                                    else if (isSelected && !isCorrect) cls = 'border-error bg-error/10 text-error';
                                } else if (isSelected) {
                                    cls = 'border-primary bg-primary/10 text-primary font-semibold';
                                }
                                return (
                                    <button key={oi} type="button"
                                        disabled={submitted}
                                        onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm text-left transition-all ${cls} ${!submitted ? 'hover:border-primary/50 cursor-pointer' : 'cursor-default'}`}>
                                        {submitted && isCorrect && <FaCheckCircle className="text-success shrink-0" />}
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {!submitted ? (
                <button
                    onClick={() => setSubmitted(true)}
                    disabled={Object.keys(answers).length < quiz.questions.length}
                    className="w-full py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                    {lang === 'bn' ? 'জমা দিন' : 'Submit Quiz'}
                </button>
            ) : (
                <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                    className="w-full py-3 rounded-2xl border-2 border-base-300 text-neutral font-semibold hover:bg-base-200 transition-all">
                    {lang === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                </button>
            )}
        </div>
    );
};

// ── Main Page ──
const MyClass = () => {
    const { courseId } = useParams();
    const { lang } = useApp();
    const [activeLesson, setActiveLesson] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);

    const { data: course } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
    });

    const { data: lessons = [], isLoading } = useQuery({
        queryKey: ['lessons', courseId],
        queryFn: () => getLessons(courseId),
        onSuccess: (data) => { if (data.length > 0 && !activeLesson) setActiveLesson(data[0]); }
    });

    // Set first lesson as active when loaded
    const currentLesson = activeLesson || lessons[0];

    // Group by week
    const byWeek = lessons.reduce((acc, l) => {
        const w = l.weekIndex || 1;
        if (!acc[w]) acc[w] = [];
        acc[w].push(l);
        return acc;
    }, {});

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    return (
        <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center gap-3 flex-wrap">
                <Link to="/dashboard/my-courses" className="flex items-center gap-2 text-neutral/60 hover:text-primary text-sm font-semibold transition-colors">
                    <FaArrowLeft /> {lang === 'bn' ? 'আমার কোর্স' : 'My Courses'}
                </Link>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-neutral">
                        {course?.emoji} {lang === 'bn' ? (course?.titleBn || course?.title) : course?.title}
                    </h2>
                    <p className="text-neutral/50 text-xs">{lessons.length} {lang === 'bn' ? 'লেসন' : 'lessons'}</p>
                </div>
            </div>

            {lessons.length === 0 ? (
                <div className="bg-base-100 rounded-3xl border border-base-300 p-16 text-center">
                    <p className="text-5xl mb-4">🎬</p>
                    <p className="text-neutral/50">{lang === 'bn' ? 'এখনো কোনো লেসন যোগ করা হয়নি' : 'No lessons added yet'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Video + Quiz — left/main */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {currentLesson && (
                            <>
                                <VideoPlayer url={currentLesson.videoUrl} type={currentLesson.videoType} />

                                <div className="bg-base-100 rounded-3xl border border-base-300 p-5">
                                    <h3 className="font-bold text-neutral text-lg">
                                        {lang === 'bn' ? (currentLesson.titleBn || currentLesson.title) : currentLesson.title}
                                    </h3>
                                    <p className="text-neutral/50 text-xs mt-1">
                                        Week {currentLesson.weekIndex} · {currentLesson.duration || '—'}
                                    </p>
                                    {currentLesson.content && (
                                        <p className="text-neutral/70 text-sm mt-3 leading-relaxed">{currentLesson.content}</p>
                                    )}
                                </div>

                                {/* Quiz toggle */}
                                <button onClick={() => setShowQuiz(p => !p)}
                                    className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl bg-accent/10 text-accent font-bold hover:bg-accent/20 transition-all">
                                    <span className="flex items-center gap-2">
                                        <FaQuestionCircle /> {lang === 'bn' ? 'কুইজ দিন' : 'Take Quiz'}
                                    </span>
                                    {showQuiz ? <FaChevronUp /> : <FaChevronDown />}
                                </button>

                                <AnimatePresence>
                                    {showQuiz && (
                                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                            <QuizSection lessonId={currentLesson._id} lang={lang} />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </>
                        )}
                    </div>

                    {/* Lesson list — right sidebar */}
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-neutral text-sm">{lang === 'bn' ? 'লেসনসমূহ' : 'Lessons'}</h3>
                        {Object.entries(byWeek).sort(([a], [b]) => Number(a) - Number(b)).map(([week, wLessons]) => (
                            <div key={week} className="flex flex-col gap-2">
                                <p className="text-xs font-bold text-neutral/40 uppercase tracking-widest">Week {week}</p>
                                {wLessons.sort((a, b) => (a.order || 0) - (b.order || 0)).map(lesson => {
                                    const isActive = currentLesson?._id === lesson._id;
                                    return (
                                        <button key={lesson._id}
                                            onClick={() => { setActiveLesson(lesson); setShowQuiz(false); }}
                                            className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${isActive ? 'bg-primary text-white shadow-sm' : 'bg-base-100 border border-base-300 hover:border-primary/40 text-neutral'}`}>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${isActive ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                                                {isActive ? <FaPlay className="text-white text-xs" /> : <FaPlay className="text-xs" />}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-neutral'}`}>
                                                    {lang === 'bn' ? (lesson.titleBn || lesson.title) : lesson.title}
                                                </p>
                                                <p className={`text-xs ${isActive ? 'text-white/70' : 'text-neutral/40'}`}>{lesson.duration || '—'}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyClass;
