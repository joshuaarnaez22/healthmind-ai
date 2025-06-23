/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';

import { ONE_DAY_IN_MS } from '@/lib/constant';
import { TherapyModule } from '@/lib/types';
import AIGeneratedBadge from '@/components/custom-icons/ai-generated-badge';
import ModulesSkeleton from '@/components/loaders/module-loader';
import { useState } from 'react';
import ModuleCard from './module-card';
import { Button } from '@/components/ui/button';

export default function Modules() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;

  const queryClient = useQueryClient();
  const {
    mutate,
    isPending: isGenerating,
    error: generateError,
  } = useMutation<TherapyModule[]>({
    mutationFn: async () => {
      const response = await fetch('/api/generate-modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error('Failed to generate modules');
      }
      const { data } = await response.json();

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['therapy_modules', 'modules', userId],
      });
    },
  });

  const {
    data: modules = [],
    isLoading: isModulesLoading,
    isError: modulesError,
  } = useQuery<TherapyModule[]>({
    queryKey: ['therapy_modules', 'modules', userId],
    queryFn: async () => {
      const response = await fetch('/api/modules');
      if (!response.ok) {
        throw new Error('Failed to get modules');
      }
      const { data } = await response.json();
      return data;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: isUserLoaded,
  });

  if (isModulesLoading || isGenerating) {
    return <ModulesSkeleton />;
  }
  if (modulesError || generateError) {
    return <h1>Error</h1>;
  }

  const cbtModules = modules.filter((m) => m.therapyType === 'CBT');
  const dbtModules = modules.filter((m) => m.therapyType === 'DBT');
  const actModules = modules.filter((m) => m.therapyType === 'ACT');
  const completedModules = modules.filter((m) => m.isDone).length;
  return (
    <motion.div {...pageAnimations}>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mental Health Therapy Modules
            <span className="mx-2">
              <AIGeneratedBadge />
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Evidence-based therapeutic exercises to support your mental health
            journey. Choose from CBT, DBT, and ACT approaches.
          </p>
        </div>
        <Button onClick={() => mutate()}>Generate new modules</Button>
      </div>
      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="flex items-center p-6">
            <TrendingUp className="mr-4 h-8 w-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {modules.length}
              </p>
              <p className="text-gray-600">Total Modules</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <CheckCircle2 className="mr-4 h-8 w-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {completedModules}
              </p>
              <p className="text-gray-600">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Clock className="mr-4 h-8 w-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">10-25</p>
              <p className="text-gray-600">Minutes Each</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="mr-4 h-8 w-8 text-orange-600" />
            <div>
              <p className="text-2xl font-bold text-gray-900">3</p>
              <p className="text-gray-600">Therapy Types</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {completedModules > 0 && (
        <Card className="mb-12 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Your Progress
                </h3>
                <p className="text-gray-600">
                  Youve completed {completedModules} out of {modules.length}{' '}
                  modules. Great work!
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((completedModules / modules.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Complete</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      <section className="mb-12">
        <div className="mb-6 flex items-center">
          <div className="mr-4 h-8 w-1 bg-blue-600"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Cognitive Behavioral Therapy (CBT)
            </h2>
            <p className="text-gray-600">
              Focus on changing negative thought patterns and behaviors
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cbtModules.map((cbt: TherapyModule) => (
            <div key={cbt.id}>
              <ModuleCard module={cbt} iconColor="text-blue-600" />
            </div>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <div className="mb-6 flex items-center">
          <div className="mr-4 h-8 w-1 bg-purple-600"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Dialectical Behavior Therapy (DBT)
            </h2>
            <p className="text-gray-600">
              Build skills for emotional regulation and distress tolerance
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dbtModules.map((dbt: TherapyModule) => (
            <div key={dbt.id}>
              <ModuleCard module={dbt} iconColor="text-purple-600" />
            </div>
          ))}
        </div>
      </section>
      <section className="mb-12">
        <div className="mb-6 flex items-center">
          <div className="mr-4 h-8 w-1 bg-green-600"></div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Acceptance and Commitment Therapy (ACT)
            </h2>
            <p className="text-gray-600">
              Learn acceptance and mindfulness while committing to valued
              actions
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actModules.map((act: TherapyModule) => (
            <div key={act.id}>
              <ModuleCard module={act} iconColor="text-emerald-600" />
            </div>
          ))}
        </div>
      </section>

      <Card className="mt-6 border-amber-200 bg-amber-50">
        <CardContent className="p-6">
          <div className="flex items-start">
            <div className="mx-2 flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
                <span className="font-semibold text-amber-600">!</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="mb-2 text-lg font-semibold text-amber-800">
                Important Safety Information
              </h3>
              <p className="text-amber-700">
                These modules are educational tools and not a substitute for
                professional mental health care. If youre experiencing severe
                distress, thoughts of self-harm, or mental health crisis, please
                contact a mental health professional, your doctor, or emergency
                services immediately.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
