import { NextResponse, NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';
import { prisma } from '@/lib/client';
import { articlesSchema } from '@/lib/ai-object-schema';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserId();
    const { prompt, cachedKey } = (await request.json()) as {
      prompt: string;
      cachedKey: string;
    };

    const cached = await redis.get(cachedKey);
    if (cached) {
      return NextResponse.json({ data: cached }, { status: 200 });
    }
    const journals = await prisma.journal.findMany({
      where: {
        userId: user_id,
      },
      select: {
        content: true,
        mood: true,
        title: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 7,
    });

    if (!journals || journals.length === 0) {
      return NextResponse.json(
        { data: [], message: 'No journals found' },
        {
          status: 200,
        }
      );
    }

    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: articlesSchema,
      prompt: `${prompt}\n\nUser's recent journal entries:\n${JSON.stringify(
        journals,
        null,
        2
      )}`,
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
