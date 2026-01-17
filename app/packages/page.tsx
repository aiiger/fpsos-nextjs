'use client'

import React, { useState } from 'react'
import SiteHeader from '@/components/SiteHeader'
import { Check, ChevronRight, Cpu, Monitor, MousePointer2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// --- PACKAGES DATA ---
const tiers = [
  {
    name: 'Starter',
    subtitle: 'Quick Remote Fix',
    price: '199',
    accent: 'text-white',
    border: 'border-white/10',
    glow: '',
    features: [
      'System Stability Checks & Diagnostics',
      'Remote Desktop Performance Tuning',
      'Critical System Error Resolution',
      'Basic Performance Foundation Tuning',
      '48-Hour Professional Support',
    ],
    featured: false,
  },
  {
    name: 'Professional',
    subtitle: 'Full System Tune-Up',
    price: '399',
    accent: 'text-amber-500',
    border: 'border-amber-500/30',
    glow: 'shadow-[0_0_40px_rgba(245,158,11,0.1)]',
    features: [
      'Standard BIOS Configuration & Setup',
      'Complete Windows Performance Tuning',
      'Network Stack & Latency Optimization',
      'Storage & Memory Throughput Tuning',
      'Startup & Background Service Cleanup',
      'Priority 24-Hour Premium Support',
    ],
    featured: true,
  },
  {
    name: 'Elite',
    subtitle: 'Extreme BIOSPRIME',
    price: '699',
    accent: 'text-cyan-400',
    border: 'border-cyan-500/50',
    glow: 'shadow-[0_0_50px_rgba(34,211,238,0.15)]',
    features: [
      'Fresh Windows OS Installation & Setup',
      'Comprehensive BIOS Tuning & Optimization',
      'Manual Memory Timing & Latency Tuning',
      'Precision Boost Overdrive Optimization',
      'Advanced Thermal & Cooling Curve Tuning',
      'Full Stability & Stress-Testing Suite',
      'Windows Debloating & Game Performance Tuning',
    ],
    featured: true, // Also highlight elite
  },
]

export default function PackagesPage() {
  const [hoveredTier, setHoveredTier] = useState<number | null>(null)

  return (
    <main className="min-h-screen relative bg-[#050505] font-sans selection:bg-cyan-500/30 overflow-x-hidden">

      {/* NAVBAR */}
      <SiteHeader />

      {/* Background gradient orbs */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32 pb-20">

        {/* 1. Header (Triple-Layer Glow) */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter font-rajdhani mb-4 sm:mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            style={{
              textShadow: `
                0 0 4px rgba(255, 255, 255, 0.8),
                0 0 20px rgba(0, 245, 255, 0.5),
                0 0 60px rgba(0, 0, 0, 0.8)
              `
            }}
          >
            SYSTEM <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400">BLUEPRINTS</span>
          </motion.h1>
          <motion.p
            className="text-white/50 max-w-2xl mx-auto text-base sm:text-lg font-mono px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Select the optimization blueprint that matches your hardware potential.
          </motion.p>
        </motion.div>

        {/* 3. Pricing Cards (Holographic Tiers) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
              onMouseEnter={() => setHoveredTier(index)}
              onMouseLeave={() => setHoveredTier(null)}
              className={`relative rounded-3xl p-6 sm:p-8 lg:p-10 flex flex-col h-full bg-neutral-900/50 backdrop-blur-xl border transition-all duration-500 group ${tier.border} ${tier.glow} z-30
                ${tier.featured ? 'lg:scale-105 lg:-mt-4' : ''}
                ${hoveredTier === index ? 'scale-[1.02] shadow-2xl' : ''}
              `}
            >
              {/* Featured badge */}
              {tier.featured && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-cyan-500 text-black px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  {tier.name === 'Professional' ? 'Most Popular' : 'Premium'}
                </motion.div>
              )}

              {/* Animated border glow */}
              <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${tier.name === 'Elite' ? 'bg-gradient-to-br from-cyan-500/20 to-transparent' :
                tier.name === 'Professional' ? 'bg-gradient-to-br from-amber-500/20 to-transparent' :
                  'bg-gradient-to-br from-white/10 to-transparent'
                }`} />
              {/* Holographic Header */}
              <div className="mb-6 sm:mb-8 border-b border-white/5 pb-6 sm:pb-8 relative z-10">
                <motion.h3
                  className={`text-3xl sm:text-4xl font-bold font-rajdhani mb-2 ${tier.accent}`}
                  style={{ textShadow: tier.featured ? '0 0 20px currentColor' : 'none' }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {tier.name}
                </motion.h3>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white/40 mb-4 sm:mb-6 font-mono">
                  {tier.subtitle}
                </p>
                <motion.div
                  className="flex items-baseline gap-2"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight">
                    AED {tier.price}
                  </span>
                </motion.div>
              </div>

              {/* Monospace Features List */}
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 flex-grow relative z-10">
                {tier.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + (i * 0.05), duration: 0.4 }}
                    className="flex items-start gap-3 sm:gap-4 group/item hover:translate-x-1 transition-transform duration-300"
                  >
                    <div className={`mt-1 min-w-[16px] h-[16px] flex items-center justify-center ${tier.accent} group-hover/item:scale-125 transition-transform`}>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <span className="text-gray-400 text-sm font-mono leading-relaxed group-hover/item:text-white transition-colors">
                      {feature}
                    </span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div
                className="relative z-10"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={
                    tier.name === 'Starter' ? '/book?package=quick' :
                      tier.name === 'Professional' ? '/book?package=full' :
                        '/book?package=extreme'
                  }
                  target="_blank"
                  className={`w-full py-3 sm:py-4 rounded-xl font-bold text-center uppercase tracking-widest text-xs sm:text-sm font-mono transition-all duration-300 border flex items-center justify-center gap-2 relative overflow-hidden group/btn
                    ${tier.name === 'Elite'
                      ? 'bg-cyan-500 text-black border-cyan-500 hover:bg-cyan-400 hover:shadow-[0_0_40px_rgba(34,211,238,0.6)]'
                      : tier.name === 'Professional'
                        ? 'bg-amber-500 text-black border-amber-500 hover:bg-amber-400 hover:shadow-[0_0_40px_rgba(245,158,11,0.6)]'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 text-white hover:border-white/20'
                    }
                  `}
                >
                  {/* Animated background gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />

                  <span className="relative z-10">SELECT BLUEPRINT</span>
                  <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          className="text-center mt-16 sm:mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-white/40 text-sm font-mono mb-4">
            Not sure which blueprint fits your system?
          </p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm group"
          >
            <span>Get a free consultation</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </main>
  )
}