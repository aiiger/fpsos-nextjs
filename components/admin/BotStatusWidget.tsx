'use client';

import { useState, useEffect } from 'react';
import { Activity, Server, Users, Zap, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BotStatusWidget() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const fetchStatus = async () => {
        try {
            const res = await fetch('/api/bot/control', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'status' })
            });

            if (res.ok) {
                const data = await res.json();
                setStatus(data);
                setError(false);
            } else {
                setError(true);
            }
        } catch (e) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
        const interval = setInterval(fetchStatus, 15000); // Poll every 15s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5 animate-pulse h-[200px] flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
        );
    }

    const isOnline = !error && status?.status === 'online';

    return (
        <div className="bg-[#1c1c1e] rounded-[24px] p-6 border border-white/5 relative overflow-hidden group">
            {/* Ambient Glow */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${isOnline ? 'green' : 'red'}-500/10 blur-[50px] rounded-full pointer-events-none transition-colors duration-500`} />

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-[14px] ${isOnline ? 'bg-green-500/20' : 'bg-red-500/20'} flex items-center justify-center shadow-inner`}>
                        <Activity className={`w-5 h-5 ${isOnline ? 'text-green-400' : 'text-red-400'}`} />
                    </div>
                    <div>
                        <h3 className="text-[16px] font-semibold text-white">Bot Status</h3>
                        <p className="text-[12px] text-white/40 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                            {isOnline ? 'Online & Responsive' : 'System Offline'}
                        </p>
                    </div>
                </div>
                {isOnline && (
                    <div className="bg-[#2c2c2e] px-3 py-1 rounded-full border border-white/5">
                        <span className="text-[11px] font-mono text-green-400">v4.2.0-STABLE</span>
                    </div>
                )}
            </div>

            {isOnline ? (
                <div className="grid grid-cols-2 gap-4 relative z-10">
                    <div className="bg-[#2c2c2e]/50 rounded-[18px] p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="text-[11px] font-medium text-white/60">Latency</span>
                        </div>
                        <div className="text-xl font-bold text-white">{status.latency}ms</div>
                    </div>

                    <div className="bg-[#2c2c2e]/50 rounded-[18px] p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-1">
                            <Users className="w-3.5 h-3.5 text-blue-500" />
                            <span className="text-[11px] font-medium text-white/60">Users</span>
                        </div>
                        <div className="text-xl font-bold text-white">{status.users}</div>
                    </div>

                    <div className="bg-[#2c2c2e]/50 rounded-[18px] p-4 border border-white/5 col-span-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Server className="w-3.5 h-3.5 text-purple-500" />
                            <span className="text-[11px] font-medium text-white/60">Serving {status.guilds} Guilds</span>
                        </div>
                        <ShieldCheck className="w-4 h-4 text-green-500/60" />
                    </div>
                </div>
            ) : (
                <div className="bg-red-500/5 rounded-[18px] p-4 border border-red-500/10 flex items-center gap-3">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                    <div>
                        <div className="text-sm font-bold text-red-400">Connection Lost</div>
                        <div className="text-[11px] text-red-400/60">Check bot.py console output</div>
                    </div>
                </div>
            )}
        </div>
    );
}
