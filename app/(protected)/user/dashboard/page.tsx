export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/client';
import { getUserId } from '@/actions/server-actions/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { safeFormat } from '@/lib/utils';
import { Mood } from '@prisma/client';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';

const moodConfig: Record<Mood, { label: string; className: string }> = {
  TERRIBLE: {
    label: 'Terrible',
    className: 'bg-red-100 text-red-700 border-red-200',
  },
  BAD: {
    label: 'Bad',
    className: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  NEUTRAL: {
    label: 'Neutral',
    className: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  },
  GOOD: {
    label: 'Good',
    className: 'bg-green-100 text-green-700 border-green-200',
  },
  GREAT: {
    label: 'Great',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
  },
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardPage() {
  const userId = await getUserId();

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const [user, moodJournals, recentJournal, goals, latestBP, latestGlucose] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { firstName: true },
      }),
      prisma.journal.findMany({
        where: { userId, addedAt: { gte: sevenDaysAgo } },
        select: { mood: true },
      }),
      prisma.journal.findFirst({
        where: { userId },
        orderBy: { addedAt: 'desc' },
        select: { title: true, mood: true, addedAt: true, content: true },
      }),
      prisma.goal.findMany({
        where: { userId },
        select: { isCompleted: true },
      }),
      prisma.bloodPressureLog.findFirst({
        where: { userId },
        orderBy: { loggedAt: 'desc' },
        select: { systolic: true, diastolic: true, loggedAt: true },
      }),
      prisma.glucoseLog.findFirst({
        where: { userId },
        orderBy: { loggedAt: 'desc' },
        select: { glucose: true, loggedAt: true },
      }),
    ]);

  const moodCounts = moodJournals.reduce<Partial<Record<Mood, number>>>(
    (acc, j) => {
      if (j.mood) acc[j.mood] = (acc[j.mood] ?? 0) + 1;
      return acc;
    },
    {}
  );

  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.isCompleted).length;
  const inProgressGoals = totalGoals - completedGoals;
  const completionPct =
    totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  const isNewUser =
    !recentJournal && totalGoals === 0 && !latestBP && !latestGlucose;

  const gettingStarted = [
    {
      label: 'Write a journal entry',
      href: '/user/journal',
      done: !!recentJournal,
    },
    {
      label: 'Track a vital (BP or glucose)',
      href: '/user/insights/health-tracker',
      done: !!latestBP || !!latestGlucose,
    },
    { label: 'Set a wellness goal', href: '/user/goals', done: totalGoals > 0 },
  ];
  const completedSteps = gettingStarted.filter((s) => s.done).length;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName ?? 'there'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {isNewUser
            ? "Welcome to HealthMind — let's get you set up."
            : "Here's a snapshot of your wellness today."}
        </p>
      </div>

      {/* Getting started checklist — shown until all steps done */}
      {completedSteps < gettingStarted.length && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Getting started
              </CardTitle>
              <span className="text-xs text-muted-foreground">
                {completedSteps} / {gettingStarted.length} done
              </span>
            </div>
            <Progress
              value={(completedSteps / gettingStarted.length) * 100}
              className="h-1.5"
            />
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {gettingStarted.map((step) => (
                <li key={step.href}>
                  <Link
                    href={step.done ? '#' : step.href}
                    className={`flex items-center gap-3 rounded-lg px-2 py-1.5 text-sm transition-colors ${step.done ? 'cursor-default opacity-50' : 'hover:bg-primary/10'}`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className={step.done ? 'line-through' : ''}>
                      {step.label}
                    </span>
                    {!step.done && (
                      <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {/* Mood Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Mood This Week
              </CardTitle>
              <Link
                href="/user/journal"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                New entry
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {Object.keys(moodCounts).length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  No mood entries this week.
                </p>
                <Link
                  href="/user/journal"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Write your first entry <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {(Object.entries(moodCounts) as [Mood, number][]).map(
                  ([mood, count]) => (
                    <Badge
                      key={mood}
                      variant="outline"
                      className={moodConfig[mood].className}
                    >
                      {moodConfig[mood].label}: {count}
                    </Badge>
                  )
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Journal */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Latest Journal Entry
              </CardTitle>
              <Link
                href="/user/journal"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {!recentJournal ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  No journal entries yet.
                </p>
                <Link
                  href="/user/journal"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Write your first entry <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">
                    {recentJournal.title}
                  </span>
                  {recentJournal.mood && (
                    <Badge
                      variant="outline"
                      className={`shrink-0 ${moodConfig[recentJournal.mood].className}`}
                    >
                      {moodConfig[recentJournal.mood].label}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {safeFormat(recentJournal.addedAt, 'EEE, MMM do yyyy')}
                </p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {recentJournal.content.slice(0, 100)}
                  {recentJournal.content.length > 100 ? '…' : ''}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Goals Summary */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Goals Overview
              </CardTitle>
              <Link
                href="/user/goals"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {totalGoals === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  No goals set yet.
                </p>
                <Link
                  href="/user/goals"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Set your first goal <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <>
                <div className="flex gap-4 text-sm">
                  <span>
                    <span className="font-medium">{totalGoals}</span>{' '}
                    <span className="text-muted-foreground">total</span>
                  </span>
                  <span>
                    <span className="font-medium text-green-600">
                      {completedGoals}
                    </span>{' '}
                    <span className="text-muted-foreground">completed</span>
                  </span>
                  <span>
                    <span className="font-medium text-primary">
                      {inProgressGoals}
                    </span>{' '}
                    <span className="text-muted-foreground">in progress</span>
                  </span>
                </div>
                <div className="space-y-1">
                  <Progress value={completionPct} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {completionPct}% complete
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Latest Vitals */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">
                Latest Vitals
              </CardTitle>
              <Link
                href="/user/insights/health-tracker"
                className="text-xs text-muted-foreground underline-offset-4 hover:underline"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {!latestBP && !latestGlucose ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">
                  No readings yet.
                </p>
                <Link
                  href="/user/insights/health-tracker"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Log your first reading <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <div className="flex gap-6">
                {latestBP && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Blood Pressure
                    </p>
                    <p className="text-xl font-semibold tabular-nums">
                      {latestBP.systolic}/{latestBP.diastolic}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {safeFormat(latestBP.loggedAt, 'MMM do')}
                    </p>
                  </div>
                )}
                {latestGlucose && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Glucose
                    </p>
                    <p className="text-xl font-semibold tabular-nums">
                      {Number(latestGlucose.glucose)}{' '}
                      <span className="text-sm font-normal text-muted-foreground">
                        mg/dL
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {safeFormat(latestGlucose.loggedAt, 'MMM do')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
