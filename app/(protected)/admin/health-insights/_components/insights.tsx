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
import { useQuery } from '@tanstack/react-query';
import InsightsLoader from '@/components/loaders/insights';
import { systemPrompt_observations } from '@/lib/prompts';
export default function Insights() {
  const { data, isLoading } = useQuery({
    queryKey: ['generate-observations'],
    queryFn: async () => {
      const response = await fetch('/api/insights', {
        method: 'POST',
        body: JSON.stringify({ prompt: systemPrompt_observations }),
      });
      return response.json();
    },
    staleTime: 0,
    gcTime: 0,
  });

  if (isLoading) {
    return <InsightsLoader />;
  }
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
