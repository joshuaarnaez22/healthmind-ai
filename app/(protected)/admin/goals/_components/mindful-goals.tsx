'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import Link from 'next/link';
import EmotionBadge from './emotion-badge';
import { getDaysLeft } from '@/lib/utils';
import GoalCard from './goal-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecentReflections from './recent-reflections';
import InsightsChart from './insight-chart';
import NewGoalModal from './new-goal-modal';
import { useGoals } from '@/hooks/useGoals';

export default function MindfulGoals() {
  const { data: goals = [], isLoading, isError } = useGoals();

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">Loading goals...</p>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load goals.</p>;
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

  const getGoalProgress = (goalId: string) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return 0;
    return Math.min((goal.completedCount / goal.targetCount) * 100, 100);
  };

  return (
    <motion.div {...pageAnimations}>
      <div className="space-y-12">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mindful Goals</h1>
            <p className="text-muted-foreground">
              Track goals that nurture your emotional wellbeing
            </p>
          </div>
          <NewGoalModal />
        </header>
        {completedGoals.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-green-600" />
                Completed Goals
              </CardTitle>
              <CardDescription>
                Congratulations on achieving these goals!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="flex items-center gap-2 rounded-full border bg-white px-3 py-1"
                  >
                    <span className="text-sm font-medium">{goal.title}</span>
                    <EmotionBadge emotion={goal.emotion} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border-green-100 bg-green-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">This Weeks Focus</CardTitle>
            <CardDescription>
              Your active goals and their emotional anchors
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    id={goal.id}
                    title={goal.title}
                    emotion={goal.emotion}
                    progress={getGoalProgress(goal.id)}
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
              <div className="py-8 text-center">
                <p className="mb-4 text-muted-foreground">
                  No active goals yet.{' '}
                  {!goals?.length ? 'Create Your First Goal' : 'Add New Goal'}{' '}
                  to get started!
                </p>
                <NewGoalModal
                  label={
                    !goals?.length ? 'Create Your First Goal' : 'Add New Goal'
                  }
                />
              </div>
            )}
          </CardContent>
          {activeGoals.length > 0 && (
            <CardFooter>
              <Link href="/admin/goals/all-goals">
                <Button variant="ghost" className="text-green-700">
                  View all goals
                </Button>
              </Link>
            </CardFooter>
          )}
        </Card>

        <Tabs defaultValue="reflections" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="reflections">Recent Reflections</TabsTrigger>
            <TabsTrigger value="insights">Emotional Insights</TabsTrigger>
          </TabsList>
          <TabsContent value="reflections" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Reflections</CardTitle>
                <CardDescription>
                  How your activities made you feel recently
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentReflections recentCheckIns={recentCheckIns} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="insights" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Emotional Patterns</CardTitle>
                <CardDescription>
                  Visualizing how your activities affect your emotions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <InsightsChart
                  totalCheckIns={allCheckIns.length}
                  totalReflection={
                    allCheckIns.filter((checkIn) => checkIn.reflection).length
                  }
                  totalCompletedGoals={completedGoals.length}
                  totalActiveGoals={activeGoals.length}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
