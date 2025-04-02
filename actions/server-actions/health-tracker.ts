'use server';
import { prisma } from '@/lib/client';
import { bloodPressureSchema } from '@/lib/zod-validation';
import { PostureType, ArmType } from '@prisma/client';
import { getUserId } from './user';
import { enumConvertor } from '@/lib/utils';

export const addBloodPressure = async (values: unknown) => {
  try {
    const id = await getUserId();
    const parsedData = bloodPressureSchema.safeParse(values);
    if (!parsedData.success) {
      console.error(parsedData.error.flatten());
      return { success: false, message: 'Invalid input data' };
    }

    const {
      loggedAt,
      symptoms,
      systolic,
      diastolic,
      device,
      pulse,
      posture,
      arm,
      notes,
    } = parsedData.data;

    const armEnum = enumConvertor(ArmType, arm);
    const postureEnum = enumConvertor(PostureType, posture);

    const bloodPressure = await prisma.bloodPressureLog.create({
      data: {
        userId: id,
        loggedAt,
        systolic,
        diastolic,
        pulse,
        posture: postureEnum,
        arm: armEnum,
        device,
        symptoms,
        notes,
      },
    });
    return {
      success: true,
      message: 'Successfully recorded new blood pressure',
      data: bloodPressure,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong' };
  }
};
