'use client';

import { motion, AnimatePresence } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import HealthMindBot from '@/components/custom-icons/healthmind-bot';
import { cn } from '@/lib/utils';
import {
  DEEPGRAM_MIC_SAMPLE_RATE,
  DEEPGRAM_PLAYER_SAMPLE_RATE,
  ensureDeepgramAgentAudioDefaults,
} from '@/lib/deepgram-agent-audio';
import {
  THERAPY_FREE_CAP_SECONDS,
  THERAPY_FREE_WARNING_SECONDS,
  THERAPY_TOKENS_PER_MINUTE,
  estimateMinutesFromTokens,
} from '@/lib/stripe-catalog';
import {
  AgentProvider,
  useAgentClientTool,
  useAgentConversation,
  useAgentMicrophone,
  useAgentMode,
  useAgentPlayer,
  useAgentSession,
  useAgentState,
  type AgentSettingsObject,
  type ConversationEntry,
} from '@deepgram/react';

ensureDeepgramAgentAudioDefaults();

const SOFT_LIMIT_SECONDS = 20 * 60;
const CAPTION_PREVIEW = 2;
const HEARTBEAT_MS = 30_000;

type TherapyTier = 'FREE' | 'SUBSCRIBED';
type LimitReason = 'free_cap' | 'token_budget' | null;

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function connectionLabel(
  isActive: boolean,
  isConnecting: boolean,
  state: string
): string {
  if (isConnecting) return 'Connecting';
  if (isActive) return 'Live';
  if (state === 'disconnected') return 'Ended';
  return 'Ready';
}

async function fetchDeepgramToken(): Promise<{
  access_token: string;
  tier: TherapyTier;
  tokenBalance: number | null;
}> {
  const res = await fetch('/api/deepgram-token');
  let payload: {
    access_token?: string;
    error?: string;
    code?: string;
    tier?: TherapyTier;
    tokenBalance?: number | null;
  } = {};
  try {
    payload = await res.json();
  } catch {
    /* ignore */
  }
  if (!res.ok) {
    throw new Error(
      payload.error ||
        'Failed to get voice session token. Check DEEPGRAM_API_KEY permissions.'
    );
  }
  if (!payload.access_token) {
    throw new Error('Invalid voice session token');
  }
  return {
    access_token: payload.access_token,
    tier: payload.tier === 'SUBSCRIBED' ? 'SUBSCRIBED' : 'FREE',
    tokenBalance:
      typeof payload.tokenBalance === 'number' ? payload.tokenBalance : null,
  };
}

async function startUsageLedger(): Promise<{
  usageId: string;
  tokenBalance: number | null;
  openingBalance: number;
  estimatedMinutesLeft: number | null;
}> {
  const res = await fetch('/api/ai-therapy/usage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action: 'start' }),
  });
  if (!res.ok) throw new Error('Could not start usage tracking');
  const data = (await res.json()) as {
    usageId: string;
    tokenBalance: number | null;
    openingBalance: number;
    estimatedMinutesLeft: number | null;
  };
  return data;
}

async function endUsageLedger({
  usageId,
  secondsAlive,
  endReason,
}: {
  usageId: string;
  secondsAlive: number;
  endReason: string;
}) {
  try {
    await fetch('/api/ai-therapy/usage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'end',
        usageId,
        secondsAlive,
        endReason,
      }),
    });
  } catch (err) {
    console.error('Failed to end therapy usage:', err);
  }
}

/** Brand presence — HealthMindBot + soft concentric pulse. */
function VoicePresence({
  coachSpeaking,
  userSpeaking,
  isActive,
  isConnecting,
}: Readonly<{
  coachSpeaking: boolean;
  userSpeaking: boolean;
  isActive: boolean;
  isConnecting: boolean;
}>) {
  const voiceActive = coachSpeaking || userSpeaking;
  const live = isActive || isConnecting;

  return (
    <div
      className="relative mx-auto flex h-56 w-56 items-center justify-center sm:h-64 sm:w-64"
      aria-hidden
    >
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={cn(
            'absolute rounded-full border',
            coachSpeaking
              ? 'border-primary/30'
              : userSpeaking
                ? 'border-foreground/20'
                : 'border-border/50'
          )}
          style={{ inset: `${8 + i * 20}px` }}
          animate={
            voiceActive
              ? {
                  scale: [1, 1.05 + i * 0.02, 1],
                  opacity: [0.3, 0.7, 0.3],
                }
              : live
                ? {
                    scale: [1, 1.02, 1],
                    opacity: [0.22, 0.38, 0.22],
                  }
                : { scale: 1, opacity: 0.18 }
          }
          transition={{
            duration: voiceActive ? 1.4 + i * 0.25 : 3.4,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.12,
          }}
        />
      ))}

      <motion.div
        className="relative z-10"
        animate={
          voiceActive
            ? { scale: [1, 1.06, 1] }
            : live
              ? { scale: [1, 1.03, 1] }
              : { scale: 1 }
        }
        transition={{
          duration: voiceActive ? 1.15 : 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <HealthMindBot size={88} className="rounded-[1.75rem] shadow-sm" />
      </motion.div>
    </div>
  );
}

