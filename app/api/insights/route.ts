import { NextRequest, NextResponse } from 'next/server';
import { generateText } from 'ai';
import { systemPrompt_insights } from '@/lib/prompts';
import { deepseek } from '@ai-sdk/deepseek';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserId();
    const cachedKey = `insights:${user_id}`;
    const cached = await redis.get(cachedKey);
    if (cached) {
      return NextResponse.json({ status: 200 });
    }
    const { contents } = await request.json();

    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json(
        { error: 'No contents provided' },
        { status: 400 }
      );
    }
    const formattedContents = contents
      .map((text: string) => text.replace(/\n{2,}/g, '\n').trim())
      .join('\n\n');
    const { text: rawResponse } = await generateText({
      model: deepseek('deepseek-chat'),
      messages: [
        {
          role: 'system',
          content: systemPrompt_insights,
        },
        {
          role: 'user',
          content: formattedContents,
        },
      ],
    });

    await redis.setex(cachedKey, 86400, JSON.stringify(rawResponse));
    console.log(rawResponse);

    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    console.error('Error uploading  files:', error);
    console.error('Error uploading files:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
