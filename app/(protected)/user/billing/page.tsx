import { Suspense } from 'react';
import BillingPageClient from './_components/billing-page';
import { Skeleton } from '@/components/ui/skeleton';

export const dynamic = 'force-dynamic';

export default function BillingPage() {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-8 h-72 rounded-[3rem] bg-[radial-gradient(ellipse_at_top,oklch(var(--primary)_/_0.08),transparent_70%)]"
      />

      <div className="relative mb-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Billing
        </p>
        <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl [text-wrap:balance]">
          Plans &amp; tokens
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground [text-wrap:pretty]">
          One calm wallet for chat and AI Therapy. Start free — upgrade only if
          you want more.
        </p>
      </div>

      <div className="relative">
        <Suspense
          fallback={
            <div className="space-y-6">
              <Skeleton className="h-8 w-48 rounded-xl" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-56 rounded-3xl" />
                <Skeleton className="h-56 rounded-3xl" />
              </div>
            </div>
          }
        >
          <BillingPageClient />
        </Suspense>
      </div>
    </div>
  );
}
