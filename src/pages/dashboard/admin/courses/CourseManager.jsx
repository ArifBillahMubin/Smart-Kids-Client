import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaPlay, FaQuestionCircle, FaArrowLeft, FaYoutube, FaSpinner, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';
import LessonModal from '../../../../components/modals/LessonModal';
import QuizModal from '../../../../components/modals/QuizModal';

// ── Lesson Card ──
const LessonCard = ({ lesson, courseId, onEdit, onAddQuiz, axiosSecure }) => {
    const queryClient = useQueryClient();
    const [showQuiz, setShowQuiz] = useState(false);

    const { data: quiz } = useQuery({
        queryKey: ['quiz', lesson._id],
        queryFn: () => axiosSecure.get(`/quizzes/${lesson._id}`).then(r => r.data),
    });

    const deleteLessonMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/lessons/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lessons', courseId] }); Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false }); }
    });

    const deleteQuizMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/quizzes/${id}`),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['quiz', lesson._id] }); toast.success('Quiz deleted!'); }
    });

    const handleDeleteLesson = async () => {
        const r = await Swal.fire({ title: 'Delete Lesson?', text: 'Quiz will also be deleted.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete' });
        if (r.isConfirmed) deleteLessonMutation.mutate(lesson._id);
    };

    const handleDeleteQuiz = async () => {
        const r = await Swal.fire({ title: 'Delete Quiz?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444', confirmButtonText: 'Delete' });
        if (r.isConfirmed) deleteQuizMutation.mutate(quiz._id);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="bg-base-100 rounded-2xl border border-base-300 overflow-hidden">
            {/* Lesson header */}
            <div className="flex items-center gap-4 p-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <FaPlay className="text-sm" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral text-sm truncate">{lesson.title}</p>
                    <p className="text-neutral/40 text-xs">{lesson.titleBn} · Week {lesson.weekIndex} · {lesson.duration || '—'}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {lesson.videoUrl && (
                        <a href={lesson.videoUrl} target="_blank" rel="noreferrer"
                            className="w-8 h-8 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center hover:bg-secondary hover:text-white transition-all text-xs">
                            <FaYoutube />
                        </a>
                    )}
                    <button onClick={() => onAddQuiz(lesson)} className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs transition-all ${quiz ? 'bg-success/10 text-success hover:bg-success hover:text-white' : 'bg-accent/10 text-accent hover:bg-accent hover:text-white'}`}>
                        <FaQuestionCircle />
                    </button>
                    <button onClick={() => onEdit(lesson)} className="w-8 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs">
                        <FaEdit />
                    </button>
                    <button onClick={handleDeleteLesson} className="w-8 h-8 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center text-xs">
                        <FaTrash />
                    </button>
                    <button onClick={() => setShowQuiz(p => !p)} className="w-8 h-8 rounded-xl bg-base-200 text-neutral/60 flex items-center justify-center text-xs">
                        {showQuiz ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                </div>
            </div>

            {/* Quiz preview */}
            <AnimatePresence>
                {showQuiz && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-base-300 bg-base-200 px-4 py-3">
                        {quiz ? (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold text-neutral">{quiz.title}</p>
                                    <p className="text-xs text-neutral/50">{quiz.questions?.length} questions</p>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => onAddQuiz(lesson)} className="text-xs px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-bold hover:bg-primary hover:text-white transition-all">Edit Quiz</button>
                                    <button onClick={handleDeleteQuiz} className="text-xs px-3 py-1.5 rounded-xl bg-error/10 text-error font-bold hover:bg-error hover:text-white transition-all">Delete</button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-neutral/40">No quiz yet</p>
                                <button onClick={() => onAddQuiz(lesson)} className="text-xs px-3 py-1.5 rounded-xl bg-accent/10 text-accent font-bold hover:bg-accent hover:text-white transition-all flex items-center gap-1">
                                    <FaPlus /> Add Quiz
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ── Main Page ──
const CourseManager = () => {
    const { id: courseId } = useParams();
    const axiosSecure = useAxiosSecure();
    const [lessonModal, setLessonModal] = useState(false);
    const [quizModal, setQuizModal] = useState(false);
    const [editingLesson, setEditingLesson] = useState(null);
    const [quizLesson, setQuizLesson] = useState(null);

    const { data: course } = useQuery({
        queryKey: ['course', courseId],
        queryFn: () => axiosSecure.get(`/course/${courseId}`).then(r => r.data),
    });

    const { data: lessons = [], isLoading } = useQuery({
        queryKey: ['lessons', courseId],
        queryFn: () => axiosSecure.get(`/lessons/${courseId}`).then(r => r.data),
    });

    // Group lessons by week
    const byWeek = lessons.reduce((acc, l) => {
        const w = l.weekIndex || 1;
        if (!acc[w]) acc[w] = [];
        acc[w].push(l);
        return acc;
    }, {});

    const weekOptions = course?.curriculum?.map((_, i) => i + 1) || [1, 2, 3, 4];

    const openAddLesson = () => { setEditingLesson(null); setLessonModal(true); };
    const openEditLesson = (lesson) => { setEditingLesson(lesson); setLessonModal(true); };
    const openQuizModal = (lesson) => { setQuizLesson(lesson); setQuizModal(true); };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex items-center gap-4 flex-wrap">
                <Link to="/admin/courses" className="flex items-center gap-2 text-neutral/60 hover:text-primary text-sm font-semibold transition-colors">
                    <FaArrowLeft /> Back
                </Link>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-neutral">
                        {course?.emoji} {course?.title || 'Course Manager'}
                    </h2>
                    <p className="text-neutral/50 text-sm">{lessons.length} lessons · {Object.keys(byWeek).length} weeks</p>
                </div>
                <button onClick={openAddLesson}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
                    <FaPlus /> Add Lesson
                </button>
            </div>

            {isLoading && (
                <div className="flex justify-center py-16">
                    <FaSpinner className="animate-spin text-primary text-3xl" />
                </div>
            )}

            {!isLoading && lessons.length === 0 && (
                <div className="bg-base-100 rounded-3xl border border-base-300 p-16 text-center">
                    <p className="text-5xl mb-4">🎬</p>
                    <h3 className="font-bold text-neutral text-lg mb-2">No lessons yet</h3>
                    <p className="text-neutral/50 text-sm mb-6">Add your first lesson to get started</p>
                    <button onClick={openAddLesson} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all">
                        <FaPlus /> Add First Lesson
                    </button>
                </div>
            )}

            {/* Lessons grouped by week */}
            {Object.entries(byWeek).sort(([a], [b]) => Number(a) - Number(b)).map(([week, wLessons]) => (
                <div key={week} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-neutral/50 uppercase tracking-widest">Week {week}</span>
                        <div className="flex-1 h-px bg-base-300" />
                        <span className="text-xs text-neutral/40">{wLessons.length} lessons</span>
                    </div>
                    {wLessons.sort((a, b) => (a.order || 0) - (b.order || 0)).map(lesson => (
                        <LessonCard key={lesson._id} lesson={lesson} courseId={courseId}
                            onEdit={openEditLesson} onAddQuiz={openQuizModal} axiosSecure={axiosSecure} />
                    ))}
                </div>
            ))}

            {/* Modals */}
            <LessonModal isOpen={lessonModal} onClose={() => setLessonModal(false)}
                courseId={courseId} lesson={editingLesson} weekOptions={weekOptions} />

            {quizLesson && (
                <QuizModal isOpen={quizModal} onClose={() => { setQuizModal(false); setQuizLesson(null); }}
                    courseId={courseId} lessonId={quizLesson._id}
                    quiz={null} />
            )}
        </div>
    );
};

export default CourseManager;
