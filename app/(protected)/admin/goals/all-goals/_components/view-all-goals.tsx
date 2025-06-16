'use client';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import NewGoalModal from '../../_components/new-goal-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGoals } from '@/hooks/useGoals';

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
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
