import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaLock, FaCheckCircle, FaBook, FaTrophy, FaChevronRight, FaChevronLeft, FaFire, FaBrain, FaVideo, FaCalendarAlt, FaClock, FaListUl, FaExclamationTriangle, FaUnlock, FaRocket } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { Link, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { getLessons, getQuizByLesson, getCourseById } from '../../utils';

// ── Video Player ──
const VideoPlayer = ({ url, type, onWatched, watched }) => {
    const getYoutubeId = (u) => u?.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];

    if (!url) return (
        <div className="w-full aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl flex flex-col items-center justify-center gap-4 border-2 border-dashed border-primary/30">
            <FaVideo className="text-primary/30 text-6xl" />
            <p className="text-neutral/50 font-semibold">No video yet</p>
            {!watched && (
                <button onClick={onWatched}
                    className="px-6 py-2.5 rounded-2xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-md">
                    <FaCheckCircle className="inline mr-2" />Mark as Done
                </button>
            )}
        </div>
    );

    const isYoutube = type === 'youtube' || url.includes('youtube') || url.includes('youtu.be');
    const videoId = isYoutube ? getYoutubeId(url) : null;

    return (
        <div className="flex flex-col gap-3">
            <div className="w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/20">
                {videoId
                    ? <iframe src={`https://www.youtube.com/embed/${videoId}?rel=0`} className="w-full h-full" allowFullScreen title="Lesson video" />
                    : <video src={url} controls className="w-full h-full bg-black" onEnded={onWatched} />}
            </div>
            {!watched && (
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={onWatched}
                    className="self-end flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-success text-white font-bold text-sm shadow-md hover:bg-success/90 transition-all">
                    <FaCheckCircle /> Mark as Watched
                </motion.button>
            )}
            {watched && (
                <div className="self-end flex items-center gap-2 px-4 py-2 rounded-2xl bg-success/15 text-success font-bold text-sm">
                    <FaCheckCircle /> Watched!
                </div>
            )}
        </div>
    );
};

