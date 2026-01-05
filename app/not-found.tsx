'use client'

export default function NotFound() {
  return (
    <>
      <section className="section" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        paddingTop: 'var(--spacing-12)',
        paddingBottom: 'var(--spacing-12)'
      }}>
        <div className="container" style={{
          textAlign: 'center',
          maxWidth: '600px',
          animation: 'fade-in-up 0.8s var(--ease-decelerate)'
        }}>
          <div style={{
            fontSize: '5rem',
            fontWeight: 900,
            background: 'linear-gradient(135deg, var(--fpsos-orange) 0%, var(--fpsos-purple) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 'var(--spacing-4)',
            lineHeight: 1
          }}>
            404
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 'var(--spacing-3)',
            color: 'var(--text-primary)'
          }}>
            Page Not Found
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-6)',
            lineHeight: 1.6
          }}>
            Looks like you've hit a framerate drop. This page doesn't exist, but don't worry - let's get you back on track.
          </p>

          <div style={{
            display: 'flex',
            gap: 'var(--spacing-3)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <a
              href="/"
              style={{
                padding: 'var(--spacing-3) var(--spacing-5)',
                background: 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
                color: '#ffffff',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                transition: 'all 0.2s var(--ease-standard)',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Back to Home
            </a>
            <a
              href="/packages"
              style={{
                padding: 'var(--spacing-3) var(--spacing-5)',
                background: 'rgba(232, 153, 0, 0.15)',
                color: 'var(--fpsos-orange)',
                textDecoration: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                border: '1px solid rgba(232, 153, 0, 0.3)',
                transition: 'all 0.2s var(--ease-standard)',
                display: 'inline-flex',
                alignItems: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(232, 153, 0, 0.25)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(232, 153, 0, 0.15)'
              }}
            >
              View Services
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
