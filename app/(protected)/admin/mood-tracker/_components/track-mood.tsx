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

export default function TrackMood() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(), // Default start date (today)
    to: new Date(), // Default end date (+6 days)
  });

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
                    {safeFormat(date.from, 'EEEE, MMMM do, yyyy')} -{' '}
                    {safeFormat(date.to, 'EEEE, MMMM do, yyyy')}
                  </CardTitle>
                ) : (
                  <CardTitle className="text-xl font-semibold text-primary">
                    {safeFormat(new Date(), 'EEEE, MMMM do, yyyy')}
                  </CardTitle>
                )}
                <CardDescription className="mt-1 text-sm text-muted-foreground">
                  No mood recorded for this day
                </CardDescription>
              </div>
              <MoodModal />
            </CardHeader>
            <CardContent></CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
