'use server';

import { prisma } from '@/lib/client';
import { journalEntrySchema } from '@/lib/zod-validation';
import { Mood } from '@prisma/client';
import { getUserId } from './user';

export const createJournal = async (values: unknown) => {
  try {
    const id = await getUserId();
    const parsedData = journalEntrySchema.safeParse(values);
    if (!parsedData.success) {
      console.error(parsedData.error.flatten());
      return { success: false, message: 'Invalid input data' };
    }

    const { title, mood, content } = parsedData.data;
    const moodEnum = mood.toUpperCase() as keyof typeof Mood;

    if (!Mood[moodEnum]) {
      return { success: false, message: 'Invalid mood value' };
    }

    const journal = await prisma.journal.create({
      data: { title, mood: Mood[moodEnum], content, userId: id },
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
