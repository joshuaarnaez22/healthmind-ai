'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

type MoodMonthData = {
  month: string;
  TERRIBLE: number;
  BAD: number;
  NEUTRAL: number;
  GOOD: number;
  GREAT: number;
};

const chartConfig = {
  TERRIBLE: {
    label: 'Terrible',
    color: 'oklch(0.560 0.190 22)',
  },
  BAD: {
    label: 'Bad',
    color: 'oklch(0.660 0.140 65)',
  },
  NEUTRAL: {
    label: 'Neutral',
    color: 'oklch(0.720 0.120 85)',
  },
  GOOD: {
    label: 'Good',
    color: 'oklch(0.520 0.130 162)',
  },
  GREAT: {
    label: 'Great',
    color: 'oklch(0.55 0.2 250)',
  },
} satisfies ChartConfig;

export default function BarChartComponent({ data }: { data: MoodMonthData[] }) {
  return (
    <section className="border-border/80 w-full rounded-3xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Mood Analytics
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Moods from your journal entries over the last 6 months
        </p>
      </div>
      <ChartContainer config={chartConfig} className="h-[220px] w-full">
        <BarChart accessibilityLayer data={data} barSize={28}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="TERRIBLE"
            fill="var(--color-TERRIBLE)"
            radius={4}
            stackId="a"
          />
          <Bar dataKey="BAD" fill="var(--color-BAD)" radius={4} stackId="a" />
          <Bar
            dataKey="NEUTRAL"
            fill="var(--color-NEUTRAL)"
            radius={4}
            stackId="a"
          />
          <Bar dataKey="GOOD" fill="var(--color-GOOD)" radius={4} stackId="a" />
          <Bar
            dataKey="GREAT"
            fill="var(--color-GREAT)"
            radius={4}
            stackId="a"
          />
        </BarChart>
      </ChartContainer>
    </section>
  );
}
