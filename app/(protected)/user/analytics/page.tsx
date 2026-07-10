export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/client';
import { getUserId } from '@/actions/server-actions/user';
import BarChartComponent from './_components/bar-chart';
import MoodInsightsPanel from './_components/mood-insights-panel';
import Link from 'next/link';
import { ArrowRight, BarChart2 } from 'lucide-react';

const MOOD_KEYS = ['TERRIBLE', 'BAD', 'NEUTRAL', 'GOOD', 'GREAT'] as const;

export default async function AnalyticsPage() {
  const userId = await getUserId();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const journals = await prisma.journal.findMany({
    where: { userId, addedAt: { gte: sixMonthsAgo } },
    select: { mood: true, addedAt: true },
    orderBy: { addedAt: 'asc' },
  });

  const monthMap = new Map<
    string,
    {
      order: number;
      TERRIBLE: number;
      BAD: number;
      NEUTRAL: number;
      GOOD: number;
      GREAT: number;
    }
  >();

  for (const journal of journals) {
    const d = new Date(journal.addedAt);
    const label = d.toLocaleString('en-US', { month: 'short' });
    const order = d.getFullYear() * 100 + d.getMonth();

    if (!monthMap.has(label)) {
      monthMap.set(label, {
        order,
        TERRIBLE: 0,
        BAD: 0,
        NEUTRAL: 0,
        GOOD: 0,
        GREAT: 0,
      });
    }

    const entry = monthMap.get(label)!;
    const mood = journal.mood as (typeof MOOD_KEYS)[number];
    if (MOOD_KEYS.includes(mood)) {
      entry[mood] += 1;
    }
  }

  const chartData = Array.from(monthMap.entries())
    .sort((a, b) => a[1].order - b[1].order)
    .map(([month, counts]) => ({
      month,
      TERRIBLE: counts.TERRIBLE,
      BAD: counts.BAD,
      NEUTRAL: counts.NEUTRAL,
      GOOD: counts.GOOD,
      GREAT: counts.GREAT,
    }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Mood patterns from your journal entries over the last 6 months.
        </p>
      </div>
      {chartData.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border/80 bg-secondary py-20 text-center">
          <BarChart2 className="h-9 w-9 text-primary opacity-70" />
          <div>
            <p className="text-sm font-medium text-foreground">
              No mood data yet
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Start writing journal entries to see mood patterns here.
            </p>
          </div>
          <Link
            href="/user/journal"
            className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            Go to Journal
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : (
        <>
          <BarChartComponent data={chartData} />
          <MoodInsightsPanel />
        </>
      )}
    </div>
  );
}
