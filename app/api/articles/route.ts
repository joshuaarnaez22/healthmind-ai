import { NextResponse, NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { deepseek } from '@/lib/ai';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';
import { prisma } from '@/lib/client';
import { articlesSchema } from '@/lib/ai-object-schema';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserId();
    const { prompt, cachedKey } = await request.json();

    const cached = await redis.get(cachedKey);
    if (cached) {
      return NextResponse.json({ data: cached }, { status: 200 });
    }

    const journals = await prisma.journal.findMany({
      where: { userId: user_id },
      select: { content: true, mood: true, addedAt: true, title: true },
      orderBy: { addedAt: 'desc' },
      take: 7,
    });

    if (!journals || journals.length === 0) {
      return NextResponse.json(
        { data: null, message: 'No journals found' },
        { status: 200 }
      );
    }

    const { object } = await generateObject({
      model: deepseek(),
      schema: articlesSchema,
      prompt: `${prompt}\n\nUser data: ${JSON.stringify(journals)}`,
    });

    await redis.setex(cachedKey, 86400, object);
    return NextResponse.json({ data: object }, { status: 200 });
  } catch (error) {
    console.error('Error articles:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
