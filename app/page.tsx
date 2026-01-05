'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <section
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-6)',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: 'url(/fpsos-hero.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Subtle overlay to boost contrast */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.32) 100%)',
          pointerEvents: 'none'
        }}
      />

      <div
        style={{
          maxWidth: '1400px',
          width: '100%',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          color: '#fff'
        }}
      >
        {/* Top nav/icons row */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 'var(--spacing-4)',
            marginBottom: 'var(--spacing-8)',
            flexWrap: 'wrap'
          }}
        >
          <Link
            href="/packages"
            style={{
              color: '#fff',
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textDecoration: 'none',
              fontSize: '1.125rem',
              borderBottom: '2px solid rgba(255,255,255,0.6)',
              paddingBottom: '6px'
            }}
          >
            PACKAGES
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', opacity: 0.9 }}>
            <Link href="https://discord.gg" style={{ color: '#fff', fontSize: '1.25rem' }}>Discord</Link>
            <Link href="https://wa.me/" style={{ color: '#fff', fontSize: '1.25rem' }}>WhatsApp</Link>
            <Link href="https://t.me/" style={{ color: '#fff', fontSize: '1.25rem' }}>Telegram</Link>
            <Link href="https://instagram.com" style={{ color: '#fff', fontSize: '1.25rem' }}>Instagram</Link>
          </div>
        </motion.div>

        {/* Center logo image (Canva export) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          style={{
            width: '100%',
            margin: '0 auto',
            maxWidth: '1280px'
          }}
        >
          <Image
            src="/fpsos-hero.png"
            alt="FPSOS hero"
            width={1366}
            height={768}
            priority
            style={{ width: '100%', height: 'auto', display: 'block', margin: '0 auto' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
