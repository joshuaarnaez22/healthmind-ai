'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  CheckCircle,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { useUser } from '@clerk/nextjs';

import {
  markModuleAsDone,
  markStepAsDone,
} from '@/actions/server-actions/module';
import { getDifficultyColor, getIcon, getTherapyTypeColor } from '@/lib/utils';
import { pageAnimations } from '@/lib/motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

import type {
  TherapyModule,
  TherapyStep,
  ModuleCompletion,
} from '@prisma/client';

type FullTherapyModule = TherapyModule & {
  steps: TherapyStep[];
  completion: ModuleCompletion | null;
};

export default function Module({ id }: { id: string }) {
  const queryClient = useQueryClient();
  const { user } = useUser();
  const userId = user?.id;

  const {
    data: module,
    isLoading,
    isError,
  } = useQuery<FullTherapyModule>({
    queryKey: ['therapy_modules', 'module', id],
    queryFn: async () => {
      const res = await fetch(`/api/get-module?id=${id}`);
      if (!res.ok) throw new Error('Failed to fetch module');
      const json = await res.json();
      return json.data;
    },
    enabled: !!id,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [exerciseResponse, setExerciseResponse] = useState('');
  const [reflectionResponse, setReflectionResponse] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (module && module.steps[currentStep]) {
      const step = module.steps[currentStep];
      setExerciseResponse(step.exerciseResponse || '');
      setReflectionResponse(step.reflectionResponse || '');
    }
  }, [module, currentStep]);

  if (isLoading) {
    return (
      <div className="space-y-6 py-6">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-32 w-full rounded-3xl" />
        <Skeleton className="h-10 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  if (isError || !module) {
    return (
      <div className="border-border/80 rounded-3xl border bg-secondary px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          Couldn’t load this module
        </p>
        <Link
          href="/user/therapy_modules"
          className="mt-3 inline-block text-xs font-bold text-primary"
        >
          Back to modules
        </Link>
      </div>
    );
  }

  const IconComponent = getIcon(module.icon);
  const totalSteps = module.steps.length;
  const progress = ((currentStep + 1) / (totalSteps + 1)) * 100;

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveCurrentStep = async () => {
    const stepId = module.steps[currentStep].id;
    const { success, step } = await markStepAsDone(
      stepId,
      exerciseResponse,
      reflectionResponse
    );

    if (success && step) {
      queryClient.setQueryData<FullTherapyModule>(
        ['therapy_modules', 'module', id],
        (prev) => {
          if (!prev) return prev;

          const updatedSteps = prev.steps
            .map((s) => (s.id === step.id ? { ...s, ...step } : s))
            .sort((a, b) => a.order - b.order);

          return { ...prev, steps: updatedSteps };
        }
      );
    }
  };

  const handleNext = async () => {
    await saveCurrentStep();

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      await markModuleAsDone(module.id);
      queryClient.invalidateQueries({
        queryKey: ['therapy_modules', 'modules', userId],
      });
      setIsCompleted(true);
    }
  };

  if (isCompleted) {
    return (
      <div className="border-border/80 rounded-3xl border bg-secondary px-6 py-16 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-primary" />
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Module Completed!
        </h1>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">
          You’ve completed all the steps in this module.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/user/therapy_modules">
            <Button variant="outline">Explore More Modules</Button>
          </Link>
          <Button
            onClick={() => {
              setIsCompleted(false);
              setCurrentStep(0);
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Module
          </Button>
        </div>
      </div>
    );
  }

  const step = module.steps[currentStep];

  return (
    <motion.div {...pageAnimations} className="space-y-6 py-2">
      <div className="flex items-center justify-between">
        <Link
          href="/user/therapy_modules"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Modules
        </Link>
        <div className="flex items-center gap-2">
          <Badge className={getDifficultyColor(module.difficulty)}>
            {module.difficulty}
          </Badge>
          <Badge className={getTherapyTypeColor(module.therapyType)}>
            {module.therapyType}
          </Badge>
        </div>
      </div>

      <section className="border-border/80 rounded-3xl border bg-card p-6">
        <div className="flex gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-secondary">
            <IconComponent className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {module.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {module.description}
            </p>
            <div className="mt-3 flex gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {module.estimatedTime}
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {module.audience}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-border/80 rounded-3xl border bg-card px-5 py-4">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </section>

      <section className="border-border/80 rounded-3xl border bg-card p-6">
        <h2 className="mb-6 flex items-center gap-3 text-lg font-semibold text-foreground">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-primary">
            {currentStep + 1}
          </span>
          {step.title}
        </h2>
        <div className="space-y-6">
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Understanding
            </h4>
            <p className="text-sm text-muted-foreground">{step.explanation}</p>
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Exercise
            </h4>
            <p className="mb-2 text-sm text-muted-foreground">
              {step.exercise}
            </p>
            <Textarea
              placeholder="Write your response here..."
              value={exerciseResponse}
              onChange={(e) => setExerciseResponse(e.target.value)}
              className="min-h-[100px] rounded-2xl"
            />
          </div>
          <div>
            <h4 className="mb-2 text-sm font-semibold text-foreground">
              Reflection
            </h4>
            <p className="mb-2 text-sm text-muted-foreground">
              {step.reflection}
            </p>
            <Textarea
              placeholder="Reflect on your experience..."
              value={reflectionResponse}
              onChange={(e) => setReflectionResponse(e.target.value)}
              className="min-h-[100px] rounded-2xl"
            />
          </div>
        </div>
      </section>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!exerciseResponse.trim() || !reflectionResponse.trim()}
        >
          {currentStep === totalSteps - 1 ? 'Complete Module' : 'Next Step'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  );
}
