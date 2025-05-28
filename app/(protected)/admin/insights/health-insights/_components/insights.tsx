'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Affirmations from './affirmations';
import ExercisesInsights from './exercises-insights';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookmarkIcon,
  BookOpenIcon,
  CalendarIcon,
  ExternalLinkIcon,
  LightbulbIcon,
  SparklesIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { pageAnimations } from '@/lib/motion';
import { useSequentialInsights } from '@/hooks/useSequentialInsights';
import MentalSummarySection from './mental-summary-section';
import { useState } from 'react';
import ObservationCard from './observation-card';
import { ArticleProps, Observation } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import ObservationLoader from '@/components/loaders/observation-loader';
import MentalSummaryLoader from '@/components/loaders/mental-summary-loader';
import AffirmationLoader from '@/components/loaders/affirmation-loader';
import ArticleLoader from '@/components/loaders/article-loader';
import { Button } from '@/components/ui/button';

export default function Insights() {
  const [selectedObservation, setSelectedObservation] =
    useState<null | Observation>(null);
  const { data, loadingStates, isError } = useSequentialInsights();
  if (isError) return <div>Error loading some insights</div>;

  const affirmations = data?.affirmations;
  const summary = data?.mental_summary?.summary;
  const moodData = data?.mental_summary?.moodData;
  const observationsData = data?.observations;
  const articles = data?.articles;
  const observationsLoading =
    loadingStates.affirmations ||
    loadingStates.mental_summary ||
    loadingStates.observations;

  const articlesLoading = loadingStates.articles;
  return (
    <>
      <motion.div {...pageAnimations}>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Health Insights
            </h1>
            <p className="mt-1 text-muted-foreground">
              Personalized recommendations to support your mental wellbeing
            </p>
          </div>
        </div>
        <Tabs defaultValue="observations" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="observations">Observations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
          </TabsList>

          <TabsContent value="observations" className="space-y-6">
            {observationsLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 p-4"
              >
                <SparklesIcon className="h-5 w-5 text-primary/80" />
                <p className="text-sm text-primary/80">
                  AI is personalizing your Mental Health Insights based on your
                  journal entries and progress
                </p>
              </motion.div>
            )}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Daily Affirmations</CardTitle>
                  <CardDescription>
                    Positive statements to reinforce mental wellness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStates.affirmations ? (
                    <AffirmationLoader />
                  ) : (
                    <Affirmations affirmations={affirmations || []} />
                  )}
                </CardContent>
              </Card>
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Mental Health Summary</CardTitle>
                  <CardDescription>
                    Overview of your mental health journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loadingStates.mental_summary ? (
                    <MentalSummaryLoader />
                  ) : (
                    <MentalSummarySection
                      summary={summary || ''}
                      moodData={moodData}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Therapeutic Observations</CardTitle>
                <CardDescription>
                  Key insights from your journal entries and therapy sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStates.observations ? (
                  <ObservationLoader />
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {!!observationsData &&
                      observationsData.observations.map(
                        (observation: Observation, index: number) => (
                          <ObservationCard
                            key={index}
                            observation={observation}
                            onSelect={() => setSelectedObservation(observation)}
                          />
                        )
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="articles">
            {articlesLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 flex items-center gap-2 rounded-lg border border-primary/10 bg-primary/5 p-4"
              >
                <SparklesIcon className="h-5 w-5 text-primary/80" />
                <p className="text-sm text-primary/80">
                  AI is personalizing your Mental Health Insights based on your
                  journal entries and progress
                </p>
              </motion.div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Recommended Articles</CardTitle>
                <CardDescription>
                  Curated readings based on your journal entries and progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingStates.articles ? (
                  <ArticleLoader />
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {!!articles &&
                      articles.map((article: ArticleProps, index: number) => (
                        <Card
                          key={index}
                          className="overflow-hidden transition-all hover:border-primary/50"
                        >
                          <CardContent className="p-6">
                            <div className="flex flex-col items-start gap-6 md:flex-row">
                              <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <BookOpenIcon className="h-5 w-5 text-primary" />
                                    <span className="text-sm text-muted-foreground">
                                      {article.publication}
                                    </span>
                                  </div>
                                  <h3 className="text-lg font-semibold text-primary">
                                    {article.title}
                                  </h3>
                                </div>
                                <p className="text-muted-foreground">
                                  {article.benefit}
                                </p>
                              </div>
                              <Button
                                asChild
                                variant="outline"
                                className="shrink-0"
                              >
                                <a
                                  href={article.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  Read Article
                                  <ExternalLinkIcon className="h-4 w-4" />
                                </a>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* <Articles /> */}
          </TabsContent>
          <TabsContent value="exercises">
            <ExercisesInsights />
          </TabsContent>
        </Tabs>
      </motion.div>
      <Dialog
        open={selectedObservation !== null}
        onOpenChange={() => setSelectedObservation(null)}
      >
        <DialogContent className="sm:max-w-[600px]">
          {selectedObservation && (
            <div className="space-y-6">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold">
                  {selectedObservation.title}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  <span>
                    {new Date(selectedObservation.date).toLocaleDateString(
                      'en-US',
                      {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      }
                    )}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <LightbulbIcon className="h-5 w-5" />
                    <h3 className="font-medium">Key Insight</h3>
                  </div>
                  <p className="pl-7 text-muted-foreground">
                    {selectedObservation.insight}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <BookmarkIcon className="h-5 w-5" />
                    <h3 className="font-medium">Journal Entry</h3>
                  </div>
                  <div className="prose-sm pl-7">
                    {selectedObservation.evidence
                      .split('\n\n')
                      .map((paragraph, index) => (
                        <p key={index} className="mb-4 text-muted-foreground">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
