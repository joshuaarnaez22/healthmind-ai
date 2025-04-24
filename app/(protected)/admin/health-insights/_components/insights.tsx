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
import { useQueries } from '@tanstack/react-query';
import InsightsLoader from '@/components/loaders/insights';
import {
  systemPrompt_articles,
  systemPrompt_exercises,
  systemPrompt_mental_summary,
  systemPrompt_observations,
  systemPrompt_videos,
} from '@/lib/prompts';

function useAllInsights() {
  const prompts = [
    { name: 'observations', prompt: systemPrompt_observations },
    { name: 'videos', prompt: systemPrompt_videos },
    { name: 'articles', prompt: systemPrompt_articles },
    { name: 'exercises', prompt: systemPrompt_exercises },
    { name: 'mental_summary', prompt: systemPrompt_mental_summary },
  ];

  const queries = useQueries({
    queries: prompts.map(({ name, prompt }) => ({
      queryKey: ['generate-insights', name],
      queryFn: async () => {
        const response = await fetch('/api/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        return response.json();
      },
    })),
  });

  // Extract data and loading states
  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const errors = queries.map((query) => query.error);
  const data = {
    observations: queries[0].data,
    videos: queries[1].data,
    articles: queries[2].data,
    exercises: queries[3].data,
    mental_summary: queries[4].data,
  };

  return { data, isLoading, isError, errors };
}

export default function Insights() {
  const { data, isLoading, isError } = useAllInsights();

  if (isLoading) {
    return <InsightsLoader />;
  }
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
