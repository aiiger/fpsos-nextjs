'use client';

import { motion } from 'framer-motion';
import { Check, Clock, CreditCard, Zap, Server, Cpu, Shield } from 'lucide-react';

interface Package {
    id: string;
    name: string;
    price: string;
    duration: string;
    icon: any;
}

interface BookingSummaryProps {
    selectedPackage: Package;
    selectedDate: Date | null;
    selectedTime: string | null;
    displayTime?: string;
    userTimezone?: string;
}

const ICON_MAP: Record<string, any> = {
    'quick': Zap,
    'full': Server,
    'extreme': Cpu
};

export default function BookingSummary({
    selectedPackage,
    selectedDate,
    selectedTime,
    displayTime,
    userTimezone
}: BookingSummaryProps) {
    const Icon = ICON_MAP[selectedPackage.id] || Zap;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="sticky top-32 space-y-4"
        >
            {/* Main Summary Card - Apple Wallet Style */}
            <div className="relative overflow-hidden rounded-[24px] p-6 bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 font-semibold mb-0.5">Selected Package</div>
                        <div className="font-bold text-lg text-white tracking-tight">{selectedPackage.name}</div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            Duration
                        </div>
                        <div className="text-white font-semibold">{selectedPackage.duration}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-black/20 border border-white/5">
                        <div className="flex items-center gap-2 text-white/40 text-xs font-medium mb-1.5">
                            <CreditCard className="w-3.5 h-3.5" />
                            Price
                        </div>
                        <div className="text-white font-semibold">{selectedPackage.price}</div>
                    </div>
                </div>

                {/* Date & Time Strip */}
                <div className="relative p-5 rounded-2xl bg-gradient-to-r from-blue-600/20 to-cyan-400/20 border border-blue-500/20">
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-blue-200/60 uppercase tracking-wide">Scheduled For</span>
                        {userTimezone && <span className="text-[10px] text-blue-200/40">{userTimezone}</span>}
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-white font-bold text-lg">
                                {selectedDate
                                    ? selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                                    : <span className="text-white/20">Select Date</span>
                                }
                            </div>
                            <div className="text-blue-100/80 text-sm font-medium">
                                {displayTime || selectedTime || <span className="text-white/20">--:--</span>}
                            </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-blue-400" />
                        </div>
                    </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-white/30 uppercase tracking-widest font-medium">
                    <Shield className="w-3 h-3" />
                    <span>Secure Booking via PayPal</span>
                </div>
            </div>
        </motion.div>
    );
}
