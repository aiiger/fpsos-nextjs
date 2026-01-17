'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    ChevronRight,
    Calendar,
    Clock,
    CreditCard,
    ShieldCheck,
    Zap,
    Cpu,
    Server,
    ArrowRight,
    Users,
    Shield
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import BackgroundGrid from '@/components/BackgroundGrid';

const PACKAGES = [
    {
        id: 'quick',
        name: 'Quick Remote Fix',
        price: 'AED 199',
        duration: '30 Min',
        features: ['Driver Optimization', 'Windows Debloat', 'Game Config Tuning'],
        icon: Zap,
        color: 'cyan'
    },
    {
        id: 'full',
        name: 'Full System Tune-Up',
        price: 'AED 399',
        duration: '60 Min',
        features: ['Deep Windows Stripping', 'Network Optimization', 'Process Lasso Config', 'Latency Reduction'],
        icon: Server,
        color: 'purple',
        popular: true
    },
    {
        id: 'extreme',
        name: 'Extreme BIOSPRIME',
        price: 'AED 699',
        duration: '90 Min',
        features: ['Custom BIOS Tuning', 'RAM Overclocking', 'Electrical Optimization', 'Input Lag Nullification'],
        icon: Cpu,
        color: 'orange'
    }
];

const DAYS = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return d;
});

