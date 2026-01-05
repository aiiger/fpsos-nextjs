export default function TermsPage() {
  return (
    <main>
      <section className="section" style={{ paddingTop: '140px' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h1 style={{ marginBottom: '48px', textAlign: 'center' }}>
            Terms & <span style={{ color: 'var(--fpsos-orange)' }}>Conditions</span>
          </h1>

          <div className="glass-card" style={{ padding: '48px' }}>
            <Section title="1. Service Agreement">
              <p>
                By booking a session with FPSOS, you agree to these terms and conditions.
                Our services are provided remotely via AnyDesk, TeamViewer, or similar remote desktop software.
              </p>
            </Section>

            <Section title="2. Service Scope">
              <p>FPSOS provides:</p>
              <ul>
                <li>BIOS configuration optimization (guided, not direct access)</li>
                <li>Windows registry and system optimization</li>
                <li>GPU driver and peripheral configuration</li>
                <li>Network and router optimization guidance</li>
                <li>Performance testing and validation</li>
              </ul>
              <p style={{ marginTop: '16px' }}>
                We do <strong>NOT</strong> provide:
              </p>
              <ul>
                <li>Extreme overclocking that risks hardware stability</li>
                <li>Warranty-voiding modifications</li>
                <li>Hardware repair or replacement services</li>
                <li>Refunds for user-caused issues post-session</li>
              </ul>
            </Section>

            <Section title="3. Safety & Liability">
              <p>
                All optimizations are <strong>safe and tested</strong>. We only apply configurations
                within manufacturer specifications. However:
              </p>
              <ul>
                <li>
                  <strong>No Warranty Claims:</strong> We are not responsible for existing hardware
                  defects or failures that occur after service if unrelated to our optimizations.
                </li>
                <li>
                  <strong>User Responsibility:</strong> You must provide accurate system information
                  and follow our instructions during remote sessions.
                </li>
                <li>
                  <strong>Backup Recommendation:</strong> We recommend backing up important data
                  before any system modifications (though our changes don't affect user data).
                </li>
              </ul>
            </Section>

            <Section title="4. Performance Expectations">
              <p>
                Performance improvements depend on your hardware, existing configuration, and game settings:
              </p>
              <ul>
                <li>
                  <strong>Typical Results:</strong> 20-50% FPS increase, reduced stuttering,
                  lower input latency
                </li>
                <li>
                  <strong>Variance:</strong> Results vary by hardware. Systems already well-optimized
                  will see smaller gains.
                </li>
                <li>
                  <strong>Guarantee:</strong> If we cannot measurably improve your performance,
                  we offer a full refund within 48 hours of the session.
                </li>
              </ul>
            </Section>

            <Section title="5. Payment & Refunds">
              <ul>
                <li>
                  <strong>Payment:</strong> Payment is due before or immediately after the session
                  via bank transfer, card, or approved payment methods.
                </li>
                <li>
                  <strong>Refund Policy:</strong> Full refund available within 48 hours if no
                  measurable improvement is achieved. After 48 hours, no refunds.
                </li>
                <li>
                  <strong>No Shows:</strong> Sessions not attended without 24-hour notice are non-refundable.
                </li>
              </ul>
            </Section>

            <Section title="6. Support & Follow-Up">
              <p>Support duration varies by package:</p>
              <ul>
                <li><strong>Quick Remote Fix:</strong> No follow-up support included</li>
                <li><strong>Full System Tune-Up:</strong> 1 week of follow-up support</li>
                <li><strong>Extreme BIOSPRIME:</strong> 1 month of priority support</li>
              </ul>
              <p style={{ marginTop: '16px' }}>
                Follow-up support covers questions about applied optimizations and minor adjustments.
                Major changes or new hardware require booking a new session.
              </p>
            </Section>

            <Section title="7. Data & Privacy">
              <ul>
                <li>
                  <strong>Remote Access:</strong> We only access your system during scheduled sessions
                  with your explicit permission via remote desktop software.
                </li>
                <li>
                  <strong>No Data Collection:</strong> We do not collect personal files, passwords,
                  or sensitive information. Diagnostic data is used only for optimization purposes.
                </li>
                <li>
                  <strong>Session Recording:</strong> Sessions may be recorded for quality assurance
                  and training purposes. Recordings are not shared publicly.
                </li>
              </ul>
            </Section>

            <Section title="8. Disclaimers">
              <ul>
                <li>
                  <strong>Anti-Cheat Compatibility:</strong> Our optimizations do not modify game files
                  or circumvent anti-cheat systems. However, FACEIT/Vanguard may require specific BIOS
                  settings (e.g., Secure Boot, TPM). We will configure these as needed.
                </li>
                <li>
                  <strong>Driver Updates:</strong> New GPU/chipset driver updates may reset some
                  optimizations. We recommend documenting changes or booking follow-up sessions after
                  major updates.
                </li>
                <li>
                  <strong>No Hacking/Cheating:</strong> We provide performance optimization only.
                  We do not support, condone, or provide any hacking, cheating, or game modification
                  services.
                </li>
              </ul>
            </Section>

            <Section title="9. Limitation of Liability">
              <p>
                FPSOS and its technicians are not liable for:
              </p>
              <ul>
                <li>Pre-existing hardware defects or failures</li>
                <li>User modifications made after our session</li>
                <li>Third-party software conflicts</li>
                <li>Network or ISP-related performance issues</li>
                <li>Game server performance (not under our control)</li>
              </ul>
              <p style={{ marginTop: '16px' }}>
                Maximum liability is limited to the amount paid for the service.
              </p>
            </Section>

            <Section title="10. Changes to Terms">
              <p>
                We reserve the right to update these terms at any time. Changes will be posted on
                this page with an updated date. Continued use of our services after changes
                constitutes acceptance of the new terms.
              </p>
            </Section>

            <Section title="11. Contact & Disputes">
              <p>
                For questions, concerns, or disputes:
              </p>
              <ul>
                <li>Email: support@fpsos.gg</li>
                <li>Discord: discord.gg/fpsos</li>
                <li>WhatsApp: [Your WhatsApp]</li>
              </ul>
              <p style={{ marginTop: '16px' }}>
                We aim to resolve all disputes amicably within 7 business days.
              </p>
            </Section>
          </div>

          <div style={{
            marginTop: '48px',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: '0.875rem'
          }}>
            <p>Last Updated: January 2025</p>
            <p style={{ marginTop: '8px' }}>
              © 2025 FPSOS. All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '40px' }}>
      <h3 style={{
        color: 'var(--fpsos-orange)',
        marginBottom: '16px',
        fontSize: '1.25rem'
      }}>
        {title}
      </h3>
      <div style={{
        color: 'var(--text-secondary)',
        lineHeight: 1.7,
        fontSize: '0.9375rem'
      }}>
        {children}
      </div>
    </div>
  )
}

// Styled list elements
const style = `
  .glass-card ul {
    margin: 16px 0;
    padding-left: 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .glass-card li {
    color: var(--text-secondary);
    line-height: 1.6;
  }

  .glass-card strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`
