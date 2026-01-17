'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, Command } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            if (res.ok) {
                toast.success('Welcome back', {
                    description: 'Authenticating secure session...',
                    duration: 1500
                });
                setTimeout(() => router.push('/admin1988/dashboard'), 800);
            } else {
                toast.error('Access denied', { description: 'Incorrect credentials.' });
                setLoading(false);
            }
        } catch (error) {
            toast.error('Connection error', { description: 'Please try again.' });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#000000] flex items-center justify-center p-6 relative overflow-hidden font-sans">
            <Toaster theme="dark" position="top-center" />

            {/* Subtle Ambient Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[120px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-sm relative z-10"
            >
                {/* Apple-style Glass Card */}
                <div className="backdrop-blur-xl bg-[#1c1c1e]/60 border border-white/10 rounded-[28px] p-8 shadow-2xl shadow-black/50">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 rounded-[22px] bg-gradient-to-br from-[#2c2c2e] to-[#1c1c1e] border border-white/10 flex items-center justify-center mb-6 shadow-lg">
                            <Command className="w-7 h-7 text-white/80" />
                        </div>
                        <h1 className="text-2xl font-semibold text-white tracking-tight">Admin Portal</h1>
                        <p className="text-white/40 text-[15px] mt-2 font-medium">Enter your credentials to continue</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 transition-colors group-focus-within:text-white/60" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Passcode"
                                className="w-full bg-[#2c2c2e]/50 border border-transparent focus:bg-[#2c2c2e] focus:border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none transition-all duration-300 font-medium text-[15px]"
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full py-4 rounded-2xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all duration-300
                                ${loading
                                    ? 'bg-[#2c2c2e] text-white/30 cursor-wait'
                                    : 'bg-white text-black hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98]'
                                }
                            `}
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight className="w-4 h-4 ml-1 opacity-60" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-[13px] text-white/20 font-medium">
                        FPSOS Secure Environment &copy; {new Date().getFullYear()}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
