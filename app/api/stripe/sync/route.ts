import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';
import { syncUserBillingFromStripe } from '@/lib/stripe-billing';
import { prisma } from '@/lib/client';

export const dynamic = 'force-dynamic';

/**
 * Reconcile Stripe → DB (missed webhooks / return from Checkout).
 * Body: { sessionId?: string }
 */
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

    const body = (await req.json().catch(() => ({}))) as {
      sessionId?: string;
    };

    const result = await syncUserBillingFromStripe({
      userId,
      checkoutSessionId: body.sessionId ?? null,
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        aiTokenBalance: true,
        stripeCustomerId: true,
        subscriptionEndsAt: true,
      },
    });

    return NextResponse.json({
      synced: result.synced,
      tier: user?.subscriptionTier ?? result.tier,
      tokenBalance: user?.aiTokenBalance ?? 0,
      hasStripeCustomer: Boolean(user?.stripeCustomerId),
      subscriptionEndsAt: user?.subscriptionEndsAt ?? null,
    });
  } catch (error) {
    console.error('Error stripe/sync:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
