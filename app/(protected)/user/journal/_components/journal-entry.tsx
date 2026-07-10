'use client';
import { motion } from 'motion/react';
import NewEntryModal from './new-entry-modal';
import { formatDateKey, safeFormat } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Journal } from '@prisma/client';
import React from 'react';
import JournalEntryAccordionItem from './journal-entry-accordion';
import { pageAnimations } from '@/lib/motion';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

export default function JournalEntry() {
  const [date, setDate] = React.useState<Date>(new Date());
  const dateKey = formatDateKey(date);

  const {
    data: journals,
    isLoading,
    isError,
  } = useQuery<Journal[]>({
    queryKey: ['journals', dateKey],
    queryFn: async ({ signal }) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const response = await fetch(
        `/api/journal?start=${start.toISOString()}&end=${end.toISOString()}`,
        { signal }
      );
      if (!response.ok) throw new Error('Failed to fetch journal');
      const data = await response.json();
      return data.journals;
    },
  });

  const count = journals?.length ?? 0;

  return (
    <motion.div {...pageAnimations} className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Journal
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Record your thoughts, feelings, and reflections.
          </p>
        </div>
        <NewEntryModal date={date} cacheKey={dateKey} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
        <section className="h-fit rounded-3xl border border-border/80 bg-secondary p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => d && setDate(d)}
            classNames={{
              month_caption: 'ms-2.5 me-20 justify-start',
              nav: 'justify-end',
            }}
          />
        </section>

        <section className="flex flex-col rounded-3xl border border-border/80 bg-card p-6">
          <div className="pb-3">
            <h2 className="text-base font-semibold text-foreground">
              {safeFormat(date, 'EEEE, MMMM do, yyyy')}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {isLoading
                ? 'Loading…'
                : count > 0
                  ? `${count} ${count === 1 ? 'entry' : 'entries'} recorded`
                  : 'No entries for this day'}
            </p>
          </div>
          <div className="flex-1 space-y-3">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            ) : isError ? (
              <div className="border-destructive/30 bg-destructive/5 rounded-2xl border px-4 py-8 text-center text-sm text-destructive">
                Failed to load journal entries.
              </div>
            ) : count > 0 ? (
              journals!.map((journal) => (
                <JournalEntryAccordionItem
                  journal={journal}
                  key={journal.id}
                  cacheKey={dateKey}
                />
              ))
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-2xl bg-secondary py-16 text-center">
                <BookOpen className="h-7 w-7 text-primary opacity-70" />
                <p className="text-sm text-muted-foreground">
                  No entries for this day. Start writing!
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
                  New Entry
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
}
