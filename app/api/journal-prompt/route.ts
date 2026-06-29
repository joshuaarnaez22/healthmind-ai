import { NextRequest, NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { deepseek } from '@/lib/ai';
import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const promptSchema = z.object({ prompt: z.string() });

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserId();
    const { mood } = (await request.json()) as { mood?: string };

    const recentMoods = await prisma.journal.findMany({
      where: { userId },
      select: { mood: true, addedAt: true },
      orderBy: { addedAt: 'desc' },
      take: 5,
    });

    const moodContext = mood ? `The user is currently feeling: ${mood}.` : '';
    const historyContext =
      recentMoods.length > 0
        ? `Their recent mood history: ${recentMoods.map((j) => j.mood).join(', ')}.`
        : '';

    const { object } = await generateObject({
      model: deepseek(),
      schema: promptSchema,
      prompt: `You are a compassionate journaling coach. ${moodContext} ${historyContext}

Generate a single, open-ended reflective journal prompt that encourages emotional exploration and self-awareness. The prompt should feel personal, warm, and non-clinical. It should be 1-2 sentences maximum. Do not give instructions — write the prompt itself as if speaking directly to the user.`,
    });

    return NextResponse.json({ prompt: object.prompt });
  } catch (error) {
    console.error('journal-prompt error:', error);
    return NextResponse.json({ error: 'Failed to generate prompt' }, { status: 500 });
  }
}