// ── Quiz Section ──
const QuizSection = ({ lessonId, courseId, lang, userEmail, quizResults, onComplete, onNoQuiz, axiosSecure }) => {
    const queryClient = useQueryClient();
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', lessonId],
        queryFn: () => getQuizByLesson(lessonId),
    });

    const saveResult = useMutation({
        mutationFn: (d) => axiosSecure.post('/quiz-results', d),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quizResults', userEmail, courseId] }),
    });

    useEffect(() => {
        if (!isLoading && !quiz) onNoQuiz?.();
    }, [quiz, isLoading]);

    if (isLoading) return (
        <div className="flex justify-center py-8">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    if (!quiz) return null;

    const total = quiz.questions.length;
    const passed = submitted && score >= Math.ceil(total / 2);
    const prevResult = quizResults?.find(r => r.lessonId === lessonId);

    const handleSubmit = async () => {
        const s = quiz.questions.filter((q, i) => Number(answers[i]) === q.correct).length;
        const p = s >= Math.ceil(total / 2);
        setScore(s);
        setSubmitted(true);
        await saveResult.mutateAsync({ userEmail, courseId, lessonId, quizId: quiz._id, score: s, total, passed: p });
        // always complete — pass/fail only for guardian reports
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 }, colors: ['#4F9CF9', '#26de81', '#FDE68A'] });
        onComplete?.();
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-3xl border-2 border-accent/30 p-6 flex flex-col gap-5 shadow-lg">

            {/* Header */}
            <div className="flex items-center gap-2">
                <FaBrain className="text-accent text-2xl" />
                <h3 className="font-bold text-neutral text-lg">{quiz.title}</h3>
            </div>

            {/* Questions */}
            <div className="flex flex-col gap-6">
                {quiz.questions.map((q, qi) => (
                    <div key={qi} className="flex flex-col gap-3">
                        <p className="font-bold text-neutral">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold mr-2">{qi + 1}</span>
                            {q.question}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                                const isSelected = Number(answers[qi]) === oi;
                                const isCorrect = oi === q.correct;
                                let cls = 'border-base-300 bg-base-200 text-neutral/70 hover:border-primary/50 hover:bg-primary/5';
                                if (submitted) {
                                    if (isCorrect) cls = 'border-success bg-success/15 text-success font-bold';
                                    else if (isSelected) cls = 'border-error bg-error/10 text-error';
                                    else cls = 'border-base-300 bg-base-200 text-neutral/40';
                                } else if (isSelected) cls = 'border-primary bg-primary/10 text-primary font-bold scale-[1.02]';
                                return (
                                    <motion.button key={oi} type="button"
                                        whileHover={!submitted ? { scale: 1.02 } : {}}
                                        whileTap={!submitted ? { scale: 0.98 } : {}}
                                        disabled={submitted}
                                        onClick={() => !submitted && setAnswers(a => ({ ...a, [qi]: oi }))}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 text-sm text-left transition-all ${cls} ${!submitted ? 'cursor-pointer' : 'cursor-default'}`}>
                                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold
                                            ${submitted && isCorrect ? 'border-success bg-success text-white' : submitted && isSelected ? 'border-error bg-error text-white' : isSelected ? 'border-primary bg-primary text-white' : 'border-base-300'}`}>
                                            {submitted && isCorrect ? '✓' : submitted && isSelected ? '✗' : String.fromCharCode(65 + oi)}
                                        </span>
                                        {opt}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Submit / Result */}
            {!submitted ? (
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={Object.keys(answers).length < total}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                    <FaRocket className="inline mr-2" />{lang === 'bn' ? 'জমা দিন' : 'Submit Quiz'}
                </motion.button>
            ) : (
                <div className="flex flex-col gap-3">
                    <div className="rounded-2xl px-5 py-4 text-center font-bold text-lg bg-success/15 text-success flex items-center justify-center gap-2">
                        <FaUnlock /> {lang === 'bn' ? 'দারুণ! কুইজ দেওয়া হয়েছে — পরের লেসন আনলক!' : 'Great job! Quiz submitted — Next lesson unlocked!'}
                    </div>
                </div>
            )}
        </motion.div>
    );
};

