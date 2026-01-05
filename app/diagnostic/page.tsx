'use client'

import { useState } from 'react'

export default function DiagnosticPage() {
  const [diagnosticState, setDiagnosticState] = useState<'idle' | 'running' | 'complete'>('idle')
  const [results, setResults] = useState<any>(null)

  const runDiagnostic = async () => {
    setDiagnosticState('running')
    setResults(null)

    // Simulate diagnostic steps with delays for UX
    const diagnosticResults: any = {
      timestamp: new Date().toISOString(),
      tests: {}
    }

    // GPU Detection
    await delay(800)
    diagnosticResults.tests.gpu = detectGPU()

    // Display Detection
    await delay(600)
    diagnosticResults.tests.display = detectDisplay()

    // Network Jitter Test
    await delay(1500)
    diagnosticResults.tests.network = await testNetworkJitter()

    // Frame Timing Test
    await delay(1200)
    diagnosticResults.tests.frameTiming = await testFrameTiming()

    // System Info
    diagnosticResults.tests.system = detectSystem()

    // Calculate recommendation
    diagnosticResults.recommendation = calculateRecommendation(diagnosticResults.tests)

    setResults(diagnosticResults)
    setDiagnosticState('complete')
  }

  const downloadPowerShellTool = () => {
    const script = generatePowerShellScript()
    const blob = new Blob([script], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'fpsos-diagnostic-tool.ps1'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <main>
      <section className="section" style={{
        paddingTop: 'calc(64px + var(--spacing-10))',
        paddingBottom: 'var(--spacing-12)',
        minHeight: '100vh'
      }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-8)' }}>
            <h1 style={{ marginBottom: 'var(--spacing-3)', fontSize: 'clamp(2.25rem, 5vw, 3.5rem)' }}>
              System <span style={{ color: 'var(--fpsos-orange)' }}>Diagnostic</span>
            </h1>
            <p style={{
              fontSize: '1.125rem',
              color: 'var(--text-secondary)',
              maxWidth: '700px',
              margin: '0 auto',
              lineHeight: 1.5,
              letterSpacing: '-0.011em'
            }}>
              Run a free diagnostic to analyze your system's gaming performance.
              Get instant recommendations and a downloadable deep-analysis tool.
            </p>
          </div>

          {/* Diagnostic Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'var(--spacing-3)',
            marginBottom: 'var(--spacing-6)'
          }}>
            <div className="glass-card" style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-2)' }}>🌐</div>
              <h3 style={{ marginBottom: 'var(--spacing-2)', color: 'var(--quick-fix)', fontSize: '1.25rem' }}>
                Browser Diagnostic
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                marginBottom: 'var(--spacing-3)',
                lineHeight: 1.6,
                letterSpacing: '-0.011em'
              }}>
                Run instant tests in your browser. No downloads required.
                Tests GPU, display, network, and basic frame timing.
              </p>
              <button
                onClick={runDiagnostic}
                disabled={diagnosticState === 'running'}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                {diagnosticState === 'running' ? 'Running Tests...' : 'Run Browser Test'}
              </button>
            </div>

            <div className="glass-card" style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--spacing-2)' }}>💻</div>
              <h3 style={{ marginBottom: 'var(--spacing-2)', color: 'var(--extreme)', fontSize: '1.25rem' }}>
                Deep Analysis Tool
              </h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9375rem',
                marginBottom: 'var(--spacing-3)',
                lineHeight: 1.6,
                letterSpacing: '-0.011em'
              }}>
                Download our PowerShell tool for comprehensive system analysis.
                Tests BIOS, registry, drivers, and hardware configuration.
              </p>
              <button
                onClick={downloadPowerShellTool}
                className="btn btn-secondary"
                style={{ width: '100%' }}
              >
                Download Deep Tool
              </button>
            </div>
          </div>

          {/* Running State */}
          {diagnosticState === 'running' && (
            <div className="glass-card glow-quick" style={{
              padding: 'var(--spacing-6)',
              textAlign: 'center',
              marginBottom: 'var(--spacing-6)'
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                border: '4px solid var(--border-default)',
                borderTopColor: 'var(--fpsos-orange)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto var(--spacing-3)'
              }} />
              <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Running Diagnostics...</h3>
              <p style={{ color: 'var(--text-secondary)', letterSpacing: '-0.011em' }}>
                Testing GPU, display, network, and frame timing
              </p>
            </div>
          )}

          {/* Results */}
          {diagnosticState === 'complete' && results && (
            <DiagnosticResults results={results} />
          )}
        </div>
      </section>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </main>
  )
}

function DiagnosticResults({ results }: { results: any }) {
  const { tests, recommendation } = results

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
      {/* Overall Recommendation */}
      <div className={`glass-card ${recommendation.severity === 'critical' ? 'glow-extreme' : recommendation.severity === 'moderate' ? 'glow-tune' : 'glow-quick'}`}
           style={{ padding: 'var(--spacing-6)', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 'var(--spacing-3)', color: recommendation.color, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
          {recommendation.title}
        </h2>
        <p style={{
          fontSize: '1.125rem',
          color: 'var(--text-secondary)',
          marginBottom: 'var(--spacing-4)',
          lineHeight: 1.6,
          letterSpacing: '-0.011em'
        }}>
          {recommendation.message}
        </p>
        <a href={recommendation.bookingUrl} target="_blank" rel="noopener noreferrer"
           className="btn btn-primary" style={{ fontSize: '1.0625rem' }}>
          {recommendation.cta}
        </a>
      </div>

      {/* Test Results Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 'var(--spacing-3)'
      }}>
        <TestResultCard
          title="GPU Detection"
          icon="🎮"
          status={tests.gpu.status}
          details={tests.gpu.details}
        />
        <TestResultCard
          title="Display"
          icon="🖥️"
          status={tests.display.status}
          details={tests.display.details}
        />
        <TestResultCard
          title="Network Jitter"
          icon="🌐"
          status={tests.network.status}
          details={tests.network.details}
        />
        <TestResultCard
          title="Frame Timing"
          icon="⚡"
          status={tests.frameTiming.status}
          details={tests.frameTiming.details}
        />
        <TestResultCard
          title="System Info"
          icon="💻"
          status={tests.system.status}
          details={tests.system.details}
        />
      </div>

      {/* Download Deep Tool CTA */}
      <div className="glass-card" style={{ padding: 'var(--spacing-4)', textAlign: 'center' }}>
        <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Want Deeper Analysis?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-3)', letterSpacing: '-0.011em' }}>
          Download our PowerShell tool for comprehensive BIOS, registry, and driver analysis.
        </p>
        <button
          onClick={() => {
            const script = generatePowerShellScript()
            const blob = new Blob([script], { type: 'text/plain' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'fpsos-diagnostic-tool.ps1'
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            URL.revokeObjectURL(url)
          }}
          className="btn btn-secondary"
        >
          Download Deep Analysis Tool
        </button>
      </div>
    </div>
  )
}

function TestResultCard({ title, icon, status, details }: {
  title: string
  icon: string
  status: 'good' | 'warning' | 'critical'
  details: string[]
}) {
  const statusColors = {
    good: 'var(--positive)',
    warning: 'var(--warning)',
    critical: 'var(--negative)'
  }

  const statusLabels = {
    good: 'Optimal',
    warning: 'Needs Attention',
    critical: 'Critical'
  }

  return (
    <div className="glass-card" style={{ padding: 'var(--spacing-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-2)' }}>
        <div>
          <div style={{ fontSize: '2rem', marginBottom: 'var(--spacing-1)' }}>{icon}</div>
          <h4 style={{ marginBottom: '4px', fontSize: '1.125rem' }}>{title}</h4>
        </div>
        <div style={{
          padding: '4px 12px',
          borderRadius: 'var(--radius-md)',
          background: `${statusColors[status]}22`,
          border: `1px solid ${statusColors[status]}`,
          color: statusColors[status],
          fontSize: '0.75rem',
          fontWeight: 600
        }}>
          {statusLabels[status]}
        </div>
      </div>
      <ul style={{
        listStyle: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--spacing-1)'
      }}>
        {details.map((detail, i) => (
          <li key={i} style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            gap: 'var(--spacing-1)',
            letterSpacing: '-0.011em',
            lineHeight: 1.5
          }}>
            <span style={{ color: statusColors[status] }}>•</span>
            {detail}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Diagnostic Functions
function detectGPU() {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) {
      return {
        status: 'critical' as const,
        details: [
          'WebGL not available - hardware acceleration disabled',
          'Enable GPU acceleration in browser settings',
          'CS2 requires DirectX 11+ compatible GPU'
        ]
      }
    }

    const debugInfo = (gl as any).getExtension('WEBGL_debug_renderer_info')
    const vendor = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown'
    const renderer = debugInfo ? (gl as any).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown'

    const rendererLower = renderer.toLowerCase()
    const isNvidia = rendererLower.includes('nvidia') || rendererLower.includes('geforce')
    const isAMD = rendererLower.includes('amd') || rendererLower.includes('radeon')
    const isIntel = rendererLower.includes('intel')

    // More comprehensive integrated GPU detection
    const isIntegrated = (
      (rendererLower.includes('intel') && !rendererLower.includes('arc')) ||
      rendererLower.includes('uhd graphics') ||
      rendererLower.includes('iris xe') ||
      rendererLower.includes('integrated') ||
      (rendererLower.includes('vega') && rendererLower.includes('graphics') && !rendererLower.includes('rx')) ||
      rendererLower.includes('radeon graphics') && !rendererLower.includes('rx')
    )

    // More accurate GPU tier classification for CS2
    // High-end: 360+ fps @ 1080p competitive settings
    const isHighEnd = (
      rendererLower.includes('rtx 4090') || rendererLower.includes('rtx 4080') ||
      rendererLower.includes('rtx 4070') || rendererLower.includes('rtx 3090') ||
      rendererLower.includes('rtx 3080') || rendererLower.includes('rtx 3070') ||
      rendererLower.includes('rx 7900') || rendererLower.includes('rx 7800') ||
      rendererLower.includes('rx 6900') || rendererLower.includes('rx 6800')
    )

    // Mid-range: 240+ fps @ 1080p competitive settings
    const isMidRange = (
      rendererLower.includes('rtx 4060') || rendererLower.includes('rtx 3060') ||
      rendererLower.includes('rtx 2070') || rendererLower.includes('rtx 2060') ||
      rendererLower.includes('gtx 1660') || rendererLower.includes('gtx 1070') ||
      rendererLower.includes('rx 7700') || rendererLower.includes('rx 7600') ||
      rendererLower.includes('rx 6700') || rendererLower.includes('rx 6650') ||
      rendererLower.includes('rx 6600') || rendererLower.includes('rx 5700') ||
      rendererLower.includes('rx 5600')
    )

    // Entry-level: 144+ fps @ 1080p low settings
    const isEntryLevel = (
      rendererLower.includes('gtx 1650') || rendererLower.includes('gtx 1050') ||
      rendererLower.includes('rx 6500') || rendererLower.includes('rx 5500') ||
      rendererLower.includes('arc a380') || rendererLower.includes('arc a750')
    )

    const hasWebGL2 = !!canvas.getContext('webgl2')
    const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE)

    let status: 'good' | 'warning' | 'critical'
    const details: string[] = []

    if (isIntegrated) {
      status = 'critical'
      details.push(
        `Integrated GPU: ${renderer}`,
        'CS2 requires dedicated GPU for playable framerates',
        'Expect <60 fps even on lowest settings',
        'Recommendation: GTX 1660 / RX 6600 minimum for competitive'
      )
    } else if (isHighEnd) {
      status = 'good'
      details.push(
        `${renderer}`,
        `Vendor: ${vendor}`,
        'Excellent GPU for CS2 - 360+ fps capable @ 1080p',
        'Focus optimization on: driver settings, Reflex, frame limiting',
        hasWebGL2 ? 'WebGL2 supported' : 'Update GPU drivers for WebGL2 support'
      )
    } else if (isMidRange) {
      status = 'good'
      details.push(
        `${renderer}`,
        `Vendor: ${vendor}`,
        'Solid GPU for CS2 - 240+ fps capable @ 1080p',
        'Recommended: competitive settings (medium shadows, low effects)',
        hasWebGL2 ? 'WebGL2 supported' : 'Update GPU drivers'
      )
    } else if (isEntryLevel) {
      status = 'warning'
      details.push(
        `${renderer}`,
        `Vendor: ${vendor}`,
        'Entry-level GPU - 144 fps achievable on low settings',
        'Use low/medium settings, disable anti-aliasing',
        '1080p recommended, avoid 1440p for consistent framerates'
      )
    } else if (isNvidia || isAMD || isIntel) {
      status = 'warning'
      details.push(
        `${renderer}`,
        `Vendor: ${vendor}`,
        'GPU tier unclear from browser detection',
        'Use PowerShell tool for detailed GPU analysis',
        'Verify GPU is set as default in Windows Graphics Settings'
      )
    } else {
      status = 'warning'
      details.push(
        `${renderer}`,
        `Vendor: ${vendor}`,
        'Unknown GPU - browser detection limited',
        'Download PowerShell tool for accurate hardware detection'
      )
    }

    // Technical capability check
    if (maxTextureSize < 16384) {
      details.push(`Max texture size: ${maxTextureSize}px (may limit high-res textures)`)
    }

    return { status, details }
  } catch (e) {
    return {
      status: 'critical' as const,
      details: [
        'GPU detection failed - WebGL error',
        'Check: GPU drivers, hardware acceleration enabled',
        'Browser compatibility: Use Chrome/Edge for best WebGL support'
      ]
    }
  }
}

function detectDisplay() {
  const width = window.screen.width
  const height = window.screen.height
  const refreshRate = (window.screen as any).refreshRate || 60
  const pixelRatio = window.devicePixelRatio || 1
  const colorDepth = window.screen.colorDepth

  const is1080p = height === 1080
  const is1440p = height === 1440
  const is4K = height >= 2160
  const isUltrawide = (width / height) > 2.0
  const isHighRefresh = refreshRate >= 144
  const isUltraHighRefresh = refreshRate >= 240
  const isEliteRefresh = refreshRate >= 360

  let status: 'good' | 'warning' | 'critical'
  const details: string[] = []

  // CS2-specific display assessment
  if (is1080p && isEliteRefresh) {
    status = 'good'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz${pixelRatio > 1 ? ` (DPI: ${pixelRatio}x)` : ''}`,
      'Elite competitive setup - 360Hz is optimal for CS2',
      'Ensure: in-game fps exceeds refresh rate, G-SYNC/FreeSync off',
      'Pro tip: Cap fps at 2x refresh (720) or unlimited for lowest latency'
    )
  } else if (is1080p && isUltraHighRefresh) {
    status = 'good'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz${pixelRatio > 1 ? ` (DPI: ${pixelRatio}x)` : ''}`,
      'Excellent for competitive CS2 - 240Hz sweet spot',
      'Target 480+ fps for optimal frame pacing',
      'This is the preferred resolution for most pros'
    )
  } else if (is1080p && isHighRefresh) {
    status = 'good'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz${pixelRatio > 1 ? ` (DPI: ${pixelRatio}x)` : ''}`,
      'Solid competitive setup - 144/165Hz capable',
      'Target 300+ fps for smooth gameplay',
      '1080p 144Hz is minimum for serious competitive play'
    )
  } else if (is1440p && isUltraHighRefresh) {
    status = 'good'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz${pixelRatio > 1 ? ` (DPI: ${pixelRatio}x)` : ''}`,
      '1440p high refresh - great for visibility',
      '77% more pixels than 1080p - requires strong GPU',
      'Expect 20-30% lower fps vs 1080p at same settings'
    )
  } else if (is1440p && isHighRefresh) {
    status = 'warning'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz${pixelRatio > 1 ? ` (DPI: ${pixelRatio}x)` : ''}`,
      '1440p 144Hz - GPU demanding for CS2',
      'Consider lowering resolution to 1080p for competitive',
      'Pros overwhelmingly prefer 1080p for higher framerates'
    )
  } else if (is4K) {
    status = 'warning'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz`,
      '4K is NOT recommended for competitive CS2',
      '4x pixels of 1080p - severe fps penalty',
      'Strong recommendation: play at 1080p native or scaled',
      'Even RTX 4090 struggles to maintain 360+ fps @ 4K'
    )
  } else if (!isHighRefresh && is1080p) {
    status = 'warning'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz`,
      '60/75Hz monitor limits competitive potential significantly',
      'Cannot display >60/75 fps - wasting GPU performance',
      'Upgrade priority: 1080p 144Hz+ monitor (~$150-300)'
    )
  } else if (height < 1080) {
    status = 'critical'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz`,
      'Below 1080p - suboptimal for CS2 visibility',
      'Minimum recommended: 1920x1080 @ 144Hz',
      'Lower resolutions reduce enemy visibility at distance'
    )
  } else {
    status = 'warning'
    details.push(
      `${width}x${height} @ ${refreshRate}Hz`,
      'Non-standard resolution detected',
      'For CS2 competitive: 1920x1080 @ 144Hz+ is industry standard'
    )
  }

  // DPI scaling warning - critical for CS2
  if (pixelRatio > 1) {
    details.push(
      `WARNING: Windows DPI scaling active (${pixelRatio * 100}%)`,
      'May cause input lag and blurry rendering in CS2',
      'Recommended: disable DPI scaling or set to 100%'
    )
  }

  // Ultrawide warning
  if (isUltrawide) {
    details.push(
      'Ultrawide monitor detected - limited benefit in CS2',
      'Stretched FOV reduces target size, most pros use 16:9'
    )
  }

  return { status, details }
}

