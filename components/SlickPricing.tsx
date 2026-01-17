'use client';

import { motion } from 'framer-motion';
import { Check, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';

const tiers = [
    {
        name: 'Starter',
        subtitle: 'Remote Triage',
        price: '199',
        description: 'Essential diagnostics and stability fixes.',
        features: [
            'System Latency Diagnostics',
            'Windows Debloat & Optimization',
            'Basic Driver Configuration',
            'Input Lag Reduction',
        ],
        accent: 'from-zinc-500/20 to-zinc-500/5',
        border: 'border-white/10',
        button: 'bg-white/10 hover:bg-white/20 text-white',
        link: '/book?package=quick'
    },
    {
        name: 'Professional',
        subtitle: 'Full Tune-Up',
        price: '399',
        description: 'The competitive standard. Most popular.',
        features: [
            'Advanced BIOS Configuration',
            'Network Throttling Removal',
            'Power Plan Optimization',
            'Frame Time Stabilization',
            'Priority Support'
        ],
        popular: true,
        accent: 'from-amber-500/20 to-amber-500/5',
        border: 'border-amber-500/30',
        button: 'bg-amber-500 text-black hover:bg-amber-400',
        link: '/book?package=full'
    },
    {
        name: 'Elite',
        subtitle: 'BIOSPRIME',
        price: '699',
        description: 'Hardware-level tuning for 0.1% lows.',
        features: [
            'Memory Training (RAM Tuning)',
            'Voltage Curve Optimization',
            'Thermal Velocity Management',
            'Custom OS Installation (Optional)',
            'Direct Engineer Access'
        ],
        accent: 'from-cyan-500/20 to-cyan-500/5',
        border: 'border-cyan-500/30',
        button: 'bg-cyan-500 text-black hover:bg-cyan-400',
        link: '/book?package=extreme'
    },
];

export default function SlickPricing() {
    return (
        <section className="relative w-full px-6 md:px-24 pb-32 bg-black z-30">
            {/* Header */}
            <div className="max-w-3xl mx-auto text-center mb-20">
                <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6">
                    Select Your Blueprint.
                </h2>
                <p className="text-lg text-white/50 font-light">
                    Professional optimization tiers tailored to your hardware's potential.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                {tiers.map((tier, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`relative group rounded-[2rem] p-8 md:p-10 backdrop-blur-2xl border transition-all duration-500 hover:-translate-y-2 ${tier.border} bg-gradient-to-b ${tier.accent} bg-opacity-10`}
                    >
                        {/* Popular Badge */}
                        {tier.popular && (
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-amber-500 text-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                                <Star className="w-3 h-3 fill-black" />
                                Most Popular
                            </div>
                        )}

                        {/* Title */}
                        <div className="mb-8">
                            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{tier.name}</h3>
                            <p className="text-sm font-medium text-white/40 uppercase tracking-wider mb-6">{tier.subtitle}</p>
                            <div className="flex items-baseline gap-1">
                                <span className="text-sm text-white/40">AED</span>
                                <span className="text-5xl font-semibold text-white tracking-tighter">{tier.price}</span>
                            </div>
                            <p className="text-sm text-white/60 mt-4 leading-relaxed">
                                {tier.description}
                            </p>
                        </div>

                        {/* Action */}
                        <Link href={tier.link} className={`w-full py-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${tier.button}`}>
                            Configure
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        {/* Glow effect on hover */}
                        <div className={`absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_80px_rgba(0,0,0,0)] ${tier.name === 'Elite' ? 'shadow-cyan-500/10' : tier.name === 'Professional' ? 'shadow-amber-500/10' : 'shadow-white/5'}`} />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
