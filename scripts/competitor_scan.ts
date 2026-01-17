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

// List of competitor URLs to monitor
// TODO: Replace with actual competitors
const COMPETITORS = [
    "https://optimize.example.com/pricing",
    "https://fps-boost.example.com"
];

async function scanCompetitors() {
    console.log("🕵️ Starting Competitor Recon...");

    const results = [];

    for (const url of COMPETITORS) {
        console.log(`Scanning ${url}...`);
        try {
            const scrapeResult: any = await app.scrape(url, {
                formats: ['markdown'],
                onlyMainContent: true
            });

            if (!scrapeResult.success) {
                console.error(`❌ Failed to scrape ${url}: ${scrapeResult.error}`);
                continue;
            }

            // In a real app, we'd use an LLM here to structure this data
            // For now, we save raw markdown
            results.push({
                url,
                timestamp: new Date().toISOString(),
                content: scrapeResult.markdown?.substring(0, 500) + "..." // Truncate for preview
            });

            console.log(`✅ Scraped ${url}`);

        } catch (error) {
            console.error(`❌ Error processing ${url}:`, error);
        }
    }

    const outputPath = path.join(__dirname, 'competitor_report.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`\n📄 Report saved to ${outputPath}`);
}

scanCompetitors();
