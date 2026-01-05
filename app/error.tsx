'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main>
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
            marginBottom: 'var(--spacing-4)',
            lineHeight: 1
          }}>
            ⚠️
          </div>

          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: 'var(--spacing-3)',
            color: 'var(--text-primary)'
          }}>
            Oops! Something Went Wrong
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: 'var(--text-secondary)',
            marginBottom: 'var(--spacing-2)',
            lineHeight: 1.6
          }}>
            We encountered an unexpected error. Our team has been notified.
          </p>

          {process.env.NODE_ENV === 'development' && (
            <div style={{
              background: 'rgba(255, 67, 58, 0.1)',
              border: '1px solid rgba(255, 67, 58, 0.2)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--spacing-4)',
              marginBottom: 'var(--spacing-6)',
              textAlign: 'left',
              fontSize: '0.75rem',
              fontFamily: 'monospace',
              color: '#FF453A',
              overflow: 'auto',
              maxHeight: '200px'
            }}>
              <p style={{ margin: '0 0 var(--spacing-2) 0' }}>
                <strong>Error Details:</strong>
              </p>
              <p style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                {error.message}
              </p>
            </div>
          )}

          <div style={{
            display: 'flex',
            gap: 'var(--spacing-3)',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={reset}
              style={{
                padding: 'var(--spacing-3) var(--spacing-5)',
                background: 'linear-gradient(135deg, var(--fpsos-purple), var(--fpsos-orange))',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s var(--ease-standard)',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              Try Again
            </button>
            <a
              href="/"
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
              Back to Home
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
