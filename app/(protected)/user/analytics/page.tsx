import { prisma } from '@/lib/client';
import { getUserId } from '@/actions/server-actions/user';
import BarChartComponent from './_components/bar-chart';

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

  // Build a map of "Mon YYYY" -> mood counts
  const monthMap = new Map<
    string,
    { order: number; TERRIBLE: number; BAD: number; NEUTRAL: number; GOOD: number; GREAT: number }
  >();

  for (const journal of journals) {
    const d = new Date(journal.addedAt);
    const label = d.toLocaleString('en-US', { month: 'short' });
    const order = d.getFullYear() * 100 + d.getMonth();

    if (!monthMap.has(label)) {
      monthMap.set(label, { order, TERRIBLE: 0, BAD: 0, NEUTRAL: 0, GOOD: 0, GREAT: 0 });
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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <BarChartComponent data={chartData} />
    </div>
  );
}
