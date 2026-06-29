# Graph Report - . (2026-06-30)

## Corpus Check

- 35 files · ~71,777 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 974 nodes · 2411 edges · 93 communities (80 shown, 13 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 55 edges (avg confidence: 0.83)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Goals UI Components|Goals UI Components]]
- [[_COMMUNITY_API Route Handlers|API Route Handlers]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Sidebar & Navigation|Sidebar & Navigation]]
- [[_COMMUNITY_App Shell & Layout|App Shell & Layout]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Shared UI Components|Shared UI Components]]
- [[_COMMUNITY_Database Schema Docs|Database Schema Docs]]
- [[_COMMUNITY_Journal & Insights UI|Journal & Insights UI]]
- [[_COMMUNITY_Health Data Tables|Health Data Tables]]
- [[_COMMUNITY_Health Insight Cards|Health Insight Cards]]
- [[_COMMUNITY_Check-in & File Summary|Check-in & File Summary]]
- [[_COMMUNITY_Goals Pages|Goals Pages]]
- [[_COMMUNITY_Analytics Charts|Analytics Charts]]
- [[_COMMUNITY_Dev Tooling|Dev Tooling]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Table Column Definitions|Table Column Definitions]]
- [[_COMMUNITY_Shared Type Definitions|Shared Type Definitions]]
- [[_COMMUNITY_Emotion & Goal Cards|Emotion & Goal Cards]]
- [[_COMMUNITY_Component Aliases Config|Component Aliases Config]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 84|Community 84]]
- [[_COMMUNITY_Community 85|Community 85]]

## God Nodes (most connected - your core abstractions)

1. `cn()` - 93 edges
2. `Button` - 71 edges
3. `Card` - 55 edges
4. `CardContent` - 50 edges
5. `getUserId()` - 36 edges
6. `CardHeader` - 36 edges
7. `CardTitle` - 32 edges
8. `Badge()` - 28 edges
9. `CardDescription` - 27 edges
10. `pageAnimations` - 24 edges

## Surprising Connections (you probably didn't know these)

- `AiSession()` --calls--> `cn()` [INFERRED]
  app/(protected)/admin/(therapy)/ai-therapy/session/\_components/ai-session.tsx → lib/utils.ts
- `JournalEntryAccordionItem()` --calls--> `cn()` [INFERRED]
  app/(protected)/admin/journal/\_components/journal-entry-accordion.tsx → lib/utils.ts
- `AiSession()` --calls--> `cn()` [INFERRED]
  app/(protected)/user/(therapy)/ai-therapy/session/\_components/ai-session.tsx → lib/utils.ts
- `NavMain()` --calls--> `useSidebar()` [INFERRED]
  app/(protected)/admin/\_components/nav-main.tsx → components/ui/sidebar.tsx
- `NavProjects()` --calls--> `useSidebar()` [INFERRED]
  app/(protected)/admin/\_components/nav-projects.tsx → components/ui/sidebar.tsx

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **AI response generation and caching pipeline: Deepseek generateObject calls cached via Upstash Redis with 24h TTL per userId** — project_md_deepseek_ai, project_md_upstash_redis, project_md_generate_object [EXTRACTED 1.00]
- **Health vitals tracking trio: BP and glucose logs feed into AI health trends analysis over last 30 days** — project_md_blood_pressure, project_md_glucose, project_md_health_trends [EXTRACTED 1.00]
- **User identity flow: Clerk auth triggers webhook sync to keep Prisma User model updated with Clerk profile data** — project_md_clerk_auth, base_schema_md_user_model, base_schema_md_clerk_webhook_sync [EXTRACTED 1.00]

## Communities (93 total, 13 thin omitted)

### Community 0 - "Goals UI Components"

Cohesion: 0.10
Nodes (54): MoodModalProps, commonSymptoms, insightCards, measurementType, moods, postures, enumConvertor(), isContentEmpty() (+46 more)

### Community 1 - "API Route Handlers"

