'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTuner } from '@/context/TunerContext';

// --- SVG ASSETS ---
const LeftGuardianSVG = () => (
  <svg viewBox="0 0 242 216" className="w-full h-full stroke-white/80 drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
    <image href="/art/guy-left.svg" width="242" height="216" />
  </svg>
)

const RightGuardianSVG = () => (
  <svg viewBox="0 0 242 216" className="w-full h-full stroke-white/80 drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
    <image href="/art/guy-right.svg" width="242" height="216" />
  </svg>
)

export default function ComparisonSection() {
  const { values } = useTuner(); // Connect to Tuner
  const [hoverSide, setHoverSide] = useState<'left' | 'right' | null>(null);

  return (
    <section 
        className="relative w-full bg-[#050505] overflow-hidden min-h-[85vh] flex flex-col justify-center"
        style={{ marginTop: `${values.heroTopMargin}px` }}
    >
      <div className="container mx-auto px-6 relative z-20">
        
        {/* Dynamic Title (Anchored at Top) */}
        <div 
            className="text-center mb-16 relative"
            style={{ 
                transform: `translate(${values.heroTextTranslateX}px, ${values.heroTextVerticalPos}px)` 
            }}
        >
            <h1 className="text-[12vw] md:text-[8vw] font-black tracking-tighter leading-none font-rajdhani text-transparent bg-clip-text bg-gradient-to-b from-white to-white/10 select-none">
                FPSOS
            </h1>
            <div className="absolute bottom-0 left-0 w-full flex justify-center translate-y-full pt-4">
                 <div className="flex gap-4">
                    <span className={`px-3 py-1 text-sm font-mono border rounded transition-colors duration-500 backdrop-blur-md ${hoverSide === 'left' ? 'border-amber-500 text-amber-500 bg-amber-500/10' : 'border-white/10 text-white/20'}`}>
                        LATENCY: {hoverSide === 'left' ? 'HIGH' : hoverSide === 'right' ? '0ms' : '---'}
                    </span>
                 </div>
            </div>
        </div>
        
        {/* Anchored Character Grid with Tuner Gap */}
        <div 
            className="grid grid-cols-1 md:grid-cols-2 items-center max-w-6xl mx-auto"
            style={{ gap: `${values.guardianGap}px` }}
        >
          
          {/* Unoptimized Column (Amber) */}
          <motion.div 
            className={`relative p-8 md:p-12 flex flex-col items-center rounded-3xl border transition-all duration-500 cursor-pointer ${hoverSide === 'left' ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/[0.02]'}`}
            onMouseEnter={() => setHoverSide('left')}
            onMouseLeave={() => setHoverSide(null)}
            whileHover={{ scale: 1.02 }}
            style={{ 
                transform: `translateX(${values.leftGuardianOffsetX}px)` 
            }}
          >
             {/* Glow Container (z-10) */}
             <div className={`absolute inset-0 blur-[80px] rounded-full transition-opacity duration-500 z-10 ${hoverSide === 'left' ? 'bg-amber-500/20 opacity-100' : 'opacity-0'}`} />
             
             {/* Character (z-20) */}
             <div 
                className="relative w-full max-w-[320px] z-20 mb-8 aspect-[242/216]"
                style={{ transform: `scale(${values.guardianScale / 100})` }}
             >
               <motion.div
                 animate={{
                    filter: hoverSide === 'left' ? 'grayscale(0%)' : 'grayscale(100%) brightness(0.7)'
                 }}
               >
                 <LeftGuardianSVG />
               </motion.div>
             </div>

             {/* Stats Badge (z-20) */}
             <div className="relative z-20 text-center">
                 <div className={`font-mono text-xs uppercase tracking-widest px-4 py-1 rounded-full border transition-all duration-300 ${hoverSide === 'left' ? 'text-amber-500 border-amber-500/50 bg-amber-500/10' : 'text-white/20 border-white/10'}`}>
                    System Friction: High
                 </div>
                 {hoverSide === 'left' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-white font-rajdhani font-bold text-xl"
                    >
                        Input Lag: 15ms
                    </motion.div>
                 )}
             </div>
          </motion.div>

          {/* Optimized Column (Cyan) */}
          <motion.div 
            className={`relative p-8 md:p-12 flex flex-col items-center rounded-3xl border transition-all duration-500 cursor-pointer ${hoverSide === 'right' ? 'border-cyan-500/30 bg-cyan-500/5' : 'border-white/5 bg-white/[0.02]'}`}
            onMouseEnter={() => setHoverSide('right')}
            onMouseLeave={() => setHoverSide(null)}
            whileHover={{ scale: 1.02 }}
            style={{ 
                transform: `translateX(${values.rightGuardianOffsetX}px)` 
            }}
          >
             {/* Glow Container (z-10) */}
             <div className={`absolute inset-0 blur-[80px] rounded-full transition-opacity duration-500 z-10 ${hoverSide === 'right' ? 'bg-cyan-500/20 opacity-100' : 'opacity-0'}`} />
             
             {/* Character (z-20) */}
             <div 
                className="relative w-full max-w-[320px] z-20 mb-8 aspect-[242/216]"
                style={{ transform: `scale(${values.guardianScale / 100})` }}
             >
                <motion.div
                 animate={{
                    filter: hoverSide === 'right' ? 'grayscale(0%)' : 'grayscale(100%) brightness(0.7)'
                 }}
               >
                 <RightGuardianSVG />
               </motion.div>
             </div>

             {/* Stats Badge (z-20) */}
             <div className="relative z-20 text-center">
                 <div className={`font-mono text-xs uppercase tracking-widest px-4 py-1 rounded-full border transition-all duration-300 ${hoverSide === 'right' ? 'text-cyan-500 border-cyan-500/50 bg-cyan-500/10' : 'text-white/20 border-white/10'}`}>
                    Input Delay: Eliminated
                 </div>
                 {hoverSide === 'right' && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 text-white font-rajdhani font-bold text-xl"
                    >
                        Latency: &lt;1ms
                    </motion.div>
                 )}
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}