'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ONE_DAY_IN_MS } from '@/lib/constant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Activity, AlertTriangle, TrendingDown, TrendingUp, Minus, Sparkles } from 'lucide-react';

type Trend = 'improving' | 'worsening' | 'stable' | 'insufficient_data';

type HealthTrends = {
  bloodPressure: { trend: Trend; summary: string; alerts: string[] };
  glucose: { trend: Trend; summary: string; alerts: string[] };
  overallAssessment: string;
  recommendations: string[];
};

const trendBadge: Record<Trend, { label: string; icon: React.ReactNode; className: string }> = {
  improving: { label: 'Improving', icon: <TrendingUp className="h-3 w-3" />, className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  worsening: { label: 'Worsening', icon: <TrendingDown className="h-3 w-3" />, className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  stable: { label: 'Stable', icon: <Minus className="h-3 w-3" />, className: 'bg-muted text-muted-foreground' },
  insufficient_data: { label: 'Not enough data', icon: <Minus className="h-3 w-3" />, className: 'bg-muted text-muted-foreground' },
};

export default function HealthTrendsPanel() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const { data, isLoading, isError } = useQuery<HealthTrends | null>({
    queryKey: ['health-trends', userId],
    queryFn: async () => {
      const res = await fetch('/api/health-trends');
      if (!res.ok) throw new Error('Failed to fetch health trends');
      const { data } = await res.json();
      return data;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: !!userId && isLoaded,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" />AI Health Trends</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-20 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) return null;

  const sections = [
    { label: 'Blood Pressure', icon: <Activity className="h-4 w-4 text-red-500" />, ...data.bloodPressure },
    { label: 'Glucose', icon: <Activity className="h-4 w-4 text-blue-500" />, ...data.glucose },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Health Trends
        </CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{data.overallAssessment}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Vitals sections */}
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((s) => {
            const badge = trendBadge[s.trend];
            return (
              <div key={s.label} className="rounded-xl border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {s.icon}{s.label}
                  </div>
                  <Badge className={`gap-1 text-xs ${badge.className}`}>{badge.icon}{badge.label}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.summary}</p>
                {s.alerts.length > 0 && (
                  <ul className="space-y-1">
                    {s.alerts.map((a, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />{a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recommendations</p>
            <ul className="space-y-1">
              {data.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