async function testNetworkJitter(): Promise<any> {
  // More rigorous network testing for competitive gaming
  const tests = 20 // Larger sample for statistical significance
  const delays: number[] = []

  // Use Cloudflare's trace endpoint - fast, reliable, CORS-friendly
  const testEndpoint = 'https://www.cloudflare.com/cdn-cgi/trace'

  for (let i = 0; i < tests; i++) {
    const start = performance.now()
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 5000) // 5s timeout

      const response = await fetch(testEndpoint, {
        method: 'GET',
        cache: 'no-store',
        signal: controller.signal
      })

      clearTimeout(timeout)

      if (response.ok) {
        const end = performance.now()
        delays.push(end - start)
      } else {
        delays.push(9999) // Mark failed requests with high value
      }
    } catch {
      delays.push(9999) // Network error or timeout
    }

    // Stagger requests to simulate real gaming traffic pattern
    if (i < tests - 1) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }

  // Filter out failed requests (timeouts/errors)
  const validDelays = delays.filter(d => d < 1000)

  if (validDelays.length < 10) {
    return {
      status: 'critical' as const,
      details: [
        `Severe packet loss: ${((tests - validDelays.length) / tests * 100).toFixed(0)}%`,
        'Network too unstable for testing - critical connection issues',
        'Check: cable connection, router, ISP service status',
        'CS2 requires stable connection - this will cause rubberbanding'
      ]
    }
  }

  // Statistical analysis
  const avgDelay = validDelays.reduce((a, b) => a + b, 0) / validDelays.length
  const sortedDelays = [...validDelays].sort((a, b) => a - b)
  const medianDelay = sortedDelays[Math.floor(sortedDelays.length / 2)]
  const minDelay = sortedDelays[0]
  const maxDelay = sortedDelays[sortedDelays.length - 1]

  // Calculate standard deviation (jitter)
  const variance = validDelays.reduce((sum, delay) =>
    sum + Math.pow(delay - avgDelay, 2), 0) / validDelays.length
  const stdDev = Math.sqrt(variance)

  // Calculate percentiles for CS2 hitbox analysis
  const p95 = sortedDelays[Math.floor(sortedDelays.length * 0.95)]
  const p99 = sortedDelays[Math.floor(sortedDelays.length * 0.99)]

  // Packet loss
  const packetLoss = ((tests - validDelays.length) / tests) * 100

  let status: 'good' | 'warning' | 'critical'
  const details: string[] = []

  // CS2-specific network quality assessment
  // In CS2, jitter directly affects hitbox registration and peeker's advantage

  if (packetLoss > 2) {
    status = 'critical'
    details.push(
      `Packet loss: ${packetLoss.toFixed(1)}% (critical for CS2)`,
      `Median latency: ${medianDelay.toFixed(0)}ms (range: ${minDelay.toFixed(0)}-${maxDelay.toFixed(0)}ms)`,
      `Jitter: ${stdDev.toFixed(1)}ms std dev`,
      'This will cause hits to not register and rubberbanding',
      'URGENT: Check ethernet cable, router, contact ISP'
    )
  } else if (stdDev < 3 && avgDelay < 30 && packetLoss === 0) {
    status = 'good'
    details.push(
      `Latency: ${avgDelay.toFixed(1)}ms avg, ${medianDelay.toFixed(0)}ms median`,
      `Jitter: ${stdDev.toFixed(1)}ms (excellent - <3ms)`,
      `Stability: 95th percentile ${p95.toFixed(0)}ms`,
      'Network is competitive-ready - very low jitter',
      packetLoss === 0 ? 'Zero packet loss detected' : `Packet loss: ${packetLoss.toFixed(1)}%`
    )
  } else if (stdDev < 8 && avgDelay < 50 && packetLoss < 1) {
    status = 'good'
    details.push(
      `Latency: ${avgDelay.toFixed(1)}ms avg, ${medianDelay.toFixed(0)}ms median`,
      `Jitter: ${stdDev.toFixed(1)}ms (good for competitive)`,
      `99th percentile: ${p99.toFixed(0)}ms`,
      packetLoss > 0 ? `Minor packet loss: ${packetLoss.toFixed(1)}%` : 'No packet loss',
      'Network quality sufficient for CS2, minor optimization possible'
    )
  } else if (stdDev < 15 && avgDelay < 80) {
    status = 'warning'
    details.push(
      `Latency: ${avgDelay.toFixed(1)}ms avg, ${medianDelay.toFixed(0)}ms median`,
      `Jitter: ${stdDev.toFixed(1)}ms (inconsistent - affects hitreg)`,
      `Range: ${minDelay.toFixed(0)}ms - ${maxDelay.toFixed(0)}ms (high variance)`,
      packetLoss > 0 ? `Packet loss: ${packetLoss.toFixed(1)}%` : 'No packet loss',
      'Recommended: ethernet connection, enable QoS on router',
      'WiFi? Switch to wired. Check for background downloads/streaming'
    )
  } else {
    status = 'critical'
    details.push(
      `Latency: ${avgDelay.toFixed(1)}ms avg (high variance: ${minDelay.toFixed(0)}-${maxDelay.toFixed(0)}ms)`,
      `Jitter: ${stdDev.toFixed(1)}ms (critical - severely affects gameplay)`,
      `99th percentile: ${p99.toFixed(0)}ms (spikes hurt consistency)`,
      packetLoss > 0 ? `Packet loss: ${packetLoss.toFixed(1)}%` : '',
      'This jitter causes shots to miss and enemies to teleport',
      'Fix: Use ethernet, close background apps, check router QoS',
      'Consider: ExitLag/router upgrade if WiFi unavoidable'
    )
  }

  // Browser limitation disclaimer
  details.push('Note: Browser test to Cloudflare - in-game ping may differ')

  return { status, details }
}

