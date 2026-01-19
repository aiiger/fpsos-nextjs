import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Cache structure
let cache: { data: any, timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const SOURCES = [
    {
        name: 'HLTV',
        url: 'https://www.hltv.org/rss/news',
        ua: 'Googlebot/2.1 (+http://www.google.com/bot.html)'
    },
    {
        name: 'Soccer',
        url: 'https://www.skysports.com/rss/11095',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
];

export async function GET() {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        return NextResponse.json({ news: cache.data });
    }

    try {
        console.log('Fetching live FPS news from multiple sources...');

        const results = await Promise.allSettled(SOURCES.map(source =>
            fetch(source.url, {
                headers: {
                    'User-Agent': source.ua,
                    'Accept': 'application/rss+xml, application/xml, text/xml'
                },
                next: { revalidate: 300 } // 5 mins
            }).then(async res => {
                if (!res.ok) throw new Error(`${source.name} failed: ${res.status}`);
                return { name: source.name, xml: await res.text() };
            })
        ));

        const allNews: any[] = [];

        results.forEach(result => {
            if (result.status === 'fulfilled') {
                const $ = cheerio.load(result.value.xml, { xmlMode: true });

                $('item').each((i, el) => {
                    if (i >= 10) return; // Top 10 from each

                    const title = $(el).find('title').text().trim();
                    const link = $(el).find('link').text().trim();
                    const pubDate = $(el).find('pubDate').text();
                    const dateObj = new Date(pubDate);

                    // Format relative time
                    const now = new Date();
                    const diffMs = now.getTime() - dateObj.getTime();
                    const diffMins = Math.floor(diffMs / 60000);
                    const diffHours = Math.floor(diffMins / 60);

                    let time = '';
                    if (isNaN(dateObj.getTime())) {
                        time = 'Recently';
                    } else if (diffMins < 60) {
                        time = `${Math.max(1, diffMins)}m ago`;
                    } else if (diffHours < 24) {
                        time = `${diffHours}h ago`;
                    } else {
                        time = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    }

                    if (title && link) {
                        let displayTitle = title;
                        if (result.value.name === 'Soccer') {
                            displayTitle = `[SOCCER] ${title}`;
                        }

                        allNews.push({
                            title: displayTitle,
                            url: link,
                            time,
                            timestamp: dateObj.getTime() || 0
                        });
                    }
                });
            }
        });

        // Sort by newest
        allNews.sort((a, b) => b.timestamp - a.timestamp);

        // Final trim to 20 items
        const finalNews = allNews.slice(0, 20);

        if (finalNews.length === 0) throw new Error("No news items parsed from any source");

        cache = { data: finalNews, timestamp: Date.now() };
        return NextResponse.json({ news: finalNews });

    } catch (error: any) {
        console.error("News Fetch Error:", error);
        if (cache) {
            return NextResponse.json({ news: cache.data });
        }

        return NextResponse.json({
            news: [
                { title: "CS2: Valve announces new anti-cheat measures", url: "https://www.hltv.org", time: "10m ago" },
                { title: "Valorant: Patch 8.11 full patch notes revealed", url: "https://www.vlr.gg", time: "35m ago" },
                { title: "InputZero: New optimization guide released", url: "/", time: "1h ago" },
                { title: "Tourney: VCT Masters playoffs starting soon", url: "https://www.vlr.gg", time: "2h ago" },
            ]
        });
    }
}
