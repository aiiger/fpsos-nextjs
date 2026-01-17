"use client";

import { useState, useEffect } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { motion } from "framer-motion";
import { Activity, Wifi } from "lucide-react";

const generateData = () => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      value: 20 + Math.random() * 15 + (Math.sin(i / 5) * 10),
    });
  }
  return data;
};

export default function LiveHUD() {
  const [data, setData] = useState(generateData());
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newData = [...prev.slice(1), { value: 20 + Math.random() * 15 + (Math.sin(Date.now() / 500) * 10) }];
        return newData;
      });
      setLatency(Math.floor(15 + Math.random() * 15));
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md relative overflow-hidden group">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-fpsos-electric-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-fpsos-electric-cyan/10 border border-fpsos-electric-cyan/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fpsos-electric-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fpsos-electric-cyan"></span>
            </span>
            <span className="text-xs font-mono font-bold text-fpsos-electric-cyan tracking-wider">
              STREAMING_ACTIVE
            </span>
          </div>
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 text-white/60">
             <Wifi className="w-4 h-4" />
             <span className="text-xs font-mono">KERNEL_LINK_ESTABLISHED</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <span className="text-xs text-white/40 font-mono">LATENCY</span>
            <span className="text-2xl font-mono font-bold text-white tabular-nums tracking-tighter">
                {latency}<span className="text-sm text-fpsos-electric-cyan ml-1">ms</span>
            </span>
        </div>
      </div>

      <div className="h-[200px] w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 pointer-events-none" />
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00F5FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00F5FF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <YAxis hide domain={[0, 60]} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#00F5FF"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorValue)"
              isAnimationActive={false}
              className="drop-shadow-[0_0_10px_rgba(0,245,255,0.5)]"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 gap-4 mt-6 pt-4 border-t border-white/5">
        {[
            { label: "CPU_JITTER", value: "0.02ms" },
            { label: "PACKET_LOSS", value: "0.00%" },
            { label: "TICK_RATE", value: "128.0" },
            { label: "INPUT_LAG", value: "<1ms" }
        ].map((stat, i) => (
             <div key={i} className="flex flex-col">
                <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase">{stat.label}</span>
                <span className="text-sm font-mono text-white/90">{stat.value}</span>
             </div>
        ))}
      </div>
    </div>
  );
}
