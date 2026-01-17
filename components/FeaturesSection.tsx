'use client'

import { motion } from 'framer-motion';
import { Cpu, Zap, Shield, Gauge, Database, Lock } from 'lucide-react';
import { useTuner } from '@/context/TunerContext';

const features = [
    {
        icon: Cpu,
        title: 'CPU Optimization',
        description: 'Advanced processor tuning and core prioritization for maximum throughput.',
    },
    {
        icon: Gauge,
        title: 'BIOS Optimization',
        description: 'Advanced UEFI/BIOS configuration tuning for maximum system performance.',
    },
    {
        icon: Zap,
        title: 'Latency Reduction',
        description: 'System-wide latency optimization for competitive gaming performance.',
    },
    {
        icon: Database,
        title: 'Storage Optimization',
        description: 'Defragmentation and file system optimization for faster I/O.',
    },
    {
        icon: Shield,
        title: 'Security Hardening',
        description: 'Advanced security configurations and threat mitigation.',
    },
    {
        icon: Lock,
        title: 'Data Protection',
        description: 'Comprehensive backup and recovery solutions included.',
    },
];

export function FeaturesSection() {
    const { values } = useTuner();

    return (
        <section
            id="services"
            className="relative z-20 w-full -mt-4"
        >

            {/* 1. Title Container - Sitting on the 'Seam' */}
            {/* We decoupling the background (seam) from the text so the LINE can be moved independently */}
            <div className="relative z-40 w-full flex justify-center items-center py-8">

                {/* THE DIVIDER LINE / SEAM BACKGROUND - Softened */}
                <div
                    className="absolute left-0 right-0 h-full -z-10"
                    style={{
                        top: `${values.seamPositionY}px`,
                        opacity: values.featureShadeOpacity, // Shared opacity or create a new one if needed
                        background: 'linear-gradient(to bottom, transparent 0%, transparent 50%, transparent 100%)',
                        filter: 'blur(20px)' // Soften edges further
                    }}
                />

                <div className="px-6 relative text-center">
                    {/* Header Removed as per user request */}
                </div>
            </div>

            {/* 2. The Purple Shade & Cards Container */}
            {/* This starts BELOW the title. We add a top margin to push it down. */}
            <div
                className="relative w-full z-30"
                style={{ marginTop: `${values.featureShadeMarginTop}px` }}
            >

                {/* The Purple/Cyan Gradient Background starts here */}
                {/* We create a distinct background block for the cards to sit in */}
                <div
                    className="absolute inset-0 top-0 pointer-events-none"
                    style={{
                        opacity: values.featureShadeOpacity,
                        background: `transparent`
                    }}
                />

                <div className="max-w-7xl mx-auto px-6 pb-20 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[features[0], features[1], features[2]].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    className="group relative"
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    whileHover={{
                                        y: -8,
                                        rotateX: 5,
                                        rotateY: -5,
                                        transition: { type: 'spring', stiffness: 300, damping: 20 }
                                    }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true }}
                                    style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
                                >
                                    {/* Floating Glow Effect - Enhanced */}
                                    <motion.div
                                        className="absolute -inset-4 rounded-2xl bg-gradient-to-b from-cyan-500/30 to-blue-900/30 opacity-0 blur-2xl"
                                        whileHover={{ opacity: 1, scale: 1.1 }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    {/* Gradient Border on Hover */}
                                    <motion.div
                                        className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-400/50 to-cyan-500/0 opacity-0"
                                        whileHover={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    />

                                    <div className="relative h-full rounded-2xl bg-neutral-900/80 backdrop-blur-xl p-3 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_60px_rgba(34,211,238,0.3)]">
                                        {/* Icon Container with Pulse */}
                                        <motion.div
                                            className="flex items-center justify-center mb-2"
                                            whileHover={{ scale: 1.1 }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                        >
                                            <motion.div
                                                className="rounded-2xl bg-gradient-to-br from-cyan-500/30 to-blue-600/30 p-3 transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.3)]"
                                                whileHover={{
                                                    boxShadow: '0 0 50px rgba(34, 211, 238, 0.6)',
                                                    background: 'linear-gradient(to bottom right, rgba(34, 211, 238, 0.5), rgba(37, 99, 235, 0.5))'
                                                }}
                                            >
                                                <Icon className="w-8 h-8 text-cyan-300" />
                                            </motion.div>
                                        </motion.div>

                                        <h3 className="text-lg font-black text-white mb-1 font-rajdhani uppercase tracking-wider text-center">{feature.title}</h3>
                                        <p className="text-neutral-300 text-xs leading-relaxed font-sans text-center">{feature.description}</p>

                                        {/* Bottom Accent - Enhanced */}
                                        <motion.div
                                            className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0"
                                            whileHover={{ opacity: 1, scaleX: 1.2 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
