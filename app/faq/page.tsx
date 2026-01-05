'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainerVariants, staggerItemVariants } from '@/lib/animations'

interface FAQItem {
  id: string
  category: 'service' | 'technical' | 'booking' | 'refund'
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  // Service Questions
  {
    id: 'svc-1',
    category: 'service',
    question: 'What is the difference between the three service tiers?',
    answer: 'Quick Remote Fix (AED 199) includes 1-hour optimization covering Windows, GPU drivers, and basic tweaks. Full System Tune-Up (AED 399) is our most popular - 3-4 hours with BIOS optimization, RAM tuning, and DPC latency reduction. Extreme BIOSPRIME (AED 699) is our premium service with complete system overhaul including memory secondary timings, interrupt affinity tuning, and detailed benchmarking.'
  },
  {
    id: 'svc-2',
    category: 'service',
    question: 'Is remote optimization safe for my PC?',
    answer: 'Yes, completely. We use industry-standard remote desktop software and never access personal files. All changes are documented and reversible. We have 100% refund guarantee if you\'re not satisfied. We also create system restore points before making any changes.'
  },
  {
    id: 'svc-3',
    category: 'service',
    question: 'What makes FPSOS different from other optimization services?',
    answer: 'We specialize exclusively in CS2 competitive gaming performance. Our focus is frame time consistency and DPC latency, not just FPS numbers. We understand subtick system tuning, interrupt affinity optimization, and the specific hardware combinations that work best (9800X3D, 7800X3D, high-end DDR5). We\'re gamers who understand the competitive scene.'
  },
  {
    id: 'svc-4',
    category: 'service',
    question: 'Do you support Mac or Linux?',
    answer: 'Currently, we specialize in Windows PC optimization only. Most competitive CS2 players use Windows for better performance. If you have interest in other platforms, contact us - we may be able to help.'
  },
  {
    id: 'svc-5',
    category: 'service',
    question: 'Can you help with older/budget systems?',
    answer: 'Yes! While our expertise is in high-end systems, we can optimize most Windows PCs. Results depend on your hardware. We\'ll provide a free diagnosis to see what\'s possible for your system and recommend the best service tier.'
  },

  // Technical Questions
  {
    id: 'tech-1',
    category: 'technical',
    question: 'What is DPC latency and why does it matter for CS2?',
    answer: 'DPC (Deferred Procedure Call) latency is the delay between when Windows schedules a task and when it executes. High DPC latency (>1000µs) causes frame spikes, inconsistent frame times, and unplayable performance in competitive games. We optimize this through interrupt affinity tuning, driver updates, and disabling unnecessary services.'
  },
  {
    id: 'tech-2',
    category: 'technical',
    question: 'What is the "subtick system" in CS2?',
    answer: 'CS2 uses a tick-agnostic system instead of the old 128-tick. This means your local frame timing matters more than server ticks. Consistent frame times (not just high FPS) are critical. We optimize for frame time variance, not just peak FPS.'
  },
  {
    id: 'tech-3',
    category: 'technical',
    question: 'Should I overclock my RAM?',
    answer: 'Not necessarily. We focus on stable, optimized timings at stock or EXPO speeds. Proper timing tuning (primaries and secondaries) often yields better results than high-frequency unstable overclocks. We\'ll recommend the sweet spot for your specific hardware.'
  },
  {
    id: 'tech-4',
    category: 'technical',
    question: 'What is interrupt affinity and how does it help?',
    answer: 'Interrupt affinity pins hardware interrupts (GPU, network, storage) to specific CPU cores instead of bouncing between them. This reduces DPC latency and frame time variance. We optimize this in BIOS and via software configuration.'
  },
  {
    id: 'tech-5',
    category: 'technical',
    question: 'Will optimization void my warranty?',
    answer: 'No. We only modify BIOS settings and Windows software - nothing physical. BIOS changes are reversible. Hardware changes like overvolting (if used) are user responsibility, but our conservative settings won\'t void warranties.'
  },

  // Booking Questions
  {
    id: 'book-1',
    category: 'booking',
    question: 'How do I schedule a session?',
    answer: 'Fill out the booking form with your system specs and issues. We\'ll contact you within 24 hours with availability and a custom proposal. Sessions are conducted entirely remotely via Discord and TeamViewer/AnyDesk.'
  },
  {
    id: 'book-2',
    category: 'booking',
    question: 'What time zones do you operate in?',
    answer: 'We\'re based in Dubai (GST, UTC+4) but work with international clients. We can typically schedule sessions between 10 AM - 10 PM GST, with flexibility for different time zones. Discord communication is always available.'
  },
  {
    id: 'book-3',
    category: 'booking',
    question: 'How long is a typical session?',
    answer: 'Quick Remote Fix: ~1 hour. Full System Tune-Up: 3-4 hours (may be split into 2 sessions). Extreme BIOSPRIME: 4-6 hours over 1-2 days. You\'ll stay on Discord with our technician the whole time.'
  },
  {
    id: 'book-4',
    category: 'booking',
    question: 'Do I need to provide system access?',
    answer: 'Yes, you\'ll grant remote desktop access to your PC. We use industry-standard encrypted software (TeamViewer/AnyDesk). You can terminate access at any time and see exactly what changes we make.'
  },
  {
    id: 'book-5',
    category: 'booking',
    question: 'What payment methods do you accept?',
    answer: 'We accept bank transfers (AED/USD), cryptocurrency (BTC/ETH), and major credit cards via Stripe. Payment is due before the session begins.'
  },

