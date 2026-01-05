'use client'

import { motion } from 'framer-motion'

export default function DiagnosticPage() {
  return (
    <>
      <section className="section" style={{
        paddingTop: 'calc(64px + var(--spacing-10))',
        paddingBottom: 'var(--spacing-12)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Icon */}
            <div style={{
              fontSize: '6rem',
              marginBottom: 'var(--spacing-6)',
              display: 'inline-block',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              🔧
            </div>

            {/* Heading */}
            <h1 style={{
              marginBottom: 'var(--spacing-4)',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1
            }}>
              System Diagnostic Tool
            </h1>

            {/* Coming Soon Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: 'var(--spacing-2) var(--spacing-4)',
              background: 'rgba(232, 153, 0, 0.1)',
              border: '1px solid rgba(232, 153, 0, 0.3)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--spacing-6)',
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--fpsos-orange)',
              letterSpacing: '-0.008em'
            }}>
              Coming Soon
            </div>

            {/* Description */}
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              marginBottom: 'var(--spacing-8)',
              maxWidth: '600px',
              margin: '0 auto var(--spacing-8)'
            }}>
              We're building a comprehensive system diagnostics tool that will analyze your PC's gaming performance, identify bottlenecks, and provide personalized recommendations.
            </p>

            {/* Features List */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-10)'
            }}>
              {[
                { icon: '🖥️', title: 'Hardware Analysis', desc: 'GPU, CPU, RAM detection' },
                { icon: '⚡', title: 'Performance Tests', desc: 'Frame time consistency' },
                { icon: '📊', title: 'Recommendations', desc: 'Personalized optimization tips' },
                { icon: '💾', title: 'Reports', desc: 'Download & share results' }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  style={{
                    padding: 'var(--spacing-5)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 'var(--radius-lg)',
                    backdropFilter: 'blur(12px)'
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-2)' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    marginBottom: 'var(--spacing-1)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.015em'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{
                    fontSize: '0.9375rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5
                  }}>
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--spacing-4)',
                letterSpacing: '-0.011em'
              }}>
                In the meantime, book a session for personalized optimization
              </p>
              <a
                href="/contact"
                style={{
                  display: 'inline-flex',
                  padding: 'var(--spacing-3) var(--spacing-6)',
                  background: 'linear-gradient(135deg, var(--fpsos-orange) 0%, var(--fpsos-purple) 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  transition: 'all 0.2s var(--ease-standard)',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Schedule Optimization →
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>
    </>
  )
}
