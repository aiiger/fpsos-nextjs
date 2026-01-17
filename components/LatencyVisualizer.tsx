'use client';

import React, { useRef, useEffect } from 'react';
import { MousePointer2, Network } from 'lucide-react';

export default function LatencyVisualizer() {
    return (
        <div className="w-full max-w-5xl mx-auto py-12 px-6">
            <div className="grid md:grid-cols-2 gap-6">

                {/* Card 1: Input Chain (Sine Wave) */}
                <div className="glass-card bg-[#050505]/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80">
                            <MousePointer2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Input Chain</h3>
                    </div>

                    <p className="text-sm text-white/50 mb-12 relative z-10 leading-relaxed max-w-sm">
                        Optimization of the interrupt pipeline for instant mouse-to-pixel response.
                    </p>

                    {/* Sine Wave Canvas */}
                    <div className="h-40 relative rounded-xl border border-white/5 bg-black/40 overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 top-0 opacity-20"
                            style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.05 }}
                        />
                        <SineWaveAnimation />

                        <div className="absolute bottom-4 left-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">IRQ Path</div>
                            <div className="text-sm font-bold text-blue-400 tracking-wider">ISOLATED</div>
                        </div>
                        <div className="absolute bottom-4 right-6 text-right">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">DPC Latency</div>
                            <div className="text-sm font-bold text-blue-400 tracking-wider">MINIMIZED</div>
                        </div>
                    </div>
                </div>

                {/* Card 2: Network Priority (Rolling Bars) */}
                <div className="glass-card bg-[#050505]/60 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/80">
                            <Network className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Network Priority</h3>
                    </div>

                    <p className="text-sm text-white/50 mb-12 relative z-10 leading-relaxed max-w-sm">
                        Custom QoS and adapter settings to stabilize connection jitter and hit registration.
                    </p>

                    {/* Network Bars Canvas */}
                    <div className="h-40 relative rounded-xl border border-white/5 bg-black/40 overflow-hidden">
                        <div className="absolute inset-x-0 bottom-0 top-0 opacity-20"
                            style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.05 }}
                        />
                        <NetworkBarAnimation />

                        {/* Jitter Line */}
                        <div className="absolute top-0 bottom-0 left-[20%] w-[1px] bg-cyan-500/50 z-20 shadow-[0_0_10px_rgba(6,182,212,0.5)]"></div>

                        <div className="absolute bottom-4 left-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Server Latency</div>
                            <div className="text-sm font-bold text-cyan-400 tracking-wider">4 ms</div>
                        </div>
                        <div className="absolute bottom-4 left-[24%]">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/20 mb-1">Jitter</div>
                            <div className="text-sm font-bold text-emerald-400 tracking-wider">0 ms</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

// Separate component for Sine Wave to handle animation Frame
function SineWaveAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let frame = 0;
        let animationId: number;

        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };
        resize();
        window.addEventListener('resize', resize);

        const draw = () => {
            frame += 0.15; // Speed
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const centerY = canvas.height / 2;
            const amplitude = 15;
            const frequency = 0.03;

            // Draw Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#60a5fa'; // blue-400

            ctx.beginPath();
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#60a5fa';

            for (let x = 0; x < canvas.width; x++) {
                const y = centerY + Math.sin(x * frequency + frame) * amplitude;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Reset shadow
            ctx.shadowBlur = 0;

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// Separate component for Network Bars
function NetworkBarAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bars: { x: number, height: number }[] = [];
        const barWidth = 20;
        const gap = 4;
        const speed = 2; // Pixels per frame

        // Fill initial screen
        let cx = canvas.width;

        const resize = () => {
            if (canvas.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
                cx = canvas.width; // Reset start pos
            }
        };
        resize();
        window.addEventListener('resize', resize);

        let animationId: number;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Add new bar
            if (bars.length === 0 || bars[bars.length - 1].x < canvas.width - (barWidth + gap)) {
                // Mostly low latency (small bars), occasional spike
                const isSpike = Math.random() > 0.95;
                const baseHeight = 4 + Math.random() * 4;
                const height = isSpike ? baseHeight + 10 : baseHeight;
                bars.push({ x: canvas.width, height });
            }

            // Draw glow
            ctx.shadowBlur = 10;
            ctx.shadowColor = '#06b6d4'; // cyan-500

            ctx.fillStyle = '#06b6d4';

            // Process bars
            for (let i = bars.length - 1; i >= 0; i--) {
                const bar = bars[i];
                bar.x -= speed;

                // Draw
                const y = (canvas.height / 2) + 20 - bar.height; // Baseline slightly below center
                ctx.fillRect(bar.x, y, barWidth, 3); // Draw as a flat "packet" or line segment

                // Remove off-screen
                if (bar.x + barWidth < 0) {
                    bars.splice(i, 1);
                }
            }

            ctx.shadowBlur = 0;

            animationId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}
