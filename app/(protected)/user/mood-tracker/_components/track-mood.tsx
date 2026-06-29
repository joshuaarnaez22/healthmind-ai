'use client';
import MoodModal from './mood-modal';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { safeFormat } from '@/lib/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Journal } from '@prisma/client';
import { moods } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import { Smile } from 'lucide-react';

function getMoodMeta(moodValue: string) {
  return moods.find((m) => m.value === moodValue);
}

export default function TrackMood() {
  const queryClient = useQueryClient();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateKey = selectedDate.toISOString();

  const {
    data: journals,
    isLoading,
    isError,
  } = useQuery<Journal[]>({
    queryKey: ['moods', dateKey],
    queryFn: async ({ signal }) => {
      const response = await fetch(
        `/api/journal?date=${selectedDate.toISOString()}`,
        { signal }
      );
      if (!response.ok) throw new Error('Failed to fetch mood entries');
      const json = await response.json();
      return json.journals ?? [];
    },
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['moods', dateKey] });
  };

  const count = journals?.length ?? 0;

  return (
    <motion.div {...pageAnimations} className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Mood Tracker
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Log how you feel each day and spot patterns over time.
          </p>
        </div>
        <MoodModal date={selectedDate} onSuccess={handleSuccess} />
      </div>

      {/* Two-column layout */}
      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        {/* Calendar card */}
        <Card className="h-fit">
          <CardContent className="p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(d) => d && setSelectedDate(d)}
              classNames={{
                month_caption: 'ms-2.5 me-20 justify-start',
                nav: 'justify-end',
              }}
            />
          </CardContent>
        </Card>

        {/* Entries panel */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <CardTitle className="text-base font-semibold">
                  {safeFormat(selectedDate, 'EEEE, MMMM do, yyyy')}
                </CardTitle>
                <CardDescription className="mt-0.5 text-xs">
                  {isLoading
                    ? 'Loading…'
                    : count > 0
                      ? `${count} mood ${count === 1 ? 'entry' : 'entries'} recorded`
                      : 'No mood recorded for this day'}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 space-y-2">
            {isLoading && (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full rounded-xl" />
                <Skeleton className="h-14 w-full rounded-xl" />
              </div>
            )}
            {isError && (
              <p className="text-sm text-destructive">
                Failed to load entries.
              </p>
            )}
            {!isLoading && !isError && count > 0 && (
              <ul className="space-y-2">
                {journals!.map((journal) => {
                  const meta = getMoodMeta(journal.mood);
                  const Icon = meta?.icon;
                  return (
                    <li
                      key={journal.id}
                      className="flex items-start gap-3 rounded-xl border bg-card p-3 transition-shadow hover:shadow-sm"
                    >
                      {/* Mood badge */}
                      <Badge
                        className={`mt-0.5 shrink-0 gap-1 px-2 py-0.5 text-xs font-medium hover:opacity-90 ${meta?.bgColor ?? ''} ${meta?.color ?? ''}`}
                      >
                        {Icon && <Icon className="h-3 w-3" />}
                        {meta?.label ?? journal.mood}
                      </Badge>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        {journal.content && (
                          <p className="truncate text-sm text-muted-foreground">
                            {journal.content}
                          </p>
                        )}
                      </div>

                      {/* Time */}
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {safeFormat(new Date(journal.addedAt), 'h:mm a')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
            {!isLoading && !isError && count === 0 && (
              <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                <Smile className="h-7 w-7 opacity-40" />
                <p className="text-sm">No mood logged for this day yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
