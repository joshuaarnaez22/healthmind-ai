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
    const dateParam = searchParams.get('date');

    if (!dateParam) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const date = new Date(dateParam);
    if (!date || isNaN(date.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      );
    }

    const queryDate = new Date(date);
    queryDate.setHours(date.getHours() + 8);

    const journals = await prisma.journal.findMany({
      where: {
        userId: user_id,
        addedAt: queryDate,
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
