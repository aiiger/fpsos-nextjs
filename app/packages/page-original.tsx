'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations'

export default function PackagesPage() {
  return (
    <>
      <section className="section" style={{
        paddingTop: 'calc(64px + var(--spacing-10))',
        paddingBottom: 'var(--spacing-12)'
      }}>
        <div className="container">
          {/* Header */}
          <motion.div 
            style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-10)',
              maxWidth: '900px',
              margin: '0 auto var(--spacing-10)'
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: 'var(--spacing-2) var(--spacing-4)',
              background: 'rgba(232, 153, 0, 0.08)',
              border: '1px solid rgba(232, 153, 0, 0.15)',
              borderRadius: 'var(--radius-full)',
              marginBottom: 'var(--spacing-4)',
              fontSize: '0.8125rem',
              fontWeight: 600,
              color: 'var(--fpsos-orange)',
              letterSpacing: '-0.008em'
            }}>
              Professional CS2 Optimization Services
            </div>

            <h1 style={{
              marginBottom: 'var(--spacing-3)',
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1
            }}>
              Choose Your <span style={{
                background: 'linear-gradient(135deg, var(--fpsos-orange) 0%, var(--fpsos-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Performance Plan</span>
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              fontWeight: 400,
              letterSpacing: '-0.011em'
            }}>
              Safe, tested optimizations with transparent pricing.
              <br />
              All packages include remote support and personalized configuration.
              <br />
              <span style={{ fontSize: '0.95rem', color: 'var(--text-tertiary)' }}>
                💡 Support tickets are valid for 30 days from session completion
              </span>
            </p>
          </motion.div>

          {/* Service Packages Grid */}
          <motion.div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-10)'
            }}
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
          >
            <ServicePackage
              name="Quick Remote Fix"
              price="199"
              color="var(--quick-fix)"
              glowClass="glow-quick"
              features={[
                'No Optimization, Just Solutions',
                'Ideal if your PC is crashing, freezing or shutting down unexpectedly',
                'Fast help, no fluff',
                '1 Support Session (Valid 30 Days)',
                'Diagnose common PC issues: crashes, shutdowns, freezes',
                'Average Completion: ~1 Hour',
                'Some issues may need follow-up sessions'
              ]}
              calendlyUrl="https://calendly.com/fpsoptimizationstation/quickremotefix"
              description="Fix immediate problems fast"
            />

            <ServicePackage
              name="Full System Tune-Up"
              price="399"
              color="var(--full-tune)"
              glowClass="glow-tune"
              featured
              features={[
                'For competitive gaming',
                'Your all-in-one performance boost: faster FPS, lower latency, smoother gameplay',
                'Full optimization: Windows, BIOS, GPU & network',
                'Smart overclocking/undervolting (CPU/GPU/RAM)',
                '4 Support Tickets (Valid 30 Days)',
                'Stability & Stress Testing to guarantee results'
              ]}
              calendlyUrl="https://calendly.com/fpsoptimizationstation/fullsystemtuneup"
              description="Most popular - complete competitive edge"
            />

            <ServicePackage
              name="Extreme BIOSPRIME"
              price="699"
              color="var(--extreme)"
              glowClass="glow-extreme"
              features={[
                'Extreme BIOS Tuning for Elite Performance',
                'Targeted BIOS tuning for the lowest latency and best RAM timings possible',
                'Perfect for competitive players & enthusiasts',
                'BIOS-only performance tuning',
                'Manual RAM timing optimization',
                'Guided stress testing for each stage',
                'Sessions split as needed to ensure stability'
              ]}
              calendlyUrl="https://calendly.com/fpsoptimizationstation/extremebiosprime"
              description="Maximum performance for enthusiasts"
            />
          </motion.div>

          {/* Trust Guarantees */}
          <div style={{
            marginBottom: 'var(--spacing-10)',
            background: 'linear-gradient(135deg, rgba(232, 153, 0, 0.04), rgba(104, 0, 54, 0.04))',
            border: '1px solid rgba(232, 153, 0, 0.12)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-8) var(--spacing-6)',
            maxWidth: '1000px',
            margin: '0 auto var(--spacing-10)'
          }}>
            <h2 style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-6)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              letterSpacing: '-0.025em'
            }}>
              Our <span style={{ color: 'var(--fpsos-orange)' }}>Commitment</span>
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 'var(--spacing-5)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>✓</div>
                <h4 style={{ marginBottom: 'var(--spacing-2)', fontSize: '1.125rem', fontWeight: 700 }}>
                  100% Safe
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                  Only tested, manufacturer-approved settings.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>📊</div>
                <h4 style={{ marginBottom: 'var(--spacing-2)', fontSize: '1.125rem', fontWeight: 700 }}>
                  Documented
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                  Full before/after benchmarks with every session.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-2)' }}>💰</div>
                <h4 style={{ marginBottom: 'var(--spacing-2)', fontSize: '1.125rem', fontWeight: 700 }}>
                  Guaranteed
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
                  Full refund if we don't deliver measurable improvements.
                </p>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              padding: 'var(--spacing-6)',
              marginBottom: 'var(--spacing-8)'
            }}
          >
            <h2 style={{
              marginBottom: 'var(--spacing-5)',
              textAlign: 'center',
              letterSpacing: '-0.025em'
            }}>
              Package Comparison
            </h2>
            <ComparisonTable />
          </motion.div>

          {/* FAQ */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{ maxWidth: '800px', margin: '0 auto' }}
          >
            <h2 style={{
              marginBottom: 'var(--spacing-5)',
              textAlign: 'center',
              letterSpacing: '-0.025em'
            }}>
              Frequently Asked Questions
            </h2>
            <FAQ />
          </motion.div>
        </div>
      </section>
    </>
  )
}

