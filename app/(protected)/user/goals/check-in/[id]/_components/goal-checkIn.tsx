'use client';
import { motion } from 'motion/react';
import { useUser } from '@clerk/nextjs';
import { Emotion } from '@prisma/client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import EmotionSelector from '../../../_components/emotion-selector';
import { Textarea } from '@/components/ui/textarea';
import { FormEvent, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { saveCheckIn } from '@/actions/server-actions/goal';
import { useRouter } from 'next/navigation';
import { GoalWithCheckIns } from '@/lib/types';
import { pageAnimations } from '@/lib/motion';
import { Skeleton } from '@/components/ui/skeleton';
import EmotionBadge from '../../../_components/emotion-badge';

export default function GoalCheckIn({ id }: { id: string }) {
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();
  const [selectedEmotion, setSelectedEmotion] = useState('CALM');
  const [reflection, setReflection] = useState('');
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      <div className="space-y-4 py-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-72 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-border/80 bg-secondary px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          Failed to load goal
        </p>
      </div>
    );
  }
  if (!goal) {
    return (
      <div className="rounded-3xl border border-border/80 bg-secondary px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">No goal found</p>
        <Link
          href="/user/goals"
          className="mt-3 inline-block text-xs font-bold text-primary"
        >
          Back to goals
        </Link>
      </div>
    );
  }

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
        toast({
          title: 'Check-in saved',
          description: 'Keep up the great work!',
        });
        router.push('/user/goals');
      } else {
        toast({
          title: 'Failed to save check-in',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <motion.div {...pageAnimations} className="space-y-6 py-2">
      <Link
        href="/user/goals"
        className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to goals
      </Link>

      <section className="rounded-3xl border border-border/80 bg-card p-6">
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-primary">
          Goal Check-in
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {goal.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Reflect on how completing this activity made you feel
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">
              How did this make you feel?
            </h3>
            <EmotionSelector
              selectedEmotion={selectedEmotion}
              onSelectEmotion={setSelectedEmotion}
            />
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Target emotion:</span>
              <EmotionBadge emotion={goal.emotion} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              Reflection (optional)
            </h3>
            <Textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="What did you notice about this experience? Any insights or challenges?"
              className="min-h-[120px] rounded-2xl"
            />
          </div>

          <div className="rounded-2xl bg-secondary p-4">
            <h4 className="mb-2 text-sm font-medium text-foreground">
              Progress Update
            </h4>
            <p className="text-sm text-muted-foreground">
              This will be completion{' '}
              <strong className="text-foreground">
                {goal.completedCount + 1}
              </strong>{' '}
              of <strong className="text-foreground">{goal.targetCount}</strong>{' '}
              for this goal.
              {goal.completedCount + 1 >= goal.targetCount && (
                <span className="font-medium text-primary">
                  {' '}
                  You’ll complete this goal!
                </span>
              )}
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={pending}>
              Save Check-in
            </Button>
          </div>
        </form>
      </section>
    </motion.div>
  );
}
