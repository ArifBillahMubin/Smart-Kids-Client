import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaBook, FaUsers, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { addCourse, getCourses, updateCourse, deleteCourse } from '../../../../utils';

// ── Constants ──
const SUBJECTS = ['Mathematics', 'Science', 'English', 'Bangla', 'Coding', 'Arts'];
const CLASSES  = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 1-3', 'Class 2-5', 'Class 3-4', 'Class 4-5', 'Class 1-5'];
const LEVELS   = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const EMOJIS   = ['🔢', '🔬', '📖', '📝', '💻', '🎨', '🔭', '🧪', '📐', '🌍'];
const COLORS   = [
    { label: 'Blue',   value: 'from-blue-400 to-blue-600' },
    { label: 'Green',  value: 'from-green-400 to-emerald-600' },
    { label: 'Pink',   value: 'from-pink-400 to-rose-600' },
    { label: 'Orange', value: 'from-orange-400 to-amber-600' },
    { label: 'Purple', value: 'from-purple-400 to-violet-600' },
    { label: 'Yellow', value: 'from-yellow-400 to-orange-500' },
];

const EMPTY = {
    emoji: '📚', title: '', titleBn: '', subject: 'Mathematics', class: 'Class 3',
    level: 'Beginner', duration: '', durationBn: '', lessons: '', quizzes: '',
    color: COLORS[0].value, price: 'Free', priceBn: 'বিনামূল্যে', priceAmount: 0,
    instructor: '', instructorBn: '', instructorRole: '', instructorRoleBn: '',
    description: '', descriptionBn: '',
    whatYouLearn: '', whatYouLearnBn: '',       // newline-separated in form
    curriculum: '',                              // "Week 1|Topic|TopicBn|6" per line
    requirements: '', requirementsBn: '',
    tags: '', status: 'draft',
};

//  Small reusable input 
const F = ({ label, name, reg, rules, err, type = 'text', ph = '' }) => (
    <div className="flex flex-col gap-1">
        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">{label}</label>
        <input type={type} placeholder={ph}
            className={`px-3 py-2.5 rounded-xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${err ? 'border-error' : 'border-base-300'}`}
            {...reg(name, rules)} />
        {err && <p className="text-error text-xs">{err.message}</p>}
    </div>
);