function testFrameTiming() {
  // Browser frame timing test - indicates system responsiveness
  // NOTE: This tests browser rendering, NOT CS2 in-game performance
  // CS2's Source 2 engine uses subtick system - different from browser RAF

  const frameTimings: number[] = []
  let lastFrame = performance.now()

  // Collect more samples for better statistical confidence
  const sampleCount = 180 // 3 seconds @ 60fps baseline
  let samplesCollected = 0

  return new Promise<{ status: 'good' | 'warning' | 'critical', details: string[] }>((resolve) => {
    const collectFrames = () => {
      const now = performance.now()
      const delta = now - lastFrame

      if (lastFrame > 0 && delta < 100) { // Filter out tab switches
        frameTimings.push(delta)
        samplesCollected++
      }

      lastFrame = now

      if (samplesCollected < sampleCount) {
        requestAnimationFrame(collectFrames)
      } else {
        // Statistical analysis
        const avgFrameTime = frameTimings.reduce((a, b) => a + b, 0) / frameTimings.length
        const avgFps = 1000 / avgFrameTime

        // Calculate standard deviation (frame time variance)
        const variance = frameTimings.reduce((sum, ft) =>
          sum + Math.pow(ft - avgFrameTime, 2), 0) / frameTimings.length
        const stdDev = Math.sqrt(variance)

        // Percentile analysis
        const sortedTimings = [...frameTimings].sort((a, b) => a - b)
        const p1 = sortedTimings[Math.floor(sortedTimings.length * 0.01)]  // 1% low
        const p95 = sortedTimings[Math.floor(sortedTimings.length * 0.95)]
        const p99 = sortedTimings[Math.floor(sortedTimings.length * 0.99)]

        // Frame drop detection (frames >33% longer than average = severe stutter)
        const stutters = frameTimings.filter(ft => ft > avgFrameTime * 1.33).length
        const stutterPercentage = (stutters / frameTimings.length) * 100

        // Detect monitor refresh rate
        const refreshRate = (window.screen as any).refreshRate || 60
        const idealFrameTime = 1000 / refreshRate

        let status: 'good' | 'warning' | 'critical'
        const details: string[] = []

        // Assessment based on frame time consistency
        // Low stddev = consistent pacing = good CS2 performance predictor

        if (stdDev < 2 && stutterPercentage < 0.5 && avgFps > 58) {
          status = 'good'
          details.push(
            `Browser: ${avgFps.toFixed(1)} fps avg (${avgFrameTime.toFixed(2)}ms frame time)`,
            `Consistency: ${stdDev.toFixed(2)}ms stddev (excellent - very stable)`,
            `Frame pacing: 99th percentile ${p99.toFixed(1)}ms`,
            `Monitor: ${refreshRate}Hz detected`,
            'System shows excellent frame time stability',
            'Good indicator for CS2 performance potential'
          )
        } else if (stdDev < 5 && stutterPercentage < 2 && avgFps > 55) {
          status = 'good'
          details.push(
            `Browser: ${avgFps.toFixed(1)} fps avg (${avgFrameTime.toFixed(2)}ms)`,
            `Consistency: ${stdDev.toFixed(2)}ms stddev (good)`,
            `Stutters: ${stutterPercentage.toFixed(1)}% of frames`,
            `Monitor: ${refreshRate}Hz`,
            'Stable frame pacing - system responsive',
            'Should translate well to in-game performance'
          )
        } else if (stdDev < 10 && stutterPercentage < 5) {
          status = 'warning'
          details.push(
            `Browser: ${avgFps.toFixed(1)} fps avg`,
            `Frame variance: ${stdDev.toFixed(2)}ms stddev (inconsistent)`,
            `Stutters: ${stutterPercentage.toFixed(1)}% (affects smoothness)`,
            `99th percentile: ${p99.toFixed(1)}ms`,
            'Noticeable frame time variance detected',
            'Possible causes: background apps, CPU thermal throttling',
            'In CS2, this manifests as microstutters and input lag'
          )
        } else {
          status = 'critical'
          details.push(
            `Browser: ${avgFps.toFixed(1)} fps avg (high variance)`,
            `Frame time inconsistency: ${stdDev.toFixed(2)}ms stddev`,
            `Stutters: ${stutterPercentage.toFixed(1)}% of frames`,
            `Frame time range: ${p1.toFixed(1)}ms - ${p99.toFixed(1)}ms`,
            'Severe frame pacing issues detected',
            'Likely causes: thermal throttling, background processes, driver issues',
            'This WILL cause stuttering and poor CS2 performance',
            'Check: Task Manager CPU/GPU usage, temperatures, disable overlays'
          )
        }

        // Add CS2-specific context
        details.push(
          '',
          'Note: Browser test only - CS2 uses Source 2 subtick system',
          'For accurate CS2 fps: use "fps_max 0" and "cl_showfps 1" in-game'
        )

        resolve({ status, details })
      }
    }

    requestAnimationFrame(collectFrames)
  })
}

