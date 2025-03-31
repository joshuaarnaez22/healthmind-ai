'use client';

import { useState } from 'react';
import { CalendarIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn, safeFormat } from '@/lib/utils';

interface DateSearchProps {
  onDateChange: (date: Date | undefined) => void;
}

export default function DateSearch({ onDateChange }: DateSearchProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  const handleClear = () => {
    setDate(undefined);
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              'w-[240px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? safeFormat(date, 'PPP') : safeFormat(new Date(), 'PPP')}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            className="rounded-lg border border-border bg-background p-2"
            classNames={{
              month_caption: 'ms-2.5 me-20 justify-start',
              nav: 'justify-end',
            }}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>

      {date && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClear}
          className="h-9 w-9"
          aria-label="Clear date filter"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
