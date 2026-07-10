'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ONE_DAY_IN_MS } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Activity,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Minus,
  Sparkles,
} from 'lucide-react';

type Trend = 'improving' | 'worsening' | 'stable' | 'insufficient_data';

type HealthTrends = {
  bloodPressure: { trend: Trend; summary: string; alerts: string[] };
  glucose: { trend: Trend; summary: string; alerts: string[] };
  overallAssessment: string;
  recommendations: string[];
};

const trendBadge: Record<
  Trend,
  { label: string; icon: React.ReactNode; className: string }
> = {
  improving: {
    label: 'Improving',
    icon: <TrendingUp className="h-3 w-3" />,
    className: 'bg-secondary text-primary',
  },
  worsening: {
    label: 'Worsening',
    icon: <TrendingDown className="h-3 w-3" />,
    className: 'bg-destructive/10 text-destructive',
  },
  stable: {
    label: 'Stable',
    icon: <Minus className="h-3 w-3" />,
    className: 'bg-muted text-muted-foreground',
  },
  insufficient_data: {
    label: 'Not enough data',
    icon: <Minus className="h-3 w-3" />,
    className: 'bg-muted text-muted-foreground',
  },
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
      <section className="border-border/80 rounded-3xl border bg-card p-6">
        <div className="mb-4 flex items-center gap-2 text-base font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Health Trends
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </section>
    );
  }

  if (isError || !data) return null;

  const sections = [
    {
      label: 'Blood Pressure',
      icon: <Activity className="h-4 w-4 text-primary" />,
      ...data.bloodPressure,
    },
    {
      label: 'Glucose',
      icon: <Activity className="h-4 w-4 text-primary" />,
      ...data.glucose,
    },
  ];

  return (
    <section className="border-border/80 rounded-3xl border bg-card p-6">
      <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        AI Health Trends
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {data.overallAssessment}
      </p>
      <div className="mt-4 space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {sections.map((s) => {
            const badge = trendBadge[s.trend];
            return (
              <div
                key={s.label}
                className="border-border/80 bg-secondary/40 space-y-2 rounded-2xl border p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {s.icon}
                    {s.label}
                  </div>
                  <Badge className={`gap-1 text-xs ${badge.className}`}>
                    {badge.icon}
                    {badge.label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{s.summary}</p>
                {s.alerts.length > 0 && (
                  <ul className="space-y-1">
                    {s.alerts.map((a, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {data.recommendations.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Recommendations
            </p>
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
      </div>
    </section>
  );
}