function ServicePackage({ 
  name, 
  price, 
  color, 
  glowClass, 
  features, 
  calendlyUrl, 
  description, 
  featured 
}: {
  name: string
  price: string
  color: string
  glowClass: string
  features: string[]
  calendlyUrl: string
  description: string
  featured?: boolean
}) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className="package-card"
      whileHover={{ y: -8 }}
      style={{
        padding: 'var(--spacing-8) var(--spacing-6)',
        position: 'relative',
        background: featured ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
        border: featured ? `1px solid ${color}30` : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.3s var(--ease-standard)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)'
      }}
    >
      {featured && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: color,
          color: '#000',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase'
        }}>
          Most Popular
        </div>
      )}

      <div style={{ marginBottom: 'var(--spacing-5)' }}>
        <h3 style={{
          fontSize: '1.75rem',
          marginBottom: 'var(--spacing-2)',
          fontWeight: 700,
          letterSpacing: '-0.02em'
        }}>
          {name}
        </h3>
        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--spacing-4)'
        }}>
          {description}
        </p>
        <div style={{ marginBottom: 'var(--spacing-4)' }}>
          <span style={{ fontSize: '3rem', fontWeight: 800, color: color }}>
            AED {price}
          </span>
          <p style={{ fontSize: '0.9375rem', color: 'var(--text-tertiary)' }}>
            One-time optimization
          </p>
        </div>
      </div>

      <ul style={{ marginBottom: 'var(--spacing-6)', listStyle: 'none', padding: 0 }}>
        {features.map((feature, i) => (
          <li key={i} style={{
            padding: 'var(--spacing-2) 0',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)'
          }}>
            ✓ {feature}
          </li>
        ))}
      </ul>

      <a
        href={calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          width: '100%',
          padding: 'var(--spacing-3)',
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          color: '#000',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: 'pointer',
          transition: 'all 0.2s var(--ease-standard)',
          textAlign: 'center',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        Schedule Now
      </a>
    </motion.div>
  )
}

function ComparisonTable() {
  const features = [
    { name: 'Session Duration', quick: '1 hour', full: '2-3 hours', extreme: '4-6 hours' },
    { name: 'Windows Optimization', quick: '✓', full: '✓', extreme: '✓' },
    { name: 'GPU Drivers', quick: '✓', full: '✓', extreme: '✓' },
    { name: 'BIOS Optimization', quick: '—', full: 'Guided', extreme: 'Deep' },
    { name: 'RAM Tuning', quick: '—', full: 'Basic', extreme: 'Advanced' },
    { name: 'Network Config', quick: 'Basic', full: 'Advanced', extreme: 'Expert' },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9375rem'
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Feature</th>
            <th style={{ padding: '16px', textAlign: 'center', color: 'var(--quick-fix)' }}>Quick Fix</th>
            <th style={{ padding: '16px', textAlign: 'center', color: 'var(--full-tune)' }}>Full Tune</th>
            <th style={{ padding: '16px', textAlign: 'center', color: 'var(--extreme)' }}>Extreme</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <td style={{ padding: '16px', color: 'var(--text-primary)' }}>{feature.name}</td>
              <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{feature.quick}</td>
              <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{feature.full}</td>
              <td style={{ padding: '16px', textAlign: 'center', color: 'var(--text-secondary)' }}>{feature.extreme}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function FAQ() {
  const faqs = [
    {
      q: 'Is this safe for my hardware?',
      a: 'Absolutely. We only apply safe, tested optimizations. Your system warranty remains intact.'
    },
    {
      q: 'How long do improvements last?',
      a: 'Permanent until driver/BIOS updates. We provide full documentation of every change.'
    },
    {
      q: 'What hardware do you support?',
      a: 'AMD Ryzen systems (especially X3D) and NVIDIA GPUs. Contact us for Intel configurations.'
    },
    {
      q: 'What if I don\'t see improvements?',
      a: '48-hour money-back guarantee if we don\'t deliver measurable before/after improvements.'
    },
    {
      q: 'How does remote optimization work?',
      a: 'We use secure remote desktop (AnyDesk/TeamViewer) with your permission. Watch every change.'
    },
    {
      q: 'Do you offer follow-up support?',
      a: 'Yes. All packages include follow-up support via WhatsApp and Discord.'
    }
  ]

  return (
    <motion.div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-3)'
      }}
      variants={staggerContainerVariants}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {faqs.map((faq, i) => (
        <motion.div 
          key={i} 
          variants={staggerItemVariants}
          whileHover={{ y: -2 }}
          style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-4)',
            transition: 'all 0.25s var(--ease-standard)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            cursor: 'default'
          }}
        >
          <h4 style={{
            marginBottom: 'var(--spacing-2)',
            color: 'var(--text-primary)',
            fontSize: '1.125rem',
            fontWeight: 700,
            letterSpacing: '-0.015em'
          }}>
            {faq.q}
          </h4>
          <p style={{
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            fontSize: '0.9375rem',
            fontWeight: 400,
            letterSpacing: '-0.011em'
          }}>
            {faq.a}
          </p>
        </motion.div>
      ))}
    </motion.div>
  )
}
