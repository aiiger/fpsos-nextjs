'use client';

import { motion } from 'framer-motion';
import { Clock, Loader2 } from 'lucide-react';

interface TimeSlot {
    display: string;
    original: string;
    originalDate: string;
}

interface TimeSlotPickerProps {
    availableTimes: TimeSlot[];
    selectedTime: string | null;
    onSelectTime: (time: string) => void;
    loading?: boolean;
    userTimezone?: string;
}

export default function TimeSlotPicker({
    availableTimes,
    selectedTime,
    onSelectTime,
    loading = false,
    userTimezone
}: TimeSlotPickerProps) {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-white/40">
                <Loader2 className="w-6 h-6 animate-spin text-white/60 mb-3" />
                <p className="text-sm font-medium">Checking schedule...</p>
            </div>
        );
    }

    if (availableTimes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-white/40 bg-white/5 rounded-2xl border border-white/5">
                <Clock className="w-8 h-8 mb-3 opacity-30" />
                <p className="text-sm font-medium">No slots available</p>
                <p className="text-xs mt-1 opacity-60">Try another date</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Timezone Display */}
            {userTimezone && (
                <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Available Times</span>
                    <span className="text-xs text-white/40">
                        Top <span className="text-white/80">{userTimezone}</span>
                    </span>
                </div>
            )}

            {/* Time Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {availableTimes.map((slot, index) => {
                    const isSelected = selectedTime === slot.original;

                    return (
                        <motion.button
                            key={`${slot.originalDate}-${slot.original}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                delay: index * 0.02,
                                type: "spring",
                                stiffness: 400,
                                damping: 25
                            }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => onSelectTime(slot.original)}
                            className={`
                                relative py-3.5 px-3 rounded-xl font-medium text-sm transition-all duration-300
                                ${isSelected
                                    ? 'text-white shadow-lg shadow-cyan-500/20'
                                    : 'bg-white/5 hover:bg-white/10 text-white/80'
                                }
                            `}
                        >
                            {/* Selection Background */}
                            {isSelected && (
                                <motion.div
                                    layoutId="time-selection-bg"
                                    className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            {/* Selection Ring (Subtle) */}
                            {isSelected && (
                                <motion.div
                                    layoutId="time-selection-ring"
                                    className="absolute -inset-[1px] rounded-xl border border-white/20"
                                    initial={false}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}

                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {slot.display}
                            </span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
