import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import {
  THERAPY_FREE_CAP_SECONDS,
  tokensForElapsedSeconds,
} from '@/lib/ai-therapy-limits';
import {
  estimateMinutesFromTokens,
  shouldWarnBudget,
} from '@/lib/stripe-catalog';
import { touchTherapyUsage } from '@/lib/ai-therapy-usage';

export const dynamic = 'force-dynamic';

/**
 * Client posts cumulative secondsAlive for the active session.
 * Free: hard stop at 5 minutes.
 * Paid: debit token-equivalent for newly completed minutes + update usage ledger.
 */
export async function POST(req: Request) {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as {
      secondsAlive?: number;
      lastBilledSeconds?: number;
      usageId?: string;
    };

    const secondsAlive = Math.max(0, Math.floor(body.secondsAlive ?? 0));
    const lastBilledSeconds = Math.max(
      0,
      Math.floor(body.lastBilledSeconds ?? 0)
    );
    const usageId = body.usageId?.trim() || null;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        aiTokenBalance: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isPaid = user.subscriptionTier === 'SUBSCRIBED';

    if (!isPaid) {
      if (usageId) {
        await touchTherapyUsage({
          usageId,
          userId,
          durationSeconds: secondsAlive,
          tokensDebited: 0,
        });
      }

      if (secondsAlive >= THERAPY_FREE_CAP_SECONDS) {
        return NextResponse.json({
          shouldEnd: true,
          reason: 'free_cap' as const,
          tier: 'FREE' as const,
          tokenBalance: null,
          billedSeconds: secondsAlive,
          warnBudget: false,
          estimatedMinutesLeft: null,
        });
      }
      return NextResponse.json({
        shouldEnd: false,
        reason: null,
        tier: 'FREE' as const,
        tokenBalance: null,
        billedSeconds: lastBilledSeconds,
        freeSecondsRemaining: Math.max(
          0,
          THERAPY_FREE_CAP_SECONDS - secondsAlive
        ),
        warnBudget: false,
        estimatedMinutesLeft: null,
      });
    }

    if (user.aiTokenBalance <= 0) {
      if (usageId) {
        await touchTherapyUsage({
          usageId,
          userId,
          durationSeconds: secondsAlive,
          tokensDebited: 0,
        });
      }
      return NextResponse.json({
        shouldEnd: true,
        reason: 'token_budget' as const,
        tier: 'SUBSCRIBED' as const,
        tokenBalance: 0,
        billedSeconds: lastBilledSeconds,
        warnBudget: true,
        estimatedMinutesLeft: 0,
      });
    }

    const debit = tokensForElapsedSeconds(lastBilledSeconds, secondsAlive);
    let nextBalance = user.aiTokenBalance;
    let openingBalance = user.aiTokenBalance;

    if (debit > 0) {
      nextBalance = Math.max(0, user.aiTokenBalance - debit);
      await prisma.user.update({
        where: { id: userId },
        data: { aiTokenBalance: nextBalance },
      });
    }

    if (usageId) {
      const touched = await touchTherapyUsage({
        usageId,
        userId,
        durationSeconds: secondsAlive,
        tokensDebited: debit,
      });
      if (touched) openingBalance = touched.openingBalance;
    }

    const billedSeconds =
      debit > 0 ? Math.floor(secondsAlive / 60) * 60 : lastBilledSeconds;

    const warnBudget = shouldWarnBudget({
      openingBalance,
      tokenBalance: nextBalance,
    });

    if (nextBalance <= 0) {
      return NextResponse.json({
        shouldEnd: true,
        reason: 'token_budget' as const,
        tier: 'SUBSCRIBED' as const,
        tokenBalance: 0,
        billedSeconds,
        warnBudget: true,
        estimatedMinutesLeft: 0,
      });
    }

    return NextResponse.json({
      shouldEnd: false,
      reason: null,
      tier: 'SUBSCRIBED' as const,
      tokenBalance: nextBalance,
      billedSeconds,
      warnBudget,
      estimatedMinutesLeft: estimateMinutesFromTokens(nextBalance),
    });
  } catch (error) {
    console.error('Error ai-therapy/heartbeat:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