const ManageCourses = () => {
    const [courses, setCourses]     = useState([]);
    const [loading, setLoading]     = useState(true);
    const [saving, setSaving]       = useState(false);
    const [search, setSearch]       = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // ─ Fetch all courses on mount ──
    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getCourses();
            setCourses(data);
        } catch {
            toast.error('Failed to load courses');
        } finally {
            setLoading(false);
        }
    };

    // ─ Open Add modal ─
    const openAdd = () => {
        reset(EMPTY);
        setEditingId(null);
        setModalOpen(true);
    };

    // ─ Open Edit modal — pre-fill form ─
    const openEdit = (course) => {
        reset({
            ...course,
            // Convert arrays → newline strings for textarea
            whatYouLearn:   (course.whatYouLearn   || []).join('\n'),
            whatYouLearnBn: (course.whatYouLearnBn || []).join('\n'),
            requirements:   (course.requirements   || []).join('\n'),
            requirementsBn: (course.requirementsBn || []).join('\n'),
            tags:           (course.tags           || []).join(', '),
            // curriculum: "week|topic|topicBn|lessons" per line
            curriculum: (course.curriculum || [])
                .map(c => `${c.week}|${c.weekBn}|${c.topic}|${c.topicBn}|${c.lessons}`)
                .join('\n'),
        });
        setEditingId(course._id);
        setModalOpen(true);
    };

    // ── Parse form data → clean object ──
    const parse = (data) => ({
        ...data,
        lessons:     Number(data.lessons),
        quizzes:     Number(data.quizzes),
        priceAmount: Number(data.priceAmount),
        badge:       'bg-primary/10 text-primary',
        whatYouLearn:   data.whatYouLearn.split('\n').map(s => s.trim()).filter(Boolean),
        whatYouLearnBn: data.whatYouLearnBn.split('\n').map(s => s.trim()).filter(Boolean),
        requirements:   data.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        requirementsBn: data.requirementsBn.split('\n').map(s => s.trim()).filter(Boolean),
        tags:           data.tags.split(',').map(s => s.trim()).filter(Boolean),
        curriculum:     data.curriculum.split('\n').map(line => {
            const [week, weekBn, topic, topicBn, lessons] = line.split('|');
            return { week, weekBn, topic, topicBn, lessons: Number(lessons) };
        }).filter(c => c.week),
    });

    // ─ Submit: Add or Update ─
    const onSubmit = async (data) => {
        setSaving(true);
        try {
            const payload = parse(data);

            if (editingId) {
                // PUT /course/:id
                await updateCourse(editingId, payload);
                setCourses(prev => prev.map(c => c._id === editingId ? { ...payload, _id: editingId } : c));
                toast.success('Course updated!');
            } else {
                // POST /courses
                const result = await addCourse(payload);
                setCourses(prev => [...prev, { ...payload, _id: result?.insertedId }]);
                toast.success('Course added!');
            }
            setModalOpen(false);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Something went wrong');
        } finally {
            setSaving(false);
        }
    };

    // ─ Delete — SweetAlert2 confirm ─
    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete Course?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'Yes, delete!',
            cancelButtonText: 'Cancel',
        });

        if (!result.isConfirmed) return;

        try {
            await deleteCourse(id);
            setCourses(prev => prev.filter(c => c._id !== id));
            Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Delete failed');
        }
    };

    const filtered = courses.filter(c =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.subject?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">

            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="text-2xl font-bold text-neutral">Manage Courses</h2>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-sm" />
                        <input value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Search..."
                            className="pl-9 pr-4 py-2.5 rounded-2xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary w-44" />
                    </div>
                    <button onClick={openAdd}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all">
                        <FaPlus /> Add Course
                    </button>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex justify-center py-20">
                    <FaSpinner className="animate-spin text-primary text-3xl" />
                </div>
            )}

            {/* Course grid */}
            {!loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((c, i) => (
                        <motion.div key={c._id || i}
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="bg-base-100 rounded-3xl border border-base-300 overflow-hidden hover:shadow-md transition-shadow">
                            {/* Card header */}
                            <div className={`bg-gradient-to-br ${c.color || 'from-primary to-primary/60'} p-5 flex items-center justify-between`}>
                                <span className="text-4xl">{c.emoji}</span>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${c.status === 'published' ? 'bg-white/30 text-white' : 'bg-black/20 text-white'}`}>
                                        {c.status}
                                    </span>
                                    <p className="text-white/80 text-xs mt-1">
                                        {c.priceAmount === 0 ? 'Free' : `৳${c.priceAmount}`}
                                    </p>
                                </div>
                            </div>
                            {/* Card body */}
                            <div className="p-5">
                                <h3 className="font-bold text-neutral mb-1 truncate">{c.title}</h3>
                                <p className="text-xs text-neutral/50 mb-2">{c.subject} · {c.class}</p>
                                <div className="flex items-center gap-3 text-xs text-neutral/50 mb-4">
                                    <span className="flex items-center gap-1"><FaBook className="text-primary" />{c.lessons} lessons</span>
                                    <span className="flex items-center gap-1"><FaUsers className="text-accent" />{c.enrolled || 0}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => openEdit(c)}
                                        className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-secondary/10 text-secondary text-xs font-bold hover:bg-secondary hover:text-white transition-all">
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(c._id)}
                                        className="px-3 py-2 rounded-xl bg-error/10 text-error text-xs font-bold hover:bg-error hover:text-white transition-all">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filtered.length === 0 && !loading && (
                        <p className="col-span-3 text-center text-neutral/40 py-16">No courses found.</p>
                    )}
                </div>
            )}

            {/* ── Add / Edit Modal ── */}
            <AnimatePresence>
                {modalOpen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
                            className="bg-base-100 rounded-3xl w-full max-w-2xl my-8 border border-base-300 shadow-2xl">

                            {/* Modal header */}
                            <div className="flex items-center justify-between p-6 border-b border-base-300">
                                <h3 className="text-xl font-bold text-neutral">
                                    {editingId ? 'Edit Course' : 'Add New Course'}
                                </h3>
                                <button onClick={() => setModalOpen(false)}
                                    className="w-9 h-9 rounded-xl border border-base-300 flex items-center justify-center hover:bg-base-200">
                                    <FaTimes className="text-sm" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}
                                className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">

                                {/* ── Row 1: Emoji, Status, Color ── */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Emoji</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('emoji', { required: 'Required' })}>
                                            {EMOJIS.map(e => <option key={e} value={e}>{e}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Status</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('status')}>
                                            <option value="draft">Draft</option>
                                            <option value="published">Published</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Card Color</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('color')}>
                                            {COLORS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* ── Title ── */}
                                <div className="grid grid-cols-2 gap-4">
                                    <F label="Title (EN)" name="title" reg={register} rules={{ required: 'Required' }} err={errors.title} ph="Mathematics Class 3" />
                                    <F label="Title (BN)" name="titleBn" reg={register} ph="গণিত ক্লাস ৩" />
                                </div>

                                {/* ── Subject, Class, Level ── */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Subject</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('subject', { required: 'Required' })}>
                                            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Class</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('class')}>
                                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Level</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('level')}>
                                            {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                        </select>
                                    </div>
                                </div>

                                {/* ── Duration, Lessons, Quizzes ── */}
                                <div className="grid grid-cols-4 gap-4">
                                    <F label="Duration (EN)" name="duration" reg={register} rules={{ required: 'Required' }} err={errors.duration} ph="8 Weeks" />
                                    <F label="Duration (BN)" name="durationBn" reg={register} ph="৮ সপ্তাহ" />
                                    <F label="Lessons" name="lessons" reg={register} rules={{ required: 'Required' }} err={errors.lessons} type="number" ph="24" />
                                    <F label="Quizzes" name="quizzes" reg={register} type="number" ph="12" />
                                </div>

                                {/* ── Price ── */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Price Type</label>
                                        <select className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary"
                                            {...register('price')}>
                                            <option value="Free">Free</option>
                                            <option value="Paid">Paid</option>
                                        </select>
                                    </div>
                                    <F label="Amount (৳)" name="priceAmount" reg={register} type="number" ph="0" />
                                    <F label="Price Label (BN)" name="priceBn" reg={register} ph="বিনামূল্যে" />
                                </div>

                                {/* ── Instructor ── */}
                                <div className="grid grid-cols-2 gap-4">
                                    <F label="Instructor (EN)" name="instructor" reg={register} rules={{ required: 'Required' }} err={errors.instructor} ph="Md. Rafiqul Islam" />
                                    <F label="Instructor (BN)" name="instructorBn" reg={register} ph="মো. রফিকুল ইসলাম" />
                                    <F label="Role (EN)" name="instructorRole" reg={register} ph="Math Teacher, 10 yrs exp" />
                                    <F label="Role (BN)" name="instructorRoleBn" reg={register} ph="গণিত শিক্ষক, ১০ বছরের অভিজ্ঞতা" />
                                </div>

                                {/* ── Description ── */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Description (EN)</label>
                                        <textarea rows={3} placeholder="Course description..."
                                            className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none"
                                            {...register('description', { required: 'Required' })} />
                                        {errors.description && <p className="text-error text-xs">{errors.description.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Description (BN)</label>
                                        <textarea rows={3} placeholder="বাংলায় বিবরণ..."
                                            className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none"
                                            {...register('descriptionBn')} />
                                    </div>
                                </div>

                                {/* ── What You'll Learn — one item per line ── */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">What You'll Learn (EN) — one per line</label>
                                        <textarea rows={4} placeholder={"Learn fractions\nLearn geometry\n..."}
                                            className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none"
                                            {...register('whatYouLearn', { required: 'Required' })} />
                                        {errors.whatYouLearn && <p className="text-error text-xs">{errors.whatYouLearn.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">What You'll Learn (BN) — one per line</label>
                                        <textarea rows={4} placeholder={"ভগ্নাংশ শিখুন\nজ্যামিতি শিখুন\n..."}
                                            className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none"
                                            {...register('whatYouLearnBn')} />
                                    </div>
                                </div>

                                {/* ── Curriculum — format: week|weekBn|topic|topicBn|lessons ── */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">
                                        Curriculum — format: <code className="bg-base-300 px-1 rounded">Week 1-2|সপ্তাহ ১-২|Topic|বিষয়|6</code> (one per line)
                                    </label>
                                    <textarea rows={4} placeholder={"Week 1-2|সপ্তাহ ১-২|Numbers|সংখ্যা|6\nWeek 3-4|সপ্তাহ ৩-৪|Fractions|ভগ্নাংশ|6"}
                                        className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none font-mono"
                                        {...register('curriculum', { required: 'Required' })} />
                                    {errors.curriculum && <p className="text-error text-xs">{errors.curriculum.message}</p>}
                                </div>

                                {/* ── Requirements — one per line ── */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Requirements (EN) — one per line</label>
                                        <textarea rows={3} placeholder={"Basic counting\nClass 2 recommended"}
                                            className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none"
                                            {...register('requirements', { required: 'Required' })} />
                                        {errors.requirements && <p className="text-error text-xs">{errors.requirements.message}</p>}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs font-bold text-neutral/60 uppercase tracking-wide">Requirements (BN) — one per line</label>
                                        <textarea rows={3} placeholder={"মৌলিক গণনা\nক্লাস ২ প্রস্তাবিত"}
                                            className="px-3 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 text-neutral text-sm outline-none focus:border-primary resize-none"
                                            {...register('requirementsBn')} />
                                    </div>
                                </div>

                                {/* ── Tags ── */}
                                <F label="Tags (comma separated)" name="tags" reg={register} ph="Math, Class 3, Numbers" />

                                {/* ── Submit ── */}
                                <div className="flex gap-3 pt-2 border-t border-base-300">
                                    <button type="button" onClick={() => setModalOpen(false)}
                                        className="flex-1 py-3 rounded-2xl border-2 border-base-300 text-neutral font-bold hover:bg-base-200 transition-all">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={saving}
                                        className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
                                        {saving && <FaSpinner className="animate-spin" />}
                                        {editingId ? 'Update Course' : 'Add Course'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ManageCourses;
