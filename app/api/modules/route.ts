import { NextResponse, NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';
import { prisma } from '@/lib/client';
import { combinedTherapyModulesPrompt } from '@/lib/prompts';
import { ModulesSchema } from '@/lib/ai-object-schema';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserId();
    const { cachedKey } = await request.json();
    const cached = await redis.get(cachedKey);
    if (cached) {
      return NextResponse.json({ data: cached }, { status: 200 });
    }

    const journals = await prisma.journal.findMany({
      where: { userId: user_id },
      select: { title: true, content: true, mood: true, addedAt: true },
      orderBy: { addedAt: 'desc' },
      take: 7,
    });

    let finalPrompt = combinedTherapyModulesPrompt;

    if (journals.length > 0) {
      const formattedJournals = journals
        .map(
          (j) =>
            `Title: ${j.title}\nMood: ${j.mood}\nDate: ${j.addedAt.toISOString()}\nContent: ${j.content}`
        )
        .join('\n\n---\n\n');

      finalPrompt = `
Below are recent journal entries from the user. Use these to tailor the modules.

${formattedJournals}

${combinedTherapyModulesPrompt}
      `.trim();
    }

    const { object: modules } = await generateObject({
      model: openai('gpt-4.1-mini'),
      schema: ModulesSchema,
      prompt: finalPrompt,
    });

    await redis.setex(cachedKey, 86400, modules);

    return NextResponse.json(
      { data: modules },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error modules:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
