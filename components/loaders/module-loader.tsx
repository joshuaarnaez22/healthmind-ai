import { pageAnimations } from '@/lib/motion';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function ModulesSkeleton() {
  return (
    <motion.div {...pageAnimations}>
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="w-full">
          <div className="mb-2 flex items-center gap-2">
            <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />
            <div className="h-6 w-20 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full max-w-2xl animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-3/4 max-w-xl animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index}>
            <CardHeader className="pb-4">
              <div className="mb-3 h-12 w-12 animate-pulse rounded-lg bg-gray-200" />
              <div className="mb-2 h-6 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="h-4 w-4 animate-pulse rounded bg-gray-200" />
                  <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
                </div>
                <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200" />
              </div>
              <div className="h-10 w-full animate-pulse rounded bg-gray-200" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Card className="border-slate-200 bg-slate-50">
          <CardContent className="pt-6">
            <div className="mx-auto mb-3 h-8 w-8 animate-pulse rounded bg-gray-200" />
            <div className="mx-auto mb-2 h-6 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mx-auto max-w-md space-y-2">
              <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
              <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            </div>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}
