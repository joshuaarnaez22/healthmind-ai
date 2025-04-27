import { Skeleton } from '../ui/skeleton';

export default function AffirmationLoader() {
  return (
    <div className="flex h-32 items-center justify-center">
      <div className="w-full space-y-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
