'use client';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import NewGoalModal from '../../_components/new-goal-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoals } from '@/hooks/useGoals';
import GoalCard from '../../_components/goal-card';
import { getDaysLeft, getGoalProgress } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function ViewAllGoals() {
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

  const handleDeleteGoal = (id: string, title: string) => {
    console.log(id);
    console.log(title);
  };
  return (
    <motion.div {...pageAnimations} className="py-6">
      <Link
        href="/admin/goals"
        className="mb-6 flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to goals
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="mb-2 flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Goals</span>
              </div>
              <CardTitle>All Goals</CardTitle>
              <CardDescription>Manage your mindful goals</CardDescription>
            </div>
            <NewGoalModal />
          </div>
        </CardHeader>
        <CardContent className="">
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
              <Card>
                <CardHeader>
                  <CardTitle>Active Goals</CardTitle>
                  <CardDescription>
                    Goals youre currently working on
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                            onClick={() =>
                              handleDeleteGoal(goal.id, goal.title)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="mb-4 text-muted-foreground">
                        No active goals. Create your first goal to get started!
                      </p>
                      <NewGoalModal label="Create Your First Goal" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="completed" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Completed Goals</CardTitle>
                  <CardDescription>
                    Goals youve successfully achieved
                  </CardDescription>
                </CardHeader>
                <CardContent>
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
                            onClick={() =>
                              handleDeleteGoal(goal.id, goal.title)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-muted-foreground">
                        No completed goals yet. Keep working on your active
                        goals!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
