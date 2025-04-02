'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface TableErrorProps {
  columns?: number;
  message?: string;
  onRetry?: () => void;
}

export function TableError({
  columns = 4,
  message = 'There was a problem loading the data.',
  onRetry,
}: TableErrorProps) {
  return (
    <div className="w-full overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-red-50 dark:bg-red-950/20">
            <TableHead
              colSpan={columns}
              className="h-12 text-center text-red-600 dark:text-red-400"
            >
              <div className="flex items-center justify-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Error Loading Data</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className="bg-red-50/50 hover:bg-red-50/70 dark:bg-red-950/10 dark:hover:bg-red-950/20">
            <TableCell colSpan={columns} className="h-32 py-8">
              <div className="flex flex-col items-center justify-center gap-4 px-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle className="h-8 w-8 text-red-500 dark:text-red-400" />
                </div>
                <p className="max-w-md text-center text-muted-foreground">
                  {message}
                </p>
                {onRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="mt-2 gap-2"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Retry
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
