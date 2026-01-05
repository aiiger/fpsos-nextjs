'use client'

import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants, scaleInVariants } from '@/lib/animations'

export default function PackagesPage() {
  return (
    <main>
      <section className="section" style={{
        paddingTop: 'calc(64px + var(--spacing-10))',
        paddingBottom: 'var(--spacing-12)'
      }}>
        <div className="container">
          {/* Header - Apple-refined elegance */}
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
              letterSpacing: '-0.008em',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
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
          </div>

          {/* Trust Guarantees - Apple-refined trust section */}
          <div style={{
            marginBottom: 'var(--spacing-10)',
            background: 'linear-gradient(135deg, rgba(232, 153, 0, 0.04), rgba(104, 0, 54, 0.04))',
            border: '1px solid rgba(232, 153, 0, 0.12)',
            borderRadius: 'var(--radius-2xl)',
            padding: 'var(--spacing-8) var(--spacing-6)',
            maxWidth: '1000px',
            margin: '0 auto var(--spacing-10)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}>
            <h2 style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-6)',
              fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
              letterSpacing: '-0.025em'
            }}>
              Our <span style={{ color: 'var(--fpsos-orange)' }}>Commitment</span> to You
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--spacing-5)'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.25rem',
                  marginBottom: 'var(--spacing-3)',
                  lineHeight: 1
                }}>✓</div>
                <h4 style={{
                  marginBottom: 'var(--spacing-2)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.015em'
                }}>
                  100% Safe Optimizations
                </h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  letterSpacing: '-0.011em'
                }}>
                  Only tested, manufacturer-approved settings. Your warranty stays intact.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.25rem',
                  marginBottom: 'var(--spacing-3)',
                  lineHeight: 1
                }}>📊</div>
                <h4 style={{
                  marginBottom: 'var(--spacing-2)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.015em'
                }}>
                  Documented Results
                </h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  letterSpacing: '-0.011em'
                }}>
                  Full before/after benchmarks with every optimization session.
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '2.25rem',
                  marginBottom: 'var(--spacing-3)',
                  lineHeight: 1
                }}>💰</div>
                <h4 style={{
                  marginBottom: 'var(--spacing-2)',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  color: 'var(--text-primary)',
                  letterSpacing: '-0.015em'
                }}>
                  48-Hour Guarantee
                </h4>
                <p style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9375rem',
                  lineHeight: 1.6,
                  letterSpacing: '-0.011em'
                }}>
                  Full refund if we don't deliver measurable improvements.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Comparison Table - Apple-refined */}
          <motion.div 
            className="glass-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            style={{
              padding: 'var(--spacing-6) var(--spacing-5)',
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

          {/* FAQ - Apple-refined */}
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
    </main>
  )
}

function ServicePackage({ name, price, color, glowClass, features, calendlyUrl, description, featured }: {
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
      whileHover={{ y: -8, boxShadow: `0 20px 48px ${color}20` }}
      style={{
        padding: 'var(--spacing-8) var(--spacing-6)',
        position: 'relative',
        background: featured ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)',
        border: featured ? `1px solid ${color}30` : '1px solid var(--border-default)',
        borderRadius: 'var(--radius-2xl)',
        transition: 'all 0.3s var(--ease-standard)',
        backdropFilter: 'blur(24px) saturate(140%)',
        WebkitBackdropFilter: 'blur(24px) saturate(140%)',
        boxShadow: featured ? `0 12px 40px ${color}12` : 'none',
        cursor: 'default'
      }}
    >
      {featured && (
        <div style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: `linear-gradient(135deg, ${color}, ${color}dd)`,
          color: '#000',
          padding: 'var(--spacing-1) var(--spacing-3)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.6875rem',
          fontWeight: 700,
          fontFamily: 'var(--font-display)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          boxShadow: `0 4px 16px ${color}30`
        }}>
          Most Popular
        </div>
      )}

      {/* Package Name & Description */}
      <div style={{ marginBottom: 'var(--spacing-5)' }}>
        <h3 style={{
          fontSize: '1.75rem',
          marginBottom: 'var(--spacing-2)',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: '#ffffff'
        }}>
          {name}
        </h3>
        <p style={{
          fontSize: '0.9375rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: 'var(--spacing-4)',
          letterSpacing: '-0.011em'
        }}>
          {description}
        </p>

        {/* Pricing - Apple-refined precision */}
        <div style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--spacing-1)',
          marginBottom: 'var(--spacing-1)'
        }}>
          <span style={{
            fontSize: '3.25rem',
            fontWeight: 700,
            fontFamily: 'var(--font-display)',
            color: color,
            letterSpacing: '-0.03em',
            lineHeight: 1
          }}>
            {price}
          </span>
          <span style={{
            fontSize: '1.25rem',
            color: 'var(--text-secondary)',
            fontWeight: 600,
            letterSpacing: '-0.011em'
          }}>
            AED
          </span>
        </div>
        <p style={{
          fontSize: '0.8125rem',
          color: 'var(--text-tertiary)',
          letterSpacing: '-0.008em'
        }}>
          One-time payment
        </p>
      </div>

      {/* Divider */}
      <div style={{
        height: '1px',
        background: 'var(--border-default)',
        marginBottom: 'var(--spacing-5)'
      }} />

      {/* Features List - Apple-refined spacing */}
      <ul style={{
        listStyle: 'none',
        marginBottom: 'var(--spacing-6)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-2)'
      }}>
        {features.map((feature, i) => (
          <li key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--spacing-2)',
            fontSize: '0.9375rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5,
            letterSpacing: '-0.011em'
          }}>
            <span style={{
              color: color,
              fontSize: '1rem',
              lineHeight: 1,
              marginTop: '2px',
              fontWeight: 700
            }}>✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {/* CTA Button - Apple-refined interaction */}
      <a
        href={calendlyUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="package-btn"
        style={{
          width: '100%',
          background: featured ? color : 'rgba(255, 255, 255, 0.06)',
          color: featured ? '#000' : '#ffffff',
          border: featured ? 'none' : '1px solid var(--border-default)',
          fontWeight: 700,
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'var(--spacing-3) var(--spacing-5)',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.011em',
          transition: 'all 0.25s var(--ease-standard)',
          cursor: 'pointer',
          textDecoration: 'none',
          boxShadow: featured ? `0 4px 16px ${color}25` : 'none',
          backdropFilter: featured ? 'none' : 'blur(12px)',
          WebkitBackdropFilter: featured ? 'none' : 'blur(12px)'
        }}
      >
        Get Started
      </a>
    </div>
  )
}

