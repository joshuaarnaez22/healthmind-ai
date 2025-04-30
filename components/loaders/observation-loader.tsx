import { Skeleton } from '../ui/skeleton';

export default function ObservationLoader({ columns = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {Array(columns)
        .fill(null)
        .map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-[140px] w-full rounded-lg" />
          </div>
        ))}
    </div>
  );
}
