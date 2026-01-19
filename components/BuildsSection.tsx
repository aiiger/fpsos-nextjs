'use client';

import { motion } from 'framer-motion';



export default function BuildsSection() {
    return (
        <section className="relative w-full py-32 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-6">

                {/* Section Header */}
                <div className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block"
                    >
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-6">
                            Forged for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Victory</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
                            Four distinct tiers. One goal: Absolute dominance. <br />
                            The next generation of optimized hardware is being finalized.
                        </p>
                    </motion.div>
                </div>

                {/* Teaser Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto p-1 rounded-3xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20"
                >
                    <div className="rounded-[22px] bg-[#0a0a0b] border border-white/5 p-12 text-center overflow-hidden relative">
                        {/* Background Glow */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                        <div className="relative z-10 space-y-6">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                IN DEVELOPMENT
                            </div>

                            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">
                                Project <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Forge</span>
                            </h3>

                            <p className="text-gray-400 text-lg leading-relaxed">
                                We are finalizing the specifications for the most optimized competitive gaming rigs in the region.
                                Featuring discrete TPM modules, custom BIOS tuning, and zero-latency architecture.
                            </p>

                            <div className="pt-4">
                                <span className="text-sm font-mono text-gray-500 uppercase tracking-widest">
                                    Coming Soon
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
