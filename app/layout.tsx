import './globals.css'
import type { Metadata } from 'next'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  title: 'FPSOS - Frame Per Second Operating System | CS2 Optimization Dubai',
  description: 'Professional CS2 optimization services in Dubai. BIOS tuning, system optimization, and performance analysis for competitive gaming.',
  keywords: 'CS2 optimization, gaming PC tuning, BIOS optimization Dubai, FPS boost, competitive gaming',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
        <Footer />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#111111',
              color: '#ffffff',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(12px)'
            }
          }}
        />
      </body>
    </html>
  )
}

function Navigation() {
  return (
    <nav className="nav-bar" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      backdropFilter: 'blur(20px) saturate(150%)',
      WebkitBackdropFilter: 'blur(20px) saturate(150%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      background: 'rgba(0, 0, 0, 0.75)'
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '0 var(--spacing-3)'
      }}>
        {/* Logo - Apple-refined minimal */}
        <a href="/" className="nav-logo" style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.25rem',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-2)',
          position: 'relative',
          transition: 'opacity 0.2s var(--ease-standard)'
        }}>
          {/* Premium Icon */}
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            fontSize: '1rem',
            color: '#000',
            boxShadow: '0 2px 8px rgba(232, 153, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.25s var(--ease-standard)'
          }}>
            <span style={{ position: 'relative', zIndex: 2 }}>F</span>
          </div>

          {/* Brand Text */}
          <div style={{
            background: 'linear-gradient(135deg, #ffffff 0%, var(--fpsos-orange) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 800,
            letterSpacing: '-0.02em'
          }}>
            FPSOS
          </div>
        </a>

        {/* Navigation Links - Apple precision */}
        <div className="nav-links" style={{
          display: 'flex',
          gap: 'var(--spacing-4)',
          alignItems: 'center'
        }}>
          <a href="/" className="nav-link">Home</a>
          <a href="/packages" className="nav-link">Packages</a>
          <a href="/diagnostic" className="nav-link">Diagnostic</a>
          <a href="/faq" className="nav-link">FAQ</a>
          <a href="/contact" className="nav-link">Contact</a>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: 'var(--spacing-10) 0 var(--spacing-8)',
      marginTop: 'var(--spacing-20)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: 'var(--spacing-8)',
          marginBottom: 'var(--spacing-8)'
        }}>
          <div>
            <h3 style={{
              marginBottom: 'var(--spacing-3)',
              fontSize: '1.25rem',
              fontWeight: 700
            }}>FPSOS</h3>
            <p style={{
              color: 'var(--text-secondary)',
              marginBottom: 'var(--spacing-4)',
              lineHeight: 1.6,
              fontSize: '0.9375rem'
            }}>
              Professional CS2 optimization services in Dubai. Frame up your gameplay.
            </p>
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-3)',
              flexWrap: 'wrap'
            }}>
              <a href="https://discord.gg/K3A6MkNXT9" target="_blank" rel="noopener noreferrer"
                 style={{
                   color: 'var(--text-secondary)',
                   fontSize: '0.9375rem',
                   transition: 'color 0.2s var(--ease-standard)'
                 }}>Discord</a>
              <a href="https://wa.link/jtku16" target="_blank" rel="noopener noreferrer"
                 style={{
                   color: 'var(--text-secondary)',
                   fontSize: '0.9375rem',
                   transition: 'color 0.2s var(--ease-standard)'
                 }}>WhatsApp</a>
              <a href="https://instagram.com/fpsoptimizationstation" target="_blank" rel="noopener noreferrer"
                 style={{
                   color: 'var(--text-secondary)',
                   fontSize: '0.9375rem',
                   transition: 'color 0.2s var(--ease-standard)'
                 }}>Instagram</a>
            </div>
          </div>

          <div>
            <h4 style={{
              marginBottom: 'var(--spacing-3)',
              fontSize: '1rem',
              fontWeight: 600
            }}>Quick Links</h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)'
            }}>
              <a href="/packages" style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                transition: 'color 0.2s var(--ease-standard)'
              }}>Packages</a>
              <a href="/diagnostic" style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                transition: 'color 0.2s var(--ease-standard)'
              }}>Diagnostic Tool</a>
              <a href="/faq" style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                transition: 'color 0.2s var(--ease-standard)'
              }}>FAQ</a>
              <a href="/contact" style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                transition: 'color 0.2s var(--ease-standard)'
              }}>Book Session</a>
              <a href="/terms" style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                transition: 'color 0.2s var(--ease-standard)'
              }}>Terms & Conditions</a>
              <a href="/privacy" style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                transition: 'color 0.2s var(--ease-standard)'
              }}>Privacy Policy</a>
            </div>
          </div>

          <div>
            <h4 style={{
              marginBottom: 'var(--spacing-3)',
              fontSize: '1rem',
              fontWeight: 600
            }}>Services</h4>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--spacing-2)'
            }}>
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem'
              }}>Quick Remote Fix</span>
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem'
              }}>Full System Tune-Up</span>
              <span style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem'
              }}>Extreme BIOSPRIME</span>
            </div>
          </div>
        </div>

        <div style={{
          paddingTop: 'var(--spacing-4)',
          borderTop: '1px solid var(--border-subtle)',
          color: 'var(--text-tertiary)',
          fontSize: '0.875rem',
          textAlign: 'center'
        }}>
          © 2025 FPSOS. All rights reserved. No extreme overclocking—only safe, tested optimizations.
        </div>
      </div>
    </footer>
  )
}
