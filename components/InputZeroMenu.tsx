'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Activity, Zap, Box, Cpu, ShieldCheck, Terminal, Disc } from 'lucide-react';
import Link from 'next/link';

interface InputZeroMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

const menuItems = [
    {
        id: 'series',
        title: 'InputZero [SERIES]',
        desc: 'The Absolute Benchmarks.',
        icon: Cpu,
        color: 'text-cyan-400',
        link: '/input-zero'
    },
    {
        id: 'armory',
        title: 'The Armory [HAND-PICKED]',
        desc: 'Mouse, Pad & Skate Pairings.',
        icon: Zap,
        color: 'text-amber-400',
        link: '/armory'
    },
    {
        id: 'lab',
        title: 'The Lab [LIVE DATA]',
        desc: 'Real-time Latency telemetry.',
        icon: Activity,
        color: 'text-emerald-400',
        link: '/labs'
    },
    {
        id: 'procurement',
        title: 'Procurement [RARE]',
        desc: 'Order physical TPM modules.',
        icon: Disc,
        color: 'text-rose-400',
        link: '/procurement'
    },
    {
        id: 'forge',
        title: 'InputZero Systems [PRE-BUILT]',
        desc: 'Ready-to-deploy Latency Beasts.',
        icon: ShieldCheck,
        color: 'text-purple-400',
        link: '/forge'
    }
];

export default function InputZeroMenu({ isOpen, onClose }: InputZeroMenuProps) {
    const [activeTab, setActiveTab] = useState('series');

    // Handle ESC to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key.toLowerCase() === 'm') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl overflow-hidden"
                >
                    {/* Background Scanline Animation */}
                    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
                        <motion.div
                            className="w-full h-[2px] bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                            animate={{ y: ['0vh', '100vh'] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />
                    </div>

                    {/* Industrial Grid Overlay */}
                    <div className="absolute inset-0 z-0 opacity-[0.03]"
                        style={{
                            backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
                            backgroundSize: '80px 80px'
                        }}
                    />

                    <div className="relative z-10 w-full max-w-7xl h-full flex flex-col p-8 lg:p-24 justify-center">

                        {/* Header Area */}
                        <div className="flex items-center justify-between mb-16">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-4"
                            >
                                <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                                    <Terminal className="text-cyan-400 w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-4xl font-bold tracking-tight text-white leading-none">Command Center</h2>
                                    <p className="text-[10px] font-medium tracking-widest text-white/30 uppercase mt-1">InputZero System v1.0.4 [ARCHITECT]</p>
                                </div>
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-4 bg-white/5 border border-white/10 rounded-full text-white/40 hover:text-white transition-all ring-1 ring-white/10 hover:ring-white/20"
                            >
                                <X size={24} />
                            </motion.button>
                        </div>

                        {/* Main Navigation Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center h-full">

                            {/* Left: Menu Links */}
                            <div className="space-y-4">
                                {menuItems.map((item, i) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        onMouseEnter={() => setActiveTab(item.id)}
                                    >
                                        <Link
                                            href={item.link}
                                            onClick={onClose}
                                            className={`group flex items-center gap-6 p-6 transition-all border-l-2 ${activeTab === item.id ? 'bg-white/5 border-cyan-500' : 'border-transparent hover:bg-white/[0.02]'}`}
                                        >
                                            <div className={`p-4 rounded-xl transition-all ${activeTab === item.id ? 'bg-cyan-500 text-black shadow-[0_0_30px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-white/40'}`}>
                                                <item.icon size={28} />
                                            </div>
                                            <div>
                                                <h3 className={`text-2xl font-bold tracking-tight transition-colors ${activeTab === item.id ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm font-medium text-white/20 mt-1">{item.desc}</p>
                                            </div>
                                            <ChevronRight className={`ml-auto w-6 h-6 transition-transform ${activeTab === item.id ? 'text-white translate-x-0' : 'text-white/10 -translate-x-4 opacity-0'}`} />
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Right: Technical Readouts / Previews */}
                            <div className="hidden lg:flex flex-col gap-8 h-full justify-center pl-16 border-l border-white/5">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-12"
                                    >
                                        {/* Dynamic Data Blocks based on activeTab */}
                                        <div className="space-y-4">
                                            <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase">Telemetry Readout</div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="text-[9px] font-bold text-white/40 uppercase mb-2">Internal Ping</div>
                                                    <div className="text-3xl font-bold text-white tracking-tighter">0.42ms</div>
                                                </div>
                                                <div className="p-6 bg-white/[0.02] border border-white/5 rounded-xl">
                                                    <div className="text-[9px] font-bold text-white/40 uppercase mb-2">Order Density</div>
                                                    <div className="text-3xl font-bold text-white tracking-tighter">HIGH</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="text-[10px] font-mono tracking-widest text-white/30 uppercase italic">System Logs_</div>
                                            <div className="space-y-2 font-mono text-[10px] text-white/40">
                                                <p className="flex gap-4"><span className="text-cyan-500">[INIT]</span> Initializing InputZero architecture...</p>
                                                <p className="flex gap-4"><span className="text-emerald-500">[PASS]</span> Motherboard DPC Latency: Gold Certified</p>
                                                <p className="flex gap-4"><span className="text-cyan-500">[AUTH]</span> Secure Boot Handshake: Hardware TPM detected</p>
                                                <motion.p
                                                    animate={{ opacity: [1, 0] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                    className="flex gap-4"
                                                >
                                                    <span className="text-cyan-500">_</span>
                                                </motion.p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Footer Status Bar */}
                        <div className="mt-auto pt-8 border-t border-white/5 flex flex-wrap gap-8 items-center text-[9px] font-mono tracking-widest text-white/20 uppercase">
                            <span className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-emerald-500 animate-pulse rounded-full" />
                                Dubai Node: STABLE
                            </span>
                            <span>Latency Bias: 7% Offset Applied</span>
                            <span>Kernel: FPSOS_STABLE_V3</span>
                            <span className="ml-auto text-cyan-500/40">©2026 FPSOS ARCHITECTURAL DIV.</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
