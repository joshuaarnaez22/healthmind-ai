'use client';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { GoalWithCheckIns } from '@/lib/types';

export function useGoals() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;

  const query = useQuery<GoalWithCheckIns[]>({
    queryKey: ['goals', userId],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/goals`, { signal });
      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }
      const data = await response.json();
      return data.goals;
    },
    enabled: !!userId && isUserLoaded,
  });

  return query;
}
