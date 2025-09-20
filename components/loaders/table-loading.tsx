import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface TableLoadingProps {
  columns: number;
  rows: number;
}

export function TableLoading({ columns = 4, rows = 5 }: TableLoadingProps) {
  return (
    <div className="space-y-4">
      {/* Top toolbar skeleton */}
      <div className="flex items-center gap-4 py-4">
        {/* Search bar skeleton */}
        <Skeleton className="h-9 w-[240px] rounded-md" />
        {/* Column dropdown button skeleton */}
        <Skeleton className="ml-auto h-9 w-[100px] rounded-md" />
      </div>

      {/* Table skeleton */}
      <div className="grid grid-cols-1 rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              {Array.from({ length: columns }).map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-4 w-[80px] rounded" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className="h-4 w-full rounded" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination buttons skeleton */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Skeleton className="h-8 w-[80px] rounded-md" />
        <Skeleton className="h-8 w-[80px] rounded-md" />
      </div>
    </div>
  );
}
