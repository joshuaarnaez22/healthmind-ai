import redis from '@/lib/upstash';
import { CHATBOT_LIMITS, type ChatSurface } from '@/lib/chatbot-prompt';

export type LimitResult =
  | { ok: true; remaining?: number }
  | {
      ok: false;
      status: 429 | 403 | 402;
      code: 'rate_limited' | 'free_quota' | 'token_budget';
      message: string;
      remaining?: number;
    };

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

export async function checkLandingRateLimit(
  ip: string
): Promise<LimitResult> {
  const { maxRequests, windowSeconds } = CHATBOT_LIMITS.landing;
  const key = `chat:landing:rate:${ip}`;
  const { allowed, remaining } = await slidingWindowAllow(
    key,
    maxRequests,
    windowSeconds
  );
  if (!allowed) {
    return {
      ok: false,
      status: 429,
      code: 'rate_limited',
      message:
        'You’ve reached the guest chat limit. Sign up for a free account to continue.',
      remaining: 0,
    };
  }
  return { ok: true, remaining };
}

export async function checkAppRateLimit(
  userId: string,
  isPaid: boolean
): Promise<LimitResult> {
  const cfg = isPaid ? CHATBOT_LIMITS.paid : CHATBOT_LIMITS.free;
  const key = `chat:app:rate:${userId}`;
  const { allowed, remaining } = await slidingWindowAllow(
    key,
    cfg.rateMax,
    cfg.rateWindowSeconds
  );
  if (!allowed) {
    return {
      ok: false,
      status: 429,
      code: 'rate_limited',
      message: 'Too many messages. Please wait a few minutes and try again.',
      remaining: 0,
    };
  }
  return { ok: true, remaining };
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export async function getFreeDailyUsage(userId: string): Promise<number> {
  const key = `chat:free:daily:${userId}:${todayKey()}`;
  const n = await redis.get<number>(key);
  return Number(n ?? 0);
}

export async function checkAndIncrementFreeDaily(
  userId: string
): Promise<LimitResult> {
  const max = CHATBOT_LIMITS.free.dailyMessages;
  const key = `chat:free:daily:${userId}:${todayKey()}`;
  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, 60 * 60 * 36);
  }
  if (count > max) {
    return {
      ok: false,
      status: 403,
      code: 'free_quota',
      message:
        'You’ve used today’s free chat messages. Upgrade to continue with a token balance.',
      remaining: 0,
    };
  }
  return { ok: true, remaining: Math.max(0, max - count) };
}

export async function peekFreeDailyRemaining(
  userId: string
): Promise<number> {
  const used = await getFreeDailyUsage(userId);
  return Math.max(0, CHATBOT_LIMITS.free.dailyMessages - used);
}

export function limitsForSurface(
  surface: ChatSurface,
  isPaid: boolean
): { maxHistory: number; maxOutputTokens: number } {
  if (surface === 'landing') {
    return {
      maxHistory: CHATBOT_LIMITS.landing.maxHistory,
      maxOutputTokens: CHATBOT_LIMITS.landing.maxOutputTokens,
    };
  }
  if (isPaid) {
    return {
      maxHistory: CHATBOT_LIMITS.paid.maxHistory,
      maxOutputTokens: CHATBOT_LIMITS.paid.maxOutputTokens,
    };
  }
  return {
    maxHistory: CHATBOT_LIMITS.free.maxHistory,
    maxOutputTokens: CHATBOT_LIMITS.free.maxOutputTokens,
  };
}
