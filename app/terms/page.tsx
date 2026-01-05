'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div style={{
      minHeight: '100vh',
      padding: 'var(--spacing-4)',
      paddingTop: 'calc(64px + var(--spacing-4))'
    }}>
      <div style={{
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Full Canva Image */}
        <div style={{
          width: '100%',
          marginBottom: 'var(--spacing-8)'
        }}>
          <img 
            src="/terms-canva.png" 
            alt="FPSOS Terms & Conditions" 
            style={{
              width: '100%',
              maxWidth: '1600px',
              height: 'auto',
              display: 'block',
              margin: '0 auto'
            }}
          />
        </div>

        {/* Terms Content (Text version for SEO/accessibility) */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--spacing-6)',
          marginBottom: 'var(--spacing-8)'
        }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 800,
            marginBottom: 'var(--spacing-4)',
            textAlign: 'center'
          }}>
            NOTHING CHANGES UNLESS YOU CHANGE IT.
          </h1>

          <div style={{
            fontSize: '1rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-6)'
          }}>
            <p style={{ marginBottom: 'var(--spacing-4)' }}>
              Windows settings are simple on/off switches—they don't reset or change over time. Once we optimize your system, settings stay the same unless you install new software or make changes. BIOS and software configurations do not change on their own. If an adjustment doesn't suit your system, we'll know right away—not months later. Optimizations take effect immediately after a restart. If something stops working months later, it's due to updates, user changes, or interference—not our work. <strong>We make this very clear.</strong>
            </p>
          </div>

          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: 'var(--spacing-3)',
            marginTop: 'var(--spacing-6)'
          }}>
            General Terms
          </h2>
          <div style={{
            fontSize: '0.9375rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)'
          }}>
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              These Terms govern your use of our Site, products, and services. We reserve the right to update, change, or modify these terms at any time without prior notice. Your continued use of the Site after any modifications indicates acceptance of the updated terms.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Use of the Website:</strong> You agree to use this Site lawfully and not engage in fraudulent, harmful, or abusive behavior. We reserve the right to refuse service, terminate accounts, or restrict access if any violations occur.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Products & Services:</strong> All products and services displayed on the Site are subject to availability. We reserve the right to discontinue or modify any product/service at our discretion. Prices and payments: By default, all payments for services provided will be confirmed via the information provided via Calendly. We reserve the right to change pricing or cancel, or refuse any order at our discretion.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Refund & Cancellation Policy:</strong> Refunds and cancellations are subject to our separate Refund Policy. If you receive a defective or incorrect product, please contact us within one day for resolution.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Intellectual Property:</strong> All content on this Site, including images, text, logos, and graphics, is owned by or licensed to FPSOS. You may not copy, reproduce, or distribute our content without written permission.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Limitation of Liability:</strong> We are not liable for any direct, indirect, or consequential damages resulting from the use of our Site or purchased product/service.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Privacy Policy:</strong> Your use of the Site is also governed by our Privacy Policy.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Third-Party Links:</strong> Our Site may contain links to third-party websites, which we do not control. We are not responsible for the content, policies, or practices of third-party sites.
            </p>
            
            <p style={{ marginBottom: 'var(--spacing-3)' }}>
              <strong>Governing Law:</strong> These Terms are governed by the laws of USA/UAE. Any disputes shall be resolved in the courts of USA/UAE.
            </p>
            
            <p style={{
              marginTop: 'var(--spacing-6)',
              padding: 'var(--spacing-4)',
              background: 'rgba(232, 153, 0, 0.1)',
              border: '1px solid rgba(232, 153, 0, 0.3)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              fontWeight: 600
            }}>
              BY USING OUR SITE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREED TO THESE TERMS & CONDITIONS.
            </p>
          </div>
        </div>

        {/* Back to Packages */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-4)',
          marginBottom: 'var(--spacing-8)'
        }}>
          <Link 
            href="/packages"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: 'var(--spacing-3) var(--spacing-6)',
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: 'var(--radius-full)',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              transition: 'all 0.2s var(--ease-standard)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            ← PACKAGES
          </Link>
        </div>

        {/* Social Icons Footer */}
        <div style={{
          display: 'flex',
          gap: 'var(--spacing-4)',
          alignItems: 'center',
          justifyContent: 'center'
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
    </div>
  )
}
