'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Plus,
    Trash2,
    Calendar,
    ArrowLeft,
    Save,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import toast from 'react-hot-toast';

const HOURS = Array.from({ length: 12 }, (_, i) => {
    const hour = i + 12; // 12:00 to 23:00
    return {
        value: `${hour.toString().padStart(2, '0')}:00`,
        label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
    };
});

export default function AvailabilityPage() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [slots, setSlots] = useState<{ date: string; time: string; is_available: boolean }[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [selectedTimes, setSelectedTimes] = useState<Set<string>>(new Set());

    // Get calendar days for current month view
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

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

    // Fetch slots when month changes
    useEffect(() => {
        fetchSlots();
    }, [currentMonth]);

    // Update selected times when date changes
    useEffect(() => {
        if (selectedDate) {
            const dateStr = formatDate(selectedDate);
            const daySlots = slots.filter(s => s.date === dateStr && s.is_available);
            setSelectedTimes(new Set(daySlots.map(s => s.time)));
        }
    }, [selectedDate, slots]);

    const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchSlots = async () => {
        setLoading(true);
        try {
            const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
            const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

            const res = await fetch(`/api/availability?startDate=${formatDate(start)}&endDate=${formatDate(end)}`);
            if (res.ok) {
                const data = await res.json();
                setSlots(data);
            }
        } catch (err) {
            console.error('Failed to fetch slots:', err);
            toast.error('Failed to load availability');
        } finally {
            setLoading(false);
        }
    };

    const toggleTime = (time: string) => {
        setSelectedTimes(prev => {
            const next = new Set(prev);
            if (next.has(time)) {
                next.delete(time);
            } else {
                next.add(time);
            }
            return next;
        });
    };

    const saveAvailability = async () => {
        if (!selectedDate) return;

        setSaving(true);
        try {
            const dateStr = formatDate(selectedDate);
            const times = Array.from(selectedTimes);

            // Add the selected times
            const res = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'add',
                    date: dateStr,
                    times
                })
            });

            if (res.ok) {
                toast.success('Availability saved!');
                fetchSlots(); // Refresh
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to save');
            }
        } catch (err) {
            console.error('Save failed:', err);
            toast.error('Failed to save availability');
        } finally {
            setSaving(false);
        }
    };

    const clearDay = async () => {
        if (!selectedDate) return;

        setSaving(true);
        try {
            const dateStr = formatDate(selectedDate);
            const times = Array.from(selectedTimes);

            const res = await fetch('/api/availability', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'remove',
                    date: dateStr,
                    times
                })
            });

            if (res.ok) {
                setSelectedTimes(new Set());
                toast.success('Day cleared!');
                fetchSlots();
            }
        } catch (err) {
            toast.error('Failed to clear day');
        } finally {
            setSaving(false);
        }
    };

    const getSlotCount = (date: Date) => {
        const dateStr = formatDate(date);
        return slots.filter(s => s.date === dateStr && s.is_available).length;
    };

    const isPast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin/dashboard" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Availability Manager</h1>
                        <p className="text-sm text-white/50">Manage your booking slots</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Calendar */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        {/* Month Navigation */}
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1))}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h3 className="text-lg font-semibold">
                                {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h3>
                            <button
                                onClick={() => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1))}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-xs font-bold text-white/40 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((date, i) => {
                                const slotCount = getSlotCount(date);
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                                const past = isPast(date);

                                return (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: past ? 1 : 1.05 }}
                                        whileTap={{ scale: past ? 1 : 0.95 }}
                                        onClick={() => !past && setSelectedDate(date)}
                                        disabled={past}
                                        className={`
                                            relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all
                                            ${!isCurrentMonth ? 'opacity-30' : ''}
                                            ${past ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'}
                                            ${isSelected
                                                ? 'bg-cyan-500 text-black font-bold'
                                                : 'bg-white/5 hover:bg-white/10'}
                                        `}
                                    >
                                        <span>{date.getDate()}</span>
                                        {slotCount > 0 && !past && (
                                            <div className="absolute bottom-1 flex gap-0.5">
                                                <div className="w-1 h-1 rounded-full bg-green-400" />
                                                {slotCount >= 3 && <div className="w-1 h-1 rounded-full bg-green-400" />}
                                                {slotCount >= 5 && <div className="w-1 h-1 rounded-full bg-green-400" />}
                                            </div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {loading && (
                            <div className="flex justify-center mt-4">
                                <Loader2 className="w-5 h-5 animate-spin text-cyan-500" />
                            </div>
                        )}
                    </div>

                    {/* Time Slots Editor */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                        {selectedDate ? (
                            <>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-cyan-400" />
                                        <h3 className="text-lg font-semibold">
                                            {selectedDate.toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={clearDay}
                                            disabled={saving || selectedTimes.size === 0}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 disabled:opacity-50 text-sm"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            Clear
                                        </button>
                                        <button
                                            onClick={saveAvailability}
                                            disabled={saving}
                                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-semibold hover:bg-cyan-400 disabled:opacity-50 text-sm"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-white/50 mb-4">
                                    Click to toggle availability for each time slot:
                                </p>

                                <div className="grid grid-cols-3 gap-2">
                                    {HOURS.map(({ value, label }) => {
                                        const isActive = selectedTimes.has(value);
                                        return (
                                            <motion.button
                                                key={value}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => toggleTime(value)}
                                                className={`
                                                    py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2
                                                    ${isActive
                                                        ? 'bg-green-500/20 border-2 border-green-500 text-green-400'
                                                        : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10'}
                                                `}
                                            >
                                                <Clock className="w-4 h-4" />
                                                {label}
                                            </motion.button>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 pt-4 border-t border-white/10 text-sm text-white/40 text-center">
                                    {selectedTimes.size} slots selected
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-white/40">
                                <Calendar className="w-12 h-12 mb-4 opacity-30" />
                                <p className="font-medium">Select a date</p>
                                <p className="text-sm opacity-60">to manage time slots</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={async () => {
                                // Generate next 7 days with default hours
                                setSaving(true);
                                try {
                                    const dates = [];
                                    for (let i = 0; i < 7; i++) {
                                        const d = new Date();
                                        d.setDate(d.getDate() + i);
                                        dates.push(formatDate(d));
                                    }
                                    const times = HOURS.slice(1, 10).map(h => h.value); // 1 PM - 10 PM

                                    await fetch('/api/availability', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ action: 'bulk_add', dates, times })
                                    });

                                    toast.success('Added next 7 days!');
                                    fetchSlots();
                                } catch {
                                    toast.error('Failed to add slots');
                                } finally {
                                    setSaving(false);
                                }
                            }}
                            disabled={saving}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-black font-semibold hover:opacity-90 disabled:opacity-50"
                        >
                            <Plus className="w-4 h-4" />
                            Add Next 7 Days (1-10 PM)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
