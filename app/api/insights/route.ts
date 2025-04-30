import { NextResponse, NextRequest } from 'next/server';
import { generateText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';
import { prisma } from '@/lib/client';

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
    const { text: rawResponse } = await generateText({
      model: deepseek('deepseek-chat'),
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: JSON.stringify(journals),
        },
      ],
    });
    const cleanJsonString = rawResponse.replace(/^```json\n|\n```$/g, '');
    await redis.setex(cachedKey, 86400, JSON.parse(cleanJsonString));

    return NextResponse.json(
      { data: JSON.parse(cleanJsonString) },
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