function BookingContent() {
    const searchParams = useSearchParams();
    const [step, setStep] = useState(1);
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [availableTimes, setAvailableTimes] = useState<{ display: string, original: string, originalDate: string }[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        discord: '',
        email: '',
        addons: [] as string[]
    });

    const [userTimezone, setUserTimezone] = useState('');

    useEffect(() => {
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    useEffect(() => {
        const packageParam = searchParams.get('package');
        if (packageParam) {
            const pkg = PACKAGES.find(p => p.id === packageParam);
            if (pkg) setSelectedPackage(pkg);
        }
    }, [searchParams]);

    useEffect(() => {
        if (step === 2) fetchAvailability();
    }, [step]);

    useEffect(() => {
        if (selectedDate && availableSlots.length > 0) {
            // Logic to convert Dubai slots to Local Time for display
            // But keep track of original Dubai time for booking
            const dateStr = selectedDate.toISOString().split('T')[0];

            // Filter slots that match the selected LOCAL date
            // This requires parsing the Dubai time, converting to Local, and checking the date
            const relevantSlots = availableSlots.filter((slot: any) => {
                // Parse Dubai time (UTC+4)
                const slotDate = new Date(`${slot.date}T${slot.time}:00+04:00`);
                return slotDate.toDateString() === selectedDate.toDateString();
            });

            const times = relevantSlots.map((slot: any) => {
                const slotDate = new Date(`${slot.date}T${slot.time}:00+04:00`);
                return {
                    display: slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    original: slot.time, // Keep Dubai time for backend
                    originalDate: slot.date
                };
            });

            setAvailableTimes(times);
        }
    }, [selectedDate, availableSlots]);

    const fetchAvailability = async () => {
        setLoadingAvailability(true);
        try {
            const startDate = new Date();
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 21); // Fetch 3 weeks ahead

            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];

            const res = await fetch(`/api/availability?startDate=${startStr}&endDate=${endStr}`);
            if (res.ok) {
                const slots = await res.json();
                setAvailableSlots(slots);
            }
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            toast.error('Failed to load available times');
        } finally {
            setLoadingAvailability(false);
        }
    };

    const basePrice = parseInt(selectedPackage.price.replace('AED ', ''));
    const totalPrice = basePrice;

    const handleNext = () => setStep(s => Math.min(s + 1, 3));
    const handleBack = () => setStep(s => Math.max(s - 1, 1));

    const handleBooking = async () => {
        setLoading(true);
        const toastId = toast.loading('Initiating Secure Handshake...');

        try {
            const payload = {
                client_name: formData.name,
                discord_id: formData.discord,
                email: formData.email,
                package_id: selectedPackage.id,
                package_name: selectedPackage.name,
                amount: `AED ${totalPrice}`,
                date_time: `${selectedDate?.toLocaleDateString()} ${selectedTime}`,
                add_ons: formData.addons
            };

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                toast.success('BOOKING CONFIRMED - Redirecting to PayPal...', {
                    id: toastId,
                    style: { background: '#0a0a0a', color: '#4ade80', border: '1px solid #4ade80' },
                    icon: '🚀'
                });

                const PAYPAL_USERNAME = 'rlikercreations';
                const paypalUrl = `https://paypal.me/${PAYPAL_USERNAME}/${totalPrice}AED`;
                setTimeout(() => {
                    window.open(paypalUrl, '_blank');
                    setStep(1);
                    setLoading(false);
                }, 2000);
            } else {
                throw new Error('API Error');
            }
        } catch (error) {
            toast.error('CONNECTION FAILED', { id: toastId });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 overflow-hidden relative pb-32">
            <BackgroundGrid />
            <Toaster position="top-center" />

            {/* Header */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-lg">F</span>
                        </div>
                        <div>
                            <h1 className="font-bold tracking-widest text-lg leading-none">FPSOS</h1>
                            <p className="text-[10px] text-white/40 uppercase tracking-[0.2em]">Consulting Group</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-400" />
                            <span>Verified Partners</span>
                        </div>
                        <div className="px-4 py-2 border border-white/10 rounded-full text-xs bg-white/5">
                            Global Availability: <span className="text-green-400">Online</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto">
                {/* Progress Bar */}
                <div className="mb-12 max-w-2xl mx-auto">
                    <div className="flex justify-between text-xs uppercase tracking-widest text-white/40 mb-4 px-2">
                        <span className={step >= 1 ? 'text-cyan-400' : ''}>01 Service</span>
                        <span className={step >= 2 ? 'text-cyan-400' : ''}>02 Schedule</span>
                        <span className={step >= 3 ? 'text-cyan-400' : ''}>03 Details</span>
                    </div>
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-500 to-amber-500"
                            initial={{ width: '0%' }}
                            animate={{ width: `${(step / 3) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: SELECT PACKAGE */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                            className="max-w-7xl mx-auto"
                        >
                            {/* Welcome Card */}
                            <div className="mb-10 p-6 rounded-2xl relative overflow-hidden bg-gradient-to-r from-black/80 via-black/60 to-black/80 border border-cyan-500/30 backdrop-blur-xl">
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-amber-500/40 rounded-br-xl" />
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                                        <Cpu className="w-7 h-7 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white mb-1 tracking-tight">Prepare for Your Session</h2>
                                        <p className="text-white/70 text-sm font-light">
                                            Join our <a href="https://discord.gg/9UXeaSx4SF" target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 font-semibold">Discord Server</a> for real-time support.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Package Cards */}
                            <div className="grid md:grid-cols-3 gap-8">
                                {PACKAGES.map((pkg) => (
                                    <motion.div
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        whileTap={{ scale: 0.99 }}
                                        className={`
                                            relative group cursor-pointer p-7 py-10 rounded-[1.8rem] backdrop-blur-xl transition-all duration-500 overflow-hidden flex flex-col justify-between min-h-[675px]
                                            ${selectedPackage.id === pkg.id
                                                ? 'bg-black/80 border-2 border-cyan-400/80 shadow-[0_0_60px_-10px_rgba(0,245,255,0.5)] z-10'
                                                : 'bg-black/40 border border-white/10 hover:border-cyan-500/40 hover:bg-black/60'}
                                        `}
                                    >
                                        {/* Corner Accents - Subtle Tech details */}
                                        <div className={`absolute top-0 right-0 p-6 transition-opacity duration-300 ${selectedPackage.id === pkg.id ? 'opacity-100' : 'opacity-0'}`}>
                                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(0,245,255,1)] animate-pulse" />
                                        </div>

                                        {pkg.popular && (
                                            <div className="absolute top-0 left-1/2 -translate-x-1/2">
                                                <div className="bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500 text-black text-[11px] font-black uppercase tracking-[0.2em] px-6 py-2 rounded-b-xl shadow-[0_5px_20px_rgba(0,245,255,0.4)]">
                                                    Most Popular
                                                </div>
                                            </div>
                                        )}

                                        <div className="relative z-10 flex flex-col h-full">

                                            {/* Header Section */}
                                            <div className="mb-8">
                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 shadow-2xl ${selectedPackage.id === pkg.id ? 'bg-cyan-500 text-black' : 'bg-white/5 text-cyan-400'
                                                    }`}>
                                                    <pkg.icon className="w-8 h-8" />
                                                </div>

                                                <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{pkg.name}</h3>
                                                <div className="flex items-baseline gap-2 mb-2">
                                                    <span className="text-5xl font-black text-white tracking-tighter">{pkg.price}</span>
                                                </div>
                                                <div className="text-xs text-white/40 uppercase tracking-[0.2em] font-medium">{pkg.duration} Session</div>
                                            </div>

                                            {/* Divider */}
                                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

                                            {/* Features List - Expanded vertical rhythm */}
                                            <ul className="space-y-6 mb-auto">
                                                {pkg.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-4 text-sm text-white/70 group-hover:text-white transition-colors">
                                                        <Check className={`w-5 h-5 shrink-0 ${selectedPackage.id === pkg.id ? 'text-cyan-400' : 'text-white/20 group-hover:text-cyan-400/50'}`} />
                                                        <span className="leading-snug">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>

                                            {/* Action Button */}
                                            <button className={`
                                                w-full py-5 rounded-xl flex items-center justify-center gap-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 mt-10
                                                ${selectedPackage.id === pkg.id
                                                    ? 'bg-cyan-400 text-black shadow-[0_0_30px_rgba(0,245,255,0.4)] hover:shadow-[0_0_50px_rgba(0,245,255,0.6)] hover:scale-[1.02]'
                                                    : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'}
                                            `}>
                                                {selectedPackage.id === pkg.id ? (
                                                    <>
                                                        <Check className="w-5 h-5" /> Selected
                                                    </>
                                                ) : (
                                                    'Select Plan'
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: SELECT TIME */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                            className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8"
                        >
                            {/* Date Picker */}
                            <div className="md:col-span-2 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-cyan-500/30 backdrop-blur-xl">
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl" />
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 rounded-br-xl" />
                                <div className="mb-8 relative z-10">
                                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-cyan-400" /> Select Date
                                    </h3>
                                    <p className="text-sm text-white/50 font-light">Choose your preferred day</p>
                                </div>
                                <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2">
                                    {DAYS.map(date => (
                                        <button
                                            key={date.toISOString()}
                                            onClick={() => setSelectedDate(date)}
                                            className={`
                                                w-full p-4 rounded-xl flex items-center justify-between transition-all duration-300 border
                                                ${selectedDate?.toDateString() === date.toDateString()
                                                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-400 text-black border-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.4)]'
                                                    : 'bg-black/40 hover:bg-black/60 text-white/80 hover:text-white border-white/10 hover:border-cyan-500/40'}
                                            `}
                                        >
                                            <span className="font-medium">{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                            {selectedDate?.toDateString() === date.toDateString() && <Check className="w-4 h-4" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Time Picker */}
                            <div className="md:col-span-3 relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-amber-500/30 backdrop-blur-xl">
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-amber-500/40 rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-amber-500/40 rounded-bl-xl" />
                                <div className="mb-8 relative z-10">
                                    <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-amber-400" /> Select Time
                                    </h3>
                                    <p className="text-sm text-white/50 font-light">
                                        {userTimezone ? `Times shown in ${userTimezone}` : 'Loading timezone...'}
                                    </p>
                                </div>

                                {!selectedDate ? (
                                    <div className="h-40 flex items-center justify-center text-white/30 text-sm italic">
                                        Select a date first
                                    </div>
                                ) : loadingAvailability ? (
                                    <div className="h-40 flex items-center justify-center">
                                        <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                                    </div>
                                ) : availableTimes.length === 0 ? (
                                    <div className="h-40 flex flex-col items-center justify-center text-white/30 text-sm">
                                        <p>No available times for this date</p>
                                        <p className="text-xs mt-2 text-white/20">Try another date</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {availableTimes.map((timeObj) => (
                                            <button
                                                key={`${timeObj.originalDate}-${timeObj.original}`}
                                                onClick={() => setSelectedTime(timeObj.original)} // Store ORIGINAL time for backend
                                                className={`
                                                    p-4 rounded-xl text-center font-bold transition-all duration-300 border
                                                    ${selectedTime === timeObj.original
                                                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
                                                        : 'bg-black/40 hover:bg-black/60 text-white/70 hover:text-white border-white/10 hover:border-amber-500/40'}
                                                `}
                                            >
                                                {timeObj.display}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: DETAILS */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 260, damping: 20 }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Summary */}
                                <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-cyan-500/30 backdrop-blur-xl h-fit">
                                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-cyan-500/40 rounded-tl-xl" />
                                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-cyan-500/40 rounded-br-xl" />

                                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-cyan-400" /> Session Summary
                                    </h3>

                                    <div className="space-y-4">
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="text-sm text-white/50 mb-1">Package</div>
                                            <div className="text-lg font-bold flex justify-between">
                                                {selectedPackage.name}
                                                <span className="text-cyan-400">{selectedPackage.price}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                            <div className="text-sm text-white/50 mb-1">Date & Time</div>
                                            <div className="font-medium">
                                                {selectedDate?.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at {availableTimes.find(t => t.original === selectedTime)?.display || selectedTime}
                                                <span className="text-xs text-white/40 block mt-1">({userTimezone})</span>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                                            <span className="text-white/60">Total</span>
                                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                                {selectedPackage.price}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Form */}
                                <div className="space-y-6">
                                    <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-purple-500/30 backdrop-blur-xl">
                                        <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-purple-500/40 rounded-tr-xl" />
                                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-purple-500/40 rounded-bl-xl" />

                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                                            <Users className="w-5 h-5 text-purple-400" /> Your Details
                                        </h3>

                                        <div className="space-y-4 relative z-10">
                                            <div>
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Discord ID</label>
                                                <input
                                                    type="text"
                                                    value={formData.discord}
                                                    onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20"
                                                    placeholder="username#0000"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Email</label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-all placeholder:text-white/20"
                                                    placeholder="name@example.com"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleBooking}
                                        disabled={loading || !formData.name || !formData.email || !formData.discord}
                                        className={`
                                            w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden group
                                            ${loading || !formData.name || !formData.email || !formData.discord
                                                ? 'bg-white/5 text-white/50 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-[1.02]'}
                                        `}
                                    >
                                        {loading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center justify-center gap-2 relative z-10">
                                                Secure with PayPal <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        )}
                                    </button>

                                    <p className="text-center text-xs text-white/40">
                                        <Shield className="w-3 h-3 inline mr-1" />
                                        Secure payment via PayPal. No card details stored.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Navigation Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-6 md:px-20 border-t border-white/10 bg-black/80 backdrop-blur-xl flex justify-between items-center z-50">
                {step > 1 ? (
                    <button
                        onClick={handleBack}
                        className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all group"
                    >
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 group-hover:bg-white/5 transition-all">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                        </div>
                        <span className="hidden md:inline">Go Back</span>
                    </button>
                ) : <div />}

                {step < 3 && (
                    <button
                        onClick={handleNext}
                        disabled={step === 2 && (!selectedDate || !selectedTime)}
                        className={`
                            flex items-center gap-4 px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all group
                            ${step === 2 && (!selectedDate || !selectedTime)
                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] hover:scale-105'}
                        `}
                    >
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                )}
            </div>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-2 border-white/5 border-t-cyan-500 rounded-full" />
            </div>
        }>
            <BookingContent />
        </Suspense>
    );
}
