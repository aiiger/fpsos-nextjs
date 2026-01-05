'use client'

import { motion, useMotionValue, useTransform, animate, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function PackagesPage() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Gradient Background */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(135deg, #680036 0%, #000b58 100%)',
            'linear-gradient(135deg, #000b58 0%, #680036 100%)',
            'linear-gradient(135deg, #680036 0%, #000b58 100%)'
          ]
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0
        }}
      />

      {/* Interactive Cursor Glow */}
      <motion.div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(232, 153, 0, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 5,
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.2
          }}
          style={{
            position: 'absolute',
            left: `${(i * 6) + 10}%`,
            top: `${(i * 5) + 15}%`,
            width: `${2 + (i % 3)}px`,
            height: `${2 + (i % 3)}px`,
            background: i % 2 === 0 ? 'rgba(232, 153, 0, 0.6)' : 'rgba(255, 255, 255, 0.4)',
            borderRadius: '50%',
            filter: 'blur(1px)',
            zIndex: 2
          }}
        />
      ))}

      {/* Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 80, 0],
          y: [0, -60, 0],
          opacity: [0.25, 0.4, 0.25]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '10%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(232, 153, 0, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          zIndex: 1
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -60, 0],
          y: [0, 70, 0],
          opacity: [0.2, 0.35, 0.2]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '8%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(104, 0, 54, 0.25) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          zIndex: 1
        }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          position: 'relative',
          zIndex: 10,
          padding: '140px 60px 100px',
          maxWidth: '1500px',
          margin: '0 auto'
        }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '50px'
          }}
        >
          <PackageCard
            title="Quick Remote Fix"
            description="No Optimization, Just Solutions. Ideal if your PC is crashing, freezing or shutting down unexpectedly. Fast help, no fluff."
            price={199}
            features={[
              '1 Support Session (Valid 30 Days)',
              'Avg Completion: ~1 Hour',
              'Diagnose common PC issues: crashes, shutdowns, freezes',
              'Some issues may need follow-up sessions'
            ]}
            url="https://calendly.com/fpsoptimizationstation/quickremotefix"
          />
          <PackageCard
            title="Full System Tune-Up"
            description="For competitive gaming. Your all-in-one performance boost: faster FPS, lower latency, and smoother gameplay."
            price={399}
            features={[
              'Full optimization: Windows, BIOS, GPU & network',
              'Smart overclocking/undervolting (CPU/GPU/RAM)',
              '4 Support Tickets (Valid 30 Days)',
              'Stability & Stress Testing to guarantee results'
            ]}
            url="https://calendly.com/fpsoptimizationstation/fullsystemtuneup"
          />
          <PackageCard
            title="Extreme BIOSPRIME"
            description="Extreme BIOS Tuning for Elite Performance. Targeted BIOS tuning for the lowest latency and best RAM timings possible. Perfect for competitive players & enthusiasts."
            price={699}
            features={[
              'BIOS-only performance tuning',
              'Manual RAM timing optimization',
              'Guided stress testing for each stage',
              'Sessions split as needed to ensure stability'
            ]}
            url="https://calendly.com/fpsoptimizationstation/extremebiosprime"
          />
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{
          position: 'fixed',
          bottom: '36px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '48px',
          zIndex: 100,
          backdropFilter: 'blur(20px)',
          padding: '16px',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '50px',
          maxWidth: 'fit-content',
          margin: '0 auto'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.3, duration: 0.6 }}
          style={{
            color: '#ffffff',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-display)'
          }}
        >
          FPS OPTIMIZATION STATION
        </motion.div>

        <motion.a
          href="/packages"
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 11, 88, 0.8)' }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          style={{
            color: '#ffffff',
            fontSize: '0.875rem',
            fontWeight: 700,
            textDecoration: 'none',
            padding: '12px 28px',
            background: 'rgba(0, 11, 88, 0.6)',
            borderRadius: '12px',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontFamily: 'var(--font-display)',
            transition: 'all 0.2s'
          }}
        >
          PACKAGES
        </motion.a>

        <SocialIcons />
      </motion.div>

      {/* Bottom Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        style={{
          position: 'fixed',
          bottom: '8px',
          left: 0,
          right: 0,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.25)',
          fontSize: '0.6875rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
          fontFamily: 'var(--font-display)'
        }}
      >
        NO EXTREME OVERCLOCKING—ONLY SAFE, TESTED OPTIMIZATIONS. SESSIONS
      </motion.div>
    </div>
  )
}

function SocialIcons() {
  const icons = [
    { href: 'https://discord.gg/K3A6MkNXT9', emoji: '💬' },
    { href: 'https://wa.link/jtku16', emoji: '📱' },
    { href: 'https://calendly.com/fpsoptimizationstation', emoji: '📅' },
    { href: 'https://instagram.com/fpsoptimizationstation', emoji: '📷' }
  ]

  return (
    <div style={{ display: 'flex', gap: '24px' }}>
      {icons.map((icon, i) => (
        <motion.a
          key={icon.href}
          href={icon.href}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 1.5 + (i * 0.1),
            duration: 0.4,
            type: "spring",
            stiffness: 300
          }}
          whileHover={{
            scale: 1.2,
            rotate: [0, -8, 8, 0],
            transition: { duration: 0.3 }
          }}
          whileTap={{ scale: 0.9 }}
          style={{
            fontSize: '1.75rem',
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))'
          }}
        >
          {icon.emoji}
        </motion.a>
      ))}
    </div>
  )
}

interface PackageCardProps {
  title: string
  description: string
  price: number
  features: string[]
  url: string
}

function PackageCard({ title, description, price, features, url }: PackageCardProps) {
  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      variants={cardVariants}
      whileHover={{
        scale: 1.02,
        y: -8,
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.5)',
        transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '50px',
        padding: '50px 60px',
        background: 'rgba(0, 0, 0, 0.2)',
        backdropFilter: 'blur(15px)',
        border: '2px solid rgba(255, 255, 255, 0.25)',
        borderRadius: '60px',
        textDecoration: 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 50px rgba(0, 0, 0, 0.3)',
        transition: 'all 0.3s cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      {/* Animated Glow Effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          inset: -2,
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%)',
          borderRadius: 'inherit',
          pointerEvents: 'none'
        }}
      />

      {/* Left: Title and Description */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        style={{
          flex: '0 0 340px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          position: 'relative',
          zIndex: 1
        }}
      >
        <h2 style={{
          fontSize: '2.25rem',
          fontWeight: 700,
          color: '#ffffff',
          margin: 0,
          fontFamily: 'var(--font-display)',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
          textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(255, 255, 255, 0.85)',
          margin: 0,
          lineHeight: 1.6
        }}>
          {description}
        </p>
      </motion.div>

      {/* Middle: Features */}
      <motion.ul
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          flex: 1,
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          position: 'relative',
          zIndex: 1
        }}
      >
        {features.map((feature, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + (i * 0.08), duration: 0.5 }}
            style={{
              fontSize: '1rem',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: 1.5,
              paddingLeft: '24px',
              position: 'relative'
            }}
          >
            <span style={{
              position: 'absolute',
              left: 0,
              top: '3px',
              fontSize: '1.25rem',
              color: 'rgba(255, 255, 255, 0.7)'
            }}>•</span>
            {feature}
          </motion.li>
        ))}
      </motion.ul>

      {/* Right: Animated Price */}
      <div style={{
        flex: '0 0 240px',
        textAlign: 'right',
        position: 'relative',
        zIndex: 1
      }}>
        <AnimatedPrice price={price} />
      </div>
    </motion.a>
  )
}

function AnimatedPrice({ price }: { price: number }) {
  const [hasAnimated, setHasAnimated] = useState(false)
  const count = useMotionValue(0)
  const rounded = useTransform(count, Math.round)

  useEffect(() => {
    if (!hasAnimated) {
      const controls = animate(count, price, {
        duration: 2,
        delay: 0.6,
        ease: [0.22, 1, 0.36, 1]
      })
      setHasAnimated(true)
      return controls.stop
    }
  }, [count, price, hasAnimated])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: 0.4,
        duration: 0.6,
        ease: [0.34, 1.56, 0.64, 1]
      }}
    >
      <div style={{
        fontSize: '1.75rem',
        fontWeight: 700,
        color: '#ffffff',
        marginBottom: '8px',
        letterSpacing: '0.05em'
      }}>
        AED
      </div>
      <motion.div style={{
        fontSize: '5rem',
        fontWeight: 900,
        color: '#ffffff',
        fontFamily: 'var(--font-display)',
        lineHeight: 0.9,
        letterSpacing: '-0.03em',
        textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        {rounded}
      </motion.div>
    </motion.div>
  )
}
