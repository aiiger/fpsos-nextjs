'use client';

import { motion } from 'framer-motion';
import { Check, Calendar, MessageCircle, Download, ExternalLink, PartyPopper } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConfirmationSuccessProps {
    bookingId: string;
    packageName: string;
    dateTime: string;
    amount: string;
    email: string;
    onReset: () => void;
}

// CSS-based confetti particles
function Confetti() {
    const [particles, setParticles] = useState<{ id: number; left: number; delay: number; color: string }[]>([]);

    useEffect(() => {
        const colors = ['#06b6d4', '#a855f7', '#f59e0b', '#22c55e', '#3b82f6'];
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ y: -20, x: `${p.left}vw`, opacity: 1, rotate: 0 }}
                    animate={{ y: '100vh', opacity: 0, rotate: 360 }}
                    transition={{ duration: 3, delay: p.delay, ease: 'easeOut' }}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{ backgroundColor: p.color }}
                />
            ))}
        </div>
    );
}

export default function ConfirmationSuccess({
    bookingId,
    packageName,
    dateTime,
    amount,
    email,
    onReset
}: ConfirmationSuccessProps) {

    const checklist = [
        { text: 'Join our Discord Server immediately', link: 'https://discord.gg/9UXeaSx4SF', done: false },
        { text: 'Have TeamViewer or AnyDesk installed', done: false },
        { text: 'Keep your Windows License Key ready', done: false },
        { text: 'Close unnecessary background apps', done: false }
    ];

    return (
        <>
            <Confetti />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto text-center"
            >
                {/* Success Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="relative inline-flex mb-8"
                >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.5)]">
                        <Check className="w-12 h-12 text-white" strokeWidth={3} />
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="absolute -top-2 -right-2"
                    >
                        <PartyPopper className="w-8 h-8 text-amber-400" />
                    </motion.div>
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-black text-white mb-3"
                >
                    Booking Confirmed!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/60 mb-8"
                >
                    Confirmation sent to <span className="text-cyan-400">{email}</span>
                </motion.p>

                {/* Booking Details Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-green-500/30 backdrop-blur-xl mb-8 text-left"
                >
                    <div className="absolute top-0 left-0 w-10 h-10 border-t-2 border-l-2 border-green-500/40 rounded-tl-xl" />
                    <div className="absolute bottom-0 right-0 w-10 h-10 border-b-2 border-r-2 border-green-500/40 rounded-br-xl" />

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Booking ID</div>
                            <div className="font-mono text-lg text-white">#{bookingId}</div>
                        </div>
                        <div>
                            <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Package</div>
                            <div className="font-bold text-white">{packageName}</div>
                        </div>
                        <div>
                            <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Date & Time</div>
                            <div className="text-white">{dateTime}</div>
                        </div>
                        <div>
                            <div className="text-xs text-white/40 uppercase tracking-widest mb-1">Amount</div>
                            <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                                {amount}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Preparation Checklist */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-black/80 via-black/60 to-black/80 border border-amber-500/30 backdrop-blur-xl mb-8 text-left"
                >
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-amber-400" />
                        Prepare for Your Session
                    </h3>

                    <ul className="space-y-3">
                        {checklist.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                                    <div className="w-2 h-2 rounded-full bg-white/30" />
                                </div>
                                {item.link ? (
                                    <a href={item.link} target="_blank" rel="noopener" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
                                        {item.text}
                                        <ExternalLink className="w-3 h-3" />
                                    </a>
                                ) : (
                                    <span className="text-white/70">{item.text}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <a
                        href="https://discord.gg/9UXeaSx4SF"
                        target="_blank"
                        rel="noopener"
                        className="px-6 py-3 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <MessageCircle className="w-5 h-5" />
                        Join Discord
                    </a>

                    <button
                        onClick={onReset}
                        className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold border border-white/10 transition-all"
                    >
                        Book Another Session
                    </button>
                </motion.div>
            </motion.div>
        </>
    );
}
