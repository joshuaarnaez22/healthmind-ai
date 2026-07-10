'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_KEY = 'healthmind-onboarding-tour-v1';

/** When true, tour runs every visit and skips localStorage. Unset/false = new users only. */
const FORCE_TOUR_FOR_TESTING =
  process.env.NEXT_PUBLIC_FORCE_TOUR_FOR_TESTING === 'true';

const SIDEBAR_STEPS = [
  {
    tourId: 'nav-dashboard',
    title: 'Dashboard',
    description:
      'Your home snapshot — mood, journal, goals, and vitals at a glance.',
  },
  {
    tourId: 'nav-journal',
    title: 'MindLog',
    description:
      'Write how you feel. Mood and journal live together so patterns are easier to spot.',
  },
  {
    tourId: 'nav-health',
    title: 'Health',
    description:
      'Log blood pressure and glucose, then review insights and summaries.',
  },
  {
    tourId: 'nav-goals',
    title: 'Goals',
    description:
      'Set mindful goals and check in when it matters. Small steps count.',
  },
  {
    tourId: 'nav-therapy',
    title: 'Therapy',
    description:
      'Work through CBT modules or talk with the AI therapist whenever you need support.',
  },
  {
    tourId: 'nav-analytics',
    title: 'Analytics',
    description:
      'See how your mood trends over time so you can notice what helps.',
  },
] as const;

export default function OnboardingTour({
  showTour,
}: Readonly<{
  showTour: boolean;
}>) {
  useEffect(() => {
    if (!FORCE_TOUR_FOR_TESTING && !showTour) return;
    if (typeof window === 'undefined') return;
    if (!FORCE_TOUR_FOR_TESTING && window.localStorage.getItem(TOUR_KEY)) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const timer = window.setTimeout(() => {
      const markDone = () => {
        if (!FORCE_TOUR_FOR_TESTING) {
          window.localStorage.setItem(TOUR_KEY, '1');
        }
      };

      const startEl = document.querySelector('[data-tour="getting-started"]');

      const steps = [
        ...(startEl
          ? [
              {
                element: '[data-tour="getting-started"]',
                popover: {
                  title: 'Start here',
                  description:
                    'Three quick steps unlock the full picture — journal, a vital, and a goal.',
                  side: 'bottom' as const,
                  align: 'start' as const,
                },
              },
            ]
          : []),
        ...SIDEBAR_STEPS.flatMap((step) => {
          const el = document.querySelector(`[data-tour="${step.tourId}"]`);
          if (!el) return [];
          return [
            {
              element: `[data-tour="${step.tourId}"]`,
              popover: {
                title: step.title,
                description: step.description,
                side: 'right' as const,
                align: 'start' as const,
              },
            },
          ];
        }),
      ];

      if (steps.length === 0) return;

      const driverObj = driver({
        showProgress: true,
        animate: !prefersReducedMotion,
        overlayOpacity: 0.45,
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: 'healthmind-tour',
        allowClose: false,
        overlayClickBehavior: () => {
          /* keep tour open when clicking outside */
        },
        nextBtnText: 'Next',
        prevBtnText: 'Back',
        doneBtnText: 'Got it',
        onDestroyStarted: () => {
          markDone();
          driverObj.destroy();
        },
        steps,
      });

      driverObj.drive();
    }, 600);

    return () => window.clearTimeout(timer);
  }, [showTour]);

  return null;
}
