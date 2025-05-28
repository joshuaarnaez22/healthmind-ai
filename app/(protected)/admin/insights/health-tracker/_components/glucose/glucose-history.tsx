'use client';
import { GlucoseLog } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from './table/data-table';
import { columns } from './table/column';
export default function GlucoseHistory() {
  const {
    data: glucoseLogs,
    isLoading,
    isError,
  } = useQuery<GlucoseLog[]>({
    queryKey: ['glucose-logs'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/glucose-logs`, {
        signal,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch  glucose logs');
      }
      const data = await response.json();
      return data.glucoseLogs;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={glucoseLogs || []}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
