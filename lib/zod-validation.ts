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

export type JournalEntryFormValues = z.infer<typeof journalEntrySchema>;
