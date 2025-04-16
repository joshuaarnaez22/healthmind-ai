import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user_id = await getUserId();
    const glucoseLogs = await prisma.glucoseLog.findMany({
      where: {
        userId: user_id,
      },
    });

    return NextResponse.json({ glucoseLogs }, { status: 200 });
  } catch (error) {
    console.error('Error fetching journals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
