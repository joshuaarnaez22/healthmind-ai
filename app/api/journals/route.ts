import { NextResponse } from 'next/server';
import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';

export async function GET() {
  try {
    const user_id = await getUserId();

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
      take: 7,
    });

    return NextResponse.json(
      { journals },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error uploading  files:', error);
    console.error('Error uploading files:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
