'use client';
// taste-skill dials:
// DESIGN_VARIANCE: 6 — asymmetric hero, varied feature layouts, broken zigzag
// MOTION_INTENSITY: 3 — entrance fades + hero float only, no decorative scroll FX
// VISUAL_DENSITY: 5 — balanced, not sparse, not packed

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import MobileNav from './mobile-nav';
import { ModeToggle } from '@/components/dark-mode';
import { cn } from '@/lib/utils';
import {
  Heart,
  Brain,
  TrendingUp,
  Smile,
  ShieldCheck,
  Zap,
  Minus,
} from 'lucide-react';

// taste-skill: one accent color per page
const ACCENT = 'oklch(0.65 0.18 280)';
const ACCENT_BG = 'rgba(105,79,193,0.08)';
const ACCENT_BORDER = 'rgba(105,79,193,0.18)';
const HERO_BG = 'oklch(0.12 0.04 268)';
const EASE = [0.16, 1, 0.3, 1] as const;

// Mini sparkline bars — purely decorative data viz inside cards
function Sparkline({ bars, color }: { bars: number[]; color: string }) {
  const max = Math.max(...bars);
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
      {bars.map((v, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full"
          style={{
            height: `${Math.round((v / max) * 100)}%`,
            background:
              i === bars.length - 1 ? color : 'rgba(255,255,255,0.15)',
          }}
        />
      ))}
    </div>
  );
}

