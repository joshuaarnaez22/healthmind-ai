'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';

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
      <Card
        className="cursor-pointer transition-all duration-300 hover:border-primary/50"
        onClick={onSelect}
      >
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-primary">
              {observation.title}
            </h3>
            <p className="line-clamp-2 text-muted-foreground">
              {observation.shortEvidence}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-between gap-2 border-t bg-muted/20 px-6 py-3 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-1">
            <CalendarIcon className="h-3 w-3" />
            <span>{formattedDate}</span>
          </div>
          <div className="text-primary/70">Click to view details</div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
