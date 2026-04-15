import { useState, Fragment } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaPlus, FaTrash, FaTimes, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const QuizModal = ({ isOpen, onClose, courseId, lessonId, quiz }) => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const isEdit = !!quiz;

    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: quiz ? {
            title: quiz.title,
            questions: quiz.questions || [{ question: '', options: ['', '', '', ''], correct: 0 }]
        } : {
            title: '',
            questions: [{ question: '', options: ['', '', '', ''], correct: 0 }]
        }
    });

    const { fields, append, remove } = useFieldArray({ control, name: 'questions' });

    const addMutation = useMutation({
        mutationFn: (data) => axiosSecure.post('/quizzes', data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['quiz', lessonId] }); toast.success('Quiz added!'); onClose(); }
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => axiosSecure.put(`/quizzes/${id}`, data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['quiz', lessonId] }); toast.success('Quiz updated!'); onClose(); }
    });

    const onSubmit = (data) => {
        const payload = { ...data, courseId, lessonId, questions: data.questions.map(q => ({ ...q, correct: Number(q.correct) })) };
        if (isEdit) updateMutation.mutate({ id: quiz._id, data: payload });
        else addMutation.mutate(payload);
    };

    const isSaving = addMutation.isPending || updateMutation.isPending;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto flex items-start justify-center p-4">
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <DialogPanel className="bg-base-100 rounded-3xl w-full max-w-2xl border border-base-300 shadow-2xl my-8">
                            <div className="flex items-center justify-between p-6 border-b border-base-300">
                                <DialogTitle className="text-lg font-bold text-neutral">{isEdit ? 'Edit Quiz' : 'Add Quiz'}</DialogTitle>
                                <button onClick={onClose} className="w-8 h-8 rounded-xl border border-base-300 flex items-center justify-center hover:bg-base-200"><FaTimes className="text-sm" /></button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-5 max-h-[75vh] overflow-y-auto">
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-neutral/60 uppercase">Quiz Title</label>
                                    <input placeholder="e.g. Week 1 Quiz" className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                        {...register('title', { required: 'Required' })} />
                                </div>

                                {/* Questions */}
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold text-neutral">Questions ({fields.length})</label>
                                        <button type="button" onClick={() => append({ question: '', options: ['', '', '', ''], correct: 0 })}
                                            className="flex items-center gap-1 text-xs text-primary font-bold hover:underline">
                                            <FaPlus /> Add Question
                                        </button>
                                    </div>

                                    {fields.map((field, qi) => (
                                        <div key={field.id} className="bg-base-200 rounded-2xl p-4 flex flex-col gap-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs font-bold text-neutral/60">Q{qi + 1}</span>
                                                {fields.length > 1 && (
                                                    <button type="button" onClick={() => remove(qi)} className="text-error text-xs hover:underline flex items-center gap-1">
                                                        <FaTrash /> Remove
                                                    </button>
                                                )}
                                            </div>
                                            <input placeholder="Question text" className="px-3 py-2 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                                {...register(`questions.${qi}.question`, { required: 'Required' })} />

                                            <div className="grid grid-cols-2 gap-2">
                                                {[0, 1, 2, 3].map(oi => (
                                                    <div key={oi} className="flex items-center gap-2">
                                                        <input type="radio" value={oi} {...register(`questions.${qi}.correct`)} className="radio radio-success radio-sm shrink-0" />
                                                        <input placeholder={`Option ${oi + 1}`} className="flex-1 px-2 py-1.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-xs outline-none focus:border-primary"
                                                            {...register(`questions.${qi}.options.${oi}`, { required: 'Required' })} />
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-xs text-neutral/40">🟢 Select the correct answer</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-2 border-t border-base-300">
                                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-base-300 text-neutral font-bold hover:bg-base-200 transition-all">Cancel</button>
                                    <button type="submit" disabled={isSaving} className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isSaving && <FaSpinner className="animate-spin" />}
                                        {isEdit ? 'Update Quiz' : 'Save Quiz'}
                                    </button>
                                </div>
                            </form>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default QuizModal;