// ── Main ──
const MyClass = () => {
    const { lang, activeClassCourseId, setActiveClassCourseId } = useApp();
    const { user } = useAuth();
    const { courseId: paramCourseId } = useParams();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [activeLesson, setActiveLesson] = useState(null);
    const [quizPassed, setQuizPassed] = useState(false);
    const [showRetakeQuiz, setShowRetakeQuiz] = useState(false);

    const courseId = paramCourseId || activeClassCourseId;
    const userEmail = user?.email;

    useEffect(() => {
        if (paramCourseId && paramCourseId !== activeClassCourseId) setActiveClassCourseId(paramCourseId);
    }, [paramCourseId]);

    // reset on lesson change
    useEffect(() => {
        setQuizPassed(false);
        setShowRetakeQuiz(false);
    }, [activeLesson?._id]);

    const { data: course } = useQuery({ queryKey: ['course', courseId], queryFn: () => getCourseById(courseId), enabled: !!courseId });
    const { data: lessons = [], isLoading } = useQuery({ queryKey: ['lessons', courseId], queryFn: () => getLessons(courseId), enabled: !!courseId });

    // Enrollment check
    const { data: enrollments = [], isLoading: enrollLoading } = useQuery({
        queryKey: ['enrollments', userEmail],
        queryFn: () => axiosSecure.get(`/enrollments/${userEmail}`).then(r => r.data),
        enabled: !!userEmail && !!courseId,
    });
    const isEnrolled = enrollments.some(e => e.courseId === courseId);
    const { data: progress = [] } = useQuery({
        queryKey: ['lessonProgress', userEmail, courseId],
        queryFn: () => axiosSecure.get(`/lesson-progress/${userEmail}/${courseId}`).then(r => r.data),
        enabled: !!userEmail && !!courseId,
    });
    const { data: quizResults = [] } = useQuery({
        queryKey: ['quizResults', userEmail, courseId],
        queryFn: () => axiosSecure.get(`/quiz-results/${userEmail}/${courseId}`).then(r => r.data),
        enabled: !!userEmail && !!courseId,
    });

    const watchMutation = useMutation({
        mutationFn: ({ lessonId }) => axiosSecure.post('/lesson-progress/watch', { userEmail, courseId, lessonId }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessonProgress', userEmail, courseId] }),
    });
    const completeMutation = useMutation({
        mutationFn: ({ lessonId }) => axiosSecure.post('/lesson-progress/complete', { userEmail, courseId, lessonId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessonProgress', userEmail, courseId] });
            toast.success(lang === 'bn' ? 'লেসন সম্পন্ন!' : 'Lesson complete!');
        },
    });

    const isWatched = (id) => progress.some(p => p.lessonId === id && p.watched);
    const isCompleted = (id) => progress.some(p => p.lessonId === id && p.completed);
    const completedCount = progress.filter(p => p.completed).length;

    const sortedLessons = [...lessons].sort((a, b) =>
        a.weekIndex !== b.weekIndex ? a.weekIndex - b.weekIndex : (a.order || 0) - (b.order || 0)
    );

    const isUnlocked = (lesson) => {
        const idx = sortedLessons.findIndex(l => l._id === lesson._id);
        if (idx === 0) return true;
        return isCompleted(sortedLessons[idx - 1]._id);
    };

    const currentLesson = activeLesson || sortedLessons[0];
    const currentIndex = sortedLessons.findIndex(l => l._id === currentLesson?._id);
    const nextLesson = sortedLessons[currentIndex + 1];
    const prevLesson = sortedLessons[currentIndex - 1];

    const videoWatched = currentLesson ? (isWatched(currentLesson._id) || isCompleted(currentLesson._id)) : false;
    const lessonDone = currentLesson ? isCompleted(currentLesson._id) : false;

    // can go next: lesson completed (which requires quiz pass if quiz exists)
    const canGoNext = lessonDone || quizPassed;

    const handleLessonClick = (lesson) => {
        if (!isUnlocked(lesson)) {
            toast.error(lang === 'bn' ? 'আগের লেসন শেষ করো!' : 'Complete the previous lesson first!');
            return;
        }
        setActiveLesson(lesson);
    };

    const handleWatched = (lessonId) => {
        if (!isWatched(lessonId)) watchMutation.mutate({ lessonId });
    };

    const handleComplete = (lessonId) => {
        if (!isCompleted(lessonId)) completeMutation.mutate({ lessonId });
    };

    const handleNext = () => {
        if (!nextLesson || !canGoNext) return;
        handleComplete(currentLesson._id);
        setActiveLesson(nextLesson);
    };

    const byWeek = sortedLessons.reduce((acc, l) => {
        const w = l.weekIndex || 1;
        if (!acc[w]) acc[w] = [];
        acc[w].push(l);
        return acc;
    }, {});

    const progressPct = sortedLessons.length ? Math.round((completedCount / sortedLessons.length) * 100) : 0;

    if (!courseId) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="mb-4">
                <FaBook className="text-primary text-8xl mx-auto" />
            </motion.div>
                <h2 className="text-2xl font-bold text-neutral mb-2">{lang === 'bn' ? 'কোনো ক্লাস সেট নেই' : 'No Class Set'}</h2>
                <p className="text-neutral/50 text-sm mb-6">{lang === 'bn' ? 'ড্যাশবোর্ড থেকে একটি কোর্স সক্রিয় করো।' : 'Activate a course from the dashboard.'}</p>
                <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg">
                    <FaBook /> {lang === 'bn' ? 'কোর্স দেখো' : 'Browse Courses'}
                </Link>
            </div>
        </div>
    );

    if (isLoading || enrollLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <TbFidgetSpinner className="animate-spin text-primary text-5xl" />
                <p className="text-neutral/50 font-semibold">{lang === 'bn' ? 'লোড হচ্ছে...' : 'Loading...'}</p>
            </div>
        </div>
    );

    if (courseId && !isEnrolled) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <p className="text-6xl mb-4">🔒</p>
                <h2 className="text-2xl font-bold text-neutral mb-2">{lang === 'bn' ? 'ভর্তি হননি' : 'Not Enrolled'}</h2>
                <p className="text-neutral/50 text-sm mb-6">{lang === 'bn' ? 'এই কোর্সে ভর্তি হতে হবে।' : 'You need to enroll in this course first.'}</p>
                <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                    <FaBook /> {lang === 'bn' ? 'কোর্স দেখুন' : 'Browse Courses'}
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-base-200">
            {/* ── Header ── */}
            <div className="bg-base-100 border-b border-base-300 px-4 sm:px-6 py-4 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}
                            className="text-primary text-3xl">
                            <FaBook />
                        </motion.div>
                        <div>
                            <h1 className="font-bold text-neutral text-base sm:text-lg leading-tight">
                                {lang === 'bn' ? (course?.titleBn || course?.title) : course?.title}
                            </h1>
                            <p className="text-neutral/50 text-xs">
                                {completedCount}/{sortedLessons.length} {lang === 'bn' ? 'লেসন সম্পন্ন' : 'lessons done'}
                            </p>
                        </div>
                    </div>
                    {/* Progress bar */}
                    <div className="flex items-center gap-3 flex-1 max-w-xs">
                        <div className="flex-1 h-3 bg-base-300 rounded-full overflow-hidden">
                            <motion.div className="h-full bg-gradient-to-r from-primary to-success rounded-full"
                                initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ duration: 0.8 }} />
                        </div>
                        <span className="text-xs font-bold text-primary shrink-0">{progressPct}%</span>
                    </div>
                    {/* Streak badge */}
                    {completedCount > 0 && (
                        <div className="flex items-center gap-1.5 bg-warning/15 text-warning px-3 py-1.5 rounded-full text-xs font-bold">
                            <FaFire /> {completedCount} {lang === 'bn' ? 'সম্পন্ন' : 'done'}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ── Main Content ── */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {currentLesson ? (
                        <>
                            {/* Video */}
                            <VideoPlayer
                                url={currentLesson.videoUrl}
                                type={currentLesson.videoType}
                                watched={videoWatched}
                                onWatched={() => handleWatched(currentLesson._id)}
                            />

                            {/* Lesson info card */}
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-base-100 rounded-3xl border border-base-300 p-5 shadow-sm">
                                <div className="flex items-start justify-between gap-3 flex-wrap">
                                    <div>
                                        <h2 className="font-bold text-neutral text-xl">
                                            {lang === 'bn' ? (currentLesson.titleBn || currentLesson.title) : currentLesson.title}
                                        </h2>
                        <p className="text-neutral/40 text-xs mt-1">
                                            <FaCalendarAlt className="inline mr-1" />Week {currentLesson.weekIndex}
                                            <FaClock className="inline mx-1" />{currentLesson.duration || '—'}
                                        </p>
                                    </div>
                                    {lessonDone && (
                                        <span className="flex items-center gap-1.5 text-success text-sm font-bold bg-success/10 px-3 py-1.5 rounded-full shrink-0">
                                            <FaCheckCircle /> {lang === 'bn' ? 'সম্পন্ন' : 'Done'}
                                        </span>
                                    )}
                                </div>
                                {currentLesson.content && (
                                    <p className="text-neutral/60 text-sm mt-3 leading-relaxed">{currentLesson.content}</p>
                                )}
                            </motion.div>

                            {!lessonDone && (
                                <div className="flex items-center gap-2">
                                    {[
                                        { icon: <FaVideo />, label: lang === 'bn' ? 'ভিডিও দেখো' : 'Watch Video', done: videoWatched },
                                        { icon: <FaBrain />, label: lang === 'bn' ? 'কুইজ দাও' : 'Take Quiz', done: quizPassed },
                                        { icon: <FaUnlock />, label: lang === 'bn' ? 'আনলক!' : 'Unlock!', done: false },
                                    ].map((step, i) => (
                                        <div key={i} className="flex items-center gap-1.5 flex-1">
                                            <div className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-bold flex-1 justify-center transition-all
                                                ${step.done ? 'bg-success/15 text-success' : i === 0 && !videoWatched ? 'bg-primary/10 text-primary animate-pulse' : i === 1 && videoWatched && !quizPassed ? 'bg-accent/10 text-accent animate-pulse' : 'bg-base-200 text-neutral/40'}`}>
                                                {step.icon} <span className="ml-1">{step.label}</span>
                                                {step.done && <FaCheckCircle className="ml-1" />}
                                            </div>
                                            {i < 2 && <FaChevronRight className="text-neutral/30 text-xs shrink-0" />}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Watch reminder */}
                            {!videoWatched && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="bg-warning/10 border-2 border-warning/30 rounded-2xl px-5 py-4 flex items-center gap-3">
                                    <FaExclamationTriangle className="text-warning text-2xl shrink-0" />
                                    <p className="text-warning font-bold text-sm">
                                        {lang === 'bn' ? 'আগে ভিডিওটা দেখো, তারপর কুইজ দিতে পারবে!' : 'Watch the video first, then you can take the quiz!'}
                                    </p>
                                </motion.div>
                            )}

                            {/* Quiz */}
                            <AnimatePresence>
                                {videoWatched && !lessonDone && (
                                    <QuizSection
                                        key={currentLesson._id}
                                        lessonId={currentLesson._id}
                                        courseId={courseId}
                                        lang={lang}
                                        userEmail={userEmail}
                                        quizResults={quizResults}
                                        axiosSecure={axiosSecure}
                                        onComplete={() => {
                                            setQuizPassed(true);
                                            handleComplete(currentLesson._id);
                                        }}
                                        onNoQuiz={() => {
                                            // no quiz → auto complete
                                            setQuizPassed(true);
                                            handleComplete(currentLesson._id);
                                        }}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Retake quiz after completion - removed */}

                            {/* Prev / Next navigation */}
                            <div className="flex items-center gap-3 pt-2">
                                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                                    onClick={() => prevLesson && handleLessonClick(prevLesson)}
                                    disabled={!prevLesson}
                                    className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-base-300 text-neutral font-bold hover:bg-base-200 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                    <FaChevronLeft className="text-xs" />
                                    {lang === 'bn' ? 'আগের' : 'Prev'}
                                </motion.button>

                                {nextLesson ? (
                                    <motion.button whileHover={canGoNext ? { scale: 1.03 } : {}} whileTap={canGoNext ? { scale: 0.97 } : {}}
                                        onClick={handleNext}
                                        disabled={!canGoNext}
                                        className={`flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-base transition-all
                                            ${canGoNext
                                                ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl'
                                                : 'bg-base-300 text-neutral/40 cursor-not-allowed'}`}>
                                        {lang === 'bn' ? 'পরের লেসন' : 'Next Lesson'} <FaChevronRight className="text-xs" />
                                    </motion.button>
                                ) : lessonDone ? (
                                    <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                                        className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-success to-primary text-white font-bold text-base shadow-lg">
                                        <FaTrophy /> {lang === 'bn' ? 'কোর্স সম্পন্ন!' : 'Course Complete!'}
                                    </motion.div>
                                ) : null}
                            </div>

                    {nextLesson && !canGoNext && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="text-center text-sm font-semibold text-warning flex items-center justify-center gap-2">
                            <FaExclamationTriangle />
                            {!videoWatched
                                ? (lang === 'bn' ? 'আগে ভিডিও দেখো' : 'Watch the video first')
                                : (lang === 'bn' ? 'কুইজ দিলেই পরের লেসন আনলক হবে!' : 'Submit the quiz to unlock the next lesson!')}
                        </motion.p>
                    )}
                        </>
                    ) : (
                        <div className="bg-base-100 rounded-3xl border border-base-300 p-16 text-center">
                            <FaVideo className="text-neutral/20 text-6xl mx-auto mb-4" />
                            <p className="text-neutral/50 font-semibold">{lang === 'bn' ? 'এখনো কোনো লেসন নেই' : 'No lessons yet'}</p>
                        </div>
                    )}
                </div>

                {/* ── Sidebar ── */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-neutral text-base flex items-center gap-2">
                            <FaListUl className="text-primary" />{lang === 'bn' ? 'লেসনসমূহ' : 'Lessons'}
                        </h3>
                        <span className="text-xs text-neutral/40">{completedCount}/{sortedLessons.length}</span>
                    </div>

                    {Object.entries(byWeek).sort(([a], [b]) => Number(a) - Number(b)).map(([week, wLessons]) => (
                        <div key={week} className="flex flex-col gap-2">
                            <p className="text-xs font-bold text-neutral/40 uppercase tracking-widest px-1 flex items-center gap-1">
                                <FaCalendarAlt className="text-xs" /> Week {week}
                            </p>
                            {wLessons.map((lesson, li) => {
                                const isActive = currentLesson?._id === lesson._id;
                                const done = isCompleted(lesson._id);
                                const watched = isWatched(lesson._id);
                                const unlocked = isUnlocked(lesson);

                                return (
                                    <motion.button key={lesson._id}
                                        whileHover={unlocked ? { scale: 1.02 } : {}}
                                        whileTap={unlocked ? { scale: 0.98 } : {}}
                                        onClick={() => handleLessonClick(lesson)}
                                        className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all
                                            ${isActive ? 'bg-gradient-to-r from-primary to-primary/80 text-white shadow-md' : ''}
                                            ${!isActive && done ? 'bg-success/10 border border-success/30' : ''}
                                            ${!isActive && !done && unlocked ? 'bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-sm' : ''}
                                            ${!unlocked ? 'bg-base-200 border border-base-300 opacity-50 cursor-not-allowed' : ''}`}>

                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-sm
                                            ${isActive ? 'bg-white/20 text-white' : done ? 'bg-success/20 text-success' : unlocked ? 'bg-primary/10 text-primary' : 'bg-base-300 text-neutral/30'}`}>
                                            {done ? <FaCheckCircle /> : unlocked ? <FaPlay className="text-xs" /> : <FaLock className="text-xs" />}
                                        </div>

                                        {/* Text */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-neutral'}`}>
                                                {lang === 'bn' ? (lesson.titleBn || lesson.title) : lesson.title}
                                            </p>
                                            <p className={`text-xs mt-0.5 flex items-center gap-1 ${isActive ? 'text-white/70' : 'text-neutral/40'}`}>
                                                {done ? <><FaCheckCircle className="text-success" />{lang === 'bn' ? 'সম্পন্ন' : 'Done'}</>
                                                    : watched ? <><FaBrain className="text-accent" />{lang === 'bn' ? 'কুইজ বাকি' : 'Quiz pending'}</>
                                                    : unlocked ? lesson.duration || '—'
                                                    : <><FaLock className="text-xs" />{lang === 'bn' ? 'লক' : 'Locked'}</>}
                                            </p>
                                        </div>

                                        {isActive && <FaChevronRight className="text-white/60 text-xs shrink-0" />}
                                    </motion.button>
                                );
                            })}
                        </div>
                    ))}

                    {/* Stars earned */}
                    {completedCount > 0 && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            className="mt-2 bg-gradient-to-r from-warning/20 to-primary/10 rounded-2xl p-4 flex items-center gap-3 border border-warning/30">
                            <FaTrophy className="text-warning text-2xl shrink-0" />
                            <div>
                                <p className="font-bold text-neutral text-sm">{completedCount} {lang === 'bn' ? 'স্টার অর্জিত!' : 'Stars Earned!'}</p>
                                <p className="text-neutral/50 text-xs">{lang === 'bn' ? 'দারুণ কাজ করছো!' : 'Keep it up!'}</p>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyClass;
