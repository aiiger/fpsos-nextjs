export interface PriceData {
    partId: string;
    price: number;
    retailer: 'Amazon.ae' | 'Noon' | 'GCC Gamers' | 'Microless' | 'InputZero Stock';
    url: string;
    lastUpdated: number;
    inStock: boolean;
}

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const PRICE_CACHE: Record<string, PriceData> = {};

// Mock Data for "What we would be pushing out now"
// In production, this would scrape or hit APIs
const MOCK_DB: Record<string, Partial<PriceData>> = {
    '7800x3d': { price: 1650, retailer: 'Amazon.ae', inStock: true },
    '4090-rog': { price: 8900, retailer: 'Noon', inStock: true },
    'z790-apex': { price: 3200, retailer: 'GCC Gamers', inStock: false },
};

/**
 * Fetches the best price for a given part ID.
 * Applies a 15% margin as defined in the business logic.
 */
export async function getComponentPrice(partId: string): Promise<PriceData> {
    const now = Date.now();
    const cached = PRICE_CACHE[partId];

    if (cached && (now - cached.lastUpdated < CACHE_DURATION)) {
        return cached;
    }

    // Simulate fetch latency
    // await new Promise(resolve => setTimeout(resolve, 500)); 

    const mockData = MOCK_DB[partId.toLowerCase()] || {
        price: 9999,
        retailer: 'InputZero Stock',
        inStock: true
    };

    // Apply Margin Logic (Internal 15%)
    const basePrice = mockData.price || 0;
    const finalPrice = Math.ceil(basePrice * 1.15);

    const result: PriceData = {
        partId,
        price: finalPrice,
        retailer: mockData.retailer as any || 'InputZero Stock',
        url: '#', // Placeholder
        lastUpdated: now,
        inStock: mockData.inStock !== false
    };

    PRICE_CACHE[partId] = result;
    return result;
}

/**
 * Bulk fetch for a build list
 */
export async function getBuildPrice(partIds: string[]): Promise<number> {
    const prices = await Promise.all(partIds.map(id => getComponentPrice(id)));
    return prices.reduce((sum, item) => sum + item.price, 0);
}
