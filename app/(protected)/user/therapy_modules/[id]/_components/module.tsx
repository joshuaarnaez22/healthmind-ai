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

  if (isCompleted) {
    return (
      <div className="py-12 text-center">
        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
        <h1 className="text-2xl font-semibold">Module Completed!</h1>
        <p className="mb-6 text-gray-600">
          You’ve completed all the steps in this module.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/user/therapy_modules">
            <Button variant="outline">Explore More Modules</Button>
          </Link>
          <Button onClick={() => setCurrentStep(0)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Restart Module
          </Button>
        </div>
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
