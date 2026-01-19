import { amazonPaapi } from 'amazon-paapi';
import { AMAZON_CONFIG } from './amazon-config';

// Common parameters for all PAAPI requests
const commonParameters = {
    AccessKey: AMAZON_CONFIG.accessKey,
    SecretKey: AMAZON_CONFIG.secretKey,
    PartnerTag: AMAZON_CONFIG.partnerTag,
    PartnerType: AMAZON_CONFIG.partnerType,
    Marketplace: AMAZON_CONFIG.marketplace,
};

/**
 * Fetch prices and details for multiple ASINs
 */
export async function getItemPrices(asins: string[]) {
    if (!asins.length) return { ItemsResult: { Items: [] } };

    try {
        const response = await amazonPaapi.GetItems(commonParameters, {
            ItemIds: asins,
            Resources: [
                'ItemInfo.Title',
                'Offers.Listings.Price',
                'Offers.Listings.Availability.Message',
                'Images.Primary.Large',
            ],
        });

        return response;
    } catch (error) {
        console.error('Amazon PAAPI GetItems error:', error);
        throw error;
    }
}

/**
 * Search for components by keywords
 */
export async function searchComponents(
    keywords: string,
    category: string = 'Electronics'
) {
    try {
        const response = await amazonPaapi.SearchItems(commonParameters, {
            Keywords: keywords,
            SearchIndex: category,
            ItemCount: 10,
            Resources: [
                'ItemInfo.Title',
                'Offers.Listings.Price',
                'Images.Primary.Medium',
            ],
        });

        return response;
    } catch (error) {
        console.error('Amazon PAAPI SearchItems error:', error);
        throw error;
    }
}

/**
 * Get single item details
 */
export async function getItemDetails(asin: string) {
    const response = await getItemPrices([asin]);
    return response.ItemsResult?.Items?.[0] || null;
}
