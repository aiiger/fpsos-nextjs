/**
 * InputZero Trade-In Logic
 * Defines what hardware we accept for resale and how credit is calculated.
 */

export interface TradeInComponent {
    category: 'GPU' | 'CPU' | 'RAM' | 'MOTHERBOARD';
    generation: string;
    model: string;
    condition: 'PERFECT' | 'GOOD' | 'USED';
}

const ELIGIBLE_FOR_RESALE = {
    GPU: ['RTX 4090', 'RTX 4080', 'RTX 4070', 'RTX 3090', 'RTX 3080'],
    CPU: ['7800X3D', '7950X3D', '5800X3D', '14900K', '13900K'],
    MOTHERBOARD: ['X670E', 'X570', 'Z790']
};

/**
 * Checks if a component is "Easy to Resell" in the GCC market.
 */
export function isEligibleForTradeIn(comp: TradeInComponent): boolean {
    const models = ELIGIBLE_FOR_RESALE[comp.category as keyof typeof ELIGIBLE_FOR_RESALE];
    if (!models) return false;

    return models.some(m => comp.model.includes(m));
}

/**
 * Estimates credit based on market value.
 * We apply a 20% "Processing & Resale" fee.
 */
export function estimateTradeInCredit(marketValue: number, condition: TradeInComponent['condition']): number {
    let multiplier = 0.8; // Base 20% fee

    if (condition === 'GOOD') multiplier = 0.7;
    if (condition === 'USED') multiplier = 0.5;

    return Math.floor(marketValue * multiplier);
}
