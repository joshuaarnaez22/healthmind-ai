import { prisma } from '@/lib/client';
import { getStripe } from '@/lib/stripe';
import {
  PRO_MONTHLY_TOKENS,
  resolveCatalogByPriceId,
} from '@/lib/stripe-catalog';
import type Stripe from 'stripe';

type BillingUser = {
  id: string;
  email: string;
  stripeCustomerId: string | null;
};

export async function getOrCreateStripeCustomer(
  user: BillingUser
): Promise<string> {
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: user.email,
    metadata: { userId: user.id },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function applyProSubscription({
  userId,
  subscriptionId,
  currentPeriodEnd,
  refillTokens = true,
}: {
  userId: string;
  subscriptionId: string | null;
  currentPeriodEnd?: Date | null;
  /** When false, keep existing aiTokenBalance (used for reconcile sync). */
  refillTokens?: boolean;
}) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: 'SUBSCRIBED',
      stripeSubscriptionId: subscriptionId,
      subscriptionEndsAt: currentPeriodEnd ?? null,
      ...(refillTokens ? { aiTokenBalance: PRO_MONTHLY_TOKENS } : {}),
    },
  });
}

export async function applyTopUp({
  userId,
  tokens,
}: {
  userId: string;
  tokens: number;
}) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      aiTokenBalance: { increment: tokens },
    },
  });
}

export async function applySubscriptionCanceled(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: 'FREE',
      stripeSubscriptionId: null,
      subscriptionEndsAt: null,
    },
  });
}

export async function findUserIdFromStripeCustomer(
  customerId: string | null | undefined
): Promise<string | null> {
  if (!customerId || typeof customerId !== 'string') return null;
  const user = await prisma.user.findFirst({
    where: { stripeCustomerId: customerId },
    select: { id: true },
  });
  return user?.id ?? null;
}

function periodEndFromSubscription(
  sub: Stripe.Subscription
): Date | null {
  const end = (
    sub as Stripe.Subscription & { current_period_end?: number }
  ).current_period_end;
  if (!end) return null;
  return new Date(end * 1000);
}

export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId =
    session.client_reference_id ||
    session.metadata?.userId ||
    (await findUserIdFromStripeCustomer(
      typeof session.customer === 'string' ? session.customer : session.customer?.id
    ));

  if (!userId) {
    console.error('Stripe checkout: missing userId', session.id);
    return;
  }

  // Persist customer id if we created it during checkout
  if (typeof session.customer === 'string') {
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId: session.customer },
    });
  }

  if (session.mode === 'subscription') {
    const subId =
      typeof session.subscription === 'string'
        ? session.subscription
        : session.subscription?.id ?? null;

    let periodEnd: Date | null = null;
    if (subId) {
      const stripe = getStripe();
      const sub = await stripe.subscriptions.retrieve(subId);
      periodEnd = periodEndFromSubscription(sub);
    }

    await applyProSubscription({
      userId,
      subscriptionId: subId,
      currentPeriodEnd: periodEnd,
    });
    return;
  }

  if (session.mode === 'payment') {
    const stripe = getStripe();
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      limit: 5,
    });
    const priceId = lineItems.data[0]?.price?.id;
    const entry = resolveCatalogByPriceId(priceId);
    if (!entry || entry.kind !== 'topup') {
      console.error('Stripe top-up: unknown price', priceId, session.id);
      return;
    }
    await applyTopUp({ userId, tokens: entry.tokens });
  }
}

export async function handleInvoicePaid(invoice: Stripe.Invoice) {
  // Initial subscription checkout also fires invoice.paid — refill is fine (set to allotment).
  const customerId =
    typeof invoice.customer === 'string'
      ? invoice.customer
      : invoice.customer?.id;

  const userId =
    invoice.metadata?.userId ||
    (await findUserIdFromStripeCustomer(customerId));

  if (!userId) {
    console.error('Stripe invoice.paid: missing userId', invoice.id);
    return;
  }

  const subRef = (
    invoice as Stripe.Invoice & {
      subscription?: string | Stripe.Subscription | null;
    }
  ).subscription;
  const subId =
    typeof subRef === 'string' ? subRef : subRef?.id ?? null;

  if (!subId) {
    // One-time invoice — ignore (top-ups handled via checkout.session.completed)
    return;
  }

  let periodEnd: Date | null = null;
  try {
    const stripe = getStripe();
    const sub = await stripe.subscriptions.retrieve(subId);
    periodEnd = periodEndFromSubscription(sub);
  } catch (err) {
    console.error('Stripe invoice.paid: failed to load subscription', err);
  }

  await applyProSubscription({
    userId,
    subscriptionId: subId,
    currentPeriodEnd: periodEnd,
  });
}

export async function handleSubscriptionUpdated(sub: Stripe.Subscription) {
  const userId =
    sub.metadata?.userId ||
    (await findUserIdFromStripeCustomer(
      typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
    ));

  if (!userId) {
    console.error('Stripe subscription.updated: missing userId', sub.id);
    return;
  }

  const active = sub.status === 'active' || sub.status === 'trialing';
  if (!active) {
    await applySubscriptionCanceled(userId);
    return;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: 'SUBSCRIBED',
      stripeSubscriptionId: sub.id,
      subscriptionEndsAt: periodEndFromSubscription(sub),
    },
  });
}

export async function handleSubscriptionDeleted(sub: Stripe.Subscription) {
  const userId =
    sub.metadata?.userId ||
    (await findUserIdFromStripeCustomer(
      typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
    ));

  if (!userId) {
    console.error('Stripe subscription.deleted: missing userId', sub.id);
    return;
  }

  await applySubscriptionCanceled(userId);
}

export async function syncUserBillingFromStripe({
  userId,
  checkoutSessionId,
}: {
  userId: string;
  checkoutSessionId?: string | null;
}): Promise<{ synced: boolean; tier: 'FREE' | 'SUBSCRIBED' }> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      subscriptionTier: true,
      stripeCustomerId: true,
      aiTokenBalance: true,
    },
  });

  if (!user) {
    return { synced: false, tier: 'FREE' };
  }

  const stripe = getStripe();

  if (checkoutSessionId) {
    const session = await stripe.checkout.sessions.retrieve(checkoutSessionId);
    const sessionUserId =
      session.client_reference_id || session.metadata?.userId || null;
    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer?.id;

    const ownsSession =
      sessionUserId === userId ||
      (customerId && customerId === user.stripeCustomerId);

    if (ownsSession && session.status === 'complete') {
      await handleCheckoutSessionCompleted(session);
      const updated = await prisma.user.findUnique({
        where: { id: userId },
        select: { subscriptionTier: true },
      });
      return {
        synced: true,
        tier: updated?.subscriptionTier ?? user.subscriptionTier,
      };
    }
  }

  let customerId = user.stripeCustomerId;
  if (!customerId && user.email) {
    const listed = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });
    customerId = listed.data[0]?.id ?? null;
    if (customerId) {
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }
  }

  if (!customerId) {
    return { synced: false, tier: user.subscriptionTier };
  }

  const subs = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
  });

  const active = subs.data[0];
  if (active) {
    const alreadyPro = user.subscriptionTier === 'SUBSCRIBED';
    await applyProSubscription({
      userId,
      subscriptionId: active.id,
      currentPeriodEnd: periodEndFromSubscription(active),
      refillTokens: !alreadyPro || user.aiTokenBalance <= 0,
    });
    return { synced: true, tier: 'SUBSCRIBED' };
  }

  return { synced: false, tier: user.subscriptionTier };
}
