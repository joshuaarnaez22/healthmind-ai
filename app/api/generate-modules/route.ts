import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { z } from 'zod';
import { deepseek } from '@/lib/ai';
import { getUserId } from '@/actions/server-actions/user';
import { prisma } from '@/lib/client';
import { stepSchema } from '@/lib/ai-object-schema';
import { validLucideIcons } from '@/lib/constant';

const THERAPY_TYPES = ['CBT', 'DBT', 'ACT'] as const;

// Per-type schema: 2 modules, icon coerced to valid value on mismatch
const perTypeSchema = z.object({
  modules: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      audience: z.string(),
      difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
      estimatedTime: z.string(),
      overview: z.array(z.string()).max(4),
      steps: z.array(stepSchema).min(2).max(3),
      completion: z.object({
        recap: z.string(),
        praise: z.string(),
        nextSuggestion: z.string(),
      }),
      safetyDisclaimer: z.string(),
      color: z.string(),
      icon: z.string().transform((v) =>
        (validLucideIcons as readonly string[]).includes(v) ? v : 'brain'
      ),
    })
  ).min(1).max(2),
});

function buildPrompt(type: string, journalContext: string) {
  return `Generate exactly 2 therapy modules for the ${type} therapy type.
${journalContext ? `User journal context:\n${journalContext}\n\n` : ''}
Each module must have:
- A clear title and short description
- 2-3 concise steps (keep each field under 200 chars)
- A completion summary
- icon: choose ONLY from this exact list: ${validLucideIcons.join(', ')}
- color: one of "blue", "purple", "green", "orange"
- difficulty: "beginner", "intermediate", or "advanced"

Be concise. Avoid long paragraphs.`;
}

export async function POST() {
  try {
    const userId = await getUserId();

    const journals = await prisma.journal.findMany({
      where: { userId },
      select: { title: true, mood: true, addedAt: true },
      orderBy: { addedAt: 'desc' },
      take: 5,
    });

    const journalContext = journals.length > 0
      ? journals.map((j) => `${j.mood} — ${j.title}`).join('\n')
      : '';

    // 3 parallel calls, one per therapy type
    const results = await Promise.all(
      THERAPY_TYPES.map((type) =>
        generateObject({
          model: deepseek(),
          schema: perTypeSchema,
          prompt: buildPrompt(type, journalContext),
        }).then(({ object }) =>
          object.modules.map((m) => ({ ...m, therapyType: type }))
        )
      )
    );

    const modulesArray = results.flat();

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
          steps: { create: module.steps },
          completion: { create: module.completion },
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
