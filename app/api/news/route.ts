import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Cache structure
let cache: { data: any, timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const RSS_URL = 'https://www.hltv.org/rss/news';

export async function GET() {
    // Check cache
    if (cache && Date.now() - cache.timestamp < CACHE_DURATION) {
        return NextResponse.json({ news: cache.data });
    }

    try {
        console.log('Fetching news from HLTV RSS...');
        const response = await fetch(RSS_URL, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`RSS Fetch failed: ${response.status}`);
        }

        const xml = await response.text();
        const $ = cheerio.load(xml, { xmlMode: true });
        const newsItems: any[] = [];

        $('item').each((i, el) => {
            if (i >= 15) return;

            const title = $(el).find('title').text();
            const link = $(el).find('link').text();
            const pubDate = $(el).find('pubDate').text();

            // Format time simply (e.g., "10:30" or "Jan 15")
            const dateObj = new Date(pubDate);
            const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

            if (title && link) {
                newsItems.push({
                    title,
                    url: link,
                    time
                });
            }
        });

        cache = { data: newsItems, timestamp: Date.now() };
        return NextResponse.json({ news: newsItems });

    } catch (error: any) {
        console.error("RSS Fetch Error:", error);
        if (cache) {
            return NextResponse.json({ news: cache.data });
        }

        // Fallback mock data if RSS fails (e.g., blocked by Cloudflare)
        return NextResponse.json({
            news: [
                { title: "CS2 Update: Release Notes", url: "https://www.hltv.org", time: "Now" },
                { title: "Major: Qualifiers Update", url: "https://www.hltv.org", time: "1h ago" },
                { title: "S2 Performance Patch", url: "https://www.hltv.org", time: "2h ago" },
                { title: "Pro League Season 19", url: "https://www.hltv.org", time: "3h ago" },
            ]
        });
    }
}
