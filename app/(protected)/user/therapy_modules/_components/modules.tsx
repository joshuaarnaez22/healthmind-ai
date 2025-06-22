/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import Link from 'next/link';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Clock, TrendingUp, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';

import { ONE_DAY_IN_MS } from '@/lib/constant';
import { TherapyModule } from '@/lib/types';
import AIGeneratedBadge from '@/components/custom-icons/ai-generated-badge';
import ModulesSkeleton from '@/components/loaders/module-loader';
import { useState } from 'react';
import ModuleCard from './module-card';

export default function Modules() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const {
    data: modules = [],
    isLoading,
    isError,
  } = useQuery<TherapyModule[]>({
    queryKey: ['therapy_modules', 'modules', userId],
    queryFn: async () => {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cachedKey: `modules:${userId}`,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate modules');
      }
      const { data } = await response.json();

      return data.modules;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: isUserLoaded,
  });

  if (isLoading) {
    return <ModulesSkeleton />;
  }
  if (isError) {
    return <h1>Error</h1>;
  }

  const cbtModules = modules.filter((m) => m.therapyType === 'CBT');
  const dbtModules = modules.filter((m) => m.therapyType === 'DBT');
  const actModules = modules.filter((m) => m.therapyType === 'ACT');

  return (
    <motion.div {...pageAnimations}>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Mental Health Therapy Modules
            <span>
              <AIGeneratedBadge />
            </span>
          </h1>
          <p className="mt-1 text-muted-foreground">
            Evidence-based therapeutic exercises to support your mental health
            journey. Choose from CBT, DBT, and ACT approaches.
          </p>
        </div>
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
                {completedModules.length}
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
      {completedModules.length > 0 && (
        <Card className="mb-12 border-green-200 bg-gradient-to-r from-green-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  Your Progress
                </h3>
                <p className="text-gray-600">
                  Youve completed {completedModules.length} out of{' '}
                  {modules.length} modules. Great work!
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((completedModules.length / modules.length) * 100)}
                  %
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
      {/* <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules?.map((module, index) => {
          return (
            <Card key={index}>
              <CardHeader className="pb-4">
                <div
                  className={`h-12 w-12 rounded-lg ${module.color} mb-3 flex items-center justify-center`}
                ></div>
                <CardTitle className="text-xl text-slate-800">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-slate-600">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4 flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {module.estimatedTime}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {module.difficulty}
                  </Badge>
                </div>
                <Link href={`/admin/therapy_modules/${module.id}`}>
                  <Button className="w-full">Start Module</Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div> */}

      <div className="mt-16 text-center">
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <Users className="mx-auto mb-3 h-8 w-8 text-slate-600" />
            <h3 className="mb-2 text-lg font-semibold text-slate-800">
              Take Your Time
            </h3>
            <p className="mx-auto max-w-md text-slate-600">
              These modules are self-paced. You can pause, revisit, or redo any
              step whenever you need to. Your progress is automatically saved.
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
