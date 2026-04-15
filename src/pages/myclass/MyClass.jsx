import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaQuestionCircle, FaChevronDown, FaChevronUp, FaCheckCircle, FaBook, FaLock } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { Link, useParams } from 'react-router';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import useAuth from '../../hooks/useAuth';
import {
    getLessons, getQuizByLesson, getCourseById,
    getLessonProgress, markLessonWatched, markLessonComplete,
    getQuizResults, saveQuizResult
} from '../../utils';

// ── Video Player ──
const VideoPlayer = ({ url, type, onWatched }) => {
    if (!url) return (
        <div className="w-full aspect-video bg-base-300 rounded-2xl flex items-center justify-center flex-col gap-2">
            <FaPlay className="text-neutral/20 text-4xl" />
            <p className="text-neutral/40 text-sm">No video available</p>
            <button onClick={onWatched} className="mt-2 px-4 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all">
                Mark as Done
            </button>
        </div>
    );

    if (type === 'youtube' || url.includes('youtube') || url.includes('youtu.be')) {
        const videoId = url.match(/(?:v=|youtu\.be\/)([^&\s]+)/)?.[1];
        if (videoId) return (
            <div className="flex flex-col gap-3">
                <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <iframe src={`https://www.youtube.com/embed/${videoId}`} className="w-full h-full" allowFullScreen title="Lesson video" />
                </div>
                <div className="flex justify-end">
                    <button onClick={onWatched} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 text-success text-xs font-bold hover:bg-success hover:text-white transition-all">
                        <FaCheckCircle /> Mark as Watched
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <video src={url} controls className="w-full h-full bg-black" onEnded={onWatched} />
        </div>
    );
};

// ── Quiz Section ──
const QuizSection = ({ lessonId, courseId, lang, userEmail, quizResults, hasQuizCheck, onQuizPass, onNoQuiz }) => {
    const queryClient = useQueryClient();
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', lessonId],
        queryFn: () => getQuizByLesson(lessonId),
    });

    const saveResultMutation = useMutation({
        mutationFn: saveQuizResult,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quizResults', userEmail, courseId] }),
    });

    // No quiz — auto complete
    useEffect(() => {
        if (hasQuizCheck && !isLoading && !quiz) {
            onNoQuiz?.();
        }
    }, [quiz, isLoading, hasQuizCheck]);

    if (isLoading) return <div className="flex justify-center py-6"><TbFidgetSpinner className="animate-spin text-primary text-2xl" /></div>;
    if (!quiz) return (
        <div className="bg-base-200 rounded-2xl p-5 text-center text-neutral/40 text-sm">
            {lang === 'bn' ? 'এই লেসনে কোনো কুইজ নেই' : 'No quiz for this lesson'}
        </div>
    );

    // Check previous best result
    const prevResult = quizResults?.find(r => r.lessonId === lessonId);

    const score = submitted ? quiz.questions.filter((q, i) => Number(answers[i]) === q.correct).length : 0;
    const total = quiz.questions.length;
    const passed = submitted && score >= Math.ceil(total / 2);

    const handleSubmit = async () => {
        const s = quiz.questions.filter((q, i) => Number(answers[i]) === q.correct).length;
        const p = s >= Math.ceil(total / 2);
        setSubmitted(true);

        // Save result to DB regardless of pass/fail
        await saveResultMutation.mutateAsync({
            userEmail, courseId, lessonId,
            quizId: quiz._id,
            score: s, total,
            passed: p,
        });

        // Always complete lesson after attempting quiz (pass or fail)
        onQuizPass?.();
    };

    return (
        <div className="bg-base-100 rounded-3xl border border-base-300 p-6 flex flex-col gap-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="font-bold text-neutral flex items-center gap-2">
                    <FaQuestionCircle className="text-accent" /> {quiz.title}
                </h3>
                <div className="flex items-center gap-2">
                    {prevResult && (
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${prevResult.passed ? 'bg-success/15 text-success' : 'bg-warning/15 text-warning'}`}>
                            {lang === 'bn' ? 'সেরা:' : 'Best:'} {prevResult.score}/{prevResult.total}
                        </span>
                    )}
                    {submitted && (
                        <span className={`text-sm font-bold px-3 py-1 rounded-full ${passed ? 'bg-success/15 text-success' : 'bg-error/15 text-error'}`}>
                            {score}/{total} {lang === 'bn' ? 'সঠিক' : 'correct'}
                        </span>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-5">
                {quiz.questions.map((q, qi) => (
                    <div key={qi} className="flex flex-col gap-3">
                        <p className="font-semibold text-neutral text-sm">{qi + 1}. {q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {q.options.map((opt, oi) => {
                                const isSelected = Number(answers[qi]) === oi;
                                const isCorrect = oi === q.correct;
                                let cls = 'border-base-300 bg-base-200 text-neutral/70';
                                if (submitted) {
                                    if (isCorrect) cls = 'border-success bg-success/10 text-success font-semibold';
                                    else if (isSelected) cls = 'border-error bg-error/10 text-error';
                                } else if (isSelected) cls = 'border-primary bg-primary/10 text-primary font-semibold';
                                return (
                                    <button key={oi} type="button" disabled={submitted}
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
                <button onClick={handleSubmit}
                    disabled={Object.keys(answers).length < total}
                    className="w-full py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all disabled:opacity-50">
                    {lang === 'bn' ? 'জমা দিন' : 'Submit Quiz'}
                </button>
            ) : (
                <div className="flex flex-col gap-2">
                    {passed && (
                        <div className="flex items-center gap-2 bg-success/10 rounded-2xl px-4 py-3 text-success font-bold text-sm">
                            <FaCheckCircle /> {lang === 'bn' ? 'পরবর্তী লেসন আনলক হয়েছে! 🎉' : 'Next lesson unlocked! 🎉'}
                        </div>
                    )}
                    {!passed && (
                        <div className="bg-error/10 rounded-2xl px-4 py-3 text-error text-sm font-semibold">
                            {lang === 'bn' ? `আবার চেষ্টা করুন। পাস করতে ${Math.ceil(total / 2)}/${total} সঠিক লাগবে।` : `Try again. Need ${Math.ceil(total / 2)}/${total} correct to pass.`}
                        </div>
                    )}
                    <button onClick={() => { setAnswers({}); setSubmitted(false); }}
                        className="w-full py-3 rounded-2xl border-2 border-base-300 text-neutral font-semibold hover:bg-base-200 transition-all">
                        {lang === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
                    </button>
                </div>
            )}
        </div>
    );
};

// ── Main ──
const MyClass = () => {
    const { lang, activeClassCourseId, setActiveClassCourseId } = useApp();
    const { user } = useAuth();
    const { courseId: paramCourseId } = useParams();
    const queryClient = useQueryClient();
    const [activeLesson, setActiveLesson] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);

    // URL param takes priority, fallback to context
    const courseId = paramCourseId || activeClassCourseId;

    // Sync param courseId into context if needed
    useEffect(() => {
        if (paramCourseId && paramCourseId !== activeClassCourseId) {
            setActiveClassCourseId(paramCourseId);
        }
    }, [paramCourseId]);

    const userEmail = user?.email;

    // ── Fetch course, lessons, progress, quiz results ──
    const { data: course } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => getCourseById(courseId),
        enabled: !!courseId,
    });

    const { data: lessons = [], isLoading } = useQuery({
        queryKey: ['lessons', courseId],
        queryFn: () => getLessons(courseId),
        enabled: !!courseId,
    });

    const { data: progress = [] } = useQuery({
        queryKey: ['lessonProgress', userEmail, courseId],
        queryFn: () => getLessonProgress(userEmail, courseId),
        enabled: !!userEmail && !!courseId,
    });

    const { data: quizResults = [] } = useQuery({
        queryKey: ['quizResults', userEmail, courseId],
        queryFn: () => getQuizResults(userEmail, courseId),
        enabled: !!userEmail && !!courseId,
    });

    // ── Mutations ──
    const watchMutation = useMutation({
        mutationFn: ({ lessonId }) => markLessonWatched(userEmail, courseId, lessonId),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['lessonProgress', userEmail, courseId] }),
    });

    const completeMutation = useMutation({
        mutationFn: ({ lessonId }) => markLessonComplete(userEmail, courseId, lessonId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['lessonProgress', userEmail, courseId] });
            toast.success(lang === 'bn' ? 'লেসন সম্পন্ন! পরবর্তী লেসন আনলক হয়েছে 🎉' : 'Lesson complete! Next lesson unlocked 🎉');
        },
    });

    // ── Helpers ──
    const isWatched = (lessonId) => progress.some(p => p.lessonId === lessonId && p.watched);
    const isCompleted = (lessonId) => progress.some(p => p.lessonId === lessonId && p.completed);
    const completedCount = progress.filter(p => p.completed).length;

    const sortedLessons = [...lessons].sort((a, b) =>
        a.weekIndex !== b.weekIndex ? a.weekIndex - b.weekIndex : (a.order || 0) - (b.order || 0)
    );

    const isUnlocked = (lesson) => {
        const idx = sortedLessons.findIndex(l => l._id === lesson._id);
        if (idx === 0) return true;
        return isCompleted(sortedLessons[idx - 1]._id);
    };

    const handleLessonClick = (lesson) => {
        if (!isUnlocked(lesson)) {
            toast.error(lang === 'bn' ? 'আগের লেসন সম্পন্ন করুন' : 'Complete the previous lesson first');
            return;
        }
        setActiveLesson(lesson);
        setShowQuiz(false);
    };

    const handleWatched = (lessonId) => {
        if (!isWatched(lessonId)) watchMutation.mutate({ lessonId });
    };

    const handleComplete = (lessonId) => {
        if (!isCompleted(lessonId)) completeMutation.mutate({ lessonId });
    };

    const currentLesson = activeLesson || sortedLessons[0];

    const byWeek = sortedLessons.reduce((acc, l) => {
        const w = l.weekIndex || 1;
        if (!acc[w]) acc[w] = [];
        acc[w].push(l);
        return acc;
    }, {});

    if (!courseId) return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center p-6">
            <div className="text-center max-w-sm">
                <p className="text-6xl mb-4">📚</p>
                <h2 className="text-2xl font-bold text-neutral mb-2">{lang === 'bn' ? 'কোনো ক্লাস সেট করা নেই' : 'No Class Set'}</h2>
                <p className="text-neutral/50 text-sm mb-6">{lang === 'bn' ? 'অভিভাবক ড্যাশবোর্ড থেকে একটি কোর্স সক্রিয় করুন।' : 'Ask your guardian to activate a course from the dashboard.'}</p>
                <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                    <FaBook /> {lang === 'bn' ? 'কোর্স দেখুন' : 'Browse Courses'}
                </Link>
            </div>
        </div>
    );

    if (isLoading) return <div className="min-h-screen flex items-center justify-center"><TbFidgetSpinner className="animate-spin text-primary text-4xl" /></div>;

    return (
        <div className="min-h-screen bg-base-200">
            {/* Header */}
            <div className="bg-base-100 border-b border-base-300 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">{course?.emoji}</span>
                        <div>
                            <h1 className="font-bold text-neutral text-lg">{lang === 'bn' ? (course?.titleBn || course?.title) : course?.title}</h1>
                            <p className="text-neutral/50 text-xs">{completedCount}/{sortedLessons.length} {lang === 'bn' ? 'লেসন সম্পন্ন' : 'lessons completed'}</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 flex-1 max-w-xs">
                        <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full transition-all duration-500"
                                style={{ width: `${sortedLessons.length ? (completedCount / sortedLessons.length) * 100 : 0}%` }} />
                        </div>
                        <span className="text-xs font-bold text-success shrink-0">
                            {sortedLessons.length ? Math.round((completedCount / sortedLessons.length) * 100) : 0}%
                        </span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main */}
                <div className="lg:col-span-2 flex flex-col gap-5">
                    {currentLesson ? (
                        <>
                            <VideoPlayer
                                url={currentLesson.videoUrl}
                                type={currentLesson.videoType}
                                onWatched={() => handleWatched(currentLesson._id)}
                            />

                            <div className="bg-base-100 rounded-3xl border border-base-300 p-5">
                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <div>
                                        <h2 className="font-bold text-neutral text-xl">{lang === 'bn' ? (currentLesson.titleBn || currentLesson.title) : currentLesson.title}</h2>
                                        <p className="text-neutral/40 text-xs mt-1">Week {currentLesson.weekIndex} · {currentLesson.duration || '—'}</p>
                                    </div>
                                    {isCompleted(currentLesson._id) && (
                                        <span className="flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-3 py-1.5 rounded-full">
                                            <FaCheckCircle /> {lang === 'bn' ? 'সম্পন্ন' : 'Completed'}
                                        </span>
                                    )}
                                </div>
                                {currentLesson.content && <p className="text-neutral/70 text-sm mt-3 leading-relaxed">{currentLesson.content}</p>}
                            </div>

                            {/* Video watched — show quiz */}
                            {isWatched(currentLesson._id) && !isCompleted(currentLesson._id) && (
                                <QuizSection
                                    lessonId={currentLesson._id}
                                    courseId={courseId}
                                    lang={lang}
                                    userEmail={userEmail}
                                    quizResults={quizResults}
                                    hasQuizCheck={true}
                                    onQuizPass={() => handleComplete(currentLesson._id)}
                                    onNoQuiz={() => handleComplete(currentLesson._id)}
                                />
                            )}

                            {/* Completed — retake quiz */}
                            {isCompleted(currentLesson._id) && (
                                <>
                                    <button onClick={() => setShowQuiz(p => !p)}
                                        className="flex items-center justify-between w-full px-5 py-3.5 rounded-2xl bg-success/10 text-success font-bold hover:bg-success/20 transition-all">
                                        <span className="flex items-center gap-2"><FaQuestionCircle /> {lang === 'bn' ? 'কুইজ পুনরায় দিন' : 'Retake Quiz'}</span>
                                        {showQuiz ? <FaChevronUp /> : <FaChevronDown />}
                                    </button>
                                    <AnimatePresence>
                                        {showQuiz && (
                                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                                                <QuizSection lessonId={currentLesson._id} courseId={courseId} lang={lang} userEmail={userEmail} quizResults={quizResults} />
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </>
                            )}

                            {/* Not watched yet */}
                            {!isWatched(currentLesson._id) && !isCompleted(currentLesson._id) && (
                                <div className="bg-warning/10 border border-warning/30 rounded-2xl px-5 py-3 text-warning text-sm font-semibold flex items-center gap-2">
                                    <FaPlay className="text-xs" />
                                    {lang === 'bn' ? 'আগে ভিডিও দেখুন বা "Mark as Watched" করুন।' : 'Watch the video or click "Mark as Watched" first.'}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-base-100 rounded-3xl border border-base-300 p-16 text-center">
                            <p className="text-5xl mb-4">🎬</p>
                            <p className="text-neutral/50">{lang === 'bn' ? 'এখনো কোনো লেসন নেই' : 'No lessons yet'}</p>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-neutral">{lang === 'bn' ? 'লেসনসমূহ' : 'Lessons'}</h3>
                    {Object.entries(byWeek).sort(([a], [b]) => Number(a) - Number(b)).map(([week, wLessons]) => (
                        <div key={week} className="flex flex-col gap-2">
                            <p className="text-xs font-bold text-neutral/40 uppercase tracking-widest">Week {week}</p>
                            {wLessons.map(lesson => {
                                const isActive = currentLesson?._id === lesson._id;
                                const done = isCompleted(lesson._id);
                                const watched = isWatched(lesson._id);
                                const unlocked = isUnlocked(lesson);
                                return (
                                    <button key={lesson._id}
                                        onClick={() => handleLessonClick(lesson)}
                                        className={`flex items-center gap-3 p-3 rounded-2xl text-left transition-all ${isActive ? 'bg-primary text-white shadow-sm' : unlocked ? 'bg-base-100 border border-base-300 hover:border-primary/40' : 'bg-base-200 border border-base-300 opacity-60 cursor-not-allowed'}`}>
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs ${isActive ? 'bg-white/20' : done ? 'bg-success/20' : unlocked ? 'bg-primary/10 text-primary' : 'bg-base-300 text-neutral/30'}`}>
                                            {done ? <FaCheckCircle className={isActive ? 'text-white' : 'text-success'} />
                                                : unlocked ? <FaPlay className={`text-xs ${isActive ? 'text-white' : ''}`} />
                                                    : <FaLock className="text-xs" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-neutral'}`}>
                                                {lang === 'bn' ? (lesson.titleBn || lesson.title) : lesson.title}
                                            </p>
                                            <p className={`text-xs ${isActive ? 'text-white/70' : 'text-neutral/40'}`}>
                                                {done ? (lang === 'bn' ? '✅ সম্পন্ন' : '✅ Done')
                                                    : watched ? (lang === 'bn' ? '📝 কুইজ বাকি' : '📝 Quiz pending')
                                                        : unlocked ? (lesson.duration || '—')
                                                            : (lang === 'bn' ? '🔒 লক' : '🔒 Locked')}
                                            </p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MyClass;
