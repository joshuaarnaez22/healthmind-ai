import { Skeleton } from '../ui/skeleton';

export default function MentalSummaryLoader() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-20 w-full" />
      <div className="h-36 w-full">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
