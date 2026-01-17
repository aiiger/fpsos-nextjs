'use client';

import { motion } from 'framer-motion'
import { Calendar, Settings, Trophy, Cpu, Gauge, Zap } from 'lucide-react'
import { useTuner } from '@/context/TunerContext'

const steps = [
    {
        id: 1,
        title: 'Book Consultation',
        icon: Calendar,
        color: '#22d3ee', // cyan
        kpi: { icon: Cpu, label: 'CPU Optimization' }
    },
    {
        id: 2,
        title: 'Remote Optimization',
        icon: Settings,
        color: '#a855f7', // purple
        kpi: { icon: Gauge, label: 'BIOS Tuning' }
    },
    {
        id: 3,
        title: 'Dominate',
        icon: Trophy,
        color: '#f59e0b', // amber
        kpi: { icon: Zap, label: 'Latency Reduction' }
    },
]

export default function HowItWorks() {
    const { values } = useTuner();

    return (
        <section
            className="relative w-full"
            style={{
                marginTop: `${values.howItWorksMarginTop}px`,
                paddingTop: `${values.howItWorksPaddingY}px`,
                paddingBottom: `${values.howItWorksPaddingY}px`
            }}
        >
            <div className="max-w-5xl mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                    style={{ marginBottom: `${values.howItWorksTitleBottomMargin}px` }}
                >
                    <h2 className="text-3xl md:text-4xl font-black text-white font-rajdhani uppercase tracking-wider mb-4">
                        How It Works
                    </h2>
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto rounded-full" />
                </motion.div>

                {/* Timeline Container */}
                <div
                    className="relative"
                    style={{ transform: `translateY(${values.howItWorksStepsY}px)` }}
                >
                    {/* Steps Container */}
                    <div className="flex flex-col md:flex-row justify-center items-start gap-10 md:gap-20 relative">

                        {/* Connecting Line (Desktop) - positioned behind steps */}
                        <div
                            className="hidden md:block absolute top-10 left-0 right-0 h-[2px] -z-10"
                        >
                            <div className="absolute left-1/2 -translate-x-1/2 w-[420px] h-full bg-neutral-800" />
                            <motion.div
                                className="absolute left-1/2 -translate-x-1/2 w-[420px] h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500"
                                initial={{ scaleX: 0 }}
                                whileInView={{ scaleX: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                                style={{ transformOrigin: 'left' }}
                            />
                        </div>
                        {steps.map((step, index) => {
                            const Icon = step.icon
                            const KpiIcon = step.kpi.icon
                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.2 }}
                                    className="relative flex flex-col items-center text-center group"
                                >
                                    {/* Icon Circle */}
                                    <motion.div
                                        className="relative w-20 h-20 mb-5"
                                        whileHover={{ scale: 1.1 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        {/* Glow */}
                                        <div
                                            className="absolute inset-0 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
                                            style={{ backgroundColor: step.color }}
                                        />

                                        {/* Ring */}
                                        <div
                                            className="absolute inset-0 rounded-full border-2 opacity-60"
                                            style={{ borderColor: step.color }}
                                        />

                                        {/* Inner circle */}
                                        <div className="absolute inset-1 rounded-full bg-[#0a0a0a] flex items-center justify-center">
                                            <Icon
                                                className="w-8 h-8 transition-colors duration-300"
                                                style={{ color: step.color }}
                                                strokeWidth={1.5}
                                            />
                                        </div>

                                        {/* Step number */}
                                        <div
                                            className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-black text-black"
                                            style={{ backgroundColor: step.color }}
                                        >
                                            {step.id}
                                        </div>
                                    </motion.div>

                                    {/* Title */}
                                    <h3
                                        className="text-lg font-bold text-white mb-4 font-rajdhani uppercase tracking-wide transition-colors duration-300"
                                    >
                                        {step.title}
                                    </h3>

                                    {/* KPI Card - directly under this step */}
                                    <div
                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.02] transition-all duration-300 hover:border-opacity-40"
                                        style={{ borderColor: `${step.color}20` }}
                                    >
                                        <div
                                            className="w-6 h-6 rounded flex items-center justify-center"
                                            style={{ backgroundColor: `${step.color}15` }}
                                        >
                                            <KpiIcon
                                                className="w-3.5 h-3.5"
                                                style={{ color: step.color }}
                                                strokeWidth={2}
                                            />
                                        </div>
                                        <span className="text-xs font-semibold text-white/70 uppercase tracking-wider">
                                            {step.kpi.label}
                                        </span>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </section>
    )
}
