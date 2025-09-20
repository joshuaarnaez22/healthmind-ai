'use client';
import { useQuery } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';

export function useJournalCheck() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const userId = user?.id;

  const journalCheckQuery = useQuery({
    queryKey: ['journals', 'check', userId],
    queryFn: async () => {
      if (!userId) throw new Error('User not authenticated');
      const response = await fetch('/api/journals', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Journal check request failed');
      const { journals } = await response.json();
      return journals && journals.length > 0;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    enabled: !!userId && isUserLoaded,
  });

  return {
    hasJournals: journalCheckQuery.data,
    isLoading: journalCheckQuery.isLoading,
    isError: journalCheckQuery.isError,
    error: journalCheckQuery.error,
  };
}
