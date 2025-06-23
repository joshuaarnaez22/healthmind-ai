import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();

    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('id');

    if (!moduleId) {
      return NextResponse.json({ error: 'Missing moduleId' }, { status: 400 });
    }

    const tmodule = await prisma.therapyModule.findUnique({
      where: {
        id: moduleId,
        userId,
      },
      include: {
        steps: {
          orderBy: {
            order: 'asc', // Ensure consistent step order
          },
        },
        completion: true,
      },
    });

    if (!tmodule) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 });
    }

    return NextResponse.json({ data: tmodule }, { status: 200 });
  } catch (error) {
    console.error('Error fetching module:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
