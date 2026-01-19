'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    Calendar,
    Clock,
    Zap,
    Cpu,
    Server,
    ArrowRight,
    ArrowLeft,
    Users,
    Shield,
    Sparkles,
    ChevronRight,
    Star
} from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import BackgroundGrid from '@/components/BackgroundGrid';
import CalendarGrid from '@/components/booking/CalendarGrid';
import TimeSlotPicker from '@/components/booking/TimeSlotPicker';
import BookingSummary from '@/components/booking/BookingSummary';
import ConfirmationSuccess from '@/components/booking/ConfirmationSuccess';

// Package definitions
const PACKAGES = [
    {
        id: 'quick',
        name: 'Quick Remote Fix',
        price: 'AED 199',
        priceNum: 199,
        duration: '30 Min',
        features: ['Driver Optimization', 'Windows Debloat', 'Game Config Tuning'],
        icon: Zap,
        color: 'cyan',
        description: "Essential tuning for instant improvements."
    },
    {
        id: 'full',
        name: 'Full System Tune-Up',
        price: 'AED 399',
        priceNum: 399,
        duration: '60 Min',
        features: ['Deep Windows Stripping', 'Network Optimization', 'Process Lasso Config', 'Latency Reduction'],
        icon: Server,
        color: 'purple',
        popular: true,
        description: "Complete overhaul for maximum performance."
    },
    {
        id: 'extreme',
        name: 'Extreme BIOSPRIME',
        price: 'AED 699',
        priceNum: 699,
        duration: '90 Min',
        features: ['Custom BIOS Tuning', 'RAM Overclocking', 'Electrical Optimization', 'Input Lag Nullification'],
        icon: Cpu,
        color: 'orange',
        description: "Professional-grade hardware tuning."
    }
];

