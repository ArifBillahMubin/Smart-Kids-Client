import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaTrash, FaSearch } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { toast } from 'react-hot-toast';
import { useApp } from '../../../../context/AppContext';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const ManageReviews = () => {
    const { lang } = useApp();
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');

    const { data: reviews = [], isLoading } = useQuery({
        queryKey: ['adminReviews'],
        queryFn: () => axiosSecure.get('/admin/reviews').then(r => r.data),
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => axiosSecure.delete(`/admin/reviews/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminReviews'] });
            Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
        },
        onError: () => toast.error('Failed to delete review'),
    });

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Review?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            confirmButtonText: 'Delete',
        });
        if (result.isConfirmed) deleteMutation.mutate(id);
    };

    const filtered = reviews.filter(r =>
        !search ||
        r.userName?.toLowerCase().includes(search.toLowerCase()) ||
        r.courseTitle?.toLowerCase().includes(search.toLowerCase()) ||
        r.comment?.toLowerCase().includes(search.toLowerCase())
    );

    const avgRating = reviews.length
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'রিভিউ ব্যবস্থাপনা' : 'Manage Reviews'}</h2>
                    <p className="text-neutral/50 text-sm mt-0.5">
                        {reviews.length} {lang === 'bn' ? 'টি রিভিউ' : 'reviews'} · {lang === 'bn' ? 'গড় রেটিং:' : 'Avg rating:'} {avgRating} <FaStar className="inline text-warning text-xs" />
                    </p>
                </div>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={lang === 'bn' ? 'রিভিউ খুঁজুন...' : 'Search reviews...'}
                        className="pl-9 pr-4 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary w-52" />
                </div>
            </div>

            {/* Rating distribution */}
            {reviews.length > 0 && (
                <div className="bg-base-100 rounded-3xl p-5 border border-base-300">
                    <div className="flex items-center gap-6 flex-wrap">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-warning">{avgRating}</p>
                            <div className="flex gap-0.5 justify-center mt-1">
                                {[1,2,3,4,5].map(s => <FaStar key={s} className={`text-xs ${s <= Math.round(avgRating) ? 'text-warning' : 'text-base-300'}`} />)}
                            </div>
                            <p className="text-xs text-neutral/40 mt-1">{reviews.length} reviews</p>
                        </div>
                        <div className="flex-1 flex flex-col gap-1.5 min-w-[200px]">
                            {[5,4,3,2,1].map(star => {
                                const count = reviews.filter(r => r.rating === star).length;
                                const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="text-neutral/50 w-4">{star}</span>
                                        <FaStar className="text-warning text-xs shrink-0" />
                                        <div className="flex-1 h-2 bg-base-300 rounded-full overflow-hidden">
                                            <div className="h-full bg-warning rounded-full" style={{ width: `${pct}%` }} />
                                        </div>
                                        <span className="text-neutral/40 w-6 text-right">{count}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews grid */}
            {filtered.length === 0 ? (
                <div className="bg-base-100 rounded-3xl border border-base-300 p-16 text-center">
                    <FaStar className="text-warning/30 text-5xl mx-auto mb-4" />
                    <p className="text-neutral/50">{lang === 'bn' ? 'কোনো রিভিউ পাওয়া যায়নি' : 'No reviews found'}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((r, i) => (
                        <motion.div key={r._id || i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                            className="bg-base-100 rounded-3xl border border-base-300 p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
                            {/* Header */}
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                                        {r.userName?.[0] || '?'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-neutral text-sm">{r.userName || '—'}</p>
                                        <p className="text-neutral/40 text-xs">{r.userEmail}</p>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(r._id)}
                                    className="w-7 h-7 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center text-xs shrink-0">
                                    <FaTrash />
                                </button>
                            </div>

                            {/* Course */}
                            <p className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit">{r.courseTitle}</p>

                            {/* Stars */}
                            <div className="flex gap-0.5">
                                {[1,2,3,4,5].map(s => (
                                    <FaStar key={s} className={`text-sm ${s <= r.rating ? 'text-warning' : 'text-base-300'}`} />
                                ))}
                            </div>

                            {/* Comment */}
                            <p className="text-neutral/70 text-sm leading-relaxed flex-1">{r.comment}</p>

                            {/* Date */}
                            <p className="text-neutral/30 text-xs">
                                {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString() : '—'}
                            </p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageReviews;
