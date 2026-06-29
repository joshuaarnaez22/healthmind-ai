'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';
import { ONE_DAY_IN_MS } from '@/lib/constant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Lightbulb, Sparkles, TrendingDown, TrendingUp, Minus } from 'lucide-react';

type InsightType = 'pattern' | 'warning' | 'positive' | 'suggestion';

type MoodInsights = {
  dominantMood: string;
  summary: string;
  insights: { title: string; description: string; type: InsightType }[];
  weeklyTrend: 'improving' | 'declining' | 'stable';
};

const insightIcons: Record<InsightType, React.ReactNode> = {
  pattern: <Sparkles className="h-4 w-4 text-primary" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
  positive: <TrendingUp className="h-4 w-4 text-emerald-500" />,
  suggestion: <Lightbulb className="h-4 w-4 text-blue-500" />,
};

const insightBg: Record<InsightType, string> = {
  pattern: 'bg-primary/5 border-primary/20',
  warning: 'bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-900/50',
  positive: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50',
  suggestion: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50',
};

const trendConfig = {
  improving: { icon: <TrendingUp className="h-4 w-4" />, label: 'Improving', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  declining: { icon: <TrendingDown className="h-4 w-4" />, label: 'Declining', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  stable: { icon: <Minus className="h-4 w-4" />, label: 'Stable', className: 'bg-muted text-muted-foreground' },
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
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Sparkles className="h-4 w-4 text-primary" />AI Mood Insights</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (isError || !data) return null;

  const trend = trendConfig[data.weeklyTrend];

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sparkles className="h-4 w-4 text-primary" />
            AI Mood Insights
          </CardTitle>
          <Badge className={`gap-1 text-xs ${trend.className}`}>
            {trend.icon}{trend.label} trend
          </Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{data.summary}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.insights.map((insight, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-xl border p-3 ${insightBg[insight.type]}`}>
            <span className="mt-0.5 shrink-0">{insightIcons[insight.type]}</span>
            <div>
              <p className="text-sm font-medium">{insight.title}</p>
              <p className="text-xs text-muted-foreground">{insight.description}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