function BookingContent() {
    const searchParams = useSearchParams();

    // Step management (1: Schedule, 2: Details, 3: Success)
    const [step, setStep] = useState(1);

    // Selections
    const [selectedPackage, setSelectedPackage] = useState(PACKAGES[1]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);

    // Availability data
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [availableTimes, setAvailableTimes] = useState<{ display: string; original: string; originalDate: string }[]>([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    // Form data
    const [formData, setFormData] = useState({
        name: '',
        discord: '',
        email: '',
        notes: ''
    });

    // AI Suggestions
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // Loading & success states
    const [loading, setLoading] = useState(false);
    const [bookingResult, setBookingResult] = useState<{
        id: string;
        packageName: string;
        dateTime: string;
        amount: string;
        email: string;
    } | null>(null);

    // User timezone
    const [userTimezone, setUserTimezone] = useState('');

    useEffect(() => {
        setUserTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, []);

    // Load package from URL
    useEffect(() => {
        const packageParam = searchParams.get('package');
        if (packageParam) {
            const pkg = PACKAGES.find(p => p.id === packageParam);
            if (pkg) setSelectedPackage(pkg);
        }
    }, [searchParams]);

    // Fetch availability on mount
    useEffect(() => {
        fetchAvailability();
    }, []);

    // Update time slots when date changes
    useEffect(() => {
        if (selectedDate && availableSlots.length > 0) {
            const relevantSlots = availableSlots.filter((slot: any) => {
                const slotDate = new Date(`${slot.date}T${slot.time}:00+04:00`);
                return slotDate.toDateString() === selectedDate.toDateString();
            });

            const times = relevantSlots.map((slot: any) => {
                const slotDate = new Date(`${slot.date}T${slot.time}:00+04:00`);
                return {
                    display: slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    original: slot.time,
                    originalDate: slot.date
                };
            });

            setAvailableTimes(times);
            setSelectedTime(null); // Reset time when date changes
        }
    }, [selectedDate, availableSlots]);

    const fetchAvailability = async () => {
        setLoadingAvailability(true);
        try {
            const today = new Date();
            const future = new Date();
            future.setDate(future.getDate() + 30);

            // Format dates as YYYY-MM-DD in local timezone
            const formatDate = (d: Date) => {
                const year = d.getFullYear();
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const day = String(d.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            };

            const startStr = formatDate(today);
            const endStr = formatDate(future);

            const res = await fetch(`/api/availability?startDate=${startStr}&endDate=${endStr}`);
            if (res.ok) {
                const slots = await res.json();
                setAvailableSlots(slots);
            } else {
                const err = await res.json();
                console.error('Availability API error:', err);
            }
        } catch (error) {
            console.error('Failed to fetch availability:', error);
            toast.error('Failed to load available times');
        } finally {
            setLoadingAvailability(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.discord) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        const toastId = toast.loading('Securing your slot...');

        try {
            const dateTimeStr = `${selectedDate.toLocaleDateString()} ${selectedTime}`;

            const payload = {
                client_name: formData.name,
                discord_id: formData.discord,
                email: formData.email,
                package_id: selectedPackage.id,
                package_name: selectedPackage.name,
                amount: selectedPackage.price,
                date_time: dateTimeStr,
                add_ons: []
            };

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                toast.success('Booking Initiated', {
                    id: toastId,
                    icon: '🔒',
                    duration: 3000
                });

                // Open PayPal
                const PAYPAL_USERNAME = 'rlikercreations';
                const paypalUrl = `https://paypal.me/${PAYPAL_USERNAME}/${selectedPackage.priceNum}AED`;

                setTimeout(() => {
                    window.open(paypalUrl, '_blank');
                }, 1500);

                // Show success screen
                setBookingResult({
                    id: data.id,
                    packageName: selectedPackage.name,
                    dateTime: dateTimeStr,
                    amount: selectedPackage.price,
                    email: formData.email
                });
                setStep(3);
            } else {
                throw new Error(data.error || 'Booking failed');
            }
        } catch (error: any) {
            console.error('Booking error:', error);
            toast.error(error.message || 'Connection failed. Please try again.', { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const resetBooking = () => {
        setStep(1);
        setSelectedDate(null);
        setSelectedTime(null);
        setFormData({ name: '', discord: '', email: '', notes: '' });
        setBookingResult(null);
        setAiSuggestion('');
    };

    const displayTime = availableTimes.find(t => t.original === selectedTime)?.display;
    const canProceedToDetails = selectedDate && selectedTime;
    const canSubmit = formData.name && formData.email && formData.discord;

    return (
        <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden relative">
            <BackgroundGrid />
            <Toaster position="top-center" toastOptions={{
                style: {
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: '#fff',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                },
            }} />

            {/* Navbar - Glass */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <a href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center group-hover:bg-white/20 transition-all">
                                <span className="font-bold text-sm">F</span>
                            </div>
                            <span className="font-semibold tracking-tight text-white/90">FPSOS</span>
                        </a>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs font-medium text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span>Systems Operational</span>
                    </div>
                </div>
            </nav>

            <main className="relative pt-24 pb-32 px-4 md:px-6 max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* STEP 1: SCHEDULE */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, filter: 'blur(10px)' }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="flex flex-col gap-8"
                        >
                            {/* Header */}
                            <div className="text-center space-y-2 mb-4">
                                <motion.h1
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60"
                                >
                                    Select Your Session.
                                </motion.h1>
                                <p className="text-lg text-white/40 font-medium">Choose a package and find a time that works for you.</p>
                            </div>

                            {/* Package Cards */}
                            <div className="grid md:grid-cols-3 gap-4 max-w-5xl mx-auto w-full">
                                {PACKAGES.map((pkg) => (
                                    <button
                                        key={pkg.id}
                                        onClick={() => setSelectedPackage(pkg)}
                                        className={`
                                            relative p-6 rounded-[24px] text-left transition-all duration-300 group
                                            ${selectedPackage.id === pkg.id
                                                ? 'bg-white/10 backdrop-blur-xl border-white/20 shadow-2xl scale-[1.02]'
                                                : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                                            }
                                            border
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div className={`p-3 rounded-2xl ${selectedPackage.id === pkg.id ? 'bg-white/20 text-white' : 'bg-white/5 text-white/60'}`}>
                                                <pkg.icon className="w-6 h-6" />
                                            </div>
                                            {pkg.popular && (
                                                <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase tracking-wider">
                                                    Popular
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{pkg.name}</h3>
                                        <p className="text-sm text-white/40 mb-4 h-10">{pkg.description}</p>

                                        <div className="flex items-end gap-1">
                                            <span className="text-xl font-semibold text-white">{pkg.price}</span>
                                        </div>

                                        {selectedPackage.id === pkg.id && (
                                            <motion.div
                                                layoutId="active-pkg-ring"
                                                className="absolute inset-0 rounded-[24px] border-2 border-cyan-500/30"
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Calendar & Time */}
                            <div className="grid lg:grid-cols-12 gap-6 max-w-6xl mx-auto w-full mt-8">
                                {/* Left Column: Calendar & Time (8 cols) */}
                                <div className="lg:col-span-8 space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* Calendar */}
                                        <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Calendar className="w-5 h-5 text-white/60" />
                                                <h3 className="font-semibold text-white">Date</h3>
                                            </div>
                                            <CalendarGrid
                                                availableSlots={availableSlots}
                                                selectedDate={selectedDate}
                                                onSelectDate={setSelectedDate}
                                                loadingAvailability={loadingAvailability}
                                            />
                                        </div>

                                        {/* Time Picker */}
                                        <div className="p-6 rounded-[24px] bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
                                            <div className="flex items-center gap-2 mb-6">
                                                <Clock className="w-5 h-5 text-white/60" />
                                                <h3 className="font-semibold text-white">Time</h3>
                                            </div>

                                            {!selectedDate ? (
                                                <div className="flex-1 flex flex-col items-center justify-center text-white/30 space-y-3 min-h-[200px]">
                                                    <Calendar className="w-12 h-12 opacity-20" />
                                                    <p className="text-sm font-medium">Available times will appear here</p>
                                                </div>
                                            ) : (
                                                <TimeSlotPicker
                                                    availableTimes={availableTimes}
                                                    selectedTime={selectedTime}
                                                    onSelectTime={setSelectedTime}
                                                    loading={loadingAvailability}
                                                    userTimezone={userTimezone}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Summary (4 cols) */}
                                <div className="lg:col-span-4">
                                    <BookingSummary
                                        selectedPackage={selectedPackage}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        displayTime={displayTime}
                                        userTimezone={userTimezone}
                                    />

                                    <motion.button
                                        whileHover={{ scale: canProceedToDetails ? 1.02 : 1 }}
                                        whileTap={{ scale: canProceedToDetails ? 0.98 : 1 }}
                                        onClick={() => canProceedToDetails && setStep(2)}
                                        disabled={!canProceedToDetails}
                                        className={`
                                            w-full mt-4 py-4 rounded-[20px] font-semibold text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-300
                                            ${canProceedToDetails
                                                ? 'bg-white text-black hover:bg-white/90 shadow-white/10'
                                                : 'bg-white/5 text-white/20 cursor-not-allowed'
                                            }
                                        `}
                                    >
                                        Continue <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: DETAILS */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
                            className="max-w-4xl mx-auto"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Form */}
                                <div className="space-y-6">
                                    <div className="p-8 rounded-[32px] bg-white/5 border border-white/10 backdrop-blur-md">
                                        <div className="flex items-center gap-3 mb-8">
                                            <div className="p-2.5 rounded-full bg-white/10">
                                                <Users className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">Your Details</h3>
                                                <p className="text-sm text-white/40">So we can contact you.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-5">
                                            <div className="group">
                                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                                    Full Name
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-black/40 focus:border-white/20 transition-all placeholder:text-white/20"
                                                    placeholder="Enter your name"
                                                />
                                            </div>

                                            <div className="group">
                                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                                    Discord Username
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.discord}
                                                    onChange={(e) => setFormData({ ...formData, discord: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-black/40 focus:border-white/20 transition-all placeholder:text-white/20"
                                                    placeholder="username#0000"
                                                />
                                            </div>

                                            <div className="group">
                                                <label className="block text-xs font-semibold text-white/40 uppercase tracking-widest mb-2 ml-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-black/40 focus:border-white/20 transition-all placeholder:text-white/20"
                                                    placeholder="name@example.com"
                                                />
                                            </div>

                                            <div className="group">
                                                <div className="flex items-center justify-between mb-2 ml-1">
                                                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">
                                                        System Goals
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={async () => {
                                                            if (!formData.notes && availableTimes.length === 0) return;
                                                            setIsAiLoading(true);
                                                            try {
                                                                const res = await fetch('/api/ai/suggest', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        packageName: selectedPackage.name,
                                                                        packageDuration: selectedPackage.duration,
                                                                        availableSlots: availableTimes.map(t => t.display),
                                                                        userNotes: formData.notes
                                                                    })
                                                                });
                                                                const data = await res.json();
                                                                if (data.suggestion) setAiSuggestion(data.suggestion);
                                                            } catch (e) { console.error('AI suggestion error:', e); }
                                                            finally { setIsAiLoading(false); }
                                                        }}
                                                        disabled={isAiLoading}
                                                        className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest disabled:opacity-50"
                                                    >
                                                        <Sparkles className="w-3 h-3" />
                                                        {isAiLoading ? 'Analyzing...' : 'Auto-Fill with AI'}
                                                    </button>
                                                </div>
                                                <textarea
                                                    value={formData.notes}
                                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                    rows={3}
                                                    className="w-full bg-black/20 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:bg-black/40 focus:border-white/20 transition-all placeholder:text-white/20 resize-none"
                                                    placeholder="What games do you play? What are your latency goals?"
                                                />
                                            </div>

                                            {/* AI Suggestion */}
                                            {aiSuggestion && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20"
                                                >
                                                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">
                                                        <Sparkles className="w-3 h-3" />
                                                        Optimization Strategy
                                                    </div>
                                                    <p className="text-sm text-cyan-100/80 leading-relaxed">{aiSuggestion}</p>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Summary + Actions */}
                                <div>
                                    <BookingSummary
                                        selectedPackage={selectedPackage}
                                        selectedDate={selectedDate}
                                        selectedTime={selectedTime}
                                        displayTime={displayTime}
                                        userTimezone={userTimezone}
                                    />

                                    <div className="space-y-3 mt-6">
                                        <motion.button
                                            whileHover={{ scale: canSubmit ? 1.02 : 1 }}
                                            whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                                            onClick={handleBooking}
                                            disabled={!canSubmit || loading}
                                            className={`
                                                w-full py-4 rounded-[20px] font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all duration-300
                                                ${canSubmit && !loading
                                                    ? 'bg-white text-black hover:bg-white/90 shadow-white/20'
                                                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                                                }
                                            `}
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin w-4 h-4 border-2 border-black/30 border-t-black rounded-full" />
                                                    Processing...
                                                </div>
                                            ) : (
                                                <>
                                                    Pay with PayPal <ArrowRight className="w-5 h-5" />
                                                </>
                                            )}
                                        </motion.button>

                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full py-4 rounded-[20px] font-medium text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2"
                                        >
                                            <ArrowLeft className="w-4 h-4" /> Go Back
                                        </button>
                                    </div>

                                    <div className="mt-6 flex items-center justify-center gap-2 text-white/20 text-xs">
                                        <Shield className="w-3 h-3" />
                                        <span>Secure 256-bit encrypted checkout</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: SUCCESS */}
                    {step === 3 && bookingResult && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: 'spring' }}
                        >
                            <ConfirmationSuccess
                                bookingId={bookingResult.id}
                                packageName={bookingResult.packageName}
                                dateTime={bookingResult.dateTime}
                                amount={bookingResult.amount}
                                email={bookingResult.email}
                                onReset={resetBooking}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={null}>
            <BookingContent />
        </Suspense>
    );
}
