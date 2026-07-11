import { NextResponse } from 'next/server';
import { getApiUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { buildAiTherapySettings } from '@/lib/ai-therapy-prompt';
import { subDays } from 'date-fns';

export async function GET() {
  try {
    const userId = await getApiUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!process.env.DEEPGRAM_API_KEY) {
      return NextResponse.json(
        { error: 'Deepgram is not configured' },
        { status: 500 }
      );
    }

    const since = subDays(new Date(), 14);
    since.setHours(0, 0, 0, 0);

    const [user, journals] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true, username: true },
      }),
      prisma.journal.findMany({
        where: {
          userId,
          addedAt: { gte: since },
        },
        select: {
          title: true,
          mood: true,
          content: true,
          addedAt: true,
        },
        orderBy: { addedAt: 'desc' },
        take: 20,
      }),
    ]);

    const userName = user?.firstName?.trim() || user?.username?.trim() || null;
    const agent = buildAiTherapySettings({ journals, userName });

    return NextResponse.json({ agent }, { status: 200 });
  } catch (error) {
    console.error('Error ai-therapy/session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
