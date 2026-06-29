'use client';

import { useState } from 'react';
import type { Journal } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { moods } from '@/lib/constant';
import EditEntryModal from './edit-entry-modal';

export default function JournalEntryAccordionItem({
  journal,
}: {
  journal: Journal;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const mood = moods.find((m) => m.value === journal.mood);
  const MoodIcon = mood?.icon ?? ChevronDown;
  const cleanHtml = DOMPurify.sanitize(journal.content);

  return (
    <div className="overflow-hidden rounded-xl border bg-card transition-shadow duration-200 hover:shadow-sm">
      {/* Header row — always visible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-start gap-3 p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {/* Mood badge */}
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

        {/* Title + preview */}
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium leading-snug">{journal.title}</p>
          {!isOpen && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              {journal.content.replace(/<[^>]+>/g, '').slice(0, 80)}
            </p>
          )}
        </div>

        {/* Timestamp + chevron */}
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
              <div className="mt-4 flex justify-end">
                <EditEntryModal />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
