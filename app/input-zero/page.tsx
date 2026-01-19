'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Command, Activity, Zap, ShieldCheck, Box, Monitor, Cpu } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Link from 'next/link';

export default function InputZeroTeaser() {
    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans relative">
            <SiteHeader />

            {/* Background Engineering Layer */}
            <div className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }}
                />
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent"
                    animate={{ y: ['-100%', '100%'] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    style={{ height: '200px', opacity: 0.2 }}
                />
            </div>

            {/* Central Content */}
            <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-32 text-center">

                {/* Identifier Tag */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="inline-flex items-center gap-3 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-12 backdrop-blur-xl"
                >
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase text-white/40">Architectural Division // 2026</span>
                </motion.div>

                {/* Main Branding */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    className="flex flex-col items-center mb-16"
                >
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-4 text-white uppercase italic">
                        Input <span className="opacity-20 text-blue-500">Zero</span>
                    </h1>
                    <div className="h-[2px] w-48 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                </motion.div>

                {/* Subtext */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="max-w-2xl mx-auto mb-20"
                >
                    <p className="text-xl md:text-2xl text-white/40 font-medium leading-relaxed tracking-tight">
                        The theoretical limit of desktop performance. Every build is <span className="text-white">latency-vetted</span>, silicon-binned, and forged for the world's most aggressive <span className="text-white">kernel metrics</span>.
                    </p>
                </motion.div>

                {/* Status Tiles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-24">
                    <StatusCard
                        label="ALLOCATION STATUS"
                        value="LOCKED"
                        sub="WAITLIST QUEUE 2026"
                        color="text-amber-500"
                    />
                    <StatusCard
                        label="HARDWARE TIER"
                        value="9800X3D"
                        sub="SILICON BINNING IN PROGRESS"
                        color="text-blue-500"
                    />
                    <StatusCard
                        label="VERIFICATION"
                        value="ELITE"
                        sub="DPC LATENCY: < 5.0ms"
                        color="text-emerald-500"
                    />
                </div>

                {/* CTA / Teaser Button */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <button
                        disabled
                        className="group relative px-12 py-6 bg-white/5 border border-white/10 rounded-2xl overflow-hidden cursor-not-allowed"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="relative z-10 text-[12px] font-black uppercase tracking-[0.3em] text-white/20">
                            Portal Opening Soon
                        </span>
                    </button>
                </motion.div>

            </section>

            {/* Bottom Footer Accent */}
            <div className="absolute bottom-0 left-0 w-full p-12 flex justify-between items-end border-t border-white/5">
                <div className="flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-white/10 uppercase tracking-widest">System Revision</div>
                    <div className="text-[10px] font-mono text-white/30">AZ-9.0.44-STABLE</div>
                </div>
                <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.5em]">
                    FPSOS // ENGINEERING. NOT MAGIC.
                </div>
            </div>
        </main>
    );
}

function StatusCard({ label, value, sub, color }: { label: string, value: string, sub: string, color: string }) {
    return (
        <motion.div
            whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.1)' }}
            className="p-8 bg-white/[0.02] border border-white/[0.05] rounded-[24px] text-left backdrop-blur-3xl transition-all"
        >
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-4">
                {label}
            </div>
            <div className={`text-4xl font-black mb-1 ${color} tracking-tighter`}>
                {value}
            </div>
            <div className="text-[9px] font-bold text-white/40 uppercase tracking-tight">
                {sub}
            </div>
        </motion.div>
    );
}
