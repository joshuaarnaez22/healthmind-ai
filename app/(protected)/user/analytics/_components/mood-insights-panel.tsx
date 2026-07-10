'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ONE_DAY_IN_MS } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertTriangle,
  Lightbulb,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Minus,
} from 'lucide-react';

type InsightType = 'pattern' | 'warning' | 'positive' | 'suggestion';

type MoodInsights = {
  dominantMood: string;
  summary: string;
  insights: { title: string; description: string; type: InsightType }[];
  weeklyTrend: 'improving' | 'declining' | 'stable';
};

const insightIcons: Record<InsightType, React.ReactNode> = {
  pattern: <Sparkles className="h-4 w-4 text-primary" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-600" />,
  positive: <TrendingUp className="h-4 w-4 text-primary" />,
  suggestion: <Lightbulb className="h-4 w-4 text-primary" />,
};

const trendConfig = {
  improving: {
    icon: <TrendingUp className="h-4 w-4" />,
    label: 'Improving',
    className: 'bg-secondary text-primary',
  },
  declining: {
    icon: <TrendingDown className="h-4 w-4" />,
    label: 'Declining',
    className: 'bg-destructive/10 text-destructive',
  },
  stable: {
    icon: <Minus className="h-4 w-4" />,
    label: 'Stable',
    className: 'bg-muted text-muted-foreground',
  },
};

const PROMPT = `Analyze the user's recent mood journal entries. Identify patterns (e.g. recurring low moods on certain days), positive streaks, warning signs, and actionable suggestions. Return concise, empathetic insights. Base everything strictly on the data provided.`;

export default function MoodInsightsPanel() {
  const { user, isLoaded } = useUser();
  const userId = user?.id;

  const { data, isLoading, isError } = useQuery<MoodInsights | null>({
    queryKey: ['mood-insights', userId],
    queryFn: async () => {
      const res = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: PROMPT,
          cachedKey: `mood-insights:${userId}`,
          schema: 'mood_insights',
        }),
      });
      if (!res.ok) throw new Error('Failed to fetch mood insights');
      const { data } = await res.json();
      return data;
    },
    staleTime: ONE_DAY_IN_MS,
    gcTime: ONE_DAY_IN_MS,
    enabled: !!userId && isLoaded,
  });

  if (isLoading) {
    return (
      <section className="rounded-3xl border border-border/80 bg-card p-6">
        <div className="mb-4 flex items-center gap-2 text-base font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Mood Insights
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </section>
    );
  }

  if (isError || !data) return null;

  const trend = trendConfig[data.weeklyTrend];

  return (
    <section className="rounded-3xl border border-border/80 bg-card p-6">
      <div className="mb-1 flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Mood Insights
        </h2>
        <Badge className={`gap-1 text-xs ${trend.className}`}>
          {trend.icon}
          {trend.label} trend
        </Badge>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{data.summary}</p>
      <div className="mt-4 space-y-2">
        {data.insights.map((insight, i) => (
          <div
            key={i}
            className="flex items-start gap-3 rounded-2xl border border-border/80 bg-secondary/50 p-3"
          >
            <span className="mt-0.5 shrink-0">
              {insightIcons[insight.type]}
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">
                {insight.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {insight.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