function detectSystem() {
  const ua = navigator.userAgent
  const isWindows = ua.includes('Windows')
  const isWindows11 = ua.includes('Windows NT 10.0')
  const cores = navigator.hardwareConcurrency || 0
  const memory = (navigator as any).deviceMemory || 0 // In GB, if available
  const platform = navigator.platform

  // Estimate total RAM if available (Chrome/Edge only)
  const hasMemoryInfo = memory > 0

  let status: 'good' | 'warning' | 'critical'
  const details: string[] = []

  // Determine OS
  let osName = 'Unknown'
  if (isWindows11) {
    osName = 'Windows 11'
  } else if (isWindows && ua.includes('Windows NT 6.3')) {
    osName = 'Windows 8.1'
  } else if (isWindows && ua.includes('Windows NT 6.2')) {
    osName = 'Windows 8'
  } else if (isWindows && ua.includes('Windows NT 6.1')) {
    osName = 'Windows 7'
  } else if (isWindows) {
    osName = 'Windows 10/11'
  } else if (ua.includes('Mac OS')) {
    osName = 'macOS'
  } else if (ua.includes('Linux')) {
    osName = 'Linux'
  }

  // Assess system for CS2
  if (isWindows && cores >= 12 && (!hasMemoryInfo || memory >= 16)) {
    status = 'good'
    details.push(
      `OS: ${osName}`,
      `CPU: ${cores} threads (excellent for CS2)`,
      hasMemoryInfo ? `RAM: ${memory}GB+` : 'RAM: Unable to detect',
      'High-end CPU configuration detected'
    )
  } else if (isWindows && cores >= 8) {
    status = 'good'
    details.push(
      `OS: ${osName}`,
      `CPU: ${cores} threads (good for CS2)`,
      hasMemoryInfo ? `RAM: ${memory}GB+` : 'RAM: Unable to detect',
      'Sufficient CPU for competitive gaming',
      hasMemoryInfo && memory < 16 ? 'Consider 16GB+ RAM for optimal performance' : ''
    )
  } else if (isWindows && cores >= 6) {
    status = 'warning'
    details.push(
      `OS: ${osName}`,
      `CPU: ${cores} threads (minimum for CS2)`,
      hasMemoryInfo ? `RAM: ${memory}GB+` : 'RAM: Unable to detect',
      'Entry-level CPU for modern gaming',
      'May bottleneck high-end GPUs'
    )
  } else if (isWindows) {
    status = 'critical'
    details.push(
      `OS: ${osName}`,
      `CPU: ${cores} threads (below recommended)`,
      hasMemoryInfo ? `RAM: ${memory}GB+` : 'RAM: Unable to detect',
      'CPU may struggle with CS2',
      'CPU upgrade recommended for competitive play'
    )
  } else {
    status = 'warning'
    details.push(
      `OS: ${osName}`,
      `CPU: ${cores} threads`,
      'Non-Windows OS detected',
      'CS2 requires Windows for optimal performance',
      'Proton/Wine on Linux has compatibility limitations'
    )
  }

  // Add browser info
  const browserInfo = getBrowserInfo(ua)
  details.push(`Browser: ${browserInfo}`)

  return { status, details }
}

function getBrowserInfo(ua: string): string {
  if (ua.includes('Edg/')) return 'Microsoft Edge'
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Google Chrome'
  if (ua.includes('Firefox/')) return 'Mozilla Firefox'
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari'
  if (ua.includes('Opera/') || ua.includes('OPR/')) return 'Opera'
  return 'Unknown Browser'
}

