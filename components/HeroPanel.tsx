'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function HeroPanel() {
  const prefersReducedMotion = useReducedMotion()

  const hoverProps = prefersReducedMotion
    ? {}
    : {
        whileHover: { scale: 1.01, boxShadow: '0 25px 60px rgba(0,0,0,0.55)' },
        whileTap: { scale: 0.99 }
      }

  return (
    <div className="heroWrap">
      <Link href="/packages" aria-label="View packages">
        <motion.div
          className="heroPanel"
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          {...hoverProps}
        >
          <motion.img
            className="heroImg"
            src="/frame-up.png"
            alt="FPSOS landing illustration"
            loading="lazy"
          />
        </motion.div>
      </Link>
    </div>
  )
}