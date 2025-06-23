import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { combinedTherapyModulesPrompt } from '@/lib/prompts';
import { ModulesSchema } from '@/lib/ai-object-schema';

export async function POST() {
  try {
    const userId = await getUserId();

    const journals = await prisma.journal.findMany({
      where: { userId },
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
Below are recent journal entries from the user. Use these to tailor the modules. ${formattedJournals} 

${combinedTherapyModulesPrompt}`.trim();
    }

    const { object } = await generateObject({
      model: openai('gpt-4.1-mini'),
      schema: ModulesSchema,
      prompt: finalPrompt,
    });
    const modulesArray = object.modules;

    const operations = modulesArray.map((module) =>
      prisma.therapyModule.create({
        data: {
          userId,
          therapyType: module.therapyType,
          title: module.title,
          description: module.description,
          audience: module.audience,
          difficulty: module.difficulty,
          estimatedTime: module.estimatedTime,
          overview: module.overview,
          safetyDisclaimer: module.safetyDisclaimer,
          color: module.color,
          icon: module.icon,
          steps: {
            create: module.steps,
          },

          completion: {
            create: module.completion,
          },
        },
      })
    );
    const result = await prisma.$transaction(operations);
    return NextResponse.json({ success: true, data: result }, { status: 200 });
  } catch (error) {
    console.error('Error modules:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