  // Refund Questions
  {
    id: 'ref-1',
    category: 'refund',
    question: 'What\'s your refund policy?',
    answer: 'We offer a 7-day money-back guarantee. If you\'re not satisfied with results, we\'ll revert all changes and issue a full refund. No questions asked. This is backed by our confidence in our service.'
  },
  {
    id: 'ref-2',
    category: 'refund',
    question: 'What if optimization makes things worse?',
    answer: 'Unlikely, but if it does, we\'ll immediately revert changes and troubleshoot. If we can\'t get you back to baseline within 1 hour, full refund applies. We take responsibility for our work.'
  },
  {
    id: 'ref-3',
    category: 'refund',
    question: 'Do you guarantee FPS improvements?',
    answer: 'We guarantee improved frame time consistency and reduced DPC latency. FPS improvements vary by system - some systems gain 20+ FPS, others gain stability at current FPS. We provide before/after measurements so you can see exactly what improved.'
  },
  {
    id: 'ref-4',
    category: 'refund',
    question: 'What if my PC crashes after optimization?',
    answer: 'We thoroughly test stability before completing a session (1+ hour of gameplay testing). If crashes occur later, we support you free of charge to diagnose and fix. Your satisfaction is guaranteed.'
  }
]

export default function FAQPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'service' | 'technical' | 'booking' | 'refund'>('all')

  const categories = [
    { id: 'all', label: 'All Questions' },
    { id: 'service', label: 'Services' },
    { id: 'technical', label: 'Technical' },
    { id: 'booking', label: 'Booking' },
    { id: 'refund', label: 'Refund & Guarantees' }
  ]

  const filteredFAQs = selectedCategory === 'all'
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory)

  return (
    <main>
      <section className="section" style={{
        paddingTop: 'calc(64px + var(--spacing-10))',
        paddingBottom: 'var(--spacing-12)'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Header */}
          <motion.div 
            style={{
              textAlign: 'center',
              marginBottom: 'var(--spacing-10)'
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
              Got Questions?
            </div>

            <h1 style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 'var(--spacing-3)'
            }}>
              Frequently Asked <span style={{
                background: 'linear-gradient(135deg, var(--fpsos-orange) 0%, var(--fpsos-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>Questions</span>
            </h1>

            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
              letterSpacing: '-0.011em'
            }}>
              Everything you need to know about FPSOS optimization services, booking, and guarantees.
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--spacing-2)',
              justifyContent: 'center',
              marginBottom: 'var(--spacing-10)'
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                style={{
                  padding: 'var(--spacing-2) var(--spacing-4)',
                  background: selectedCategory === category.id
                    ? 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: selectedCategory === category.id ? '#ffffff' : 'var(--text-secondary)',
                  border: selectedCategory === category.id
                    ? 'none'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s var(--ease-standard)'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== category.id) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'
                  }
                }}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* FAQ Items */}
          <motion.div 
            style={{
              display: 'grid',
              gap: 'var(--spacing-3)',
              marginBottom: 'var(--spacing-10)'
            }}
            variants={staggerContainerVariants}
            initial="initial"
            animate="animate"
          >
            {filteredFAQs.map(faq => (
              <FAQItem
                key={faq.id}
                faq={faq}
                isExpanded={expandedId === faq.id}
                onToggle={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
              />
            ))}
          </motion.div>

          {/* Contact CTA */}
          <motion.div 
            style={{
              background: 'rgba(26, 26, 26, 0.85)',
              backdropFilter: 'blur(20px) saturate(150%)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--spacing-8)',
              textAlign: 'center'
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: 'var(--spacing-2)',
              color: 'var(--text-primary)'
            }}>
              Didn't find your answer?
            </h2>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-4)',
              lineHeight: 1.6
            }}>
              Our team is here to help. Reach out via Discord or email, or book a consultation.
            </p>
            <a
              href="/contact"
              style={{
                display: 'inline-flex',
                padding: 'var(--spacing-2) var(--spacing-4)',
                borderRadius: 'var(--radius-md)',
                background: 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
                color: '#ffffff',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s var(--ease-standard)',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Get In Touch
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

function FAQItem({ faq, isExpanded, onToggle }: {
  faq: FAQItem
  isExpanded: boolean
  onToggle: () => void
}) {
  return (
    <motion.div
      onClick={onToggle}
      variants={staggerItemVariants}
      whileHover={{ background: 'rgba(26, 26, 26, 0.95)', borderColor: 'rgba(232, 153, 0, 0.2)' }}
      style={{
        background: 'rgba(26, 26, 26, 0.85)',
        backdropFilter: 'blur(20px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--spacing-4)',
        cursor: 'pointer',
        transition: 'all 0.2s var(--ease-standard)'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 'var(--spacing-4)'
      }}>
        <div style={{ flex: 1 }}>
          <h3 style={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'var(--text-primary)',
            margin: 0,
            textAlign: 'left'
          }}>
            {faq.question}
          </h3>
        </div>
        <div style={{
          fontSize: '1.5rem',
          color: 'var(--fpsos-orange)',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.2s var(--ease-standard)',
          flexShrink: 0
        }}>
          ▼
        </div>
      </div>

      {isExpanded && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            marginTop: 'var(--spacing-4)',
            paddingTop: 'var(--spacing-4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            textAlign: 'left'
          }}
        >
          {faq.answer}
        </motion.div>
      )}
    </motion.div>
  )
}
