import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import {
  endTherapyUsage,
  startTherapyUsage,
} from '@/lib/ai-therapy-usage';
import { estimateMinutesFromTokens } from '@/lib/stripe-catalog';

export const dynamic = 'force-dynamic';

/** Start a usage ledger row when a voice session connects. */
export async function POST(req: Request) {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as { action?: string; usageId?: string; secondsAlive?: number; endReason?: string };

    if (body.action === 'end') {
      if (!body.usageId) {
        return NextResponse.json({ error: 'usageId required' }, { status: 400 });
      }
      const ended = await endTherapyUsage({
        usageId: body.usageId,
        userId,
        durationSeconds: Math.max(0, Math.floor(body.secondsAlive ?? 0)),
        endReason: body.endReason ?? 'user',
      });
      return NextResponse.json({ usage: ended }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true, aiTokenBalance: true },
    });
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isPaid = user.subscriptionTier === 'SUBSCRIBED';
    const openingBalance = isPaid ? user.aiTokenBalance : 0;

    const usage = await startTherapyUsage({
      userId,
      tier: user.subscriptionTier,
      openingBalance,
    });

    return NextResponse.json(
      {
        usageId: usage.id,
        tier: user.subscriptionTier,
        tokenBalance: isPaid ? user.aiTokenBalance : null,
        openingBalance,
        estimatedMinutesLeft: isPaid
          ? estimateMinutesFromTokens(user.aiTokenBalance)
          : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error ai-therapy/usage:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
