import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const userId = await getUserId();
    const journals = await prisma.journal.findMany({
      where: {
        userId,
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
