'use client'

import { motion, useReducedMotion } from 'framer-motion'

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] // Custom easing for smoothness
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function PackagesPage() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div style={{
      minHeight: '100vh',
      padding: 'var(--spacing-4) var(--spacing-4) var(--spacing-8)',
      paddingTop: 'calc(80px + var(--spacing-6))'
    }}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto'
        }}
      >
        {/* Hero Image Section */}
        <motion.div
          variants={itemVariants}
          style={{
            width: '100%',
            marginBottom: 'var(--spacing-8)',
            position: 'relative'
          }}
        >
          {/* Ambient glow - Only animate if motion is allowed */}
          {!shouldReduceMotion && (
            <motion.div
              style={{
                position: 'absolute',
                inset: '-40px',
                background: 'radial-gradient(ellipse at center, rgba(232, 153, 0, 0.12) 0%, transparent 60%)',
                borderRadius: 'var(--radius-2xl)',
                filter: 'blur(60px)',
                zIndex: 0,
                pointerEvents: 'none'
              }}
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}

          <motion.img
            src="/packages-canva.png"
            alt="FPSOS Service Packages"
            variants={itemVariants}
            whileHover={!shouldReduceMotion ? { scale: 1.005 } : {}}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              position: 'relative',
              zIndex: 1,
              borderRadius: 'var(--radius-xl)',
              filter: 'drop-shadow(0 24px 64px rgba(0, 0, 0, 0.4))'
            }}
          />
        </motion.div>

        {/* Package Cards Grid */}
        <motion.div
          variants={itemVariants}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
            gap: 'var(--spacing-5)',
            marginBottom: 'var(--spacing-8)'
          }}
        >
          <PackageCard
            title="Quick Remote Fix"
            subtitle="Fast Solutions"
            price="AED 199"
            features={[
              'No Optimization, Just Solutions',
              'Ideal for crashes & freezing',
              'Fast help, no fluff',
              '1 Support Session (30 Days)',
              'Avg: ~1 Hour'
            ]}
            url="https://calendly.com/fpsoptimizationstation/quickremotefix"
            color="#00CCBC"
            delay={0.1}
          />
          <PackageCard
            title="Full System Tune-Up"
            subtitle="Most Popular"
            price="AED 399"
            features={[
              'Subtick-Optimized Settings',
              'GPU driver optimization',
              'Windows power/latency tuning',
              'Network jitter reduction',
              '2 Support Sessions (30 Days)',
              'Avg: ~2-3 Hours'
            ]}
            url="https://calendly.com/fpsoptimizationstation/fullsystemtuneup"
            color="#FF5A00"
            delay={0.2}
            popular
          />
          <PackageCard
            title="Extreme BIOSPRIME"
            subtitle="Maximum Performance"
            price="AED 699"
            features={[
              'Advanced BIOS/UEFI Config',
              'Memory timing optimization',
              'CPU power delivery tuning',
              'Everything from Full Tune-Up',
              '3 Support Sessions (30 Days)',
              'Avg: ~4-5 Hours'
            ]}
            url="https://calendly.com/fpsoptimizationstation/extremebiosprime"
            color="#FEEE00"
            delay={0.3}
          />
        </motion.div>

        {/* Support Info Banner */}
        <motion.div
          variants={itemVariants}
          style={{
            textAlign: 'center',
            padding: 'var(--spacing-4) var(--spacing-5)',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <span style={{ color: 'var(--fpsos-orange)', marginRight: '8px' }}>✓</span>
          30-day support validity
          <span style={{ margin: '0 12px', opacity: 0.4 }}>•</span>
          Remote via AnyDesk/TeamViewer
          <span style={{ margin: '0 12px', opacity: 0.4 }}>•</span>
          Before/after benchmarks included
        </motion.div>
      </motion.div>
    </div>
  )
}

interface PackageCardProps {
  title: string
  subtitle: string
  price: string
  features: string[]
  url: string
  color: string
  delay: number
  popular?: boolean
}

