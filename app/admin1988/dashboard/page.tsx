'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    CalendarDays,
    Users,
    Settings,
    LogOut,
    Activity,
    ShieldCheck,
    Bot,
    Server,
    Zap,
    Search,
    ChevronRight,
    TrendingUp,
    CreditCard,
    MoreHorizontal,
    Bell,
    Command,
    Terminal
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'sonner';
import BotStatusWidget from '@/components/admin/BotStatusWidget';

export default function ApplePremiumDashboard() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('overview');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings');
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);
                }
            } catch (error) {
                console.error('Data fetch error');
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin1988/login');
    };

    const handleBotAction = async (action: string) => {
        try {
            const res = await fetch('/api/bot/control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Action Completed', { description: `Successfully executed: ${action}` });
            } else {
                toast.error('Action Failed', { description: data.error });
            }
        } catch (e) {
            toast.error('Connection Error', { description: 'Bot service unavailable.' });
        }
    };

    const totalRevenue = bookings.reduce((acc, curr: any) => acc + parseInt(curr.amount?.replace(/[^0-9]/g, '') || '0'), 0);

    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'bookings', icon: CalendarDays, label: 'Sessions' },
        { id: 'clients', icon: Users, label: 'Clients' },
        { id: 'automation', icon: Bot, label: 'Automation' },
        { id: 'settings', icon: Settings, label: 'Settings' }
    ];

    return (
        <div className="flex h-screen bg-[#000000] text-white font-sans selection:bg-blue-500/30 overflow-hidden">
            <Toaster theme="dark" position="bottom-right" />

            {/* Sidebar (Apple Settings Style) */}
            <motion.aside
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="w-64 bg-[#1c1c1e]/50 backdrop-blur-xl border-r border-white/5 flex flex-col pt-8 pb-6 px-4"
            >
                <div className="flex items-center gap-3 px-4 mb-10">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg shadow-white/10">
                        <Command className="w-4 h-4 text-black" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-semibold tracking-tight text-white">Admin Portal</h2>
                        <p className="text-[11px] font-medium text-white/40">FPSOS System</p>
                    </div>
                </div>

                <nav className="space-y-1 flex-1">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-all duration-200 text-[14px] font-medium ${activeTab === item.id
                                ? 'bg-white/10 text-white shadow-inner'
                                : 'text-white/50 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            <item.icon className={`w-[18px] h-[18px] ${activeTab === item.id ? 'text-white' : 'text-white/50'}`} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 text-[14px] font-medium text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-[18px] h-[18px]" />
                    Sign Out
                </button>
            </motion.aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#000000]">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-[#1c1c1e]/30 backdrop-blur-md sticky top-0 z-20">
                    <h1 className="text-xl font-semibold capitalize tracking-tight">{activeTab}</h1>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-[#1c1c1e] border border-white/5 rounded-full px-3 py-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                            <span className="text-[12px] font-medium text-white/60">System Operational</span>
                        </div>
                        <button className="w-8 h-8 rounded-full bg-[#1c1c1e] border border-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 transition-colors">
                            <Bell className="w-4 h-4" />
                        </button>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/20"></div>
                    </div>
                </header>

                {/* Content Viewport */}
                <div className="flex-1 overflow-y-auto p-8">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-8"
                            >
                                {/* KPI Cards (Apple Health Style) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                                    {[
                                        { title: 'Total Revenue', value: `AED ${totalRevenue.toLocaleString()}`, trend: '+12.5%', icon: CreditCard, color: 'bg-blue-500' },
                                        { title: 'Active Sessions', value: bookings.length.toString(), trend: '+4 today', icon: CalendarDays, color: 'bg-purple-500' },
                                        { title: 'Bot Latency', value: '42ms', trend: 'Excellent', icon: Zap, color: 'bg-orange-500' },
                                        { title: 'Security Status', value: 'Secure', trend: 'No Threats', icon: ShieldCheck, color: 'bg-green-500' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5 shadow-xl shadow-black/20 hover:scale-[1.01] transition-transform duration-300">
                                            <div className="flex justify-between items-start mb-8">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-8 h-8 rounded-full ${stat.color} flex items-center justify-center shadow-lg`}>
                                                        <stat.icon className="w-4 h-4 text-white" />
                                                    </div>
                                                    <span className="text-[13px] font-medium text-white/60">{stat.title}</span>
                                                </div>
                                                <MoreHorizontal className="w-5 h-5 text-white/20 cursor-pointer hover:text-white/40" />
                                            </div>
                                            <div>
                                                <h3 className="text-3xl font-bold tracking-tight mb-1">{stat.value}</h3>
                                                <div className="flex items-center gap-1.5">
                                                    <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                                    <span className="text-[13px] font-medium text-green-500">{stat.trend}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Chart Area */}
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                                    <div className="xl:col-span-2 bg-[#1c1c1e] rounded-[24px] p-8 border border-white/5 min-h-[400px]">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-semibold tracking-tight">Revenue Analytics</h3>
                                            <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white/70 outline-none hover:bg-white/10 transition-colors">
                                                <option>Last 30 Days</option>
                                                <option>Last 7 Days</option>
                                            </select>
                                        </div>
                                        <div className="h-64 flex items-end justify-between gap-2">
                                            {[40, 70, 45, 90, 65, 80, 55, 95, 75, 50, 85, 60, 70, 85, 95, 60].map((h, i) => (
                                                <div
                                                    key={i}
                                                    className="w-full bg-[#2c2c2e] rounded-t-lg hover:bg-blue-500 transition-colors duration-300 relative group"
                                                    style={{ height: `${h}%` }}
                                                >
                                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                        {h}%
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-[#1c1c1e] rounded-[24px] p-8 border border-white/5">
                                        <h3 className="text-lg font-semibold tracking-tight mb-6">System Health</h3>
                                        <div className="space-y-6">
                                            {[
                                                { label: 'Neural Uplink', value: 98, color: 'bg-blue-500' },
                                                { label: 'Database I/O', value: 45, color: 'bg-purple-500' },
                                                { label: 'API Latency', value: 12, color: 'bg-green-500' },
                                                { label: 'Storage', value: 67, color: 'bg-orange-500' }
                                            ].map((item, i) => (
                                                <div key={i}>
                                                    <div className="flex justify-between text-[13px] font-medium mb-2">
                                                        <span className="text-white/60">{item.label}</span>
                                                        <span>{item.value}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-[#2c2c2e] rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${item.value}%` }}
                                                            transition={{ duration: 1, delay: 0.2 }}
                                                            className={`h-full rounded-full ${item.color}`}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'bookings' && (
                            <motion.div
                                key="bookings"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#1c1c1e] rounded-[24px] overflow-hidden border border-white/5 shadow-xl"
                            >
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                    <div className="relative w-72">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                                        <input
                                            type="text"
                                            placeholder="Search sessions..."
                                            className="w-full bg-[#2c2c2e] border-none rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                                        />
                                    </div>
                                    <button className="bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-white/90 transition-colors">
                                        Export CSV
                                    </button>
                                </div>
                                <table className="w-full">
                                    <thead className="bg-[#2c2c2e]/50">
                                        <tr className="text-left text-[12px] font-semibold text-white/40 uppercase tracking-wider">
                                            <th className="px-6 py-4">Client</th>
                                            <th className="px-6 py-4">Session Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {bookings.map((booking: any) => (
                                            <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                                                            {booking.client_name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="text-[14px] font-medium text-white">{booking.client_name}</div>
                                                            <div className="text-[12px] text-white/40">{booking.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-[14px] text-white/70">{booking.date_time}</td>
                                                <td className="px-6 py-4 text-[14px] font-medium text-white">{booking.amount}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border ${booking.status === 'confirmed'
                                                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button className="text-white/30 group-hover:text-blue-400 transition-colors">
                                                        <ChevronRight className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </motion.div>
                        )}

                        {activeTab === 'automation' && (
                            <motion.div
                                key="automation"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                            >
                                {/* Left Column: Status & Controls */}
                                <div className="space-y-6">
                                    <BotStatusWidget />

                                    <div className="bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5">
                                        <h3 className="text-[15px] font-semibold text-white mb-4 flex items-center gap-2">
                                            <Bot className="w-4 h-4 text-blue-400" /> Actions
                                        </h3>
                                        <div className="space-y-3">
                                            <button
                                                onClick={() => handleBotAction('trigger_diagnostic')}
                                                className="w-full flex items-center justify-between p-3 bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-xl transition-all group"
                                            >
                                                <span className="text-[13px] font-medium text-white/80">Run Diagnostics</span>
                                                <Activity className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                                            </button>

                                            <button
                                                onClick={() => handleBotAction('status')}
                                                className="w-full flex items-center justify-between p-3 bg-[#2c2c2e] hover:bg-[#3a3a3c] rounded-xl transition-all group"
                                            >
                                                <span className="text-[13px] font-medium text-white/80">Refresh Status</span>
                                                <Server className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform" />
                                            </button>

                                            <button className="w-full flex items-center justify-between p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/10 rounded-xl transition-all group opacity-60 cursor-not-allowed">
                                                <span className="text-[13px] font-medium text-red-400">Kill Process</span>
                                                <Zap className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column: Logs (Spans 2 cols) */}
                                <div className="lg:col-span-2 bg-[#1c1c1e] rounded-[24px] p-8 border border-white/5 flex flex-col h-[500px]">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-[18px] bg-gray-700 flex items-center justify-center shadow-lg">
                                            <Terminal className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold tracking-tight">System Logs</h3>
                                            <p className="text-[13px] text-white/40">Real-time event stream</p>
                                        </div>
                                    </div>

                                    <div className="flex-1 bg-[#000000] rounded-[18px] p-4 font-mono text-[12px] text-white/60 overflow-y-auto space-y-2 border border-white/5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                        <div className="flex gap-3">
                                            <span className="text-blue-400">[06:04:12]</span>
                                            <span>System initialized successfully</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-white/40">[06:05:01]</span>
                                            <span>Heartbeat received: 42ms latency</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-yellow-400">[06:06:40]</span>
                                            <span>Traffic surge detected on port 3000</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <span className="text-green-400">[06:10:00]</span>
                                            <span>Backup completed. Index verified.</span>
                                        </div>
                                        <div className="flex gap-3 animate-pulse">
                                            <span className="text-white/40">...</span>
                                            <span>Listening for events</span>
                                        </div>
                                    </div>

                                    <div className="mt-4 relative">
                                        <input
                                            type="text"
                                            placeholder="Execute command..."
                                            className="w-full bg-[#2c2c2e] border-none rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-white/30 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-white/10 rounded text-[10px] text-white/40 font-bold">
                                            CMD
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'clients' && (
                            <motion.div
                                key="clients"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                            >
                                {bookings.map((booking: any, i: number) => (
                                    <div key={i} className="bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5 shadow-lg group hover:bg-[#252527] transition-colors">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-xl font-bold text-white shadow-inner">
                                                {booking.client_name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-[16px] font-semibold text-white">{booking.client_name}</h4>
                                                <p className="text-[13px] text-white/40">{booking.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[13px] font-medium text-white transition-colors">View Profile</button>
                                            <button className="px-3 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400">
                                                <Users className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center h-64 bg-[#1c1c1e] rounded-[24px] border border-white/5 border-dashed">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Settings className="w-8 h-8 text-white/20" />
                                    </div>
                                    <h3 className="text-white/40 font-medium">Settings module is currently offline</h3>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
