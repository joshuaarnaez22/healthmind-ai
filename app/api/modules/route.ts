import { NextResponse } from 'next/server';
import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';

export async function GET() {
  try {
    const userId = await getUserId();

    const modules = await prisma.therapyModule.findMany({
      where: { userId },
      include: {
        steps: true,
        completion: true,
      },
    });

    return NextResponse.json(
      { data: modules },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error modules:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
