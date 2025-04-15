'use server';
import { prisma } from '@/lib/client';
import { bloodPressureSchema, glucoseSchema } from '@/lib/zod-validation';
import {
  PostureType,
  ArmType,
  MeasurementType,
  MealType,
} from '@prisma/client';
import { getUserId } from './user';
import { decimalToString, enumConvertor } from '@/lib/utils';

export const addBloodPressure = async (values: unknown) => {
  try {
    const id = await getUserId();
    const parsedData = bloodPressureSchema.safeParse(values);
    if (!parsedData.success) {
      console.error(parsedData.error.flatten());
      return { success: false, message: 'Invalid input data' };
    }

    const { posture, arm } = parsedData.data;

    const armEnum = enumConvertor(ArmType, arm);
    const postureEnum = enumConvertor(PostureType, posture);

    const bloodPressureLog = await prisma.bloodPressureLog.create({
      data: {
        userId: id,
        posture: postureEnum,
        arm: armEnum,
        ...parsedData.data,
      },
    });
    return {
      success: true,
      message: 'Successfully recorded new blood pressure',
      data: bloodPressureLog,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong' };
  }
};

export const addGlucose = async (values: unknown) => {
  try {
    const id = await getUserId();
    const parsedData = glucoseSchema.safeParse(values);
    if (!parsedData.success) {
      console.error(parsedData.error.flatten());
      return { success: false, message: 'Invalid input data' };
    }

    const { measurementType, mealType } = parsedData.data;

    const measurementEnum = enumConvertor(MeasurementType, measurementType);

    let mealEnum;
    if (mealType) {
      mealEnum = enumConvertor(MealType, mealType);
    }

    const glucoseLog = await prisma.glucoseLog.create({
      data: {
        ...parsedData.data,
        userId: id,
        measurementType: measurementEnum!,
        mealType: mealEnum,
      },
    });

    return {
      success: true,
      message: 'Successfully recorded new blood pressure',
      data: {
        ...glucoseLog,
        glucose: decimalToString(glucoseLog.glucose),
        glucoseMgDl: glucoseLog.glucoseMgDl
          ? decimalToString(glucoseLog.glucoseMgDl)
          : null,
        insulinDose: glucoseLog.insulinDose
          ? decimalToString(glucoseLog.insulinDose)
          : null,
      },
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: 'Something went wrong' };
  }
};
