import { db } from './db';
import { getItemPrices } from './amazon-paapi';
import { PRICING_CONFIG } from './amazon-config';

/**
 * Update component prices from Amazon PAAPI
 */
export async function updateComponentPrices(asins: string[]) {
    if (!asins.length) return { updated: 0, errors: [] };

    const errors: string[] = [];
    let updated = 0;

    // Process in batches of 10 (Amazon PAAPI limit)
    for (let i = 0; i < asins.length; i += 10) {
        const batch = asins.slice(i, i + 10);

        try {
            const response = await getItemPrices(batch);

            for (const item of response.ItemsResult?.Items || []) {
                const price = item.Offers?.Listings?.[0]?.Price?.Amount;
                const availability =
                    item.Offers?.Listings?.[0]?.Availability?.Message === 'In Stock';

                await db.execute({
                    sql: `
            INSERT INTO component_prices (asin, title, price_usd, availability, image_url, last_checked)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(asin) DO UPDATE SET
              title = excluded.title,
              price_usd = excluded.price_usd,
              availability = excluded.availability,
              image_url = excluded.image_url,
              last_checked = CURRENT_TIMESTAMP
          `,
                    args: [
                        item.ASIN,
                        item.ItemInfo?.Title?.DisplayValue || '',
                        price || 0,
                        availability ? 1 : 0,
                        item.Images?.Primary?.Large?.URL || '',
                    ],
                });

                updated++;
            }
        } catch (error) {
            console.error(`Error updating batch ${i}-${i + 10}:`, error);
            errors.push(`Batch ${i}-${i + 10}: ${error}`);
        }

        // Rate limiting: wait 1 second between batches
        if (i + 10 < asins.length) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }

    return { updated, errors };
}

/**
 * Get cached component price
 */
export async function getCachedPrice(asin: string) {
    const result = await db.execute({
        sql: 'SELECT * FROM component_prices WHERE asin = ?',
        args: [asin],
    });

    return result.rows[0] || null;
}

/**
 * Calculate build total price
 */
export async function calculateBuildPrice(
    buildId: number,
    region: 'UAE' | 'INTERNATIONAL'
) {
    // Get build details
    const buildResult = await db.execute({
        sql: 'SELECT * FROM forge_builds WHERE id = ?',
        args: [buildId],
    });

    const build = buildResult.rows[0];
    if (!build) throw new Error('Build not found');

    // Collect all ASINs
    const asins = [
        build.motherboard_asin,
        build.cpu_asin,
        build.gpu_asin,
        build.ram_asin,
        build.case_asin,
        build.psu_asin,
        build.storage_asin,
        build.cooler_asin,
        build.mouse_asin,
        build.mousepad_asin,
        build.mouse_glides_asin,
    ].filter(Boolean) as string[];

    // Get prices
    let totalUSD = 0;
    const components: any[] = [];

    for (const asin of asins) {
        const cached = await getCachedPrice(asin);
        if (cached) {
            totalUSD += Number(cached.price_usd || 0);
            components.push(cached);
        }
    }

    // Convert to AED and apply markup
    const totalAED = totalUSD * PRICING_CONFIG.usdToAED;
    const markup =
        region === 'UAE'
            ? PRICING_CONFIG.markupUAE
            : PRICING_CONFIG.markupInternational;

    const markedUpComponents = totalAED * (1 + markup);
    const finalPrice = markedUpComponents + PRICING_CONFIG.serviceFeeAED;

    return {
        componentCostUSD: totalUSD,
        componentCostAED: totalAED,
        markup: totalAED * markup,
        serviceFee: PRICING_CONFIG.serviceFeeAED,
        total: finalPrice,
        components,
    };
}
