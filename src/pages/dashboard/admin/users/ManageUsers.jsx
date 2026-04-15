import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaTrash, FaShieldAlt, FaUser } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useApp } from '../../../../context/AppContext';
import useAxiosSecure from '../../../../hooks/useAxiosSecure';

const ManageUsers = () => {
    const { lang } = useApp();
    const queryClient = useQueryClient();
    const axiosSecure = useAxiosSecure();
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const { data: users = [], isLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => axiosSecure.get('/admin/users').then(r => r.data),
    });

    const roleMutation = useMutation({
        mutationFn: ({ email, role }) => axiosSecure.patch(`/admin/users/${email}/role`, { role }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            toast.success('Role updated!');
        },
        onError: () => toast.error('Failed to update role'),
    });

    const deleteMutation = useMutation({
        mutationFn: (email) => axiosSecure.delete(`/admin/users/${email}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
            Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
        },
        onError: () => toast.error('Failed to delete user'),
    });

    const handleDelete = async (email, name) => {
        const result = await Swal.fire({
            title: `Delete ${name}?`,
            text: 'All their data will be deleted.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete!',
        });
        if (result.isConfirmed) deleteMutation.mutate(email);
    };

    const handleRoleToggle = async (user) => {
        const newRole = user.role === 'admin' ? 'guardian' : 'admin';
        const result = await Swal.fire({
            title: `Make ${user.name} ${newRole}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4F9CF9',
            confirmButtonText: 'Yes',
        });
        if (result.isConfirmed) roleMutation.mutate({ email: user.email, role: newRole });
    };

    const filtered = users.filter(u => {
        const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === 'all' || u.role === roleFilter;
        return matchSearch && matchRole;
    });

    if (isLoading) return (
        <div className="flex justify-center py-20">
            <TbFidgetSpinner className="animate-spin text-primary text-3xl" />
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'ব্যবহারকারী ব্যবস্থাপনা' : 'Manage Users'}</h2>
                    <p className="text-neutral/50 text-sm mt-0.5">{users.length} {lang === 'bn' ? 'জন ব্যবহারকারী' : 'total users'}</p>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                    {/* Role filter */}
                    <div className="flex bg-base-200 rounded-2xl p-1 gap-1">
                        {['all', 'guardian', 'admin'].map(r => (
                            <button key={r} onClick={() => setRoleFilter(r)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${roleFilter === r ? 'bg-primary text-white' : 'text-neutral/60 hover:text-neutral'}`}>
                                {r === 'all' ? (lang === 'bn' ? 'সব' : 'All') : r}
                            </button>
                        ))}
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search users...'}
                            className="pl-9 pr-4 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary w-48" />
                    </div>
                </div>
            </div>

            <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-base-200 text-neutral/50 text-xs font-bold uppercase">
                                <th className="px-5 py-4 text-left">{lang === 'bn' ? 'ব্যবহারকারী' : 'User'}</th>
                                <th className="px-5 py-4 text-left hidden sm:table-cell">{lang === 'bn' ? 'সন্তান' : 'Child'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'ভূমিকা' : 'Role'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, i) => (
                                <motion.tr key={u._id || i}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                                    className="border-t border-base-300 hover:bg-base-200/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={u.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'U')}&background=4F9CF9&color=fff`}
                                                className="w-10 h-10 rounded-full object-cover shrink-0" alt="" />
                                            <div>
                                                <p className="font-semibold text-neutral text-sm">{u.name || '—'}</p>
                                                <p className="text-neutral/40 text-xs">{u.email}</p>
                                                {u.phone && <p className="text-neutral/30 text-xs">{u.phone}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <div className="flex items-center gap-2">
                                            {u.childImageURL && (
                                                <img src={u.childImageURL} className="w-8 h-8 rounded-full object-cover" alt="" />
                                            )}
                                            <div>
                                                <p className="text-sm text-neutral/70">{u.childName || '—'}</p>
                                                <p className="text-xs text-neutral/40">{u.childClass || '—'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button onClick={() => handleRoleToggle(u)}
                                            disabled={roleMutation.isPending}
                                            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all hover:scale-105 ${u.role === 'admin' ? 'bg-error/15 text-error hover:bg-error hover:text-white' : 'bg-primary/15 text-primary hover:bg-primary hover:text-white'}`}>
                                            {u.role === 'admin' ? <><FaShieldAlt className="inline mr-1" />Admin</> : <><FaUser className="inline mr-1" />Guardian</>}
                                        </button>
                                    </td>
                                    <td className="px-5 py-4 text-center">
                                        <button onClick={() => handleDelete(u.email, u.name)}
                                            disabled={deleteMutation.isPending}
                                            className="w-8 h-8 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center text-xs mx-auto disabled:opacity-50">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                    {filtered.length === 0 && (
                        <div className="text-center py-16 text-neutral/40">
                            <p className="text-4xl mb-3">👥</p>
                            <p>{lang === 'bn' ? 'কোনো ব্যবহারকারী পাওয়া যায়নি' : 'No users found'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
