'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BackgroundGrid from '@/components/BackgroundGrid';
import { Lock, User, Terminal, Cpu, ShieldCheck } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                toast.success('ACCESS GRANTED', {
                    style: {
                        background: '#0a0a0a',
                        color: '#4ade80',
                        border: '1px solid #4ade80',
                        fontFamily: 'monospace'
                    },
                    icon: '🔓'
                });
                setTimeout(() => router.push('/admin/dashboard'), 1000);
            } else {
                toast.error('ACCESS DENIED', {
                    style: {
                        background: '#0a0a0a',
                        color: '#ef4444',
                        border: '1px solid #ef4444',
                        fontFamily: 'monospace'
                    },
                    icon: '🛑'
                });
                setIsLoading(false);
            }
        } catch (err) {
            setIsLoading(false);
            toast.error('SYSTEM ERROR');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden font-mono selection:bg-cyan-500/30">
            <BackgroundGrid />
            <Toaster position="top-center" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative z-10 w-full max-w-md p-1"
            >
                {/* Glass Container */}
                <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_-12px_rgba(6,182,212,0.5)] overflow-hidden group">

                    {/* Neon Border Glow */}
                    <div className="absolute inset-0 border border-white/5 rounded-2xl pointer-events-none" />
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Header */}
                    <div className="text-center mb-10 relative">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-950/30 border border-cyan-500/30 mb-4 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                        >
                            <Cpu className="w-8 h-8 text-cyan-400" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-white tracking-widest mb-2 font-display">
                            FPSOS<span className="text-cyan-400">.ADMIN</span>
                        </h1>
                        <p className="text-white/40 text-xs tracking-[0.2em] uppercase">Secure Access Terminal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        {/* Username Input */}
                        <div className="space-y-2 group/input">
                            <label className="text-xs uppercase tracking-wider text-cyan-500/70 font-bold ml-1 flex items-center gap-2">
                                <User className="w-3 h-3" /> Agent ID
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all duration-300 font-mono"
                                    placeholder="ENTER ID..."
                                />
                                <div className="absolute inset-0 rounded-lg bg-cyan-500/5 opacity-0 group-hover/input:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2 group/input">
                            <label className="text-xs uppercase tracking-wider text-purple-500/70 font-bold ml-1 flex items-center gap-2">
                                <Lock className="w-3 h-3" /> Access Key
                            </label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition-all duration-300 font-mono"
                                    placeholder="••••••••••••"
                                />
                                <div className="absolute inset-0 rounded-lg bg-purple-500/5 opacity-0 group-hover/input:opacity-100 pointer-events-none transition-opacity" />
                            </div>
                        </div>

                        {/* Login Button */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className={`w-full relative group overflow-hidden rounded-lg p-4 transition-all duration-300 ${isLoading ? 'cursor-wait opacity-80' : 'cursor-pointer'
                                }`}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />

                            <div className="relative flex items-center justify-center gap-2 text-white font-bold tracking-widest text-sm uppercase">
                                {isLoading ? (
                                    <>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                        />
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Terminal className="w-4 h-4" />
                                        <span>Initialize Session</span>
                                    </>
                                )}
                            </div>
                        </motion.button>
                    </form>

                    {/* Footer Text */}
                    <div className="mt-8 text-center">
                        <p className="text-[10px] text-white/20 uppercase tracking-widest flex items-center justify-center gap-2">
                            <ShieldCheck className="w-3 h-3" />
                            Encrypted Connection • V.2.0.4
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
