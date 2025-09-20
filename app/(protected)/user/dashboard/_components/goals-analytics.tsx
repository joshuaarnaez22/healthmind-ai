/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

export default function GoalsAnalytics() {
  const { user } = useUser();
  const userId = user?.id;
  const {
    data: goals = [],
    isLoading: goalsLoading,
    isError: goalsError,
  } = useQuery({
    queryKey: ['analytics', 'goals', userId],
    queryFn: async () => {
      const response = await fetch('/api/analytics/goals');
      if (!response.ok) {
        throw new Error('Failed to get modules');
      }
      const data = await response.json();
      return data;
    },
  });
  console.log(goals);

  return <div>GoalsAnalytics</div>;
}
