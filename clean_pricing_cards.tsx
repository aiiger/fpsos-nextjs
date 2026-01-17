'use client';

import { Check } from 'lucide-react';
import { useRef, useState } from 'react';

type PricingKpi = {
  label: string;
  value: string;
  helper?: string;
};

function getTierAccent(description: string) {
  const normalized = description.toLowerCase();
  if (normalized.includes('quick remote fix')) return 'var(--quick-fix)';
  if (normalized.includes('full system tune-up')) return 'var(--full-tune)';
  if (normalized.includes('extreme biosprime')) return 'var(--extreme)';
  return 'var(--fpsos-orange)';
}

interface PricingCardProps {
  title: string;
  price: number;
  description: string;
  features: string[];
  kpis?: PricingKpi[];
  highlighted?: boolean;
}

export function PricingCard({ title, price, description, features, kpis = [], highlighted = false }: PricingCardProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <div
      ref={cardRef}
      className="relative group h-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      {isHovered && !highlighted && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-orange-500/10 to-orange-600/5 blur-xl transition-opacity duration-500" />
      )}

      {/* Highlighted card outer glow */}
      {highlighted && (
        <div className="absolute -inset-[2px] rounded-2xl bg-gradient-to-b from-orange-500/30 to-orange-700/20 blur-md" />
      )}

      <div
        className="relative h-full rounded-2xl backdrop-blur-sm border transition-all duration-300 overflow-hidden"
        style={{
          background: highlighted 
            ? 'linear-gradient(to bottom, rgba(67, 36, 20, 0.8), rgba(40, 20, 10, 0.9))'
            : 'rgba(20, 20, 20, 0.9)',
          borderColor: highlighted 
            ? 'rgba(249, 115, 22, 0.5)' 
            : isHovered ? 'rgba(80, 80, 80, 0.7)' : 'rgba(50, 50, 50, 0.5)',
        }}
      >
        {/* Mouse follow gradient */}
        {isHovered && (
          <div
            className="absolute pointer-events-none transition-opacity duration-300"
            style={{
              width: '300px',
              height: '300px',
              left: mousePosition.x - 150,
              top: mousePosition.y - 150,
              background: highlighted
                ? 'radial-gradient(circle, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.05) 40%, transparent 70%)'
                : 'radial-gradient(circle, rgba(100, 100, 100, 0.08) 0%, transparent 60%)',
            }}
          />
        )}

        <div className="relative p-8 flex flex-col h-full">
          {/* Best Value Badge */}
          {highlighted && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="px-4 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-[10px] font-bold tracking-[0.15em] rounded-full shadow-lg">
                BEST VALUE
              </span>
            </div>
          )}

          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{title}</h3>
            <p className="text-neutral-400 text-sm">{description}</p>
          </div>

          {/* Price */}
          <div className="mb-8">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-white tracking-tight">AED {price}</span>
            </div>
          </div>

          {/* KPIs */}
          {kpis.length > 0 && (
            <div
              className="mb-8"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 'var(--spacing-2)',
              }}
            >
              {kpis.slice(0, 3).map((kpi) => (
                <div
                  key={kpi.label}
                  style={{
                    flex: '1 1 120px',
                    minWidth: 0,
                    padding: 'var(--spacing-2)',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(26, 26, 26, 0.85)',
                    backdropFilter: 'blur(20px) saturate(150%)',
                    border: highlighted
                      ? '1px solid rgba(255, 255, 255, 0.10)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                    transition: 'transform 0.2s var(--ease-standard)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--text-tertiary)',
                      marginBottom: '6px',
                    }}
                  >
                    {kpi.label}
                  </div>
                  <div
                    style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: highlighted ? getTierAccent(description) : 'var(--text-primary)',
                      lineHeight: 1.15,
                      marginBottom: kpi.helper ? '4px' : 0,
                    }}
                  >
                    {kpi.value}
                  </div>
                  {kpi.helper && (
                    <div
                      style={{
                        fontSize: '12px',
                        lineHeight: 1.35,
                        color: 'var(--text-secondary)',
                      }}
                    >
                      {kpi.helper}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Features */}
          <ul className="space-y-3 mb-8 flex-grow">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-full p-0.5" style={{
                  background: highlighted ? 'rgba(249, 115, 22, 0.2)' : 'rgba(120, 120, 120, 0.15)'
                }}>
                  <Check className="w-3.5 h-3.5" style={{
                    color: highlighted ? 'rgb(249, 115, 22)' : 'rgb(180, 180, 180)'
                  }} />
                </div>
                <span className="text-neutral-300 text-sm leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button
            className="w-full py-3.5 rounded-xl font-semibold text-sm tracking-tight transition-all duration-300"
            style={{
              background: highlighted
                ? 'linear-gradient(135deg, rgb(249, 115, 22) 0%, rgb(234, 88, 12) 100%)'
                : 'rgba(30, 30, 30, 0.8)',
              color: highlighted ? '#fff' : 'rgba(230, 230, 230, 0.9)',
              border: highlighted ? 'none' : '1px solid rgba(60, 60, 60, 0.5)',
              boxShadow: highlighted ? '0 4px 20px rgba(249, 115, 22, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = highlighted 
                ? '0 8px 30px rgba(249, 115, 22, 0.4)' 
                : '0 4px 20px rgba(0, 0, 0, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = highlighted 
                ? '0 4px 20px rgba(249, 115, 22, 0.3)' 
                : 'none';
            }}
          >
            Select {title}
          </button>
        </div>
      </div>
    </div>
  );
}

// Demo wrapper for testing
export default function PricingDemo() {
  const pricingTiers = [
    {
      title: 'Starter',
      price: 199,
      description: 'Quick Remote Fix',
      kpis: [
        { label: 'Turnaround', value: '48 hours', helper: 'Remote session scheduling' },
        { label: 'Focus', value: 'Stability triage', helper: 'Fix spikes + errors first' },
        { label: 'Output', value: 'Baseline tune', helper: 'Clean FPS + frame-time uplift' },
      ],
      features: [
        'Stability triage and diagnostics',
        'Remote desktop optimization',
        'Critical error resolution',
        'Basic performance tuning',
        '48-hour turnaround',
      ],
    },
    {
      title: 'Professional',
      price: 399,
      description: 'Full System Tune-Up',
      kpis: [
        { label: 'Turnaround', value: '24 hours', helper: 'Priority remote support' },
        { label: 'Impact', value: 'Frame-time consistency', helper: 'Subtick-ready tuning' },
        { label: 'Coverage', value: 'Windows + BIOS', helper: 'System-wide optimization' },
      ],
      features: [
        'Complete Windows optimization',
        'Advanced BIOS configuration',
        'Network stack optimization',
        'Storage and memory tuning',
        'Startup and service optimization',
        'Priority 24-hour support',
      ],
      highlighted: true,
    },
    {
      title: 'Elite',
      price: 699,
      description: 'Extreme BIOSPRIME',
      kpis: [
        { label: 'Focus', value: 'RAM + volt sculpt', helper: 'Manual timing calibration' },
        { label: 'Validation', value: 'Stress-tested', helper: 'Stability suite included' },
        { label: 'Support', value: 'Engineer-led', helper: 'Dedicated tuning session' },
      ],
      features: [
        'Manual RAM timing calibration',
        'Precision voltage sculpting',
        'Custom power delivery tuning',
        'Advanced thermal optimization',
        'Stability stress testing suite',
        'Dedicated engineer support',
        'Lifetime optimization warranty',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingTiers.map((tier, index) => (
            <PricingCard key={index} {...tier} />
          ))}
        </div>
      </div>
    </div>
  );
}