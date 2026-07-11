import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { PRO_MONTHLY_TOKENS, STRIPE_CATALOG } from '@/lib/stripe-catalog';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        aiTokenBalance: true,
        stripeCustomerId: true,
        subscriptionEndsAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      tier: user.subscriptionTier,
      tokenBalance: user.aiTokenBalance,
      hasStripeCustomer: Boolean(user.stripeCustomerId),
      subscriptionEndsAt: user.subscriptionEndsAt,
      catalog: {
        proTokens: PRO_MONTHLY_TOKENS,
        topups: [
          STRIPE_CATALOG.topup_small,
          STRIPE_CATALOG.topup_medium,
          STRIPE_CATALOG.topup_large,
        ].map((e) => ({
          key: e.key,
          label: e.label,
          tokens: e.tokens,
          displayPrice: e.displayPrice,
        })),
        pro: {
          key: STRIPE_CATALOG.pro.key,
          label: STRIPE_CATALOG.pro.label,
          tokens: STRIPE_CATALOG.pro.tokens,
          displayPrice: STRIPE_CATALOG.pro.displayPrice,
        },
      },
    });
  } catch (error) {
    console.error('Error billing/status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
