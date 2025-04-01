'use client';

import { useState } from 'react';
import type { Journal } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import DOMPurify from 'dompurify';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import moods from '@/lib/mood';
import EditEntryModal from './edit-entry-moda';

export default function JournalEntryAccordionItem({
  journal,
}: {
  journal: Journal;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const mood = moods.find((m) => m.value === journal.mood);
  const cleanHtml = DOMPurify.sanitize(journal.content);

  // Default mood styling if mood is not found
  const MoodIcon = mood?.icon || ChevronDown;
  const moodColor = mood?.color || 'text-gray-500';
  const moodBgColor = mood?.bgColor || 'bg-gray-100';

  return (
    <div className="mb-4 overflow-hidden rounded-lg border transition-shadow duration-200 hover:shadow-md">
      <div className="flex flex-col">
        <div className="flex items-start justify-between p-4 pb-2">
          <Badge
            className={cn(
              moodBgColor,
              moodColor,
              'flex items-center gap-1 px-2 py-1 hover:bg-background'
            )}
          >
            <MoodIcon className="h-3.5 w-3.5" />
            <span>{mood?.label || journal.mood}</span>
          </Badge>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(journal.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between px-4 py-2 text-left focus:outline-none"
        >
          <h3 className="text-lg font-medium lg:text-xl">{journal.title}</h3>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.3, ease: 'easeOut' },
                opacity: { duration: 0.2, delay: 0.1 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: 'easeIn' },
                opacity: { duration: 0.2 },
              },
            }}
            className="overflow-hidden"
          >
            <motion.div
              className="px-4 pb-4 pt-2"
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="mb-4">
                <div
                  className="// Tight paragraph spacing // Blockquote spacing // Heading spacing prose text-sm dark:prose-invert prose-headings:my-2 prose-p:my-1 prose-p:first:mt-0 prose-p:last:mb-0 prose-blockquote:my-2 prose-blockquote:border-l-4 prose-blockquote:border-gray-200 lg:text-lg [&_li]:list-item [&_li]:pl-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4"
                  dangerouslySetInnerHTML={{ __html: cleanHtml }}
                />
              </div>
              <div className="flex justify-end">
                <EditEntryModal />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
