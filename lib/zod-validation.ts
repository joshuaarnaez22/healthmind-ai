import {
  ArmType,
  Emotion,
  Frequency,
  GoalDuration,
  MealType,
  MeasurementType,
  PostureType,
} from '@prisma/client';
import * as z from 'zod';

export const journalEntrySchema = z.object({
  title: z
    .string()
    .min(3, { message: 'Title must be at least 3 characters long' })
    .max(100, { message: 'Title  must be less than 100 characters' }),
  mood: z.string().min(1, { message: 'Please select a mood' }),
  content: z
    .string()
    .min(10, { message: 'Journal entry must be at least 10 characters long' })
    .max(10000, { message: 'Journal entry is too long' }),
});

export const bloodPressureSchema = z.object({
  loggedAt: z.date(),
  systolic: z.coerce
    .number()
    .min(70, 'Must be at least 70')
    .max(250, 'Must be at most 250'),
  diastolic: z.coerce
    .number()
    .min(40, 'Must be at least 40')
    .max(150, 'Must be at most 150'),
  pulse: z.coerce
    .number()
    .min(30, 'Must be at least 30')
    .max(200, 'Must be at most 200')
    .optional()
    .nullable(),
  posture: z.nativeEnum(PostureType).optional(),
  arm: z.nativeEnum(ArmType).optional(),
  device: z.string().optional().nullable(),
  symptoms: z.array(z.string()),
  notes: z.string().optional().nullable(),
});

export const glucoseSchema = z.object({
  loggedAt: z.date(),
  glucose: z.coerce.number().positive('Must be a positive number'),
  glucoseMgDl: z.coerce
    .number()
    .transform((val) => (val === 0 ? null : val))
    .refine((val) => val == null || val > 0, {
      message: 'Must be a positive number',
    })
    .optional(),
  measurementType: z.nativeEnum(MeasurementType),
  mealType: z.nativeEnum(MealType).optional().nullable(),
  timeSinceMeal: z.coerce.number().min(0).optional().nullable(),
  device: z.string().optional().nullable(),
  insulinDose: z.coerce.number().min(0).optional().nullable(),
  carbs: z.coerce.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const goalFormSchema = z.object({
  title: z.string().min(1, 'Goal title is required'),
  emotion: z.nativeEnum(Emotion),
  frequency: z.nativeEnum(Frequency),
  targetCount: z
    .number({ invalid_type_error: 'Target count must be a number' })
    .min(1, 'Must be at least 1'),
  duration: z.nativeEnum(GoalDuration),
  why: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;
export type BloodPressureFormValues = z.infer<typeof bloodPressureSchema>;
export type GlucoseFormValues = z.infer<typeof glucoseSchema>;
