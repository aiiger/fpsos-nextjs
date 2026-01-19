'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Zap, Activity, Thermometer, Box, ShieldCheck, ChevronRight } from 'lucide-react';
import { useTuner } from '@/context/TunerContext';

const metrics = [
    {
        id: 'fps',
        label: 'AVG FPS (CS2)',
        value: '540+',
        sub: '1% LOW: 480',
        icon: Activity,
        color: 'text-cyan-400',
        glow: 'bg-cyan-500/20'
    },
    {
        id: 'latency',
        label: 'SYSTEM LATENCY',
        value: '< 5.2ms',
        sub: 'MOTION-TO-PHOTON',
        icon: Zap,
        color: 'text-amber-400',
        glow: 'bg-amber-500/20'
    },
    {
        id: 'thermals',
        label: 'THERMAL DELTA',
        value: '-12°C',
        sub: 'VS STOCK PROFILES',
        icon: Thermometer,
        color: 'text-emerald-400',
        glow: 'bg-emerald-500/20'
    }
];

const hardwareSpecs = [
    { part: 'OPTIMIZATION', detail: 'CS2 & Valorant Specific Tuning' },
    { part: 'COMPATIBILITY', detail: 'FACEIT / Vanguard Hardware Verified' },
    { part: 'PERIPHERALS', detail: 'S-Tier Mouse & Pad Bundles' },
    { part: 'LATENCY', detail: 'End-to-End System Reflex Tuning' }
];

export default function InputZeroSection() {
    const { values } = useTuner();
    const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

    return (
        <section
            className="relative w-full py-32 bg-[#050505] overflow-hidden"
            style={{ paddingTop: `${values.forgeSectionPaddingTop || 128}px` }}
        >
            {/* Engineering Grid Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Left: Technical Hook */}
                    <div className="lg:w-1/2 flex flex-col items-start text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-6"
                        >
                            <Box className="w-3 h-3 text-cyan-400" />
                            <span className="text-[10px] font-mono font-bold tracking-[0.2em] text-cyan-400 uppercase">InputZero Architecture</span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8 text-white"
                        >
                            Input <span className="text-white/40">Zero</span>
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-white/50 font-medium leading-relaxed max-w-xl mb-10"
                        >
                            We don't just build PCs; we architect competitive advantages. Our builds are purpose-built for FPS dominance, ensuring perfect compatibility with aggressive anti-cheats like <span className="text-white">FACEIT</span> and <span className="text-white">Vanguard</span>. From the silicon to the mousepad, every component is vetted for one metric: absolute zero latency.
                        </motion.p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 w-full max-w-lg">
                            {hardwareSpecs.map((spec, i) => (
                                <motion.div
                                    key={spec.part}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + (i * 0.05) }}
                                    className="flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm group hover:border-white/20 transition-all"
                                >
                                    <span className="text-[9px] font-bold text-white/20 uppercase mb-1 tracking-widest">{spec.part}</span>
                                    <span className="text-xs text-white/60 group-hover:text-white transition-colors font-medium">{spec.detail}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-4 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 font-bold text-sm"
                        >
                            <Zap size={16} /> Portal Opening Soon
                        </motion.div>
                    </div>

                    {/* Right: Interactive Schematic */}
                    <div className="lg:w-1/2 relative min-h-[500px] w-full flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent blur-[120px] rounded-full" />

                        {/* Central Blueprint SVG */}
                        <div className="relative z-10 w-full max-w-md">
                            <motion.svg
                                viewBox="0 0 400 500"
                                className="w-full h-auto drop-shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                transition={{ duration: 1 }}
                            >
                                {/* Outer Frame */}
                                <rect x="50" y="50" width="300" height="400" rx="10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="10 5" />

                                {/* Inner Components (Abstract) */}
                                <motion.rect
                                    x="100" y="100" width="200" height="200" rx="4" fill="none" stroke="rgba(34,211,238,0.3)" strokeWidth="1"
                                    animate={{ strokeOpacity: [0.2, 0.5, 0.2] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                                <motion.path
                                    d="M100 300 L300 300 L300 400 L100 400 Z" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"
                                />

                                {/* Moving Connection Lines */}
                                <motion.path
                                    d="M100 200 L50 200" fill="none" stroke="rgba(34,211,238,0.5)" strokeWidth="1"
                                    animate={{ pathLength: [0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <motion.path
                                    d="M300 150 L350 150" fill="none" stroke="rgba(245,158,11,0.5)" strokeWidth="1"
                                    animate={{ pathLength: [0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                                />
                                <motion.path
                                    d="M200 100 L200 50" fill="none" stroke="rgba(16,185,129,0.5)" strokeWidth="1"
                                    animate={{ pathLength: [0, 1] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                                />
                            </motion.svg>

                            {/* Floating UI Cards */}
                            {metrics.map((metric, i) => (
                                <motion.div
                                    key={metric.id}
                                    className="absolute"
                                    style={{
                                        top: i === 0 ? '10%' : i === 1 ? '45%' : '80%',
                                        left: i === 1 ? '-5%' : 'auto',
                                        right: i !== 1 ? '-5%' : 'auto',
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.5 + (i * 0.2) }}
                                    onMouseEnter={() => setHoveredMetric(metric.id)}
                                    onMouseLeave={() => setHoveredMetric(null)}
                                >
                                    <div className="relative group p-4 bg-black/80 backdrop-blur-xl border border-white/10 rounded-lg min-w-[140px] shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-white/20 transition-all">
                                        <div className={`absolute -inset-0.5 ${metric.glow} blur opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />

                                        <div className="relative flex items-center gap-3 mb-2">
                                            <metric.icon className={`w-4 h-4 ${metric.color}`} />
                                            <span className="text-[10px] font-mono tracking-tighter text-white/40">{metric.label}</span>
                                        </div>
                                        <div className="relative flex flex-col">
                                            <span className="text-xl font-bold tracking-tight text-white">{metric.value}</span>
                                            <span className="text-[9px] font-mono text-white/50">{metric.sub}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Accent */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        </section>
    );
}
