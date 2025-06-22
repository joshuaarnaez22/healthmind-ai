'use client';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  systemPrompt_affirmations,
  systemPrompt_articles,
  systemPrompt_exercises,
  systemPrompt_mental_summary,
  systemPrompt_observations,
} from '@/lib/prompts';
import { useUser } from '@clerk/nextjs';
import { ONE_DAY_IN_MS } from '@/lib/constant';
export function useSequentialInsights() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;

  // Group 1: Observations & Mental Summary
  const observationQuery = useQuery({
    queryKey: ['insights', 'observations', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemPrompt_observations,
          cachedKey: `insights-observations:${userId}`,
          schema: 'analysis',
        }),
      });
      if (!response.ok) throw new Error('Observations request failed');
      const { data } = await response.json();
      return data.analysis;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: !!userId && isUserLoaded,
  });

  const mentalSummaryQuery = useQuery({
    queryKey: ['insights', 'mental-summary', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemPrompt_mental_summary,
          cachedKey: `insights-mental-summary:${userId}`,
          schema: 'summary',
        }),
      });
      if (!response.ok) throw new Error('Mental summary request failed');
      const { data } = await response.json();
      return data;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: !!userId && isUserLoaded,
  });

  const affirmationsQuery = useQuery({
    queryKey: ['insights', 'affirmations', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: systemPrompt_affirmations,
          cachedKey: `insights-affirmations:${userId}`,
          schema: 'affirmations',
        }),
      });
      if (!response.ok) throw new Error('Affirmations request failed');
      const { data } = await response.json();
      return data.affirmations;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: !!userId && isUserLoaded,
  });

  /// Group 2: Exercises, Articles, Affirmations (dependent on observations)
  const enabled =
    !!userId &&
    isUserLoaded &&
    (!!observationQuery.data ||
      !!mentalSummaryQuery.data ||
      !!affirmationsQuery.data);
  const healthQueries = useQueries({
    queries: [
      {
        queryKey: ['insights', 'exercises', userId],
        queryFn: async () => {
          if (!userId) throw new Error('User not authenticated');
          const response = await fetch('/api/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: systemPrompt_exercises,
              cachedKey: `insights-exercises:${userId}`,
              schema: 'exercises',
            }),
          });
          if (!response.ok) throw new Error('Exercises request failed');
          const { data } = await response.json();

          return data.exercises;
        },
        staleTime: ONE_DAY_IN_MS,
        gcTime: ONE_DAY_IN_MS,
        enabled,
      },
      {
        queryKey: ['insights', 'articles', userId],
        queryFn: async () => {
          if (!userId) throw new Error('User not authenticated');
          const response = await fetch('/api/articles', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: systemPrompt_articles,
              cachedKey: `insights-articles:${userId}`,
              schema: 'articles',
            }),
          });
          if (!response.ok) throw new Error('Articles request failed');
          const { data } = await response.json();
          return data.articles;
        },
        staleTime: ONE_DAY_IN_MS,
        gcTime: ONE_DAY_IN_MS,
        enabled,
      },
    ],
  });

  const exercisesQuery = healthQueries[0];
  const articlesQuery = healthQueries[1];

  const loadingStates = {
    observations: observationQuery.isLoading,
    mental_summary:
      mentalSummaryQuery.isLoading || !mentalSummaryQuery.isFetched,
    exercises: exercisesQuery.isLoading || !exercisesQuery.isFetched,
    articles: articlesQuery.isLoading || !articlesQuery.isFetched,
    affirmations: affirmationsQuery.isLoading || !affirmationsQuery.isFetched,
  };

  return {
    data: isUserLoaded
      ? {
          observations: observationQuery.data,
          mental_summary: mentalSummaryQuery.data,
          exercises: exercisesQuery.data,
          articles: articlesQuery.data,
          affirmations: affirmationsQuery.data,
        }
      : undefined,
    loadingStates,
    isError:
      observationQuery.isError ||
      mentalSummaryQuery.isError ||
      healthQueries.some((q) => q.isError),
    errors: {
      observations: observationQuery.error,
      mental_summary: mentalSummaryQuery.error,
      exercises: exercisesQuery.error,
      articles: articlesQuery.error,
      affirmations: affirmationsQuery.error,
    },
  };
}
