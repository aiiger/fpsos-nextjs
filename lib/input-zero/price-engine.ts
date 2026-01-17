/**
 * InputZero Price Engine
 * Handles internal margins and retailer selection for GCC stock.
 */

export const GLOBAL_MARGIN = 0.20; // 20% Parts Markup

export interface PriceResult {
    rawPrice: number;
    adjustedPrice: number;
    vendor: string;
    margin: number;
}

/**
 * Calculates the InputZero consumer price from a raw market price.
 * "Internally adjusted" based on the user's margin strategy.
 */
export function calculateAdjustedPrice(marketPrice: number, customMargin?: number): number {
    const margin = customMargin !== undefined ? customMargin : GLOBAL_MARGIN;
    // Round to nearest 5 or 9 for a "premium retail" feel
    const raw = marketPrice * (1 + margin);
    return Math.ceil(raw / 5) * 5;
}

/**
 * Identifies the best retailer based on a set of discovered prices.
 */
export function findBestSourcing(prices: Record<string, number | undefined>): { vendor: string, price: number } | null {
    let bestVendor = '';
    let minPrice = Infinity;

    for (const [vendor, price] of Object.entries(prices)) {
        if (price && price < minPrice) {
            minPrice = price;
            bestVendor = vendor;
        }
    }

    return bestVendor ? { vendor: bestVendor, price: minPrice } : null;
}
