'use client'

import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 150 }
  const x = useSpring(mouseX, springConfig)
  const y = useSpring(mouseY, springConfig)

  useEffect(() => {
    setIsLoaded(true)
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
      {/* Dynamic Animated Gradient Background */}
      <motion.div
        animate={{
          background: [
            'linear-gradient(135deg, #4a0e4e 0%, #1a0a3e 50%, #0a1654 100%)',
            'linear-gradient(135deg, #0a1654 0%, #4a0e4e 50%, #1a0a3e 100%)',
            'linear-gradient(135deg, #1a0a3e 0%, #0a1654 50%, #4a0e4e 100%)',
            'linear-gradient(135deg, #4a0e4e 0%, #1a0a3e 50%, #0a1654 100%)'
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

      {/* Interactive 3D-like Cursor Glow */}
      <motion.div
        style={{
          position: 'fixed',
          left: x,
          top: y,
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(232, 153, 0, 0.4) 0%, rgba(232, 153, 0, 0.2) 40%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
          zIndex: 5,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'screen'
        }}
      />

      {/* Multiple Floating Gradient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1.2, 1],
          x: [0, 50, -30, 0],
          y: [0, -40, 20, 0],
          opacity: [0.3, 0.6, 0.4, 0.3]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '10%',
          right: '15%',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(232, 153, 0, 0.35) 0%, rgba(255, 193, 7, 0.2) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 1,
          mixBlendMode: 'screen'
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.4, 1.1, 1],
          x: [0, -60, 40, 0],
          y: [0, 50, -30, 0],
          opacity: [0.2, 0.5, 0.3, 0.2]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '10%',
          width: '700px',
          height: '700px',
          background: 'radial-gradient(circle, rgba(104, 0, 54, 0.4) 0%, rgba(168, 0, 84, 0.2) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          zIndex: 1,
          mixBlendMode: 'screen'
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.3, 1.15, 1],
          x: [0, 70, -50, 0],
          y: [0, -30, 40, 0],
          opacity: [0.25, 0.55, 0.35, 0.25]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '900px',
          height: '900px',
          background: 'radial-gradient(circle, rgba(0, 204, 188, 0.25) 0%, rgba(100, 210, 255, 0.15) 50%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          zIndex: 1,
          mixBlendMode: 'screen'
        }}
      />

      {/* Enhanced Floating Particles */}
      {[...Array(40)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            y: [0, -50 - (i % 3) * 20, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.1, 0.8, 0.1],
            scale: [0.8, 1.5, 0.8]
          }}
          transition={{
            duration: 4 + i * 0.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.15
          }}
          style={{
            position: 'absolute',
            left: `${(i * 2.5) + 5}%`,
            top: `${(i * 2) + 10}%`,
            width: `${3 + (i % 5)}px`,
            height: `${3 + (i % 5)}px`,
            background: i % 3 === 0 ? 'rgba(232, 153, 0, 0.8)' : i % 3 === 1 ? 'rgba(255, 255, 255, 0.6)' : 'rgba(100, 210, 255, 0.7)',
            borderRadius: '50%',
            filter: 'blur(1.5px)',
            boxShadow: i % 3 === 0 ? '0 0 8px rgba(232, 153, 0, 0.8)' : '0 0 6px rgba(255, 255, 255, 0.6)',
            zIndex: 2
          }}
        />
      ))}

      {/* Grid Pattern Overlay */}
      <motion.div
        animate={{
          opacity: [0.02, 0.05, 0.02]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '0 40px'
      }}>
        <AnimatePresence>
          {isLoaded && (
            <Link href="/packages" style={{ display: 'block' }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, rotateX: 15 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{
                  duration: 1.5,
                  delay: 0.6,
                  ease: [0.19, 1, 0.22, 1]
                }}
                style={{
                  perspective: '1000px',
                  transformStyle: 'preserve-3d'
                }}
              >
                <motion.img
                  src="/frame-up.png"
                  alt="FPSOS Landing"
                  whileHover={{
                    scale: 1.03,
                    rotateY: 2,
                    rotateX: -2,
                    transition: { duration: 0.4, ease: "easeOut" }
                  }}
                  animate={{
                    y: [0, -15, 0],
                  }}
                  transition={{
                    y: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                  style={{
                    width: '100%',
                    maxWidth: '1400px',
                    height: 'auto',
                    display: 'block',
                    filter: 'drop-shadow(0 30px 80px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 40px rgba(232, 153, 0, 0.3))',
                    cursor: 'pointer',
                    borderRadius: '20px',
                    transformStyle: 'preserve-3d'
                  }}
                />
              </motion.div>
            </Link>
          )}
        </AnimatePresence>
      </div>

    </div>
  )
}

// Enhanced Social Icon with More Life
function SocialIconEnhanced({ href, icon, delay, color }: { href: string; icon: string; delay: number; color: string }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0, rotateZ: -180 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotateZ: 0,
        y: [0, -8, 0]
      }}
      transition={{
        scale: {
          delay: 0.8 + delay,
          duration: 0.6,
          type: "spring",
          stiffness: 200,
          damping: 15
        },
        opacity: {
          delay: 0.8 + delay,
          duration: 0.6
        },
        rotateZ: {
          delay: 0.8 + delay,
          duration: 0.6
        },
        y: {
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: delay
        }
      }}
      whileHover={{
        scale: 1.25,
        rotateZ: 360,
        transition: { duration: 0.5 }
      }}
      whileTap={{ 
        scale: 0.9,
        rotateZ: -15
      }}
      style={{
        fontSize: '2.5rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        filter: `drop-shadow(0 0 15px ${color}80)`,
        position: 'relative'
      }}
    >
      <motion.div
        animate={{
          boxShadow: [
            `0 0 20px ${color}00`,
            `0 0 40px ${color}80`,
            `0 0 20px ${color}00`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '50%',
          pointerEvents: 'none'
        }}
      />
      {icon}
    </motion.a>
  )
}
