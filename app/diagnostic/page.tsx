'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import BotInterface from '@/components/BotInterface'

/* --- COMPONENT: Space Particles (Matching Home) --- */
function SpaceParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let particles: Array<{ x: number; y: number; size: number; speedX: number; speedY: number; opacity: number; pulse: number; layer: 0 | 1 | 2 }> = []
    let width = 0; let height = 0; let mouseX = 0; let mouseY = 0

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const initParticles = () => {
      width = window.innerWidth; height = window.innerHeight
      canvas.width = width * window.devicePixelRatio; canvas.height = height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      canvas.style.width = `${width}px`; canvas.style.height = `${height}px`
      const count = Math.floor((width * height) / 5000)
      particles = []
      for (let i = 0; i < count; i++) {
        const rand = Math.random()
        let layer: 0 | 1 | 2 = 0
        if (rand > 0.85) layer = 2
        else if (rand > 0.5) layer = 1

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: layer === 2 ? Math.random() * 1.5 + 1.5 : (layer === 1 ? Math.random() * 1.0 + 0.8 : Math.random() * 0.8 + 0.2),
          speedX: prefersReducedMotion ? 0 : (Math.random() - 0.5) * (layer === 2 ? 0.3 : 0.1),
          speedY: prefersReducedMotion ? 0 : (Math.random() - 0.5) * (layer === 2 ? 0.3 : 0.1),
          opacity: 0,
          pulse: Math.random() * Math.PI,
          layer
        })
      }
    }

    let globalAlpha = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height)
      if (globalAlpha < 1) globalAlpha += 0.008;

      particles.forEach(p => {
        if (!prefersReducedMotion) {
          p.x += p.speedX; p.y += p.speedY;
          p.pulse += 0.02;
          if (p.opacity < 1) p.opacity += 0.01;

          const twinkle = Math.sin(p.pulse) * 0.3 + 0.7
          const parallaxFactor = p.layer === 2 ? 0.05 : (p.layer === 1 ? 0.02 : 0.005)
          const dx = (mouseX - width / 2) * parallaxFactor
          const dy = (mouseY - height / 2) * parallaxFactor

          let drawX = p.x + dx
          let drawY = p.y + dy

          if (drawX < -50) p.x += width + 100
          if (drawX > width + 50) p.x -= width + 100
          if (drawY < -50) p.y += height + 100
          if (drawY > height + 50) p.y -= height + 100

          drawX = p.x + dx
          drawY = p.y + dy

          const baseAlpha = p.layer === 2 ? 0.9 : (p.layer === 1 ? 0.6 : 0.3);
          const finalAlpha = baseAlpha * twinkle * globalAlpha * 0.8;

          ctx.beginPath();
          ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${finalAlpha})`;

          if (p.layer === 2) {
            ctx.shadowBlur = 4;
            ctx.shadowColor = `rgba(139, 92, 246, ${finalAlpha})`;
          } else {
            ctx.shadowBlur = 0;
          }

          ctx.fill();
          ctx.shadowBlur = 0
        }
      })
      if (!prefersReducedMotion) animationFrameId = requestAnimationFrame(render)
    }

    const handleResize = () => { initParticles(); if (prefersReducedMotion) render(); }
    const onMouseMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY; }
    window.addEventListener('resize', handleResize); window.addEventListener('mousemove', onMouseMove);
    initParticles(); render();
    return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('mousemove', onMouseMove); cancelAnimationFrame(animationFrameId); }
  }, [])
  return <canvas ref={canvasRef} className="spaceParticles" aria-hidden="true" />
}

interface DiagnosticTest {
  name: string
  status: 'pending' | 'running' | 'pass' | 'warn' | 'fail'
  value?: string
  message?: string
  score?: number
  confidence?: number
}

interface DiagnosticResults {
  gpu: DiagnosticTest
  display: DiagnosticTest
  memory: DiagnosticTest
  cores: DiagnosticTest
  hardwareAccel: DiagnosticTest
  networkLatency: DiagnosticTest
  overall: {
    score: number
    grade: string
    recommendation: string
    browserLimitations: string[]
  }
}

export default function DiagnosticPage() {
  const [step, setStep] = useState<'idle' | 'scanning' | 'results'>('idle')
  const [progress, setProgress] = useState(0)
  const [tests, setTests] = useState<DiagnosticResults | null>(null)
  const [currentTest, setCurrentTest] = useState('')
  const [isBotOpen, setIsBotOpen] = useState(false)
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = pageRef.current
    if (!root) return
    const onMove = (e: MouseEvent) => {
      root.style.setProperty('--mx', `${e.clientX}px`)
      root.style.setProperty('--my', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const runDiagnostics = async () => {
    setStep('scanning')
    setProgress(0)

    // Check if tab is focused first
    if (document.hidden) {
      alert('Please keep this tab focused during the diagnostic. Browser throttles background tabs which will give inaccurate results.')
      setStep('idle')
      return
    }

    const results: DiagnosticResults = {
      gpu: { name: 'GPU', status: 'pending', confidence: 95 },
      display: { name: 'Display', status: 'pending', confidence: 70 },
      memory: { name: 'RAM', status: 'pending', confidence: 70 },
      cores: { name: 'CPU', status: 'pending', confidence: 60 },
      hardwareAccel: { name: 'HW Acceleration', status: 'pending', confidence: 95 },
      networkLatency: { name: 'Network', status: 'pending', confidence: 60 },
      overall: {
        score: 0,
        grade: 'F',
        recommendation: '',
        browserLimitations: [
          'Cannot detect CS2 in-game FPS or frame timing',
          'Cannot access BIOS settings or RAM speed',
          'Cannot detect driver versions',
          'Network test shows CDN latency, not game server ping'
        ]
      }
    }

    setTests({ ...results })

    // Test 1: GPU Detection
    setCurrentTest('Detecting GPU capabilities...')
    setProgress(10)
    await sleep(800)

    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        const vendor = gl.getParameter(debugInfo?.UNMASKED_VENDOR_WEBGL || 0) || 'Unknown'
        const renderer = gl.getParameter(debugInfo?.UNMASKED_RENDERER_WEBGL || 0) || 'Unknown'

        const gpuName = String(renderer).split('ANGLE')[0].trim()
        const isIntegrated = /Intel|UHD|Iris/.test(gpuName)
        const isNvidia = /NVIDIA|GeForce|RTX|GTX/.test(gpuName)
        const isAMD = /AMD|Radeon|RX/.test(gpuName)

        let gpuScore = 50
        if (isNvidia && /RTX/.test(gpuName)) gpuScore = 95
        else if (isNvidia && /GTX/.test(gpuName)) gpuScore = 85
        else if (isAMD && /RX/.test(gpuName)) gpuScore = 80
        else if (isIntegrated) gpuScore = 40

        results.gpu = {
          name: 'GPU',
          status: gpuScore >= 80 ? 'pass' : gpuScore >= 60 ? 'warn' : 'fail',
          value: gpuName,
          message: gpuScore >= 80
            ? 'Excellent GPU detected'
            : gpuScore >= 60
            ? 'Mid-range GPU'
            : 'Entry-level GPU detected',
          score: gpuScore,
          confidence: 95
        }
      } else {
        results.gpu = {
          name: 'GPU',
          status: 'fail',
          value: 'No WebGL Support',
          message: 'WebGL not available',
          score: 20
        }
      }
    } catch (e) {
      results.gpu = {
        name: 'GPU',
        status: 'fail',
        value: 'Detection Failed',
        message: 'Unable to detect GPU',
        score: 20
      }
    }

    setTests({ ...results })
    setProgress(20)

    // Test 2: Display Analysis
    setCurrentTest('Analyzing display configuration...')
    await sleep(600)

    const screen = window.screen
    const refreshRate = (screen as any).refreshRate || 'Unknown'
    const resolution = `${screen.width}x${screen.height}`
    const pixelRatio = window.devicePixelRatio

    let displayScore = 70
    if (screen.width >= 1920 && screen.height >= 1080) displayScore += 10
    
    // ACCURATE METRIC: Windows Scaling
    // Gamers should always run at 100% scaling (pixelRatio === 1)
    const hasScalingIssue = pixelRatio !== 1
    if (!hasScalingIssue) displayScore += 20
    else displayScore -= 10

    if (refreshRate !== 'Unknown' && refreshRate >= 144) displayScore += 10

    results.display = {
      name: 'Display',
      status: displayScore >= 80 ? 'pass' : displayScore >= 60 ? 'warn' : 'fail',
      value: refreshRate !== 'Unknown'
        ? `${resolution} @${refreshRate}Hz`
        : `${resolution}`,
      message: hasScalingIssue 
        ? `Scaling Active (${Math.round(pixelRatio * 100)}%) - Set to 100% for best aim` 
        : (refreshRate !== 'Unknown' && refreshRate >= 120 ? 'High refresh rate detected' : 'Standard display config'),
      score: displayScore,
      confidence: 90 // High confidence in pixel ratio
    }

    setTests({ ...results })
    setProgress(40)

    // Test 3: Memory Detection
    setCurrentTest('Detecting system memory...')
    await sleep(500)

    const memory = (navigator as any).deviceMemory || 'Unknown'
    let memoryScore = 50
    
    // Browsers cap deviceMemory at 8GB for privacy
    // So 8GB reported means 8GB OR MORE
    if (memory >= 8) memoryScore = 90
    else if (memory >= 4) memoryScore = 60
    else memoryScore = 40

    results.memory = {
      name: 'RAM',
      status: memoryScore >= 80 ? 'pass' : memoryScore >= 60 ? 'warn' : 'fail',
      value: memory !== 'Unknown' ? (memory >= 8 ? '8GB+ (Browser Cap)' : `~${memory}GB`) : 'Unknown',
      message: memory >= 8
        ? 'Sufficient RAM detected'
        : memory >= 4
        ? 'Adequate RAM'
        : 'Limited RAM detected',
      score: memoryScore,
      confidence: 70
    }

    setTests({ ...results })
    setProgress(60)

    // Test 4: CPU Cores
    setCurrentTest('Analyzing CPU configuration...')
    await sleep(500)

    const cores = navigator.hardwareConcurrency || 0
    let coresScore = 50
    if (cores >= 16) coresScore = 100
    else if (cores >= 12) coresScore = 90
    else if (cores >= 8) coresScore = 80
    else if (cores >= 6) coresScore = 70
    else if (cores >= 4) coresScore = 60

    results.cores = {
      name: 'CPU',
      status: coresScore >= 80 ? 'pass' : coresScore >= 60 ? 'warn' : 'fail',
      value: `${cores} threads`,
      message: cores >= 16
        ? 'High-thread CPU detected'
        : cores >= 8
        ? 'Adequate CPU threads'
        : 'Limited CPU threads',
      score: coresScore,
      confidence: 60
    }

    setTests({ ...results })
    setProgress(80)

    // Test 5: Hardware Acceleration Check
    setCurrentTest('Verifying hardware acceleration...')
    await sleep(600)

    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

      let accelScore = 50
      let accelStatus: 'pass' | 'warn' | 'fail' = 'warn'
      let accelValue = 'Unknown'
      let accelMessage = 'Could not determine acceleration status'

      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : null

        // Check if using software rendering
        const isSoftwareRenderer = renderer && (
          /SwiftShader/i.test(String(renderer)) ||
          /llvmpipe/i.test(String(renderer)) ||
          /Software/i.test(String(renderer)) ||
          /Mesa/i.test(String(renderer))
        )

        if (isSoftwareRenderer) {
          accelScore = 20
          accelStatus = 'fail'
          accelValue = 'Software Rendering'
          accelMessage = 'Hardware acceleration disabled - Enable in browser settings'
        } else if (renderer) {
          accelScore = 100
          accelStatus = 'pass'
          accelValue = 'GPU Accelerated'
          accelMessage = 'Hardware acceleration enabled'
        } else {
          accelScore = 60
          accelStatus = 'warn'
          accelValue = 'Partially Enabled'
          accelMessage = 'Acceleration status unclear'
        }
      } else {
        accelScore = 20
        accelStatus = 'fail'
        accelValue = 'Disabled'
        accelMessage = 'WebGL unavailable - Hardware acceleration may be disabled'
      }

      results.hardwareAccel = {
        name: 'HW Acceleration',
        status: accelStatus,
        value: accelValue,
        message: accelMessage,
        score: accelScore,
        confidence: 95
      }
    } catch {
      results.hardwareAccel = {
        name: 'HW Acceleration',
        status: 'warn',
        value: 'Detection Failed',
        message: 'Unable to verify',
        score: 50
      }
    }

    setTests({ ...results })
    setProgress(90)

    // Test 6: Network Latency (Location-Based)
    setCurrentTest('Testing network latency...')
    await sleep(600)

    try {
      // Detect user's approximate location via IP
      let userRegion = 'Unknown'
      let testUrl = 'https://www.cloudflare.com/cdn-cgi/trace' // Default

      try {
        const geoResponse = await fetch('https://ipapi.co/json/')
        const geoData = await geoResponse.json()
        userRegion = geoData.country_code || 'Unknown'

        // Select appropriate test endpoint based on region
        if (geoData.continent_code === 'AS') {
          // Middle East/Asia
          testUrl = 'https://www.cloudflare.com/cdn-cgi/trace' // Cloudflare auto-routes
        } else if (geoData.continent_code === 'EU') {
          testUrl = 'https://www.cloudflare.com/cdn-cgi/trace'
        } else {
          testUrl = 'https://www.cloudflare.com/cdn-cgi/trace'
        }
      } catch {
        // Fallback if geolocation fails
        userRegion = 'Unknown'
      }

      // Perform latency test (3 pings)
      const latencies: number[] = []
      for (let i = 0; i < 3; i++) {
        const start = performance.now()
        try {
          await fetch(testUrl, { cache: 'no-store', mode: 'no-cors' })
          latencies.push(performance.now() - start)
        } catch {
          latencies.push(999)
        }
        await sleep(100)
      }

      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length
      const jitter = Math.max(...latencies) - Math.min(...latencies)

      let networkScore = 100
      if (avgLatency > 100) networkScore = 70
      if (avgLatency > 200) networkScore = 50
      if (jitter > 30) networkScore -= 20

      results.networkLatency = {
        name: 'Network',
        status: networkScore >= 70 ? 'pass' : networkScore >= 50 ? 'warn' : 'fail',
        value: `${avgLatency.toFixed(0)}ms ${userRegion !== 'Unknown' ? `(${userRegion})` : ''}`,
        message: avgLatency < 50
          ? 'Low latency detected'
          : avgLatency < 150
          ? 'Moderate latency'
          : 'High latency detected',
        score: Math.max(30, networkScore),
        confidence: 60
      }
    } catch {
      results.networkLatency = {
        name: 'Network',
        status: 'warn',
        value: 'Test failed',
        message: 'Could not complete test',
        score: 50,
        confidence: 60
      }
    }

    setTests({ ...results })
    setProgress(100)

    // Calculate Weighted Overall Score (Hardware Detection Only)
    const weightedScores = [
      { test: results.gpu, weight: 0.35 },              // 35% - Most critical
      { test: results.hardwareAccel, weight: 0.30 },    // 30% - Critical
      { test: results.cores, weight: 0.20 },            // 20% - Important
      { test: results.memory, weight: 0.10 },           // 10% - Important
      { test: results.display, weight: 0.05 }           // 5% - Less reliable
    ]

    const overallScore = Math.round(
      weightedScores.reduce((acc, { test, weight }) => {
        return acc + (test.score || 0) * weight
      }, 0)
    )

    results.overall = {
      score: overallScore,
      grade: '',
      recommendation: 'Join Discord for personalized optimization guidance',
      browserLimitations: [
        'Cannot detect actual CS2 FPS or frame times',
        'Cannot access BIOS settings (RAM speed, CPU voltage, SMT status)',
        'Cannot detect driver versions or Windows power plan',
        'Network test shows CDN latency (~10-30ms), not CS2 server ping (100-140ms from Dubai)',
        'Cannot detect Process Lasso, affinity settings, or background processes'
      ]
    }

    setTests(results)
    await sleep(800)
    setStep('results')
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const downloadReport = () => {
    if (!tests) return

    const timestamp = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()

    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>FPSOS Diagnostic Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #000;
      color: #fff;
      font-family: 'Courier New', monospace;
      padding: 40px;
      line-height: 1.6;
    }
    .container { max-width: 900px; margin: 0 auto; }
    .header {
      border-bottom: 2px solid #680036;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .title {
      font-size: 24px;
      font-weight: bold;
      color: #680036;
      margin-bottom: 8px;
    }
    .subtitle { color: #999; font-size: 14px; }
    .section {
      margin-bottom: 30px;
      padding: 20px;
      background: rgba(104, 0, 54, 0.05);
      border-left: 3px solid #680036;
    }
    .section-title {
      font-size: 16px;
      font-weight: bold;
      color: #680036;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .hardware-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    .hardware-item {
      padding: 10px;
      background: rgba(255, 255, 255, 0.02);
    }
    .hardware-label {
      color: #999;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .hardware-value {
      color: #fff;
      font-size: 14px;
    }
    .score-display {
      text-align: center;
      padding: 30px;
      background: rgba(104, 0, 54, 0.1);
      border: 2px solid #680036;
      margin-bottom: 30px;
    }
    .score-number {
      font-size: 48px;
      font-weight: bold;
      color: #680036;
    }
    .score-label {
      color: #999;
      font-size: 14px;
      margin-top: 8px;
    }
    .limitation {
      color: #999;
      font-size: 13px;
      margin-bottom: 8px;
      padding-left: 20px;
      position: relative;
    }
    .limitation:before {
      content: "⚠";
      position: absolute;
      left: 0;
      color: #e89900;
    }
    .cta {
      background: rgba(104, 0, 54, 0.2);
      border: 2px solid #680036;
      padding: 25px;
      text-align: center;
      margin-top: 30px;
    }
    .cta-title {
      font-size: 18px;
      color: #680036;
      margin-bottom: 10px;
    }
    .cta-text {
      color: #999;
      font-size: 14px;
      margin-bottom: 15px;
    }
    .cta-link {
      color: #680036;
      text-decoration: none;
      font-weight: bold;
    }
    @media print {
      body { background: white; color: black; }
      .score-number, .title, .section-title, .cta-title { color: #680036; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">FPSOS DIAGNOSTIC REPORT</div>
      <div class="subtitle">Generated: ${timestamp}</div>
    </div>

    <div class="score-display">
      <div class="score-number">${tests.overall.score}</div>
      <div class="score-label">SYSTEM SCORE</div>
    </div>

    <div class="section">
      <div class="section-title">Hardware Information</div>
      <div class="hardware-grid">
        <div class="hardware-item">
          <div class="hardware-label">Graphics Card</div>
          <div class="hardware-value">${tests.gpu.value}</div>
        </div>
        <div class="hardware-item">
          <div class="hardware-label">Processor</div>
          <div class="hardware-value">${tests.cores.value}</div>
        </div>
        <div class="hardware-item">
          <div class="hardware-label">System Memory</div>
          <div class="hardware-value">${tests.memory.value}</div>
        </div>
        <div class="hardware-item">
          <div class="hardware-label">Display</div>
          <div class="hardware-value">${tests.display.value}</div>
        </div>
        <div class="hardware-item">
          <div class="hardware-label">Hardware Acceleration</div>
          <div class="hardware-value">${tests.hardwareAccel.value}</div>
        </div>
        <div class="hardware-item">
          <div class="hardware-label">Network Latency</div>
          <div class="hardware-value">${tests.networkLatency.value}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">Browser Limitations</div>
      <div class="limitation">Cannot detect actual CS2 FPS or frame times</div>
      <div class="limitation">Cannot access BIOS settings (RAM speed, timings, SMT status)</div>
      <div class="limitation">Cannot detect driver versions or Windows power plan</div>
      <div class="limitation">Network test shows CDN latency, not CS2 server ping</div>
    </div>

    <div class="cta">
      <div class="cta-title">Next Steps</div>
      <div class="cta-text">For personalized optimization guidance and deep system analysis</div>
      <div><a href="https://discord.gg/fpsos" class="cta-link">Join FPSOS Discord →</a></div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px;">
      FPSOS - Professional CS2 Optimization Services<br>
      <a href="https://fpsos.gg" style="color: #680036;">fpsos.gg</a>
    </div>
  </div>
</body>
</html>
    `.trim()

    const blob = new Blob([htmlReport], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  return (
    <main className="landingPage diagnosticPage" ref={pageRef}>
      {/* Purplish Dark Gradient Background */}
      <div className="purpleDarkGradient" />
      <SpaceParticles />
      <div className="noiseOverlay" />
      <div className="scanline" />

      <div className="mainContainer diagnosticContainer">

        {step === 'idle' && (
          <div className="diagIdleSection">
            <div className="diagHeroContent">
              <div className="diagHeroLabel">BROWSER-BASED HEALTH CHECK</div>
              <h1 className="diagHeroTitle">Quick diagnostic to identify optimization opportunities</h1>
              <p className="diagHeroDesc">
                Browser-based health check that identifies common performance bottlenecks. Note: This cannot replace deep BIOS/driver analysis—it's a quick scan to see if professional optimization would help.
              </p>

              <div className="diagWarningCard">
                <svg className="diagWarningIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div className="diagWarningText">
                  <div className="diagWarningTitle">For Accurate Results</div>
                  <div className="diagWarningDesc">
                    • Keep this tab focused during the test (browsers throttle background tabs)<br />
                    • Disable Process Lasso or similar CPU affinity tools temporarily<br />
                    • Reset any browser modifications to default settings<br />
                    • Close resource-intensive applications before testing
                  </div>
                </div>
              </div>

              <button onClick={runDiagnostics} className="diagStartButton">
                <span>BEGIN DIAGNOSTIC</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>

              <div className="diagFeatures">
                <div className="diagFeature">
                  <div className="diagFeatureIcon">⚡</div>
                  <div className="diagFeatureText">Hardware Detection</div>
                </div>
                <div className="diagFeature">
                  <div className="diagFeatureIcon">🎯</div>
                  <div className="diagFeatureText">Instant Results</div>
                </div>
                <div className="diagFeature">
                  <div className="diagFeatureIcon">🔒</div>
                  <div className="diagFeatureText">Browser-Based</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 'scanning' && (
          <div className="diagScanningSection">
            <div className="diagScanProgress">
              <div className="diagScanCircle">
                <svg className="diagScanRing" viewBox="0 0 200 200">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#progressGradient)"
                    strokeWidth="4"
                    strokeDasharray={`${(progress / 100) * 565} 565`}
                    strokeLinecap="round"
                    transform="rotate(-90 100 100)"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="rgba(139, 92, 246, 1)" />
                      <stop offset="100%" stopColor="rgba(59, 130, 246, 1)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="diagScanValue">{progress}%</div>
              </div>
            </div>

            <div className="diagScanStatus">{currentTest}</div>

            {tests && (
              <div className="diagScanTests">
                {Object.entries(tests).filter(([key]) => key !== 'overall').map(([key, test]) => (
                  <div key={key} className={`diagScanTest ${test.status}`}>
                    <div className="diagScanTestIcon">
                      {test.status === 'pending' && '○'}
                      {test.status === 'running' && '◐'}
                      {test.status === 'pass' && '✓'}
                      {test.status === 'warn' && '!'}
                      {test.status === 'fail' && '✗'}
                    </div>
                    <div className="diagScanTestName">{test.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {step === 'results' && tests && (
          <div className="diagResultsSection">

            {/* Page Header */}
            <div className="diagResultsHeader">
              <h1 className="diagResultsMainTitle">DIAGNOSTIC COMPLETE</h1>
              <p className="diagResultsSubtitle">Browser-based hardware detection • Limited scope analysis</p>
            </div>

            {/* Wide Hardware Grid */}
            <div className="diagHardwareWideGrid">
              <div className="diagHardwareWideCard">
                <div className="diagHardwareIcon">🎮</div>
                <div className="diagHardwareWideLabel">Graphics Card</div>
                <div className="diagHardwareWideValue">{tests.gpu.value || 'Unknown'}</div>
                <div className={`diagHardwareStatus ${tests.gpu.status}`}>
                  {tests.gpu.status === 'pass' ? '✓ Detected' : tests.gpu.status === 'warn' ? '⚠ Limited' : '✗ Issue'}
                </div>
              </div>

              <div className="diagHardwareWideCard">
                <div className="diagHardwareIcon">⚡</div>
                <div className="diagHardwareWideLabel">Processor</div>
                <div className="diagHardwareWideValue">{tests.cores.value || 'Unknown CPU'}</div>
                <div className={`diagHardwareStatus ${tests.cores.status}`}>
                  {tests.cores.status === 'pass' ? '✓ Detected' : tests.cores.status === 'warn' ? '⚠ Limited' : '✗ Issue'}
                </div>
              </div>

              <div className="diagHardwareWideCard">
                <div className="diagHardwareIcon">💾</div>
                <div className="diagHardwareWideLabel">System Memory</div>
                <div className="diagHardwareWideValue">{tests.memory.value || 'Unknown'}</div>
                <div className={`diagHardwareStatus ${tests.memory.status}`}>
                  {tests.memory.status === 'pass' ? '✓ Detected' : tests.memory.status === 'warn' ? '⚠ Limited' : '✗ Issue'}
                </div>
              </div>

              <div className="diagHardwareWideCard">
                <div className="diagHardwareIcon">🖥️</div>
                <div className="diagHardwareWideLabel">Display Output</div>
                <div className="diagHardwareWideValue">{tests.display.value || 'Unknown'}</div>
                <div className={`diagHardwareStatus ${tests.display.status}`}>
                  {tests.display.status === 'pass' ? '✓ Detected' : tests.display.status === 'warn' ? '⚠ Limited' : '✗ Issue'}
                </div>
              </div>

              <div className="diagHardwareWideCard">
                <div className="diagHardwareIcon">🌐</div>
                <div className="diagHardwareWideLabel">Network Latency</div>
                <div className="diagHardwareWideValue">{tests.networkLatency.value || 'Unknown'}</div>
                <div className={`diagHardwareStatus ${tests.networkLatency.status}`}>
                  {tests.networkLatency.status === 'pass' ? '✓ Good' : tests.networkLatency.status === 'warn' ? '⚠ Moderate' : '✗ High'}
                </div>
              </div>

              <div className="diagHardwareWideCard">
                <div className="diagHardwareIcon">⚙️</div>
                <div className="diagHardwareWideLabel">Hardware Acceleration</div>
                <div className="diagHardwareWideValue">{tests.hardwareAccel.value || 'Unknown'}</div>
                <div className={`diagHardwareStatus ${tests.hardwareAccel.status}`}>
                  {tests.hardwareAccel.status === 'pass' ? '✓ Enabled' : tests.hardwareAccel.status === 'warn' ? '⚠ Partial' : '✗ Disabled'}
                </div>
              </div>
            </div>

            {/* Phase 2: Professional Analysis Upsell */}
            <div className="diagDeepScanSection">
              <div className="diagDeepScanContent" style={{ background: 'linear-gradient(135deg, rgba(104, 0, 54, 0.4), rgba(20, 20, 30, 0.8))', borderColor: '#680036' }}>
                <div className="diagDeepScanIcon" style={{ color: '#ff00cc', borderColor: 'rgba(255, 0, 204, 0.3)', background: 'rgba(255, 0, 204, 0.1)' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <div className="diagDeepScanText">
                  <h3 className="diagDeepScanTitle" style={{ color: '#fff' }}>PHASE 2: DEEP SYSTEM SCAN</h3>
                  <p className="diagDeepScanDesc">
                    Browser tests are limited. To fix <strong>Input Lag, BIOS Errors, and Interrupt Affinity</strong>, use our <strong>AI Diagnostic Bot</strong>.
                    <br/><br/>
                    <em>Run the PowerShell suite and get instant analysis & recommendations.</em>
                  </p>
                  <div className="diagDeepScanBadges">
                    <span className="diagBadge" style={{borderColor: '#ff00cc', color: '#ff00cc'}}>AI Analysis</span>
                    <span className="diagBadge">BIOS Tuning</span>
                    <span className="diagBadge">Zero Latency</span>
                  </div>
                </div>
                <div className="diagDeepScanAction">
                  <button 
                    onClick={() => setIsBotOpen(true)}
                    className="diagDownloadBtn" 
                    style={{ background: 'linear-gradient(135deg, #ff00cc 0%, #680036 100%)', borderColor: '#ff00cc', cursor: 'pointer' }}
                  >
                    <span>Launch Diagnostic Bot</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                  <div className="diagInstruction">Get the full diagnostic & fix</div>
                </div>
              </div>
            </div>

            {/* Discord CTA */}
            <div className="diagDiscordCTA">
              <div className="diagDiscordIcon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </div>
              <div className="diagDiscordContent">
                <h3 className="diagDiscordTitle">
                  {tests.overall.score < 60
                    ? 'Need Help Understanding Your Results?'
                    : tests.overall.score < 85
                    ? 'Want Personalized Optimization Advice?'
                    : 'Ready for Advanced Optimization?'}
                </h3>
                <p className="diagDiscordDesc">
                  {tests.overall.score < 60
                    ? 'Browser tests show hardware limitations. Join Discord for: (1) Deep diagnostic PowerShell script, (2) Expert result analysis, (3) Guided booking assistance.'
                    : tests.overall.score < 85
                    ? 'Hardware looks good, but browser can\'t check BIOS/drivers. Join Discord to: (1) Run deep diagnostic script, (2) Get personalized optimization advice, (3) Book the right package.'
                    : 'Hardware is excellent! Join Discord for: (1) Advanced BIOS tuning guidance, (2) PowerShell deep diagnostic, (3) Help choosing advanced optimization options.'}
                </p>
                <a href="https://discord.gg/fpsos" target="_blank" rel="noreferrer" className="diagDiscordButton">
                  <span>Join FPSOS Discord</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/>
                    <line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="diagResultsActions">
              <Link href="/packages" className="diagActionButton diagActionPrimary">
                <span>View Optimization Packages</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
              <button onClick={downloadReport} className="diagActionButton diagActionSecondary">
                <span>View Report</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10 9 9 9 8 9"/>
                </svg>
              </button>
              <button onClick={() => { setStep('idle'); setTests(null); setProgress(0); }} className="diagActionButton diagActionSecondary">
                <span>Run Again</span>
              </button>
            </div>
          </div>
        )}

      </div>
      <BotInterface externalIsOpen={isBotOpen} setExternalIsOpen={setIsBotOpen} />
    </main>
  )
}
