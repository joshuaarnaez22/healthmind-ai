'use client';
import { GlucoseLog } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
export default function GlucoseHistory() {
  const {
    data: glucoseLogs,
    // isLoading,
    // isError,
  } = useQuery<GlucoseLog[]>({
    queryKey: ['blood-pressure-logs'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/glucose-logs`, {
        signal,
      });
      const data = await response.json();
      return data.glucoseLogs;
    },
  });

  console.log(glucoseLogs);

  return <div>glucose-history</div>;
}
