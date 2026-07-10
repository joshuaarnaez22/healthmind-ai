/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Exercise, Step } from '@/lib/types';
import { ArrowLeft, CheckCircle, Clock, Play } from 'lucide-react';
import { useState } from 'react';
import ExerciseDetail from './exercise-detail';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function ExercisesInsights({
  exercises,
}: {
  exercises: Exercise[];
}) {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

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
    <section className="rounded-3xl border border-border/80 bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Mental Wellness</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Guided exercises for your mental health journey
      </p>
      <div className="mt-4">
        <Badge variant="secondary" className="bg-secondary px-3 py-1 text-sm text-primary">
          {getCompletedExercises()} of {exercises.length} exercises completed
        </Badge>
      </div>
      <div className="mb-6 mt-3">
        <Progress
          value={(getCompletedExercises() / exercises.length) * 100}
          className="h-2"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className={cn(
              'cursor-pointer rounded-3xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30',
              exercise.isDone && 'bg-secondary/60'
            )}
          >
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold leading-tight text-foreground">
                {exercise.name}
              </h3>
              {exercise.isDone && (
                <CheckCircle className="ml-2 h-5 w-5 shrink-0 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{exercise.rationale}</p>

            <div className="mb-3 mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <Clock className="mr-1 h-4 w-4" />
                {formatDuration(getTotalDuration(exercise.steps))}
              </div>
              <div>{exercise.steps.length} steps</div>
            </div>

            <div className="mb-4">
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
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
                ? 'Completed — Review'
                : exercise.steps.some((step) => step.isComplete)
                  ? 'Continue Exercise'
                  : 'Start Exercise'}
            </Button>

            {exercise.isDone && (
              <div className="mt-2 flex items-center justify-center text-sm font-medium text-primary">
                <CheckCircle className="mr-1 h-4 w-4" />
                Exercise Complete
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground">
          Take your time with each exercise. Your mental health journey is
          unique to you.
        </p>
      </div>
    </section>
  );
}
