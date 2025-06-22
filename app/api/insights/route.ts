import { NextResponse, NextRequest } from 'next/server';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getUserId } from '@/actions/server-actions/user';
import redis from '@/lib/upstash';
import { prisma } from '@/lib/client';
import {
  affirmationsSchema,
  analysisSchema,
  articlesSchema,
  exercisesSchema,
  moodSummarySchema,
} from '@/lib/ai-object-schema';
import { SchemaName } from '@/lib/types';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const user_id = await getUserId();
    const { prompt, cachedKey, schema } = (await request.json()) as {
      prompt: string;
      cachedKey: string;
      schema: SchemaName;
    };

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
    const schemaMap: Record<SchemaName, z.ZodTypeAny> = {
      analysis: analysisSchema,
      affirmations: affirmationsSchema,
      articles: articlesSchema,
      exercises: exercisesSchema,
      summary: moodSummarySchema,
    };
    const selectedSchema = schemaMap[schema];

    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      schema: selectedSchema,
      prompt: `${prompt}\n\nUser's recent journal entries:\n${JSON.stringify(
        journals,
        null,
        2
      )}`,
    });

    await redis.setex(cachedKey, 86400, object);
    return NextResponse.json({ data: object }, { status: 200 });
  } catch (error) {
    console.error('Error uploading  files:', error);
    console.error('Error uploading files:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }
}