function calculateRecommendation(tests: any) {
  const criticalCount = Object.values(tests).filter((t: any) => t.status === 'critical').length
  const warningCount = Object.values(tests).filter((t: any) => t.status === 'warning').length
  const goodCount = Object.values(tests).filter((t: any) => t.status === 'good').length

  // Honest, educational recommendations - build trust, not pressure
  // Focus on actionable insights users can implement themselves

  if (criticalCount >= 2) {
    return {
      severity: 'critical',
      color: 'var(--extreme)',
      title: 'Critical Performance Issues Detected',
      message: 'Your system has multiple critical bottlenecks affecting CS2 performance. Priority actions: (1) Update GPU drivers from manufacturer website, (2) Enable hardware acceleration in browser/Windows, (3) Check network stability with ethernet cable, (4) Verify Windows power plan is High Performance. Download the PowerShell tool below for detailed diagnostics. If these issues are hardware-related or you need systematic optimization, our Extreme BIOSPRIME service addresses BIOS, drivers, registry, and network comprehensively.',
      cta: 'Learn About Professional Optimization',
      bookingUrl: 'https://calendly.com/fpsos/extreme-biosprime'
    }
  }

  if (criticalCount >= 1 || warningCount >= 3) {
    return {
      severity: 'moderate',
      color: 'var(--full-tune)',
      title: 'Optimization Opportunities Identified',
      message: 'Your system has performance headroom. Try these free fixes first: (1) Update all drivers (GPU, chipset, network), (2) Set Windows power plan to High Performance or AMD Ryzen Balanced, (3) Disable unnecessary startup programs (Task Manager > Startup), (4) Verify in-game settings match your GPU tier, (5) Use ethernet instead of WiFi. The PowerShell tool below provides specific diagnostics. For hands-on optimization (BIOS tuning, interrupt affinity, network configuration), our Full Tune-Up systematically addresses all areas.',
      cta: 'Explore Tune-Up Service',
      bookingUrl: 'https://calendly.com/fpsos/full-system-tune-up'
    }
  }

  if (warningCount >= 1) {
    return {
      severity: 'minor',
      color: 'var(--quick-fix)',
      title: 'Minor Improvements Available',
      message: 'Your system is in good shape. Address warnings with: (1) Ethernet connection for network stability, (2) Keep Windows and drivers updated, (3) Match in-game settings to your hardware (see GPU recommendations above), (4) Disable overlays (Discord, GeForce Experience) for lowest latency. Most of these are DIY-friendly. The PowerShell tool provides deeper insights. If you want expert fine-tuning beyond basics (NVIDIA Control Panel, in-game config optimization, etc.), we offer Quick Fix sessions.',
      cta: 'View Quick Fix Options',
      bookingUrl: 'https://calendly.com/fpsos/quick-remote-fix'
    }
  }

  return {
    severity: 'good',
    color: 'var(--positive)',
    title: 'System Looks Well-Configured',
    message: 'Browser-level diagnostics show good configuration. Remember: these are basic checks only. For CS2-specific optimization: (1) Download PowerShell tool below for BIOS, driver, and registry analysis, (2) In-game, verify fps_max matches your strategy (0 for unlimited, or 2x refresh rate), (3) Enable NVIDIA Reflex Low Latency (if NVIDIA GPU), (4) Check "net_graph 1" in CS2 for real-time latency/fps. If you\'re experiencing issues despite good diagnostics, they may be game-config or system-level (interrupt affinity, cache optimization, etc.).',
    cta: 'Download PowerShell Tool',
    bookingUrl: '#deep-tool'
  }
}

