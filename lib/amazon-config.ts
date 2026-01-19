import 'dotenv/config';

// Amazon Product Advertising API Configuration
export const AMAZON_CONFIG = {
    accessKey: process.env.AMAZON_ACCESS_KEY || '',
    secretKey: process.env.AMAZON_SECRET_KEY || '',
    partnerTag: process.env.AMAZON_PARTNER_TAG || '',
    partnerType: 'Associates' as const,
    marketplace: 'www.amazon.com',
};

// Pricing Configuration
export const PRICING_CONFIG = {
    serviceFeeAED: 2500,
    markupUAE: 0.125, // 12.5%
    markupInternational: 0.225, // 22.5%
    usdToAED: 3.67, // Update periodically
};

// Validate Amazon credentials
export function validateAmazonConfig(): boolean {
    return !!(
        AMAZON_CONFIG.accessKey &&
        AMAZON_CONFIG.secretKey &&
        AMAZON_CONFIG.partnerTag
    );
}
