'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Cpu, Box, Zap, Menu, X, Command } from 'lucide-react'
import InputZeroMenu from './InputZeroMenu'

import { usePathname } from 'next/navigation'

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEliteMenuOpen, setIsEliteMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const pathname = usePathname()

  // Detect scroll for styling and auto-hide
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Close mobile menu on scroll
      if (isMenuOpen) {
        setIsMenuOpen(false)
      }

      // Update scrolled state for styling
      setIsScrolled(currentScrollY > 20)

      // Auto-hide logic
      if (currentScrollY < 20) {
        // Always show at top
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY, isMenuOpen])

  if (pathname?.startsWith('/admin')) return null

  return (
    <>
      <motion.nav
        className="fixed top-0 sm:top-8 left-0 right-0 z-50 pointer-events-none flex justify-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: isVisible ? 0 : -100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div
          className={`
                w-full md:w-[90%] lg:w-[85%] max-w-7xl px-6 md:px-8 py-4 
                flex items-center justify-between pointer-events-auto relative 
                transition-all duration-500 ease-out
                ${isScrolled ? 'bg-black/70 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/50 sm:rounded-full py-3' : 'bg-transparent border-transparent'}
            `}
        >

          {/* BACKGROUND BLUR (Mobile Only Default force full width look) */}
          <div className={`absolute inset-0 bg-black/50 backdrop-blur-md border-b border-white/10 sm:hidden transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`} />

          {/* LEFT: Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-3 group group-hover:opacity-80 transition-opacity">
            <div className="relative">
              <Command className="w-8 h-8 sm:w-9 sm:h-9 text-white relative z-10" />
            </div>
            <span className="text-white font-bold tracking-tight text-xl sm:text-2xl font-sans no-underline">
              FPSOS
            </span>
          </Link>

          {/* CENTER: Navigation Links + Social Icons (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
            {/* Navigation Links */}
            <Link
              href="/reaction-test"
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300 no-underline"
            >
              <Zap className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="font-semibold text-[14px] tracking-tight font-sans">Reaction Test</span>
            </Link>
            <Link
              href="/book"
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300 no-underline"
            >
              <Box className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="font-semibold text-[14px] tracking-tight font-sans">Book Session</span>
            </Link>
            <Link
              href="/input-zero"
              className="group flex items-center gap-2 text-white/50 hover:text-white transition-all duration-300 no-underline"
            >
              <Cpu className="w-4 h-4 opacity-50 group-hover:opacity-100" />
              <span className="font-semibold text-[14px] tracking-tight font-sans">Hardware</span>
            </Link>

            {/* Subtle Divider */}
            <div className="w-px h-4 bg-white/20" />

            {/* Social Icons - Integrated */}
            <div className="flex items-center gap-4">
              <SocialLink href="https://discord.gg/K3A6MkNXT9" label="Discord" color="hover:text-cyan-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://wa.link/jtku16" label="WhatsApp" color="hover:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.471-.148-.67.15c-.197.297-.767.966-.94 1.164c-.173.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52c.149-.174.198-.298.298-.497c.099-.198.05-.371-.025-.52c-.075-.149-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51c-.173-.008-.371-.01-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625c.712.227 1.36.195 1.871.118c.571-.085 1.758-.719 2.006-1.413c.248-.694.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214l-3.741.982l.998-3.648l-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </SocialLink>
              <SocialLink href="https://instagram.com/fpsoptimizationstation" label="Instagram" color="hover:text-pink-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919c.058 1.265.069 1.645.069 4.849c0 3.205-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919c-1.266.058-1.644.07-4.85.07c-3.204 0-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92c-.058-1.265-.07-1.644-.07-4.849c0-3.204.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919c1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072C2.695.272.273 2.69.073 7.052C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98c.059-1.28.073-1.689.073-4.948c0-3.259-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324a6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8a4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881a1.44 1.44 0 000-2.881z" />
                </svg>
              </SocialLink>
            </div>
          </div>

          {/* RIGHT: Hamburger Button (Mobile/Tablet Only) + ELITE Button */}
          <div className="flex items-center gap-4 relative z-10">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEliteMenuOpen(true)}
              className="group flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all duration-300"
            >
              <Command className="w-4 h-4 text-white/40 group-hover:text-white" />
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-white/50 group-hover:text-white">Elite</span>
              <div className="hidden sm:block ml-2 px-1.5 py-0.5 rounded bg-white/10 text-[8px] font-mono text-white/20">ESC</div>
            </motion.button>

            <button
              className="lg:hidden text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      <InputZeroMenu isOpen={isEliteMenuOpen} onClose={() => setIsEliteMenuOpen(false)} />

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-24 px-6 flex flex-col gap-6 sm:hidden"
          >
            <div className="flex flex-col gap-6">
              <MobileLink href="/reaction-test" icon={<Zap className="w-5 h-5" />} label="Reaction Test" onClick={() => setIsMenuOpen(false)} />
              <MobileLink href="/packages" icon={<Box className="w-5 h-5" />} label="Packages" onClick={() => setIsMenuOpen(false)} />
            </div>

            <div className="w-full h-px bg-white/10 my-2" />

            <div className="flex justify-center gap-8">
              <SocialLink href="https://discord.gg/K3A6MkNXT9" label="Discord" color="hover:text-cyan-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" /></svg>
              </SocialLink>
              <SocialLink href="https://wa.link/jtku16" label="WhatsApp" color="hover:text-green-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967c-.273-.099-.471-.148-.67.15c-.197.297-.767.966-.94 1.164c-.173.199-.347.223-.644.075c-.297-.15-1.255-.463-2.39-1.475c-.883-.788-1.48-1.761-1.653-2.059c-.173-.297-.018-.458.13-.606c.134-.133.298-.347.446-.52c.149-.174.198-.298.298-.497c.099-.198.05-.371-.025-.52c-.075-.149-.669-1.612-.916-2.207c-.242-.579-.487-.5-.669-.51c-.173-.008-.371-.01-.57-.01c-.198 0-.52.074-.792.372c-.272.297-1.04 1.016-1.04 2.479c0 1.462 1.065 2.875 1.213 3.074c.149.198 2.096 3.2 5.077 4.487c.709.306 1.262.489 1.694.625c.712.227 1.36.195 1.871.118c.571-.085 1.758-.719 2.006-1.413c.248-.694.248-1.289.173-1.413c-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214l-3.741.982l.998-3.648l-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884c2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              </SocialLink>
              <SocialLink href="https://instagram.com/fpsoptimizationstation" label="Instagram" color="hover:text-pink-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07c3.252.148 4.771 1.691 4.919 4.919c.058 1.265.069 1.645.069 4.849c0 3.205-.012 3.584-.069 4.849c-.149 3.225-1.664 4.771-4.919 4.919c-1.266.058-1.644.07-4.85.07c-3.204 0-3.584-.012-4.849-.07c-3.26-.149-4.771-1.699-4.919-4.92c-.058-1.265-.07-1.644-.07-4.849c0-3.204.013-3.583.07-4.849c.149-3.227 1.664-4.771 4.919-4.919c1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072C2.695.272.273 2.69.073 7.052C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948c.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072c4.354-.2 6.782-2.618 6.979-6.98c.059-1.28.073-1.689.073-4.948c0-3.259-.014-3.667-.072-4.947c-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324a6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8a4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881a1.44 1.44 0 000-2.881z" /></svg>
              </SocialLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function SocialLink({ href, label, color, children }: { href: string; label: string; color: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-gray-400 ${color} transition-colors duration-200 relative`}
      aria-label={label}
      whileHover={{
        scale: 1.25,
        y: -2,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Glow effect behind icon */}
      <motion.div
        className="absolute inset-0 rounded-full bg-current blur-lg opacity-0"
        whileHover={{ opacity: 0.4, scale: 1.5 }}
        transition={{ duration: 0.2 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.a>
  )
}

function MobileLink({ href, label, icon, onClick }: { href: string; label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ x: 8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center gap-4 text-2xl font-black uppercase text-gray-300 hover:text-white transition-colors p-2"
      >
        <motion.div
          className="text-white/40 group-hover:text-white"
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 0.4 }}
        >
          {icon}
        </motion.div>
        {label}
      </Link>
    </motion.div>
  )
}