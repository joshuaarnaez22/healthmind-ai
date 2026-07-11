import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { checkTherapyGrantRate } from '@/lib/ai-therapy-limits';

export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    if (isPaid && user.aiTokenBalance <= 0) {
      return NextResponse.json(
        {
          error:
            'Your token balance is empty. Top up to continue voice sessions.',
          code: 'token_budget',
        },
        { status: 402 }
      );
    }

    const rate = await checkTherapyGrantRate(userId, isPaid);
    if (!rate.ok) {
      return NextResponse.json(
        {
          error: isPaid
            ? 'Too many session starts. Please wait a bit and try again.'
            : 'You’ve reached the free session start limit for now. Upgrade for higher limits.',
          code: 'rate_limited',
        },
        { status: 429 }
      );
    }

    const apiKey = process.env.DEEPGRAM_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Deepgram is not configured' },
        { status: 500 }
      );
    }

    const grantRes = await fetch('https://api.deepgram.com/v1/auth/grant', {
      method: 'POST',
      headers: {
        Authorization: `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ttl_seconds: 60 }),
    });

    if (!grantRes.ok) {
      let deepgramMessage = '';
      try {
        const errBody = (await grantRes.json()) as {
          err_msg?: string;
          message?: string;
        };
        deepgramMessage = errBody.err_msg || errBody.message || '';
      } catch {
        /* ignore non-JSON error bodies */
      }

      console.error(
        'Deepgram grant failed:',
        grantRes.status,
        deepgramMessage || '(no message)'
      );

      const isForbidden = grantRes.status === 403;
      return NextResponse.json(
        {
          error: isForbidden
            ? 'Deepgram API key lacks permission to mint tokens. Create a key with Member (or higher) role in the Deepgram Console (API Keys → Create → Advanced → Member).'
            : 'Failed to create Deepgram token',
          code: isForbidden ? 'deepgram_forbidden' : 'deepgram_grant_failed',
        },
        { status: 500 }
      );
    }

    const data = (await grantRes.json()) as {
      access_token: string;
      expires_in: number;
    };

    return NextResponse.json(
      {
        access_token: data.access_token,
        expires_in: data.expires_in,
        tier: user.subscriptionTier,
        tokenBalance: isPaid ? user.aiTokenBalance : null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deepgram-token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
