'use server';

import { prisma } from '@/lib/client';
import { getUserId } from './user';
import { generateText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';
import { systemPrompt_insights } from '@/lib/prompts';
import redis from '@/lib/upstash';

export const generateInsights = async (take = 7) => {
  try {
    const user_id = await getUserId();
    const cachedKey = `insights:${user_id}`;

    const cached = await redis.get(cachedKey);
    if (cached) {
      return {
        success: true,
        data: cached,
      };
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
        createdAt: 'desc',
      },
      take,
    });

    if (!journals || journals.length === 0) {
      return {
        success: false,
        message: 'No journals found',
      };
    }

    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      prompt: `${systemPrompt_insights} ${JSON.stringify(journals)}`,
    });
    const cleanJsonString = text.replace(/^```json\n|\n```$/g, '');

    redis.setex(cachedKey, 86400, JSON.parse(cleanJsonString));
    return {
      success: true,
      data: JSON.parse(cleanJsonString),
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong' };
  }
};
