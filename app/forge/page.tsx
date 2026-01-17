'use client';

import Link from 'next/link';
import { Cpu, ShieldCheck, Zap, ArrowRight, Star, Hexagon, Command, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';

const FORGE_TIERS = [
    {
        id: 'APEX',
        name: 'Apex Series',
        tagline: 'The World Champion Standard',
        description: 'The exact configuration used on main stage. Zero compromises. Every component bin-checked for superior silicon quality.',
        features: ['Ryzen 7800X3D (Golden Bin)', 'RTX 4090 24GB', 'DDR5 6000MHz C28', 'FACEIT Anti-Cheat Optimized'],
        color: 'bg-blue-500'
    },
    {
        id: 'COMPETITIVE',
        name: 'Strike Series',
        tagline: 'Esports Standard Issue',
        description: 'Pure performance per dollar. The standard-issue deployment for semi-pro leagues and high-elo grinders.',
        features: ['Ryzen 7800X3D', 'RTX 4070 Ti Super', 'DDR5 6000MHz C30', 'Kernel-Level System Tuning'],
        color: 'bg-purple-500'
    },
    {
        id: 'LEGACY',
        name: 'Echo Series',
        tagline: 'The DDR4 Final Form',
        description: 'The absolute limit of the AM4 platform. For those who prefer the raw, proven snappiness of tuned DDR4 memory.',
        features: ['Ryzen 5800X3D', 'RTX 4060 Ti / 3080', 'DDR4 3800MHz C14', 'Proven CS2/Valorant Meta'],
        color: 'bg-orange-500'
    }
];

export default function ForgePage() {
    return (
        <main className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px]" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-7xl mx-auto relative z-10 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-xl">
                        <Command size={14} className="text-white/60" />
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Engineering Division</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
                        InputZero <span className="text-white/90">Systems</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed mb-16 px-4">
                        Hand-built, latency-validated machines. Designed specifically for <span className="text-white">competitive athletes</span> who require zero interference with kernel-level anti-cheats like <span className="text-white">FACEIT</span> and <span className="text-white">Vanguard</span>.
                    </p>

                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 font-bold text-sm">
                        <Zap size={16} /> Configuration Portal Coming Soon
                    </div>
                </motion.div>
            </section>

            {/* Builds Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-48">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {FORGE_TIERS.map((tier, index) => (
                        <motion.div
                            key={tier.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="group relative bg-[#1c1c1e] border border-white/5 rounded-[32px] p-10 transition-all duration-500 hover:scale-[1.02] shadow-2xl shadow-black/40"
                        >
                            <div className="relative z-10 h-full flex flex-col">
                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className={`w-12 h-12 rounded-2xl ${tier.color} flex items-center justify-center shadow-lg shadow-black/20`}>
                                            <Monitor className="w-6 h-6 text-white" />
                                        </div>
                                        <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold uppercase rounded-full border border-white/10">
                                            Vetted Asset
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-bold tracking-tight mb-2">{tier.name}</h3>
                                    <p className="text-sm font-medium text-white/30">{tier.tagline}</p>
                                </div>

                                <div className="space-y-6 mb-12 flex-1">
                                    <p className="text-[15px] text-white/50 leading-relaxed font-medium">
                                        {tier.description}
                                    </p>

                                    <div className="space-y-4 pt-4">
                                        {tier.features.map((feat, i) => (
                                            <div key={i} className="flex items-center gap-3 text-[14px] font-medium text-white/70">
                                                <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                                                {feat}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto pt-10 border-t border-white/5">
                                    <button
                                        disabled
                                        className="w-full py-4 bg-white/5 text-white/20 font-bold text-[14px] flex items-center justify-center gap-2 rounded-2xl border border-white/5 cursor-not-allowed"
                                    >
                                        Registration Opens Soon
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* The Promise Section */}
            <section className="bg-[#050505] py-32 border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight mb-12">
                                The Competitive Advantage
                            </h2>
                            <div className="space-y-12">
                                <div className="flex gap-8">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                        <ShieldCheck className="text-blue-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Anti-Cheat Compatibility</h3>
                                        <p className="text-white/40 text-[15px] leading-relaxed font-medium">
                                            We build machines that work with, not against, the world's most aggressive kernel drivers. Every Forge build is tested against FACEIT and Vanguard for zero micro-stutter interactions.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-8">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center shrink-0 border border-white/10">
                                        <Zap className="text-purple-400" size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-3">Lowest Possible DPC Latency</h3>
                                        <p className="text-white/40 text-[15px] leading-relaxed font-medium">
                                            Forge systems are optimized at the OS level to ensure your CPU spends more time processing game frame data and less time waiting on background system interrupts.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative group">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-[40px] blur-[80px] group-hover:bg-blue-500/20 transition-all duration-700" />
                            <div className="relative aspect-video bg-[#1c1c1e] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl flex items-center justify-center p-12">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <ShieldCheck className="w-10 h-10 text-white/20" />
                                    </div>
                                    <p className="text-[12px] font-bold text-white/20 uppercase tracking-[0.4em] mb-2">Performance Verified</p>
                                    <h3 className="text-4xl font-bold text-white/5 tracking-tighter uppercase">Certified System</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}

