/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Exercise } from '@/lib/types';
import { CheckCircle, Pause, Play, RotateCcw } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface ExerciseDetailProps {
  exercise: Exercise;
  onUpdate: (exercise: Exercise) => void;
  onComplete: () => void;
}

export default function ExerciseDetail({
  exercise,
  onUpdate,
  onComplete,
}: ExerciseDetailProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [exerciseData, setExerciseData] = useState(exercise);
  const [timeRemaining, setTimeRemaining] = useState(
    exercise.steps[0]?.duration || 0
  );
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeRemaining(exerciseData.steps[currentStepIndex]?.duration || 0);
  }, [currentStepIndex, exerciseData.steps]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          if (time <= 1) {
            setIsRunning(false);
            completeCurrentStep();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeRemaining]);

  const resetStep = () => {
    setTimeRemaining(exerciseData.steps[currentStepIndex]?.duration || 0);
    setIsRunning(false);
  };

  const completeCurrentStep = () => {
    // const updatedSteps = exerciseData.steps.map((step, index) =>
    //   index === currentStepIndex ? { ...step, isComplete: true } : step,
    // )
  };
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentStep = exerciseData.steps[currentStepIndex];
  const progress = currentStep
    ? ((currentStep.duration - timeRemaining) / currentStep.duration) * 100
    : 0;
  const overallProgress =
    (exerciseData.steps.filter((step) => step.isComplete).length /
      exerciseData.steps.length) *
    100;

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  return (
    <div className="space-y-6">
      {' '}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {exerciseData.name}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {exerciseData.rationale}
          </CardDescription>
          <div className="mt-4 flex items-center justify-between">
            <Badge variant="outline">
              Step {currentStepIndex + 1} of {exerciseData.steps.length}
            </Badge>
            <div className="text-sm text-gray-500">
              Overall Progress: {Math.round(overallProgress)}%
            </div>
          </div>
          <Progress value={overallProgress} className="mt-2" />
        </CardHeader>
      </Card>
      {currentStep && (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-blue-800">
              Current Step
            </CardTitle>
            <CardDescription className="text-base leading-relaxed text-blue-700">
              {currentStep.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 text-center">
              <div className="mb-2 text-4xl font-bold text-blue-800">
                {formatTime(timeRemaining)}
              </div>
              <Progress value={progress} className="mb-4" />
              <div className="text-sm text-blue-600">
                {currentStep.isComplete ? 'Step completed!' : 'Time remaining'}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {!currentStep.isComplete && (
                <>
                  <Button
                    onClick={toggleTimer}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={timeRemaining === 0}
                  >
                    {isRunning ? (
                      <>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-4 w-4" />
                        {timeRemaining === currentStep.duration
                          ? 'Start'
                          : 'Resume'}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetStep}
                    disabled={timeRemaining === currentStep.duration}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsRunning(false);
                      completeCurrentStep();
                    }}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete Step
                  </Button>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-center gap-3 border-t border-gray-200 pt-4">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentStepIndex(Math.max(0, currentStepIndex - 1))
                }
                disabled={currentStepIndex === 0}
              >
                Previous Step
              </Button>
              <Button
                onClick={() => {
                  if (currentStepIndex < exerciseData.steps.length - 1) {
                    setCurrentStepIndex(currentStepIndex + 1);
                  }
                }}
                disabled={currentStepIndex === exerciseData.steps.length - 1}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Next Step
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            All Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exerciseData.steps.map((step, index) => (
              <div
                key={step.id}
                className={`cursor-pointer rounded-lg border p-4 transition-all hover:shadow-sm ${
                  index === currentStepIndex
                    ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-200'
                    : step.isComplete
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                }`}
                onClick={() => {
                  setCurrentStepIndex(index);
                  setIsRunning(false);
                }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center">
                      <span className="text-sm font-semibold text-gray-700">
                        Step {index + 1}
                      </span>
                      {step.isComplete && (
                        <div className="ml-2 flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4 text-green-600" />
                          <span className="text-xs font-medium text-green-600">
                            Completed
                          </span>
                        </div>
                      )}
                      {index === currentStepIndex && !step.isComplete && (
                        <Badge
                          variant="default"
                          className="ml-2 bg-blue-600 text-xs"
                        >
                          Current Step
                        </Badge>
                      )}
                      {!step.isComplete && index !== currentStepIndex && (
                        <Badge
                          variant="outline"
                          className="ml-2 text-xs text-gray-500"
                        >
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                  <div className="ml-3 flex-shrink-0 text-right text-xs text-gray-500">
                    <div>
                      {Math.floor(step.duration / 60)}m {step.duration % 60}s
                    </div>
                    {step.isComplete && (
                      <div className="mt-1 font-medium text-green-600">
                        ✓ Done
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
