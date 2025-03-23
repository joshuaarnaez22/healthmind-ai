'use client';
import { Button } from '@/components/ui/button';
import MoodModal from './mood-modal';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { safeFormat } from '@/lib/utils';

export default function TrackMood() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Mood Tracker</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Calendar</CardTitle>
          <CardDescription>
            Select a date to view or add mood entries
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 lg:flex-row">
          {/* Calendar Section */}
          <div className="flex items-center justify-center">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="w-[280px] rounded-md border"
            />
          </div>

          {/* Mood Details Section */}
          {date && (
            <Card className="w-full">
              <CardHeader className="flex flex-col items-start justify-between space-y-3 pb-2 sm:flex-row sm:items-center sm:space-y-0">
                <div>
                  <CardTitle className="text-xl font-semibold text-primary">
                    {safeFormat(date, 'EEEE, MMMM do, yyyy')}
                  </CardTitle>
                  <CardDescription className="mt-1 text-sm text-muted-foreground">
                    No mood recorded for this day
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="sm"
                  className="bg-primary text-white shadow-sm hover:bg-primary/90"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Track Mood
                </Button>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <MoodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedDate={date}
      />
    </div>
  );
}
