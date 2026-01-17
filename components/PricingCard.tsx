'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useState, useRef, MouseEvent } from 'react';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export function PricingCard({ title, price, description, features, highlighted = false }: PricingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className="relative group h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Glow Effect Background */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-blue-900/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

      {highlighted && (
        <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-b from-cyan-500/40 to-blue-900/40 blur-sm" />
      )}

      <div
        className="relative h-full overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300 flex flex-col"
        style={{
          background: 'rgba(5, 5, 10, 0.6)', // Deep tech dark
          borderColor: isHovered || highlighted ? 'rgba(6, 182, 212, 0.5)' : 'rgba(39, 39, 42, 0.3)', // Cyan border on hover
          borderWidth: '1px',
        }}
      >
        {/* Spotlight Effect */}
        {isHovered && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              width: '400px',
              height: '400px',
              left: mousePosition.x - 200,
              top: mousePosition.y - 200,
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.08) 30%, transparent 60%)',
            }}
          />
        )}

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative p-8 z-10 flex flex-col h-full">
          {highlighted && (
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[10px] font-bold tracking-wider uppercase rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                Recommended
              </span>
            </div>
          )}

          <div className="space-y-6 flex-1">
            <div>
              <h3 className="text-2xl font-bold text-white tracking-tight mb-2 font-rajdhani">{title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{description}</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white tracking-tight">AED {price}</span>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />

            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className={`mt-0.5 rounded-full p-1 ${highlighted ? 'bg-cyan-500/20' : 'bg-zinc-800'}`}>
                    <Check className={`w-3 h-3 ${highlighted ? 'text-cyan-400' : 'text-zinc-400'}`} />
                  </div>
                  <span className="text-zinc-300 text-sm leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <motion.button
            className="relative w-full py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-300 mt-8 overflow-hidden"
            style={{
              background: highlighted
                ? 'linear-gradient(135deg, rgba(6, 182, 212, 1) 0%, rgba(37, 99, 235, 1) 100%)' // Cyan to Blue gradient
                : 'rgba(24, 24, 27, 0.8)',
              color: 'white',
              border: highlighted ? 'none' : '1px solid rgba(63, 63, 70, 0.5)',
            }}
            whileHover={{
              scale: 1.02,
              boxShadow: highlighted
                ? '0 0 40px rgba(6, 182, 212, 0.5)'
                : '0 10px 30px rgba(0, 0, 0, 0.5)'
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 -translate-x-full"
              animate={{ x: ['-100%', '200%'] }}
              transition={{
                repeat: Infinity,
                repeatDelay: 3,
                duration: 1.5,
                ease: 'easeInOut'
              }}
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
            />
            <span className="relative z-10">Select {title}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}