import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { deepseek } from '@/lib/ai';
import { getUserId } from '@/actions/server-actions/user';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const enhancedSchema = z.object({ enhanced: z.string() });

export async function POST(request: NextRequest) {
  try {
    await getUserId();
    const { content } = (await request.json()) as { content: string };

    const plain = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const { object } = await generateObject({
      model: deepseek(),
      schema: enhancedSchema,
      prompt: `You are a thoughtful journaling assistant. The user has written a rough journal entry. Your job is to:
1. Preserve their exact voice, perspective, and meaning — do not add events or feelings they didn't express
2. Improve clarity, flow, and emotional depth
3. Fix grammar and spelling
4. Return the result as valid HTML (using <p>, <strong>, <em>, <ul>, <li> tags only — no headings)

Original entry:
${plain}`,
    });

    return NextResponse.json({ enhanced: object.enhanced });
  } catch (error) {
    console.error('journal-enhance error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance entry' },
      { status: 500 }
    );
  }
}
