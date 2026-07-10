/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Loader2, TrendingUp, Users } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';

import { ONE_DAY_IN_MS } from '@/lib/constant';
import { TherapyModule } from '@/lib/types';
import AIGeneratedBadge from '@/components/custom-icons/ai-generated-badge';
import ModulesSkeleton from '@/components/loaders/module-loader';
import { useEffect, useRef } from 'react';
import ModuleCard from './module-card';
import { Button } from '@/components/ui/button';
import { getTherapyAccentBar, getTherapyIconColor } from '@/lib/utils';

const STATS = [
  { key: 'total', icon: TrendingUp, label: 'Total Modules' },
  { key: 'completed', icon: CheckCircle2, label: 'Completed' },
  { key: 'minutes', icon: Clock, label: 'Minutes Each', fixed: '10-25' },
  { key: 'types', icon: Users, label: 'Therapy Types', fixed: '3' },
] as const;

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

  const autoTriggered = useRef(false);

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

  useEffect(() => {
    if (!isModulesLoading && modules.length === 0 && !autoTriggered.current) {
      autoTriggered.current = true;
      mutate();
    }
  }, [isModulesLoading, modules.length, mutate]);

  if (isModulesLoading) {
    return <ModulesSkeleton />;
  }

  if (modules.length === 0 && isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm font-medium">
          Generating your personalised modules…
        </p>
      </div>
    );
  }

  if (modulesError || generateError) {
    return (
      <div className="rounded-3xl border border-border/80 bg-secondary px-6 py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          Couldn’t load therapy modules
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Try generating again in a moment.
        </p>
        <Button className="mt-4" onClick={() => mutate()} disabled={isGenerating}>
          Retry
        </Button>
      </div>
    );
  }

  const cbtModules = modules.filter((m) => m.therapyType === 'CBT');
  const dbtModules = modules.filter((m) => m.therapyType === 'DBT');
  const actModules = modules.filter((m) => m.therapyType === 'ACT');
  const completedModules = modules.filter((m) => m.isDone).length;
  const completionPct =
    modules.length > 0
      ? Math.round((completedModules / modules.length) * 100)
      : 0;

  const statValues: Record<string, string | number> = {
    total: modules.length,
    completed: completedModules,
    minutes: '10-25',
    types: 3,
  };

  const sections = [
    {
      type: 'CBT',
      title: 'Cognitive Behavioral Therapy (CBT)',
      description: 'Focus on changing negative thought patterns and behaviors',
      items: cbtModules,
    },
    {
      type: 'DBT',
      title: 'Dialectical Behavior Therapy (DBT)',
      description: 'Build skills for emotional regulation and distress tolerance',
      items: dbtModules,
    },
    {
      type: 'ACT',
      title: 'Acceptance and Commitment Therapy (ACT)',
      description:
        'Learn acceptance and mindfulness while committing to valued actions',
      items: actModules,
    },
  ] as const;

  return (
    <motion.div {...pageAnimations} className="space-y-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Therapy Modules
            <span className="mx-2 inline-block align-middle">
              <AIGeneratedBadge />
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Evidence-based exercises across CBT, DBT, and ACT.
          </p>
        </div>
        <Button onClick={() => mutate()} disabled={isGenerating}>
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {isGenerating ? 'Generating…' : 'Generate new modules'}
        </Button>
      </div>

      {isGenerating && (
        <div className="border-primary/20 bg-primary/5 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm text-primary">
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
          Generating new modules in the background — your current modules are
          still available.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {STATS.map(({ key, icon: Icon, label }) => (
          <div
            key={key}
            className="flex items-center gap-4 rounded-3xl border border-border/80 bg-card p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {statValues[key]}
              </p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {completedModules > 0 && (
        <section className="rounded-3xl border border-border/80 bg-secondary p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Your Progress
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                You’ve completed {completedModules} of {modules.length} modules.
              </p>
            </div>
            <div className="text-right">
              <div className="rounded-full bg-accent px-3 py-1 text-2xl font-bold text-foreground">
                {completionPct}%
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
        </section>
      )}

      {sections.map((section) => (
        <section key={section.type}>
          <div className="mb-5 flex items-center gap-4">
            <div
              className={`h-8 w-1 rounded-full ${getTherapyAccentBar(section.type)}`}
            />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                {section.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {section.items.map((mod) => (
              <ModuleCard
                key={mod.id}
                module={mod}
                iconColor={getTherapyIconColor(section.type)}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="rounded-3xl border border-border/80 bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-secondary text-sm font-bold text-primary">
            !
          </div>
          <div>
            <h3 className="mb-1 text-base font-semibold text-foreground">
              Important Safety Information
            </h3>
            <p className="text-sm text-muted-foreground">
              These modules are educational tools and not a substitute for
              professional mental health care. If you’re experiencing severe
              distress, thoughts of self-harm, or a mental health crisis, please
              contact a mental health professional, your doctor, or emergency
              services immediately.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
