import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaEdit, FaTrash, FaBan, FaUserCheck } from 'react-icons/fa';
import { useApp } from '../../../../context/AppContext';

const users = [
    { id: 1, name: 'Fatema Begum', email: 'fatema@email.com', role: 'Guardian', child: 'Rafi, Class 3', status: 'active', joined: 'Apr 1, 2026' },
    { id: 2, name: 'Karim Uddin', email: 'karim@email.com', role: 'Guardian', child: 'Nadia, Class 2', status: 'active', joined: 'Apr 2, 2026' },
    { id: 3, name: 'Sumaiya Akter', email: 'sumaiya@email.com', role: 'Guardian', child: 'Arif, Class 4', status: 'pending', joined: 'Apr 3, 2026' },
    { id: 4, name: 'Rahim Mia', email: 'rahim@email.com', role: 'Guardian', child: 'Tanha, Class 1', status: 'active', joined: 'Apr 4, 2026' },
    { id: 5, name: 'Nasrin Jahan', email: 'nasrin@email.com', role: 'Guardian', child: 'Sabbir, Class 5', status: 'inactive', joined: 'Apr 5, 2026' },
    { id: 6, name: 'Admin User', email: 'admin@smartkids.com', role: 'Admin', child: '—', status: 'active', joined: 'Jan 1, 2026' },
];

const ManageUsers = () => {
    const { lang } = useApp();
    const [search, setSearch] = useState('');
    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-2xl font-bold text-neutral">{lang === 'bn' ? 'ব্যবহারকারী ব্যবস্থাপনা' : 'Manage Users'}</h2>
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder={lang === 'bn' ? 'খুঁজুন...' : 'Search users...'}
                        className="pl-9 pr-4 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all w-64" />
                </div>
            </div>

            <div className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-base-200 text-neutral/50 text-xs font-bold uppercase">
                                <th className="px-5 py-4 text-left">{lang === 'bn' ? 'ব্যবহারকারী' : 'User'}</th>
                                <th className="px-5 py-4 text-left hidden sm:table-cell">{lang === 'bn' ? 'ভূমিকা' : 'Role'}</th>
                                <th className="px-5 py-4 text-left hidden md:table-cell">{lang === 'bn' ? 'সন্তান' : 'Child'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                                <th className="px-5 py-4 text-center">{lang === 'bn' ? 'কার্যক্রম' : 'Actions'}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, i) => (
                                <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="border-t border-base-300 hover:bg-base-200/50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center shrink-0">
                                                {u.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-neutral text-sm">{u.name}</p>
                                                <p className="text-neutral/40 text-xs">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4 hidden sm:table-cell">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.role === 'Admin' ? 'bg-error/15 text-error' : 'bg-primary/15 text-primary'}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-neutral/60 hidden md:table-cell">{u.child}</td>
                                    <td className="px-5 py-4 text-center">
                                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${u.status === 'active' ? 'bg-success/15 text-success' : u.status === 'pending' ? 'bg-warning/15 text-warning' : 'bg-base-300 text-neutral/40'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <button className="w-8 h-8 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center text-xs">
                                                <FaEdit />
                                            </button>
                                            <button className="w-8 h-8 rounded-xl bg-warning/10 text-warning hover:bg-warning hover:text-white transition-all flex items-center justify-center text-xs">
                                                <FaBan />
                                            </button>
                                            <button className="w-8 h-8 rounded-xl bg-error/10 text-error hover:bg-error hover:text-white transition-all flex items-center justify-center text-xs">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;
