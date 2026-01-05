'use client'

import { motion } from 'framer-motion'

type Package = {
  title: string
  price: string
  color: string
  features: string[]
  bookingUrl: string
}

const packages: Package[] = [
  {
    title: 'Quick Remote Fix',
    price: 'AED 199',
    color: '#00CCBC',
    features: [
      'No Optimization, Just Solutions',
      'Ideal if your PC is crashing, freezing or shutting down',
      'Fast help, no fluff',
      '1 Support Session (Valid 30 Days)',
      'Average Completion: ~1 Hour'
    ],
    bookingUrl: 'https://calendly.com/fpsoptimizationstation/quickremotefix'
  },
  {
    title: 'Full System Tune-Up',
    price: 'AED 399',
    color: '#FF5A00',
    features: [
      'Subtick-Optimized Settings',
      'GPU driver optimization',
      'Windows power/latency tuning',
      'Network jitter reduction',
      '2 Support Sessions (Valid 30 Days)',
      'Average Completion: ~2-3 Hours'
    ],
    bookingUrl: 'https://calendly.com/fpsoptimizationstation/fullsystemtuneup'
  },
  {
    title: 'Extreme BIOSPRIME',
    price: 'AED 699',
    color: '#FEEE00',
    features: [
      'Advanced BIOS/UEFI Configuration',
      'Memory timing optimization',
      'CPU power delivery tuning',
      'Everything from Full Tune-Up',
      '3 Support Sessions (Valid 30 Days)',
      'Average Completion: ~4-5 Hours'
    ],
    bookingUrl: 'https://calendly.com/fpsoptimizationstation/extremebiosprime'
  }
]

export default function PackagesPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-8) var(--spacing-4)',
      paddingTop: 'calc(64px + var(--spacing-8))',
      background: 'var(--bg-void)'
    }}>
      <div style={{ maxWidth: '1400px', width: '100%' }}>
        <div style={{
          width: '100%',
          aspectRatio: '16 / 9',
          position: 'relative',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          marginBottom: 'var(--spacing-8)',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <img
            src="/packages-canva.png"
            alt="FPSOS Packages"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              display: 'block'
            }}
          />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-8)'
        }}>
          {packages.map((pkg) => (
            <PackageCard key={pkg.title} {...pkg} />
          ))}
        </div>
      </div>

      <div style={{
        display: 'flex',
        gap: 'var(--spacing-4)',
        alignItems: 'center',
        marginTop: 'var(--spacing-8)'
      }}>
        <SocialIcon href="https://discord.gg/K3A6MkNXT9" label="Discord" emoji="💬" />
        <SocialIcon href="https://wa.link/jtku16" label="WhatsApp" emoji="📱" />
        <SocialIcon href="https://instagram.com/fpsoptimizationstation" label="Instagram" emoji="📷" />
      </div>
    </div>
  )
}

function PackageCard({ title, price, features, bookingUrl, color }: Package) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: `2px solid ${color}40`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s var(--ease-standard)'
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: color
      }} />

      <div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          marginBottom: 'var(--spacing-2)',
          fontFamily: 'var(--font-display)'
        }}>
          {title}
        </h3>
        <div style={{
          fontSize: '2.5rem',
          fontWeight: 900,
          color,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.02em'
        }}>
          {price}
        </div>
      </div>

      <ul style={{
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)',
        flex: 1,
        margin: 0,
        padding: 0
      }}>
        {features.map((feature, i) => (
          <li key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-2)',
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <span style={{ color, fontSize: '1.25rem', lineHeight: 1 }}>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <a
        href={bookingUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          textAlign: 'center',
          padding: 'var(--spacing-3)',
          background: color,
          color: '#000',
          fontWeight: 700,
          fontSize: '1rem',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          transition: 'all 0.2s var(--ease-standard)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
      >
        Book Now
      </a>
    </motion.div>
  )
}

function SocialIcon({ href, emoji, label }: { href: string; emoji: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        opacity: 0.85,
        transition: 'opacity 0.2s',
        fontSize: '2rem',
        textDecoration: 'none'
      }}
    >
      {emoji}
    </a>
  )
}
