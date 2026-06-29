import { prisma } from '@/lib/client';
import { getUserId } from '@/actions/server-actions/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { safeFormat } from '@/lib/utils';
import { Mood } from '@prisma/client';

const moodConfig: Record<Mood, { label: string; className: string }> = {
  TERRIBLE: { label: 'Terrible', className: 'bg-red-100 text-red-700 border-red-200' },
  BAD: { label: 'Bad', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  NEUTRAL: { label: 'Neutral', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  GOOD: { label: 'Good', className: 'bg-green-100 text-green-700 border-green-200' },
  GREAT: { label: 'Great', className: 'bg-blue-100 text-blue-700 border-blue-200' },
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
  const completionPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="font-heading text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.firstName ?? 'there'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s a snapshot of your wellness today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
        {/* Mood Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">
              Mood This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(moodCounts).length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No mood entries this week.
              </p>
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
              <p className="text-sm text-muted-foreground">
                No journal entries yet.
              </p>
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
              <p className="text-sm text-muted-foreground">No goals set yet.</p>
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
              <p className="text-sm text-muted-foreground">No readings yet.</p>
            ) : (
              <div className="flex gap-6">
                {latestBP && (
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
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