Cohesion: 0.06
Nodes (39): POST(), GET(), POST(), perTypeSchema, THERAPY_TYPES, GET(), GET(), GET() (+31 more)

### Community 2 - "Package Dependencies"

Cohesion: 0.03
Nodes (65): dependencies, ai, @ai-sdk/deepseek, @ai-sdk/openai, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, canvas-confetti, class-variance-authority (+57 more)

### Community 3 - "Sidebar & Navigation"

Cohesion: 0.07
Nodes (41): NavMain(), NavProjects(), NavUser(), InsightsChart(), RecentReflectionsProps, NavProjects(), InsightsChart(), RecentReflectionsProps (+33 more)

### Community 4 - "App Shell & Layout"

Cohesion: 0.07
Nodes (30): ModeToggle(), EASE, HERO_CARDS, HomePage(), NAV_ITEMS, SearchCommand(), Breadcrumb, BreadcrumbEllipsis() (+22 more)

### Community 5 - "Root Layout & Fonts"

Cohesion: 0.07
Nodes (31): libreBaskerville, manrope, metadata, MoodModal(), Action, ActionType, actionTypes, addToRemoveQueue() (+23 more)

### Community 6 - "Shared UI Components"

Cohesion: 0.11
Nodes (8): GoalCardProps, ExerciseDetailProps, GoalCardProps, ExerciseDetailProps, Button, ButtonProps, Card, Progress

### Community 7 - "Database Schema Docs"

Cohesion: 0.11
Nodes (34): BloodPressureLog Model (Prisma), Clerk Webhook User Sync, HealthMind AI Database Schema, File Model (S3 PDF uploads, Prisma), GlucoseLog Model (Prisma), Goal + CheckIn Models (Prisma), Journal Model (Prisma), Mood Enum (TERRIBLE/BAD/NEUTRAL/GOOD/GREAT) (+26 more)

### Community 8 - "Journal & Insights UI"

Cohesion: 0.10
Nodes (20): Insights(), DateSearch(), DateSearchProps, JournalEntry(), MoodModal(), TrackMood(), DateSearch(), DateSearchProps (+12 more)

### Community 9 - "Health Data Tables"

Cohesion: 0.22
Nodes (21): DataTable(), DataTableProps, DataTable(), DataTableProps, DataTable(), DataTableProps, DataTable(), DataTableProps (+13 more)

### Community 10 - "Health Insight Cards"

Cohesion: 0.12
Nodes (10): InsightCardProps, ObservationProps, FileUploader, InsightCardProps, ObservationProps, FileUploader, TestimonialProps, formatFileSize() (+2 more)

### Community 11 - "Check-in & File Summary"

Cohesion: 0.12
Nodes (10): MedicalSummary, MedicalSummaryProps, MedicalSummary, MedicalSummaryProps, AIGeneratedBadge(), moodConfig, saveCheckIn(), CardDescription (+2 more)

### Community 12 - "Goals Pages"

Cohesion: 0.21
Nodes (10): ViewAllGoals(), MindfulGoals(), MedicalDisclaimer(), useGoals(), pageAnimations, getDaysLeft(), getGoalProgress(), TabsContent (+2 more)

### Community 13 - "Analytics Charts"

Cohesion: 0.15
Nodes (11): InsightsChartProps, InsightsChartProps, chartData, MoodMonthData, ChartConfig, ChartContainer, ChartContext, ChartContextProps (+3 more)

### Community 14 - "Dev Tooling"

Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, @faker-js/faker, husky, postcss, prettier (+11 more)

### Community 15 - "TypeScript Config"

Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 16 - "Table Column Definitions"

Cohesion: 0.22
Nodes (13): columns, columns, columns, columns, truncatedText(), DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem (+5 more)

### Community 17 - "Shared Type Definitions"

Cohesion: 0.11
Nodes (18): ArticleProps, CheckIn, EmotionInsight, Exercise, FileState, FileStatus, FileUploaderProps, Goal (+10 more)

### Community 18 - "Emotion & Goal Cards"

