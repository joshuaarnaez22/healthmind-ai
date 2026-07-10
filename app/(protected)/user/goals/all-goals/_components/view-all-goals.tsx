'use client';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';
import NewGoalModal from '../../_components/new-goal-modal';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoals } from '@/hooks/useGoals';
import GoalCard from '../../_components/goal-card';
import { getDaysLeft, getGoalProgress } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function ViewAllGoals() {
  const { data: goals = [], isLoading, isError } = useGoals();

  if (isLoading) {
    return (
      <div className="space-y-6 py-2">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-border/80 rounded-3xl border bg-secondary px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          Failed to load goals
        </p>
      </div>
    );
  }
  const completedGoals = goals.filter((goal) => goal.isCompleted) || [];

  const activeGoals = goals.filter((goal) => !goal.isCompleted) || [];

  const handleDeleteGoal = (id: string, title: string) => {
    console.log(id);
    console.log(title);
  };
  return (
    <motion.div {...pageAnimations} className="space-y-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Goals
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your mindful goals
          </p>
        </div>
        <NewGoalModal />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="active">
            Active ({activeGoals.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedGoals.length})
          </TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <section className="border-border/80 rounded-3xl border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Active Goals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Goals you’re currently working on
            </p>
            <div className="mt-5">
              {activeGoals.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {activeGoals.map((goal) => (
                    <div key={goal.id} className="group relative">
                      <GoalCard
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
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleDeleteGoal(goal.id, goal.title)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-secondary px-4 py-10 text-center">
                  <p className="mb-4 text-sm text-muted-foreground">
                    No active goals. Create your first goal to get started!
                  </p>
                  <NewGoalModal label="Create Your First Goal" />
                </div>
              )}
            </div>
          </section>
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          <section className="border-border/80 rounded-3xl border bg-card p-6">
            <h2 className="text-lg font-semibold text-foreground">
              Completed Goals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Goals you’ve successfully achieved
            </p>
            <div className="mt-5">
              {completedGoals.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {completedGoals.map((goal) => (
                    <div key={goal.id} className="group relative">
                      <GoalCard
                        id={goal.id}
                        title={goal.title}
                        emotion={goal.emotion}
                        progress={100}
                        daysLeft={0}
                        completed={goal.completedCount}
                        total={goal.targetCount}
                        goal={goal}
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute right-2 top-2 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
                        onClick={() => handleDeleteGoal(goal.id, goal.title)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl bg-secondary px-4 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No completed goals yet. Keep working on your active goals!
                  </p>
                </div>
              )}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
