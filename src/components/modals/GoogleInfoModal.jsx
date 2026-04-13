import { useState, Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, Transition, TransitionChild, DialogPanel, DialogTitle } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FaChild, FaPhone, FaLock, FaEye, FaEyeSlash, FaUser } from 'react-icons/fa';
import { TbFidgetSpinner } from 'react-icons/tb';
import { useApp } from '../../context/AppContext';
import { imageUpload } from '../../utils';

const classes = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'];

const t = {
    en: {
        title: 'Complete Your Profile',
        sub: 'A few more details to set up your guardian account.',
        parentName: 'Parent Name', parentNamePh: 'Your full name',
        phone: 'Phone Number', phonePh: '01XXXXXXXXX',
        childName: "Child's Name", childNamePh: "Child's full name",
        childClass: "Child's Class", childClassPh: 'Select class',
        childImg: "Child's Photo",
        pin: 'Dashboard PIN (4 digits)', pinPh: '••••',
        pinHint: 'Prevents your child from accessing the guardian dashboard.',
        btn: 'Complete Setup',
        err: { req: 'Required', pinLen: 'Must be exactly 4 digits' },
    },
    bn: {
        title: 'প্রোফাইল সম্পন্ন করুন',
        sub: 'অভিভাবক অ্যাকাউন্ট সেটআপ করতে আরো কিছু তথ্য দরকার।',
        parentName: 'অভিভাবকের নাম', parentNamePh: 'আপনার পূর্ণ নাম',
        phone: 'ফোন নম্বর', phonePh: '০১XXXXXXXXX',
        childName: 'সন্তানের নাম', childNamePh: 'সন্তানের পূর্ণ নাম',
        childClass: 'সন্তানের শ্রেণি', childClassPh: 'শ্রেণি নির্বাচন করুন',
        childImg: 'সন্তানের ছবি',
        pin: 'ড্যাশবোর্ড PIN (৪ সংখ্যা)', pinPh: '••••',
        pinHint: 'আপনার সন্তানকে অভিভাবক ড্যাশবোর্ড অ্যাক্সেস করতে বাধা দেবে।',
        btn: 'সেটআপ সম্পন্ন করুন',
        err: { req: 'আবশ্যক', pinLen: 'ঠিক ৪ সংখ্যা হতে হবে' },
    },
};

