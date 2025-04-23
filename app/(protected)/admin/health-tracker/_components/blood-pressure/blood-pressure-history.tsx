'use client';

import { BloodPressureLog } from '@prisma/client';
import { columns } from './table/column';
import { DataTable } from './table/data-table';
import { useQuery } from '@tanstack/react-query';

export default function BloodPressureHistory() {
  const {
    data: bloodPressureLogs,
    isLoading,
    isError,
  } = useQuery<BloodPressureLog[]>({
    queryKey: ['blood-pressure-logs'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/blood-pressure-logs`, {
        signal,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch blood pressure logs');
      }
      const data = await response.json();
      return data.bloodPressureLogs;
    },
  });

  return (
    <DataTable
      columns={columns}
      data={bloodPressureLogs || []}
      isLoading={isLoading}
      isError={isError}
    />
  );
}
