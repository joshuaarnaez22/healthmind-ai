import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';

export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
