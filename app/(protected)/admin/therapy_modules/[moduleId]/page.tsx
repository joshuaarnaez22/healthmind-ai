import React from 'react';
import Module from '../_components/module';
import redis from '@/lib/upstash';
import { auth } from '@clerk/nextjs/server';
import { TherapyModule } from '@/lib/types';
import { notFound, redirect } from 'next/navigation';
interface ModuleOverviewProps {
  params: Promise<{
    moduleId: string;
  }>;
}

export default async function ModuleOverView({ params }: ModuleOverviewProps) {
  const { moduleId } = await params;
  const { userId } = await auth();
  const cachedKey = `cbt_module:${userId}`;

  if (!userId) redirect('/');

  const getModules: TherapyModule[] | null = await redis.get(cachedKey);

  if (!getModules) notFound();

  const cbtModule = getModules.filter((module) => module.id === moduleId)[0];

  if (!cbtModule) notFound();

  return <Module moduleData={cbtModule} moduleId={moduleId} />;
}
