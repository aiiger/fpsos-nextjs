'use client'

import Link from 'next/link'

const socials = [
  { href: 'https://discord.gg/K3A6MkNXT9', icon: '💬', label: 'Discord' },
  { href: 'https://wa.link/jtku16', icon: '📱', label: 'WhatsApp' },
  { href: 'https://calendly.com/fpsoptimizationstation', icon: '📅', label: 'Calendly' },
  { href: 'https://instagram.com/fpsoptimizationstation', icon: '📷', label: 'Instagram' }
]

export default function SiteHeader() {
  return (
    <header className="siteHeader">
      <nav>
        <Link className="navLink" href="/packages">
          PACKAGES
        </Link>
        <div className="headerIcons">
          {socials.map((item) => (
            <a
              className="iconLink"
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.label}
            >
              {item.icon}
            </a>
          ))}
        </div>
      </nav>
    </header>
  )
}