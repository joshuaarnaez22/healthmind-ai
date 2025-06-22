/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Exercise, Step } from '@/lib/types';
import { useUser } from '@clerk/nextjs';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, CheckCircle, Clock, Play } from 'lucide-react';
import { useState } from 'react';
import ExerciseDetail from './exercise-detail';
import { Badge } from '@/components/ui/badge';

export default function ExercisesInsights({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  // const queryClient = useQueryClient();
  // const { user, isLoaded: isUserLoaded } = useUser();
  // const userId = user?.id;
  //  await queryClient.invalidateQueries({
  //     queryKey: ['insights', 'exercises', userId],
  //     refetchType: 'active',
  //   });

  const getTotalDuration = (steps: Step[]) => {
    return steps.reduce((total, step) => total + step.duration, 0);
  };
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };
  const updateExercise = (ex: Exercise) => {
    console.log(ex);
  };

  const getCompletedExercises = () => {
    return exercises.filter((ex: Exercise) => ex.isDone).length;
  };

  if (selectedExercise) {
    const exercise = exercises.find(
      (exercise) => exercise.id === selectedExercise
    );

    if (exercise) {
      return (
        <div className="w-full">
          <Button
            variant="ghost"
            onClick={() => setSelectedExercise(null)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Exercises
          </Button>
          <ExerciseDetail
            exercise={exercise}
            onUpdate={updateExercise}
            onComplete={() => setSelectedExercise(null)}
          />
        </div>
      );
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Mental Wellness</CardTitle>
        <CardDescription>
          Guided exercises for your mental health journey
        </CardDescription>
        <div className="mt-4">
          <Badge variant="secondary" className="px-3 py-1 text-sm">
            {getCompletedExercises()} of {exercises.length} exercises completed
          </Badge>
        </div>
        <div className="mb-6">
          <Progress
            value={(getCompletedExercises() / exercises.length) * 100}
            className="h-2"
          />
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {exercises.map((exercise, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                exercise.isDone
                  ? 'border-green-200 bg-green-50'
                  : 'bg-white hover:bg-gray-50'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold leading-tight text-gray-800">
                    {exercise.name}
                  </CardTitle>
                  {exercise.isDone && (
                    <CheckCircle className="ml-2 h-5 w-5 flex-shrink-0 text-green-600" />
                  )}
                </div>
                <CardDescription className="mt-2 text-sm text-gray-600">
                  {exercise.rationale}
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="mr-1 h-4 w-4" />
                    {formatDuration(getTotalDuration(exercise.steps))}
                  </div>
                  <div>{exercise.steps.length} steps</div>
                </div>

                <div className="mb-4">
                  <div className="mb-1 flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>
                      {exercise.steps.filter((step) => step.isComplete).length}/
                      {exercise.steps.length} steps
                    </span>
                  </div>
                  <Progress
                    value={
                      (exercise.steps.filter((step) => step.isComplete).length /
                        exercise.steps.length) *
                      100
                    }
                    className="h-2"
                  />
                </div>

                <Button
                  className="w-full"
                  variant={exercise.isDone ? 'secondary' : 'default'}
                  onClick={() => setSelectedExercise(exercise.id)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  {exercise.isDone
                    ? '✓ Completed - Review'
                    : exercise.steps.some((step) => step.isComplete)
                      ? 'Continue Exercise'
                      : 'Start Exercise'}
                </Button>

                {exercise.isDone && (
                  <div className="mt-2 flex items-center justify-center text-sm font-medium text-green-600">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Exercise Complete
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600">
            Take your time with each exercise. Your mental health journey is
            unique to you.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
