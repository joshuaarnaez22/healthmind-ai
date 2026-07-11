import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { getStripe } from '@/lib/stripe';
import {
  getPriceId,
  isStripePriceKey,
  STRIPE_CATALOG,
  type StripePriceKey,
} from '@/lib/stripe-catalog';
import { getOrCreateStripeCustomer } from '@/lib/stripe-billing';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured' },
        { status: 500 }
      );
    }

    const body = (await req.json()) as { priceKey?: string };
    const priceKey = body.priceKey;
    if (!priceKey || !isStripePriceKey(priceKey)) {
      return NextResponse.json(
        { error: 'Invalid priceKey' },
        { status: 400 }
      );
    }

    const entry = STRIPE_CATALOG[priceKey as StripePriceKey];
    const priceId = getPriceId(entry.key);
    if (!priceId) {
      return NextResponse.json(
        {
          error: `Missing ${entry.envVar}. Create the Price in Stripe Dashboard and set the env var.`,
          code: 'stripe_price_missing',
        },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        stripeCustomerId: true,
        subscriptionTier: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (entry.kind === 'topup' && user.subscriptionTier !== 'SUBSCRIBED') {
      return NextResponse.json(
        {
          error: 'Top-ups are available after you subscribe to Pro.',
          code: 'subscription_required',
        },
        { status: 403 }
      );
    }

    if (entry.kind === 'pro' && user.subscriptionTier === 'SUBSCRIBED') {
      return NextResponse.json(
        {
          error: 'You already have Pro. Use Manage billing to update your plan.',
          code: 'already_subscribed',
        },
        { status: 400 }
      );
    }

    const customerId = await getOrCreateStripeCustomer(user);
    const origin = new URL(req.url).origin;
    const stripe = getStripe();

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: entry.mode,
      client_reference_id: user.id,
      metadata: {
        userId: user.id,
        priceKey: entry.key,
      },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/user/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/user/billing?checkout=cancel`,
      allow_promotion_codes: true,
      ...(entry.mode === 'subscription'
        ? {
            subscription_data: {
              metadata: { userId: user.id },
            },
          }
        : {}),
    });

    if (!session.url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (error) {
    console.error('Error stripe/checkout:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
