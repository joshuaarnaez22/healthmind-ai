import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { Skeleton } from '@/components/ui/skeleton';

export default function ModulesSkeleton() {
  return (
    <motion.div {...pageAnimations} className="space-y-10">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-3xl" />
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-3xl" />
        ))}
      </div>
    </motion.div>
  );
}
