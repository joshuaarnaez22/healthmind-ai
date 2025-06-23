import { z } from 'zod';
import { validLucideIcons } from './constant';

export const affirmationsSchema = z.object({
  affirmations: z.array(z.string()),
});

export const articlesSchema = z.object({
  articles: z.array(
    z.object({
      title: z.string(),
      publication: z.string(),
      url: z.string().url(),
      benefit: z.string(),
    })
  ),
});

export const exercisesSchema = z.object({
  exercises: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      isDone: z.boolean(),
      steps: z.array(
        z.object({
          id: z.string(),
          description: z.string(),
          duration: z.number(),
          isComplete: z.boolean(),
        })
      ),
      rationale: z.string(),
    })
  ),
});
export const moodSummarySchema = z.object({
  summary: z.string(),
  moodData: z.array(
    z.object({
      name: z.string(),
      mood: z.number(), // optionally: z.number().min(1).max(10)
    })
  ),
});

export const analysisSchema = z.object({
  analysis: z.object({
    observations: z.array(
      z.object({
        title: z.string(),
        shortEvidence: z.string(),
        insight: z.string(),
        evidence: z.string(),
        date: z.string().datetime(), // or use z.coerce.date() if you want real Date
      })
    ),
  }),
});

export const stepSchema = z.object({
  order: z.number(),
  title: z.string(),
  explanation: z.string(),
  exercise: z.string(),
  reflection: z.string(),
  isDone: z.boolean().optional().default(false),
});

export const moduleSchema = z.object({
  therapyType: z.enum(['CBT', 'DBT', 'ACT']),
  title: z.string(),
  description: z.string(),
  audience: z.string(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedTime: z.string(),
  overview: z.array(z.string()),
  steps: z.array(stepSchema).min(1).max(5),
  completion: z.object({
    recap: z.string(),
    praise: z.string(),
    nextSuggestion: z.string(),
  }),
  safetyDisclaimer: z.string(),
  color: z.string(),
  icon: z.enum(validLucideIcons),
  isDone: z.boolean().optional().default(false),
});

// ✅ Wrap the array in a named object
export const ModulesSchema = z.object({
  modules: z.array(moduleSchema),
});
