import { NextResponse, NextRequest } from 'next/server';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';

export async function POST(request: NextRequest) {
  try {
    await getUserId();
    const { prompt, cachedKey } = await request.json();
    const cached = await redis.get(cachedKey);
    if (cached) {
      return NextResponse.json({ data: cached }, { status: 200 });
    }

    const { text: rawResponse } = await generateText({
      model: openai('gpt-4.1-mini'),
      messages: [
        {
          role: 'system',
          content: prompt,
        },
      ],
    });
    const cleanJsonString = rawResponse.replace(/^```json\n|\n```$/g, '');
    const parsed = JSON.parse(cleanJsonString);
    await redis.setex(cachedKey, 86400, parsed);

    return NextResponse.json(
      { data: parsed },
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
