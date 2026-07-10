# HealthMind AI

An AI-powered wellness companion for mental health tracking, health monitoring, and personalised insights.

## Tech Stack

| Layer      | Technology                                                   |
| ---------- | ------------------------------------------------------------ |
| Framework  | Next.js 15 (App Router, force-dynamic)                       |
| Database   | Neon PostgreSQL via Prisma ORM                               |
| Auth       | Clerk (webhooks, protected routes, user profile)             |
| AI         | Deepseek via `@ai-sdk/deepseek` + `generateObject`           |
| Cache      | Upstash Redis (24 h TTL on AI responses)                     |
| Styling    | Tailwind CSS + shadcn/ui                                     |
| Animations | motion/react (Framer Motion)                                 |
| State      | TanStack Query (server state, mutations, cache invalidation) |
| Deployment | Vercel                                                       |

## Features

### Mental Health

- **Mood Tracker** — daily mood logging with inline calendar; entries listed by selected date
- **Journal** — rich-text entries with inline calendar; AI writing prompts; AI entry enhancement
- **AI Insights** — affirmations, mental health summary, therapeutic observations, articles, exercises (sequential loading, cached 24 h)
- **Mood Analytics** — stacked bar chart of mood distribution over 6 months + AI mood insights panel

### Health Tracking

- **Blood Pressure** — log systolic/diastolic/pulse with posture, arm, symptoms, device
- **Glucose** — log readings with measurement type, meal context, insulin dose
- **Health Trends** — AI analysis of last 30 days of vitals (BP + glucose), cached 24 h
- **Health Summary** — PDF upload → AI-generated medical file summary
- **Medical Disclaimer** — shown on all health pages

### Therapy

- **Therapy Modules** — AI-generated CBT, DBT, ACT modules (3 parallel calls, 2 per type = 6 total); step-by-step with exercises and reflections; progress tracking; auto-generated on first visit
- **Module Detail** — step-by-step walkthrough with response fields, mark-as-done, progress bar

### Goals

- **Mindful Goals** — create goals with emotion, frequency, duration, and a "why"
- **Check-ins** — log actual emotion, reflection, and rating per check-in; progress bar

### Dashboard

- Getting-started checklist (disappears once all 4 steps are completed)
- Mood summary (last 7 days), latest journal entry, goals overview, latest vitals
- All empty states have inline CTA links

### Navigation

- Sidebar with collapsible sections, active-route highlighting
- Command palette (⌘K) with all 9 routes
- Dynamic breadcrumbs from route path
- Real user name/avatar/initials from Clerk in nav dropdown

## Project Structure

```
app/
  (protected)/
    user/           # user-facing app
      dashboard/
      journal/
      mood-tracker/
      analytics/
      insights/
        health-tracker/
        health-insights/
        health-summary/
      therapy_modules/
      goals/
    admin/          # admin view
  api/              # route handlers
    journal/
    generate-modules/
    insights/
    health-trends/
    journal-prompt/
    journal-enhance/
    ...
components/
  ui/               # shadcn/ui
  loaders/          # skeleton screens
  wrappers/
lib/
  ai-object-schema.ts   # Zod schemas for generateObject
  prompts.ts
  constant.ts
  utils.ts
prisma/
  schema.prisma
```

## Environment Variables

```env
DATABASE_URL=                          # Neon PostgreSQL connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
DEEPSEEK_API_KEY=
# NEXT_PUBLIC_FORCE_TOUR_FOR_TESTING=true  # optional — force onboarding tour every visit
# Optional — uncomment in sentry.*.config.ts when ready:
# NEXT_PUBLIC_SENTRY_DSN=
# SENTRY_ORG=
# SENTRY_PROJECT=
```

## Development

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Checklist

### Setup

- [x] Next.js 15 App Router
- [x] Tailwind CSS + shadcn/ui
- [x] Neon PostgreSQL + Prisma
- [x] Clerk auth + webhooks + protected routes
- [x] Vercel deployment

### Mental Health

- [x] Mood tracking with calendar
- [x] AI mood insights (weekly trend, patterns)
- [x] Journaling with rich text
- [x] AI writing prompts
- [x] AI journal enhancement
- [x] Sequential AI insights (affirmations, summary, observations, articles, exercises)
- [x] Mood analytics chart (6 months)
- [x] Redis caching for all AI responses

### Health

- [x] Blood pressure logging
- [x] Glucose logging
- [x] AI health trends analysis
- [x] PDF upload + medical file summarisation
- [x] Medical disclaimer on health pages

### Therapy

- [x] AI-generated CBT / DBT / ACT modules (parallel generation)
- [x] Module step tracking with response fields
- [x] Auto-generate on first visit

### Goals

- [x] Goal creation (emotion, frequency, duration)
- [x] Check-in system
- [x] Progress tracking

### UX

- [x] Getting-started checklist for new users
- [x] Empty states with CTAs on all pages
- [x] Skeleton loaders on all async surfaces
- [x] Dynamic breadcrumbs
- [x] Command palette (⌘K)

### Observability

- [ ] Sentry (configured, disabled — re-enable with env vars)
- [ ] Performance monitoring
