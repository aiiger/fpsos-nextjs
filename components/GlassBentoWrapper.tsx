"use client";

import { ReactNode } from "react";

interface GlassBentoWrapperProps {
  children: ReactNode;
  className?: string;
  title?: string;
}

export default function GlassBentoWrapper({ children, className = "", title }: GlassBentoWrapperProps) {
  return (
    <div className={`relative w-full max-w-7xl mx-auto p-1 ${className}`}>
        {/* Glassmorphic Container */}
        <div className="relative rounded-3xl overflow-hidden bg-white/[0.02] border border-white/5 backdrop-blur-[12px] shadow-2xl">
            
            {/* Optional Header */}
            {title && (
                <div className="px-8 py-6 border-b border-white/5 bg-white/[0.01]">
                    <h2 className="text-xl font-bold font-sans tracking-tight text-white">{title}</h2>
                </div>
            )}

            {/* Content Area */}
            <div className="p-8">
                {children}
            </div>

            {/* Decorative Corner Gradients */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 blur-[50px] pointer-events-none" />
        </div>
    </div>
  );
}
