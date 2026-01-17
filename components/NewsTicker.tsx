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
    }, []);

    if (loading || news.length === 0) return null;

    return (
        <div className='fixed bottom-0 left-0 right-0 z-50 flex h-10 items-center overflow-hidden border-t border-white/10 bg-[#1d1d1f]/70 backdrop-blur-[20px] backdrop-saturate-150 supports-[backdrop-filter]:bg-[#1d1d1f]/60 font-sans'>

            {/* "NEWS" Label - Apple Style (Subtle Pill) */}
            <div className="absolute left-6 z-20 flex items-center gap-3 pr-4 bg-gradient-to-r from-[#1d1d1f] via-[#1d1d1f]/80 to-transparent">
                <span className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-white/10 border border-white/5 backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00ff41] shadow-[0_0_8px_rgba(0,255,65,0.6)] animate-pulse" />
                    <span className="text-[10px] font-bold tracking-wider text-white/90 uppercase">LIVE</span>
                </span>
            </div>

            {/* Gradient Mask for Fade Out */}
            <div className="absolute left-[90px] top-0 bottom-0 w-16 bg-gradient-to-r from-[#1d1d1f] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#1d1d1f] to-transparent z-10 pointer-events-none" />

            {/* Ticker Content - Hardware Accelerated */}
            <div className='animate-ticker flex whitespace-nowrap pl-32 will-change-transform backface-hidden'>
                {[...Array(6)].map((_, i) => (
                    <div key={i} className='flex items-center'>
                        {news.map((item, idx) => (
                            <React.Fragment key={`${i}-${idx}`}>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className='flex items-center gap-2.5 px-6 text-[13px] font-medium text-[#f5f5f7] hover:text-cyan-400 transition-colors duration-300 antialiased group'
                                >
                                    <span>{item.title}</span>
                                    <span className="text-[#86868b] text-[11px] font-normal group-hover:text-cyan-500/70 transition-colors">
                                        {item.time}
                                    </span>
                                </a>
                                {/* Separator Dot */}
                                <span className="w-1 h-1 rounded-full bg-white/20" />
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
            <style jsx>{`
                .animate-ticker {
                    animation: ticker 180s linear infinite;
                    transform: translate3d(0, 0, 0); /* Force GPU */
                }
                .animate-ticker:hover {
                    animation-play-state: paused;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                    -webkit-font-smoothing: antialiased;
                }
                @keyframes ticker {
                    0% { transform: translate3d(0, 0, 0); }
                    100% { transform: translate3d(-50%, 0, 0); }
                }
            `}</style>
        </div>
    );
}
