import redis from '@/lib/upstash';
import {
  THERAPY_FREE_CAP_SECONDS,
  THERAPY_TOKENS_PER_MINUTE,
} from '@/lib/stripe-catalog';

export const THERAPY_GRANT_LIMITS = {
  free: { max: 5, windowSeconds: 3600 },
  paid: { max: 60, windowSeconds: 3600 },
} as const;

async function slidingWindowAllow(
  key: string,
  max: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const pipe = redis.pipeline();
  pipe.zremrangebyscore(key, 0, windowStart);
  pipe.zadd(key, { score: now, member: `${now}-${crypto.randomUUID()}` });
  pipe.zcard(key);
  pipe.expire(key, windowSeconds);
  const results = await pipe.exec();
  const count = Number(results[2] ?? 0);
  const allowed = count <= max;
  return { allowed, remaining: Math.max(0, max - count) };
}

export async function checkTherapyGrantRate(
  userId: string,
  isPaid: boolean
): Promise<{ ok: true } | { ok: false; remaining: number }> {
  const cfg = isPaid ? THERAPY_GRANT_LIMITS.paid : THERAPY_GRANT_LIMITS.free;
  const key = `therapy:grant:rate:${userId}`;
  const { allowed, remaining } = await slidingWindowAllow(
    key,
    cfg.max,
    cfg.windowSeconds
  );
  if (!allowed) return { ok: false, remaining };
  return { ok: true };
}

export function tokensForElapsedSeconds(
  previousSeconds: number,
  currentSeconds: number
): number {
  const prevMin = Math.floor(previousSeconds / 60);
  const currMin = Math.floor(currentSeconds / 60);
  const deltaMin = Math.max(0, currMin - prevMin);
  return deltaMin * THERAPY_TOKENS_PER_MINUTE;
}

export { THERAPY_FREE_CAP_SECONDS, THERAPY_TOKENS_PER_MINUTE };
