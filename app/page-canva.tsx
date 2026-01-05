'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--spacing-8) var(--spacing-4)',
      position: 'relative'
    }}>
      {/* Hero Content */}
      <div style={{
        maxWidth: '1200px',
        width: '100%',
        textAlign: 'center',
        marginBottom: 'var(--spacing-10)'
      }}>
        {/* FPSOS Logo/Title */}
        <h1 style={{
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          fontWeight: 900,
          fontFamily: 'var(--font-display)',
          letterSpacing: '-0.03em',
          marginBottom: 'var(--spacing-6)',
          textShadow: '0 4px 20px rgba(0, 0, 0, 0.5)'
        }}>
          FPSOS
        </h1>

        {/* Character Illustrations */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 'var(--spacing-8)',
          marginBottom: 'var(--spacing-8)',
          flexWrap: 'wrap'
        }}>
          {/* Reference Canva image for illustrations */}
          <div style={{
            width: '100%',
            maxWidth: '1000px',
            aspectRatio: '16/9',
            position: 'relative',
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden'
          }}>
            <img 
              src="/hero-canva.png" 
              alt="FPSOS Hero" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-4)',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Link 
            href="/packages"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--spacing-2)',
              padding: 'var(--spacing-3) var(--spacing-6)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--radius-full)',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.2s var(--ease-standard)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            PACKAGES
          </Link>
        </div>
      </div>

      {/* Social Icons Footer */}
      <div style={{
        position: 'fixed',
        bottom: 'var(--spacing-6)',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: 'var(--spacing-4)',
        alignItems: 'center'
      }}>
        <a href="https://discord.gg/K3A6MkNXT9" target="_blank" rel="noopener noreferrer" 
           style={{ opacity: 0.8, transition: 'opacity 0.2s' }}>
          <span style={{ fontSize: '2rem' }}>💬</span>
        </a>
        <a href="https://wa.link/jtku16" target="_blank" rel="noopener noreferrer"
           style={{ opacity: 0.8, transition: 'opacity 0.2s' }}>
          <span style={{ fontSize: '2rem' }}>💬</span>
        </a>
        <a href="https://instagram.com/fpsoptimizationstation" target="_blank" rel="noopener noreferrer"
           style={{ opacity: 0.8, transition: 'opacity 0.2s' }}>
          <span style={{ fontSize: '2rem' }}>📷</span>
        </a>
      </div>
    </div>
  )
}
