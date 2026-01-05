'use client'

export default function PrivacyPage() {
  return (
    <main>
      <section className="section" style={{
        paddingTop: 'calc(64px + var(--spacing-10))',
        paddingBottom: 'var(--spacing-12)'
      }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          {/* Header */}
          <div style={{
            marginBottom: 'var(--spacing-10)'
          }}>
            <h1 style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.5rem)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              marginBottom: 'var(--spacing-3)'
            }}>
              Privacy Policy
            </h1>
            <p style={{
              fontSize: '1rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6
            }}>
              Last updated: January 5, 2026
            </p>
          </div>

          {/* Content */}
          <div style={{
            background: 'rgba(26, 26, 26, 0.5)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--spacing-8)'
          }}>
            <div style={{
              lineHeight: 1.8,
              color: 'var(--text-secondary)',
              fontSize: '1rem'
            }}>
              <Section title="1. Overview">
                <p>
                  FPSOS ("we," "us," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website fpsos.gg and use our services.
                </p>
              </Section>

              <Section title="2. Information We Collect">
                <p>
                  <strong>Information You Provide:</strong>
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>Name, email address, phone number</li>
                  <li>Discord username (if provided)</li>
                  <li>Computer system specifications (CPU, RAM, GPU, storage)</li>
                  <li>Performance issues and optimization goals</li>
                  <li>Budget and service preferences</li>
                </ul>

                <p style={{ marginTop: 'var(--spacing-4)' }}>
                  <strong>Information Collected Automatically:</strong>
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>Browser type and version</li>
                  <li>IP address</li>
                  <li>Device type</li>
                  <li>Pages visited and time spent</li>
                  <li>Referrer information</li>
                </ul>
              </Section>

              <Section title="3. How We Use Your Information">
                <ul style={{ paddingLeft: 'var(--spacing-4)' }}>
                  <li>Provide and improve our CS2 optimization services</li>
                  <li>Process booking requests and send quotes</li>
                  <li>Communicate about service status and updates</li>
                  <li>Provide technical support</li>
                  <li>Send promotional emails (with your consent)</li>
                  <li>Analyze service usage and improve user experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </Section>

              <Section title="4. Data Security">
                <p>
                  We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or destruction. This includes:
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>HTTPS encryption for all transmissions</li>
                  <li>Secure data storage and access controls</li>
                  <li>Regular security audits</li>
                  <li>Restricted employee access</li>
                </ul>

                <p style={{ marginTop: 'var(--spacing-4)', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
                  However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your information.
                </p>
              </Section>

              <Section title="5. Data Sharing">
                <p>
                  We do NOT sell your personal information. We may share your information only with:
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>Our technicians (to provide services)</li>
                  <li>Service providers (email, hosting, analytics)</li>
                  <li>Law enforcement (if required by law)</li>
                </ul>
              </Section>

              <Section title="6. Data Retention">
                <p>
                  We retain your personal information only as long as necessary to:
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>Provide services to you</li>
                  <li>Comply with legal obligations</li>
                  <li>Resolve disputes</li>
                  <li>Enforce agreements</li>
                </ul>

                <p style={{ marginTop: 'var(--spacing-4)' }}>
                  You may request deletion of your data at any time by contacting us.
                </p>
              </Section>

              <Section title="7. Your Rights">
                <p>
                  Depending on your location, you may have the right to:
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Withdraw consent (where applicable)</li>
                  <li>Request data portability</li>
                </ul>

                <p style={{ marginTop: 'var(--spacing-4)' }}>
                  To exercise these rights, contact us at privacy@fpsos.gg
                </p>
              </Section>

              <Section title="8. Cookies & Tracking">
                <p>
                  We use cookies and similar tracking technologies to:
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>Remember your preferences</li>
                  <li>Understand website usage</li>
                  <li>Improve user experience</li>
                </ul>

                <p style={{ marginTop: 'var(--spacing-4)' }}>
                  You can control cookies through your browser settings. Disabling cookies may affect some features.
                </p>
              </Section>

              <Section title="9. Third-Party Links">
                <p>
                  Our website may contain links to third-party websites. We are not responsible for their privacy practices. Please review their privacy policies before providing information.
                </p>
              </Section>

              <Section title="10. GDPR & International Compliance">
                <p>
                  If you are located in the EU or other jurisdictions with data protection regulations:
                </p>
                <ul style={{ paddingLeft: 'var(--spacing-4)', marginTop: 'var(--spacing-2)' }}>
                  <li>We process data based on your consent and legitimate interests</li>
                  <li>You have the right to lodge complaints with supervisory authorities</li>
                  <li>We comply with GDPR, CCPA, and similar regulations</li>
                </ul>
              </Section>

              <Section title="11. Children's Privacy">
                <p>
                  Our services are not directed to individuals under 18 years of age. We do not knowingly collect information from children. If you are under 18, please do not use our services.
                </p>
              </Section>

              <Section title="12. Policy Updates">
                <p>
                  We may update this Privacy Policy periodically. Significant changes will be announced via email or prominent website notice. Continued use of our services constitutes acceptance of updated terms.
                </p>
              </Section>

              <Section title="13. Contact Us">
                <p>
                  For privacy questions or requests, contact us at:
                </p>
                <div style={{
                  marginTop: 'var(--spacing-4)',
                  paddingLeft: 'var(--spacing-4)',
                  borderLeft: `2px solid var(--fpsos-orange)`
                }}>
                  <p>
                    <strong>FPSOS</strong><br />
                    Email: privacy@fpsos.gg<br />
                    Website: fpsos.gg<br />
                    Location: Dubai, UAE
                  </p>
                </div>
              </Section>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--spacing-8)' }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 700,
        marginBottom: 'var(--spacing-3)',
        color: 'var(--text-primary)'
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
