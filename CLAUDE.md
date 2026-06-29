# HealthMind AI — Claude Instructions

## Stack

- **Framework**: Next.js 15 App Router, all protected pages use `export const dynamic = 'force-dynamic'`
- **Auth**: Clerk — use `useUser` / `useClerk` on client, `getUserId()` from `actions/server-actions/user` on server
- **Database**: Neon PostgreSQL via Prisma (`lib/client.ts` exports `prisma`)
- **AI**: Deepseek via `@ai-sdk/deepseek` + `generateObject`. Import `deepseek` from `lib/ai`
- **Cache**: Upstash Redis, 24 h TTL on all AI responses, keyed by `userId`
- **State**: TanStack Query — all data fetching goes through `useQuery` / `useMutation`
- **Styling**: Tailwind CSS + shadcn/ui. Use CSS variables (OKLCH tokens), never hardcode colors like `bg-gray-200`
- **Animation**: `motion/react` (Framer Motion) — use `pageAnimations` from `lib/motion` on page roots

## Project Structure

```
app/
  (protected)/user/     # all user-facing pages
  (protected)/admin/    # admin view
  api/                  # route handlers (POST only unless otherwise noted)
components/
  ui/                   # shadcn/ui (do not modify)
  loaders/              # skeleton screens — use Skeleton from shadcn, never bg-gray-200
  wrappers/
hooks/                  # TanStack Query hooks (useGoals, useJournals, etc.)
actions/
  server-actions/       # server-only helpers (getUserId, db queries)
lib/
  ai-object-schema.ts   # Zod schemas for generateObject responses
  prompts.ts            # AI prompt strings
  constant.ts           # validLucideIcons list (20 icons)
  utils.ts              # getIcon(), getDaysLeft(), getGoalProgress(), cn()
  client.ts             # prisma instance
  ai.ts                 # deepseek() factory
prisma/schema.prisma
```

## Key Conventions

### Loading states

- Always use `<Skeleton>` from `@/components/ui/skeleton` for loading states — never `bg-gray-200 animate-pulse`
- Route-level loading: add a `loading.tsx` that mirrors the page layout with skeletons
- Client-level loading: inline skeleton in the component's `isLoading` branch

### AI generation

- Icon fields: use `z.string().transform((v) => validLucideIcons.includes(v) ? v : 'brain')` — never `z.enum(validLucideIcons)` which causes full failures on unknown values
- Parallel generation: prefer `Promise.all()` over sequential calls for independent AI tasks
- Cache all AI responses in Redis with `userId` as key prefix and 24 h TTL

### Clerk / Avatar

- User avatar src: use `user?.imageUrl || null` — never `?? ''` (empty string triggers browser re-download warning)
- Sign-out: `signOut({ redirectUrl: '/' })`

### Calendar UI

- Both Journal and Mood Tracker use the same 2-column grid layout: Calendar on left in a `<Card>`, entries on right in a `<Card>`

### Icons

- Valid Lucide icons for AI-generated content: `brain`, `sun`, `tool`, `eye`, `hand`, `heart`, `cloud-rain`, `target`, `cloud`, `anchor`, `compass`, `wind`, `leaf`, `shield`, `flame`, `activity`, `smile`, `star`, `zap`
- `getIcon(name)` in `lib/utils.ts` maps these to components, falls back to `Brain`

## API Routes

All under `app/api/`:

| Route                 | Method          | Purpose                                                                       |
| --------------------- | --------------- | ----------------------------------------------------------------------------- |
| `journal`             | GET/POST/DELETE | CRUD journal entries                                                          |
| `generate-modules`    | POST            | Generate 6 therapy modules (3×CBT/DBT/ACT, parallel)                          |
| `modules`             | GET             | List user's therapy modules                                                   |
| `get-module/[id]`     | GET             | Single module with steps                                                      |
| `insights`            | POST            | Sequential AI insights (affirmations→summary→observations→articles→exercises) |
| `health-trends`       | POST            | AI analysis of last 30 days BP + glucose                                      |
| `journal-prompt`      | POST            | Mood-aware writing prompt                                                     |
| `journal-enhance`     | POST            | Enhance journal entry prose                                                   |
| `summarize-files`     | POST            | PDF upload → AI summary                                                       |
| `goal` / `goals`      | GET/POST/PATCH  | Goal CRUD + check-ins                                                         |
| `blood-pressure-logs` | GET/POST        | BP log CRUD                                                                   |
| `glucose-logs`        | GET/POST        | Glucose log CRUD                                                              |
| `webhooks`            | POST            | Clerk webhook (user.created / user.updated)                                   |

## Database Models

See `base-schema.md` for full reference. Key notes:

- `Journal` is used for both mood entries and journal entries — `mood` field distinguishes them
- `TherapyModule.icon` stores a string key from `validLucideIcons`
- All IDs are `cuid()` strings, not integers
- `Journal.addedAt` is `DateTime @db.Date` (date-only, indexed with userId)

## Environment Variables

```
DATABASE_URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
UPSTASH_REDIS_REST_URL
UPSTASH_REDIS_REST_TOKEN
DEEPSEEK_API_KEY
```

Sentry is configured but disabled — do not uncomment `sentry.*.config.ts` without adding the DSN env vars.
