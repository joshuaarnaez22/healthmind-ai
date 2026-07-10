'use client';

import { CalendarIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface ObservationProps {
  observation: {
    title: string;
    shortEvidence: string;
    insight: string;
    evidence: string;
    date: string;
  };
  onSelect: () => void;
}

export default function ObservationCard({
  observation,
  onSelect,
}: ObservationProps) {
  const formattedDate = new Date(observation.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <button
        type="button"
        className="w-full overflow-hidden rounded-3xl border border-border/80 bg-card text-left transition-colors hover:border-primary/40"
        onClick={onSelect}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-primary">
            {observation.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {observation.shortEvidence}
          </p>
        </div>
        <div className="flex flex-col items-center justify-between gap-2 border-t border-border/80 bg-secondary/50 px-6 py-3 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="font-medium text-primary">Click to view details</div>
        </div>
      </button>
    </motion.div>
  );
}
