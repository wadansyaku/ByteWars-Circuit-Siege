import { NextRequest, NextResponse } from 'next/server';

/**
 * Stripe Checkout Session API Route
 * Creates a checkout session for gem purchases or premium subscription
 */

// Products configuration (should match stripe.ts)
const PRODUCTS: Record<string, { priceId: string; name: string }> = {
    gems_100: { priceId: 'price_gems_100', name: '100 Gems' },
    gems_500: { priceId: 'price_gems_500', name: '550 Gems' },
    gems_1200: { priceId: 'price_gems_1200', name: '1300 Gems' },
    premium: { priceId: 'price_premium', name: 'Premium' },
};

export async function POST(request: NextRequest) {
    try {
        const { productId } = await request.json();

        if (!productId || !PRODUCTS[productId]) {
            return NextResponse.json({ error: 'Invalid product' }, { status: 400 });
        }

        const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

        if (!stripeSecretKey) {
            // Development mode - return mock URL
            console.warn('Stripe not configured, using mock checkout');
            return NextResponse.json({
                url: `/api/checkout/success?productId=${productId}&mock=true`,
                mock: true
            });
        }

        // Production - create real Stripe session
        const stripe = await import('stripe').then(m => new m.default(stripeSecretKey));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: PRODUCTS[productId].priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${request.nextUrl.origin}/api/checkout/success?session_id={CHECKOUT_SESSION_ID}&productId=${productId}`,
            cancel_url: `${request.nextUrl.origin}/?cancelled=true`,
            metadata: {
                productId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
    }
}
