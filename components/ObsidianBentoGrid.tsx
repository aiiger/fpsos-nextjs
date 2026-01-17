"use client";

import { motion } from "framer-motion";
import { Cpu, Zap, Network, FlaskConical, Users } from "lucide-react";

const Tile = ({ title, icon: Icon, children, className }: any) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`bg-white/[0.02] border border-white/10 p-6 rounded-2xl flex flex-col justify-between backdrop-blur-sm hover:border-[#00F5FF]/30 transition-colors group ${className}`}
  >
    <div className="flex items-start justify-between">
      <h3 className="text-lg font-bold text-white group-hover:text-[#00F5FF] transition-colors">{title}</h3>
      <div className="p-2 bg-white/5 rounded-lg text-white/60 group-hover:text-[#00F5FF] group-hover:bg-[#00F5FF]/10 transition-all">
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div className="mt-4">
      {children}
    </div>
  </motion.div>
);

export default function ObsidianBentoGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-6xl mx-auto p-4">
      
      {/* Tile 1: Kernel Tuning (Large) */}
      <Tile title="Kernel Tuning" icon={Cpu} className="md:col-span-2 md:row-span-1 bg-gradient-to-br from-white/[0.03] to-transparent">
        <p className="text-white/60 text-sm mb-4">
          Direct hardware register access bypassing Windows scheduling for microsecond precision.
        </p>
        <div className="flex gap-2">
            <span className="text-xs font-mono border border-[#00F5FF]/30 text-[#00F5FF] px-2 py-1 rounded">HPET_OFF</span>
            <span className="text-xs font-mono border border-white/10 text-white/40 px-2 py-1 rounded">TSC_SYNC</span>
            <span className="text-xs font-mono border border-white/10 text-white/40 px-2 py-1 rounded">MSI_MODE</span>
        </div>
      </Tile>

      {/* Tile 2: DPC Latency */}
      <Tile title="DPC Latency" icon={Zap} className="">
        <div className="flex items-end gap-2">
            <span className="text-4xl font-mono font-bold text-white">5<span className="text-lg text-white/40">μs</span></span>
        </div>
        <p className="text-white/40 text-xs mt-2">Average execution time on optimized cores.</p>
        <div className="w-full h-1 bg-white/10 mt-4 rounded-full overflow-hidden">
            <div className="h-full w-[15%] bg-[#00F5FF] shadow-[0_0_10px_#00F5FF]" />
        </div>
      </Tile>

      {/* Tile 3: Network Pathing */}
      <Tile title="Network Pathing" icon={Network} className="">
        <ul className="space-y-2 text-sm text-white/60">
            <li className="flex justify-between">
                <span>Routing</span>
                <span className="text-[#00F5FF]">Optimized</span>
            </li>
            <li className="flex justify-between">
                <span>Buffer Bloat</span>
                <span className="text-[#00F5FF]">0ms</span>
            </li>
            <li className="flex justify-between">
                <span>TCP NoDelay</span>
                <span className="text-[#00F5FF]">Enabled</span>
            </li>
        </ul>
      </Tile>

      {/* Tile 4: Discord Lab Status (Wide) */}
      <Tile title="Discord Lab Status" icon={FlaskConical} className="md:col-span-2">
        <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/80 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Founders Seats
            </span>
            <span className="text-xs font-mono text-[#00F5FF]">25/50 CLAIMED</span>
        </div>
        <div className="w-full h-4 bg-white/5 rounded-full overflow-hidden border border-white/10">
            <div 
                className="h-full bg-gradient-to-r from-[#00F5FF] to-purple-500 relative"
                style={{ width: '50%' }}
            >
                <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
            </div>
        </div>
        <p className="text-xs text-white/40 mt-3 font-mono">
            JOIN THE LAB. UNLOCK BETA ACCESS.
        </p>
      </Tile>

    </div>
  );
}
