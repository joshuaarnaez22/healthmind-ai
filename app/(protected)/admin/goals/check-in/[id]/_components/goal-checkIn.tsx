'use client';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@clerk/nextjs';
import { Emotion } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import EmotionSelector from '../../../_components/emotion-selector';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { saveCheckIn } from '@/actions/server-actions/goal';
import { useRouter } from 'next/navigation';
import { GoalWithCheckIns } from '@/lib/types';
import { pageAnimations } from '@/lib/motion';

export default function GoalCheckIn({ id }: { id: string }) {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState('CALM');
  const [reflection, setReflection] = useState('');
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  const {
    data: goal,
    isLoading,
    isError,
  } = useQuery<GoalWithCheckIns>({
    queryKey: ['goal', id, userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/goal?goalId=${id}`, { signal });
      if (!response.ok) {
        throw new Error('Failed to fetch journal');
      }
      const data = await response.json();
      return data.goal;
    },
    enabled: !!id && !!userId,
  });

  if (isLoading) {
    return (
      <p className="text-center text-muted-foreground">Loading goals...</p>
    );
  }

  if (isError) {
    return <p className="text-center text-red-500">Failed to load goals.</p>;
  }
  if (!goal) {
    return <p className="text-center text-red-500">No goal Found.</p>;
  }
  const handleSkip = () => {};

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    startTransition(async () => {
      const newCompletedCount = goal.completedCount + 1;
      const isCompleted = newCompletedCount >= goal.targetCount;
      const values = {
        isCompleted,
        goalId: goal.id,
        actualEmotion: selectedEmotion as Emotion,
        reflection: reflection.trim(),
        rating: 5,
      };

      const response = await saveCheckIn(values);
      if (response.success && response.data) {
        queryClient.setQueryData<GoalWithCheckIns[]>(
          ['goals', userId],
          (old = []) => {
            const newCheckIn = response.data.checkedIn;
            const updatedGoalId = response.data.goalId;

            return old.map((goal) => {
              if (goal.id === updatedGoalId) {
                return {
                  ...goal,
                  completedCount: goal.completedCount + 1,
                  isCompleted: response.data.isCompleted ?? goal.isCompleted,
                  checkIns: [...goal.checkIns, newCheckIn],
                };
              }
              return goal;
            });
          }
        );
        router.push('/admin/goals');
      }
    });
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
          <div className="mb-2 flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-medium">Goal Check-in</span>
          </div>
          <CardTitle>{goal.title}</CardTitle>
          <CardDescription>
            Reflect on how completing this activity made you feel
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">
                How did this make you feel?
              </h3>
              <EmotionSelector
                selectedEmotion={selectedEmotion}
                onSelectEmotion={setSelectedEmotion}
              />
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <span>Target emotion:</span>
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  {goal.emotion}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Reflection (optional)</h3>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="What did you notice about this experience? Any insights or challenges?"
                className="min-h-[120px]"
              />
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <h4 className="mb-2 text-sm font-medium">Progress Update</h4>
              <p className="text-sm text-muted-foreground">
                This will be completion{' '}
                <strong>{goal.completedCount + 1}</strong> of{' '}
                <strong>{goal.targetCount}</strong> for this goal.
                {goal.completedCount + 1 >= goal.targetCount && (
                  <span className="font-medium text-green-600">
                    {' '}
                    🎉 Youll complete this goal!
                  </span>
                )}
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={handleSkip}>
              Skip Reflection
            </Button>
            <Button type="submit" disabled={pending}>
              Save Check-in
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
}
