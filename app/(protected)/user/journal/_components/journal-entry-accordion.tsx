'use client';

import { useState, useTransition } from 'react';
import type { Journal } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';
import { ChevronDown, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { moods } from '@/lib/constant';
import EditEntryModal from './edit-entry-modal';
import { deleteJournal } from '@/actions/server-actions/journal';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function JournalEntryAccordionItem({
  journal,
  cacheKey,
}: {
  journal: Journal;
  cacheKey: string | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const mood = moods.find((m) => m.value === journal.mood);
  const MoodIcon = mood?.icon ?? ChevronDown;
  const cleanHtml = DOMPurify.sanitize(journal.content);

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteJournal(journal.id);
      if (res.success) {
        queryClient.setQueryData<Journal[]>(
          ['journals', cacheKey],
          (old = []) => old.filter((j) => j.id !== journal.id)
        );
        toast({
          title: 'Entry deleted',
          description: 'Your journal entry has been removed.',
        });
      } else {
        toast({
          title: 'Failed to delete',
          description: 'Something went wrong. Please try again.',
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card transition-shadow duration-200 hover:shadow-sm">
      {/* Header row — always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Badge
          className={cn(
            'mt-0.5 shrink-0 gap-1 px-2 py-0.5 text-xs font-medium hover:opacity-90',
            mood?.bgColor,
            mood?.color
          )}
        >
          <MoodIcon className="h-3 w-3" />
          {mood?.label ?? journal.mood}
        </Badge>

        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-snug">{journal.title}</p>
          {!isOpen && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {journal.content.replace(/<[^>]+>/g, '').slice(0, 80)}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(journal.createdAt), {
              addSuffix: true,
            })}
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.25, ease: 'easeOut' },
                opacity: { duration: 0.15, delay: 0.08 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.2, ease: 'easeIn' },
                opacity: { duration: 0.1 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="border-t px-4 pb-4 pt-3">
              <div
                className="prose prose-sm max-w-none text-sm dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-blockquote:my-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
              <div className="mt-4 flex justify-end gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2 text-destructive hover:text-destructive"
                      disabled={pending}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete this entry?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. The journal entry will be
                        permanently deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="hover:bg-destructive/90 bg-destructive text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <EditEntryModal journal={journal} cacheKey={cacheKey} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
