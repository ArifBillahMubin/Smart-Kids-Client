import { useState, Fragment } from 'react';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { useForm, useWatch } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaTimes, FaYoutube, FaCloudUploadAlt, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { uploadVideoToCloudinary } from '../../utils';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const LessonModal = ({ isOpen, onClose, courseId, lesson, weekOptions }) => {
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const isEdit = !!lesson;
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState(lesson?.videoUrl || '');

    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        defaultValues: lesson ? {
            title: lesson.title, titleBn: lesson.titleBn,
            weekIndex: lesson.weekIndex, order: lesson.order,
            videoType: lesson.videoType || 'youtube',
            videoUrl: lesson.videoUrl || '',
            content: lesson.content || '', duration: lesson.duration || '',
        } : { videoType: 'youtube', weekIndex: 1, order: 1 }
    });

    const videoType = useWatch({ control, name: 'videoType' });

    const addMutation = useMutation({
        mutationFn: (data) => axiosSecure.post('/lessons', data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lessons', courseId] }); toast.success('Lesson added!'); onClose(); }
    });
    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => axiosSecure.put(`/lessons/${id}`, data),
        onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['lessons', courseId] }); toast.success('Lesson updated!'); onClose(); }
    });

    const handleVideoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('video/')) {
            toast.error('Please select a video file');
            return;
        }

        // Validate size (max 500MB)
        if (file.size > 500 * 1024 * 1024) {
            toast.error('File too large. Max 500MB');
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setUploadedUrl('');

        try {
            const url = await uploadVideoToCloudinary(file, (progress) => {
                setUploadProgress(progress);
            });
            setUploadedUrl(url);
            setValue('videoUrl', url); // set in form
            toast.success('Video uploaded!');
        } catch (err) {
            toast.error(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const onSubmit = (data) => {
        const payload = {
            ...data,
            courseId,
            weekIndex: Number(data.weekIndex),
            order: Number(data.order),
            videoUrl: uploadedUrl || data.videoUrl,
        };
        if (isEdit) updateMutation.mutate({ id: lesson._id, data: payload });
        else addMutation.mutate(payload);
    };

    const isSaving = addMutation.isPending || updateMutation.isPending;

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/50" />
                </TransitionChild>
                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <TransitionChild as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        <DialogPanel className="bg-base-100 rounded-3xl w-full max-w-lg border border-base-300 shadow-2xl">
                            <div className="flex items-center justify-between p-6 border-b border-base-300">
                                <DialogTitle className="text-lg font-bold text-neutral">{isEdit ? 'Edit Lesson' : 'Add Lesson'}</DialogTitle>
                                <button onClick={onClose} className="w-8 h-8 rounded-xl border border-base-300 flex items-center justify-center hover:bg-base-200"><FaTimes className="text-sm" /></button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto">

                                {/* Title */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase">Title (EN)</label>
                                        <input placeholder="Lesson title" className={`px-3 py-2.5 rounded-xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary ${errors.title ? 'border-error' : 'border-base-300'}`}
                                            {...register('title', { required: 'Required' })} />
                                        {errors.title && <p className="text-error text-xs">{errors.title.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase">Title (BN)</label>
                                        <input placeholder="লেসনের শিরোনাম" className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('titleBn')} />
                                    </div>
                                </div>

                                {/* Week, Order, Duration */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase">Week</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('weekIndex')}>
                                            {weekOptions.map(w => <option key={w} value={w}>Week {w}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase">Order</label>
                                        <input type="number" min="1" placeholder="1" className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('order')} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase">Duration</label>
                                        <input placeholder="10 min" className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('duration')} />
                                    </div>
                                </div>

                                {/* Video Source Toggle */}
                                <div className="flex flex-col gap-3">
                                    <label className="text-xs font-bold text-neutral/60 uppercase">Video Source</label>
                                    <div className="flex gap-3">
                                        {[['youtube', 'YouTube URL', <FaYoutube className="text-red-500" />], ['cloudinary', 'Upload Video', <FaCloudUploadAlt className="text-blue-500" />]].map(([val, label, icon]) => (
                                            <label key={val} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${videoType === val ? 'border-primary bg-primary/10 text-primary font-bold' : 'border-base-300 text-neutral/60 hover:border-primary/40'}`}>
                                                <input type="radio" value={val} {...register('videoType')} className="hidden" />
                                                {icon} <span className="text-sm">{label}</span>
                                            </label>
                                        ))}
                                    </div>

                                    {/* YouTube URL input */}
                                    {videoType === 'youtube' && (
                                        <div className="flex flex-col gap-1">
                                            <input placeholder="https://youtube.com/watch?v=..." className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                                {...register('videoUrl')} />
                                            <p className="text-xs text-neutral/40">Paste YouTube video URL</p>
                                        </div>
                                    )}

                                    {/* Cloudinary upload */}
                                    {videoType === 'cloudinary' && (
                                        <div className="flex flex-col gap-3">
                                            <label className={`flex flex-col items-center justify-center h-28 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${uploading ? 'border-primary/50 bg-primary/5' : uploadedUrl ? 'border-success bg-success/5' : 'border-base-300 hover:border-primary/50 hover:bg-primary/5'}`}>
                                                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} disabled={uploading} />
                                                {uploading ? (
                                                    <div className="flex flex-col items-center gap-2 w-full px-6">
                                                        <FaSpinner className="animate-spin text-primary text-2xl" />
                                                        <div className="w-full bg-base-300 rounded-full h-2">
                                                            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                                                        </div>
                                                        <p className="text-xs text-primary font-bold">{uploadProgress}% uploaded</p>
                                                    </div>
                                                ) : uploadedUrl ? (
                                                    <div className="flex flex-col items-center gap-1">
                                                        <FaCheckCircle className="text-success text-2xl" />
                                                        <p className="text-xs text-success font-bold">Video uploaded!</p>
                                                        <p className="text-xs text-neutral/40">Click to replace</p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-1 text-neutral/40">
                                                        <FaCloudUploadAlt className="text-3xl" />
                                                        <p className="text-sm font-semibold">Click to upload video</p>
                                                        <p className="text-xs">MP4, MOV, AVI · Max 500MB</p>
                                                    </div>
                                                )}
                                            </label>

                                            {/* Uploaded URL preview */}
                                            {uploadedUrl && (
                                                <div className="flex items-center gap-2 bg-success/10 rounded-xl px-3 py-2">
                                                    <FaCheckCircle className="text-success shrink-0 text-xs" />
                                                    <p className="text-xs text-neutral/60 truncate flex-1">{uploadedUrl}</p>
                                                    <button type="button" onClick={() => { setUploadedUrl(''); setValue('videoUrl', ''); }}
                                                        className="text-error hover:text-error/70 shrink-0">
                                                        <FaTimesCircle className="text-xs" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-neutral/60 uppercase">Content / Notes</label>
                                    <textarea rows={3} placeholder="Lesson notes or description..."
                                        className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none"
                                        {...register('content')} />
                                </div>

                                {/* Submit */}
                                <div className="flex gap-3 pt-2 border-t border-base-300">
                                    <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl border-2 border-base-300 text-neutral font-bold hover:bg-base-200 transition-all">Cancel</button>
                                    <button type="submit" disabled={isSaving || uploading}
                                        className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                                        {(isSaving || uploading) && <FaSpinner className="animate-spin" />}
                                        {isEdit ? 'Update' : 'Add Lesson'}
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

export default LessonModal;
