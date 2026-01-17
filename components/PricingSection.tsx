'use client'

import { motion } from 'framer-motion'
import { PricingCard } from './PricingCard'

const tiers = [
  {
    id: 'starter',
    title: 'Starter',
    descriptor: 'Quick Remote Fix',
    price: 199,
    link: '/book?package=quick',
    features: [
      'Stability triage + diagnostics',
      'Remote desktop optimization',
      'Critical error resolution',
      'Baseline performance tuning',
      '48-hour satisfaction or we re-tune free'
    ]
  },
  {
    id: 'professional',
    title: 'Professional',
    descriptor: 'Full System Tune-Up',
    price: 399,
    link: '/book?package=full',
    highlight: true,
    features: [
      'Complete Windows + driver optimization',
      'Advanced BIOS configuration',
      'Network stack + latency tuning',
      'Storage + memory optimization',
      'Startup + service cleanup',
      '48-hour satisfaction or we re-tune free'
    ]
  },
  {
    id: 'elite',
    title: 'Elite',
    descriptor: 'Extreme BIOSPRIME',
    price: 699,
    link: '/book?package=extreme',
    features: [
      'Fresh Windows OS Installation & Setup',
      'Comprehensive BIOS Tuning & Optimization',
      'Manual Memory Timing & Latency Tuning',
      'Precision Boost Overdrive Optimization',
      'Advanced Thermal & Cooling Curve Tuning',
      'Full Stability & Stress-Testing Suite',
      'Windows Debloating & Game Performance Tuning'
    ]
  }
]

export default function PricingSection() {
  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-18">
      {/* Changed items-start to items-stretch to fix slanting */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="h-full"
          >
            <PricingCard
              title={tier.title}
              price={tier.price.toString()}
              description={tier.descriptor}
              features={tier.features}
              highlighted={tier.highlight}
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}