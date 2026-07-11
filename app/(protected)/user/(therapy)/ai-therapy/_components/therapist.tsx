'use client';

import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import {
  Brain,
  Mic,
  ShieldCheck,
  Clock,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import HealthMindBot from '@/components/custom-icons/healthmind-bot';

const FEATURES = [
  {
    icon: Mic,
    heading: 'Voice sessions',
    body: "Talk through what's on your mind with an evidence-informed coach — no appointments.",
  },
  {
    icon: Brain,
    heading: 'Journal-aware',
    body: 'Mood and journal themes gently inform the conversation so it feels grounded in you.',
  },
  {
    icon: ShieldCheck,
    heading: 'Private by design',
    body: "Encrypted in transit. We don't store session audio. Educational support, not clinical care.",
  },
  {
    icon: Clock,
    heading: 'Whenever you need',
    body: 'Late night or lunch break — support on your schedule, not a waiting list.',
  },
] as const;

const featureVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.4, ease: 'easeOut' as const },
  }),
};

export default function Therapist() {
  return (
    <motion.div
      {...pageAnimations}
      className="relative mx-auto max-w-3xl px-4 py-12 sm:py-16"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-8 h-72 rounded-[3rem] bg-[radial-gradient(ellipse_at_top,oklch(var(--primary)_/_0.08),transparent_70%)]"
      />

      <div className="relative mb-14 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mx-auto mb-8"
        >
          <HealthMindBot size={80} className="mx-auto rounded-[1.75rem]" />
        </motion.div>

        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Voice coaching
        </p>
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl [text-wrap:balance]">
          AI Therapy
        </h1>
        <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg [text-wrap:pretty]">
          A calm voice session grounded in CBT, DBT, and ACT-informed coaching —
          personalised lightly to your journal.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-w-[11rem] gap-2 px-8">
            <Link href="/user/ai-therapy/session">
              Start session
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Mic required · ~20 min soft reminder
          </p>
        </div>
      </div>

      <ul className="relative mb-12 grid gap-4 sm:grid-cols-2">
        {FEATURES.map(({ icon: Icon, heading, body }, i) => (
          <motion.li
            key={heading}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={featureVariants}
            className="border-border/80 flex gap-4 rounded-3xl border bg-card p-5"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
              <Icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="mb-1 font-semibold text-foreground">{heading}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>

      <div className="flex gap-3 rounded-2xl border border-border/80 bg-secondary/60 p-4">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Not clinical care.</span>{' '}
          Supportive conversation only. In an emergency, contact local services
          or the 988 Suicide &amp; Crisis Lifeline (US).
        </p>
      </div>
    </motion.div>
  );
}
