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

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import confetti from 'canvas-confetti';

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

  useEffect(() => {
    if (isCompleted) {
      const duration = 2 * 1000;
      const animationEnd = Date.now() + duration;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        confetti({
          particleCount: 50,
          angle: 60,
          spread: 100,
          origin: { x: 0 },
        });

        confetti({
          particleCount: 50,
          angle: 120,
          spread: 100,
          origin: { x: 1 },
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [isCompleted]);

  if (isLoading) return <div>Loading...</div>;
  if (isError || !module) return <div>Error loading module.</div>;

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
            .sort((a, b) => a.order - b.order); // ✅ sort by order

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

  const handleRestart = () => {};

  if (isCompleted) {
    return (
      <div>
        <Link
          href="/user/therapy_modules"
          className="mb-6 inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Modules
        </Link>

        <Card className="text-center">
          <CardContent className="p-8">
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-600" />
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Module Completed!
            </h1>

            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-green-800">
                Recap
              </h3>
              <p className="mb-4 text-green-700">{module.completion?.recap}</p>
              <p className="font-medium text-green-800">
                {module.completion?.praise}
              </p>
            </div>

            <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-6">
              <h3 className="mb-2 text-lg font-semibold text-blue-800">
                Next Steps
              </h3>
              <p className="text-blue-700">
                {module.completion?.nextSuggestion}
              </p>
            </div>

            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm text-amber-800">
                {module.safetyDisclaimer}
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Link href="/user/therapy_modules">
                <Button variant="outline">Explore More Modules</Button>
              </Link>
              <Button
                onClick={handleRestart}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restart Module
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const step = module.steps[currentStep];

  return (
    <motion.div {...pageAnimations} className="py-6">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/user/therapy_modules"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
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

      <Card className="mb-6">
        <CardHeader>
          <div className="flex gap-4">
            <IconComponent className="h-12 w-12" />
            <div className="flex-1">
              <CardTitle className="text-2xl">{module.title}</CardTitle>
              <CardDescription>{module.description}</CardDescription>
              <div className="mt-2 flex gap-4 text-sm text-gray-600">
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
        </CardHeader>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="mb-2 flex justify-between">
            <span className="text-sm font-medium">Progress</span>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-800">
              {currentStep + 1}
            </span>
            {step.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="mb-2 font-semibold">Understanding</h4>
            <p className="text-gray-700">{step.explanation}</p>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Exercise</h4>
            <p className="mb-2 text-gray-700">{step.exercise}</p>
            <Textarea
              placeholder="Write your response here..."
              value={exerciseResponse}
              onChange={(e) => setExerciseResponse(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Reflection</h4>
            <p className="mb-2 text-gray-700">{step.reflection}</p>
            <Textarea
              placeholder="Reflect on your experience..."
              value={reflectionResponse}
              onChange={(e) => setReflectionResponse(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

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