// Feature illustrations — SVG scenes, not single icons
function IllustrationJournal() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* Notebook */}
      <rect
        x="30"
        y="18"
        width="110"
        height="130"
        rx="8"
        fill="rgba(105,79,193,0.12)"
        stroke="rgba(105,79,193,0.25)"
        strokeWidth="1.2"
      />
      {/* Spine */}
      <rect
        x="30"
        y="18"
        width="14"
        height="130"
        rx="4"
        fill="rgba(105,79,193,0.2)"
      />
      {/* Binding dots */}
      {[35, 55, 75, 95, 115].map((y) => (
        <circle key={y} cx="37" cy={y} r="2.5" fill="rgba(105,79,193,0.45)" />
      ))}
      {/* Lines */}
      {[50, 65, 80, 95, 110].map((y) => (
        <line
          key={y}
          x1="55"
          y1={y}
          x2="128"
          y2={y}
          stroke="rgba(105,79,193,0.2)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      ))}
      {/* Shorter last line — feels written */}
      <line
        x1="55"
        y1="125"
        x2="98"
        y2="125"
        stroke="rgba(105,79,193,0.2)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Date chip */}
      <rect
        x="55"
        y="28"
        width="58"
        height="14"
        rx="7"
        fill="rgba(105,79,193,0.18)"
      />
      <text
        x="84"
        y="38.5"
        textAnchor="middle"
        fill="rgba(105,79,193,0.75)"
        fontSize="7"
        fontFamily="system-ui"
      >
        June 30, 2025
      </text>
      {/* Mood faces — row */}
      {[
        { cx: 158, cy: 40, smile: true, active: false },
        { cx: 158, cy: 68, smile: false, active: false },
        { cx: 158, cy: 96, smile: true, active: true },
        { cx: 158, cy: 124, smile: true, active: false },
      ].map((f, i) => (
        <g key={i}>
          <circle
            cx={f.cx}
            cy={f.cy}
            r="11"
            fill={f.active ? 'rgba(105,79,193,0.3)' : 'rgba(105,79,193,0.08)'}
            stroke={f.active ? 'rgba(105,79,193,0.6)' : 'rgba(105,79,193,0.18)'}
            strokeWidth="1"
          />
          {/* Eyes */}
          <circle
            cx={f.cx - 3.5}
            cy={f.cy - 2}
            r="1.2"
            fill={f.active ? 'rgba(105,79,193,0.9)' : 'rgba(105,79,193,0.4)'}
          />
          <circle
            cx={f.cx + 3.5}
            cy={f.cy - 2}
            r="1.2"
            fill={f.active ? 'rgba(105,79,193,0.9)' : 'rgba(105,79,193,0.4)'}
          />
          {/* Mouth */}
          {f.smile ? (
            <path
              d={`M ${f.cx - 4} ${f.cy + 3} Q ${f.cx} ${f.cy + 6.5} ${f.cx + 4} ${f.cy + 3}`}
              stroke={
                f.active ? 'rgba(105,79,193,0.9)' : 'rgba(105,79,193,0.4)'
              }
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <line
              x1={f.cx - 4}
              y1={f.cy + 4.5}
              x2={f.cx + 4}
              y2={f.cy + 4.5}
              stroke="rgba(105,79,193,0.4)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          )}
        </g>
      ))}
    </svg>
  );
}

function IllustrationVitals() {
  // ECG path points
  const ecgPath =
    'M 20 80 L 45 80 L 52 80 L 57 55 L 63 105 L 68 68 L 73 80 L 90 80 L 95 80 L 100 60 L 105 100 L 110 72 L 115 80 L 145 80';
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* Background panel */}
      <rect
        x="15"
        y="15"
        width="170"
        height="130"
        rx="10"
        fill="rgba(105,79,193,0.06)"
        stroke="rgba(105,79,193,0.15)"
        strokeWidth="1"
      />
      {/* Grid lines */}
      {[40, 60, 80, 100, 120].map((y) => (
        <line
          key={y}
          x1="20"
          y1={y}
          x2="180"
          y2={y}
          stroke="rgba(105,79,193,0.08)"
          strokeWidth="0.8"
        />
      ))}
      {[40, 75, 110, 145].map((x) => (
        <line
          key={x}
          x1={x}
          y1="25"
          x2={x}
          y2="130"
          stroke="rgba(105,79,193,0.08)"
          strokeWidth="0.8"
        />
      ))}
      {/* ECG line */}
      <path
        d={ecgPath}
        stroke="rgba(105,79,193,0.5)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Highlighted pulse spike */}
      <path
        d="M 95 80 L 100 60 L 105 100 L 110 72 L 115 80"
        stroke="rgba(105,79,193,0.95)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* BPM chip */}
      <rect
        x="118"
        y="22"
        width="55"
        height="28"
        rx="8"
        fill="rgba(105,79,193,0.18)"
        stroke="rgba(105,79,193,0.3)"
        strokeWidth="1"
      />
      <text
        x="145"
        y="32"
        textAnchor="middle"
        fill="rgba(105,79,193,0.6)"
        fontSize="6.5"
        fontFamily="system-ui"
      >
        HEART RATE
      </text>
      <text
        x="145"
        y="44"
        textAnchor="middle"
        fill="rgba(105,79,193,0.95)"
        fontSize="12"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        72 bpm
      </text>
      {/* BP chip */}
      <rect
        x="20"
        y="108"
        width="60"
        height="30"
        rx="8"
        fill="rgba(105,79,193,0.1)"
        stroke="rgba(105,79,193,0.2)"
        strokeWidth="1"
      />
      <text
        x="50"
        y="119"
        textAnchor="middle"
        fill="rgba(105,79,193,0.55)"
        fontSize="6"
        fontFamily="system-ui"
      >
        BLOOD PRESSURE
      </text>
      <text
        x="50"
        y="131"
        textAnchor="middle"
        fill="rgba(105,79,193,0.85)"
        fontSize="11"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        118 / 76
      </text>
      {/* Glucose chip */}
      <rect
        x="92"
        y="108"
        width="56"
        height="30"
        rx="8"
        fill="rgba(105,79,193,0.1)"
        stroke="rgba(105,79,193,0.2)"
        strokeWidth="1"
      />
      <text
        x="120"
        y="119"
        textAnchor="middle"
        fill="rgba(105,79,193,0.55)"
        fontSize="6"
        fontFamily="system-ui"
      >
        GLUCOSE
      </text>
      <text
        x="120"
        y="131"
        textAnchor="middle"
        fill="rgba(105,79,193,0.85)"
        fontSize="11"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        94 mg/dL
      </text>
    </svg>
  );
}

function IllustrationChat() {
  return (
    <svg
      viewBox="0 0 200 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
      aria-hidden="true"
    >
      {/* User bubble */}
      <rect
        x="60"
        y="16"
        width="115"
        height="36"
        rx="12"
        fill="rgba(105,79,193,0.18)"
        stroke="rgba(105,79,193,0.3)"
        strokeWidth="1"
      />
      <path d="M 172 52 L 178 62 L 163 52" fill="rgba(105,79,193,0.18)" />
      {/* User text lines */}
      <line
        x1="73"
        y1="28"
        x2="158"
        y2="28"
        stroke="rgba(105,79,193,0.55)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="73"
        y1="38"
        x2="138"
        y2="38"
        stroke="rgba(105,79,193,0.35)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* User avatar */}
      <circle
        cx="46"
        cy="34"
        r="12"
        fill="rgba(105,79,193,0.15)"
        stroke="rgba(105,79,193,0.3)"
        strokeWidth="1"
      />
      <circle cx="46" cy="31" r="4" fill="rgba(105,79,193,0.4)" />
      <path
        d="M 36 46 Q 46 41 56 46"
        stroke="rgba(105,79,193,0.4)"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* AI bubble */}
      <rect
        x="25"
        y="74"
        width="130"
        height="48"
        rx="12"
        fill="rgba(105,79,193,0.1)"
        stroke="rgba(105,79,193,0.22)"
        strokeWidth="1"
      />
      <path d="M 28 74 L 18 65 L 38 74" fill="rgba(105,79,193,0.1)" />
      {/* AI text lines */}
      <line
        x1="38"
        y1="88"
        x2="142"
        y2="88"
        stroke="rgba(105,79,193,0.4)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="38"
        y1="98"
        x2="142"
        y2="98"
        stroke="rgba(105,79,193,0.3)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="38"
        y1="108"
        x2="108"
        y2="108"
        stroke="rgba(105,79,193,0.2)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* AI avatar */}
      <circle
        cx="168"
        cy="98"
        r="14"
        fill="rgba(105,79,193,0.2)"
        stroke="rgba(105,79,193,0.35)"
        strokeWidth="1"
      />
      {/* AI brain icon simplified */}
      <path
        d="M 162 95 Q 162 90 168 90 Q 174 90 174 95 Q 174 100 170 102 L 168 105 L 166 102 Q 162 100 162 95 Z"
        fill="none"
        stroke="rgba(105,79,193,0.7)"
        strokeWidth="1.2"
      />
      <line
        x1="168"
        y1="90"
        x2="168"
        y2="105"
        stroke="rgba(105,79,193,0.4)"
        strokeWidth="0.8"
      />

      {/* Typing indicator */}
      <rect
        x="38"
        y="132"
        width="52"
        height="18"
        rx="9"
        fill="rgba(105,79,193,0.1)"
        stroke="rgba(105,79,193,0.2)"
        strokeWidth="1"
      />
      {[52, 64, 76].map((cx) => (
        <circle key={cx} cx={cx} cy="141" r="2.5" fill="rgba(105,79,193,0.4)" />
      ))}
    </svg>
  );
}

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
      <path
        d="M8 16 C8 11 12 8 16 8 C20 8 24 11 24 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
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

