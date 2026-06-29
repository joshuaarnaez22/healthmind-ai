# Product

## Register

product

## Users

General consumers who want to improve their mental and physical health. They open the app in private moments — a quiet morning check-in, a stressful afternoon, a reflective evening. They may be tracking moods, logging vitals, working through CBT therapy modules, or venting in a journal. Two roles exist: **user** (self-managing their own health journey) and **admin** (oversight / power-user view of the same data).

Context: personal, emotionally loaded, often low-energy. The interface should never demand effort or attention.

## Product Purpose

HealthMind AI is a personal mental and physical wellness companion. It integrates mood tracking, journaling, goal-setting, health vitals (blood pressure, glucose), AI-powered therapy chat (Deepseek / OpenAI), voice sessions (Vapi), and structured CBT modules — all in one place. Success looks like: a user opens the app daily without friction, feels understood by it, and can see their progress over time.

## Brand Personality

Nurturing · Grounding · Hopeful

Voice: warm, present, never clinical. Tone shifts slightly by context — more measured in analytics, more encouraging in goal/journal flows. Never chirpy, never cold. Like a knowledgeable friend who sits with you rather than lectures at you.

## Anti-references

- **Generic SaaS cream/beige** — the warm AI scaffold (warm-tinted near-white bg, rounded cards everywhere, eyebrow labels on every section). Warmth must come from hue and type, not background tint.
- Any interface that reads as medical / clinical cold blue (insurance software, EHR aesthetics).
- Gamified wellness (Duolingo energy, badges, confetti) — this is a serious health tool, not a habit streak app.
- Dark terminal / hacker dashboard — wrong genre for the emotional register.

## Design Principles

1. **Presence over efficiency.** The UI doesn't hurry the user. Breathing room, unhurried pacing, and calm spacing signal that their time here is valued, not optimized away.
2. **Trust through honesty.** Data is shown clearly and without spin. Empty states are honest. Progress is real. The interface never flatters.
3. **Warmth through detail, not decoration.** Color warmth and brand personality live in accent, typography weight, and micro-copy — not in background tint. No cream. No warm-neutral scaffolding.
4. **Graded attention.** The most emotionally significant surfaces (journaling, AI therapy, mood entry) get the most visual quiet. Analytics and admin get more density. Each area tunes its energy to its purpose.
5. **Accessible by default.** WCAG AAA target (7:1 body contrast). Health data must be readable under stress, low light, and by users with visual impairments.

## Accessibility & Inclusion

- **Target**: WCAG AAA — 7:1 body text contrast, 4.5:1 large text
- Reduced-motion alternative required for every animation
- Color must never be the sole carrier of health-state information (charts, status badges must have text or icon fallbacks)
- Semantic HTML throughout; screen-reader-ready data tables for vitals
