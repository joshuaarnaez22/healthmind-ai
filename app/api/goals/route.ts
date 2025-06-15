import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getUserId();
    const goals = await prisma.goal.findMany({
      where: {
        userId,
      },
      include: {
        checkIns: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ goals }, { status: 200 });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