const GoogleInfoModal = ({ googleUser, onComplete, loading }) => {
    const { lang } = useApp();
    const c = t[lang];
    const [showPin, setShowPin] = useState(false);
    const [childPreview, setChildPreview] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { parentName: googleUser?.displayName || '' }
    });

    const onSubmit = async (data) => {
        setUploading(true);
        try {
            let childImageURL = '';
            if (data.childImage?.[0]) childImageURL = await imageUpload(data.childImage[0]);
            onComplete({ ...data, childImageURL });
        } finally {
            setUploading(false);
        }
    };

    const isBusy = loading || uploading;

    return (
        <Transition appear show={!!googleUser} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={() => {}}>
                {/* Backdrop */}
                <TransitionChild as={Fragment}
                    enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
                    leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <div className="fixed inset-0 bg-black/60" />
                </TransitionChild>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <TransitionChild as={Fragment}
                            enter="ease-out duration-200" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100"
                            leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                            <DialogPanel className="bg-base-100 rounded-3xl w-full max-w-md p-8 border border-base-300 shadow-2xl">

                                <div className="text-center mb-6">
                                    <div className="text-4xl mb-3">👋</div>
                                    <DialogTitle className="text-2xl font-bold text-neutral">{c.title}</DialogTitle>
                                    <p className="text-neutral/50 text-sm mt-1">{c.sub}</p>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                                    {/* Parent Name */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-neutral/70">{c.parentName}</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                            <input placeholder={c.parentNamePh}
                                                className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.parentName ? 'border-error' : 'border-base-300'}`}
                                                {...register('parentName', { required: c.err.req })} />
                                        </div>
                                        {errors.parentName && <p className="text-error text-xs">{errors.parentName.message}</p>}
                                    </div>

                                    {/* Phone */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-neutral/70">{c.phone}</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                            <input placeholder={c.phonePh}
                                                className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.phone ? 'border-error' : 'border-base-300'}`}
                                                {...register('phone', { required: c.err.req })} />
                                        </div>
                                        {errors.phone && <p className="text-error text-xs">{errors.phone.message}</p>}
                                    </div>

                                    {/* Child Name + Class */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold text-neutral/70">{c.childName}</label>
                                            <div className="relative">
                                                <FaChild className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                                <input placeholder={c.childNamePh}
                                                    className={`w-full pl-9 pr-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.childName ? 'border-error' : 'border-base-300'}`}
                                                    {...register('childName', { required: c.err.req })} />
                                            </div>
                                            {errors.childName && <p className="text-error text-xs">{errors.childName.message}</p>}
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-sm font-semibold text-neutral/70">{c.childClass}</label>
                                            <select className={`w-full px-3 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary transition-all ${errors.childClass ? 'border-error' : 'border-base-300'}`}
                                                {...register('childClass', { required: c.err.req })}>
                                                <option value="">{c.childClassPh}</option>
                                                {classes.map(cl => <option key={cl} value={cl}>{cl}</option>)}
                                            </select>
                                            {errors.childClass && <p className="text-error text-xs">{errors.childClass.message}</p>}
                                        </div>
                                    </div>

                                    {/* Child Photo */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-neutral/70">{c.childImg}</label>
                                        <label htmlFor="googleChildImg"
                                            className="flex flex-col items-center justify-center h-24 rounded-2xl border-2 border-dashed border-base-300 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all">
                                            {childPreview
                                                ? <img src={childPreview} className="h-full w-full object-cover rounded-2xl" alt="" />
                                                : <div className="flex flex-col items-center gap-1 text-neutral/30">
                                                    <FaChild size={20} /><span className="text-xs">Click to upload</span>
                                                </div>}
                                        </label>
                                        <input id="googleChildImg" type="file" accept="image/*" className="hidden"
                                            {...register('childImage')}
                                            onChange={(e) => {
                                                register('childImage').onChange(e);
                                                const f = e.target.files[0];
                                                if (f) setChildPreview(URL.createObjectURL(f));
                                            }} />
                                    </div>

                                    {/* Dashboard PIN */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-semibold text-neutral/70">{c.pin}</label>
                                        <div className="relative">
                                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral/30 text-xs" />
                                            <input type={showPin ? 'text' : 'password'} placeholder={c.pinPh} maxLength={4}
                                                className={`w-full pl-9 pr-10 py-2.5 rounded-2xl border-2 bg-base-100 text-neutral text-sm outline-none focus:border-primary tracking-widest transition-all ${errors.dashboardPin ? 'border-error' : 'border-base-300'}`}
                                                {...register('dashboardPin', { required: c.err.req, pattern: { value: /^\d{4}$/, message: c.err.pinLen } })} />
                                            <button type="button" onClick={() => setShowPin(p => !p)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral/40 hover:text-neutral">
                                                {showPin ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                        {errors.dashboardPin
                                            ? <p className="text-error text-xs">{errors.dashboardPin.message}</p>
                                            : <p className="text-neutral/40 text-xs">{c.pinHint}</p>}
                                    </div>

                                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        type="submit" disabled={isBusy}
                                        className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold text-base hover:bg-primary/90 transition-all shadow-md mt-1 flex items-center justify-center gap-2">
                                        {isBusy && <TbFidgetSpinner className="animate-spin text-xl" />}
                                        {!isBusy && c.btn}
                                    </motion.button>
                                </form>
                            </DialogPanel>
                        </TransitionChild>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default GoogleInfoModal;
