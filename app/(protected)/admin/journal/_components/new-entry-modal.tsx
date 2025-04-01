'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusIcon, Save } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  type JournalEntryFormValues,
  journalEntrySchema,
} from '@/lib/zod-validation';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import RichTextEditor from './rich-text-editor';
import { moods } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { useTransition } from 'react';
import { createJournal } from '@/actions/server-actions/journal';
import { useQueryClient } from '@tanstack/react-query';
import { Journal } from '@prisma/client';

export default function NewEntryModal({ date }: { date: Date | undefined }) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const queryClient = useQueryClient();
  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: { title: '', mood: '', content: '' },
  });

  const dateKey = date?.toISOString().split('T')[0];

  const onSubmit = async (values: JournalEntryFormValues) => {
    startTransition(async () => {
      const response = await createJournal(values, date);
      if (response.success && response.data) {
        queryClient.setQueryData<Journal[]>(
          ['journals', dateKey],
          (old = []) => [response.data, ...old]
        );
      }
      setOpen(false);
      form.reset();
    });
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusIcon className="size-4" />
          New Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
          <DialogDescription>
            Record your thoughts and feelings. Take your time and be honest with
            yourself.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Give your entry a title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mood"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>How are you feeling?</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="flex items-center gap-2">
                          <SelectValue placeholder="Select a mood" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {moods.map((mood) => {
                          const Icon = mood.icon;
                          return (
                            <SelectItem value={mood.value} key={mood.value}>
                              <div className="flex items-center gap-x-2">
                                <Icon className={cn('size-4', mood.color)} />
                                <span className="truncate">{mood.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Journal Entry</FormLabel>
                    <FormControl>
                      <RichTextEditor
                        content={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={pending}>
                  <Save className="mr-2 h-4 w-4" />
                  {pending ? 'Saving...' : 'Save Entry'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