function CaptionStrip({
  conversation,
  isActive,
}: Readonly<{
  conversation: ConversationEntry[];
  isActive: boolean;
}>) {
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const visible = expanded
    ? conversation
    : conversation.slice(-CAPTION_PREVIEW);
  const canExpand = conversation.length > CAPTION_PREVIEW;

  useEffect(() => {
    if (!expanded) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [conversation, expanded]);

  if (!isActive && conversation.length === 0) return null;

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="border-border/70 bg-secondary/50 rounded-3xl border px-4 py-3.5 backdrop-blur-sm">
        {conversation.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Captions will appear as you talk…
          </p>
        ) : (
          <div
            ref={scrollRef}
            className={cn(
              'space-y-3',
              expanded && 'scrollbar max-h-48 overflow-y-auto'
            )}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((entry) => {
                const isYou = entry.role === 'user';
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="mb-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {isYou ? 'You' : 'Coach'}
                    </p>
                    <p
                      className={cn(
                        'text-sm leading-relaxed [text-wrap:pretty]',
                        isYou ? 'text-foreground/80' : 'text-foreground'
                      )}
                    >
                      {entry.content}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {canExpand && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mx-auto mt-2 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? 'Show less' : 'Full transcript'}
          <ChevronDown
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              expanded && 'rotate-180'
            )}
          />
        </button>
      )}
    </div>
  );
}

function ControlButton({
  onClick,
  label,
  active,
  danger,
  children,
  disabled,
}: Readonly<{
  onClick: () => void;
  label: string;
  active?: boolean;
  danger?: boolean;
  children: ReactNode;
  disabled?: boolean;
}>) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={cn(
        'h-12 w-12 rounded-2xl text-foreground hover:bg-secondary',
        active && 'bg-secondary text-primary',
        danger &&
          'hover:bg-destructive/90 bg-destructive text-destructive-foreground hover:text-destructive-foreground'
      )}
    >
      {children}
    </Button>
  );
}

