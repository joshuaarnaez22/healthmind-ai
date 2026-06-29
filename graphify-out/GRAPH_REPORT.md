# Graph Report - . (2026-06-29)

## Corpus Check

- 279 files · ~63,220 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 910 nodes · 2325 edges · 88 communities (72 shown, 16 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 62 edges (avg confidence: 0.82)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Goals & Health Forms|Goals & Health Forms]]
- [[_COMMUNITY_Emotion & UI Components|Emotion & UI Components]]
- [[_COMMUNITY_Admin Layout & Sidebar|Admin Layout & Sidebar]]
- [[_COMMUNITY_Health Summary & Articles|Health Summary & Articles]]
- [[_COMMUNITY_Package Dependencies|Package Dependencies]]
- [[_COMMUNITY_Analytics & Error Pages|Analytics & Error Pages]]
- [[_COMMUNITY_App Layout & Toast|App Layout & Toast]]
- [[_COMMUNITY_Data Models & Project Docs|Data Models & Project Docs]]
- [[_COMMUNITY_Exercise Insights|Exercise Insights]]
- [[_COMMUNITY_Health Data Tables|Health Data Tables]]
- [[_COMMUNITY_Goals Overview & Dashboard|Goals Overview & Dashboard]]
- [[_COMMUNITY_Journal & Insights Views|Journal & Insights Views]]
- [[_COMMUNITY_Dev Tooling & Linting|Dev Tooling & Linting]]
- [[_COMMUNITY_TypeScript Config|TypeScript Config]]
- [[_COMMUNITY_Shared Type Definitions|Shared Type Definitions]]
- [[_COMMUNITY_Landing & Home Page|Landing & Home Page]]
- [[_COMMUNITY_Charts & Analytics|Charts & Analytics]]
- [[_COMMUNITY_Component Aliases & Config|Component Aliases & Config]]
- [[_COMMUNITY_Search Command UI|Search Command UI]]
- [[_COMMUNITY_Build & Dev Scripts|Build & Dev Scripts]]
- [[_COMMUNITY_Rich Text Editor|Rich Text Editor]]
- [[_COMMUNITY_Therapy Modules List|Therapy Modules List]]
- [[_COMMUNITY_Module Detail View|Module Detail View]]
- [[_COMMUNITY_Package Metadata|Package Metadata]]
- [[_COMMUNITY_ESLint Config|ESLint Config]]
- [[_COMMUNITY_Middleware & Auth Routes|Middleware & Auth Routes]]
- [[_COMMUNITY_Auth Layout & Navigation|Auth Layout & Navigation]]
- [[_COMMUNITY_Admin Affirmations|Admin Affirmations]]
- [[_COMMUNITY_Admin Mental Summary|Admin Mental Summary]]
- [[_COMMUNITY_User Affirmations|User Affirmations]]
- [[_COMMUNITY_User Mental Summary|User Mental Summary]]
- [[_COMMUNITY_Module ID Page|Module ID Page]]
- [[_COMMUNITY_Prisma Seed|Prisma Seed]]
- [[_COMMUNITY_JWT & Role Types|JWT & Role Types]]
- [[_COMMUNITY_Goals Static Data|Goals Static Data]]
- [[_COMMUNITY_Module Content Data|Module Content Data]]
- [[_COMMUNITY_Vapi Voice Client|Vapi Voice Client]]
- [[_COMMUNITY_Next.js Config|Next.js Config]]
- [[_COMMUNITY_PostCSS Config|PostCSS Config]]
- [[_COMMUNITY_Personalized Recommendations|Personalized Recommendations]]
- [[_COMMUNITY_Tailwind & shadcn|Tailwind & shadcn]]

## God Nodes (most connected - your core abstractions)

1. `cn()` - 88 edges
2. `Button` - 70 edges
3. `Card` - 53 edges
4. `CardContent` - 48 edges
5. `CardHeader` - 34 edges
6. `getUserId()` - 33 edges
7. `CardTitle` - 29 edges
8. `CardDescription` - 27 edges
9. `Badge()` - 23 edges
10. `pageAnimations` - 23 edges

## Surprising Connections (you probably didn't know these)

