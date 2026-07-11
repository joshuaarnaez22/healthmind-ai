'use client';

import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Check, CreditCard, Sparkles } from 'lucide-react';
import type { StripePriceKey } from '@/lib/stripe-catalog';

type BillingStatus = {
  tier: 'FREE' | 'SUBSCRIBED';
  tokenBalance: number;
  hasStripeCustomer: boolean;
  subscriptionEndsAt: string | null;
  catalog: {
    proTokens: number;
    pro: {
      key: StripePriceKey;
      label: string;
      tokens: number;
      displayPrice: string;
    };
    topups: Array<{
      key: StripePriceKey;
      label: string;
      tokens: number;
      displayPrice: string;
    }>;
  };
};

function formatTokens(n: number) {
  return n.toLocaleString();
}

export default function BillingPageClient() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get('checkout');
  const sessionId = searchParams.get('session_id');
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoadError(null);
    try {
      const res = await fetch('/api/billing/status');
      if (!res.ok) throw new Error('Could not load billing status');
      const data = (await res.json()) as BillingStatus;
      setStatus(data);
      return data;
    } catch (err) {
      console.error(err);
      setLoadError(
        err instanceof Error ? err.message : 'Could not load billing.'
      );
      return null;
    }
  }, []);

  const syncFromStripe = useCallback(
    async (checkoutSessionId?: string | null) => {
      try {
        const res = await fetch('/api/stripe/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: checkoutSessionId || undefined,
          }),
        });
        if (!res.ok) return null;
        return (await res.json()) as {
          synced: boolean;
          tier: 'FREE' | 'SUBSCRIBED';
        };
      } catch (err) {
        console.error('Stripe sync failed:', err);
        return null;
      }
    },
    []
  );

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // Always try Stripe reconcile first when returning from Checkout,
      // or when local status may lag behind a paid subscription.
      if (checkout === 'success' || sessionId) {
        await syncFromStripe(sessionId);
        if (cancelled) return;
        await reload();
        // Webhook may still be in flight — brief follow-up poll
        window.setTimeout(async () => {
          if (cancelled) return;
          await syncFromStripe(sessionId);
          if (!cancelled) await reload();
        }, 2000);
        return;
      }

      const data = await reload();
      if (cancelled || !data) return;

      // FREE in DB but may already be Pro in Stripe (missed webhook)
      if (data.tier === 'FREE') {
        const sync = await syncFromStripe();
        if (!cancelled && sync?.synced) await reload();
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [checkout, sessionId, reload, syncFromStripe]);

  const startCheckout = async (priceKey: StripePriceKey) => {
    setActionError(null);
    setLoadingKey(priceKey);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceKey }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Checkout failed');
      }
      window.location.href = data.url;
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Could not start checkout.'
      );
      setLoadingKey(null);
    }
  };

  const openPortal = async () => {
    setActionError(null);
    setLoadingKey('portal');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || 'Could not open billing portal');
      }
      window.location.href = data.url;
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : 'Could not open portal.'
      );
      setLoadingKey(null);
    }
  };

  if (loadError) {
    return (
      <div className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center">
        <p className="mb-5 text-sm text-destructive">{loadError}</p>
        <Button variant="outline" onClick={reload} className="rounded-2xl">
          Try again
        </Button>
      </div>
    );
  }

  if (!status) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-56 rounded-3xl" />
          <Skeleton className="h-56 rounded-3xl" />
        </div>
      </div>
    );
  }

  const isPro = status.tier === 'SUBSCRIBED';

  return (
    <motion.div {...pageAnimations} className="relative space-y-10">
      {checkout === 'success' && (
        <div className="rounded-2xl bg-secondary/70 px-4 py-3 text-sm text-muted-foreground">
          Thanks — your billing update is processing. Refresh in a moment if
          your balance hasn&apos;t updated yet.
        </div>
      )}
      {checkout === 'cancel' && (
        <div className="rounded-2xl bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
          Checkout canceled. No charge was made.
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
            isPro
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary text-muted-foreground'
          )}
        >
          <Sparkles className="h-3 w-3" />
          {isPro ? 'Pro' : 'Free'}
        </span>
        {isPro && (
          <p className="text-sm text-muted-foreground">
            {formatTokens(status.tokenBalance)} tokens left
          </p>
        )}
        {status.hasStripeCustomer && (
          <Button
            variant="outline"
            size="sm"
            className="ml-auto rounded-2xl"
            disabled={loadingKey === 'portal'}
            onClick={openPortal}
          >
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            Manage billing
          </Button>
        )}
      </div>

      {actionError && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </div>
      )}

      <section>
        <h2 className="mb-4 font-heading text-lg font-semibold tracking-tight">
          Plans
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-border/80 bg-secondary/40 p-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Free
            </p>
            <p className="mb-4 font-heading text-2xl font-bold tracking-tight">
              Included
            </p>
            <ul className="mb-6 space-y-2.5 text-sm text-muted-foreground">
              {[
                'Mood, journal, and vitals tracking',
                'Daily free chat messages',
                'AI Therapy sessions up to 5 minutes',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Core support — upgrade only if you want more.
            </p>
          </div>

          <div className="rounded-3xl border border-primary/20 bg-secondary p-6">
            <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-primary">
              Pro
            </p>
            <p className="mb-1 font-heading text-2xl font-bold tracking-tight">
              {status.catalog.pro.displayPrice}
            </p>
            <p className="mb-4 text-sm text-muted-foreground">
              {formatTokens(status.catalog.pro.tokens)} tokens each month
            </p>
            <ul className="mb-6 space-y-2.5 text-sm text-muted-foreground">
              {[
                'Shared wallet for chat + AI Therapy',
                'Longer voice sessions (token-based)',
                'Cancel anytime in Manage billing',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            {isPro ? (
              <Button
                variant="outline"
                className="w-full rounded-2xl"
                disabled
              >
                Current plan
              </Button>
            ) : (
              <Button
                className="w-full rounded-2xl"
                disabled={loadingKey === 'pro'}
                onClick={() => startCheckout('pro')}
              >
                {loadingKey === 'pro' ? 'Redirecting…' : 'Upgrade to Pro'}
              </Button>
            )}
          </div>
        </div>
      </section>

      {isPro && (
        <section>
          <h2 className="mb-1 font-heading text-lg font-semibold tracking-tight">
            Top up tokens
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Add to your balance anytime. Tokens stay in your shared AI wallet.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {status.catalog.topups.map((pack) => (
              <div
                key={pack.key}
                className="flex flex-col rounded-3xl border border-border/80 bg-card/60 p-5"
              >
                <p className="mb-1 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {pack.label}
                </p>
                <p className="font-heading text-xl font-bold tracking-tight">
                  {pack.displayPrice}
                </p>
                <p className="mb-5 mt-1 text-sm text-muted-foreground">
                  +{formatTokens(pack.tokens)} tokens
                </p>
                <Button
                  variant="outline"
                  className="mt-auto w-full rounded-2xl"
                  disabled={loadingKey === pack.key}
                  onClick={() => startCheckout(pack.key)}
                >
                  {loadingKey === pack.key ? 'Redirecting…' : 'Buy'}
                </Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </motion.div>
  );
}
