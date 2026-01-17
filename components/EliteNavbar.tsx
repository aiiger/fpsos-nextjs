'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Package, HelpCircle, Home } from 'lucide-react'

export default function EliteNavbar({ onOpenBot }: { onOpenBot: () => void }) {
  const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Packages', href: '/packages', icon: Package },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
  ]

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4"
    >
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center gap-8 shadow-[0_10px_40px_rgba(0,0,0,0.5)] ring-1 ring-white/5">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 pr-4 border-r border-white/10 group">
          <div className="bg-cyan-500/10 p-1.5 rounded-lg group-hover:bg-cyan-500/20 transition-colors">
            <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
          </div>
          <span className="font-display font-bold text-white tracking-wider text-sm">
            FPS<span className="text-cyan-400">OS</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors group rounded-full hover:bg-white/5"
            >
              <span className="relative z-10 flex items-center gap-2">
                <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="pl-4 border-l border-white/10">
          <button
            onClick={onOpenBot}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <Zap className="w-3 h-3 fill-current" />
            Get Started
          </button>
        </div>
      </div>
    </motion.nav>
  )
}
