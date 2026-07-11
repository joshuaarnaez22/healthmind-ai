import { NextRequest, NextResponse } from 'next/server';
import { streamText, type CoreMessage } from 'ai';
import { auth } from '@clerk/nextjs/server';
import { deepseek } from '@/lib/ai';
import { prisma } from '@/lib/client';
import {
  CHATBOT_LIMITS,
  getSystemPrompt,
  type ChatSurface,
} from '@/lib/chatbot-prompt';
import {
  checkAndIncrementFreeDaily,
  checkAppRateLimit,
  checkLandingRateLimit,
  limitsForSurface,
} from '@/lib/chatbot-limits';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

type ChatBody = {
  messages?: { role: string; content: string }[];
  surface?: ChatSurface;
};

function clientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown';
  return req.headers.get('x-real-ip') || 'unknown';
}

function trimHistory(
  messages: { role: string; content: string }[],
  maxTurns: number
): CoreMessage[] {
  const filtered = messages
    .filter(
      (m) =>
        (m.role === 'user' || m.role === 'assistant') &&
        typeof m.content === 'string' &&
        m.content.trim().length > 0
    )
    .slice(-maxTurns);

  return filtered.map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content.slice(0, 4000),
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChatBody;
    const surface: ChatSurface =
      body.surface === 'app' ? 'app' : 'landing';
    const rawMessages = Array.isArray(body.messages) ? body.messages : [];

    if (rawMessages.length === 0) {
      return NextResponse.json(
        { error: 'messages required' },
        { status: 400 }
      );
    }

    let isPaid = false;
    let dbUserId: string | null = null;

    if (surface === 'landing') {
      const limit = await checkLandingRateLimit(clientIp(request));
      if (!limit.ok) {
        return NextResponse.json(
          {
            error: limit.message,
            code: limit.code,
            remaining: limit.remaining ?? 0,
          },
          { status: limit.status }
        );
      }
    } else {
      const { userId: clerkId } = await auth();
      if (!clerkId) {
        return NextResponse.json(
          { error: 'Sign in required', code: 'auth_required' },
          { status: 401 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { clerkUserId: clerkId },
        select: {
          id: true,
          subscriptionTier: true,
          aiTokenBalance: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { error: 'User not found', code: 'auth_required' },
          { status: 401 }
        );
      }

      dbUserId = user.id;
      isPaid =
        user.subscriptionTier === 'SUBSCRIBED' && user.aiTokenBalance > 0;

      const rate = await checkAppRateLimit(user.id, isPaid);
      if (!rate.ok) {
        return NextResponse.json(
          {
            error: rate.message,
            code: rate.code,
            remaining: rate.remaining ?? 0,
          },
          { status: rate.status }
        );
      }

      if (isPaid) {
        // balance already > 0; debit after stream starts via onFinish
      } else if (user.subscriptionTier === 'SUBSCRIBED') {
        return NextResponse.json(
          {
            error:
              'Your token balance is empty. Top up to continue chatting.',
            code: 'token_budget',
            remaining: 0,
          },
          { status: 402 }
        );
      } else {
        const quota = await checkAndIncrementFreeDaily(user.id);
        if (!quota.ok) {
          return NextResponse.json(
            {
              error: quota.message,
              code: quota.code,
              remaining: 0,
            },
            { status: quota.status }
          );
        }
      }
    }

    const { maxHistory, maxOutputTokens } = limitsForSurface(
      surface,
      isPaid
    );
    const messages = trimHistory(rawMessages, maxHistory);

    const result = streamText({
      model: deepseek(),
      system: getSystemPrompt(surface),
      messages,
      maxTokens: maxOutputTokens,
      async onFinish() {
        if (surface === 'app' && isPaid && dbUserId) {
          const debit = CHATBOT_LIMITS.paid.tokensPerReply;
          const current = await prisma.user.findUnique({
            where: { id: dbUserId },
            select: { aiTokenBalance: true },
          });
          if (!current) return;
          const next = Math.max(0, current.aiTokenBalance - debit);
          await prisma.user.update({
            where: { id: dbUserId },
            data: { aiTokenBalance: next },
          });
        }
      },
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('chat error:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    );
  }
}
