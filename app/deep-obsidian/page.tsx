"use client";

import { useEffect, useState } from "react";
import DiagnosticPanel from "@/components/DiagnosticPanel";
import ComparisonModule from "@/components/ComparisonModule";
import ObsidianBentoGrid from "@/components/ObsidianBentoGrid";
import BookingDrawer from "@/components/BookingDrawer";
import { motion } from "framer-motion";
import { Disc } from "lucide-react";
import Link from "next/link";
import EliteCard from "@/components/EliteCard";

export default function DeepObsidianPage() {
  const [diagnosisData, setDiagnosisData] = useState(null);

  useEffect(() => {
    // Fetch mock diagnosis for the demo
    fetch("/api/diagnosis/DEMO-ID")
      .then((res) => res.json())
      .then((data) => setDiagnosisData(data));
  }, []);

  return (
    // "Deep Obsidian" Theme Wrapper: Background #050505
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-[#00F5FF]/30 selection:text-white overflow-x-hidden font-sans">

      {/* Grid Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Navigation / Header */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#050505]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-3 h-3 bg-[#00F5FF] rounded-sm rotate-45" />
            FPSOS <span className="text-white/40 font-normal">LABS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
            <Link href="#" className="hover:text-white transition-colors">DIAGNOSTICS</Link>
            <Link href="#" className="hover:text-white transition-colors">BENCHMARKS</Link>
            <Link href="#" className="hover:text-white transition-colors">BOOKING</Link>
          </nav>
          <div className="flex items-center gap-4">
            <a
              href="https://discord.gg/your-invite" // Replace with actual invite
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#00F5FF]/50 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#00F5FF]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Disc className="w-4 h-4 text-[#00F5FF] group-hover:animate-spin" />
              <span className="relative z-10 text-xs font-bold tracking-wide group-hover:text-[#00F5FF] transition-colors">
                JOIN DISCORD
              </span>
              {/* Founder Badge Easter Egg */}
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00F5FF] rounded-full opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_#00F5FF] transition-opacity duration-500 delay-100" />
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-32 pb-20 px-4">

        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-3 py-1 mb-6 rounded-full border border-[#00F5FF]/20 bg-[#00F5FF]/5 text-[#00F5FF] text-xs font-mono tracking-widest uppercase">
              Technical Authority
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              HARDWARE UNLEASHED.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                LATENCY ERASED.
              </span>
            </h1>
            <p className="text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-12">
              Stop guessing. We provide <strong>Kernel-Level System Optimization</strong> for
              <strong> Competitive Athletics</strong>.
              Eliminate bottlenecks and achieve pure hardware throughput.
            </p>
          </motion.div>

          {/* Diagnostic Panel (Replaces LiveHUD) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <DiagnosticPanel data={diagnosisData} />
          </motion.div>
        </section>

        {/* Comparison Module */}
        <section className="mb-24">
          <ComparisonModule />
        </section>

        {/* Bento Grid */}
        <section className="mb-24">
          <ObsidianBentoGrid />
        </section>

        {/* Featured Package Section */}
        <section className="max-w-7xl mx-auto mb-24 flex flex-col items-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">THE ULTIMATE TUNE.</h2>
            <p className="text-white/40 text-lg">Our most requested package, engineered for perfection.</p>
          </div>
          <EliteCard />
        </section>

      </main>

      <BookingDrawer />
    </div>
  );
}
