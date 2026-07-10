# Design System — HealthMind

## Visual Theme

**Alan-inspired health companion** — cream paper, electric blue CTAs, lime highlight accents, single soft grotesque (Alan Sans). Same language for marketing and the logged-in product shell.

## Colors

| Role | Hex / OKLCH | CSS token |
|------|-------------|-----------|
| Paper | `#fffcf5` / `0.991 0.01 87.5` | `--background` |
| Ink | `#282830` / `0.28 0.015 285.4` | `--foreground` |
| Muted | `#656779` / `0.519 0.028 280.3` | `--muted-foreground` |
| Blue | `#0a70ff` / `0.55 0.2 260` | `--primary` |
| Blue soft | `#ebf5ff` / `0.966 0.017 248` | `--secondary`, `--muted` |
| Lime | `#fcff7e` / `0.972 0.152 110.1` | `--accent` |
| Green soft | `#ecf7e9` | Vitals panels (dashboard) |

Defined in [`app/globals.css`](app/globals.css). Dark mode uses ink surfaces with blue primary (no purple).

## Typography

**Alan Sans** (SIL OFL) — `app/fonts/AlanSans-Variable.woff2` loaded in root layout as `--font-sans` (also used for headings).

## Product shell

- Sidebar + header: cream surfaces, blue active/primary, soft borders
- Dashboard: tinted panels (secondary / green-soft), rounded-3xl, lime progress chip on getting-started
- Keep shadcn primitives; restyle via tokens, not one-off purple classes

## First-user tour (Driver.js)

- Component: `app/(protected)/user/_components/onboarding-tour.tsx`
- Triggers on dashboard when checklist is visible and `localStorage.healthmind-onboarding-tour-v1` is unset
- Steps: Getting started → MindLog → Health → Goals
- Popover class: `.healthmind-tour` (Alan cream + blue buttons in `globals.css`)
- Checklist remains for task completion; tour does not replace it

## Marketing layout grammar

- Centered brand-first hero + dual CTA + proof line
- Phone app preview, stats strip, soft tinted feature panels
- Lime closing CTA band
- No mascot, no celebrity, no fake testimonials

## Motion

Short entrance fades on marketing. Driver.js respects `prefers-reduced-motion`.
