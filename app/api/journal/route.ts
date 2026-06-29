import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    if (!request.url) {
      return NextResponse.json(
        { error: 'Invalid request URL' },
        { status: 400 }
      );
    }

    const user_id = await getUserId();
    const { searchParams } = new URL(request.url);
    const startParam = searchParams.get('start');
    const endParam = searchParams.get('end');

    if (!startParam || !endParam) {
      return NextResponse.json(
        { error: 'start and end parameters are required' },
        { status: 400 }
      );
    }

    const start = new Date(startParam);
    const end = new Date(endParam);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    // Match any entry within the day range. The boundaries are computed in the
    // user's local timezone on the client, so day-bucketing stays tz-correct.
    const journals = await prisma.journal.findMany({
      where: {
        userId: user_id,
        addedAt: { gte: start, lt: end },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ journals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching journals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
