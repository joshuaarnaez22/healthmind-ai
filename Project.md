# HealthMind AI — Project Status

## What's Built

### App Shell

- [x] Next.js 15 App Router with `force-dynamic` on server pages
- [x] Tailwind CSS + shadcn/ui component library
- [x] Neon PostgreSQL + Prisma ORM
- [x] Clerk auth — webhooks, protected routes, middleware
- [x] Sidebar (user + admin) with active-route highlighting, collapsible groups
- [x] Dynamic breadcrumbs from pathname
- [x] Command palette (⌘K) covering all 9 routes
- [x] Real user name / avatar / initials from Clerk; `null` src fallback on sign-out
- [x] Dark mode toggle
- [x] Vercel deployment

### Mental Health

- [x] **Mood Tracker** — daily logging modal, inline calendar, entries listed by selected date
- [x] **Journal** — rich-text entries (TipTap), inline calendar, date filtering
- [x] **AI Writing Prompts** — `/api/journal-prompt`, mood-aware, injected into editor
- [x] **AI Journal Enhancement** — `/api/journal-enhance`, strips HTML, returns clean prose
- [x] **AI Insights** (`/api/insights`) — sequential loading: affirmations → mental summary → observations → articles → exercises
- [x] **Mood Analytics** — stacked bar chart (Recharts, 6 months) + AI mood insights panel
- [x] **Redis caching** — 24 h TTL on all AI responses keyed by userId

### Health Tracking

- [x] **Blood Pressure** — systolic, diastolic, pulse, posture, arm, symptoms, device, notes
- [x] **Glucose** — reading, measurement type, meal type, time since meal, insulin, carbs
- [x] **AI Health Trends** (`/api/health-trends`) — last 30 days of BP + glucose, cached 24 h
- [x] **Medical File Summary** — PDF upload to S3-compatible storage, AI-generated summary
- [x] **Medical Disclaimer** — shown on health tracker and health insights pages

### Therapy Modules

- [x] AI-generated CBT, DBT, ACT modules via 3 parallel `generateObject` calls (2 modules each = 6 total)
- [x] Auto-generated on first visit; manual regeneration with inline banner (existing modules stay visible)
- [x] Step-by-step detail page — exercise + reflection response fields, mark step/module done
- [x] Progress bar per module
- [x] Skeleton loaders for initial load, generation states

### Goals

- [x] Create goals with title, emotion, frequency, duration, and a "why"
- [x] Check-in system — actual emotion, reflection, rating per check-in
- [x] Goal progress bar (completedCount / targetCount)

### New User Experience

- [x] Getting-started checklist on dashboard (4 steps: mood → journal → vital → goal)
- [x] Progress bar on checklist; disappears when all steps done
- [x] Empty states with inline CTA links on every feature page
- [x] Health Insights empty state for users with no journal entries
- [x] Analytics empty state when no mood data

### UX / Polish

- [x] Consistent calendar layout on Journal and Mood Tracker (same 2-column grid)
- [x] Skeleton loaders using shadcn `Skeleton` component throughout (no hardcoded `bg-gray-200`)
- [x] Therapy module `[id]/loading.tsx` replaced plain `<p>Loading...</p>` with full skeleton
- [x] Icon enum expanded to 20 icons; unknown icons coerced to `brain` fallback

## Pending

- [ ] Sentry error tracking — configured but disabled; enable by adding `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT` env vars and uncommenting `sentry.*.config.ts`
- [ ] AI voice therapy sessions
- [ ] Medication reminders (Vercel Cron Jobs)
- [ ] Appointment scheduling
- [ ] User data export / deletion
- [ ] Performance monitoring dashboard

## Tech Stack (current)

|            |                                                 |
| ---------- | ----------------------------------------------- |
| Framework  | Next.js 15 (App Router)                         |
| Database   | Neon PostgreSQL via Prisma                      |
| Auth       | Clerk                                           |
| AI         | Deepseek (`@ai-sdk/deepseek`, `generateObject`) |
| Cache      | Upstash Redis                                   |
| Styling    | Tailwind CSS + shadcn/ui                        |
| Animation  | motion/react (Framer Motion)                    |
| State      | TanStack Query                                  |
| Deployment | Vercel                                          |

Previous proposal referenced OpenAI and Supabase — both replaced by Deepseek and Neon respectively.
