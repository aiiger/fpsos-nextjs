'use client'

import { motion } from 'framer-motion';
import { Cpu, Github, Twitter, Linkedin, Mail, Gamepad2, Zap, Shield, Award, Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
    const currentYear = new Date().getFullYear();

    const links = {
        product: [
            { label: 'Features', href: '#services' },
            { label: 'Pricing', href: '#packages' },
            { label: 'Security', href: '#' },
            { label: 'Support', href: 'https://discord.gg/7AJ3kmTg' },
        ],
        company: [
            { label: 'About', href: '/packages' },
            { label: 'Contact', href: '/contact' },
            { label: 'FAQ', href: '/faq' },
            { label: 'Discord', href: 'https://discord.gg/K3A6MkNXT9' },
        ],
        legal: [
            { label: 'Privacy', href: '/privacy' },
            { label: 'Terms', href: '/terms' },
        ],
    };

    const socials = [
        { icon: Gamepad2, href: 'https://discord.gg/K3A6MkNXT9', label: 'Discord', color: 'cyan' },
        { icon: Twitter, href: 'https://twitter.com/fpsos', label: 'Twitter', color: 'blue' },
        { icon: Github, href: 'https://github.com/fpsos', label: 'GitHub', color: 'purple' },
        { icon: Mail, href: 'mailto:contact@fpsos.gg', label: 'Email', color: 'amber' },
    ];

    const stats = [
        { icon: Zap, label: 'Performance', value: '99.9%', color: 'cyan' },
        { icon: Shield, label: 'Secure', value: 'SSL', color: 'emerald' },
        { icon: Award, label: 'Verified', value: 'Pro', color: 'purple' },
    ];

    return (
        <footer className="relative bg-black z-20 w-full mt-32 overflow-hidden border-t border-white/5">
            <div className="relative max-w-7xl mx-auto px-6 py-20">

                {/* Stats Bar */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                >
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        const colorMap: Record<string, string> = {
                            cyan: 'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30 text-cyan-400',
                            emerald: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
                            purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/30 text-purple-400',
                        };
                        return (
                            <motion.div
                                key={index}
                                className={`relative group p-6 rounded-2xl bg-gradient-to-br ${colorMap[stat.color]} border backdrop-blur-xl`}
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Icon className="w-6 h-6" />
                                        <div className={`absolute inset-0 blur-lg opacity-50 ${stat.color === 'cyan' ? 'bg-cyan-400' : stat.color === 'emerald' ? 'bg-emerald-400' : 'bg-purple-400'}`} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-mono text-white/50 uppercase tracking-wider mb-1">{stat.label}</div>
                                        <div className="text-2xl font-black font-rajdhani tracking-tight">{stat.value}</div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">

                    {/* Brand Column - Enhanced */}
                    <motion.div
                        className="md:col-span-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex items-center gap-3 mb-6 group">
                            <div className="relative">
                                <Cpu className="w-8 h-8 text-cyan-500 group-hover:rotate-90 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <span className="text-2xl font-black text-white tracking-[0.2em] uppercase font-rajdhani bg-gradient-to-r from-cyan-400 via-white to-cyan-400 bg-clip-text text-transparent">
                                FPSOS
                            </span>
                        </div>

                        <p className="text-sm text-white/60 leading-relaxed max-w-sm mb-8 font-medium">
                            Military-grade PC optimization for maximum performance and stability.
                            Dominate the server with lower latency and higher frames.
                        </p>

                        {/* Social Links - Glassmorphic Style */}
                        <div className="flex items-center gap-3">
                            {socials.map((social, index) => {
                                const Icon = social.icon;
                                const glowColors: Record<string, string> = {
                                    cyan: 'hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]',
                                    blue: 'hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]',
                                    purple: 'hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]',
                                    amber: 'hover:shadow-[0_0_20px_rgba(251,191,36,0.3)]',
                                };
                                return (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        aria-label={social.label}
                                        className={`relative rounded-xl bg-white/5 backdrop-blur-sm p-3 text-white/60 hover:text-${social.color}-400 border border-white/10 hover:border-${social.color}-500/50 transition-all duration-300 ${glowColors[social.color]}`}
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Icon className="w-5 h-5" />
                                    </motion.a>
                                );
                            })}
                        </div>
                    </motion.div>

                    {/* Links Columns - Enhanced */}
                    {Object.entries(links).map(([category, items], catIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 * (catIndex + 1) }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-2 mb-6">
                                <Sparkles className="w-3 h-3 text-cyan-400" />
                                <h4 className="text-xs font-black text-white uppercase tracking-[0.2em] font-rajdhani">
                                    {category}
                                </h4>
                            </div>
                            <ul className="space-y-4">
                                {items.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="relative text-sm text-white/50 hover:text-cyan-400 transition-all duration-300 font-medium group inline-flex items-center gap-2"
                                        >
                                            <span className="w-0 h-px bg-cyan-400 group-hover:w-4 transition-all duration-300" />
                                            {item.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Simple Divider */}
                <div className="h-px w-full bg-white/5 mb-10" />

                {/* Bottom Bar - Enhanced */}
                <motion.div
                    className="flex flex-col md:flex-row items-center justify-between gap-6"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                            <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">System Online</span>
                        </div>
                        <div className="w-px h-4 bg-white/10" />
                        <p className="text-xs text-white/40 font-mono tracking-tight">
                            &copy; {currentYear} FPSOS. All rights reserved.
                        </p>
                    </div>

                    <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-wider">
                        <a
                            href="https://discord.gg/K3A6MkNXT9"
                            className="text-white/40 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                        >
                            <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            Support
                        </a>
                        <a
                            href="/packages"
                            className="text-white/40 hover:text-cyan-400 transition-colors duration-200 flex items-center gap-2 group"
                        >
                            <div className="w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            Packages
                        </a>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}
