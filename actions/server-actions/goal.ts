'use server';

import { goalFormSchema } from '@/lib/zod-validation';
import { getUserId } from './user';
import { enumConvertor } from '@/lib/utils';
import { CheckIn, Emotion, Frequency, GoalDuration } from '@prisma/client';
import { prisma } from '@/lib/client';

export const newGoal = async (values: unknown) => {
  try {
    const id = await getUserId();
    const parsedData = goalFormSchema.safeParse(values);
    if (!parsedData.success) {
      console.error(parsedData.error.flatten());
      return { success: false, message: 'Invalid input data' };
    }
    const { emotion, frequency, duration } = parsedData.data;

    const emotionEnum = enumConvertor(Emotion, emotion);
    const frequencyEnum = enumConvertor(Frequency, frequency);
    const durationEnum = enumConvertor(GoalDuration, duration);

    if (!emotionEnum || !frequencyEnum || !durationEnum) {
      return { success: false, message: 'Invalid enum values' };
    }
    const goal = await prisma.goal.create({
      data: {
        userId: id,
        ...parsedData.data,
        emotion: emotionEnum,
        frequency: frequencyEnum,
        duration: durationEnum,
      },
      include: {
        checkIns: true,
      },
    });

    return {
      success: true,
      message: 'Successfully added new goal',
      data: goal,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong' };
  }
};

export const saveCheckIn = async (
  values: Omit<CheckIn, 'id' | 'completedAt'> & { isCompleted: boolean }
) => {
  try {
    const { actualEmotion, isCompleted, ...rest } = values;
    const emotionEnum = enumConvertor(Emotion, actualEmotion);

    if (!emotionEnum) {
      return { success: false, message: 'Invalid enum values' };
    }
    const [checkIn, updatedGoal] = await prisma.$transaction([
      prisma.checkIn.create({
        data: {
          ...rest,
          actualEmotion: emotionEnum,
        },
      }),
      prisma.goal.update({
        where: { id: values.goalId },
        data: {
          isCompleted,
          completedCount: { increment: 1 },
        },
      }),
    ]);

    return {
      success: true,
      message: 'Successfully checked in',
      data: {
        checkedIn: {
          ...checkIn,
        },
        goalId: values.goalId,
        isCompleted: updatedGoal.isCompleted,
      },
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong' };
  }
};

export const updateGoal = async (goalId: string, values: unknown) => {
  try {
    const id = await getUserId();
    const parsedData = goalFormSchema.safeParse(values);

    if (!parsedData.success) {
      console.error(parsedData.error.flatten());
      return { success: false, message: 'Invalid input data' };
    }

    const { emotion, frequency, duration } = parsedData.data;

    const emotionEnum = enumConvertor(Emotion, emotion);
    const frequencyEnum = enumConvertor(Frequency, frequency);
    const durationEnum = enumConvertor(GoalDuration, duration);

    if (!emotionEnum || !frequencyEnum || !durationEnum) {
      return { success: false, message: 'Invalid enum values' };
    }

    const updatedGoal = await prisma.goal.update({
      where: {
        id: goalId,
        userId: id,
      },
      data: {
        ...parsedData.data,
        emotion: emotionEnum,
        frequency: frequencyEnum,
        duration: durationEnum,
      },
      include: {
        checkIns: true,
      },
    });

    return {
      success: true,
      message: 'Goal updated successfully',
      data: updatedGoal,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: 'Something went wrong while updating the goal',
    };
  }
};
