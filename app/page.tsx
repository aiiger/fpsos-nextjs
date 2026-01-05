'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants, scaleInVariants } from '@/lib/animations'

export default function Home() {
  return (
    <>
      {/* FPSOS Header */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(104, 0, 54, 0.1), rgba(232, 153, 0, 0.05))',
        borderBottom: '1px solid rgba(232, 153, 0, 0.2)',
        padding: 'var(--spacing-4) var(--spacing-6)',
        position: 'relative'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Logo/Brand */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-3)'
          }}>
            <div style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, var(--fpsos-orange) 0%, var(--fpsos-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em'
            }}>
              FPSOS
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase'
            }}>
              Frame Per Second<br />Operating System
            </div>
          </div>

          {/* Contact Info */}
          <div style={{
            display: 'flex',
            gap: 'var(--spacing-4)',
            alignItems: 'center'
          }}>
            <a
              href="https://discord.gg/your-discord"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s var(--ease-standard)',
                fontSize: '0.9375rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fpsos-orange)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <span style={{ fontSize: '1.25rem' }}>💬</span>
              Discord
            </a>
            <a
              href="tel:+971-your-number"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-2)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                transition: 'color 0.2s var(--ease-standard)',
                fontSize: '0.9375rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--fpsos-orange)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              <span style={{ fontSize: '1.25rem' }}>☎️</span>
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 'var(--spacing-12)',
          paddingBottom: 'var(--spacing-12)'
        }}
      >
        <div className="container">
          <motion.div 
            style={{
              textAlign: 'center',
              maxWidth: '1100px',
              margin: '0 auto'
            }}
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
          >
            {/* Logo */}
            <motion.div style={{ marginBottom: 'var(--spacing-6)' }} variants={staggerItemVariants}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-3)' }}>
                <motion.div 
                  style={{
                    width: '64px',
                    height: '64px',
                    background: 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '2rem',
                    color: '#000',
                    boxShadow: '0 8px 32px rgba(232, 153, 0, 0.3), 0 4px 12px rgba(104, 0, 54, 0.2)'
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  F
                </motion.div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 5vw, 3rem)',
                    fontWeight: 900,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, #ffffff 0%, var(--fpsos-orange) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    FPSOS
                  </div>
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-tertiary)',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginTop: 'var(--spacing-1)'
                  }}>
                    Frame Per Second OS
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Badge */}
            <motion.div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: 'var(--spacing-1) var(--spacing-3)',
                background: 'rgba(232, 153, 0, 0.08)',
                border: '1px solid rgba(232, 153, 0, 0.15)',
                borderRadius: 'var(--radius-full)',
                marginBottom: 'var(--spacing-5)',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--fpsos-orange)',
                backdropFilter: 'blur(8px)'
              }}
              variants={staggerItemVariants}
            >
              🎮 Optimized for CS2 Competitive Gaming
            </motion.div>

            {/* Headline */}
            <motion.h1 
              style={{
                fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                lineHeight: 1.08,
                marginBottom: 'var(--spacing-4)',
                background: 'linear-gradient(135deg, #ffffff 0%, var(--fpsos-orange) 50%, var(--fpsos-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
              variants={staggerItemVariants}
            >
              Frame Per Second Operating System
            </motion.h1>

            {/* Description */}
            <motion.p 
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: 'var(--spacing-8)',
                maxWidth: '700px',
                margin: '0 auto var(--spacing-8)',
                letterSpacing: '-0.011em'
              }}
              variants={staggerItemVariants}
            >
              Professional CS2 optimization. Lower latency, higher frame time consistency, maximum competitive edge.
            </motion.p>

            {/* CTA */}
            <motion.div 
              style={{
                display: 'flex',
                gap: 'var(--spacing-2)',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: 'var(--spacing-10)'
              }}
              variants={staggerItemVariants}
            >
              <motion.a 
                href="/diagnostic" 
                style={{
                  display: 'inline-flex',
                  padding: 'var(--spacing-3) var(--spacing-6)',
                  background: 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
                  color: '#ffffff',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '1.0625rem',
                  cursor: 'pointer',
                  border: 'none'
                }}
                whileHover={{ scale: 0.97, boxShadow: '0 12px 32px rgba(232, 153, 0, 0.4)' }}
                whileTap={{ scale: 0.95 }}
              >
                Run Free Diagnostic
              </motion.a>
              <motion.a 
                href="/packages"
                style={{
                  display: 'inline-flex',
                  padding: 'var(--spacing-3) var(--spacing-6)',
                  background: 'rgba(232, 153, 0, 0.15)',
                  color: 'var(--fpsos-orange)',
                  textDecoration: 'none',
                  border: '1px solid rgba(232, 153, 0, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '1.0625rem',
                  cursor: 'pointer'
                }}
                whileHover={{ scale: 0.97, borderColor: 'var(--fpsos-orange)', background: 'rgba(232, 153, 0, 0.25)' }}
                whileTap={{ scale: 0.95 }}
              >
                View Packages
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 'var(--spacing-3)',
                maxWidth: '900px',
                margin: '0 auto'
              }}
              variants={staggerContainerVariants}
              initial="initial"
              animate="animate"
            >
              {[
                { label: '100+', detail: 'Systems Optimized' },
                { label: '+40%', detail: 'Avg FPS Increase', color: 'var(--quick-fix)' },
                { label: '24/7', detail: 'Remote Support', color: 'var(--full-tune)' }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  style={{
                    padding: 'var(--spacing-5)',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    textAlign: 'center',
                    backdropFilter: 'blur(20px)'
                  }}
                  variants={scaleInVariants}
                  whileHover={{ 
                    scale: 1.05,
                    borderColor: 'rgba(232, 153, 0, 0.2)',
                    background: 'rgba(255, 255, 255, 0.06)'
                  }}
                >
                  <div style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: stat.color || 'var(--fpsos-orange)',
                    marginBottom: 'var(--spacing-1)'
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    fontWeight: 600
                  }}>
                    {stat.detail}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section 
        style={{ background: 'var(--bg-deep)' }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: 'var(--spacing-10)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
            What We <span style={{ color: 'var(--fpsos-orange)' }}>Optimize</span>
          </h2>
          <motion.div 
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--spacing-3)' }}
            variants={staggerContainerVariants}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { icon: '⚡', title: 'BIOS Configuration', description: 'Advanced timing, voltages, and power delivery optimization for maximum performance.', color: 'var(--fpsos-purple)' },
              { icon: '🎯', title: 'Windows Registry', description: 'Fine-tune system responsiveness, input latency, and frame pacing.', color: 'var(--quick-fix)' },
              { icon: '🔧', title: 'Driver Optimization', description: 'GPU drivers, chipset, and peripheral configuration for minimal overhead.', color: 'var(--full-tune)' },
              { icon: '📊', title: 'Performance Analysis', description: 'Detailed diagnostics with CapFrameX, LatencyMon, and custom benchmarks.', color: 'var(--extreme)' },
              { icon: '🌐', title: 'Network Tuning', description: 'Router QoS, NIC settings, and packet prioritization for CS2.', color: 'var(--fpsos-orange)' },
              { icon: '💾', title: 'RAM Tuning', description: 'Memory timing optimization for lower latency and better frame consistency.', color: 'var(--fpsos-blue)' }
            ].map((feature, i) => (
              <FeatureCard key={i} {...feature} />
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Trust Section */}
      <section style={{ background: 'var(--bg-deep)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <motion.div 
            style={{
              background: 'rgba(26, 26, 26, 0.85)',
              backdropFilter: 'blur(20px) saturate(150%)',
              border: '1px solid rgba(232, 153, 0, 0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-8)',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 'var(--spacing-4)', color: 'var(--text-primary)' }}>
              Nothing Changes Unless <span style={{ color: 'var(--fpsos-orange)' }}>You Change It</span>
            </h2>
            <p style={{ fontSize: '1.125rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--spacing-6)' }}>
              Windows settings are simple on/off switches—they don't reset or change over time.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--spacing-4)', textAlign: 'left' }}>
              {[
                { icon: '✓', title: 'Permanent', text: 'BIOS and software configs don\'t change on their own.', color: 'var(--quick-fix)' },
                { icon: '✓', title: 'Immediate', text: 'Optimizations take effect immediately after restart.', color: 'var(--full-tune)' },
                { icon: '✓', title: 'Documented', text: 'Detailed documentation for all changes made.', color: 'var(--extreme)' }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  style={{ padding: 'var(--spacing-4)', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}
                  whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                >
                  <div style={{ color: item.color, fontWeight: 700, marginBottom: 'var(--spacing-2)', fontSize: '1.1rem' }}>{item.icon} {item.title}</div>
                  <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', margin: 0 }}>{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  )
}

function FeatureCard({ icon, title, description, color }: any) {
  return (
    <motion.div 
      style={{
        padding: 'var(--spacing-5)',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-lg)',
        backdropFilter: 'blur(24px)',
        cursor: 'default'
      }}
      whileHover={{ 
        y: -8,
        borderColor: color,
        boxShadow: `0 12px 40px ${color}25`
      }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <motion.div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-3)', filter: `drop-shadow(0 4px 12px ${color}40)`, lineHeight: 1 }} whileHover={{ scale: 1.2 }}>
        {icon}
      </motion.div>
      <h3 style={{ marginBottom: 'var(--spacing-2)', fontSize: '1.25rem', letterSpacing: '-0.015em', color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
        {description}
      </p>
    </motion.div>
  )
}