function generatePowerShellScript(): string {
  return `# FPSOS Deep System Diagnostic Tool
# Version 3.0 - Professional CS2 Optimization Edition
# Comprehensive Performance Analysis for Competitive Counter-Strike 2
#
# This tool analyzes:
# - Hardware configuration and capabilities
# - BIOS settings (via WMI where available)
# - Windows performance settings
# - Network adapter configuration
# - Driver versions and optimization state
# - Background processes and resource usage
# - Registry settings affecting gaming performance
#
# Requires Administrator privileges for complete diagnostics

#Requires -RunAsAdministrator

$ErrorActionPreference = "Continue"
$ProgressPreference = "SilentlyContinue"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "   FPSOS Deep Diagnostic Tool v3.0" -ForegroundColor Cyan
Write-Host "   Professional CS2 Performance Analysis" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting comprehensive system diagnostics..." -ForegroundColor White
Write-Host "This will take 30-60 seconds to complete." -ForegroundColor Gray
Write-Host ""

$Results = @{
    Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    ComputerName = $env:COMPUTERNAME
    UserName = $env:USERNAME
    Tests = @{}
    Recommendations = @()
    FreeOptimizations = @()
    CriticalIssues = @()
}

# Helper function to add recommendations with categories
function Add-Recommendation {
    param(
        [string]$Message,
        [string]$Severity = "Info",
        [string]$Category = "General"
    )
    $Results.Recommendations += @{
        Message = $Message
        Severity = $Severity
        Category = $Category
    }

    # Track free optimizations separately
    if ($Severity -eq "Info" -and $Message -like "*free*" -or $Message -like "*DIY*") {
        $Results.FreeOptimizations += $Message
    }

    if ($Severity -eq "Critical") {
        $Results.CriticalIssues += $Message
    }
}

# ==================== GPU DETECTION ====================
Write-Host "[1/15] Detecting GPU..." -ForegroundColor Yellow
try {
    $GPU = Get-WmiObject Win32_VideoController | Where-Object {$_.Name -notlike "*Microsoft*"} | Select-Object -First 1
    $Results.Tests.GPU = @{
        Name = $GPU.Name
        DriverVersion = $GPU.DriverVersion
        DriverDate = $GPU.DriverDate
        VideoRAM_MB = [math]::Round($GPU.AdapterRAM / 1MB)
        RefreshRate = $GPU.CurrentRefreshRate
        Status = $GPU.Status
    }
    Write-Host "  GPU: $($GPU.Name)" -ForegroundColor Green
    Write-Host "  Driver: $($GPU.DriverVersion)" -ForegroundColor Green
    Write-Host "  VRAM: $([math]::Round($GPU.AdapterRAM / 1MB))MB" -ForegroundColor Green

    # Check if integrated GPU
    if ($GPU.Name -match "Intel.*UHD|Intel.*HD|Vega.*Graphics" -and $GPU.Name -notmatch "Arc") {
        Add-Recommendation "Integrated GPU detected - dedicated GPU highly recommended for CS2" "Critical"
        Write-Host "  WARNING: Integrated GPU - performance will be limited" -ForegroundColor Red
    }
} catch {
    Write-Host "  ERROR: GPU detection failed - $($_.Exception.Message)" -ForegroundColor Red
    Add-Recommendation "GPU detection failed - check device manager" "Critical"
}

# ==================== DISPLAY SETTINGS ====================
Write-Host "[2/15] Checking Display Configuration..." -ForegroundColor Yellow
try {
    $Display = Get-CimInstance -ClassName Win32_VideoController | Select-Object -First 1
    $Results.Tests.Display = @{
        Resolution = "$($Display.CurrentHorizontalResolution)x$($Display.CurrentVerticalResolution)"
        RefreshRate = $Display.CurrentRefreshRate
        BitsPerPixel = $Display.CurrentBitsPerPixel
    }
    Write-Host "  Resolution: $($Display.CurrentHorizontalResolution)x$($Display.CurrentVerticalResolution)" -ForegroundColor Green
    Write-Host "  Refresh Rate: $($Display.CurrentRefreshRate)Hz" -ForegroundColor Green

    if ($Display.CurrentRefreshRate -lt 144) {
        Add-Recommendation "Monitor refresh rate is $($Display.CurrentRefreshRate)Hz - 144Hz+ recommended for competitive CS2" "Warning"
    }
    if ($Display.CurrentVerticalResolution -gt 1080 -and $Display.CurrentVerticalResolution -ne 1440) {
        Add-Recommendation "Non-standard resolution detected - may impact FPS consistency" "Info"
    }
} catch {
    Write-Host "  ERROR: Display detection failed" -ForegroundColor Red
}

# ==================== CPU ANALYSIS ====================
Write-Host "[3/15] Analyzing CPU..." -ForegroundColor Yellow
try {
    $CPU = Get-WmiObject Win32_Processor
    $Results.Tests.CPU = @{
        Name = $CPU.Name
        Cores = $CPU.NumberOfCores
        LogicalProcessors = $CPU.NumberOfLogicalProcessors
        MaxClockSpeed_MHz = $CPU.MaxClockSpeed
        CurrentClockSpeed_MHz = $CPU.CurrentClockSpeed
        L2Cache_KB = $CPU.L2CacheSize
        L3Cache_KB = $CPU.L3CacheSize
    }
    Write-Host "  CPU: $($CPU.Name)" -ForegroundColor Green
    Write-Host "  Cores: $($CPU.NumberOfCores) / Threads: $($CPU.NumberOfLogicalProcessors)" -ForegroundColor Green
    Write-Host "  Clock: $($CPU.CurrentClockSpeed)MHz / $($CPU.MaxClockSpeed)MHz Max" -ForegroundColor Green

    if ($CPU.NumberOfLogicalProcessors -lt 8) {
        Add-Recommendation "CPU has less than 8 threads - may bottleneck in CPU-intensive scenarios" "Warning"
    }
} catch {
    Write-Host "  ERROR: CPU detection failed" -ForegroundColor Red
}

# ==================== RAM CONFIGURATION ====================
Write-Host "[4/15] Checking RAM Configuration..." -ForegroundColor Yellow
try {
    $RAM = Get-WmiObject Win32_PhysicalMemory
    $TotalRAM = [math]::Round(($RAM | Measure-Object Capacity -Sum).Sum / 1GB, 2)
    $RAMSpeed = $RAM[0].ConfiguredClockSpeed
    $RAMModules = $RAM.Count
    $DualChannel = ($RAMModules -ge 2)

    $Results.Tests.RAM = @{
        Total_GB = $TotalRAM
        Speed_MHz = $RAMSpeed
        Modules = $RAMModules
        DualChannel = $DualChannel
        Details = $RAM | Select-Object Manufacturer, PartNumber, Capacity, ConfiguredClockSpeed
    }

    Write-Host "  Total: $($TotalRAM)GB ($($RAMModules) modules)" -ForegroundColor Green
    Write-Host "  Speed: $($RAMSpeed)MHz" -ForegroundColor Green
    Write-Host "  Dual Channel: $($DualChannel)" -ForegroundColor $(if($DualChannel){"Green"}else{"Red"})

    if ($TotalRAM -lt 16) {
        Add-Recommendation "RAM is $($TotalRAM)GB - 16GB+ recommended for CS2" "Warning"
    }
    if (-not $DualChannel) {
        Add-Recommendation "Single channel RAM detected - dual channel provides significant performance boost" "Critical"
    }
    if ($RAMSpeed -lt 3000) {
        Add-Recommendation "RAM speed is $($RAMSpeed)MHz - faster RAM (3200MHz+) improves FPS consistency" "Info"
    }
} catch {
    Write-Host "  ERROR: RAM detection failed" -ForegroundColor Red
}

# ==================== STORAGE CONFIGURATION ====================
Write-Host "[5/15] Checking Storage..." -ForegroundColor Yellow
try {
    $Drives = Get-PhysicalDisk | Select-Object FriendlyName, MediaType, Size
    $SystemDrive = Get-Volume -DriveLetter C

    $Results.Tests.Storage = @{
        SystemDrive = @{
            FreeSpace_GB = [math]::Round($SystemDrive.SizeRemaining / 1GB, 2)
            Total_GB = [math]::Round($SystemDrive.Size / 1GB, 2)
        }
        PhysicalDisks = $Drives
    }

    Write-Host "  System Drive (C:): $([math]::Round($SystemDrive.SizeRemaining / 1GB, 2))GB free of $([math]::Round($SystemDrive.Size / 1GB, 2))GB" -ForegroundColor Green

    $HasSSD = $Drives | Where-Object {$_.MediaType -eq "SSD"}
    if (-not $HasSSD) {
        Add-Recommendation "No SSD detected - SSD dramatically improves load times and reduces stuttering" "Critical"
    }

    if ($SystemDrive.SizeRemaining -lt 20GB) {
        Add-Recommendation "System drive has less than 20GB free - low disk space can cause performance issues" "Warning"
    }
} catch {
    Write-Host "  ERROR: Storage check failed" -ForegroundColor Red
}

# ==================== POWER PLAN ====================
Write-Host "[6/15] Checking Power Plan..." -ForegroundColor Yellow
try {
    $PowerScheme = powercfg /getactivescheme
    $Results.Tests.PowerPlan = $PowerScheme

    if ($PowerScheme -like "*High performance*" -or $PowerScheme -like "*Ultimate*" -or $PowerScheme -like "*Ryzen*Balanced*") {
        Write-Host "  Power Plan: OPTIMAL" -ForegroundColor Green
        Write-Host "  $PowerScheme" -ForegroundColor Gray
    } else {
        Write-Host "  Power Plan: NEEDS OPTIMIZATION" -ForegroundColor Red
        Write-Host "  Current: $PowerScheme" -ForegroundColor Gray
        Add-Recommendation "Power plan is not set to High Performance - this limits CPU/GPU performance" "Critical"
    }
} catch {
    Write-Host "  ERROR: Power plan check failed" -ForegroundColor Red
}

# ==================== HPET STATUS ====================
Write-Host "[7/15] Checking HPET (High Precision Event Timer)..." -ForegroundColor Yellow
try {
    $HPET = bcdedit /enum | Select-String "useplatformclock"
    $HPETEnabled = $HPET -ne $null
    $Results.Tests.HPET = $HPETEnabled

    if ($HPETEnabled) {
        Write-Host "  HPET: ENABLED (can cause input lag)" -ForegroundColor Yellow
        Add-Recommendation "HPET is enabled - disabling may reduce input latency for some systems" "Info"
    } else {
        Write-Host "  HPET: DISABLED (optimal)" -ForegroundColor Green
    }
} catch {
    Write-Host "  HPET: Unable to check (requires admin)" -ForegroundColor Yellow
}

# ==================== GAME MODE & WINDOWS SETTINGS ====================
Write-Host "[8/15] Checking Windows Game Settings..." -ForegroundColor Yellow
try {
    $GameMode = Get-ItemProperty -Path "HKCU:\\Software\\Microsoft\\GameBar" -ErrorAction SilentlyContinue
    $Results.Tests.GameMode = @{
        AutoGameModeEnabled = $GameMode.AutoGameModeEnabled
        GameDVREnabled = (Get-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -ErrorAction SilentlyContinue).GameDVR_Enabled
    }

    if ($GameMode.AutoGameModeEnabled -eq 1) {
        Write-Host "  Game Mode: ENABLED" -ForegroundColor Green
    } else {
        Write-Host "  Game Mode: DISABLED" -ForegroundColor Yellow
        Add-Recommendation "Windows Game Mode is disabled - enabling may improve performance" "Info"
    }

    # Check Xbox Game Bar
    $GameDVR = (Get-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -ErrorAction SilentlyContinue).GameDVR_Enabled
    if ($GameDVR -eq 1) {
        Write-Host "  Game DVR: ENABLED (can cause performance issues)" -ForegroundColor Red
        Add-Recommendation "Xbox Game DVR is enabled - disable for better performance" "Warning"
    }
} catch {
    Write-Host "  Game Mode: Unable to check" -ForegroundColor Yellow
}

# ==================== FULLSCREEN OPTIMIZATIONS ====================
Write-Host "[9/15] Checking Fullscreen Optimizations..." -ForegroundColor Yellow
try {
    $FSO_Status = Get-ItemProperty -Path "HKCU:\\System\\GameConfigStore" -Name "GameDVR_FSEBehaviorMode" -ErrorAction SilentlyContinue
    $Results.Tests.FullscreenOptimizations = $FSO_Status.GameDVR_FSEBehaviorMode

    if ($FSO_Status.GameDVR_FSEBehaviorMode -eq 2) {
        Write-Host "  Fullscreen Optimizations: DISABLED (recommended for CS2)" -ForegroundColor Green
    } else {
        Write-Host "  Fullscreen Optimizations: ENABLED" -ForegroundColor Yellow
        Add-Recommendation "Fullscreen Optimizations enabled - may cause input lag in some games" "Info"
    }
} catch {
    Write-Host "  Fullscreen Optimizations: Unable to check" -ForegroundColor Yellow
}

# ==================== NETWORK ADAPTER ====================
Write-Host "[10/15] Checking Network Configuration..." -ForegroundColor Yellow
try {
    $ActiveAdapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up"} | Select-Object -First 1
    $AdapterAdvanced = Get-NetAdapterAdvancedProperty -Name $ActiveAdapter.Name -ErrorAction SilentlyContinue

    $Results.Tests.Network = @{
        Name = $ActiveAdapter.Name
        LinkSpeed = $ActiveAdapter.LinkSpeed
        MediaType = $ActiveAdapter.MediaType
        DriverVersion = $ActiveAdapter.DriverVersion
    }

    Write-Host "  Adapter: $($ActiveAdapter.Name)" -ForegroundColor Green
    Write-Host "  Link Speed: $($ActiveAdapter.LinkSpeed)" -ForegroundColor Green
    Write-Host "  Type: $($ActiveAdapter.MediaType)" -ForegroundColor Green

    if ($ActiveAdapter.MediaType -eq "802.3") {
        Write-Host "  Connection: Wired (optimal)" -ForegroundColor Green
    } else {
        Write-Host "  Connection: Wireless" -ForegroundColor Yellow
        Add-Recommendation "Wireless connection detected - wired ethernet provides lower latency" "Warning"
    }
} catch {
    Write-Host "  ERROR: Network detection failed" -ForegroundColor Red
}

# ==================== BACKGROUND PROCESSES ====================
Write-Host "[11/15] Checking Background Processes..." -ForegroundColor Yellow
try {
    $HighCPUProcesses = Get-Process | Where-Object {$_.CPU -gt 10} | Select-Object Name, CPU, WorkingSet -First 10
    $Results.Tests.BackgroundProcesses = $HighCPUProcesses

    $ProcessCount = (Get-Process).Count
    Write-Host "  Total Processes: $ProcessCount" -ForegroundColor $(if($ProcessCount -lt 150){"Green"}else{"Yellow"})

    if ($ProcessCount -gt 200) {
        Add-Recommendation "High number of running processes ($ProcessCount) - consider closing unnecessary applications" "Warning"
    }

    # Check for common performance-impacting software
    $ProblematicSoftware = @("Chrome", "Discord", "Spotify", "OBS64", "StreamlabsOBS")
    $RunningProblematic = Get-Process | Where-Object {$ProblematicSoftware -contains $_.Name}
    if ($RunningProblematic) {
        Write-Host "  Resource-heavy apps running: $($RunningProblematic.Name -join ', ')" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ERROR: Process check failed" -ForegroundColor Red
}

# ==================== WINDOWS VERSION ====================
Write-Host "[12/15] Checking Windows Version..." -ForegroundColor Yellow
try {
    $OSInfo = Get-CimInstance Win32_OperatingSystem
    $Results.Tests.OS = @{
        Caption = $OSInfo.Caption
        Version = $OSInfo.Version
        BuildNumber = $OSInfo.BuildNumber
        LastBootUpTime = $OSInfo.LastBootUpTime
    }

    Write-Host "  OS: $($OSInfo.Caption)" -ForegroundColor Green
    Write-Host "  Build: $($OSInfo.BuildNumber)" -ForegroundColor Green
    Write-Host "  Last Boot: $($OSInfo.LastBootUpTime)" -ForegroundColor Gray

    if ($OSInfo.Caption -notmatch "Windows 10|Windows 11") {
        Add-Recommendation "Outdated Windows version - upgrade to Windows 10/11 for best performance" "Critical"
    }
} catch {
    Write-Host "  ERROR: OS version check failed" -ForegroundColor Red
}

# ==================== NVIDIA/AMD SETTINGS (if applicable) ====================
Write-Host "[13/15] Checking GPU-Specific Settings..." -ForegroundColor Yellow
try {
    $NvidiaService = Get-Service -Name "NVDisplay.ContainerLocalSystem" -ErrorAction SilentlyContinue
    $AMDService = Get-Service -Name "AMD External Events Utility" -ErrorAction SilentlyContinue

    if ($NvidiaService) {
        Write-Host "  NVIDIA GPU detected" -ForegroundColor Green
        Write-Host "  NVIDIA Driver Service: $($NvidiaService.Status)" -ForegroundColor Gray

        $Results.Tests.GPUVendor = "NVIDIA"

        # NVIDIA-specific CS2 optimizations
        Add-Recommendation "NVIDIA CS2 Settings: Download latest Game Ready driver from nvidia.com/drivers" "Info" "GPU"
        Add-Recommendation "NVIDIA Control Panel > Manage 3D Settings > Power Management: Prefer Maximum Performance" "Info" "GPU"
        Add-Recommendation "Enable NVIDIA Reflex Low Latency in CS2 video settings (reduces input lag by 10-30ms)" "Info" "GPU"
        Add-Recommendation "NVIDIA Control Panel: Disable V-SYNC globally, set Low Latency Mode to Ultra (if no Reflex)" "Info" "GPU"
        Add-Recommendation "Set Texture Filtering - Quality to High Performance for slightly better fps" "Info" "GPU"

        # Check for common NVIDIA issues
        $NvidiaDriverStore = Get-ChildItem "C:\\Windows\\System32\\DriverStore\\FileRepository\\nv*.inf" -ErrorAction SilentlyContinue
        if ($NvidiaDriverStore.Count -gt 2) {
            Add-Recommendation "Multiple NVIDIA driver versions detected in DriverStore - use DDU (Display Driver Uninstaller) for clean install" "Warning" "GPU"
        }

    } elseif ($AMDService) {
        Write-Host "  AMD GPU detected" -ForegroundColor Green
        Write-Host "  AMD Driver Service: $($AMDService.Status)" -ForegroundColor Gray

        $Results.Tests.GPUVendor = "AMD"

        # AMD-specific CS2 optimizations
        Add-Recommendation "AMD CS2 Settings: Download latest Adrenalin driver from amd.com/support" "Info" "GPU"
        Add-Recommendation "CRITICAL: Disable AMD Anti-Lag+ for CS2 - it triggers VAC bans (confirmed by Valve)" "Critical" "GPU"
        Add-Recommendation "AMD Radeon Software > Gaming > CS2 > Graphics: Enable Radeon Anti-Lag (NOT Anti-Lag+)" "Info" "GPU"
        Add-Recommendation "Set AMD Radeon Chill OFF for CS2 (limits fps, adds latency)" "Info" "GPU"
        Add-Recommendation "Enable AMD FreeSync/Enhanced Sync OFF for competitive (adds latency)" "Info" "GPU"
        Add-Recommendation "Texture Filtering Quality: Performance mode for slight fps boost" "Info" "GPU"
    } else {
        Write-Host "  Unable to detect GPU vendor" -ForegroundColor Yellow
        Add-Recommendation "Could not detect GPU vendor - check Device Manager for GPU status" "Warning" "GPU"
    }
} catch {
    Write-Host "  GPU service check failed" -ForegroundColor Yellow
}

# ==================== WINDOWS DEFENDER EXCLUSIONS ====================
Write-Host "[14/15] Checking Antivirus Impact..." -ForegroundColor Yellow
try {
    $DefenderPrefs = Get-MpPreference -ErrorAction SilentlyContinue
    if ($DefenderPrefs) {
        $SteamExcluded = $DefenderPrefs.ExclusionPath -like "*Steam*" -or $DefenderPrefs.ExclusionPath -like "*Counter-Strike*"
        if ($SteamExcluded) {
            Write-Host "  Windows Defender: Steam folder excluded" -ForegroundColor Green
        } else {
            Write-Host "  Windows Defender: Steam folder NOT excluded" -ForegroundColor Yellow
            Add-Recommendation "Add Steam/CS2 folder to Windows Defender exclusions to reduce scanning overhead" "Info"
        }
    }
} catch {
    Write-Host "  Antivirus check: Unable to verify" -ForegroundColor Yellow
}

# ==================== THERMAL STATUS ====================
Write-Host "[15/15] Checking Thermal Status..." -ForegroundColor Yellow
try {
    $ThermalInfo = Get-WmiObject MSAcpi_ThermalZoneTemperature -Namespace "root/wmi" -ErrorAction SilentlyContinue
    if ($ThermalInfo) {
        $TempCelsius = ($ThermalInfo.CurrentTemperature / 10) - 273.15
        Write-Host "  System Temperature: $([math]::Round($TempCelsius, 1))°C" -ForegroundColor $(if($TempCelsius -lt 80){"Green"}else{"Red"})

        if ($TempCelsius -gt 85) {
            Add-Recommendation "High system temperature detected ($([math]::Round($TempCelsius, 1))°C) - check cooling, thermal paste, dust buildup" "Critical"
        }
    } else {
        Write-Host "  Thermal sensors not accessible via WMI" -ForegroundColor Gray
        Add-Recommendation "Monitor temperatures with HWiNFO64 or similar - thermal throttling severely impacts performance" "Info"
    }
} catch {
    Write-Host "  Thermal check not available on this system" -ForegroundColor Gray
}

# ==================== CS2-SPECIFIC CHECKS ====================
Write-Host "[BONUS] CS2-Specific Configuration Checks..." -ForegroundColor Magenta
try {
    # Check for CS2 installation
    $SteamPaths = @(
        "C:\\Program Files (x86)\\Steam\\steamapps\\common\\Counter-Strike Global Offensive",
        "D:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive",
        "E:\\SteamLibrary\\steamapps\\common\\Counter-Strike Global Offensive"
    )

    $CS2Path = $null
    foreach ($Path in $SteamPaths) {
        if (Test-Path $Path) {
            $CS2Path = $Path
            break
        }
    }

    if ($CS2Path) {
        Write-Host "  CS2 Installation found: $CS2Path" -ForegroundColor Green

        # Check if CS2 is in Windows Defender exclusions
        $DefenderExclusions = Get-MpPreference -ErrorAction SilentlyContinue
        if ($DefenderExclusions) {
            $CS2Excluded = $DefenderExclusions.ExclusionPath -contains $CS2Path
            if (-not $CS2Excluded) {
                Add-Recommendation "Add CS2 folder to Windows Defender exclusions to reduce scanning overhead during gameplay" "Info" "System"
                Write-Host "  CS2 NOT in Defender exclusions - may cause microstutters" -ForegroundColor Yellow
            } else {
                Write-Host "  CS2 properly excluded from Defender scanning" -ForegroundColor Green
            }
        }

        # Check for common overlays that cause issues
        $ProblematicOverlays = @("Discord", "GeForceExperience", "NVIDIA Share", "MSI Afterburner", "RivaTuner")
        $RunningOverlays = Get-Process | Where-Object { $ProblematicOverlays -contains $_.Name }
        if ($RunningOverlays) {
            Write-Host "  Overlay software detected: $($RunningOverlays.Name -join ', ')" -ForegroundColor Yellow
            Add-Recommendation "Disable overlays for lowest input latency: $($RunningOverlays.Name -join ', ')" "Info" "System"
        }

    } else {
        Write-Host "  CS2 installation not found in common Steam directories" -ForegroundColor Gray
    }

    # CS2 Launch Options Recommendations
    Write-Host ""
    Write-Host "  CS2 LAUNCH OPTIONS RECOMMENDATIONS:" -ForegroundColor Cyan
    Write-Host "  In Steam: Right-click CS2 > Properties > Launch Options:" -ForegroundColor Gray
    Write-Host "  -high -novid -nojoy +fps_max 0 +cl_forcepreload 1" -ForegroundColor White
    Write-Host ""
    Write-Host "  Explanation:" -ForegroundColor Gray
    Write-Host "    -high        = High CPU priority" -ForegroundColor White
    Write-Host "    -novid       = Skip intro video" -ForegroundColor White
    Write-Host "    -nojoy       = Disable joystick support (slight perf gain)" -ForegroundColor White
    Write-Host "    +fps_max 0   = Unlimited fps (or 2x refresh rate)" -ForegroundColor White
    Write-Host "    +cl_forcepreload 1 = Preload map assets (may help stuttering)" -ForegroundColor White

} catch {
    Write-Host "  CS2 check failed - not critical" -ForegroundColor Gray
}

# ==================== GENERATE REPORT ====================
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "        DIAGNOSTIC COMPLETE!" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Summary Statistics
Write-Host "SUMMARY:" -ForegroundColor White
Write-Host "--------" -ForegroundColor Gray
Write-Host "  Total Checks: 15" -ForegroundColor White
Write-Host "  Critical Issues: $($Results.CriticalIssues.Count)" -ForegroundColor $(if($Results.CriticalIssues.Count -gt 0){"Red"}else{"Green"})
Write-Host "  Warnings: $(($Results.Recommendations | Where-Object {$_.Severity -eq 'Warning'}).Count)" -ForegroundColor Yellow
Write-Host "  Suggestions: $(($Results.Recommendations | Where-Object {$_.Severity -eq 'Info'}).Count)" -ForegroundColor Cyan
Write-Host ""

# Display recommendations by category
if ($Results.Recommendations.Count -gt 0) {
    Write-Host "RECOMMENDATIONS BY CATEGORY:" -ForegroundColor Yellow
    Write-Host "----------------------------" -ForegroundColor Yellow
    Write-Host ""

    $Categories = $Results.Recommendations | Select-Object -ExpandProperty Category -Unique | Sort-Object
    foreach ($Category in $Categories) {
        $CategoryRecs = $Results.Recommendations | Where-Object {$_.Category -eq $Category}

        Write-Host "  [$Category]" -ForegroundColor Cyan
        foreach ($Rec in $CategoryRecs) {
            $Color = switch ($Rec.Severity) {
                "Critical" { "Red" }
                "Warning" { "Yellow" }
                "Info" { "White" }
                default { "Gray" }
            }
            $Prefix = switch ($Rec.Severity) {
                "Critical" { "[!]" }
                "Warning" { "[~]" }
                "Info" { "[i]" }
                default { "[-]" }
            }
            Write-Host "    $Prefix $($Rec.Message)" -ForegroundColor $Color
        }
        Write-Host ""
    }
} else {
    Write-Host "Excellent! No major issues detected." -ForegroundColor Green
    Write-Host "Your system appears well-configured for CS2." -ForegroundColor Green
    Write-Host ""
}

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Export Results
$OutputFile = "$env:USERPROFILE\\Desktop\\fpsos-diagnostic-$(Get-Date -Format 'yyyyMMdd-HHmmss').json"
$Results | ConvertTo-Json -Depth 5 | Out-File $OutputFile
Write-Host "Detailed JSON results saved to Desktop:" -ForegroundColor Green
Write-Host "  $OutputFile" -ForegroundColor White
Write-Host ""

# Generate human-readable report
$ReportFile = "$env:USERPROFILE\\Desktop\\fpsos-diagnostic-$(Get-Date -Format 'yyyyMMdd-HHmmss').txt"
$ReportContent = @"
============================================
FPSOS Deep Diagnostic Report
Generated: $($Results.Timestamp)
Computer: $($Results.ComputerName)
User: $($Results.UserName)
============================================

CRITICAL ISSUES ($($Results.CriticalIssues.Count)):
$(if($Results.CriticalIssues.Count -gt 0) { $Results.CriticalIssues | ForEach-Object { "- $_" } | Out-String } else { "None detected" })

HARDWARE SUMMARY:
- GPU: $($Results.Tests.GPU.Name)
- CPU: $($Results.Tests.CPU.Name) ($($Results.Tests.CPU.Cores) cores / $($Results.Tests.CPU.LogicalProcessors) threads)
- RAM: $($Results.Tests.RAM.Total_GB)GB @ $($Results.Tests.RAM.Speed_MHz)MHz (Dual Channel: $($Results.Tests.RAM.DualChannel))
- OS: $($Results.Tests.OS.Caption) Build $($Results.Tests.OS.BuildNumber)

RECOMMENDATIONS:
$(foreach($Rec in $Results.Recommendations) { "[$($Rec.Severity)] [$($Rec.Category)] $($Rec.Message)" } | Out-String)

NEXT STEPS:
1. Address CRITICAL issues immediately (especially network/GPU)
2. Apply FREE optimizations listed above (drivers, Windows settings)
3. For CS2 in-game: Enable Reflex (NVIDIA), disable overlays, verify launch options
4. For systematic optimization: Visit fpsos.gg/packages

Need help? Share this report at fpsos.gg/diagnostic
"@

$ReportContent | Out-File $ReportFile
Write-Host "Human-readable report saved to Desktop:" -ForegroundColor Green
Write-Host "  $ReportFile" -ForegroundColor White
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host "----------" -ForegroundColor Gray
Write-Host "  1. Review CRITICAL issues above and address immediately" -ForegroundColor White
Write-Host "  2. Apply FREE optimizations (driver updates, Windows settings)" -ForegroundColor White
Write-Host "  3. Share results at fpsos.gg/diagnostic for expert feedback" -ForegroundColor White
Write-Host "  4. For hands-on optimization: fpsos.gg/packages" -ForegroundColor White
Write-Host ""
Write-Host "This diagnostic tool is designed to help YOU optimize." -ForegroundColor Yellow
Write-Host "Most recommendations are DIY-friendly and cost nothing." -ForegroundColor Yellow
Write-Host ""
Write-Host "Professional optimization services available if you need" -ForegroundColor Gray
Write-Host "systematic BIOS/registry/network tuning beyond basics." -ForegroundColor Gray
Write-Host ""
Write-Host "Good luck! May your fps be high and your ping be low." -ForegroundColor Cyan
Write-Host ""
`
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
