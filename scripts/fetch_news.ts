import FirecrawlApp from 'firecrawl';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const apiKey = process.env.FIRECRAWL_API_KEY;
if (!apiKey) {
    console.error("❌ FIRECRAWL_API_KEY not found in .env.local");
    process.exit(1);
}

const app = new FirecrawlApp({ apiKey });

async function fetchNews() {
    console.log("📰 Fetching latest CS2 Optimization news...");

    try {
        // Search for recent news
        const query = "latest CS2 fps optimization guides updates nvidia drivers 2025";
        const response: any = await app.search(query, {
            limit: 5,
            scrapeOptions: {
                formats: ['markdown']
            }
        });

        if (!response.data || response.data.length === 0) {
            console.log("No news found.");
            return;
        }

        const newsItems = response.data.map((item: any) => ({
            title: item.title,
            url: item.url,
            summary: item.description,
            fetchedAt: new Date().toISOString()
        }));

        const outputPath = path.join(__dirname, 'latest_news.json');
        fs.writeFileSync(outputPath, JSON.stringify(newsItems, null, 2));
        console.log(`✅ News fetched and saved to ${outputPath}`);
        console.log(newsItems);

    } catch (error) {
        console.error("❌ Error fetching news:", error);
    }
}

fetchNews();
