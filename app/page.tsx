'use client';

import React from 'react'
import IndustrialHero from '@/components/IndustrialHero'
import AppleBentoGrid from '@/components/AppleBentoGrid'
import { Footer } from '@/components/Footer'
import StyleTuner from '@/components/StyleTuner'
import { StyleTunerProvider, useTuner } from '@/context/TunerContext'

import NewsTicker from '@/components/NewsTicker'
import LatencyVisualizer from '@/components/LatencyVisualizer'

export default function Home() {
    return (
        <StyleTunerProvider>
            <main className="flex flex-col w-full min-h-screen relative z-10 overflow-x-clip">
                <StyleTuner />

                {/* Layer 1: Character Hero Section (Z-10) */}
                <IndustrialHero />

                {/* Ticker Placement */}
                <NewsTicker />

                {/* Layer 2: Main Content */}
                <ContentWrapper />

                <Footer />
            </main>
        </StyleTunerProvider>
    )
}

import InputZeroSection from '@/components/InputZeroSection'

function ContentWrapper() {
    const { values } = useTuner();
    return (
        <div
            className="relative z-40 transition-all duration-300 pb-20"
        >
            {/* 1. Engineering Pillars */}
            <AppleBentoGrid />

            {/* 2. InputZero Architectural Division */}
            <InputZeroSection />
        </div>
    );
}
