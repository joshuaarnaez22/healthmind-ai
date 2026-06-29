'use server';

import { prisma } from '@/lib/client';
import { journalEntrySchema } from '@/lib/zod-validation';
import { Mood } from '@prisma/client';
import { getUserId } from './user';
import { enumConvertor } from '@/lib/utils';

export const updateJournal = async (
  id: string,
  values: unknown,
  date: Date | undefined
) => {
  try {
    if (!date || isNaN(date.getTime())) {
      return { success: false, message: 'Invalid date' };
    }
    const userId = await getUserId();
    const parsedData = journalEntrySchema.safeParse(values);
    if (!parsedData.success) {
      return { success: false, message: 'Invalid input data' };
    }
    const { title, mood, content } = parsedData.data;
    const moodEnum = enumConvertor(Mood, mood);
    if (!moodEnum) return { success: false, message: 'Invalid mood value' };

    const journal = await prisma.journal.update({
      where: { id, userId },
      data: { title, mood: moodEnum, content, addedAt: date },
    });
    return { success: true, data: journal };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Something went wrong' };
  }
};

export const deleteJournal = async (id: string) => {
  try {
    const userId = await getUserId();
    await prisma.journal.delete({ where: { id, userId } });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Something went wrong' };
  }
};

export const trackMoodEntry = async (
  mood: string,
  notes: string,
  date: Date
) => {
  try {
    if (!date || isNaN(date.getTime())) {
      return { success: false, message: 'Invalid date' };
    }
    const id = await getUserId();
    const moodEnum = enumConvertor(Mood, mood);
    if (!moodEnum) {
      return { success: false, message: 'Invalid mood value' };
    }

    const journal = await prisma.journal.create({
      data: {
        title: `Mood: ${mood.charAt(0) + mood.slice(1).toLowerCase()}`,
        mood: moodEnum,
        content: notes || '',
        userId: id,
        addedAt: date,
      },
    });

    return {
      success: true,
      message: 'Mood entry saved',
      data: journal,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: 'Something went wrong' };
  }
};

export const createJournal = async (
  values: unknown,
  date: Date | undefined
) => {
  try {
    if (!date || isNaN(date.getTime())) {
      return { success: false, message: 'Invalid date' };
    }
    const id = await getUserId();
    const parsedData = journalEntrySchema.safeParse(values);
    if (!parsedData.success) {
      console.error(parsedData.error.flatten());
      return { success: false, message: 'Invalid input data' };
    }

    const { title, mood, content } = parsedData.data;
    const moodEnum = enumConvertor(Mood, mood);

    if (!moodEnum) {
      return { success: false, message: 'Invalid mood value' };
    }
    const journal = await prisma.journal.create({
      data: {
        title,
        mood: moodEnum,
        content,
        userId: id,
        addedAt: date,
      },
    });
    return {
      success: true,
      message: 'Successfully added new journal',
      data: journal,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong' };
  }
};
