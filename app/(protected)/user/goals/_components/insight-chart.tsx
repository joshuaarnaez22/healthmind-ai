'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { useSidebar } from '@/components/ui/sidebar';
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

interface InsightsChartProps {
  totalCheckIns?: number;
  totalReflection?: number;
  totalCompletedGoals?: number;
  totalActiveGoals?: number;
}

export default function InsightsChart({
  totalCheckIns = 0,
  totalReflection = 0,
  totalCompletedGoals = 0,
  totalActiveGoals = 0,
}: InsightsChartProps) {
  const activityData = [
    {
      name: 'Check-ins',
      value: totalCheckIns,
      color: 'hsl(var(--chart-1))',
    },
    {
      name: 'Reflections',
      value: totalReflection,
      color: 'hsl(var(--chart-2))',
    },
    {
      name: 'Completed Goals',
      value: totalCompletedGoals,
      color: 'hsl(var(--chart-3))',
    },
    {
      name: 'Active Goals',
      value: totalActiveGoals,
      color: 'hsl(var(--chart-4))',
    },
  ];

  const goalsData = [
    {
      name: 'Completed',
      value: totalCompletedGoals,
      color: 'hsl(var(--chart-3))',
    },
    {
      name: 'Active',
      value: totalActiveGoals,
      color: 'hsl(var(--chart-4))',
    },
  ];

  const chartConfig = {
    checkIns: {
      label: 'Check-ins',
      color: 'hsl(var(--chart-1))',
    },
    reflections: {
      label: 'Reflections',
      color: 'hsl(var(--chart-2))',
    },
    completedGoals: {
      label: 'Completed Goals',
      color: 'hsl(var(--chart-3))',
    },
    activeGoals: {
      label: 'Active Goals',
      color: 'hsl(var(--chart-4))',
    },
  };

  const { open: sidebarOpen } = useSidebar();

  const stats = [
    { label: 'Total Check-ins', value: totalCheckIns },
    { label: 'Reflections Tracked', value: totalReflection },
    { label: 'Completed Goals', value: totalCompletedGoals },
    { label: 'Active Goals', value: totalActiveGoals },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border/80 bg-secondary p-3 text-center"
          >
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </div>
        ))}
      </div>

      <div
        className={`grid gap-4 ${
          sidebarOpen
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        <div className="rounded-3xl border border-border/80 bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Activity Overview
          </h3>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart
                data={activityData}
                margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
              >
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  angle={-30}
                  textAnchor="end"
                  height={80}
                />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>

        <div className="rounded-3xl border border-border/80 bg-card p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">
            Goals Distribution
          </h3>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={goalsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {goalsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="mt-4 flex justify-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-3))]" />
              <span>Completed ({totalCompletedGoals})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[hsl(var(--chart-4))]" />
              <span>Active ({totalActiveGoals})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border/80 bg-secondary p-5">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">
              {totalCheckIns + totalReflection}
            </div>
            <div className="text-sm text-muted-foreground">Total Activities</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {totalCompletedGoals + totalActiveGoals}
            </div>
            <div className="text-sm text-muted-foreground">Total Goals</div>
          </div>
        </div>
        {totalCompletedGoals + totalActiveGoals > 0 && (
          <div className="mt-4 border-t border-border/80 pt-4 text-center">
            <div className="inline-block rounded-full bg-accent px-3 py-1 text-lg font-semibold text-foreground">
              {Math.round(
                (totalCompletedGoals /
                  (totalCompletedGoals + totalActiveGoals)) *
                  100
              )}
              %
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Goal Completion Rate
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
