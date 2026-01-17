'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    CreditCard,
    Calendar,
    Users,
    Settings,
    LogOut,
    CheckCircle,
    XCircle,
    Clock,
    Laptop
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('bookings');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings');
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                }
            } catch (error) {
                console.error('Failed to fetch bookings');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/admin/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const updateBookingStatus = async (bookingId: number, newStatus: string, notes?: string) => {
        try {
            const res = await fetch(`/api/bookings/${bookingId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus, admin_notes: notes })
            });

            if (res.ok) {
                // Refresh bookings list
                const updatedRes = await fetch('/api/bookings');
                if (updatedRes.ok) {
                    const data = await updatedRes.json();
                    setBookings(data);
                }
                setShowBookingModal(false);
            }
        } catch (error) {
            console.error('Failed to update booking:', error);
        }
    };

    const handleBookingClick = (booking: any) => {
        setSelectedBooking(booking);
        setShowBookingModal(true);
    };

    // Calculate dynamic stats
    const totalRevenue = bookings.reduce((acc: number, curr: any) => acc + parseInt(curr.amount.replace(/[^0-9]/g, '') || 0), 0);

    const stats = [
        { label: 'Total Revenue', value: `AED ${totalRevenue}`, change: 'Live Update', icon: CreditCard, color: 'text-green-400' },
        { label: 'Total Bookings', value: bookings.length.toString(), change: 'Lifetime', icon: Calendar, color: 'text-cyan-400' },
        { label: 'Pending Action', value: bookings.filter((b: any) => b.status === 'pending').length.toString(), change: 'Requires Attention', icon: Clock, color: 'text-yellow-400' },
        { label: 'System Health', value: '100%', change: 'Optimal', icon: CheckCircle, color: 'text-purple-400' },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-cyan-500/30 flex">
            {/* Sidebar */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-72 bg-[#09090b] border-r border-[#27272a] p-6 flex flex-col fixed h-full z-20 shadow-2xl"
            >
                <div className="mb-12 flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
                        <span className="font-black text-black text-xl">A</span>
                    </div>
                    <div>
                        <span className="block font-bold tracking-wider text-white text-lg font-space leading-none">FPSOS</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold">Workspace</span>
                    </div>
                </div>

                <nav className="flex-1 space-y-1">
                    {['bookings', 'clients', 'finance', 'settings'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`w-full text-left px-4 py-3.5 rounded-lg flex items-center gap-3.5 transition-all text-sm font-medium ${activeTab === tab
                                ? 'bg-zinc-900/80 text-white shadow-inner font-semibold border-l-2 border-cyan-500'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                                }`}
                        >
                            <div className={`${activeTab === tab ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-white'}`}>
                                {tab === 'bookings' && <Calendar className="w-4 h-4" />}
                                {tab === 'clients' && <Users className="w-4 h-4" />}
                                {tab === 'finance' && <CreditCard className="w-4 h-4" />}
                                {tab === 'settings' && <Settings className="w-4 h-4" />}
                            </div>
                            <span className="capitalize">{tab}</span>
                        </button>
                    ))}
                    <button
                        onClick={() => setActiveTab('automation')}
                        className={`w-full text-left px-4 py-3.5 rounded-lg flex items-center gap-3.5 transition-all text-sm font-medium ${activeTab === 'automation'
                            ? 'bg-zinc-900/80 text-white shadow-inner font-semibold border-l-2 border-cyan-500'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                            }`}
                    >
                        <div className={`${activeTab === 'automation' ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-white'}`}>
                            <Laptop className="w-4 h-4" />
                        </div>
                        <span className="capitalize">Automation</span>
                    </button>
                </nav>

                <div className="mt-auto pt-6 border-t border-zinc-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 text-zinc-500 hover:text-red-400 px-4 py-3 transition-colors text-sm font-medium w-full rounded-lg hover:bg-red-500/5"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 ml-64 p-8">
                {/* Top Header */}
                <header className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Dashboard</h1>
                        <p className="text-white/40 text-sm mt-1">Welcome back, Commander.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-xs flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            System Online
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-12">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg bg-white/5 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <span className="text-xs font-mono text-white/30">{stat.change}</span>
                            </div>
                            <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                            <p className="text-sm text-white/40">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Automation Tab Content */}
                {activeTab === 'automation' ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-6"
                    >
                        <BotControlPanel />
                    </motion.div>
                ) : (
                    /* Default Bookings Content */
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="font-bold text-lg">Recent Bookings</h2>
                            <button className="text-sm text-cyan-400 hover:text-cyan-300">View All</button>
                        </div>

                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-white/40 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Package</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {bookings.map((booking: any) => (
                                    <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="px-6 py-4 font-medium flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 flex items-center justify-center text-xs">
                                                {booking.client_name.charAt(0)}
                                            </div>
                                            {booking.client_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/70">
                                            <div className="flex items-center gap-2">
                                                <Laptop className="w-3 h-3 text-cyan-500" />
                                                {booking.package_name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-white/60">
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {booking.date_time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-green-400">{booking.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                                ${booking.status === 'confirmed' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : ''}
                                                ${booking.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : ''}
                                                ${booking.status === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : ''}
                                            `}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-cyan-400' :
                                                    booking.status === 'pending' ? 'bg-yellow-400' : 'bg-green-400'
                                                    }`} />
                                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleBookingClick(booking)}
                                                className="text-white/40 hover:text-cyan-400 transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </motion.div>
                )}
            </div>

            {/* Booking Management Modal */}
            {showBookingModal && selectedBooking && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-[#09090b] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        {/* Modal Header */}
                        <div className="p-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-[#09090b] z-10">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-1">Booking Details #{selectedBooking.id}</h2>
                                <p className="text-sm text-white/40">{selectedBooking.client_name}</p>
                            </div>
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Client Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Client Name</p>
                                    <p className="text-white font-medium">{selectedBooking.client_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Discord ID</p>
                                    <p className="text-white font-medium">{selectedBooking.discord_id}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Email</p>
                                    <p className="text-white font-medium">{selectedBooking.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Package</p>
                                    <p className="text-white font-medium">{selectedBooking.package_name}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Date & Time</p>
                                    <p className="text-white font-medium">{selectedBooking.date_time}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Amount</p>
                                    <p className="text-green-400 font-mono font-bold">{selectedBooking.amount}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Payment Status</p>
                                    <p className={`font-medium ${selectedBooking.payment_status === 'paid' ? 'text-green-400' : 'text-yellow-400'}`}>
                                        {selectedBooking.payment_status || 'unpaid'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-white/40 mb-1">Created</p>
                                    <p className="text-white/60 text-sm">{new Date(selectedBooking.created_at).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Admin Notes */}
                            {selectedBooking.admin_notes && (
                                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                                    <p className="text-xs uppercase tracking-wider text-yellow-400 mb-2">Admin Notes</p>
                                    <p className="text-white/80 text-sm">{selectedBooking.admin_notes}</p>
                                </div>
                            )}

                            {/* Quick Actions */}
                            <div>
                                <p className="text-xs uppercase tracking-wider text-white/40 mb-3">Quick Actions</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => updateBookingStatus(selectedBooking.id, 'confirmed')}
                                        disabled={selectedBooking.status === 'confirmed'}
                                        className="px-4 py-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        ✓ Confirm Booking
                                    </button>
                                    <button
                                        onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                                        disabled={selectedBooking.status === 'completed'}
                                        className="px-4 py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        ✓ Mark Completed
                                    </button>
                                    <button
                                        onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled', 'Cancelled by admin')}
                                        disabled={selectedBooking.status === 'cancelled'}
                                        className="px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                                    >
                                        ✕ Cancel Booking
                                    </button>
                                    <button
                                        onClick={() => {
                                            const portalUrl = `https://fpsos.gg/booking/${selectedBooking.booking_token}`;
                                            window.open(portalUrl, '_blank');
                                        }}
                                        className="px-4 py-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors font-medium"
                                    >
                                        → Customer Portal
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

function BotControlPanel() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState('');
    const [msg, setMsg] = useState('');

    const checkStatus = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/bot/control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'status' })
            });
            const data = await res.json();
            setStatus(data);
        } catch (e) {
            setStatus({ error: 'Bot Unreachable' });
        } finally {
            setLoading(false);
        }
    };

    const triggerDiagnostic = async () => {
        if (!userId) return;
        setLoading(true);
        try {
            const res = await fetch('/api/bot/control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'trigger_diagnostic', user_id: userId })
            });
            const data = await res.json();
            if (data.status === 'sent') {
                setMsg(`✅ Sent to ${data.user}`);
            } else {
                setMsg(`❌ Error: ${data.error || 'Unknown'}`);
            }
        } catch (e) {
            setMsg('❌ Failed to connect');
        } finally {
            setLoading(false);
            setTimeout(() => setMsg(''), 3000);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Laptop className="w-5 h-5 text-purple-400" />
                        Bot Status
                    </h3>
                    <button onClick={checkStatus} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">
                        Refresh
                    </button>
                </div>

                {status?.error ? (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 flex items-center gap-2">
                        <XCircle className="w-5 h-5" />
                        Bot Offline or Unreachable
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-black/40 rounded-lg">
                            <span className="text-white/60">Connection</span>
                            <span className="text-green-400 font-bold flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-black/40 rounded-lg">
                                <span className="text-xs text-white/40 block mb-1">Latency</span>
                                <span className="font-mono text-xl">{status?.latency || '-'}ms</span>
                            </div>
                            <div className="p-3 bg-black/40 rounded-lg">
                                <span className="text-xs text-white/40 block mb-1">Servers</span>
                                <span className="font-mono text-xl">{status?.guilds || '-'}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions Card */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <Settings className="w-5 h-5 text-cyan-400" />
                    Quick Actions
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs uppercase text-white/40 font-bold mb-2 block">Trigger Diagnostic Request</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Discord User ID"
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
                                className="bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white flex-1 focus:border-cyan-500 outline-none"
                            />
                            <button
                                onClick={triggerDiagnostic}
                                disabled={loading || !userId}
                                className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-bold transition-colors"
                            >
                                {loading ? '...' : 'Send'}
                            </button>
                        </div>
                        {msg && <p className="text-sm mt-2 font-medium animate-fade-in-up">{msg}</p>}
                    </div>

                    <div className="pt-4 border-t border-white/5">
                        <p className="text-sm text-white/40">
                            More controls coming soon (Sync Roles, Broadcast, etc.)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
