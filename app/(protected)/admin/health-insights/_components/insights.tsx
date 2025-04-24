'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AllInsights from './all-insights';
import VideosInsights from './videos-insights';
import ArticlesInsights from './articles-insights';
import ExercisesInsights from './exercises-insights';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { pageAnimations } from '@/lib/motion';
import { useQueries, useQuery } from '@tanstack/react-query';
// import InsightsLoader from '@/components/loaders/insights';
import {
  systemPrompt_articles,
  systemPrompt_exercises,
  systemPrompt_mental_summary,
  systemPrompt_observations,
  systemPrompt_videos,
} from '@/lib/prompts';
import { useUser } from '@clerk/nextjs';

function useSequentialInsights() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;
  const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000;

  // Group 1: Observations
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
          userId,
        }),
      });
      if (!response.ok) throw new Error('Observations request failed');
      return response.json();
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: !!userId && isUserLoaded, // Only enable if we have a user
  });

  // Group 2: Videos & Articles
  const mediaQueries = useQueries({
    queries: [
      {
        queryKey: ['insights', 'videos', userId],
        queryFn: async () => {
          if (!userId) throw new Error('User not authenticated');

          const response = await fetch('/api/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: systemPrompt_videos,
              userId,
            }),
          });
          if (!response.ok) throw new Error('Videos request failed');
          return response.json();
        },
        staleTime: ONE_DAY_IN_MS,
        gcTime: ONE_DAY_IN_MS,
        enabled: !!userId && isUserLoaded && !!observationQuery.data,
      },
      {
        queryKey: ['insights', 'articles', userId],
        queryFn: async () => {
          if (!userId) throw new Error('User not authenticated');

          const response = await fetch('/api/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: systemPrompt_articles,
              userId,
            }),
          });
          if (!response.ok) throw new Error('Articles request failed');
          return response.json();
        },
        staleTime: ONE_DAY_IN_MS,
        gcTime: ONE_DAY_IN_MS,
        enabled: !!userId && isUserLoaded && !!observationQuery.data,
      },
    ],
  });

  // Group 3: Exercises & Mental Summary
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
              userId,
            }),
          });
          if (!response.ok) throw new Error('Exercises request failed');
          return response.json();
        },
        staleTime: ONE_DAY_IN_MS,
        gcTime: ONE_DAY_IN_MS,
        enabled:
          !!userId &&
          isUserLoaded &&
          !!mediaQueries[0].data &&
          !!mediaQueries[1].data,
      },
      {
        queryKey: ['insights', 'mental-summary', userId],
        queryFn: async () => {
          if (!userId) throw new Error('User not authenticated');

          const response = await fetch('/api/insights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: systemPrompt_mental_summary,
              userId,
            }),
          });
          if (!response.ok) throw new Error('Mental summary request failed');
          return response.json();
        },
        staleTime: ONE_DAY_IN_MS,
        gcTime: ONE_DAY_IN_MS,
        enabled:
          !!userId &&
          isUserLoaded &&
          !!mediaQueries[0].data &&
          !!mediaQueries[1].data,
      },
    ],
  });

  // Derive loading state based on enabled status
  const videosQuery = mediaQueries[0];
  const articlesQuery = mediaQueries[1];
  const exercisesQuery = healthQueries[0];
  const mentalSummaryQuery = healthQueries[1];

  const loadingStates = {
    observations: observationQuery.isLoading,
    videos: videosQuery.isLoading || !videosQuery.isFetched,
    articles: articlesQuery.isLoading || !articlesQuery.isFetched,
    exercises: exercisesQuery.isLoading || !exercisesQuery.isFetched,
    mental_summary:
      mentalSummaryQuery.isLoading || !mentalSummaryQuery.isFetched,
  };

  return {
    data: isUserLoaded
      ? {
          observations: observationQuery.data,
          videos: mediaQueries[0].data,
          articles: mediaQueries[1].data,
          exercises: healthQueries[0].data,
          mental_summary: healthQueries[1].data,
        }
      : undefined,
    loadingStates,
    isError:
      observationQuery.isError ||
      mediaQueries.some((q) => q.isError) ||
      healthQueries.some((q) => q.isError),
    errors: {
      observations: observationQuery.error,
      videos: mediaQueries[0].error,
      articles: mediaQueries[1].error,
      exercises: healthQueries[0].error,
      mental_summary: healthQueries[1].error,
    },
  };
}
export default function Insights() {
  const { data, loadingStates, isError } = useSequentialInsights();

  console.log(loadingStates);

  if (isError) return <div>Error loading some insights</div>;
  console.log(data);
  return (
    <motion.div {...pageAnimations}>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Health Insights</h1>
          <p className="mt-1 text-muted-foreground">
            Personalized recommendations to support your mental wellbeing
          </p>
        </div>
      </div>
      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Insights</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <AllInsights />
        </TabsContent>
        <TabsContent value="videos">
          <VideosInsights />
        </TabsContent>
        <TabsContent value="articles">
          <ArticlesInsights />
        </TabsContent>
        <TabsContent value="exercises">
          <ExercisesInsights />
        </TabsContent>
      </Tabs>
      <Card>
        <CardHeader>
          <CardTitle>Personalized Recommendations</CardTitle>
          <CardDescription>
            Complete your profile to receive more tailored insights for your
            mental health journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="flex items-center gap-2">
            Complete Profile <ArrowRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
