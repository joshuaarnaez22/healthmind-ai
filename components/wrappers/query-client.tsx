'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { useState } from 'react';
import { ONE_DAY_IN_MS } from '@/lib/constant';

const persistentInsightKeys = [
  'observations',
  'mental-summary',
  'affirmations',
  'exercises',
  'articles',
];

const persistentModuleKeys = ['cbt_module'];

export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0,
            gcTime: 1000 * 60 * 5,
          },
        },
      })
  );

  const [persister] = useState(() =>
    createSyncStoragePersister({
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    })
  );

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: ONE_DAY_IN_MS,
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const queryKey = query.queryKey as (string | undefined)[];
            const namespace = queryKey[0];

            // Handle insights queries
            if (namespace === 'insights') {
              const insightType = queryKey[1];
              const userId = queryKey[2];
              return (
                persistentInsightKeys.includes(insightType as string) &&
                typeof userId === 'string' &&
                userId.length > 0
              );
            }

            if (namespace === 'therapy_modules') {
              const moduleType = queryKey[1];
              const userId = queryKey[2];
              return (
                persistentModuleKeys.includes(moduleType as string) &&
                typeof userId === 'string' &&
                userId.length > 0
              );
            }
            return false;
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </PersistQueryClientProvider>
  );
}
