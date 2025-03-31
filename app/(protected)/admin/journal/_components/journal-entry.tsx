'use client';
import NewEntryModal from './new-entry-modal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { safeFormat } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import JournalEntryCard from './journal-entry-card';
import { Skeleton } from '@/components/ui/skeleton';
import { Journal } from '@prisma/client';
import React from 'react';

export default function JournalEntry() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const dateKey = date?.toISOString().split('T')[0];
  const {
    data: journals,
    isLoading,
    isError,
  } = useQuery<Journal[]>({
    queryKey: ['journals', dateKey],
    queryFn: async ({ signal }) => {
      if (!date) return [];
      const response = await fetch(`/api/journal?date=${date}`, {
        signal,
      });
      const data = await response.json();
      return data.journals;
    },
  });

  const hasEntries = journals && journals.length > 0;
  const dateRangeText = date
    ? `${safeFormat(date, 'EEEE, MMMM do, yyyy')}`
    : 'Select a date ';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">My Mental Health Journal</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            Select a date to view or add journal entries
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-shrink-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg border border-border bg-background p-2"
              classNames={{
                month_caption: 'ms-2.5 me-20 justify-start',
                nav: 'justify-end',
              }}
              numberOfMonths={1}
            />
          </div>

          <Card className="w-full">
            <CardHeader className="flex items-start justify-between space-y-3 pb-2 sm:flex-row sm:items-center sm:space-y-0">
              <div>
                <CardTitle className="text-xl font-semibold text-primary">
                  {dateRangeText}
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  {hasEntries
                    ? `${journals.length} entries found`
                    : 'No journal entries for this period'}
                </CardDescription>
              </div>

              <NewEntryModal date={date} />
            </CardHeader>
            <CardContent className="mt-8">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, index) => (
                    <Skeleton className="h-20 w-full" key={index} />
                  ))}
                </div>
              ) : isError ? (
                <div>
                  <div className="py-4 text-center text-destructive">
                    Error loading journals
                  </div>
                </div>
              ) : hasEntries ? (
                <div className="space-y-3">
                  {journals.map((journal) => (
                    <JournalEntryCard journal={journal} key={journal.id} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">
                  No entries found for this date
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
