'use client';

import Link from 'next/link';
import { pageAnimations } from '@/lib/motion';
import { motion } from 'framer-motion';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { cbtModulesPrompt } from '@/lib/prompts';
import { ONE_DAY_IN_MS } from '@/lib/constant';
import { TherapyModule } from '@/lib/types';
import { DynamicIcon } from 'lucide-react/dynamic';

export default function Modules() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;

  const {
    data: cbtModule,
    isLoading,
    isError,
  } = useQuery<TherapyModule[]>({
    queryKey: ['therapy_modules', 'cbt_module', userId],
    queryFn: async () => {
      const response = await fetch('/api/modules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: cbtModulesPrompt,
          cachedKey: `cbt_module:${userId}`,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate modules');
      }
      const { data } = await response.json();

      return data;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: isUserLoaded,
  });

  if (isLoading) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>Error</h1>;
  }
  return (
    <motion.div {...pageAnimations}>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Therapy Modules</h1>
          <p className="mt-1 text-muted-foreground">
            Simple, evidence-based tools to support your mental health journey.
            Each module is designed for clarity, ease of use, and small wins.
          </p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cbtModule?.map((module, index) => {
          return (
            <Card
              key={index}
              className="transition-shadow duration-200 hover:shadow-lg"
            >
              <CardHeader className="pb-4">
                <div
                  className={`h-12 w-12 rounded-lg ${module.color} mb-3 flex items-center justify-center`}
                >
                  <DynamicIcon
                    className={`h-6 w-6 ${module.iconColor}`}
                    name={module.icon as never}
                  />
                </div>
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
      </div>

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
