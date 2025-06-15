import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');

    if (!goalId) {
      return NextResponse.json({ error: 'Missing goalId' }, { status: 400 });
    }
    const userId = await getUserId();
    const goal = await prisma.goal.findFirst({
      where: {
        userId,
        id: goalId,
      },
      include: {
        checkIns: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ goal }, { status: 200 });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