function PackageCard({ title, subtitle, price, features, url, color, delay, popular }: PackageCardProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={cardVariants}
      whileHover={!shouldReduceMotion ? {
        y: -8,
        transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
      } : {}}
      style={{
        position: 'relative',
        isolation: 'isolate',
        height: '100%'
      }}
    >
      {/* Card glow effect on hover */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-24px',
          background: `radial-gradient(circle at 50% 0%, ${color}40, transparent 65%)`,
          filter: 'blur(48px)',
          opacity: 0,
          zIndex: -1,
          pointerEvents: 'none'
        }}
        whileHover={!shouldReduceMotion ? { opacity: 0.7 } : {}}
        transition={{ duration: 0.4 }}
      />

      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        whileTap={!shouldReduceMotion ? { scale: 0.98 } : {}}
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          padding: 'var(--spacing-7) var(--spacing-6) var(--spacing-6)',
          background: popular
            ? `linear-gradient(135deg, ${color}0A, rgba(255, 255, 255, 0.025))`
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.02))',
          backdropFilter: 'blur(32px) saturate(150%)',
          WebkitBackdropFilter: 'blur(32px) saturate(150%)',
          border: popular
            ? `2.5px solid ${color}`
            : `1.5px solid ${color}50`,
          borderRadius: 'var(--radius-2xl)',
          textDecoration: 'none',
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
          boxShadow: popular
            ? `0 12px 40px ${color}30, 0 4px 12px rgba(0, 0, 0, 0.3)`
            : '0 8px 32px rgba(0, 0, 0, 0.25)'
        }}
      >
        {/* Gradient top border accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${color}, ${color}80, transparent)`,
          opacity: 0.9
        }} />

        {/* Subtle inner glow */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: `radial-gradient(ellipse at top, ${color}08, transparent)`,
          pointerEvents: 'none'
        }} />

        {/* Popular badge */}
        {popular && (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.35, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
            style={{
              position: 'absolute',
              top: 'var(--spacing-5)',
              right: 'var(--spacing-5)',
              padding: '7px 16px',
              background: color,
              color: '#000',
              fontSize: '0.6875rem',
              fontWeight: 900,
              borderRadius: 'var(--radius-full)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              boxShadow: `0 6px 16px ${color}70, inset 0 1px 0 rgba(255,255,255,0.3)`,
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          >
            {subtitle}
          </motion.div>
        )}

        {/* Header Section */}
        <div style={{ marginBottom: 'var(--spacing-3)' }}>
          <h3 style={{
            fontSize: '1.625rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 'var(--spacing-1)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '-0.025em',
            lineHeight: 1.15
          }}>
            {title}
          </h3>
          {!popular && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              opacity: 0.7
            }}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Price Display */}
        <div style={{
          fontSize: '3.25rem',
          fontWeight: 900,
          color,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.04em',
          lineHeight: 0.95,
          marginBottom: 'var(--spacing-6)',
          textShadow: `0 0 48px ${color}50, 0 4px 16px ${color}30`,
          filter: 'brightness(1.1)'
        }}>
          {price}
        </div>

        {/* Features List */}
        <ul style={{
          listStyle: 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-3)',
          flex: 1,
          marginBottom: 'var(--spacing-6)',
          paddingLeft: '4px'
        }}>
          {features.map((feature, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: delay + 0.45 + (i * 0.06),
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1]
              }}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--spacing-2)',
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                fontWeight: 500
              }}
            >
              <span style={{
                color,
                fontSize: '1.25rem',
                lineHeight: 0.9,
                marginTop: '1px',
                flexShrink: 0,
                fontWeight: 600,
                textShadow: `0 0 12px ${color}60`
              }}>✓</span>
              <span>{feature}</span>
            </motion.li>
          ))}
        </ul>

        {/* CTA Button */}
        <motion.div
          whileHover={!shouldReduceMotion ? {
            scale: 1.03,
            boxShadow: `0 8px 24px ${color}60, inset 0 1px 0 rgba(255,255,255,0.3)`
          } : {}}
          whileTap={!shouldReduceMotion ? { scale: 0.97 } : {}}
          style={{
            padding: 'var(--spacing-3) var(--spacing-4)',
            background: color,
            color: '#000',
            textAlign: 'center',
            borderRadius: 'var(--radius-xl)',
            fontWeight: 900,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            fontFamily: 'var(--font-display)',
            boxShadow: `0 6px 20px ${color}50, inset 0 1px 0 rgba(255,255,255,0.25)`,
            transition: 'all 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
            border: '1px solid rgba(255,255,255,0.15)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <span style={{ position: 'relative', zIndex: 1 }}>BOOK NOW →</span>
          {/* Button shimmer effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
            animation: !shouldReduceMotion ? 'shimmer 3s infinite' : 'none'
          }} />
        </motion.div>
      </motion.a>
    </motion.div>
  )
}
