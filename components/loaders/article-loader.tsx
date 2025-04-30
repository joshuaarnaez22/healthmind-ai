import React from 'react';
import { Skeleton } from '../ui/skeleton';

export default function ArticleLoader() {
  return (
    <div className="space-y-4">
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-[120px] w-full rounded-lg" />
          </div>
        ))}
    </div>
  );
}
