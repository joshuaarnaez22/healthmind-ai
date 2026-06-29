# Graph Report - .  (2026-06-29)

## Corpus Check
- 291 files · ~69,493 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 972 nodes · 2479 edges · 94 communities (75 shown, 19 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Admin Goals UI|Admin Goals UI]]
- [[_COMMUNITY_Admin Navigation Shell|Admin Navigation Shell]]
- [[_COMMUNITY_User Analytics & API Routes|User Analytics & API Routes]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Admin Goals & Insights Views|Admin Goals & Insights Views]]
- [[_COMMUNITY_App Shell & Auth Pages|App Shell & Auth Pages]]
- [[_COMMUNITY_AI Schemas & Design Tokens|AI Schemas & Design Tokens]]
- [[_COMMUNITY_Root Layout & Fonts|Root Layout & Fonts]]
- [[_COMMUNITY_Admin Health Insights & Check-ins|Admin Health Insights & Check-ins]]
- [[_COMMUNITY_Health Tracker Data Tables|Health Tracker Data Tables]]
- [[_COMMUNITY_Not Found & Goal Cards|Not Found & Goal Cards]]
- [[_COMMUNITY_Analytics Charts|Analytics Charts]]
- [[_COMMUNITY_Therapy Modules & Exercises|Therapy Modules & Exercises]]
- [[_COMMUNITY_Dev Config & Linting|Dev Config & Linting]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Shared Types|Shared Types]]
- [[_COMMUNITY_Component Aliases & Config|Component Aliases & Config]]
- [[_COMMUNITY_Search Command (User & Admin)|Search Command (User & Admin)]]
- [[_COMMUNITY_Therapy & Health Summary|Therapy & Health Summary]]
- [[_COMMUNITY_Therapy Module Detail|Therapy Module Detail]]
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
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 82|Community 82]]
- [[_COMMUNITY_Community 87|Community 87]]
- [[_COMMUNITY_Community 88|Community 88]]
- [[_COMMUNITY_Community 89|Community 89]]
- [[_COMMUNITY_Community 90|Community 90]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 90 edges
2. `Button` - 70 edges
3. `Card` - 55 edges
4. `CardContent` - 50 edges
5. `getUserId()` - 44 edges
6. `CardHeader` - 36 edges
7. `CardTitle` - 32 edges
8. `Badge()` - 28 edges
9. `CardDescription` - 27 edges
10. `pageAnimations` - 24 edges

## Surprising Connections (you probably didn't know these)
- `PhysicalHealthEntry Model (Prisma)` --semantically_similar_to--> `Vitals Logging`  [INFERRED] [semantically similar]
  base-schema.md → Proposal1.md
- `MentalHealthEntry Model (Prisma)` --semantically_similar_to--> `Mood Tracking`  [INFERRED] [semantically similar]
  base-schema.md → Proposal1.md
- `Journaling` --semantically_similar_to--> `MentalHealthEntry Model (Prisma)`  [INFERRED] [semantically similar]
  Proposal1.md → base-schema.md
- `AnalyticsPage()` --calls--> `getUserId()`  [INFERRED]
  app/(protected)/user/analytics/page.tsx → actions/server-actions/user.ts
- `DashboardPage()` --calls--> `getUserId()`  [INFERRED]
  app/(protected)/user/dashboard/page.tsx → actions/server-actions/user.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **AI-Powered Mental Health Feature Set** — proposal1_ai_chatbot, proposal1_mood_tracking, proposal1_journaling, proposal1_sentiment_analysis, proposal1_personalized_recommendations [INFERRED 0.85]
- **Core Technology Stack** — proposal1_nextjs, proposal1_tailwind_shadcn, proposal1_supabase, proposal1_prisma, proposal1_vercel, proposal1_openai_gpt [EXTRACTED 1.00]
- **Prisma Health Data Schema Models** — baseschema_user_model, baseschema_mental_health_entry, baseschema_physical_health_entry [EXTRACTED 1.00]
- **Mental Health AI Core (Mood + Journal + AI Insights)** — feature_mood_tracking, feature_journaling, feature_ai_insights [INFERRED 0.95]
- **Design System (Color + Typography + Motion)** — design_color_system, design_typography_system, design_motion_system [EXTRACTED 1.00]
- **Tech Stack Data Layer (Neon + Prisma + Redis)** — readme_neon_postgres, readme_upstash_redis, readme_clerk_auth [INFERRED 0.85]

## Communities (94 total, 19 thin omitted)

### Community 0 - "Admin Goals UI"
Cohesion: 0.07
Nodes (85): EmotionBadge(), EmotionBadgeProps, GoalCard(), InsightCard(), BloodPressureForm(), GlucoseForm(), DateSearch(), DateSearchProps (+77 more)

### Community 1 - "Admin Navigation Shell"
Cohesion: 0.06
Nodes (53): NavMain(), NavProjects(), NavUser(), InsightsChart(), RecentReflectionsProps, columns, columns, NavMain() (+45 more)

### Community 2 - "User Analytics & API Routes"
Cohesion: 0.07
Nodes (40): MOOD_KEYS, AnalyticsPage(), POST(), GET(), POST(), POST(), GET(), GET() (+32 more)

### Community 3 - "Package Dependencies"
Cohesion: 0.03
Nodes (64): dependencies, ai, @ai-sdk/deepseek, @ai-sdk/openai, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, canvas-confetti, class-variance-authority (+56 more)

### Community 4 - "Admin Goals & Insights Views"
Cohesion: 0.10
Nodes (25): ViewAllGoals(), MindfulGoals(), Insights(), JournalEntry(), ViewAllGoals(), MindfulGoals(), Insights(), JournalEntry() (+17 more)

### Community 5 - "App Shell & Auth Pages"
Cohesion: 0.07
Nodes (30): ModeToggle(), EASE_OUT, ENTER, FEATURES, HomePage(), VIEW_ENTER, MobileNav(), Breadcrumb (+22 more)

### Community 6 - "AI Schemas & Design Tokens"
Cohesion: 0.06
Nodes (45): MentalHealthEntry Model (Prisma), PhysicalHealthEntry Model (Prisma), User Model (Prisma), OKLCH Color System, Motion System (Framer Motion / motion-react), Typography System (Manrope + Libre Baskerville), AI-powered Insights and Recommendations, Goals and Check-ins Feature (+37 more)

### Community 7 - "Root Layout & Fonts"
Cohesion: 0.07
Nodes (31): libreBaskerville, manrope, metadata, MoodModal(), Action, ActionType, actionTypes, addToRemoveQueue() (+23 more)

### Community 8 - "Admin Health Insights & Check-ins"
Cohesion: 0.11
Nodes (12): InsightCardProps, ObservationProps, FileUploader, InsightCardProps, ObservationProps, FileUploader, TestimonialProps, formatFileSize() (+4 more)

### Community 9 - "Health Tracker Data Tables"
Cohesion: 0.22
Nodes (21): DataTable(), DataTableProps, DataTable(), DataTableProps, DataTable(), DataTableProps, DataTable(), DataTableProps (+13 more)

### Community 10 - "Not Found & Goal Cards"
Cohesion: 0.13
Nodes (5): GoalCardProps, GoalCardProps, Button, ButtonProps, Progress

### Community 11 - "Analytics Charts"
Cohesion: 0.15
Nodes (12): InsightsChartProps, InsightsChartProps, chartData, MoodMonthData, CardTitle, ChartConfig, ChartContainer, ChartContext (+4 more)

### Community 12 - "Therapy Modules & Exercises"
Cohesion: 0.16
Nodes (8): ExerciseDetailProps, ExerciseDetailProps, moodConfig, msClient, Badge(), BadgeProps, badgeVariants, CardDescription

### Community 13 - "Dev Config & Linting"
Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, @faker-js/faker, husky, postcss, prettier (+11 more)

### Community 14 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 15 - "Shared Types"
Cohesion: 0.11
Nodes (18): ArticleProps, CheckIn, EmotionInsight, Exercise, FileState, FileStatus, FileUploaderProps, Goal (+10 more)

### Community 16 - "Component Aliases & Config"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 17 - "Search Command (User & Admin)"
Cohesion: 0.28
Nodes (10): NAV_ITEMS, Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList (+2 more)

### Community 18 - "Therapy & Health Summary"
Cohesion: 0.23
Nodes (4): MedicalSummary, MedicalSummaryProps, AIGeneratedBadge(), CardHeader

### Community 19 - "Therapy Module Detail"
Cohesion: 0.32
Nodes (9): Module(), ModuleCard(), ModuleCardProps, FullTherapyModule, getDifficultyColor(), getIcon(), getTherapyTypeColor(), markModuleAsDone() (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.22
Nodes (4): EmotionSelectorProps, EmotionSelectorProps, RadioGroup, RadioGroupItem

### Community 21 - "Community 21"
Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, ngrok, postinstall (+2 more)

### Community 22 - "Community 22"
Cohesion: 0.28
Nodes (4): RichTextEditorProps, RichTextEditorProps, Toggle, toggleVariants

### Community 23 - "Community 23"
Cohesion: 0.22
Nodes (8): name, overrides, @types/react, @types/react-dom, prisma, seed, private, version

### Community 24 - "Community 24"
Cohesion: 0.29
Nodes (5): insightBg, insightIcons, InsightType, MoodInsights, trendConfig

### Community 25 - "Community 25"
Cohesion: 0.40
Nodes (3): HealthTrends, Trend, trendBadge

### Community 26 - "Community 26"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 27 - "Community 27"
Cohesion: 0.40
Nodes (4): adminRoutes, config, publicRoutes, userRoutes

### Community 29 - "Community 29"
Cohesion: 0.50
Nodes (3): AccordionContent, AccordionItem, AccordionTrigger

## Knowledge Gaps
- **306 isolated node(s):** `husky.sh script`, `data`, `chartData`, `EmotionBadgeProps`, `EmotionSelectorProps` (+301 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Admin Goals UI` to `Admin Navigation Shell`, `Admin Goals & Insights Views`, `App Shell & Auth Pages`, `Root Layout & Fonts`, `Admin Health Insights & Check-ins`, `Health Tracker Data Tables`, `Not Found & Goal Cards`, `Analytics Charts`, `Therapy Modules & Exercises`, `Search Command (User & Admin)`, `Therapy Module Detail`, `Community 20`, `Community 22`, `Community 29`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `Button` connect `Not Found & Goal Cards` to `Admin Goals UI`, `Community 32`, `Admin Navigation Shell`, `Admin Goals & Insights Views`, `App Shell & Auth Pages`, `Admin Health Insights & Check-ins`, `Health Tracker Data Tables`, `Therapy Modules & Exercises`, `Search Command (User & Admin)`, `Therapy & Health Summary`, `Therapy Module Detail`, `Community 22`?**
  _High betweenness centrality (0.038) - this node is a cross-community bridge._
- **Why does `getUserId()` connect `User Analytics & API Routes` to `Admin Goals UI`, `Therapy Modules & Exercises`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `cn()` (e.g. with `EmotionBadge()` and `GoalCard()`) actually correct?**
  _`cn()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `husky.sh script`, `data`, `chartData` to the rest of the system?**
  _309 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin Goals UI` be split into smaller, more focused modules?**
  _Cohesion score 0.06637596899224807 - nodes in this community are weakly interconnected._
- **Should `Admin Navigation Shell` be split into smaller, more focused modules?**
  _Cohesion score 0.06044303797468355 - nodes in this community are weakly interconnected._