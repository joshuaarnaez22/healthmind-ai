'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Affirmations from './affirmations';
import ExercisesInsights from './exercises-insights';
import {
  BookmarkIcon,
  BookOpenIcon,
  CalendarIcon,
  ExternalLinkIcon,
  LightbulbIcon,
  SparklesIcon,
  NotebookPen,
} from 'lucide-react';
import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import { useSequentialInsights } from '@/hooks/useSequentialInsights';
import MentalSummarySection from './mental-summary-section';
import { useState } from 'react';
import ObservationCard from './observation-card';
import { ArticleProps, Exercise, Observation } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { DialogTitle } from '@radix-ui/react-dialog';
import ObservationLoader from '@/components/loaders/observation-loader';
import MentalSummaryLoader from '@/components/loaders/mental-summary-loader';
import AffirmationLoader from '@/components/loaders/affirmation-loader';
import ArticleLoader from '@/components/loaders/article-loader';
import InsightsLoader from '@/components/loaders/insights';
import { Button } from '@/components/ui/button';
import HealthTrendsPanel from './health-trends-panel';
import MedicalDisclaimer from '@/components/medical-disclaimer';
import Link from 'next/link';

function AiWorkingBanner({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="border-primary/20 bg-primary/5 my-4 flex items-center gap-2 rounded-2xl border px-4 py-3"
    >
      <SparklesIcon className="h-5 w-5 text-primary" />
      <p className="text-sm text-primary">{message}</p>
    </motion.div>
  );
}

export default function Insights() {
  const [selectedObservation, setSelectedObservation] =
    useState<null | Observation>(null);
  const { data, loadingStates, isError } = useSequentialInsights();
  if (isError)
    return (
      <div className="border-destructive/30 bg-destructive/5 flex flex-col items-center gap-4 rounded-3xl border py-20 text-center">
        <SparklesIcon className="text-destructive/40 h-9 w-9" />
        <div>
          <p className="text-sm font-medium text-foreground">
            Something went wrong
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            We couldn&apos;t load your insights right now. Try refreshing the
            page.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
        >
          Refresh
        </button>
      </div>
    );

  const affirmations = data?.affirmations;
  const summary = data?.mental_summary?.summary;
  const moodData = data?.mental_summary?.moodData;
  const observationsData = data?.observations;
  const exercisesData = data?.exercises as Exercise[];
  const articles = data?.articles;
  const observationsLoading =
    loadingStates.affirmations ||
    loadingStates.mental_summary ||
    loadingStates.observations;

  const articlesLoading = loadingStates.articles;
  const exercisesLoading = loadingStates.exercises;

  const isInitialLoading = observationsLoading;

  const allSettled =
    !observationsLoading && !articlesLoading && !exercisesLoading;
  const hasNoData =
    allSettled &&
    !affirmations &&
    !summary &&
    !observationsData &&
    !articles &&
    !exercisesData;

  return (
    <>
      <motion.div {...pageAnimations}>
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Health Insights
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Personalized recommendations to support your mental wellbeing
            </p>
          </div>
        </div>
        <div className="mb-8 space-y-4">
          <MedicalDisclaimer />
          <HealthTrendsPanel />
        </div>

        {isInitialLoading ? (
          <InsightsLoader />
        ) : hasNoData ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-border/80 bg-secondary py-20 text-center">
            <NotebookPen className="h-9 w-9 text-primary opacity-70" />
            <div>
              <p className="text-sm font-medium text-foreground">
                No insights yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                AI insights are generated from your journal entries. Write at
                least one entry to unlock them.
              </p>
            </div>
            <Link
              href="/user/journal"
              className="inline-flex items-center gap-1.5 rounded-2xl bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
              <NotebookPen className="h-3.5 w-3.5" />
              Write your first journal entry
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="observations" className="mb-8">
            <TabsList className="mb-4">
              <TabsTrigger value="observations">Observations</TabsTrigger>
              <TabsTrigger value="articles">Articles</TabsTrigger>
              <TabsTrigger value="exercises">Exercises</TabsTrigger>
            </TabsList>

            <TabsContent value="observations" className="space-y-6">
              {observationsLoading && (
                <AiWorkingBanner message="AI is personalizing your Mental Health Insights based on your journal entries and progress" />
              )}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <section className="rounded-3xl border border-border/80 bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Daily Affirmations
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Positive statements to reinforce mental wellness
                  </p>
                  <div className="mt-4">
                    {loadingStates.affirmations ? (
                      <AffirmationLoader />
                    ) : (
                      <Affirmations affirmations={affirmations || []} />
                    )}
                  </div>
                </section>
                <section className="rounded-3xl border border-border/80 bg-card p-6">
                  <h2 className="text-lg font-semibold text-foreground">
                    Mental Health Summary
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Overview of your mental health journey
                  </p>
                  <div className="mt-4">
                    {loadingStates.mental_summary ? (
                      <MentalSummaryLoader />
                    ) : (
                      <MentalSummarySection
                        summary={summary || ''}
                        moodData={moodData}
                      />
                    )}
                  </div>
                </section>
              </div>
              <section className="rounded-3xl border border-border/80 bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Therapeutic Observations
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Key insights from your journal entries and therapy sessions
                </p>
                <div className="mt-4">
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
                              onSelect={() =>
                                setSelectedObservation(observation)
                              }
                            />
                          )
                        )}
                    </div>
                  )}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="articles">
              {articlesLoading && (
                <AiWorkingBanner message="AI is personalizing your Mental Health Insights based on your journal entries and progress" />
              )}
              <section className="rounded-3xl border border-border/80 bg-card p-6">
                <h2 className="text-lg font-semibold text-foreground">
                  Recommended Articles
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Curated readings based on your journal entries and progress
                </p>
                <div className="mt-4">
                  {loadingStates.articles ? (
                    <ArticleLoader />
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {!!articles &&
                        articles.map((article: ArticleProps, index: number) => (
                          <div
                            key={index}
                            className="overflow-hidden rounded-2xl border border-border/80 bg-background/70 p-6 transition-colors hover:border-primary/40"
                          >
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
                                <p className="text-sm text-muted-foreground">
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
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </section>
            </TabsContent>
            <TabsContent value="exercises">
              {exercisesLoading && (
                <AiWorkingBanner message="AI is personalizing your Mental Health Insights based on your journal entries and progress" />
              )}
              {!!exercisesData && (
                <ExercisesInsights exercises={exercisesData} />
              )}
            </TabsContent>
          </Tabs>
        )}
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