function SessionControls({
  initialTier,
}: Readonly<{ initialTier: TherapyTier }>) {
  const { state, isActive, isConnecting, start, stop } = useAgentState();
  const { isSpeaking } = useAgentMode();
  const { micMuted, setMicMuted } = useAgentMicrophone();
  const { outputMuted, setOutputMuted } = useAgentPlayer();
  const { conversation } = useAgentConversation();
  const session = useAgentSession();
  const [sessionTime, setSessionTime] = useState(0);
  const [startError, setStartError] = useState<string | null>(null);
  const [agentError, setAgentError] = useState<string | null>(null);
  const [userSpeaking, setUserSpeaking] = useState(false);
  const [endedByIntent, setEndedByIntent] = useState(false);
  const [tier, setTier] = useState<TherapyTier>(initialTier);
  const [limitReason, setLimitReason] = useState<LimitReason>(null);
  const [tokenBalance, setTokenBalance] = useState<number | null>(null);
  const [estimatedMinutesLeft, setEstimatedMinutesLeft] = useState<
    number | null
  >(null);
  const [warnBudget, setWarnBudget] = useState(false);
  const pendingEndRef = useRef(false);
  const lastBilledSecondsRef = useRef(0);
  const sessionTimeRef = useRef(0);
  const usageIdRef = useRef<string | null>(null);
  const endFallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const clearEndFallback = useCallback(() => {
    if (endFallbackTimerRef.current) {
      clearTimeout(endFallbackTimerRef.current);
      endFallbackTimerRef.current = null;
    }
  }, []);

  const closeUsage = useCallback(async (reason: string) => {
    const id = usageIdRef.current;
    if (!id) return;
    usageIdRef.current = null;
    await endUsageLedger({
      usageId: id,
      secondsAlive: sessionTimeRef.current,
      endReason: reason,
    });
  }, []);

  const finishSession = useCallback(
    (reason?: LimitReason) => {
      clearEndFallback();
      pendingEndRef.current = false;
      setEndedByIntent(true);
      setUserSpeaking(false);
      if (reason) setLimitReason(reason);
      void closeUsage(reason ?? 'user');
      stop();
    },
    [clearEndFallback, closeUsage, stop]
  );

  useAgentClientTool('end_session', (fn) => {
    pendingEndRef.current = true;
    clearEndFallback();
    endFallbackTimerRef.current = setTimeout(() => {
      if (pendingEndRef.current) finishSession();
    }, 4500);

    let reason = 'user_request';
    try {
      const args = JSON.parse(fn.arguments || '{}') as { reason?: string };
      if (args.reason) reason = args.reason;
    } catch {
      /* ignore */
    }
    return JSON.stringify({ ok: true, ended: true, reason });
  });

  useEffect(() => {
    if (!isActive) {
      setSessionTime(0);
      sessionTimeRef.current = 0;
      setUserSpeaking(false);
      lastBilledSecondsRef.current = 0;
      return;
    }
    const interval = setInterval(() => {
      setSessionTime((prev) => {
        const next = prev + 1;
        sessionTimeRef.current = next;
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Free hard stop + paid soft 20-min warning
  useEffect(() => {
    if (!isActive) return;
    if (tier === 'FREE' && sessionTime >= THERAPY_FREE_CAP_SECONDS) {
      finishSession('free_cap');
    }
  }, [isActive, sessionTime, tier, finishSession]);

  // Paid heartbeat debit
  useEffect(() => {
    if (!isActive || tier !== 'SUBSCRIBED') return;

    let cancelled = false;

    const beat = async () => {
      try {
        const res = await fetch('/api/ai-therapy/heartbeat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secondsAlive: sessionTimeRef.current,
            lastBilledSeconds: lastBilledSecondsRef.current,
            usageId: usageIdRef.current,
          }),
        });
        const data = (await res.json()) as {
          shouldEnd?: boolean;
          reason?: LimitReason;
          billedSeconds?: number;
          tokenBalance?: number | null;
          warnBudget?: boolean;
          estimatedMinutesLeft?: number | null;
        };
        if (cancelled) return;
        if (typeof data.billedSeconds === 'number') {
          lastBilledSecondsRef.current = data.billedSeconds;
        }
        if (typeof data.tokenBalance === 'number') {
          setTokenBalance(data.tokenBalance);
        }
        if (typeof data.estimatedMinutesLeft === 'number') {
          setEstimatedMinutesLeft(data.estimatedMinutesLeft);
        }
        if (typeof data.warnBudget === 'boolean') {
          setWarnBudget(data.warnBudget);
        }
        if (data.shouldEnd) {
          finishSession(data.reason ?? 'token_budget');
        }
      } catch (err) {
        console.error('Therapy heartbeat failed:', err);
      }
    };

    beat();
    const id = setInterval(beat, HEARTBEAT_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [isActive, tier, finishSession]);

  useEffect(() => {
    const onError = (msg: {
      description?: string;
      code?: string;
      message?: string;
    }) => {
      const text =
        msg.description || msg.message || msg.code || 'Voice agent error';
      console.error('Deepgram agent error:', msg);
      setAgentError(text);
    };
    const onWarning = (msg: {
      description?: string;
      code?: string;
      message?: string;
    }) => {
      console.warn('Deepgram agent warning:', msg);
    };
    const onSdkError = (err: Error) => {
      console.error('Deepgram SDK error:', err);
      setAgentError(err.message || 'Connection error');
    };
    const onUserSpeaking = () => setUserSpeaking(true);
    const onCoachSpeaking = () => setUserSpeaking(false);
    const onAudioDone = () => {
      setUserSpeaking(false);
      if (pendingEndRef.current) {
        window.setTimeout(() => finishSession(), 350);
      }
    };

    session.on('error', onError);
    session.on('warning', onWarning);
    session.on('sdk-error', onSdkError);
    session.on('user-started-speaking', onUserSpeaking);
    session.on('agent-started-speaking', onCoachSpeaking);
    session.on('agent-audio-done', onAudioDone);
    return () => {
      session.off('error', onError);
      session.off('warning', onWarning);
      session.off('sdk-error', onSdkError);
      session.off('user-started-speaking', onUserSpeaking);
      session.off('agent-started-speaking', onCoachSpeaking);
      session.off('agent-audio-done', onAudioDone);
      clearEndFallback();
    };
  }, [session, finishSession, clearEndFallback]);

  const coachSpeaking = isSpeaking;
  const inRoom = isActive || isConnecting;
  const showFreeWarning =
    isActive &&
    tier === 'FREE' &&
    sessionTime >= THERAPY_FREE_WARNING_SECONDS &&
    sessionTime < THERAPY_FREE_CAP_SECONDS;
  const showSoftLimitWarning =
    isActive && tier === 'SUBSCRIBED' && sessionTime >= SOFT_LIMIT_SECONDS;
  const showBudgetWarning =
    isActive && tier === 'SUBSCRIBED' && warnBudget && !showSoftLimitWarning;

  const statusCopy = (() => {
    if (isConnecting) return 'Connecting…';
    if (!isActive && limitReason === 'free_cap')
      return 'Free session limit reached';
    if (!isActive && limitReason === 'token_budget')
      return 'Token balance used up';
    if (!isActive && endedByIntent) return 'Session ended — take care';
    if (!isActive) return 'Ready when you are';
    if (coachSpeaking) return 'Coach speaking';
    if (userSpeaking) return 'Listening to you';
    if (micMuted) return 'Mic muted';
    return 'Listening';
  })();

  const handleStart = async () => {
    setStartError(null);
    setAgentError(null);
    setEndedByIntent(false);
    setLimitReason(null);
    setWarnBudget(false);
    pendingEndRef.current = false;
    lastBilledSecondsRef.current = 0;
    usageIdRef.current = null;
    clearEndFallback();
    try {
      const grant = await fetchDeepgramToken();
      setTier(grant.tier);
      if (typeof grant.tokenBalance === 'number') {
        setTokenBalance(grant.tokenBalance);
        setEstimatedMinutesLeft(estimateMinutesFromTokens(grant.tokenBalance));
      } else {
        setTokenBalance(null);
        setEstimatedMinutesLeft(null);
      }

      const usage = await startUsageLedger();
      usageIdRef.current = usage.usageId;
      if (typeof usage.tokenBalance === 'number') {
        setTokenBalance(usage.tokenBalance);
      }
      if (typeof usage.estimatedMinutesLeft === 'number') {
        setEstimatedMinutesLeft(usage.estimatedMinutesLeft);
      }

      await start();
    } catch (err) {
      console.error('Failed to start therapy session:', err);
      setStartError(
        err instanceof Error
          ? err.message
          : 'Could not start the session. Check microphone permissions and try again.'
      );
      usageIdRef.current = null;
      try {
        stop();
      } catch {
        /* ignore */
      }
    }
  };

  const handleEnd = () => {
    pendingEndRef.current = false;
    clearEndFallback();
    setEndedByIntent(false);
    setLimitReason(null);
    void closeUsage('user');
    stop();
    setStartError(null);
    setAgentError(null);
    setUserSpeaking(false);
    setWarnBudget(false);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col">
      {/* Top chrome */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              isActive
                ? 'bg-primary'
                : isConnecting
                  ? 'animate-pulse bg-muted-foreground'
                  : 'bg-border'
            )}
          />
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {inRoom
              ? connectionLabel(isActive, isConnecting, state)
              : 'Voice coaching'}
          </span>
        </div>
        <p
          className={cn(
            'font-heading text-lg tabular-nums tracking-tight',
            isActive ? 'text-foreground' : 'text-muted-foreground/35'
          )}
        >
          {formatTime(sessionTime)}
        </p>
      </div>

      {tier === 'SUBSCRIBED' && typeof tokenBalance === 'number' && (
        <p className="mb-6 text-center text-xs text-muted-foreground">
          {tokenBalance.toLocaleString()} tokens left
          {typeof estimatedMinutesLeft === 'number'
            ? ` · ~${estimatedMinutesLeft} min`
            : ''}
          <span className="text-muted-foreground/70">
            {' '}
            ({THERAPY_TOKENS_PER_MINUTE}/min)
          </span>
        </p>
      )}

      {/* Presence */}
      <div className="mb-3 text-center">
        <VoicePresence
          coachSpeaking={coachSpeaking}
          userSpeaking={userSpeaking && !coachSpeaking}
          isActive={isActive}
          isConnecting={isConnecting}
        />
        <AnimatePresence mode="wait">
          <motion.p
            key={statusCopy}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {statusCopy}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Pre-start copy — mirrors landing calm */}
      <AnimatePresence>
        {!inRoom && !endedByIntent && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden text-center"
          >
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground [text-wrap:pretty]">
              Talk freely. Your coach listens and responds — grounded lightly in
              your journal.
              {tier === 'FREE'
                ? ' Free sessions wrap gently at 5 minutes.'
                : ''}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showFreeWarning && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-secondary/70 mb-5 rounded-2xl px-4 py-3 text-center text-sm text-muted-foreground"
          >
            About a minute left on the free session.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBudgetWarning && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-secondary/70 mb-5 rounded-2xl px-4 py-3 text-center text-sm text-muted-foreground"
          >
            You&apos;ve used most of this session&apos;s token budget — wrap up
            or top up when you can.
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSoftLimitWarning && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-secondary/70 mb-5 rounded-2xl px-4 py-3 text-center text-sm text-muted-foreground"
          >
            About 20 minutes in — wrap up when it feels right.
          </motion.div>
        )}
      </AnimatePresence>

      {!inRoom && limitReason && (
        <div className="bg-secondary/60 mb-5 space-y-3 rounded-2xl px-4 py-4 text-center">
          <p className="text-sm text-muted-foreground">
            {limitReason === 'free_cap'
              ? 'Free sessions wrap at 5 minutes. Upgrade for longer, token-based coaching.'
              : 'Your token balance is empty. Top up to continue talking.'}
          </p>
          <Button asChild size="sm" className="rounded-2xl">
            <Link href="/user/billing">
              {limitReason === 'free_cap' ? 'Upgrade' : 'Top up'}
            </Link>
          </Button>
        </div>
      )}

      {(startError || agentError) && (
        <div className="border-destructive/30 bg-destructive/10 mb-5 space-y-3 rounded-2xl border px-4 py-3 text-sm text-destructive">
          <p>{startError || agentError}</p>
          {(startError?.toLowerCase().includes('token') ||
            startError?.toLowerCase().includes('upgrade') ||
            startError?.toLowerCase().includes('top up')) && (
            <Button asChild size="sm" variant="outline" className="rounded-2xl">
              <Link href="/user/billing">Go to billing</Link>
            </Button>
          )}
        </div>
      )}

      {/* Captions — live only / after turns */}
      {(inRoom || conversation.length > 0) && (
        <div className="mb-8">
          <CaptionStrip conversation={conversation} isActive={isActive} />
        </div>
      )}

      {/* Control dock */}
      <div className="flex items-center justify-center gap-3">
        {!inRoom ? (
          <div className="flex flex-col items-center gap-3">
            <Button
              onClick={handleStart}
              size="lg"
              className="h-12 min-w-[11rem] gap-2 rounded-2xl px-8"
            >
              <Phone className="h-4 w-4" />
              Start session
            </Button>
            <p className="text-xs text-muted-foreground">
              Mic required · ~20 min soft reminder
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-border/80 bg-card/90 flex items-center gap-3 rounded-[1.75rem] border p-2 shadow-sm backdrop-blur-sm"
          >
            <ControlButton
              label={micMuted ? 'Unmute microphone' : 'Mute microphone'}
              onClick={() => setMicMuted(!micMuted)}
              active={micMuted}
              disabled={isConnecting}
            >
              {micMuted ? (
                <MicOff className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </ControlButton>

            <ControlButton
              label="End session"
              onClick={handleEnd}
              danger
              disabled={isConnecting}
            >
              <PhoneOff className="h-5 w-5" />
            </ControlButton>

            <ControlButton
              label={outputMuted ? 'Unmute speaker' : 'Mute speaker'}
              onClick={() => setOutputMuted(!outputMuted)}
              active={outputMuted}
              disabled={isConnecting}
            >
              {outputMuted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </ControlButton>
          </motion.div>
        )}
      </div>

      {/* Quiet disclaimer — pre-start only */}
      <AnimatePresence>
        {!inRoom && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-10 flex items-start justify-center gap-2 text-center text-xs leading-relaxed text-muted-foreground"
          >
            <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
            <span>
              Not clinical care. In an emergency, contact local services or 988
              (US).
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

function SessionShell({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <motion.div
      {...pageAnimations}
      className="relative mx-auto max-w-xl px-4 pb-16 pt-6"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-8 h-72 rounded-[3rem] bg-[radial-gradient(ellipse_at_top,oklch(var(--primary)_/_0.08),transparent_70%)]"
      />

      <div className="relative mb-10">
        <Link
          href="/user/ai-therapy"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          AI Therapy
        </Link>
      </div>

      <div className="relative">{children}</div>
    </motion.div>
  );
}

function ActiveSession({
  agent,
  initialTier,
}: Readonly<{ agent: AgentSettingsObject; initialTier: TherapyTier }>) {
  const tokenFactory = useCallback(async () => {
    const grant = await fetchDeepgramToken();
    return grant.access_token;
  }, []);

  const config = useMemo(
    () => ({
      auth: { tokenFactory },
      agent,
      audio: {
        input: {
          encoding: 'linear16' as const,
          sampleRate: DEEPGRAM_MIC_SAMPLE_RATE,
        },
        output: {
          encoding: 'linear16' as const,
          sampleRate: DEEPGRAM_PLAYER_SAMPLE_RATE,
        },
      },
      reconnect: { enabled: false },
    }),
    [agent, tokenFactory]
  );

  return (
    <AgentProvider
      config={config}
      microphone
      microphoneOptions={{ sampleRate: DEEPGRAM_MIC_SAMPLE_RATE }}
      tts
      playerSampleRate={DEEPGRAM_PLAYER_SAMPLE_RATE}
    >
      <SessionControls initialTier={initialTier} />
    </AgentProvider>
  );
}

async function loadAgentSettings(): Promise<{
  agent: AgentSettingsObject;
  tier: TherapyTier;
}> {
  const res = await fetch('/api/ai-therapy/session');
  if (!res.ok) {
    throw new Error('Failed to load therapy session settings');
  }
  const data = (await res.json()) as {
    agent?: AgentSettingsObject;
    tier?: TherapyTier;
  };
  if (!data.agent) {
    throw new Error('Invalid therapy session settings');
  }
  return {
    agent: data.agent,
    tier: data.tier === 'SUBSCRIBED' ? 'SUBSCRIBED' : 'FREE',
  };
}

export default function AiSession() {
  const [agent, setAgent] = useState<AgentSettingsObject | null>(null);
  const [tier, setTier] = useState<TherapyTier>('FREE');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    setAgent(null);
    loadAgentSettings()
      .then((data) => {
        setAgent(data.agent);
        setTier(data.tier);
      })
      .catch((err) => {
        console.error(err);
        setLoadError(
          err instanceof Error
            ? err.message
            : 'Could not prepare your therapy session.'
        );
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadAgentSettings()
      .then((data) => {
        if (!cancelled) {
          setAgent(data.agent);
          setTier(data.tier);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) {
          setLoadError(
            err instanceof Error
              ? err.message
              : 'Could not prepare your therapy session.'
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <SessionShell>
        <div className="mx-auto max-w-md space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3 w-28 rounded-full" />
            <Skeleton className="h-5 w-14 rounded-lg" />
          </div>
          <Skeleton className="mx-auto h-56 w-56 rounded-full" />
          <Skeleton className="mx-auto h-4 w-32 rounded-xl" />
          <Skeleton className="mx-auto h-12 w-44 rounded-2xl" />
        </div>
      </SessionShell>
    );
  }

  if (loadError || !agent) {
    return (
      <SessionShell>
        <div className="border-destructive/30 bg-destructive/10 mx-auto max-w-md rounded-3xl border p-8 text-center">
          <p className="mb-5 text-sm text-destructive">
            {loadError ?? 'Session unavailable.'}
          </p>
          <Button variant="outline" onClick={reload} className="rounded-2xl">
            Try again
          </Button>
        </div>
      </SessionShell>
    );
  }

  return (
    <SessionShell>
      <ActiveSession agent={agent} initialTier={tier} />
    </SessionShell>
  );
}