function ComparisonTable() {
  const features = [
    { name: 'Session Duration', quick: '1 hour', full: '2-3 hours', extreme: '4-6 hours' },
    { name: 'Windows Optimization', quick: '✓', full: '✓', extreme: '✓' },
    { name: 'GPU Drivers', quick: '✓', full: '✓', extreme: '✓' },
    { name: 'BIOS Optimization', quick: '—', full: 'Guided', extreme: 'Deep-dive' },
    { name: 'RAM Tuning', quick: '—', full: 'Basic', extreme: 'Advanced' },
    { name: 'Network Config', quick: 'Basic', full: 'Advanced', extreme: 'Expert' },
    { name: 'Follow-up Support', quick: '—', full: '1 week', extreme: '1 month' },
  ]

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9375rem'
      }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-default)' }}>
            <th style={{ padding: '16px', textAlign: 'left', color: 'var(--text-secondary)' }}>Feature</th>
            <th style={{ padding: '16px', textAlign: 'center', color: 'var(--quick-fix)' }}>Quick Fix</th>
            <th style={{ padding: '16px', textAlign: 'center', color: 'var(--full-tune)' }}>Full Tune-Up</th>
            <th style={{ padding: '16px', textAlign: 'center', color: 'var(--extreme)' }}>Extreme</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, i) => (
            <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
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
      a: 'Absolutely. We only apply safe, tested optimizations that are within manufacturer specifications. No extreme overclocking that risks hardware stability or lifespan. Your system warranty remains intact.'
    },
    {
      q: 'How long do the improvements last?',
      a: 'Optimizations are permanent until you update drivers, BIOS, or change hardware. We provide detailed documentation of every change made, so you can reference it for any future modifications.'
    },
    {
      q: 'What hardware do you support?',
      a: 'We primarily optimize AMD Ryzen systems (especially X3D chips) and NVIDIA GPUs, which make up the majority of competitive CS2 setups. Contact us for Intel or AMD GPU configurations.'
    },
    {
      q: 'What if I don\'t see improvements?',
      a: 'If we can\'t deliver measurable performance improvements with documented before/after benchmarks, we offer a full refund within 48 hours. Your satisfaction is guaranteed.'
    },
    {
      q: 'How does remote optimization work?',
      a: 'We use secure remote desktop software (AnyDesk or TeamViewer) with your permission. You can watch every change we make in real-time, and we explain each optimization step by step.'
    },
    {
      q: 'Do you offer ongoing support?',
      a: 'Yes. All packages include follow-up support (duration varies by package). We\'re available via WhatsApp and Discord for quick questions and troubleshooting.'
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
          whileHover={{ y: -2, borderColor: 'rgba(232, 153, 0, 0.2)', background: 'rgba(255, 255, 255, 0.04)' }}
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
