'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function EliteCard() {
    const features = [
        'Fresh Windows OS Installation & Setup',
        'Comprehensive BIOS Tuning & Optimization',
        'Manual Memory Timing & Latency Tuning',
        'Precision Boost Overdrive Optimization',
        'Advanced Thermal & Cooling Curve Tuning',
        'Full Stability & Stress-Testing Suite',
        'Windows Debloating & Game Performance Tuning'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[400px] bg-[#050505] rounded-[32px] p-10 overflow-hidden border border-white/5 shadow-2xl"
        >
            {/* Background Glow */}
            <div className="absolute -top-[10%] -right-[10%] w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-[10%] -left-[10%] w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
                {/* Title Section */}
                <div className="mb-10 text-center sm:text-left">
                    <motion.h2
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-[42px] font-bold tracking-tight text-[#00F5FF] leading-none mb-2"
                        style={{
                            textShadow: '0 0 25px rgba(0, 245, 255, 0.4)'
                        }}
                    >
                        Elite
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-[13px] font-bold tracking-[0.2em] text-zinc-500 uppercase"
                    >
                        Extreme Biosprime
                    </motion.p>
                </div>

                {/* Price Section */}
                <div className="mb-14 text-center sm:text-left">
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-[64px] font-extrabold text-white leading-none tracking-tight flex items-baseline justify-center sm:justify-start gap-3"
                    >
                        <span className="text-white">AED 699</span>
                    </motion.div>
                </div>

                {/* Feature List */}
                <ul className="space-y-6 mb-12">
                    {features.map((feature, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + index * 0.05 }}
                            className="flex items-start gap-4"
                        >
                            <div className="mt-1 flex-shrink-0">
                                <Check className="w-[18px] h-[18px] text-[#00F5FF]" strokeWidth={3} />
                            </div>
                            <span className="text-[17px] text-zinc-300 font-medium leading-[1.4] tracking-tight">
                                {feature}
                            </span>
                        </motion.li>
                    ))}
                </ul>

                {/* Action Button */}
                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(0, 245, 255, 1)', color: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-5 bg-[#00F5FF]/10 border border-[#00F5FF]/20 rounded-2xl text-[#00F5FF] font-bold text-lg uppercase tracking-wider transition-all duration-300"
                >
                    Get Elite Optimization
                </motion.button>
            </div>

            {/* Decorative Cyan Bottom Line (Sync with image hint) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00F5FF] to-transparent opacity-50" />
        </motion.div>
    );
}
