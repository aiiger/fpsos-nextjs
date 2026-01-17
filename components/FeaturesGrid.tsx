'use client';

import { motion } from 'framer-motion';
import { Cpu, Zap, Gauge } from 'lucide-react';
import { useTuner } from '@/context/TunerContext';

const features = [
    {
        icon: Cpu,
        title: 'CPU Optimization',
        color: '#22d3ee', // cyan
    },
    {
        icon: Gauge,
        title: 'BIOS Tuning',
        color: '#a855f7', // purple
    },
    {
        icon: Zap,
        title: 'Latency Reduction',
        color: '#f59e0b', // amber
    },
];

export function FeaturesGrid() {
    const { values } = useTuner();

    return (
        <div
            className="w-full relative z-30"
            style={{
                marginTop: `${values.featureShadeMarginTop}px`,
                marginBottom: `${values.featurePaddingBottom}px`
            }}
        >
            <div className="max-w-5xl mx-auto px-6">
                {/* KPI Cards - using same flex gap-20 as steps above for alignment */}
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-20">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.1 }}
                                whileHover={{ y: -2 }}
                                className="group"
                            >
                                {/* Card - centered content */}
                                <div
                                    className="flex items-center justify-center gap-3 px-5 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-opacity-30 transition-all duration-300 cursor-default min-w-[180px]"
                                    style={{
                                        '--hover-border': feature.color,
                                    } as React.CSSProperties}
                                >
                                    {/* Icon */}
                                    <div className="relative shrink-0">
                                        {/* Glow on hover */}
                                        <div
                                            className="absolute inset-0 blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 rounded-lg"
                                            style={{ backgroundColor: feature.color }}
                                        />
                                        <div
                                            className="relative w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300"
                                            style={{
                                                backgroundColor: `${feature.color}10`,
                                                borderColor: `${feature.color}30`,
                                            }}
                                        >
                                            <Icon
                                                className="w-4 h-4"
                                                style={{ color: feature.color }}
                                                strokeWidth={1.5}
                                            />
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <span className="text-xs font-bold text-white/80 uppercase tracking-wider font-rajdhani group-hover:text-white transition-colors duration-300">
                                        {feature.title}
                                    </span>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
