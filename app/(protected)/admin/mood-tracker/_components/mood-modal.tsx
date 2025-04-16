'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { moods } from '@/lib/constant';
import { cn, safeFormat } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';

export default function MoodModal() {
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="size-4" />
          Track Mood
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>How are you feeling?</DialogTitle>
          <DialogDescription>{`Record your mood for ${safeFormat(new Date(), 'EEEE, MMMM do')}`}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2">
              {moods.map((mood) => {
                const Icon = mood.icon;
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={cn(
                      'flex flex-col items-center justify-center rounded-lg border-2 p-4 transition-all',
                      mood.bgColor,
                      mood.hoverColor,
                      selectedMood === mood.value
                        ? mood.selectedColor
                        : 'border-transparent'
                    )}
                  >
                    <Icon className={cn('mb-2 h-8 w-8', mood.color)} />
                    <span className="text-xs font-medium">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add some notes about your day..."
              className="min-h-[120px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="gap-4">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button>Save Entry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
