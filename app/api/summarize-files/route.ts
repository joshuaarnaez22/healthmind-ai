import { NextRequest, NextResponse } from 'next/server';
import { streamText } from 'ai';
import { systemPrompt_summary } from '@/lib/prompts';
import { deepseek } from '@ai-sdk/deepseek';
import { getUserId } from '@/actions/server-actions/user';

export const config = {
  runtime: 'edge',
};
export const maxDuration = 60;
export async function POST(request: NextRequest) {
  try {
    await getUserId();
    const { contents } = await request.json();
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
      return NextResponse.json(
        { error: 'No contents provided' },
        { status: 400 }
      );
    }
    const cleanedContents = contents
      .map((text: string) => text.replace(/\n{2,}/g, '\n').trim())
      .join('\n\n');
    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages: [
        {
          role: 'system',
          content: systemPrompt_summary,
        },
        {
          role: 'user',
          content: `Please summarize all of the following contents there are ${contents.length} number of contents and reply only related to contents:\n\n${cleanedContents}`,
        },
      ],
    });

    return result.toDataStreamResponse({
      headers: {
        'Transfer-Encoding': 'chunked',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Error uploading  files:', error);
    console.error('Error uploading files:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
