'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {totalCheckIns}
          </div>
          <div className="text-xs text-muted-foreground">Total Check-ins</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {totalReflection}
          </div>
          <div className="text-xs text-muted-foreground">
            Reflections Tracked
          </div>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {totalCompletedGoals}
          </div>
          <div className="text-xs text-muted-foreground">Completed Goals</div>
        </Card>

        <Card className="p-3 text-center">
          <div className="text-2xl font-bold text-orange-600">
            {totalActiveGoals}
          </div>
          <div className="text-xs text-muted-foreground">Active Goals</div>
        </Card>
      </div>

      <div
        className={`grid gap-4 ${
          sidebarOpen
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2'
        }`}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
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
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {activityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Goals Distribution</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {totalCheckIns + totalReflection}
              </div>
              <div className="text-sm text-muted-foreground">
                Total Activities
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {totalCompletedGoals + totalActiveGoals}
              </div>
              <div className="text-sm text-muted-foreground">Total Goals</div>
            </div>
          </div>
          {totalCompletedGoals + totalActiveGoals > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">
                  {Math.round(
                    (totalCompletedGoals /
                      (totalCompletedGoals + totalActiveGoals)) *
                      100
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Goal Completion Rate
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
