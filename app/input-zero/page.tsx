'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Activity, ShieldCheck, Monitor, Command, ArrowRight } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';

export default function InputZeroPage() {
    return (
        <main className="min-h-screen bg-[#000000] text-white selection:bg-blue-500/30 overflow-x-hidden font-sans">
            <SiteHeader />

            {/* Hero Section */}
            <section className="relative pt-48 pb-32 px-6">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-500/5 rounded-full blur-[120px]" />
                </div>

                <div className="max-w-7xl mx-auto relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8 backdrop-blur-xl"
                    >
                        <Command size={14} className="text-white/60" />
                        <span className="text-[11px] font-semibold tracking-widest uppercase text-white/40">Architectural Division</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8">
                        Input <span className="text-white/90">Zero</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed mb-16 px-4">
                        The theoretical limit of desktop performance. Every part, every trace, and every clock cycle is <span className="text-white">latency-vetted</span> for professional athletics.
                    </p>

                    <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-white/40 font-bold text-sm backdrop-blur-md">
                        <Activity size={16} className="text-blue-500" /> System Architecture Portal Opening Soon
                    </div>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="max-w-7xl mx-auto px-6 pb-48">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <PillarCard
                        icon={<Cpu className="text-blue-400" />}
                        title="Golden Bin Sourcing"
                        description="We don't just order parts. We source silicon from specific batches known for superior voltage-to-frequency curves, ensuring higher boosts and lower heat."
                    />
                    <PillarCard
                        icon={<Zap className="text-purple-400" />}
                        title="Zero-Lag OS Loop"
                        description="A kernel-level stripped environment designed to eliminate background system interrupts that cause micro-stutter in titles like CS2 and Valorant."
                    />
                    <PillarCard
                        icon={<ShieldCheck className="text-green-400" />}
                        title="Anti-Cheat Ready"
                        description="Full compatibility with FACEIT and Vanguard. No more 'stuttering' when the anti-cheat driver polls your system."
                    />
                </div>
            </section>

            {/* Technical Deep Dive */}
            <section className="bg-[#050505] py-32 border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="order-2 lg:order-1 relative group">
                            <div className="absolute inset-0 bg-blue-500/10 rounded-[40px] blur-[80px]" />
                            <div className="relative aspect-video bg-[#1c1c1e] rounded-[40px] border border-white/10 p-12 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-[12px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4">Verification Layer</div>
                                    <h3 className="text-4xl font-bold text-white/5 uppercase italic">Certified Asset</h3>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2">
                            <h2 className="text-4xl font-bold tracking-tight mb-8">High Fidelity Engineering</h2>
                            <p className="text-white/40 text-lg leading-relaxed mb-12 font-medium">
                                Every InputZero machine arrives with a physical **Archive Box**. Inside is your signed **Technical Report Card**—a hardware-level certification detailing your build's specific DPC latency results and thermal delta curves.
                            </p>
                            <div className="space-y-6">
                                <FeatureItem text="Aggressive secondary & tertiary memory timing verification." />
                                <FeatureItem text="Exclusive core affinity for driver interrupt processing." />
                                <FeatureItem text="Physical TPM module integration for maximum driver stability." />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-48 text-center px-6">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">Ready for the limit?</h2>
                <p className="text-white/40 text-xl max-w-2xl mx-auto mb-16 font-medium">
                    Limited allocation slots opening soon. Join the elite who refuse to compromise on latency.
                </p>
                <button
                    disabled
                    className="px-12 py-5 bg-white text-black font-bold rounded-2xl opacity-50 cursor-not-allowed text-lg"
                >
                    Waiting List Opening Soon
                </button>
            </section>
        </main>
    );
}

function PillarCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="bg-[#1c1c1e] border border-white/5 p-10 rounded-[32px] hover:border-white/10 transition-all">
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 shadow-xl">
                {React.cloneElement(icon as React.ReactElement, { size: 24 })}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-white/40 leading-relaxed font-medium">{description}</p>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-4 text-white/60 font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            {text}
        </div>
    );
}

