'use client';
import MoodModal from './mood-modal';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { safeFormat } from '@/lib/utils';
import { DateRange } from 'react-day-picker';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Journal } from '@prisma/client';
import { moods } from '@/lib/constant';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

function getMoodMeta(moodValue: string) {
  return moods.find((m) => m.value === moodValue);
}

export default function TrackMood() {
  const queryClient = useQueryClient();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // Use the "from" date for fetching and passing to modal
  const selectedDate = date?.from ?? new Date();
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
        {
          signal,
        }
      );
      if (!response.ok) throw new Error('Failed to fetch mood entries');
      const json = await response.json();
      return json.journals ?? [];
    },
  });

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['moods', dateKey] });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Mood Tracker</h2>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            Select a date to view or add mood entries
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate}
            className="rounded-lg border border-border bg-background p-2"
            classNames={{
              month_caption: 'ms-2.5 me-20 justify-start',
              nav: 'justify-end',
            }}
          />

          <Card className="w-full">
            <CardHeader className="flex items-start justify-between space-y-3 pb-2 sm:flex-row sm:items-center sm:space-y-0">
              <div>
                {date ? (
                  <CardTitle className="text-xl font-semibold text-primary">
                    {safeFormat(date.from, 'EEEE, MMMM do, yyyy')}
                    {date.to &&
                      date.to.toDateString() !== date.from?.toDateString() && (
                        <>
                          {' '}
                          &mdash; {safeFormat(date.to, 'EEEE, MMMM do, yyyy')}
                        </>
                      )}
                  </CardTitle>
                ) : (
                  <CardTitle className="text-xl font-semibold text-primary">
                    {safeFormat(new Date(), 'EEEE, MMMM do, yyyy')}
                  </CardTitle>
                )}
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  {isLoading
                    ? 'Loading…'
                    : journals && journals.length > 0
                      ? `${journals.length} mood entr${journals.length === 1 ? 'y' : 'ies'} recorded`
                      : 'No mood recorded for this day'}
                </CardDescription>
              </div>
              <MoodModal date={selectedDate} onSuccess={handleSuccess} />
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading && (
                <div className="space-y-2">
                  <Skeleton className="h-14 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
                </div>
              )}
              {isError && (
                <p className="text-sm text-destructive">
                  Failed to load entries.
                </p>
              )}
              {!isLoading && !isError && journals && journals.length > 0 && (
                <ul className="space-y-2">
                  {journals.map((journal) => {
                    const meta = getMoodMeta(journal.mood);
                    const Icon = meta?.icon;
                    return (
                      <li
                        key={journal.id}
                        className="bg-muted/30 flex items-start gap-3 rounded-lg border border-border p-3"
                      >
                        {Icon && (
                          <Icon
                            className={`mt-0.5 h-5 w-5 shrink-0 ${meta?.color ?? ''}`}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={`text-xs ${meta?.bgColor ?? ''} ${meta?.color ?? ''}`}
                            >
                              {meta?.label ?? journal.mood}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {safeFormat(new Date(journal.addedAt), 'h:mm a')}
                            </span>
                          </div>
                          {journal.content && (
                            <p className="mt-1 truncate text-sm text-muted-foreground">
                              {journal.content}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