// Signature element: sonar rings motivated by "vitals tracking" metaphor
function RadarRings() {
  return (
    <div
      className="pointer-events-none absolute right-[-8%] top-1/2 h-[65vw] max-h-[680px] w-[65vw] max-w-[680px] -translate-y-1/2"
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full"
          style={{ border: '1px solid rgba(255,255,255,0.055)' }}
          animate={{
            scale: [0.15 + i * 0.18, 0.85 + i * 0.1],
            opacity: [0.45, 0],
          }}
          transition={{
            duration: 4.8,
            delay: i * 1.2,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
      <div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{ background: ACCENT }}
      />
    </div>
  );
}

// Card colors are data-semantic (mood/vitals/journal), not brand accent
const MOOD_COLOR = 'oklch(0.72 0.14 280)'; // lavender — calm
const HEART_COLOR = 'oklch(0.68 0.18 15)'; // coral — physical
const STREAK_COLOR = 'oklch(0.62 0.14 162)'; // sage — growth

const HERO_CARDS = [
  {
    icon: Smile,
    label: "Today's mood",
    value: 'Grounded',
    trend: '+2 from yesterday',
    TrendIcon: TrendingUp,
    bars: [4, 3, 5, 4, 6, 5, 7],
    color: MOOD_COLOR,
    pos: 'top-4 right-0',
    floatDur: 4.5,
    enterDelay: 0.42,
  },
  {
    icon: Heart,
    label: 'Heart rate',
    value: '72',
    unit: 'bpm',
    trend: 'Resting range',
    TrendIcon: Minus,
    bars: [68, 74, 70, 73, 71, 72, 72],
    color: HEART_COLOR,
    pos: 'top-[190px] left-0',
    floatDur: 5.5,
    enterDelay: 0.56,
  },
  {
    icon: Brain,
    label: 'Journal streak',
    value: '14',
    unit: 'days',
    trend: 'Personal best',
    TrendIcon: TrendingUp,
    bars: [5, 7, 6, 8, 9, 11, 14],
    color: STREAK_COLOR,
    pos: 'bottom-4 right-8',
    floatDur: 4,
    enterDelay: 0.7,
  },
] as const;

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // taste-skill: IntersectionObserver instead of window.addEventListener('scroll')
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Scroll sentinel */}
      <div
        ref={sentinelRef}
        className="pointer-events-none absolute left-0 top-[80px] h-px w-full"
        aria-hidden="true"
      />

      {/* ── Nav ──────────────────────────────────────────────────────── */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[200] transition-all duration-500',
          scrolled
            ? 'bg-background/90 border-b border-border backdrop-blur-md'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <LogoMark
              className={cn(
                'h-6 w-6',
                scrolled ? 'text-primary' : 'text-white'
              )}
            />
            <span
              className={cn(
                'text-lg font-semibold tracking-tight',
                scrolled ? 'text-foreground' : 'text-white'
              )}
            >
              HealthMind
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            <a
              href="#features"
              className={cn(
                'text-sm font-medium transition-colors',
                scrolled
                  ? 'text-muted-foreground hover:text-foreground'
                  : 'text-white/65 hover:text-white'
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
                    ? 'hover:bg-primary/90 bg-primary text-primary-foreground'
                    : 'border border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
                )}
              >
                Sign in
              </Button>
            </Link>
            <ModeToggle />
          </div>

          <div className="flex items-center gap-1 md:hidden">
            <ModeToggle />
            <MobileNav scrolled={scrolled} />
          </div>
        </div>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen items-center overflow-hidden"
        style={{ background: HERO_BG }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.025) 1px, transparent 0)',
            backgroundSize: '36px 36px',
          }}
        />
        <RadarRings />

        <div className="container relative z-10 mx-auto px-4 pb-16 pt-24 sm:px-6">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_400px]">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
                className="mb-6 font-heading font-bold text-white [text-wrap:balance]"
                style={{
                  fontSize: 'clamp(2.6rem, 5.5vw, 5rem)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.03em',
                }}
              >
                Your mental and physical health,{' '}
                <span style={{ color: ACCENT }}>finally together.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: EASE, delay: 0.16 }}
                className="mb-10 max-w-md leading-relaxed text-white/55"
                style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}
              >
                Track your mood, log your vitals, and talk to an AI therapist.
                HealthMind keeps it all in one quiet place.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE, delay: 0.24 }}
                className="flex flex-wrap gap-3"
              >
                <Link href="/sign-up">
                  <Button
                    size="lg"
                    className="rounded-full px-8 font-medium"
                    style={{
                      background: ACCENT,
                      color: 'white',
                      border: 'none',
                    }}
                  >
                    Start for free
                  </Button>
                </Link>
                <Link href="/sign-in">
                  <Button
                    size="lg"
                    variant="ghost"
                    className="rounded-full border border-white/15 px-8 text-white/75 hover:bg-white/10 hover:text-white"
                  >
                    Sign in
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Floating stat cards — signature element */}
            <div className="relative hidden h-[500px] lg:block">
              {HERO_CARDS.map((card, i) => {
                const Icon = card.icon;
                const TrendIcon = card.TrendIcon;
                return (
                  <motion.div
                    key={card.label}
                    className={cn('absolute w-48', card.pos)}
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: EASE,
                      delay: card.enterDelay,
                    }}
                  >
                    <motion.div
                      animate={{ y: [-4, 4] }}
                      transition={{
                        duration: card.floatDur,
                        delay: i * 0.6,
                        repeat: Infinity,
                        repeatType: 'mirror',
                        ease: 'easeInOut',
                      }}
                      className="rounded-2xl p-4"
                      style={{
                        background: 'rgba(18,16,32,0.75)',
                        border: '1px solid rgba(255,255,255,0.09)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                      }}
                    >
                      {/* Header row */}
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className="flex h-6 w-6 items-center justify-center rounded-lg"
                            style={{ background: `${card.color}22` }}
                          >
                            <Icon
                              className="h-3 w-3"
                              style={{ color: card.color }}
                            />
                          </div>
                          <span className="text-[11px] font-medium text-white/50">
                            {card.label}
                          </span>
                        </div>
                        {/* Live indicator */}
                        <div className="flex items-center gap-1">
                          <span
                            className="h-1.5 w-1.5 animate-pulse rounded-full"
                            style={{ background: card.color }}
                          />
                        </div>
                      </div>

                      {/* Value */}
                      <div className="mb-3 flex items-baseline gap-1">
                        <span className="font-heading text-2xl font-bold leading-none text-white">
                          {'value' in card ? card.value : ''}
                        </span>
                        {'unit' in card && (
                          <span className="text-xs text-white/40">
                            {card.unit}
                          </span>
                        )}
                      </div>

                      {/* Sparkline */}
                      <div className="mb-3">
                        <Sparkline bars={[...card.bars]} color={card.color} />
                      </div>

                      {/* Trend */}
                      <div className="flex items-center gap-1">
                        <TrendIcon
                          className="h-3 w-3"
                          style={{ color: card.color }}
                        />
                        <span
                          className="text-[11px]"
                          style={{ color: card.color }}
                        >
                          {card.trend}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-background"
        />
      </section>

      {/* ── Features ─────────────────────────────────────────────────── */}
      {/* taste-skill: one eyebrow per 3 sections — this is eyebrow #1 */}
      <section
        id="features"
        className="bg-background px-4 py-24 sm:px-6 lg:py-32"
      >
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-48px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mb-16"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-muted-foreground">
              What&apos;s inside
            </p>
            <h2
              className="font-heading font-bold tracking-tight text-foreground [text-wrap:balance]"
              style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', lineHeight: 1.1 }}
            >
              Three tools. One complete picture.
            </h2>
          </motion.div>

          <div className="space-y-4">
            {/* Feature 1: icon left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-64px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border md:grid-cols-[200px_1fr]"
            >
              <div
                className="flex min-h-[180px] items-center justify-center p-6"
                style={{ background: ACCENT_BG }}
              >
                <IllustrationJournal />
              </div>
              <div className="flex flex-col justify-center px-8 py-10">
                <p
                  className="mb-2 text-xs font-medium uppercase tracking-widest"
                  style={{ color: ACCENT }}
                >
                  Mood and Journal
                </p>
                <h3
                  className="mb-3 font-heading font-bold tracking-tight text-foreground"
                  style={{
                    fontSize: 'clamp(1.4rem,2.2vw,2rem)',
                    lineHeight: 1.15,
                  }}
                >
                  Know yourself better.
                </h3>
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                  Log how you&apos;re feeling and why. Your journal becomes a
                  mirror &mdash; and over time, patterns emerge that are hard to
                  see day to day.
                </p>
              </div>
            </motion.div>

            {/* Feature 2: icon right — zigzag (max 2 consecutive, taste-skill) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-64px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="grid grid-cols-1 overflow-hidden rounded-2xl border border-border md:grid-cols-[1fr_200px]"
            >
              <div className="flex flex-col justify-center px-8 py-10 md:order-first">
                <p
                  className="mb-2 text-xs font-medium uppercase tracking-widest"
                  style={{ color: ACCENT }}
                >
                  Health Tracking
                </p>
                <h3
                  className="mb-3 font-heading font-bold tracking-tight text-foreground"
                  style={{
                    fontSize: 'clamp(1.4rem,2.2vw,2rem)',
                    lineHeight: 1.15,
                  }}
                >
                  Your vitals, in context.
                </h3>
                <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                  Blood pressure, glucose, and physical health tracked alongside
                  your mental state. The full picture, not just the numbers.
                </p>
              </div>
              <div
                className="flex min-h-[180px] items-center justify-center p-6 md:order-last"
                style={{ background: ACCENT_BG }}
              >
                <IllustrationVitals />
              </div>
            </motion.div>

            {/* Feature 3: full-width split — breaks zigzag (taste-skill rule) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-64px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="overflow-hidden rounded-2xl border border-border"
            >
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="flex flex-col justify-center px-8 py-12">
                  <p
                    className="mb-2 text-xs font-medium uppercase tracking-widest"
                    style={{ color: ACCENT }}
                  >
                    AI Therapy
                  </p>
                  <h3
                    className="mb-3 font-heading font-bold tracking-tight text-foreground"
                    style={{
                      fontSize: 'clamp(1.4rem,2.2vw,2rem)',
                      lineHeight: 1.15,
                    }}
                  >
                    Support when you need it.
                  </h3>
                  <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                    Talk through what&apos;s on your mind with an AI therapist.
                    Or work through CBT modules at your own pace &mdash; no
                    appointments, no waiting.
                  </p>
                  <div className="mt-6">
                    <Link href="/sign-up">
                      <Button
                        className="rounded-full px-6"
                        style={{
                          background: ACCENT,
                          color: 'white',
                          border: 'none',
                        }}
                      >
                        Try it now
                      </Button>
                    </Link>
                  </div>
                </div>
                <div
                  className="flex items-center justify-center p-6"
                  style={{ background: ACCENT_BG }}
                >
                  <IllustrationChat />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────── */}
      {/* Different layout family from features: side-by-side list + visual */}
      <section
        className="px-4 py-24 sm:px-6 lg:py-32"
        style={{ background: HERO_BG }}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            {/* Steps */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-48px' }}
                transition={{ duration: 0.55, ease: EASE }}
                className="mb-12 font-heading font-bold text-white [text-wrap:balance]"
                style={{
                  fontSize: 'clamp(1.8rem,3.5vw,2.8rem)',
                  lineHeight: 1.1,
                }}
              >
                Up and running in three steps.
              </motion.h2>

              <div>
                {[
                  {
                    n: '01',
                    title: 'Create your account',
                    body: 'Sign up in seconds. No credit card, no commitment.',
                  },
                  {
                    n: '02',
                    title: 'Log your first entry',
                    body: 'Start with how you feel today. Any entry counts.',
                  },
                  {
                    n: '03',
                    title: 'Watch patterns emerge',
                    body: 'Over time, HealthMind connects mood, vitals, and habits.',
                  },
                ].map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-32px' }}
                    transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                    className="flex gap-6 border-b border-white/[0.07] py-7 last:border-0"
                  >
                    <span
                      className="shrink-0 font-heading text-3xl font-bold opacity-45"
                      style={{ color: ACCENT }}
                    >
                      {step.n}
                    </span>
                    <div>
                      <h3 className="mb-1.5 font-heading text-lg font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-white/45">
                        {step.body}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Stylised app-preview panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-48px' }}
              transition={{ duration: 0.6, ease: EASE }}
              className="hidden items-center justify-center md:flex"
            >
              <div
                className="relative w-full max-w-[300px] overflow-hidden rounded-3xl"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  aspectRatio: '3/4',
                }}
              >
                <div className="absolute inset-0 flex flex-col gap-4 p-6">
                  {/* Top bar */}
                  <div className="flex items-center justify-between">
                    <div
                      className="h-2 w-20 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.15)' }}
                    />
                    <div
                      className="h-2 w-6 rounded-full"
                      style={{ background: ACCENT, opacity: 0.55 }}
                    />
                  </div>
                  {/* Mood row */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    <div
                      className="mb-2.5 h-1.5 w-12 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.2)' }}
                    />
                    <div className="flex gap-2">
                      {[0, 1, 2, 3, 4].map((j) => (
                        <div
                          key={j}
                          className="h-8 w-8 rounded-lg"
                          style={{
                            background:
                              j === 3 ? ACCENT : 'rgba(255,255,255,0.08)',
                            opacity: j === 3 ? 0.8 : 1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Bar chart */}
                  <div
                    className="flex flex-1 flex-col justify-end rounded-xl p-4"
                    style={{ background: 'rgba(255,255,255,0.04)' }}
                  >
                    <div className="flex h-20 items-end gap-1.5">
                      {[40, 55, 35, 70, 50, 82, 60].map((h, j) => (
                        <div
                          key={j}
                          className="flex-1 rounded-t-sm"
                          style={{
                            height: `${h}%`,
                            background:
                              j === 5 ? ACCENT : 'rgba(255,255,255,0.12)',
                            opacity: j === 5 ? 0.75 : 1,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Bottom tiles */}
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1].map((k) => (
                      <div
                        key={k}
                        className="rounded-xl p-3"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                      >
                        <div
                          className="mb-1.5 h-1.5 w-8 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.2)' }}
                        />
                        <div
                          className="h-3 w-12 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.12)' }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      {/* taste-skill: asymmetric layout — NOT 3 equal cards */}
      <section className="bg-background px-4 py-24 sm:px-6 lg:py-32">
        <div className="container mx-auto max-w-5xl">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-48px' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="mb-12 font-heading font-bold tracking-tight text-foreground [text-wrap:balance]"
            style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', lineHeight: 1.1 }}
          >
            People who made it a habit.
          </motion.h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">
            {/* Large featured quote */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-48px' }}
              transition={{ duration: 0.55, ease: EASE }}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-8 md:p-10"
            >
              <p className="mb-8 font-heading text-xl font-medium leading-relaxed text-foreground md:text-2xl">
                &ldquo;I didn&apos;t realize how connected my sleep and my
                anxiety were until HealthMind showed me the pattern. It changed
                how I think about both.&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: ACCENT }}
                >
                  M
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Maya R.
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Designer, uses HealthMind daily
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Two smaller quotes stacked */}
            <div className="flex flex-col gap-5">
              {[
                {
                  initial: 'D',
                  quote:
                    "The AI therapist is surprisingly good at just listening. Some days that's all I need.",
                  name: 'Daniel K.',
                  role: 'Engineer',
                },
                {
                  initial: 'S',
                  quote:
                    'My doctor said my BP logs were the most consistent she had seen. Twenty seconds a day.',
                  name: 'Sandra M.',
                  role: 'Teacher',
                },
              ].map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-48px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.1 }}
                  className="flex flex-1 flex-col justify-between rounded-2xl border border-border bg-card p-6"
                >
                  <p className="text-foreground/70 mb-6 text-sm italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: ACCENT, opacity: 0.75 }}
                    >
                      {t.initial}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {t.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why strip ────────────────────────────────────────────────── */}
      {/* taste-skill: eyebrow #2 — kept; section count now warrants it */}
      <section className="bg-secondary/50 border-y border-border px-4 py-16 sm:px-6">
        <div className="container mx-auto max-w-5xl">
          <p className="mb-10 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Why HealthMind
          </p>
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: 'Private by design',
                body: 'Your data is encrypted and never sold. Export or delete any time.',
              },
              {
                icon: Zap,
                title: 'No friction',
                body: 'Log a mood in 5 seconds. Add a reading in 10. Built for real life.',
              },
              {
                icon: Brain,
                title: 'AI that listens',
                body: 'Tuned for empathy, not just answers. Remembers your context across sessions.',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-32px' }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className="flex gap-4"
                >
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: ACCENT_BG,
                      border: `1px solid ${ACCENT_BORDER}`,
                    }}
                  >
                    <Icon className="h-5 w-5" style={{ color: ACCENT }} />
                  </div>
                  <div>
                    <h3 className="mb-1.5 font-heading text-base font-bold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      {/* taste-skill: no glow orb — split layout instead */}
      <section className="px-4 py-24 sm:px-6" style={{ background: HERO_BG }}>
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2
                className="font-heading font-bold text-white [text-wrap:balance]"
                style={{
                  fontSize: 'clamp(2rem,4vw,3.5rem)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                Ready when you are.
              </h2>
              <p className="mt-3 max-w-md text-base leading-relaxed text-white/50">
                No pressure, no rush. Start at your own pace.
              </p>
            </div>
            <div className="shrink-0">
              <Link href="/sign-up">
                <Button
                  size="lg"
                  className="rounded-full px-10 font-medium"
                  style={{ background: ACCENT, color: 'white', border: 'none' }}
                >
                  Create your account
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background px-4 py-8 sm:px-6">
        <div className="container mx-auto flex flex-col items-center gap-1 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <span>© 2025 HealthMind</span>
          <span>Your wellness, your privacy.</span>
        </div>
      </footer>
    </div>
  );
}
