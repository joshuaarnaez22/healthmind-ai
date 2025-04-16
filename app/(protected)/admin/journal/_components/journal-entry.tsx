'use client';
import { motion } from 'framer-motion';
import NewEntryModal from './new-entry-modal';
import { formatDateKey, safeFormat } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { Journal } from '@prisma/client';
import React from 'react';
import DateSearch from './date-search';
import JournalEntryAccordionItem from './journal-entry-accordion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function JournalEntry() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const dateKey = formatDateKey(date);

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
    enabled: !!date,
  });

  const hasEntries = journals && journals.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        {/* Header Section */}
        <CardHeader>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="w-full text-2xl font-bold tracking-tight sm:w-auto sm:text-3xl">
              My Mental Health Journal
            </h1>
            <div className="w-full sm:w-auto">
              <NewEntryModal date={date} cacheKey={dateKey} />
            </div>
          </div>
          {/* Date Controls Section */}
          <div className="mb-4 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <DateSearch onDateChange={setDate} />
            <div className="text-sm text-muted-foreground">
              {`Showing  ${journals?.length || 0} entries from ${safeFormat(date, 'EEE, MMM do')}`}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Journal Entries Section */}
          <div className="pb-6">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(6)].map((_, index) => (
                  <Skeleton className="h-20 w-full" key={index} />
                ))}
              </div>
            ) : isError ? (
              <div className="py-4 text-center text-destructive">
                Error loading journals
              </div>
            ) : hasEntries ? (
              <div className="space-y-3">
                {journals.map((journal) => (
                  <JournalEntryAccordionItem
                    journal={journal}
                    key={journal.id}
                  />
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                No entries found for this date
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
