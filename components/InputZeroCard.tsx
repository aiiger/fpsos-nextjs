'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Box } from 'lucide-react'

// InputZero Tier Features (Base features + Dynamic Support)
const baseFeatures = [
    'Custom Component Latency Audit',
    'Hand-Built & Cable Managed',
    'Pre-Delivery BIOS & PBO Tuning',
    'Custom Memory Sub-timing Tightening',
    'Stripped & Optimized OS Deployment',
    '72-Hour Stability Stress Test',
    'Premium Unboxing & Sentimental Gifts'
]

interface InputZeroCardProps {
    build?: {
        name: string;
        description: string;
        hardware_cost: number;
        service_fee: number;
        support_duration: string;
        refund_policy: string;
    }
}

export const InputZeroCard = ({ build }: InputZeroCardProps) => {
    // Default values if no build provided (Fallback)
    const name = build?.name || 'InputZero System';
    const description = build?.description || 'Bespoke hardware architecture. Hand-built, tuned, and calibrated.';

    const hardwareCost = build?.hardware_cost || 0;
    const serviceFee = build?.service_fee || 2499;
    const total = hardwareCost + serviceFee;

    const displayPrice = hardwareCost > 0 ? total.toLocaleString() : serviceFee.toLocaleString();
    const subtext = hardwareCost > 0 ? '/ total build' : '/ service fee';
    const costNote = hardwareCost > 0 ? 'Includes Hardware + Optimization + Free Shipping' : 'Does not include component cost';

    const features = [
        ...baseFeatures,
        `Include ${build?.support_duration || 'Lifetime'} Calibration Support`,
        `Strict ${build?.refund_policy || '7-Day'} DOJ Refund Policy`
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full h-full bg-[#050505] rounded-[24px] p-8 overflow-hidden border border-cyan-500/20 shadow-2xl group flex flex-col"
        >
            {/* Background Glows (Engineering/Cyan Theme) */}
            <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-cyan-600/20 transition-all duration-700" />
            <div className="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-blue-600/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-blue-600/10 transition-all duration-700" />

            {/* Subtle Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black_70%,transparent_100%)] pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="mb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 mb-2"
                    >
                        <Box className="w-5 h-5 text-cyan-500" />
                        <span className="text-xs font-bold tracking-[0.2em] text-cyan-500 uppercase">
                            Ultimate Hardware
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-[32px] font-bold tracking-tight text-white leading-tight mb-4"
                    >
                        {name}
                    </motion.h2>

                    <p className="text-zinc-400 text-sm leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Separator */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-8" />

                {/* Price */}
                <div className="mb-10">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-white tracking-tight">AED {displayPrice}</span>
                        <span className="text-sm text-zinc-500 font-medium">{subtext}</span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-2">{costNote}</p>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-10 flex-grow">
                    {features.map((feature, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + index * 0.05 }}
                            className="flex items-start gap-3"
                        >
                            <div className="mt-1 flex-shrink-0">
                                <Check className="w-4 h-4 text-cyan-500" strokeWidth={3} />
                            </div>
                            <span className="text-[15px] text-zinc-300 font-medium leading-tight">
                                {feature}
                            </span>
                        </motion.li>
                    ))}
                </ul>

                {/* Action Button */}
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(6, 182, 212, 1)', color: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-500 font-bold text-sm uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(6, 182, 212, 0.1)] hover:shadow-[0_0_30px_rgba(6, 182, 212, 0.3)] mt-auto"
                >
                    Secure Allocation
                </motion.button>
            </div>

            {/* Decorative Bottom Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-60" />
        </motion.div>
    )
}