- `Deepseek AI (Alternative to GPT)` --semantically_similar_to--> `OpenAI GPT Integration` [INFERRED] [semantically similar]
  README.md → Proposal1.md
- `PhysicalHealthEntry Model (Prisma)` --semantically_similar_to--> `Vitals Logging` [INFERRED] [semantically similar]
  base-schema.md → Proposal1.md
- `MentalHealthEntry Model (Prisma)` --semantically_similar_to--> `Mood Tracking` [INFERRED] [semantically similar]
  base-schema.md → Proposal1.md
- `Journaling` --semantically_similar_to--> `MentalHealthEntry Model (Prisma)` [INFERRED] [semantically similar]
  Proposal1.md → base-schema.md
- `Supabase (Auth + DB)` --semantically_similar_to--> `Neon/Supabase Database` [INFERRED] [semantically similar]
  Proposal1.md → README.md

## Import Cycles

- None detected.

## Hyperedges (group relationships)

- **AI-Powered Mental Health Feature Set** — proposal1_ai_chatbot, proposal1_mood_tracking, proposal1_journaling, proposal1_sentiment_analysis, proposal1_personalized_recommendations [INFERRED 0.85]
- **Prisma Health Data Schema Models** — baseschema_user_model, baseschema_mental_health_entry, baseschema_physical_health_entry [EXTRACTED 1.00]
- **Core Technology Stack** — proposal1_nextjs, proposal1_tailwind_shadcn, proposal1_supabase, proposal1_prisma, proposal1_vercel, proposal1_openai_gpt [EXTRACTED 1.00]

## Communities (88 total, 16 thin omitted)

### Community 0 - "Goals & Health Forms"

Cohesion: 0.09
Nodes (63): DateSearch(), DateSearchProps, MoodModal(), TrackMood(), DateSearch(), DateSearchProps, MoodModal(), TrackMood() (+55 more)

### Community 1 - "Emotion & UI Components"

Cohesion: 0.05
Nodes (48): EmotionBadge(), EmotionBadgeProps, EmotionSelectorProps, GoalCard(), RecentReflectionsProps, InsightCard(), BloodPressureForm(), columns (+40 more)

### Community 2 - "Admin Layout & Sidebar"

Cohesion: 0.06
Nodes (49): data, NavMain(), NavProjects(), NavUser(), InsightsChart(), data, NavMain(), NavProjects() (+41 more)

### Community 3 - "Health Summary & Articles"

Cohesion: 0.06
Nodes (34): POST(), GET(), POST(), POST(), GET(), GET(), GET(), GET() (+26 more)

### Community 4 - "Package Dependencies"

Cohesion: 0.03
Nodes (63): dependencies, ai, @ai-sdk/deepseek, @ai-sdk/openai, @aws-sdk/client-s3, @aws-sdk/s3-request-presigner, canvas-confetti, class-variance-authority (+55 more)

### Community 5 - "Analytics & Error Pages"

Cohesion: 0.08
Nodes (16): chartData, GoalCardProps, InsightCardProps, ObservationProps, FileUploader, GoalCardProps, InsightCardProps, ObservationProps (+8 more)

### Community 6 - "App Layout & Toast"

Cohesion: 0.08
Nodes (29): metadata, poppins, Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId() (+21 more)

### Community 7 - "Data Models & Project Docs"

Cohesion: 0.09
Nodes (30): MentalHealthEntry Model (Prisma), PhysicalHealthEntry Model (Prisma), User Model (Prisma), HealthMind AI Project, Phase 1: Planning & Setup, Phase 2: Public Access Features, Phase 3: Core Private Features, Phase 4: Advanced Features (+22 more)

### Community 8 - "Exercise Insights"

Cohesion: 0.14
Nodes (10): ExerciseDetailProps, MedicalSummary, MedicalSummaryProps, ExerciseDetailProps, MedicalSummary, MedicalSummaryProps, CardDescription, CardHeader (+2 more)

### Community 9 - "Health Data Tables"

Cohesion: 0.22
Nodes (21): DataTable(), DataTableProps, DataTable(), DataTableProps, DataTable(), DataTableProps, DataTable(), DataTableProps (+13 more)

### Community 10 - "Goals Overview & Dashboard"

