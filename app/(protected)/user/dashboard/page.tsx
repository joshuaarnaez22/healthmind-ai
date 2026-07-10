export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/client';
import { getUserId } from '@/actions/server-actions/user';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { safeFormat } from '@/lib/utils';
import { Mood } from '@prisma/client';
import { CheckCircle2, Circle, ArrowRight } from 'lucide-react';
import OnboardingTour from '@/app/(protected)/user/_components/onboarding-tour';

const moodConfig: Record<Mood, { label: string; className: string }> = {
  TERRIBLE: {
    label: 'Terrible',
    className: 'border-red-200/80 bg-red-50 text-red-700',
  },
  BAD: {
    label: 'Bad',
    className: 'border-orange-200/80 bg-orange-50 text-orange-700',
  },
  NEUTRAL: {
    label: 'Neutral',
    className: 'border-amber-200/80 bg-amber-50 text-amber-800',
  },
  GOOD: {
    label: 'Good',
    className: 'border-emerald-200/80 bg-emerald-50 text-emerald-700',
  },
  GREAT: {
    label: 'Great',
    className: 'border-primary/20 bg-secondary text-primary',
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
  const showChecklist = completedSteps < gettingStarted.length;

  return (
    <div className="space-y-8">
      <OnboardingTour showTour />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          {getGreeting()}, {user?.firstName ?? 'there'}
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          {isNewUser
            ? 'Welcome to HealthMind — let\'s get you set up.'
            : 'Here\'s a snapshot of your wellness today.'}
        </p>
      </div>

      {showChecklist && (
        <section
          id="getting-started"
          data-tour="getting-started"
          className="rounded-3xl bg-secondary p-6 sm:p-7"
        >
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-primary">
                Start here
              </p>
              <h2 className="mt-1 text-lg font-bold tracking-tight">
                Getting started
              </h2>
            </div>
            <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
              {completedSteps} / {gettingStarted.length}
            </span>
          </div>
          <Progress
            value={(completedSteps / gettingStarted.length) * 100}
            className="mb-5 h-2 bg-background/60"
          />
          <ul className="space-y-2">
            {gettingStarted.map((step) => (
              <li key={step.href}>
                <Link
                  href={step.done ? '#' : step.href}
                  className={`flex items-center gap-3 rounded-2xl bg-background/70 px-4 py-3 text-sm transition-colors ${
                    step.done
                      ? 'cursor-default opacity-55'
                      : 'hover:bg-background'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={`font-medium ${step.done ? 'line-through' : ''}`}
                  >
                    {step.label}
                  </span>
                  {!step.done && (
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Mood */}
        <section className="rounded-3xl border border-border/80 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight">Mood this week</h2>
            <Link
              href="/user/journal"
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              New entry
            </Link>
          </div>
          {Object.keys(moodCounts).length === 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                No mood entries this week.
              </p>
              <Link
                href="/user/journal"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
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
        </section>

        {/* Journal */}
        <section className="rounded-3xl border border-border/80 bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight">
              Latest journal
            </h2>
            <Link
              href="/user/journal"
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {!recentJournal ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                No journal entries yet.
              </p>
              <Link
                href="/user/journal"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Write your first entry <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="truncate font-semibold">
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
        </section>

        {/* Goals */}
        <section className="rounded-3xl bg-secondary p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight">
              Goals overview
            </h2>
            <Link
              href="/user/goals"
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {totalGoals === 0 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">No goals set yet.</p>
              <Link
                href="/user/goals"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Set your first goal <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-4 text-sm">
                <span>
                  <span className="font-bold">{totalGoals}</span>{' '}
                  <span className="text-muted-foreground">total</span>
                </span>
                <span>
                  <span className="font-bold text-emerald-700">
                    {completedGoals}
                  </span>{' '}
                  <span className="text-muted-foreground">done</span>
                </span>
                <span>
                  <span className="font-bold text-primary">
                    {inProgressGoals}
                  </span>{' '}
                  <span className="text-muted-foreground">in progress</span>
                </span>
              </div>
              <div className="space-y-1">
                <Progress value={completionPct} className="h-2 bg-background/60" />
                <p className="text-xs text-muted-foreground">
                  {completionPct}% complete
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Vitals */}
        <section className="rounded-3xl border border-border/80 bg-[oklch(0.964_0.022_139)] p-6 dark:bg-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-bold tracking-tight">
              Latest vitals
            </h2>
            <Link
              href="/user/insights/health-tracker"
              className="text-xs font-medium text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {!latestBP && !latestGlucose ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">No readings yet.</p>
              <Link
                href="/user/insights/health-tracker"
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                Log your first reading <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="flex gap-6">
              {latestBP && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Blood pressure
                  </p>
                  <p className="text-2xl font-bold tabular-nums tracking-tight">
                    {latestBP.systolic}/{latestBP.diastolic}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {safeFormat(latestBP.loggedAt, 'MMM do')}
                  </p>
                </div>
              )}
              {latestGlucose && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Glucose
                  </p>
                  <p className="text-2xl font-bold tabular-nums tracking-tight">
                    {Number(latestGlucose.glucose)}{' '}
                    <span className="text-sm font-medium text-muted-foreground">
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
        </section>
      </div>
    </div>
  );
}
