'use client';
import { motion } from 'motion/react';
import { pageAnimations } from '@/lib/motion';
import { Brain, Mic, ShieldCheck, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COMING_FEATURES = [
  {
    icon: Mic,
    heading: 'Voice therapy sessions',
    body: "Talk through what's on your mind with an AI therapist trained on evidence-based approaches — no appointments, no waiting.",
  },
  {
    icon: Brain,
    heading: 'Personalised to your journal',
    body: 'Your mood history and journal entries will inform every session, so support feels grounded in your actual experience.',
  },
  {
    icon: ShieldCheck,
    heading: 'Private and end-to-end encrypted',
    body: 'Sessions never touch external servers unencrypted. Your words stay yours.',
  },
  {
    icon: Clock,
    heading: 'Available any time',
    body: 'Support at 2am or during a lunch break — whenever you need it most.',
  },
];

export default function Therapist() {
  return (
    <motion.div
      {...pageAnimations}
      className="mx-auto max-w-2xl px-4 py-16 sm:py-24"
    >
      <div className="mb-12 text-center">
        <Badge
          variant="secondary"
          className="mb-6 px-3 py-1 text-xs font-medium tracking-wide"
        >
          Coming soon
        </Badge>
        <h1 className="mb-4 font-heading text-4xl font-bold tracking-tight text-foreground [text-wrap:balance]">
          AI Therapy
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground [text-wrap:pretty]">
          We&apos;re building a thoughtful voice therapy experience directly
          inside HealthMind. This feature is not yet available — here&apos;s
          what&apos;s coming.
        </p>
      </div>

      <ul className="space-y-8">
        {COMING_FEATURES.map(({ icon: Icon, heading, body }) => (
          <li key={heading} className="flex gap-4">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <p className="mb-1 font-semibold text-foreground">{heading}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
