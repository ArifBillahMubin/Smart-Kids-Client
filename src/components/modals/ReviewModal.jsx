import { Fragment, useState } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaStar, FaTimes } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ReviewModal = ({ isOpen, onClose, course, userEmail, userName }) => {
    const { lang } = useApp();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [rating, setRating] = useState(5);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState('');

    const mutation = useMutation({
        mutationFn: (reviewData) => axiosSecure.post('/reviews', reviewData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reviews', course?._id] });
            toast.success(lang === 'bn' ? 'রিভিউ সংরক্ষিত হয়েছে! ধন্যবাদ 🎉' : 'Review saved! Thank you 🎉');
            onClose();
        },
        onError: () => toast.error(lang === 'bn' ? 'রিভিউ সংরক্ষণ ব্যর্থ' : 'Failed to save review'),
    });

    const handleSubmit = () => {
        if (!comment.trim()) {
            toast.error(lang === 'bn' ? 'মন্তব্য লিখুন' : 'Please write a comment');
            return;
        }
        mutation.mutate({
            courseId: course?._id,
            courseTitle: course?.title,
            userEmail,
            userName,
            rating,
            comment: comment.trim(),
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                </TransitionChild>
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <TransitionChild as={Fragment} enter="ease-out duration-250" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <DialogPanel className="bg-base-100 rounded-3xl w-full max-w-md border border-base-300 shadow-2xl overflow-hidden">

                            {/* Header */}
                            <div className={`bg-gradient-to-br ${course?.color || 'from-primary to-primary/60'} p-6 relative`}>
                                <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
                                    <FaTimes className="text-sm" />
                                </button>
                                <div className="text-center">
                                    <p className="text-5xl mb-2">🎉</p>
                                    <DialogTitle className="text-white font-bold text-xl">
                                        {lang === 'bn' ? 'কোর্স সম্পন্ন!' : 'Course Complete!'}
                                    </DialogTitle>
                                    <p className="text-white/80 text-sm mt-1">
                                        {lang === 'bn' ? (course?.titleBn || course?.title) : course?.title}
                                    </p>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col gap-5">
                                <p className="text-neutral/60 text-sm text-center">
                                    {lang === 'bn' ? 'এই কোর্স সম্পর্কে আপনার মতামত দিন' : 'Share your feedback about this course'}
                                </p>

                                {/* Star rating */}
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <motion.button key={star} type="button"
                                            whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHovered(star)}
                                            onMouseLeave={() => setHovered(0)}
                                            className="text-3xl transition-all">
                                            <FaStar className={`${(hovered || rating) >= star ? 'text-warning' : 'text-base-300'} transition-colors`} />
                                        </motion.button>
                                    ))}
                                </div>
                                <p className="text-center text-sm font-semibold text-neutral/60">
                                    {['', '😞 Poor', '😐 Fair', '🙂 Good', '😊 Great', '🤩 Excellent!'][hovered || rating]}
                                </p>

                                {/* Comment */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-neutral/70">
                                        {lang === 'bn' ? 'আপনার মন্তব্য' : 'Your Comment'}
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={comment}
                                        onChange={e => setComment(e.target.value)}
                                        placeholder={lang === 'bn' ? 'এই কোর্স সম্পর্কে আপনার অভিজ্ঞতা লিখুন...' : 'Write about your experience with this course...'}
                                        className="w-full px-4 py-3 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none transition-all"
                                    />
                                </div>

                                <div className="flex gap-3">
                                    <button onClick={onClose}
                                        className="flex-1 py-3 rounded-2xl border-2 border-base-300 text-neutral font-semibold hover:bg-base-200 transition-all text-sm">
                                        {lang === 'bn' ? 'পরে দেব' : 'Skip'}
                                    </button>
                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                                        onClick={handleSubmit} disabled={mutation.isPending}
                                        className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                        {mutation.isPending && <TbFidgetSpinner className="animate-spin" />}
                                        {lang === 'bn' ? 'রিভিউ দিন' : 'Submit Review'}
                                    </motion.button>
                                </div>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};

export default ReviewModal;
