'use client';

import React from 'react';

/**
 * GlobalAlignmentWrapper
 * Enforces a strict central axis for all child content.
 * effectively a 'super-container' for critical alignment.
 */
export function GlobalAlignmentWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center w-full max-w-[100vw] overflow-x-hidden relative">
            {/* Central Axis Guide (Optional: for debugging, can be removed or hidden) */}
            {/* <div className="absolute inset-y-0 left-1/2 w-px bg-red-500/20 z-50 pointer-events-none" /> */}

            {children}
        </div>
    );
}

// Update Usage Plan:
// 1. Wrap Page Content in app/page.tsx with this wrapper?
// No, standard 'main' with 'flex flex-col items-center' should do it.
// The issue is likely inner containers drifting.
// I will apply 'w-full flex flex-col items-center' to the main layout.
