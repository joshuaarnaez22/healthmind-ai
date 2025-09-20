'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save } from 'lucide-react';
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
import RichTextEditor from './rich-text-editor';
import { moods } from '@/lib/constant';
import { cn } from '@/lib/utils';
import { useEffect, useTransition } from 'react';
import { Journal } from '@prisma/client';

interface EditEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  journal: Journal;
}

export default function EditEntryModal({
  open,
  onOpenChange,
  journal,
}: EditEntryModalProps) {
  const [pending, startTransition] = useTransition();

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      title: '',
      mood: '',
      content: '',
    },
  });

  useEffect(() => {
    if (open && journal) {
      form.reset({
        title: journal.title || '',
        mood: journal.mood || '',
        content: journal.content || '',
      });
    }
  }, [open, journal, form]);

  const onSubmit = async (values: JournalEntryFormValues) => {
    startTransition(async () => {
      console.log('Updated values:', values);
      onOpenChange(false);
      form.reset();
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Edit Journal Entry</DialogTitle>
          <DialogDescription>
            Update your thoughts and feelings.
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
                      <Input placeholder="Entry title" {...field} />
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
                                <span>{mood.label}</span>
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
