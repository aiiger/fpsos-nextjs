"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

interface MetricProps {
  label: string;
  value: string;
  target: string;
  status: "CRITICAL" | "WARNING" | "SUBOPTIMAL" | "OPTIMAL" | "HIGH_NOISE";
}

const MetricRow = ({ label, value, target, status }: MetricProps) => {
  const getColor = () => {
    switch (status) {
      case "CRITICAL": return "text-red-500";
      case "WARNING": return "text-amber-500";
      case "HIGH_NOISE": return "text-amber-500";
      case "SUBOPTIMAL": return "text-yellow-400";
      case "OPTIMAL": return "text-[#00F5FF]";
      default: return "text-white";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex flex-col">
        <span className="text-sm font-mono text-white/60 uppercase tracking-wider">{label}</span>
        <span className="text-xs text-white/20">Target: {target}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={`font-mono font-bold text-lg ${getColor()}`}>{value}</span>
        {status === "OPTIMAL" ? (
          <CheckCircle2 className="w-5 h-5 text-[#00F5FF]" />
        ) : (
          <AlertTriangle className={`w-5 h-5 ${getColor()}`} />
        )}
      </div>
    </div>
  );
};

export default function DiagnosticPanel({ data }: { data: any }) {
  if (!data) return (
    <div className="w-full h-64 flex items-center justify-center border border-white/10 rounded-2xl bg-[#050505] text-white/40 font-mono animate-pulse">
      AWAITING_TELEMETRY_DATA...
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#0a0a0a] border border-white/10 overflow-hidden shadow-2xl relative">
      {/* Header */}
      <div className="bg-white/[0.03] p-6 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_red]" />
          <h2 className="text-xl font-bold text-white tracking-tight">SYSTEM DIAGNOSTIC REPORT</h2>
        </div>
        <div className="text-right">
          <div className="text-xs text-white/40 font-mono">ID: {data.id}</div>
          <div className="text-xs text-white/40 font-mono">{new Date(data.timestamp).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Score */}
      <div className="p-8 flex flex-col items-center justify-center bg-gradient-to-b from-white/[0.02] to-transparent border-b border-white/10">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-white/10" />
            <circle 
              cx="64" cy="64" r="60" 
              stroke="currentColor" 
              strokeWidth="4" 
              fill="transparent" 
              strokeDasharray={377}
              strokeDashoffset={377 - (377 * data.systemScore) / 100}
              className={`${data.systemScore < 70 ? 'text-amber-500' : 'text-[#00F5FF]'} transition-all duration-1000`} 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{data.systemScore}</span>
            <span className="text-[10px] text-white/40 uppercase tracking-widest">Score</span>
          </div>
        </div>
        <p className="mt-4 text-white/60 max-w-md text-center text-sm">
          Your system is operating at <strong className="text-white">{data.systemScore}% efficiency</strong>. 
          Significant latency bottlenecks detected in Kernel scheduling.
        </p>
      </div>

      {/* Metrics List */}
      <div className="bg-[#050505]">
        <MetricRow 
          label="DPC Latency" 
          value={data.metrics.dpcLatency.value} 
          target={data.metrics.dpcLatency.target} 
          status={data.metrics.dpcLatency.status} 
        />
        <MetricRow 
          label="Kernel Timer Resolution" 
          value={data.metrics.kernelTimer.value} 
          target={data.metrics.kernelTimer.target} 
          status={data.metrics.kernelTimer.status} 
        />
        <MetricRow 
          label="Thread Priority" 
          value={data.metrics.threadPriority.value} 
          target={data.metrics.threadPriority.target} 
          status={data.metrics.threadPriority.status} 
        />
         <MetricRow 
          label="Interrupt Volume" 
          value={data.metrics.interrupts.value} 
          target={data.metrics.interrupts.target} 
          status={data.metrics.interrupts.status} 
        />
      </div>

      {/* Footer / Action */}
      <div className="p-4 bg-red-500/10 border-t border-red-500/20 flex items-center gap-3">
        <XCircle className="w-5 h-5 text-red-500" />
        <span className="text-sm text-red-200 font-mono">{data.issues.length} CRITICAL OPTIMIZATION ISSUES DETECTED</span>
      </div>
    </div>
  );
}
