'use client';

import { PricingCard } from './PricingCard';
import { motion } from 'framer-motion';

export function CompactPackages() {
    const packages = [
        {
            title: "Quick Remote Fix",
            price: "199",
            description: "Fast resolution for specific issues. Perfect for immediate troubleshooting without a full overhaul.",
            features: [
                "Up to 90 minutes remote AnyDesk session",
                "Fix obvious driver, OS and CS2 config issues",
                "Quick input lag and FPS sanity pass",
                "Basic thermals and fan curve check"
            ],
            highlighted: false
        },
        {
            title: "Full System Tune-Up",
            price: "399",
            description: "Complete performance overhaul for gaming. The standard for competitive players.",
            features: [
                "Deep Windows and background process debloat",
                "Safe BIOS sanity pass (XMP/EXPO, PBO, power plans)",
                "CS2, driver and control panel tuning for comp play",
                "Network path and bufferbloat check",
                "Before/after benchmarks focused on frame time stability"
            ],
            highlighted: true
        },
        {
            title: "Extreme BIOSPRIME",
            price: "699",
            description: "Hardware-level tuning for 0.1% lows and maximum throughput. For professional setups.",
            features: [
                "Manual RAM timing and memory controller tuning",
                "Advanced PBO/curve and voltage sculpting (where safe)",
                "Hardware-level interrupt affinity and process priority map",
                "Custom low-noise OS profile for CS2-focused rigs",
                "Full stability, thermals and frame time validation suite"
            ],
            highlighted: false
        }
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-0 relative z-20">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start">
                {packages.map((pkg, index) => (
                    <PricingCard key={index} {...pkg} />
                ))}
            </div>
        </section>
    );
}
