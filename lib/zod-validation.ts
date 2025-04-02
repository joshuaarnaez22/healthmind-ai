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
  posture: z.enum(['SITTING', 'STANDING', 'LYING_DOWN'] as const).optional(),
  arm: z.enum(['LEFT', 'RIGHT'] as const).optional(),
  device: z.string().optional().nullable(),
  symptoms: z.array(z.string()),
  notes: z.string().optional().nullable(),
});
export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;
export type BloodPressureFormValues = z.infer<typeof bloodPressureSchema>;
