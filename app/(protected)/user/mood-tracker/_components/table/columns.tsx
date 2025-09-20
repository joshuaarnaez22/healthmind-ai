import { ColumnDef } from '@tanstack/react-table';
import { MoodLog } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { safeFormat } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Edit, EllipsisVertical, Trash2 } from 'lucide-react';
import { moods } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { ArrowUpDown } from 'lucide-react';
import { useState } from 'react';

interface ActionCellProps {
  mood: MoodLog;
}

export function ActionCell({ mood }: ActionCellProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = async () => {
    console.log('Deleted', mood.id);
    setDeleteOpen(false);
    // TODO: Mutation or optimistic update
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <EllipsisVertical className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setEditOpen(true);
              setDropdownOpen(false); // close dropdown
            }}
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.preventDefault(); // prevent auto-close behavior
              setDeleteOpen(true);
              setDropdownOpen(false); // close dropdown manually
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={deleteOpen}
        onOpenChange={(open) => {
          setDeleteOpen(open);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this entry?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Yes, delete it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export const columns: ColumnDef<MoodLog>[] = [
  {
    accessorKey: 'mood',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Mood
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const moodValue = row.getValue('mood') as string;
      const mood = moods.find((m) => m.value === moodValue);
      if (!mood) return <Badge variant="outline">{moodValue}</Badge>;

      const MoodIcon = mood.icon;
      return (
        <Badge
          className={cn(
            mood.bgColor,
            mood.color,
            'flex w-16 justify-center gap-1 px-2 py-1'
          )}
        >
          <MoodIcon className="h-3.5 w-3.5" />
          <span>{mood.label}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: 'note',
    header: 'Note',
    cell: ({ row }) => {
      const content = row.getValue('note') as string | null;
      const safeContent = content ?? '';
      const text =
        safeContent.length > 100
          ? `${safeContent.slice(0, 100)}...`
          : safeContent;
      return <p className="text-sm text-muted-foreground">{text}</p>;
    },
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue('createdAt') as Date;
      return safeFormat(new Date(date), 'PPP');
    },
  },
  {
    id: 'actions',
    header: '',
    cell: ({ row }) => <ActionCell mood={row.original} />,
  },
];