Cohesion: 0.14
Nodes (16): EmotionBadge(), EmotionBadgeProps, GoalCard(), InsightCard(), BloodPressureForm(), GlucoseForm(), EmotionBadge(), EmotionBadgeProps (+8 more)

### Community 19 - "Component Aliases Config"

Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 20 - "Community 20"

Cohesion: 0.27
Nodes (8): Module(), ModuleCard(), ModuleCardProps, getDifficultyColor(), getIcon(), getTherapyTypeColor(), processMedicalSummary(), parseFilesToText()

### Community 21 - "Community 21"

Cohesion: 0.21
Nodes (8): JournalEntryAccordionItem(), AiSession(), AiSession(), COMING_FEATURES, msClient, Badge(), BadgeProps, badgeVariants

### Community 22 - "Community 22"

Cohesion: 0.22
Nodes (4): EmotionSelectorProps, EmotionSelectorProps, RadioGroup, RadioGroupItem

### Community 23 - "Community 23"

Cohesion: 0.31
Nodes (9): JournalEntryAccordionItem(), AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay (+1 more)

### Community 24 - "Community 24"

Cohesion: 0.24
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 25 - "Community 25"

Cohesion: 0.20
Nodes (6): MOOD_KEYS, insightBg, insightIcons, InsightType, MoodInsights, trendConfig

### Community 26 - "Community 26"

Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, ngrok, postinstall (+2 more)

### Community 27 - "Community 27"

Cohesion: 0.28
Nodes (4): RichTextEditorProps, RichTextEditorProps, Toggle, toggleVariants

### Community 28 - "Community 28"

Cohesion: 0.22
Nodes (8): name, overrides, @types/react, @types/react-dom, prisma, seed, private, version

### Community 29 - "Community 29"

Cohesion: 0.60
Nodes (3): FullTherapyModule, markModuleAsDone(), markStepAsDone()

### Community 30 - "Community 30"

Cohesion: 0.40
Nodes (3): HealthTrends, Trend, trendBadge

### Community 31 - "Community 31"

Cohesion: 0.40
Nodes (4): compat, **dirname, eslintConfig, **filename

### Community 32 - "Community 32"

Cohesion: 0.40
Nodes (4): adminRoutes, config, publicRoutes, userRoutes

### Community 34 - "Community 34"

Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

## Knowledge Gaps

- **297 isolated node(s):** `husky.sh script`, `data`, `chartData`, `EmotionBadgeProps`, `EmotionSelectorProps` (+292 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Emotion & Goal Cards` to `Goals UI Components`, `Community 34`, `Sidebar & Navigation`, `App Shell & Layout`, `Root Layout & Fonts`, `Shared UI Components`, `Journal & Insights UI`, `Health Data Tables`, `Health Insight Cards`, `Goals Pages`, `Analytics Charts`, `Table Column Definitions`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 27`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `Button` connect `Shared UI Components` to `Goals UI Components`, `Sidebar & Navigation`, `App Shell & Layout`, `Journal & Insights UI`, `Health Data Tables`, `Health Insight Cards`, `Check-in & File Summary`, `Goals Pages`, `Table Column Definitions`, `Community 20`, `Community 21`, `Community 23`, `Community 24`, `Community 27`, `Community 29`?**
  _High betweenness centrality (0.052) - this node is a cross-community bridge._
- **Why does `getUserId()` connect `API Route Handlers` to `Goals UI Components`, `Community 25`, `Check-in & File Summary`?**
  _High betweenness centrality (0.040) - this node is a cross-community bridge._
- **Are the 15 inferred relationships involving `cn()` (e.g. with `EmotionBadge()` and `GoalCard()`) actually correct?**
  _`cn()` has 15 INFERRED edges - model-reasoned connections that need verification._
- **What connects `husky.sh script`, `data`, `chartData` to the rest of the system?**
  _299 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Goals UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.09887640449438202 - nodes in this community are weakly interconnected._
- **Should `API Route Handlers` be split into smaller, more focused modules?**
  _Cohesion score 0.055533199195171024 - nodes in this community are weakly interconnected._