Cohesion: 0.29
Nodes (11): ViewAllGoals(), MindfulGoals(), ViewAllGoals(), MindfulGoals(), useGoals(), pageAnimations, getDaysLeft(), getGoalProgress() (+3 more)

### Community 11 - "Journal & Insights Views"

Cohesion: 0.22
Nodes (10): Insights(), JournalEntry(), Insights(), JournalEntry(), useSequentialInsights(), formatDateKey(), AffirmationLoader(), MentalSummaryLoader() (+2 more)

### Community 12 - "Dev Tooling & Linting"

Cohesion: 0.10
Nodes (19): devDependencies, eslint, eslint-config-next, @eslint/eslintrc, @faker-js/faker, husky, postcss, prettier (+11 more)

### Community 13 - "TypeScript Config"

Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 14 - "Shared Type Definitions"

Cohesion: 0.11
Nodes (18): ArticleProps, CheckIn, EmotionInsight, Exercise, FileState, FileStatus, FileUploaderProps, Goal (+10 more)

### Community 15 - "Landing & Home Page"

Cohesion: 0.15
Nodes (11): FeatureCard(), MobileNav(), Testimonial(), SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader() (+3 more)

### Community 16 - "Charts & Analytics"

Cohesion: 0.16
Nodes (10): InsightsChartProps, chartData, InsightsChartProps, ChartConfig, ChartContainer, ChartContext, ChartContextProps, ChartLegendContent (+2 more)

### Community 17 - "Component Aliases & Config"

Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 18 - "Search Command UI"

Cohesion: 0.32
Nodes (9): Command, CommandDialog(), CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator (+1 more)

### Community 19 - "Build & Dev Scripts"

Cohesion: 0.20
Nodes (10): scripts, build, dev, format, format:check, lint, ngrok, postinstall (+2 more)

### Community 20 - "Rich Text Editor"

Cohesion: 0.28
Nodes (4): RichTextEditorProps, RichTextEditorProps, Toggle, toggleVariants

### Community 22 - "Module Detail View"

Cohesion: 0.44
Nodes (7): Module(), ModuleCard(), ModuleCardProps, FullTherapyModule, getDifficultyColor(), getIcon(), getTherapyTypeColor()

### Community 23 - "Package Metadata"

Cohesion: 0.22
Nodes (8): name, overrides, @types/react, @types/react-dom, prisma, seed, private, version

### Community 24 - "ESLint Config"

Cohesion: 0.40
Nodes (4): compat, **dirname, eslintConfig, **filename

### Community 25 - "Middleware & Auth Routes"

Cohesion: 0.40
Nodes (4): adminRoutes, config, publicRoutes, userRoutes

## Knowledge Gaps

- **277 isolated node(s):** `husky.sh script`, `data`, `chartData`, `EmotionBadgeProps`, `EmotionSelectorProps` (+272 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Emotion & UI Components` to `Goals & Health Forms`, `Admin Layout & Sidebar`, `Analytics & Error Pages`, `App Layout & Toast`, `Exercise Insights`, `Health Data Tables`, `Goals Overview & Dashboard`, `Journal & Insights Views`, `Landing & Home Page`, `Charts & Analytics`, `Search Command UI`, `Rich Text Editor`, `Module Detail View`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Why does `Button` connect `Analytics & Error Pages` to `Goals & Health Forms`, `Emotion & UI Components`, `Admin Layout & Sidebar`, `Exercise Insights`, `Health Data Tables`, `Goals Overview & Dashboard`, `Journal & Insights Views`, `Landing & Home Page`, `Search Command UI`, `Rich Text Editor`, `Therapy Modules List`, `Module Detail View`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `getUserId()` connect `Health Summary & Articles` to `Goals & Health Forms`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **Are the 16 inferred relationships involving `cn()` (e.g. with `EmotionBadge()` and `GoalCard()`) actually correct?**
  _`cn()` has 16 INFERRED edges - model-reasoned connections that need verification._
- **What connects `husky.sh script`, `data`, `chartData` to the rest of the system?**
  _278 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Goals & Health Forms` be split into smaller, more focused modules?**
  _Cohesion score 0.08966304968589378 - nodes in this community are weakly interconnected._
- **Should `Emotion & UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.0547945205479452 - nodes in this community are weakly interconnected._
