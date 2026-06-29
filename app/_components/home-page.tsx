'use client';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MobileNav from './mobile-nav';
import { ModeToggle } from '@/components/dark-mode';
import { cn } from '@/lib/utils';

function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="16" cy="16" r="15" fill="currentColor" fillOpacity="0.15" />
      {/* Upper arc (mind) */}
      <path
        d="M8 16 C8 11 12 8 16 8 C20 8 24 11 24 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Lower arc (body), softer */}
      <path
        d="M8 16 C8 21 12 24 16 24 C20 24 24 21 24 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeOpacity="0.5"
      />
      <circle cx="16" cy="16" r="2.25" fill="currentColor" />
    </svg>
  );
}

const FEATURES = [
  {
    accentColor: 'oklch(0.490 0.150 270)',
    name: 'Mood & Journal',
    heading: 'Know yourself better.',
    body: "Log how you're feeling and why. Your journal becomes a mirror — and over time, patterns emerge that are hard to see day to day.",
  },
  {
    accentColor: 'oklch(0.520 0.130 162)',
    name: 'Health Tracking',
    heading: 'Your vitals, in context.',
    body: 'Blood pressure, glucose, and physical health tracked alongside your mental state. The full picture, not just the numbers.',
  },
  {
    accentColor: 'oklch(0.540 0.145 350)',
    name: 'AI Therapy',
    heading: 'Support when you need it.',
    body: "Talk through what's on your mind with an AI therapist. Or work through CBT modules at your own pace — no appointments, no waiting.",
  },
];

const ENTER = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const VIEW_ENTER = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-48px' },
};

const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Sticky nav ──────────────────────────────────────────────── */}
      <header
        className={cn(
          'sticky top-0 z-[200] transition-all duration-300',
          scrolled
            ? 'border-b border-border bg-background/95 backdrop-blur-sm'
            : 'bg-primary'
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-4 sm:px-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <LogoMark
              className={cn(
                'h-6 w-6',
                scrolled ? 'text-primary' : 'text-primary-foreground'
              )}
            />
            <span
              className={cn(
                'text-lg font-semibold tracking-tight',
                scrolled ? 'text-foreground' : 'text-primary-foreground'
              )}
            >
              HealthMind
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className={cn(
                'text-sm font-medium transition-opacity hover:opacity-70',
                scrolled ? 'text-muted-foreground' : 'text-primary-foreground/80'
              )}
            >
              Features
            </a>
            <Link href="/sign-in">
              <Button
                size="sm"
                className={cn(
                  'rounded-full px-5',
                  scrolled
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'bg-primary-foreground text-primary hover:bg-primary-foreground/90'
                )}
              >
                Sign in
              </Button>
            </Link>
            <ModeToggle />
          </div>

          {/* Mobile nav */}
          <div className="flex items-center gap-1 md:hidden">
            <ModeToggle />
            <MobileNav scrolled={scrolled} />
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[88vh] items-center bg-primary px-4 py-24 sm:px-6">
        {/* Abstract background — soft overlapping circles, very low opacity */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid slice"
        >
          <circle cx="8%" cy="18%" r="36%" fill="white" fillOpacity="0.06" />
          <circle cx="94%" cy="78%" r="30%" fill="white" fillOpacity="0.05" />
          <circle cx="48%" cy="115%" r="40%" fill="white" fillOpacity="0.04" />
        </svg>

        <div className="container relative mx-auto max-w-4xl">
          <motion.h1
            {...ENTER}
            transition={{ duration: 0.65, ease: EASE_OUT, delay: 0 }}
            className="mb-6 font-heading text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[1.07] tracking-[-0.03em] text-primary-foreground [text-wrap:balance]"
          >
            Your mental and physical health, finally together.
          </motion.h1>

          <motion.p
            {...ENTER}
            transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.1 }}
            className="mb-10 max-w-lg text-[clamp(1rem,1.4vw,1.2rem)] leading-relaxed text-primary-foreground/80"
          >
            Track your mood, log your vitals, and talk to an AI therapist.
            HealthMind brings it all into one quiet place.
          </motion.p>

          <motion.div
            {...ENTER}
            transition={{ duration: 0.65, ease: EASE_OUT, delay: 0.18 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/sign-up">
              <Button
                size="lg"
                className="rounded-full bg-primary-foreground px-8 text-primary hover:bg-primary-foreground/90"
              >
                Start for free
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                size="lg"
                variant="ghost"
                className="rounded-full px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              >
                Sign in
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section
        id="features"
        className="bg-background px-4 py-24 sm:px-6 lg:py-32"
      >
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-16">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.name}
                {...VIEW_ENTER}
                transition={{ duration: 0.5, ease: EASE_OUT, delay: i * 0.08 }}
              >
                {/* Short accent rule — different color per feature */}
                <div
                  className="mb-6 h-[2px] w-10 rounded-full"
                  style={{ backgroundColor: feature.accentColor }}
                  aria-hidden="true"
                />
                <p className="mb-2 text-sm font-medium text-muted-foreground">
                  {feature.name}
                </p>
                <h3 className="mb-3 text-2xl font-semibold tracking-tight text-foreground">
                  {feature.heading}
                </h3>
                <p className="text-base leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────────── */}
      <section className="bg-secondary px-4 py-24 sm:px-6 lg:py-32">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.h2
            {...VIEW_ENTER}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0 }}
            className="mb-4 font-heading text-[clamp(2rem,4vw,3.5rem)] font-bold tracking-[-0.025em] text-foreground [text-wrap:balance]"
          >
            Ready when you are.
          </motion.h2>
          <motion.p
            {...VIEW_ENTER}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.08 }}
            className="mb-8 text-lg leading-relaxed text-muted-foreground"
          >
            No pressure, no rush. Start your journey at your own pace.
          </motion.p>
          <motion.div
            {...VIEW_ENTER}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.15 }}
          >
            <Link href="/sign-up">
              <Button size="lg" className="rounded-full px-10">
                Create your account
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background px-4 py-8 sm:px-6">
        <div className="container mx-auto flex flex-col items-center gap-1 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>© 2025 HealthMind</span>
          <span>Empowering your wellness journey.</span>
        </div>
      </footer>
    </div>
  );
}
