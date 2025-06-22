import { NextResponse, NextRequest } from 'next/server';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';
import { prisma } from '@/lib/client';
import { openai } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserId();
    const { prompt, cachedKey } = await request.json();
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
        addedAt: true,
        title: true,
      },
      orderBy: {
        addedAt: 'desc',
      },
      take: 7,
    });

    if (!journals || journals.length === 0) {
      return NextResponse.json(
        { data: null, message: 'No journals found' },
        {
          status: 200,
        }
      );
    }
    const response = await openai.responses.create({
      model: 'gpt-4.1-mini',
      tools: [{ type: 'web_search_preview' }],
      input: `System instructions: ${prompt}\n\nUser data: ${JSON.stringify(journals)}`,
    });

    const cleanObject = JSON.parse(response.output_text);
    await redis.setex(cachedKey, 86400, cleanObject);

    return NextResponse.json(
      { data: cleanObject },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error articles:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
