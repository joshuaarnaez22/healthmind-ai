'use client';
import { motion } from 'motion/react';
import NewEntryModal from './new-entry-modal';
import { useQuery } from '@tanstack/react-query';
import { Journal } from '@prisma/client';
import React from 'react';
import { pageAnimations } from '@/lib/motion';
import { DataTable } from './table/data-table';
import { columns } from './table/columns';
import { TableError } from '@/components/loaders/table-error';
import { TableLoading } from '@/components/loaders/table-loading';

export default function JournalEntry() {
  const {
    data: journals,
    isLoading,
    isError,
  } = useQuery<Journal[]>({
    queryKey: ['journals'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/journals`, {
        signal,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch journal');
      }
      const data = await response.json();
      return data.journals;
    },
  });

  return (
    <motion.div {...pageAnimations}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="w-full text-2xl font-bold tracking-tight sm:w-auto sm:text-3xl">
          My Mental Health Journal
        </h1>
        <div className="w-full sm:w-auto">
          <NewEntryModal />
        </div>
      </div>

      {isLoading ? (
        <TableLoading columns={6} rows={12} />
      ) : isError ? (
        <TableError />
      ) : journals?.length ? (
        <DataTable columns={columns} data={journals} />
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          No entries found for this date
        </div>
      )}
    </motion.div>
  );
}
