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
import { Loader2, PlusIcon, Save, Sparkles, Wand2 } from 'lucide-react';
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
import { useState, useTransition } from 'react';
import RichTextEditor from './rich-text-editor';
import { moods } from '@/lib/constant';
import { cn, isContentEmpty } from '@/lib/utils';
import { createJournal } from '@/actions/server-actions/journal';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Journal } from '@prisma/client';

export default function NewEntryModal({
  date,
  cacheKey,
}: {
  date: Date | undefined;
  cacheKey: string | undefined;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [isGeneratingPrompt, setIsGeneratingPrompt] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const form = useForm<JournalEntryFormValues>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: { title: '', mood: '', content: '' },
  });

  const content = form.watch('content');
  const mood = form.watch('mood');

  const onSubmit = async (values: JournalEntryFormValues) => {
    startTransition(async () => {
      const response = await createJournal(values, date);
      if (response.success && response.data) {
        queryClient.setQueryData<Journal[]>(
          ['journals', cacheKey],
          (old = []) => [response.data as Journal, ...old]
        );
        toast({ title: 'Entry saved', description: 'Your journal entry has been recorded.' });
      } else {
        toast({ title: 'Failed to save', description: 'Something went wrong. Please try again.', variant: 'destructive' });
      }
      setOpen(false);
    });
  };

  const handleGetPrompt = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsGeneratingPrompt(true);
    try {
      const res = await fetch('/api/journal-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood }),
      });
      if (!res.ok) throw new Error();
      const { prompt } = await res.json();
      // Inject the prompt as italic HTML into the editor
      form.setValue('content', `<p><em>${prompt}</em></p>`);
    } catch {
      // fail silently — prompt is non-critical
    } finally {
      setIsGeneratingPrompt(false);
    }
  };

  const handleEnhance = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!content || isContentEmpty(content)) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/journal-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      if (!res.ok) throw new Error();
      const { enhanced } = await res.json();
      form.setValue('content', enhanced);
    } catch {
      // fail silently
    } finally {
      setIsEnhancing(false);
    }
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <FormLabel>Journal Entry</FormLabel>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleGetPrompt}
                          disabled={isGeneratingPrompt}
                        >
                          {isGeneratingPrompt ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Wand2 className="mr-1.5 h-3.5 w-3.5 opacity-60" />
                          )}
                          {isGeneratingPrompt
                            ? 'Getting prompt…'
                            : 'Need a prompt?'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleEnhance}
                          disabled={
                            isEnhancing || !content || isContentEmpty(content)
                          }
                        >
                          {isEnhancing ? (
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="mr-1.5 h-3.5 w-3.5 opacity-60" />
                          )}
                          {isEnhancing ? 'Enhancing…' : 'Improve with AI'}
                        </Button>
                      </div>
                    </div>
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
                  {pending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving…
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Entry
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
