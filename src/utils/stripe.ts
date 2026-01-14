/**
 * Stripe Integration
 * Handles payment configuration and checkout session creation
 */

export interface Product {
    id: string;
    name: string;
    nameJa: string;
    description: string;
    price: number;           // JPY
    gems?: number;           // Gems to grant
    isPremium?: boolean;     // Grants premium status
}

export const PRODUCTS: Product[] = [
    {
        id: 'gems_100',
        name: '100 Gems',
        nameJa: '100ジェム',
        description: 'ガチャ1回分',
        price: 120,
        gems: 100,
    },
    {
        id: 'gems_500',
        name: '550 Gems',
        nameJa: '550ジェム',
        description: 'お得パック！ガチャ5回分+ボーナス50',
        price: 500,
        gems: 550,
    },
    {
        id: 'gems_1200',
        name: '1300 Gems',
        nameJa: '1300ジェム',
        description: '超お得パック！ガチャ13回分',
        price: 1000,
        gems: 1300,
    },
    {
        id: 'premium',
        name: 'Premium (Ad-Free)',
        nameJa: 'プレミアム（広告削除）',
        description: '全ての広告を永久に削除',
        price: 300,
        isPremium: true,
    },
];

/**
 * Get product by ID
 */
export function getProductById(productId: string): Product | undefined {
    return PRODUCTS.find(p => p.id === productId);
}

/**
 * Format price for display
 */
export function formatPrice(price: number): string {
    return `¥${price.toLocaleString()}`;
}

/**
 * Create checkout session (client-side call to API)
 */
export async function createCheckoutSession(productId: string): Promise<string | null> {
    try {
        const response = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId }),
        });

        if (!response.ok) {
            throw new Error('Checkout session creation failed');
        }

        const data = await response.json();
        return data.url;
    } catch (error) {
        console.error('Checkout error:', error);
        return null;
    }
}

/**
 * Verify purchase and grant items (called after successful payment)
 */
export function grantPurchase(productId: string): boolean {
    // Note: In production, this should be called from server-side webhook
    // This is a simplified client-side implementation for demo
    const product = getProductById(productId);
    if (!product) return false;

    // Import dynamically to avoid circular deps
    import('@/utils/playerData').then(({ addGems, setPremium }) => {
        if (product.gems) {
            addGems(product.gems);
        }
        if (product.isPremium) {
            setPremium(true);
        }
    });

    return true;
}

// Stripe public key - set in environment variable
export const STRIPE_PUBLIC_KEY = process.env.NEXT_PUBLIC_STRIPE_KEY || '';

// Check if Stripe is configured
export function isStripeConfigured(): boolean {
    return !!STRIPE_PUBLIC_KEY;
}
