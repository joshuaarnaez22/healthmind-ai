'use client';
import MoodModal from './mood-modal';
import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import { useQuery } from '@tanstack/react-query';
import { MoodLog } from '@prisma/client';
import { TableLoading } from '@/components/loaders/table-loading';
import { TableError } from '@/components/loaders/table-error';
import { DataTable } from './table/data-table';
import { columns } from './table/columns';

export default function TrackMood() {
  const {
    data: moods = [],
    isLoading,
    isError,
  } = useQuery<MoodLog[]>({
    queryKey: ['moods'],
    queryFn: async ({ signal }) => {
      const response = await fetch(`/api/mood`, {
        signal,
      });
      if (!response.ok) {
        throw new Error('Failed to fetch moods');
      }
      const data = await response.json();
      return data.moods;
    },
  });

  console.log(moods);

  return (
    <motion.div {...pageAnimations}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="w-full text-2xl font-bold tracking-tight sm:w-auto sm:text-3xl">
          Mood Tracker
        </h1>
        <div className="w-full sm:w-auto">
          <MoodModal />
        </div>
      </div>
      {isLoading ? (
        <TableLoading columns={6} rows={12} />
      ) : isError ? (
        <TableError />
      ) : moods?.length ? (
        <DataTable columns={columns} data={moods} />
      ) : (
        <div className="py-8 text-center text-muted-foreground">
          No entries found
        </div>
      )}
    </motion.div>
  );
}
