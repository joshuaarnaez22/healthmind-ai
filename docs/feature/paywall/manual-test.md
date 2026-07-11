# Paywall + Therapy Caps — Manual Test

## Prerequisites

1. Named Stripe env vars set (`STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`).
2. Price IDs set — run `node --env-file=.env scripts/create-stripe-catalog.mjs` if empty.
3. Webhook: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` and paste `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
4. Customer Portal enabled in Stripe Dashboard (Settings → Billing → Customer portal).
5. `npx prisma db push` so Stripe columns exist on `User`.

## Billing

| # | Steps | Expect |
| - | ----- | ------ |
| B1 | Open `/user/billing` while FREE | Free + Pro tinted panels; no top-up row |
| B2 | Upgrade to Pro (test card `4242…`) | Redirect to Checkout; return `?checkout=success` |
| B3 | After webhook | Chip shows Pro; token balance ~50,000 |
| B4 | Top-up Small | Balance increases by 10,000 |
| B5 | Manage billing → Portal | Can cancel / update payment method |
| B6 | Cancel subscription (Portal) | After `customer.subscription.deleted`, tier FREE |
| B7 | Chatbot hit free quota | Upgrade links to `/user/billing` |
| B8 | Nav user menu → Billing | Opens `/user/billing` |

## AI Therapy caps

| # | Steps | Expect |
| - | ----- | ------ |
| T1 | FREE user starts session | Live; copy mentions 5-minute wrap |
| T2 | At ~4:00 | Warning “About a minute left…” |
| T3 | At 5:00 | Session ends; Upgrade CTA to billing |
| T4 | SUBSCRIBED with balance 0 | Start fails with 402 / top-up messaging |
| T5 | SUBSCRIBED with balance | Session runs; heartbeat every ~30s debits per completed minute |
| T6 | Drain balance mid-session | Session ends; Top up CTA |

## Notes

- Without Price IDs, checkout returns `stripe_price_missing`.
- Without webhook secret / CLI forward, Checkout succeeds but DB tier/balance will not update.
