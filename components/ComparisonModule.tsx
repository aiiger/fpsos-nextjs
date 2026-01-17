"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ComparisonModule() {
  return (
    <div className="w-full max-w-6xl mx-auto my-24 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
      
      {/* BEFORE STATE (Stressed) */}
      <div className="relative group rounded-3xl overflow-hidden border border-red-500/20 bg-gradient-to-b from-red-900/10 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 p-8 flex flex-col h-full items-center text-center">
            <h3 className="text-2xl font-bold text-red-500 mb-2">UNOPTIMIZED</h3>
            <p className="text-white/60 text-sm mb-8 max-w-xs">
                Micro-stutters, inconsistent frametimes, and input lag caused by Windows background bloat.
            </p>
            
            <div className="relative w-64 h-64 grayscale opacity-80 mix-blend-luminosity">
                 {/* Placeholder for 'guy-left.svg' - "Stressed" */}
                 <Image 
                    src="/art/guy-left.svg" 
                    alt="Stressed Gamer" 
                    fill 
                    className="object-contain drop-shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                 />
            </div>

            <div className="mt-8 w-full space-y-2">
                <div className="flex justify-between text-xs font-mono text-red-400 border-b border-red-500/20 pb-1">
                    <span>SYSTEM FRICTION</span>
                    <span>HIGH</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-red-400 border-b border-red-500/20 pb-1">
                    <span>INPUT DELAY</span>
                    <span>~15ms</span>
                </div>
            </div>
        </div>
      </div>

      {/* AFTER STATE (Optimized) */}
      <div className="relative group rounded-3xl overflow-hidden border border-[#00F5FF]/30 bg-gradient-to-b from-[#00F5FF]/5 to-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#00F5FF]/10 via-transparent to-transparent opacity-50" />
        
        <div className="relative z-10 p-8 flex flex-col h-full items-center text-center">
            <h3 className="text-2xl font-bold text-[#00F5FF] mb-2">OPTIMIZED</h3>
            <p className="text-white/80 text-sm mb-8 max-w-xs">
                Surgical kernel tuning. Zero bloat. Pure hardware throughput for competitive advantage.
            </p>
            
            <div className="relative w-64 h-64">
                 {/* Placeholder for 'guy-right.svg' - "Optimized" */}
                 <Image 
                    src="/art/guy-right.svg" 
                    alt="Optimized Gamer" 
                    fill 
                    className="object-contain drop-shadow-[0_0_30px_rgba(0,245,255,0.6)]"
                 />
                 {/* Animated Glow Ring behind head */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#00F5FF] rounded-full blur-[80px] opacity-20 animate-pulse" />
            </div>

            <div className="mt-8 w-full space-y-2">
                <div className="flex justify-between text-xs font-mono text-[#00F5FF] border-b border-[#00F5FF]/20 pb-1">
                    <span>SYSTEM FRICTION</span>
                    <span>ELIMINATED</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-[#00F5FF] border-b border-[#00F5FF]/20 pb-1">
                    <span>INPUT DELAY</span>
                    <span>&lt;1ms</span>
                </div>
            </div>
        </div>
      </div>

    </div>
  );
}
