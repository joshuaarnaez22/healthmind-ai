import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const user_id = await getUserId();
    const { searchParams } = new URL(request.url);
    const take = Number(searchParams.get('take')) ?? 7;

    const journals = await prisma.journal.findMany({
      where: {
        userId: user_id,
      },
      select: {
        content: true,
        mood: true,
        addedAt: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
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
