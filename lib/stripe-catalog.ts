/**
 * Stripe catalog — Price IDs from env; token grants owned by the app (never trust client).
 */

export type StripePriceKey =
  | 'pro'
  | 'topup_small'
  | 'topup_medium'
  | 'topup_large';

export type CatalogEntry = {
  key: StripePriceKey;
  kind: 'pro' | 'topup';
  /** Pro: set balance to this amount. Top-up: add this amount. */
  tokens: number;
  mode: 'subscription' | 'payment';
  label: string;
  /** Display-only placeholder USD (actual charge comes from Stripe Price). */
  displayPrice: string;
  envVar: string;
};

export const PRO_MONTHLY_TOKENS = 50_000;
export const THERAPY_TOKENS_PER_MINUTE = 500;
export const THERAPY_FREE_CAP_SECONDS = 5 * 60;
export const THERAPY_FREE_WARNING_SECONDS = 4 * 60;
export const THERAPY_BUDGET_WARNING_RATIO = 0.8;

export function estimateMinutesFromTokens(tokens: number): number {
  if (tokens <= 0) return 0;
  return Math.floor(tokens / THERAPY_TOKENS_PER_MINUTE);
}

export function shouldWarnBudget({
  openingBalance,
  tokenBalance,
}: {
  openingBalance: number;
  tokenBalance: number;
}): boolean {
  if (openingBalance <= 0) return false;
  const usedRatio = (openingBalance - tokenBalance) / openingBalance;
  return usedRatio >= THERAPY_BUDGET_WARNING_RATIO;
}

export const STRIPE_CATALOG: Record<StripePriceKey, CatalogEntry> = {
  pro: {
    key: 'pro',
    kind: 'pro',
    tokens: PRO_MONTHLY_TOKENS,
    mode: 'subscription',
    label: 'Pro monthly',
    displayPrice: '$19/mo',
    envVar: 'STRIPE_PRICE_PRO_MONTHLY',
  },
  topup_small: {
    key: 'topup_small',
    kind: 'topup',
    tokens: 10_000,
    mode: 'payment',
    label: 'Small top-up',
    displayPrice: '$5',
    envVar: 'STRIPE_PRICE_TOPUP_SMALL',
  },
  topup_medium: {
    key: 'topup_medium',
    kind: 'topup',
    tokens: 30_000,
    mode: 'payment',
    label: 'Medium top-up',
    displayPrice: '$12',
    envVar: 'STRIPE_PRICE_TOPUP_MEDIUM',
  },
  topup_large: {
    key: 'topup_large',
    kind: 'topup',
    tokens: 80_000,
    mode: 'payment',
    label: 'Large top-up',
    displayPrice: '$25',
    envVar: 'STRIPE_PRICE_TOPUP_LARGE',
  },
};

export function isStripePriceKey(value: string): value is StripePriceKey {
  return value in STRIPE_CATALOG;
}

export function getPriceId(key: StripePriceKey): string | null {
  const entry = STRIPE_CATALOG[key];
  const id = process.env[entry.envVar]?.trim();
  return id || null;
}

export function resolveCatalogByPriceId(
  priceId: string | null | undefined
): CatalogEntry | null {
  if (!priceId) return null;
  for (const entry of Object.values(STRIPE_CATALOG)) {
    const envId = process.env[entry.envVar]?.trim();
    if (envId && envId === priceId) return entry;
  }
  return null;
}
