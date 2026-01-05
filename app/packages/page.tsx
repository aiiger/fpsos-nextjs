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
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'calc(var(--spacing-10) + 40px) var(--spacing-4) var(--spacing-12)',
      background: 'radial-gradient(circle at top, rgba(232, 153, 0, 0.18), transparent 45%), linear-gradient(160deg, #040404 0%, #07000f 50%, #040404 100%)'
    }}>
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--spacing-4)'
      }}>
        {packages.map((pkg) => (
          <PackageCard key={pkg.title} {...pkg} />
        ))}
      </div>
    </div>
  )
}

function PackageCard({ title, price, features, bookingUrl, color }: Package) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        background: '#090909',
        border: `2px solid ${color}`,
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--spacing-5)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-4)',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s var(--ease-standard)',
        boxShadow: `0 30px 60px ${color}15`,
        backgroundImage: `linear-gradient(160deg, ${color}15 0%, rgba(0,0,0,0) 55%)`
      }}
    >
      <div>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 800,
          marginBottom: 'var(--spacing-2)',
          fontFamily: 'var(--font-display)',
          color: '#ffffff'
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
            color: '#f3f3f3',
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
          fontWeight: 800,
          fontSize: '1rem',
          borderRadius: 'var(--radius-md)',
          textDecoration: 'none',
          transition: 'all 0.25s var(--ease-standard)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          boxShadow: `0 12px 40px ${color}40`
        }}
      >
        Book Now
      </a>
    </motion.div>
  )
}

