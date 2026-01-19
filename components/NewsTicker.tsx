'use client';

import React, { useEffect, useState } from 'react';

interface NewsItem {
    title: string;
    url: string;
    time: string;
}

export default function NewsTicker() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news');
                const data = await res.json();
                if (data.news && Array.isArray(data.news) && data.news.length > 0) {
                    setNews(data.news);
                } else {
                    console.warn("News API returned empty, using fallback.");
                    setFallbackData();
                }
            } catch (error) {
                console.error("Failed to fetch news, using fallback:", error);
                setFallbackData();
            } finally {
                setLoading(false);
            }
        };

        const setFallbackData = () => {
            setNews([
                { title: "CS2 Update: Optimization Guide 2026", url: "https://www.hltv.org", time: "Just now" },
                { title: "NVIDIA Drivers: +15% FPS Boost Confirmed", url: "https://www.hltv.org", time: "1h ago" },
                { title: "Major: Vitality vs Spirit Grand Final", url: "https://www.hltv.org", time: "2h ago" },
                { title: "Donk breaks another damage record", url: "https://www.hltv.org", time: "4h ago" }
            ]);
        };

        fetchNews();
        const interval = setInterval(fetchNews, 5 * 60 * 1000); // Refresh every 5 mins
        return () => clearInterval(interval);
    }, []);

    if (loading || news.length === 0) return null;

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 flex h-11 items-center overflow-hidden border-t border-white/5 bg-[#0a0a0b]/40 backdrop-blur-[32px] backdrop-saturate-200 supports-[backdrop-filter]:bg-[#0a0a0b]/30 font-sans select-none'>

            {/* "NEWS" Label - Apple Style (Subtle Pill) */}
            <div className="absolute left-6 z-20 flex items-center gap-3 pr-8 bg-gradient-to-r from-[#0a0a0b]/80 via-[#0a0a0b]/60 to-transparent">
                <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/10 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.8)] animate-pulse" />
                    <span className="text-[9px] font-bold tracking-[0.15em] text-white/90 uppercase font-mono">LIVE / FPS</span>
                </span>
            </div>

            {/* Gradient Masks */}
            <div className="absolute left-[120px] top-0 bottom-0 w-24 bg-gradient-to-r from-[#0a0a0b]/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0a0a0b]/80 to-transparent z-10 pointer-events-none" />

            {/* Ticker Content */}
            <div className='animate-ticker flex whitespace-nowrap pl-[140px] font-sans will-change-transform'>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className='flex items-center'>
                        {news.map((item, idx) => (
                            <React.Fragment key={`${i}-${idx}`}>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='flex items-center gap-3 px-8 text-[12px] font-medium tracking-wide text-white/70 hover:text-white transition-all duration-300 antialiased group'
                                >
                                    <span className="opacity-90 group-hover:opacity-100">{item.title}</span>
                                    <span className="text-white/30 text-[10px] font-mono tracking-tighter group-hover:text-cyan-400/50 transition-colors">
                                        {item.time}
                                    </span>
                                </a>
                                {/* Premium Separator */}
                                <div className="h-4 w-px bg-white/10 mx-2" />
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
            <style jsx>{`
                .animate-ticker {
                    /* Adjusted speed: slow and smooth for readability */
                    animation: ticker 280s linear infinite;
                    transform: translate3d(0, 0, 0);
                    -webkit-font-smoothing: antialiased;
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
                @keyframes ticker {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
            `}</style>
        </div>
    );
}
