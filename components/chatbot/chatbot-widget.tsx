'use client';

import { useChat } from 'ai/react';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUp,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import HealthMindBot from '@/components/custom-icons/healthmind-bot';
import { cn } from '@/lib/utils';
import type { ChatSurface } from '@/lib/chatbot-prompt';

type UsageInfo = {
  remainingMessages: number | null;
  dailyLimit: number | null;
  tokenBalance: number | null;
  tier: string | null;
  authenticated: boolean;
};

const SUGGESTIONS = [
  'What can HealthMind help with?',
  'How do I track my mood?',
  'Tips for a calmer evening?',
] as const;

export default function ChatbotWidget({
  surface,
}: Readonly<{
  surface: ChatSurface;
}>) {
  const [open, setOpen] = useState(false);
  const [usage, setUsage] = useState<UsageInfo | null>(null);
  const [limitError, setLimitError] = useState<{
    message: string;
    code?: string;
  } | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function refreshUsage() {
    if (surface !== 'app') return;
    try {
      const res = await fetch('/api/chat/usage');
      if (!res.ok) return;
      const data = await res.json();
      setUsage({
        remainingMessages: data.remainingMessages ?? null,
        dailyLimit: data.dailyLimit ?? null,
        tokenBalance: data.tokenBalance ?? null,
        tier: data.tier ?? null,
        authenticated: !!data.authenticated,
      });
    } catch {
      /* ignore */
    }
  }

  const { messages, input, setInput, handleSubmit, isLoading, setMessages, append } =
    useChat({
      api: '/api/chat',
      body: { surface },
      fetch: async (input, init) => {
        const res = await fetch(input, init);
        if (!res.ok) {
          let message = 'Something went wrong';
          let code: string | undefined;
          try {
            const data = await res.clone().json();
            message = data.error || message;
            code = data.code;
          } catch {
            /* ignore */
          }
          setLimitError({ message, code });
          throw new Error(message);
        }
        setLimitError(null);
        if (surface === 'app') void refreshUsage();
        return res;
      },
    });

  useEffect(() => {
    if (open && surface === 'app') void refreshUsage();
    if (open) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 200);
      return () => window.clearTimeout(t);
    }
  }, [open, surface]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, isLoading]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    if (
      limitError?.code === 'free_quota' ||
      limitError?.code === 'token_budget'
    ) {
      return;
    }
    setLimitError(null);
    handleSubmit(e);
  };

  const sendSuggestion = (text: string) => {
    if (isLoading) return;
    setLimitError(null);
    void append({ role: 'user', content: text });
  };

  const usageLabel =
    surface === 'app' && usage
      ? usage.tier === 'SUBSCRIBED'
        ? `${usage.tokenBalance ?? 0} tokens left`
        : `${usage.remainingMessages ?? '—'} messages left today`
      : surface === 'landing'
        ? 'Guest · rate limited'
        : null;

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="pointer-events-auto flex w-[min(100vw-1.5rem,24rem)] flex-col overflow-hidden rounded-[1.75rem] border border-border/70 bg-card shadow-[0_20px_50px_-24px_rgba(40,40,48,0.45)]"
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-border/60 bg-secondary px-4 py-3.5">
              <div
                className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full bg-primary/10"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-10 left-10 h-20 w-20 rounded-full bg-accent/40"
                aria-hidden
              />
              <div className="relative flex items-center gap-3">
                <div className="relative shrink-0">
                  <HealthMindBot size={40} />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-secondary bg-emerald-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-sm font-bold tracking-tight text-foreground">
                      HealthMind
                    </h3>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      <Sparkles className="h-2.5 w-2.5" />
                      AI
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {usageLabel ?? 'Wellness companion'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex h-[22rem] flex-col gap-3 overflow-y-auto bg-background/40 px-3.5 py-4">
              {messages.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 px-2 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
                    <HealthMindBot size={36} />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-foreground">
                      How can I help?
                    </p>
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      Ask about the app or what’s on your mind. I’m not a doctor
                      or therapist.
                    </p>
                  </div>
                  <div className="flex w-full flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => sendSuggestion(s)}
                        className="rounded-2xl border border-border/80 bg-card px-3 py-2.5 text-left text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    'flex gap-2',
                    m.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  {m.role === 'assistant' && (
                    <div className="mt-0.5 shrink-0">
                      <HealthMindBot size={28} />
                    </div>
                  )}
                  <div
                    className={cn(
                      'max-w-[78%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
                      m.role === 'user'
                        ? 'rounded-br-md bg-primary text-primary-foreground'
                        : 'rounded-bl-md border border-border/60 bg-card text-foreground'
                    )}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2">
                  <HealthMindBot size={28} />
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border/60 bg-card px-3.5 py-2.5 text-xs text-muted-foreground">
                    <span className="flex gap-1">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
                    </span>
                    Thinking
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {limitError && (
              <div className="border-t border-border/60 bg-secondary/80 px-4 py-3 text-xs text-foreground">
                <p className="mb-2 leading-relaxed">{limitError.message}</p>
                <div className="flex flex-wrap gap-2">
                  {surface === 'landing' && (
                    <Button asChild size="sm" className="h-7 rounded-full text-xs">
                      <Link href="/sign-up">Sign up free</Link>
                    </Button>
                  )}
                  {(limitError.code === 'free_quota' ||
                    limitError.code === 'token_budget') && (
                    <Button asChild size="sm" className="h-7 rounded-full text-xs">
                      <Link href="/user/dashboard">Upgrade (soon)</Link>
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 rounded-full text-xs"
                    onClick={() => {
                      setLimitError(null);
                      setMessages([]);
                    }}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={onSubmit}
              className="border-t border-border/60 bg-card p-3"
            >
              <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background px-1.5 py-1 pl-3.5 focus-within:border-primary/50">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Message HealthMind…"
                  disabled={isLoading}
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 shrink-0 rounded-full"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        type="button"
        layout
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className={cn(
          'pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground transition-shadow',
          'bg-primary shadow-[0_12px_28px_-8px_rgba(10,112,255,0.65)]',
          'hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2'
        )}
        whileTap={{ scale: 0.94 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 45 }}
              transition={{ duration: 0.15 }}
            >
              <X className="h-6 w-6" strokeWidth={2.25} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <HealthMindBot size={32} variant="plain" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-accent" />
        )}
      </motion.button>
    </div>
  );
}
