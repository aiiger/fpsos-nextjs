'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarGridProps {
    availableSlots: { date: string; time: string; is_available: boolean }[];
    selectedDate: Date | null;
    onSelectDate: (date: Date) => void;
    loadingAvailability?: boolean;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarGrid({
    availableSlots,
    selectedDate,
    onSelectDate,
    loadingAvailability = false
}: CalendarGridProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Get all days in the current month view
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        // First day of the month
        const firstDay = new Date(year, month, 1);
        // Last day of the month
        const lastDay = new Date(year, month + 1, 0);

        // Start from the Sunday before the first day
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        // End on the Saturday after the last day
        const endDate = new Date(lastDay);
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

        const days: Date[] = [];
        const current = new Date(startDate);

        while (current <= endDate) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    }, [currentMonth]);

    // Check if a date has available slots
    const getDateAvailability = (date: Date) => {
        // Format date as YYYY-MM-DD in local timezone
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;

        const slots = availableSlots.filter(s => s.date === dateStr && s.is_available);
        return slots.length;
    };

    // Check if date is in the past
    const isPastDate = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    // Check if date is in current month
    const isCurrentMonth = (date: Date) => {
        return date.getMonth() === currentMonth.getMonth();
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentMonth(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
            return newDate;
        });
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    return (
        <div className="w-full">
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/40 transition-all"
                >
                    <ChevronLeft className="w-5 h-5 text-white/60" />
                </button>

                <motion.h3
                    key={currentMonth.toISOString()}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl font-bold text-white"
                >
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </motion.h3>

                <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/40 transition-all"
                >
                    <ChevronRight className="w-5 h-5 text-white/60" />
                </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_OF_WEEK.map(day => (
                    <div key={day} className="text-center text-xs font-bold text-white/40 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
                <AnimatePresence mode="wait">
                    {calendarDays.map((date, index) => {
                        const availability = getDateAvailability(date);
                        const isPast = isPastDate(date);
                        const inMonth = isCurrentMonth(date);
                        const isSelected = selectedDate?.toDateString() === date.toDateString();
                        const hasSlots = availability > 0;
                        const today = isToday(date);

                        return (
                            <motion.button
                                key={date.toISOString()}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.01 }}
                                onClick={() => !isPast && hasSlots && onSelectDate(date)}
                                disabled={isPast || !hasSlots}
                                className={`
                                    relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all duration-200
                                    ${!inMonth ? 'opacity-30' : ''}
                                    ${isPast ? 'opacity-30 cursor-not-allowed' : ''}
                                    ${isSelected
                                        ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-black shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-105 z-10'
                                        : hasSlots && !isPast
                                            ? 'bg-white/5 hover:bg-white/10 hover:border-cyan-500/40 border border-white/10 cursor-pointer'
                                            : 'bg-white/[0.02] border border-white/5 cursor-not-allowed'
                                    }
                                    ${today && !isSelected ? 'ring-2 ring-cyan-500/50' : ''}
                                `}
                            >
                                <span className={`text-sm font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>
                                    {date.getDate()}
                                </span>

                                {/* Availability Indicator */}
                                {hasSlots && !isPast && !isSelected && (
                                    <div className="absolute bottom-1.5 flex gap-0.5">
                                        {availability >= 1 && <div className="w-1 h-1 rounded-full bg-green-400" />}
                                        {availability >= 3 && <div className="w-1 h-1 rounded-full bg-green-400" />}
                                        {availability >= 5 && <div className="w-1 h-1 rounded-full bg-green-400" />}
                                    </div>
                                )}

                                {/* Today Indicator */}
                                {today && !isSelected && (
                                    <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                )}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Loading Overlay */}
            {loadingAvailability && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-2xl">
                    <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
                </div>
            )}

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-6 text-xs text-white/40">
                <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    </div>
                    <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
                    <span>Unavailable</span>
                </div>
            </div>
        </div>
    );
}
