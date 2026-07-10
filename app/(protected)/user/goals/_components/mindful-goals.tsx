'use client';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { ArrowRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import EmotionBadge from './emotion-badge';
import { getDaysLeft, getGoalProgress } from '@/lib/utils';
import GoalCard from './goal-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecentReflections from './recent-reflections';
import InsightsChart from './insight-chart';
import NewGoalModal from './new-goal-modal';
import { useGoals } from '@/hooks/useGoals';
import { Skeleton } from '@/components/ui/skeleton';

function GoalsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-28 rounded-md" />
      </div>

      <Skeleton className="h-48 w-full rounded-3xl" />

      <div className="space-y-4">
        <Skeleton className="h-9 w-64 rounded-md" />
        <Skeleton className="h-56 w-full rounded-3xl" />
      </div>
    </div>
  );
}

export default function MindfulGoals() {
  const { data: goals = [], isLoading, isError } = useGoals();

  if (isLoading) {
    return (
      <motion.div {...pageAnimations}>
        <GoalsSkeleton />
      </motion.div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-border/80 bg-secondary px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          Failed to load goals
        </p>
      </div>
    );
  }
  const completedGoals = goals.filter((goal) => goal.isCompleted) || [];

  const activeGoals = goals.filter((goal) => !goal.isCompleted) || [];

  const allCheckIns = goals.flatMap((goal) =>
    goal.checkIns.map((checkIn) => ({
      ...checkIn,
      title: goal.title,
    }))
  );

  const recentCheckIns = allCheckIns
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .slice(0, 5);

  return (
    <motion.div {...pageAnimations}>
      <div className="space-y-10">
        <header className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Mindful Goals
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track goals that nurture your emotional wellbeing
            </p>
          </div>
          <NewGoalModal />
        </header>

        {completedGoals.length > 0 && (
          <section className="rounded-3xl border border-border/80 bg-secondary p-6">
            <div className="mb-3 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Completed Goals
              </h2>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              Congratulations on achieving these goals!
            </p>
            <div className="flex flex-wrap gap-2">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="flex items-center gap-2 rounded-full border border-border/80 bg-card px-3 py-1"
                >
                  <span className="text-sm font-medium">{goal.title}</span>
                  <EmotionBadge emotion={goal.emotion} />
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-3xl border border-border/80 bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground">
            This Week’s Focus
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your active goals and their emotional anchors
          </p>
          <div className="mt-5">
            {activeGoals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    emotion={goal.emotion}
                    progress={getGoalProgress(goal.id, goals)}
                    daysLeft={getDaysLeft({
                      duration: goal.duration,
                      createdAt: goal.createdAt,
                    })}
                    completed={goal.completedCount}
                    total={goal.targetCount}
                    goal={goal}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-secondary px-4 py-10 text-center">
                <p className="mb-4 text-sm text-muted-foreground">
                  No active goals yet. Create one to get started.
                </p>
                <NewGoalModal
                  label={
                    !goals?.length ? 'Create Your First Goal' : 'Add New Goal'
                  }
                />
              </div>
            )}
          </div>
          {activeGoals.length > 0 && (
            <div className="mt-4">
              <Link
                href="/user/goals/all-goals"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary"
              >
                View all goals
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}
        </section>

        <Tabs defaultValue="reflections" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reflections">Recent Reflections</TabsTrigger>
            <TabsTrigger value="insights">Emotional Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="reflections" className="mt-4">
            <section className="rounded-3xl border border-border/80 bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Your Reflections
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                How your activities made you feel recently
              </p>
              <div className="mt-5">
                <RecentReflections recentCheckIns={recentCheckIns} />
              </div>
            </section>
          </TabsContent>
          <TabsContent value="insights" className="mt-4">
            <section className="rounded-3xl border border-border/80 bg-card p-6">
              <h2 className="text-lg font-semibold text-foreground">
                Emotional Patterns
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Visualizing how your activities affect your emotions
              </p>
              <div className="mt-5">
                <InsightsChart
                  totalCheckIns={allCheckIns.length}
                  totalReflection={
                    allCheckIns.filter((checkIn) => checkIn.reflection).length
                  }
                  totalCompletedGoals={completedGoals.length}
                  totalActiveGoals={activeGoals.length}
                />
              </div>
            </section>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
