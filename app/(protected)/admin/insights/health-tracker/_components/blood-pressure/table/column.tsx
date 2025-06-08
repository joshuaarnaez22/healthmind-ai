'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getBPCategory } from '@/lib/constant';
import { cn, truncatedText } from '@/lib/utils';
import { BloodPressureLog } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<BloodPressureLog>[] = [
  {
    accessorKey: 'loggedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date & Time
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('loggedAt') as Date;
      return <div>{format(date, 'MMM d, yyyy h:mm a')}</div>;
    },
  },
  {
    accessorKey: 'reading',
    header: 'Reading',
    cell: ({ row }) => {
      const systolic = row.original.systolic;
      const diastolic = row.original.diastolic;
      const category = getBPCategory(systolic, diastolic);

      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">
            {systolic}/{diastolic} mmHg
          </div>
          <Badge className={cn('ml-2', category.color)}>{category.label}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'pulse',
    header: 'Pulse',
    cell: ({ row }) => {
      const pulse = row.original.pulse;
      return pulse ? (
        <div>{pulse} BPM</div>
      ) : (
        <div className="text-muted-foreground">-</div>
      );
    },
  },
  {
    accessorKey: 'context',
    header: 'Context',
    cell: ({ row }) => {
      const posture = row.original.posture;
      const arm = row.original.arm;

      return (
        <div className="flex flex-col">
          {posture && (
            <div className="text-sm">
              {posture.replace('_', ' ').toLowerCase()}
            </div>
          )}
          {arm && <div className="text-sm">{arm.toLowerCase()} arm</div>}
        </div>
      );
    },
  },
  {
    accessorKey: 'symptoms',
    header: 'Symptoms',
    cell: ({ row }) => {
      const symptoms = row.original.symptoms;

      return (
        <div className="flex flex-wrap gap-1">
          {symptoms.length > 0 ? (
            symptoms.map((symptom) => (
              <Badge key={symptom} variant="outline" className="text-xs">
                {symptom}
              </Badge>
            ))
          ) : (
            <div className="text-muted-foreground">None</div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
    cell: ({ row }) => {
      const notes = row.original.notes;

      return (
        <div className="truncate">
          {(notes && truncatedText(notes)) || (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const log = row.original;
      console.log(log);
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit reading</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
