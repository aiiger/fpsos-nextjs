'use client'

import React, { useState } from 'react'
import { useTuner } from '@/context/TunerContext';
import { motion } from 'framer-motion';

// --- SVG ASSETS (Holographic Neon) ---
const LeftGuardianSVG = ({ isHovered }: { isHovered: boolean }) => (
  <motion.div
    className={`w-full h-full transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
    animate={{
      y: [0, -8, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0
    }}
    style={{
      opacity: 0.8,
      filter: isHovered
        ? 'invert(76%) sepia(66%) saturate(2226%) hue-rotate(358deg) drop-shadow(0 0 35px rgba(245, 158, 11, 0.9))'
        : 'invert(76%) sepia(66%) saturate(2226%) hue-rotate(358deg) drop-shadow(0 0 15px rgba(245, 158, 11, 0.3))'
    }}
  >
    <svg viewBox="0 0 242 216" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <image href="/art/guy-left.svg" width="242" height="216" />
    </svg>
  </motion.div>
)

const RightGuardianSVG = ({ isHovered }: { isHovered: boolean }) => (
  <motion.div
    className={`w-full h-full transition-all duration-700 ${isHovered ? 'scale-105' : 'scale-100'}`}
    animate={{
      y: [0, -8, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5
    }}
    style={{
      opacity: 0.8,
      filter: isHovered
        ? 'invert(66%) sepia(85%) saturate(1450%) hue-rotate(135deg) drop-shadow(0 0 35px rgba(0, 245, 255, 0.9))'
        : 'invert(66%) sepia(85%) saturate(1450%) hue-rotate(135deg) drop-shadow(0 0 15px rgba(0, 245, 255, 0.3))'
    }}
  >
    <svg viewBox="0 0 242 216" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <image href="/art/guy-right.svg" width="242" height="216" />
    </svg>
  </motion.div>
)

export default function IndustrialHero() {
  const { values } = useTuner();
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setMousePos({
      x: (clientX - centerX) / 15, // Subtle shift
      y: (clientY - centerY) / 15
    });
  };

  return (
    // Z-STACK: Background is z-0 (in page.tsx), Hero Container is z-10 context
    // REMOVED: overflow-hidden constraints. Added min-h to ensure spacing.
    <div
      className="relative w-full flex flex-col items-center justify-start pt-32 text-white z-10 overflow-visible pb-0"
      onMouseMove={handleMouseMove}
      style={{
        marginTop: `${values.heroTopMargin}px`
      }}
    >
      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />



      {/* LAYER 1: CENTERPIECE (Z-10) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 z-10 flex flex-col items-center justify-center text-center pointer-events-none w-full"
        style={{
          top: `${values.heroTextVerticalPos}px`,
          transform: `translateX(calc(-50% + ${values.heroTextTranslateX}px))`
        }}
      >
        <motion.h1
          initial={{ opacity: 0, scale: 0.8, y: 100, rotateX: 60, filter: "blur(40px)" }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)"
          }}
          transition={{
            duration: 1.8,
            ease: [0.16, 1, 0.3, 1], // Apple-style expo out
            delay: 0.1
          }}
          className="text-[14vw] md:text-[10vw] font-black tracking-tighter leading-none font-rajdhani text-white"
          style={{
            textShadow: `
                       0 0 10px rgba(255, 255, 255, 0.4),
                       0 0 30px rgba(0, 245, 255, 0.3),
                       0 0 60px rgba(0, 0, 0, 0.9)
                   `,
            transformStyle: 'preserve-3d',
            perspective: '1200px'
          }}
        >
          FPSOS
        </motion.h1>

        {/* Animated glow effect behind FPSOS */}
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0, scale: 0.5, filter: "blur(120px)" }}
          animate={{
            opacity: [0, 0.8, 0.5],
            scale: [0.5, 1.5, 1.2]
          }}
          transition={{
            duration: 2.5,
            delay: 0.4,
            ease: "easeOut"
          }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[250px] bg-cyan-500/20 blur-[120px] rounded-full" />
        </motion.div>
      </div>

      {/* LAYER 2: CHARACTERS (Z-20) - Hidden on mobile for clean experience */}
      <div className="relative w-full max-w-[1920px] px-4 md:px-24 z-20 pointer-events-none hidden md:block">
        {/* Pointer events auto re-enabled on interactive children */}
        <div className="grid grid-cols-2 gap-8 w-full relative min-h-[600px]">

          {/* LEFT GUARDIAN (Amber) */}
          <motion.div
            // Start from center (rightwards for left col) and slightly lower
            initial={{ opacity: 0, x: 150, y: 50, scale: 0.8, filter: "blur(20px)" }}
            animate={{
              opacity: values.guardianOpacity,
              x: values.leftGuardianOffsetX + (hoverSide === 'left' ? mousePos.x : mousePos.x * 0.2),
              y: values.guardianOffsetY + (hoverSide === 'left' ? mousePos.y : mousePos.y * 0.2),
              scale: 1,
              filter: "blur(0px)"
            }}
            transition={{
              duration: 2.5, // Slow, cinematic move
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1] // Custom refined bezier for "slow reveal"
            }}
            className="flex flex-col items-center md:items-end justify-center cursor-pointer group relative pr-0 md:pr-4 pointer-events-auto"
            onMouseEnter={() => setHoverSide('left')}
            onMouseLeave={() => setHoverSide(null)}
          >
            <div className="relative w-full max-w-[280px] md:max-w-[320px] lg:max-w-[380px] flex flex-col items-center transition-transform duration-500">
              <div className="relative z-10 w-full" style={{ transform: `scale(${values.guardianScale / 100})` }}>
                <LeftGuardianSVG isHovered={hoverSide === 'left'} />


              </div>

              {/* Left System Status - SPEECH BUBBLE */}
              <div className={`absolute -right-8 top-12 z-50 transition-all duration-300 ${hoverSide === 'left'
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}>
                <div className="relative bg-black/80 backdrop-blur-md border border-amber-500/50 text-amber-500 px-4 py-2 rounded-lg shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <div className="text-xs font-mono font-bold tracking-wider">SYSTEM_STATUS</div>
                  <div className="text-sm font-bold animate-pulse">CRITICAL</div>
                  {/* Speech Tail */}
                  <div className="absolute top-4 -left-1.5 w-3 h-3 bg-black/80 border-l border-b border-amber-500/50 rotate-45 transform"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* RIGHT GUARDIAN (Cyan) */}
          <motion.div
            // Start from center (leftwards for right col) and slightly lower
            initial={{ opacity: 0, x: -150, y: 50, scale: 0.8, filter: "blur(20px)" }}
            animate={{
              opacity: values.guardianOpacity,
              x: values.rightGuardianOffsetX + (hoverSide === 'right' ? mousePos.x : mousePos.x * 0.2),
              y: values.guardianOffsetY + (hoverSide === 'right' ? mousePos.y : mousePos.y * 0.2),
              scale: 1,
              filter: "blur(0px)"
            }}
            transition={{
              duration: 2.5, // Slow, cinematic move matching left
              delay: 0.2, // Sync with left for impact
              ease: [0.22, 1, 0.36, 1]
            }}
            className="flex flex-col items-center md:items-start justify-center cursor-pointer group relative pl-0 md:pl-4 pointer-events-auto"
            onMouseEnter={() => setHoverSide('right')}
            onMouseLeave={() => setHoverSide(null)}
          >
            <div className="relative w-full max-w-[280px] md:max-w-[320px] lg:max-w-[380px] flex flex-col items-center transition-transform duration-500">
              <div className="relative z-10 w-full" style={{ transform: `scale(${values.guardianScale / 100})` }}>
                <RightGuardianSVG isHovered={hoverSide === 'right'} />


              </div>

              {/* Right System Status - SPEECH BUBBLE */}
              <div className={`absolute -left-8 top-12 z-50 transition-all duration-300 ${hoverSide === 'right'
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}>
                <div className="relative bg-black/80 backdrop-blur-md border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-lg shadow-[0_0_30px_rgba(0,245,255,0.3)]">
                  <div className="text-xs font-mono font-bold tracking-wider">SYSTEM_STATUS</div>
                  <div className="text-sm font-bold animate-pulse">OPTIMIZED</div>
                  {/* Speech Tail */}
                  <div className="absolute top-4 -right-1.5 w-3 h-3 bg-black/80 border-r border-t border-cyan-500/50 rotate-45 transform"></div>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}