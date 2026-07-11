'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import ChatPanel from './chat-panel';

/**
 * Alan-inspired — cream paper, bold blue action, soft single sans.
 * Friendly health companion, not lab brochure or spa wellness.
 * Palette drawn from alan.com tokens; typeface: Alan Sans (OFL).
 */
const PAPER = '#fffcf5';
const INK = '#282830';
const MUTED = '#656779';
const BLUE = '#0a70ff';
const BLUE_DEEP = '#0057d1';
const BLUE_SOFT = '#ebf5ff';
const LIME = '#fcff7e';
const GREEN_SOFT = '#ecf7e9';
const GREEN = '#367940';
const RULE = 'rgba(40, 40, 48, 0.1)';
const EASE = [0.16, 1, 0.3, 1] as const;

function AppPreview() {
  return (
    <div
      className="mx-auto w-full max-w-[320px] overflow-hidden rounded-[28px]"
      style={{
        background: '#fff',
        border: `1px solid ${RULE}`,
        boxShadow: '0 28px 60px rgba(10, 112, 255, 0.12)',
      }}
    >
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ background: BLUE_SOFT }}
      >
        <div>
          <p className="text-xs font-medium" style={{ color: MUTED }}>
            Good evening
          </p>
          <p
            className="text-lg font-bold tracking-tight"
            style={{ color: INK }}
          >
            How are you?
          </p>
        </div>
        <span
          className="rounded-full px-3 py-1 text-xs font-bold"
          style={{ background: LIME, color: INK }}
        >
          Day 14
        </span>
      </div>

      <div className="space-y-3 p-4">
        <div
          className="rounded-2xl p-4"
          style={{ background: PAPER, border: `1px solid ${RULE}` }}
        >
          <p
            className="mb-2 text-[11px] font-bold uppercase tracking-wider"
            style={{ color: MUTED }}
          >
            Today&apos;s mood
          </p>
          <div className="flex gap-2">
            {['Low', 'Meh', 'Ok', 'Good', 'Great'].map((label, i) => (
              <div
                key={label}
                className="flex h-10 flex-1 items-center justify-center rounded-xl text-[10px] font-bold"
                style={{
                  background: i === 3 ? BLUE : '#fff',
                  color: i === 3 ? '#fff' : MUTED,
                  border: i === 3 ? 'none' : `1px solid ${RULE}`,
                }}
              >
                {i === 3 ? 'Good' : ''}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl p-3.5" style={{ background: GREEN_SOFT }}>
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: GREEN }}
            >
              BP
            </p>
            <p
              className="mt-1 text-xl font-bold tracking-tight"
              style={{ color: INK }}
            >
              118/76
            </p>
          </div>
          <div className="rounded-2xl p-3.5" style={{ background: BLUE_SOFT }}>
            <p
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: BLUE_DEEP }}
            >
              Glucose
            </p>
            <p
              className="mt-1 text-xl font-bold tracking-tight"
              style={{ color: INK }}
            >
              94
              <span className="text-xs font-medium" style={{ color: MUTED }}>
                {' '}
                mg/dL
              </span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl p-4" style={{ background: INK }}>
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/50">
            Talk it through
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            AI therapist ready when you are
          </p>
          <div
            className="mt-3 inline-flex rounded-full px-3 py-1.5 text-xs font-bold"
            style={{ background: LIME, color: INK }}
          >
            Start a session
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen" style={{ background: PAPER, color: INK }}>
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute left-0 top-24 h-px w-full"
        aria-hidden="true"
      />

      {/* Nav */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[background,box-shadow] duration-300"
        style={{
          background: scrolled ? 'rgba(255, 252, 245, 0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : undefined,
          boxShadow: scrolled ? `0 1px 0 ${RULE}` : 'none',
        }}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            HealthMind
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#why"
              className="text-sm font-medium hover:opacity-70"
              style={{ color: MUTED }}
            >
              Why HealthMind
            </a>
            <a
              href="#app"
              className="text-sm font-medium hover:opacity-70"
              style={{ color: MUTED }}
            >
              The app
            </a>
            <Link
              href="/sign-in"
              className="text-sm font-medium hover:opacity-70"
              style={{ color: MUTED }}
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="rounded-full px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: BLUE }}
            >
              Start free
            </Link>
          </nav>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center md:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col px-5 pt-24 md:hidden"
          style={{ background: PAPER }}
        >
          <a
            href="#why"
            className="border-b py-5 text-2xl font-bold"
            style={{ borderColor: RULE }}
            onClick={() => setMenuOpen(false)}
          >
            Why HealthMind
          </a>
          <a
            href="#app"
            className="border-b py-5 text-2xl font-bold"
            style={{ borderColor: RULE }}
            onClick={() => setMenuOpen(false)}
          >
            The app
          </a>
          <Link
            href="/sign-in"
            className="border-b py-5 text-2xl font-bold"
            style={{ borderColor: RULE }}
            onClick={() => setMenuOpen(false)}
          >
            Log in
          </Link>
          <Link
            href="/sign-up"
            className="mt-8 rounded-full py-4 text-center text-lg font-bold text-white"
            style={{ background: BLUE }}
            onClick={() => setMenuOpen(false)}
          >
            Start free
          </Link>
        </div>
      )}

      {/* Hero — Alan: brand + promise + dual CTA + proof */}
      <section className="px-5 pb-8 pt-32 sm:px-8 sm:pb-12 sm:pt-40">
        <div className="mx-auto max-w-6xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto max-w-3xl font-bold tracking-tight [text-wrap:balance]"
            style={{
              fontSize: 'clamp(2.75rem, 7vw, 4.75rem)',
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
            }}
          >
            Your health partner,{' '}
            <span className="rounded-lg px-2" style={{ background: LIME }}>
              every day.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.1 }}
            className="mx-auto mt-6 max-w-xl text-lg leading-relaxed sm:text-xl"
            style={{ color: MUTED }}
          >
            Mood, vitals, and someone to talk to — mental and physical health in
            one quiet app you&apos;ll actually open.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              href="/sign-up"
              className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: BLUE }}
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="rounded-full px-7 py-3.5 text-sm font-bold transition-colors hover:bg-black/5"
              style={{ color: INK, border: `1.5px solid ${RULE}` }}
            >
              Log in
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-8 text-sm font-medium"
            style={{ color: MUTED }}
          >
            Free to start · Private by default · No insurance needed
          </motion.p>
        </div>
      </section>

      {/* Phone preview */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.25 }}
          className="relative mx-auto max-w-6xl"
        >
          <div
            className="absolute left-1/2 top-1/2 -z-10 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80"
            style={{
              background: `radial-gradient(circle, ${BLUE_SOFT} 0%, transparent 70%)`,
            }}
            aria-hidden="true"
          />
          <AppPreview />
        </motion.div>
      </section>

      {/* Stats — Alan-style proof strip */}
      <section id="why" className="px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, ease: EASE }}
            className="mb-10 max-w-2xl text-center sm:mx-auto sm:text-left"
          >
            <p className="mb-3 text-sm font-bold" style={{ color: BLUE_DEEP }}>
              Built for real life, not another dashboard
            </p>
            <h2
              className="font-bold tracking-tight [text-wrap:balance]"
              style={{
                fontSize: 'clamp(1.65rem, 3.5vw, 2.25rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.2,
                color: INK,
              }}
            >
              One home for how you feel, what your body says, and support when
              you need it.
            </h2>
          </motion.div>

          <div
            className="overflow-hidden rounded-[2rem]"
            style={{ background: BLUE_SOFT }}
          >
            <div className="grid sm:grid-cols-3">
              {[
                {
                  n: '1',
                  unit: 'place',
                  title: 'Mind and body, same home',
                  label:
                    'Mood, journal, blood pressure, glucose, goals, and therapy modules live together — so patterns are easier to notice.',
                  detail: 'No more hopping between wellness apps',
                  accent: LIME,
                },
                {
                  n: '<1',
                  unit: 'min',
                  title: 'Fast enough for busy days',
                  label:
                    'Tap how you feel, jot a line if you want, and get back to your day. Check-ins are designed to be light, not another chore.',
                  detail: 'Optional deeper journal when you have time',
                  accent: null,
                },
                {
                  n: '24',
                  unit: '/7',
                  title: 'Support between appointments',
                  label:
                    'AI chat, guided CBT-style modules, and voice therapy sessions for the hours when a waiting room is not an option.',
                  detail: 'Companion support — not a clinical replacement',
                  accent: null,
                },
              ].map((s, i) => (
                <motion.div
                  key={s.n + s.unit}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className={`relative flex flex-col px-7 py-10 text-center sm:px-8 sm:py-12 sm:text-left ${
                    i > 0 ? 'border-t sm:border-t-0' : ''
                  }`}
                  style={
                    i > 0
                      ? { borderColor: 'rgba(10, 112, 255, 0.12)' }
                      : undefined
                  }
                >
                  {i > 0 && (
                    <div
                      className="absolute bottom-8 left-0 top-8 hidden w-px sm:block"
                      style={{ background: 'rgba(10, 112, 255, 0.15)' }}
                      aria-hidden="true"
                    />
                  )}

                  <div className="flex items-baseline justify-center gap-1 sm:justify-start">
                    <span
                      className="font-bold tracking-tight"
                      style={{
                        fontSize: 'clamp(3rem, 6vw, 4rem)',
                        letterSpacing: '-0.04em',
                        color: INK,
                        background: s.accent ?? 'transparent',
                        borderRadius: s.accent ? '0.5rem' : undefined,
                        padding: s.accent ? '0 0.2em' : undefined,
                        lineHeight: 1,
                      }}
                    >
                      {s.n}
                    </span>
                    <span
                      className="text-2xl font-bold tracking-tight sm:text-3xl"
                      style={{ color: BLUE }}
                    >
                      {s.unit}
                    </span>
                  </div>
                  <h3
                    className="mt-5 text-base font-bold tracking-tight"
                    style={{ color: INK }}
                  >
                    {s.title}
                  </h3>
                  <p
                    className="mx-auto mt-2 max-w-[18rem] flex-1 text-sm leading-relaxed sm:mx-0 sm:max-w-none"
                    style={{ color: MUTED }}
                  >
                    {s.label}
                  </p>
                  <p
                    className="mx-auto mt-4 max-w-[18rem] text-xs font-medium leading-snug sm:mx-0 sm:max-w-none"
                    style={{ color: BLUE_DEEP }}
                  >
                    {s.detail}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.2 }}
              className="grid gap-6 border-t px-7 py-8 sm:grid-cols-3 sm:gap-0 sm:px-8"
              style={{ borderColor: 'rgba(10, 112, 255, 0.12)' }}
            >
              {[
                {
                  title: 'Insights that connect the dots',
                  body: 'Weekly patterns across mood and vitals — not just another chart dump.',
                },
                {
                  title: 'Private by design',
                  body: 'Your data stays yours. Export or delete anytime from your account.',
                },
                {
                  title: 'Free to start',
                  body: 'Core tracking and limited AI support included. Upgrade only if you want more.',
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className={`relative text-center sm:px-6 sm:text-left ${
                    i > 0 ? 'sm:pl-8' : ''
                  }`}
                >
                  {i > 0 && (
                    <div
                      className="absolute bottom-0 left-0 top-0 hidden w-px sm:block"
                      style={{ background: 'rgba(10, 112, 255, 0.12)' }}
                      aria-hidden="true"
                    />
                  )}
                  <p
                    className="text-sm font-bold tracking-tight"
                    style={{ color: INK }}
                  >
                    {item.title}
                  </p>
                  <p
                    className="mt-1.5 text-xs leading-relaxed sm:text-sm"
                    style={{ color: MUTED }}
                  >
                    {item.body}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem → solution */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="max-w-2xl font-bold tracking-tight [text-wrap:balance]"
            style={{
              fontSize: 'clamp(1.85rem, 4vw, 3rem)',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
            }}
          >
            Your mind and body talk to each other.
            <br />
            <span style={{ color: MUTED }}>Your apps usually don&apos;t.</span>
          </motion.h2>

          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {[
              {
                bg: BLUE_SOFT,
                title: 'Mood & journal',
                body: 'Log how you feel in seconds. Over weeks, patterns show up that are hard to see day to day.',
              },
              {
                bg: GREEN_SOFT,
                title: 'Vitals in context',
                body: 'Blood pressure and glucose beside the days you felt off — so the body is never a separate story.',
              },
              {
                bg: LIME,
                title: 'Support anytime',
                body: 'CBT modules and an AI therapist for the hours when a waiting room is not an option.',
              },
            ].map((card, i) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-32px' }}
                transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
                className="rounded-3xl p-7 sm:p-8"
                style={{ background: card.bg }}
              >
                <h3 className="text-xl font-bold tracking-tight">
                  {card.title}
                </h3>
                <p
                  className="mt-3 text-sm leading-relaxed sm:text-base"
                  style={{ color: MUTED }}
                >
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App section */}
      <section
        id="app"
        className="px-5 py-20 sm:px-8 sm:py-28"
        style={{ background: BLUE_SOFT }}
      >
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="mb-3 text-sm font-bold" style={{ color: BLUE_DEEP }}>
              The app
            </p>
            <h2
              className="font-bold tracking-tight [text-wrap:balance]"
              style={{
                fontSize: 'clamp(1.85rem, 3.5vw, 2.75rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
              }}
            >
              Health found its home screen.
            </h2>
            <ul className="mt-8 space-y-4">
              {[
                'Mood and vitals in the same day view — connected, not siloed',
                'Therapy modules you can finish at your own pace',
                'Private by design: export or delete anytime',
              ].map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-base leading-relaxed"
                  style={{ color: MUTED }}
                >
                  <span
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ background: BLUE }}
                    aria-hidden="true"
                  />
                  {line}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-9 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: BLUE }}
            >
              Try the app free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <AppPreview />
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div
            className="rounded-[2rem] px-6 py-14 text-center sm:px-12 sm:py-20"
            style={{ background: LIME }}
          >
            <h2
              className="mx-auto max-w-2xl font-bold tracking-tight [text-wrap:balance]"
              style={{
                fontSize: 'clamp(1.85rem, 4vw, 3rem)',
                letterSpacing: '-0.03em',
                lineHeight: 1.12,
              }}
            >
              Ready in a few minutes.
              <br />
              With you every day after that.
            </h2>
            <p
              className="mx-auto mt-4 max-w-md text-base"
              style={{ color: MUTED }}
            >
              Create your account. Log one mood. See how it feels to keep mind
              and body in the same place.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
              style={{ background: BLUE }}
            >
              Start free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer
        className="border-t px-5 py-8 sm:px-8"
        style={{ borderColor: RULE }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-bold">© 2026 HealthMind</span>
          <span style={{ color: MUTED }}>
            Your wellness partner. Private by default.
          </span>
        </div>
      </footer>

      <ChatPanel />
    </div>
  );
}
