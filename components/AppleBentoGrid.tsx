'use client';

import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Activity, MousePointer2, Network, Cpu, Zap, LineChart, Shield, Layers } from 'lucide-react';

const RealTimeTelemetry = () => {
    const [stats, setStats] = useState({ ping: 0, jitter: 0 });
    const [history, setHistory] = useState<number[]>(new Array(20).fill(10));

    useEffect(() => {
        let lastPing = 0;
        const interval = setInterval(async () => {
            const start = performance.now();
            try {
                await fetch('/api/ping', { cache: 'no-store' });
                const end = performance.now();
                const latency = Math.round(end - start);

                // Calculate Jitter (variation from last ping)
                const jitter = lastPing ? Math.abs(latency - lastPing) : 0;
                lastPing = latency;

                setStats({ ping: latency, jitter: parseFloat(jitter.toFixed(1)) });
                setHistory(prev => [...prev.slice(1), latency]);
            } catch (e) {
                // Ignore errors to prevent flicker
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // normalize graph roughly between 0 and 100ms height
    const normalize = (val: number) => Math.min(Math.max((val / 100) * 100, 10), 100);

    return (
        <div className="relative w-full h-full min-h-[120px] flex flex-col justify-end p-4 font-mono text-xs overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(to right, #06b6d4 1px, transparent 1px), linear-gradient(to bottom, #06b6d4 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* LIVE Ping Graph */}
            <div className="flex items-end gap-[2px] h-12 w-full mb-3 opacity-80">
                {history.map((val, i) => (
                    <motion.div
                        key={i}
                        className="w-full bg-cyan-500 rounded-t-[1px]"
                        initial={{ height: "0%" }}
                        animate={{ height: `${normalize(val)}%` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    />
                ))}
            </div>

            {/* Live Stats */}
            <div className="grid grid-cols-2 gap-2 z-10">
                <div className="flex flex-col bg-black/40 backdrop-blur-sm p-1.5 rounded border border-cyan-500/20">
                    <span className="text-[9px] text-cyan-500/70 uppercase">SERVER LATENCY</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-cyan-400 font-bold">{stats.ping}</span>
                        <span className="text-[10px] text-cyan-500/50">ms</span>
                    </div>
                </div>
                <div className="flex flex-col bg-black/40 backdrop-blur-sm p-1.5 rounded border border-emerald-500/20">
                    <span className="text-[9px] text-emerald-500/70 uppercase">JITTER</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-emerald-400 font-bold">{stats.jitter}</span>
                        <span className="text-[10px] text-emerald-500/50">ms</span>
                    </div>
                </div>
            </div>

            {/* Scanning Line */}
            <motion.div
                className="absolute top-0 bottom-0 w-[1px] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)] z-20"
                animate={{ left: ["0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
        </div>
    );
};

const ReactionTestTeaser = () => {
    return (
        <a href="/reaction-test" className="block relative w-full h-full min-h-[120px] group cursor-pointer">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)',
                    backgroundSize: '10px 10px'
                }}
            />

            {/* Pulsing Target Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500/30 to-indigo-600/30 border-2 border-blue-400/50 flex items-center justify-center group-hover:from-emerald-500/40 group-hover:to-cyan-500/40 group-hover:border-emerald-400/60 transition-all duration-300"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                    <motion.div
                        className="w-8 h-8 rounded-full bg-blue-500/50 group-hover:bg-emerald-500/60 transition-colors duration-300"
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>
            </div>

            {/* CTA Label */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400/70 group-hover:text-emerald-400 transition-colors duration-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50 group-hover:bg-emerald-400 animate-pulse" />
                    Test Your Reaction
                </span>
            </div>
        </a>
    );
};


const bentoItems = [
    {
        title: "Frame Pacing",
        description: "We smooth out 1% lows to eliminate micro-stutters during intense gunfights, ensuring consistency.",
        icon: Activity,
        visual: (
            <div className="relative h-16 w-full mt-4 flex items-end gap-1 px-4">
                {/* Simulated Graph: Flat vs Jagged */}
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="w-full bg-emerald-500/50 rounded-t-sm"
                        initial={{ height: "20%" }}
                        animate={{ height: ["45%", "50%", "45%"] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                    />
                ))}
                <div className="absolute top-0 left-4 right-4 h-[1px] bg-emerald-500/30 border-t border-dashed border-emerald-500/50" />
            </div>
        ),
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-emerald-950/10"
    },
    {
        title: "Input Chain",
        description: "Optimization of the interrupt pipeline for instant mouse-to-pixel response.",
        icon: MousePointer2,
        visual: (
            <ReactionTestTeaser />
        ),
        colSpan: "col-span-1",
        bg: "bg-blue-950/10"
    },
    {
        title: "Network Priority",
        description: "Custom QoS and adapter settings to stabilize connection jitter and hit registration.",
        icon: Network,
        visual: (
            <RealTimeTelemetry />
        ),
        colSpan: "col-span-1",
        bg: "bg-cyan-950/10"
    },
    {
        title: "OS Efficiency",
        description: "Stripping Windows of telemetry and background tasks to free up CPU cycles for the game.",
        icon: Layers,
        visual: (
            <div className="flex flex-col gap-2 mt-4 px-8 opacity-80">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full w-[0%] bg-red-500/50" />
                    </div>
                    <span className="text-[10px] font-mono text-white/40">BLOAT</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-emerald-500"
                            initial={{ width: "0%" }}
                            whileInView={{ width: "85%" }}
                            transition={{ duration: 1.5, delay: 0.5 }}
                        />
                    </div>
                    <span className="text-[10px] font-mono text-emerald-500">GAME</span>
                </div>
            </div>
        ),
        colSpan: "col-span-1 md:col-span-2",
        bg: "bg-purple-950/10"
    }
];

import { useTuner } from '@/context/TunerContext';

export default function AppleBentoGrid() {
    const { values } = useTuner();

    return (
        <section
            className="relative w-full px-6 md:px-0 pb-32 bg-transparent z-30 transition-all duration-300"
            style={{ marginTop: `${values.bentoGridPaddingTop}px` }}
        >
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2 text-center mb-8">
                    <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                        Engineering, not magic.
                    </h2>
                    <p className="text-lg text-white/50 font-light leading-relaxed max-w-2xl mx-auto">
                        We don't use placebo tweaks. We apply verifiable, kernel-level optimizations targeting the four pillars of system latency.
                    </p>
                </div>
                {bentoItems.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className={`group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.04] transition-colors duration-500 p-8 flex flex-col justify-between ${item.colSpan}`}
                    >

                        {/* Internal Lighting Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none" />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 rounded-full bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
                                    <item.icon className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
                                </div>
                                <h3 className="text-xl font-medium text-white tracking-tight">{item.title}</h3>
                            </div>
                            <p className="text-white/50 leading-relaxed max-w-md group-hover:text-white/70 transition-colors">
                                {item.description}
                            </p>
                        </div>

                        {/* Visual */}
                        <div className="relative z-10 mt-8">
                            {item.visual}
                        </div>

                        {/* Subtle Glow Background */}
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-3xl ${item.bg}`} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
