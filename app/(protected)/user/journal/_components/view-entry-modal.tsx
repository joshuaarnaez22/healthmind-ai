'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { moods } from '@/lib/constant';
import { Journal } from '@prisma/client';
import { format, isValid, parseISO } from 'date-fns';
interface ViewJournalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journal: Journal | null;
}

export default function ViewJournalModal({
  open,
  onOpenChange,
  journal,
}: ViewJournalModalProps) {
  if (!journal) return null;

  const selectedMood = moods.find((mood) => mood.value === journal.mood);
  const MoodIcon = selectedMood?.icon;

  const formatDate = (date: string | Date) => {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed)
      ? format(parsed, 'EEEE, MMMM d, yyyy')
      : 'Invalid date';
  };

  const formatTime = (date: string | Date) => {
    const parsed = typeof date === 'string' ? parseISO(date) : date;
    return isValid(parsed) ? format(parsed, 'hh:mm a') : 'Invalid time';
  };

  const lastUpdatedAt =
    journal.updatedAt && isValid(new Date(journal.updatedAt))
      ? `Last updated: ${format(new Date(journal.updatedAt), 'EEEE, MMMM d, yyyy')} at ${format(new Date(journal.updatedAt), 'hh:mm a')}`
      : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold leading-tight">
                {journal.title}
              </DialogTitle>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(journal.createdAt)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {formatTime(journal.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {selectedMood && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                Mood:
              </span>
              <Badge
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                {MoodIcon && (
                  <MoodIcon className={cn('h-4 w-4', selectedMood.color)} />
                )}
                <span>{selectedMood.label}</span>
              </Badge>
            </div>
          )}
        </DialogHeader>

        <Separator />

        <div className="py-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div
              className="whitespace-pre-wrap text-base leading-relaxed"
              dangerouslySetInnerHTML={{ __html: journal.content }}
            />
          </div>
        </div>

        {lastUpdatedAt && (
          <>
            <Separator />
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>{lastUpdatedAt}</span>
            </div>
          </>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
