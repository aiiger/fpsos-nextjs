'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'

const bookingHotspots: Array<{
  href: string
  ariaLabel: string
  style: CSSProperties
}> = [
  {
    href: 'https://calendly.com/fpsoptimizationstation/quickremotefix',
    ariaLabel: 'Book Quick Remote Fix',
    style: { top: '16%', left: '62%', width: '31%', height: '14%' }
  },
  {
    href: 'https://calendly.com/fpsoptimizationstation/fullsystemtuneup',
    ariaLabel: 'Book Full System Tune-Up',
    style: { top: '40%', left: '62%', width: '31%', height: '14%' }
  },
  {
    href: 'https://calendly.com/fpsoptimizationstation/extremebiosprime',
    ariaLabel: 'Book Extreme BIOSPRIME',
    style: { top: '64%', left: '62%', width: '31%', height: '14%' }
  }
]

const iconHotspots: Array<{
  href: string
  ariaLabel: string
  style: CSSProperties
}> = [
  {
    href: 'https://discord.gg/K3A6MkNXT9',
    ariaLabel: 'Open Discord',
    style: { top: '82.5%', left: '59%', width: '6%', height: '8%' }
  },
  {
    href: 'https://wa.link/jtku16',
    ariaLabel: 'Open WhatsApp',
    style: { top: '82.5%', left: '67%', width: '6%', height: '8%' }
  },
  {
    href: 'https://instagram.com/fpsoptimizationstation',
    ariaLabel: 'Open Instagram',
    style: { top: '82.5%', left: '75%', width: '6%', height: '8%' }
  }
]

const packagesButtonStyle: CSSProperties = {
  top: '79%',
  left: '34%',
  width: '18%',
  height: '10%'
}

export default function PackagesPage() {
  return (
    <main className="pixelPage">
      <div className="pixelCanvas">
        <Image
          src="/canva/packages.png"
          alt="FPSOS Canva packages page mockup"
          width={1920}
          height={1080}
          priority
          className="pixelImage"
        />

        <div className="pixelHotspots" aria-label="Clickable areas">
          <Link href="/" className="pixelHotspot" aria-label="Return to home" style={packagesButtonStyle}>
            <span className="srOnly">Return to home</span>
          </Link>

          {bookingHotspots.map((hotspot) => (
            <a
              key={hotspot.ariaLabel}
              href={hotspot.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pixelHotspot"
              aria-label={hotspot.ariaLabel}
              style={hotspot.style}
            >
              <span className="srOnly">{hotspot.ariaLabel}</span>
            </a>
          ))}

          {iconHotspots.map((hotspot) => (
            <a
              key={hotspot.ariaLabel}
              href={hotspot.href}
              target="_blank"
              rel="noopener noreferrer"
              className="pixelHotspot"
              aria-label={hotspot.ariaLabel}
              style={hotspot.style}
            >
              <span className="srOnly">{hotspot.ariaLabel}</span>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

