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
import { getGlucoseCategory } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { GlucoseLog } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

export const columns: ColumnDef<GlucoseLog>[] = [
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
      const glucose = Number(row.original.glucose);
      const glucoseMgDl = row.original.glucoseMgDl;
      const category = getGlucoseCategory(glucose);

      return (
        <div className="flex items-center gap-2">
          <div className="font-medium">
            {Number(glucose)} mmol/L {glucoseMgDl && `(${glucoseMgDl} mg/dL)`}
          </div>
          <Badge className={cn('ml-2', category.color)}>{category.label}</Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'measurementType',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.original.measurementType;
      const mealType = row.original.mealType;

      return (
        <div className="flex flex-col">
          <div>{type?.replace(/_/g, ' ').toLowerCase()}</div>
          {mealType && (
            <div className="text-xs text-muted-foreground">
              {mealType.toLowerCase()}
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: 'context',
    header: 'Context',
    cell: ({ row }) => {
      const insulinDose = Number(row.original.insulinDose);
      const carbs = row.original.carbs;

      return (
        <div className="flex flex-col">
          {insulinDose && (
            <div className="text-sm">Insulin: {insulinDose} units</div>
          )}
          {carbs && <div className="text-sm">Carbs: {carbs}g</div>}
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
        <div className="max-w-[200px] truncate">
          {notes || <span className="text-muted-foreground">-</span>}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: () => {
      // { row }
      // const log = row.original
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
