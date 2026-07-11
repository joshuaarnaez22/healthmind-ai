import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/client';
import { CHATBOT_LIMITS } from '@/lib/chatbot-prompt';
import { peekFreeDailyRemaining } from '@/lib/chatbot-limits';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({
        surface: 'landing',
        authenticated: false,
        remainingMessages: null,
        tokenBalance: null,
        tier: null,
      });
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
      return NextResponse.json({
        surface: 'app',
        authenticated: false,
        remainingMessages: null,
        tokenBalance: null,
        tier: null,
      });
    }

    const isPaid = user.subscriptionTier === 'SUBSCRIBED';
    const remainingMessages = isPaid
      ? null
      : await peekFreeDailyRemaining(user.id);

    return NextResponse.json({
      surface: 'app',
      authenticated: true,
      tier: user.subscriptionTier,
      remainingMessages,
      dailyLimit: isPaid ? null : CHATBOT_LIMITS.free.dailyMessages,
      tokenBalance: isPaid ? user.aiTokenBalance : null,
    });
  } catch (error) {
    console.error('chat usage error:', error);
    return NextResponse.json(
      { error: 'Failed to load usage' },
      { status: 500 }
    );
  }
}
