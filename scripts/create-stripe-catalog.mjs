#!/usr/bin/env node
/**
 * Creates HealthMind Stripe catalog (test or live depending on STRIPE_SECRET_KEY).
 * Usage: node --env-file=.env scripts/create-stripe-catalog.mjs
 * Then paste the printed Price IDs into .env.
 */
import Stripe from 'stripe';

const key = process.env.STRIPE_SECRET_KEY;
if (!key) {
  console.error('Missing STRIPE_SECRET_KEY');
  process.exit(1);
}

const stripe = new Stripe(key);

async function createOneTime(name, description, unitAmount) {
  const product = await stripe.products.create({ name, description });
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: unitAmount,
    currency: 'usd',
  });
  return price.id;
}

const proProduct = await stripe.products.create({
  name: 'HealthMind Pro',
  description: 'Monthly Pro with shared AI token allotment',
});
const proPrice = await stripe.prices.create({
  product: proProduct.id,
  unit_amount: 1900,
  currency: 'usd',
  recurring: { interval: 'month' },
});

const small = await createOneTime(
  'Token Top-up Small',
  '10,000 AI tokens',
  500
);
const medium = await createOneTime(
  'Token Top-up Medium',
  '30,000 AI tokens',
  1200
);
const large = await createOneTime(
  'Token Top-up Large',
  '80,000 AI tokens',
  2500
);

console.log(`
Add these to .env:

STRIPE_PRICE_PRO_MONTHLY=${proPrice.id}
STRIPE_PRICE_TOPUP_SMALL=${small}
STRIPE_PRICE_TOPUP_MEDIUM=${medium}
STRIPE_PRICE_TOPUP_LARGE=${large}
`);
