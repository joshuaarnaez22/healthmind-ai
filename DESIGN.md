# Design

## Color

**Palette strategy:** Restrained — muted violet primary anchors the brand; a soft rose accent adds emotional warmth on CTAs and status; pure white surface lets both breathe.

**Mood reference:** A therapist's private office on a winter afternoon — quiet lavender light through frosted glass, unhurried and safe.

**Color space:** OKLCH throughout. Never hex in new tokens.

### Light mode

```css
:root {
  /* Surfaces */
  --bg:      oklch(1.000 0.000 0);      /* pure white — brand warmth lives in primary, not bg */
  --surface: oklch(0.975 0.006 270);    /* bg + faintest violet tint — cards, panels */
  --border:  oklch(0.918 0.010 270);    /* soft violet-tinted border */

  /* Text */
  --ink:     oklch(0.175 0.028 270);    /* near-black with violet undertone — 14:1 on white (AAA) */
  --muted:   oklch(0.420 0.015 270);    /* secondary text — ≥5.5:1 on white (AAA large, AA body) */

  /* Brand */
  --primary:          oklch(0.490 0.150 270);   /* grounded violet — buttons, links, focus rings */
  --primary-fg:       oklch(1.000 0.000 0);     /* white text on primary fill */
  --accent:           oklch(0.540 0.145 350);   /* dusty rose — badges, status, CTAs, highlights */
  --accent-fg:        oklch(1.000 0.000 0);     /* white text on accent fill */

  /* Semantic */
  --success:          oklch(0.520 0.130 162);   /* teal-green — positive health metrics */
  --warning:          oklch(0.660 0.140  65);   /* warm amber — caution / elevated readings */
  --destructive:      oklch(0.560 0.190  22);   /* red-orange — errors, destructive actions */
  --destructive-fg:   oklch(1.000 0.000   0);

  /* Charts (ordered by emotional valence: calm → active) */
  --chart-1: oklch(0.490 0.150 270);   /* primary violet */
  --chart-2: oklch(0.540 0.145 350);   /* rose accent */
  --chart-3: oklch(0.520 0.130 162);   /* teal */
  --chart-4: oklch(0.660 0.140  65);   /* amber */
  --chart-5: oklch(0.600 0.120 220);   /* soft blue */
}
```

### Dark mode

```css
.dark {
  --bg:      oklch(0.080 0.000   0);    /* near-black — no hue tint */
  --surface: oklch(0.130 0.010 270);    /* slightly violet-tinted panels */
  --border:  oklch(0.220 0.015 270);

  --ink:     oklch(0.960 0.000   0);    /* near-white */
  --muted:   oklch(0.650 0.010 270);    /* ≥4.5:1 on dark bg */

  --primary:     oklch(0.680 0.140 270); /* lighter in dark — still grounded, not neon */
  --primary-fg:  oklch(0.080 0.000   0); /* dark text on light primary */
  --accent:      oklch(0.720 0.120 350);
  --accent-fg:   oklch(0.080 0.000   0);

  --success:     oklch(0.680 0.120 162);
  --warning:     oklch(0.760 0.130  65);
  --destructive: oklch(0.640 0.170  22);

  --chart-1: oklch(0.680 0.140 270);
  --chart-2: oklch(0.720 0.120 350);
  --chart-3: oklch(0.680 0.120 162);
  --chart-4: oklch(0.760 0.130  65);
  --chart-5: oklch(0.700 0.110 220);
}
```

### Usage rules

- **Never** use color alone to communicate health state — pair with icon or text label
- Mid-luminance saturated fills (L 0.42–0.78, chroma ≥ 0.08) → white text (`--primary-fg`, `--accent-fg`)
- Pale fills (L > 0.85) or near-neutral fills → dark text (`--ink`)
- `--muted` is for secondary/helper text only — never for body copy or labels

---

## Typography

**Pairing strategy:** Geometric sans (UI chrome) + humanist serif (emotional content). The serif only appears in journaling, therapy chat, and display headings — places where warmth and intimacy matter most.

Loaded via `next/font/google` in `app/layout.tsx` (already applied):

- **`--font-sans`**: Manrope — warm humanist sans for all app UI, nav, buttons, body text
- **`--font-heading`**: Libre Baskerville — grounded serif for display headings on the landing page and emotional surfaces (journal, therapy)

```ts
// app/layout.tsx
import { Manrope, Libre_Baskerville } from 'next/font/google'
const manrope = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'], style: ['normal', 'italic'],
  subsets: ['latin'], variable: '--font-heading', display: 'swap',
})
```

**Register split:** Libre Baskerville is brand-register only (landing page, display headings). App interior (product register) uses Manrope exclusively. DM Sans and DM Serif Text were considered but are on the brand.md reflex-reject list.

### Scale

```css
/* Fluid type scale — clamp(min, fluid, max) */
--text-xs:   clamp(0.694rem, 0.67vw + 0.5rem,  0.75rem);
--text-sm:   clamp(0.833rem, 0.80vw + 0.6rem,  0.875rem);
--text-base: clamp(1.000rem, 0.95vw + 0.7rem,  1.063rem);
--text-lg:   clamp(1.125rem, 1.10vw + 0.8rem,  1.25rem);
--text-xl:   clamp(1.250rem, 1.30vw + 0.9rem,  1.5rem);
--text-2xl:  clamp(1.500rem, 1.70vw + 1.0rem,  2.0rem);
--text-3xl:  clamp(1.875rem, 2.20vw + 1.2rem,  2.5rem);
--text-4xl:  clamp(2.250rem, 3.00vw + 1.4rem,  3.5rem);
/* Display max 6rem per impeccable rules */
```

### Rules

- Body line length: max 70ch
- `text-wrap: balance` on `h1`–`h3`; `text-wrap: pretty` on prose
- Letter-spacing on display headings: ≥ −0.03em (never tighter)
- Serif (`--font-serif`) for: journal entry text, AI therapy chat bubbles, module body prose, page display headings where warmth is intentional
- Sans (`--font-sans`) for: navigation, labels, data tables, form fields, button text, analytics

---

## Spacing

Tailwind's default 4px base scale. No overrides needed.

Rhythm principle: vary spacing between sections; equal spacing flattens hierarchy. Tight (4–8px) within a component group; generous (32–64px) between sections.

```
Component internal gap:  8–16px  (gap-2, gap-4)
Card padding:            20–24px (p-5, p-6)
Section spacing:         48–80px (py-12, py-20)
Page max-width:          1280px (container)
Content column max:      70ch   (prose)
```

---

## Radius

```css
--radius: 0.625rem;  /* 10px — slightly softer than shadcn default 8px; matches the brand warmth without being pill-heavy */
```

Variants from Tailwind config:
- `rounded-lg` → var(--radius) = 10px
- `rounded-md` → 8px
- `rounded-sm` → 6px

---

## Motion

**Existing:** `motion/react` (Framer Motion) is installed and already used in `dark-mode.tsx`. Use it consistently — no mixing with CSS transitions for interactive components.

**Energy level:** Calm. Ease-out curves. Nothing bouncy or springy.

```ts
// Standard transition presets
export const motionFast   = { duration: 0.15, ease: [0.16, 1, 0.3, 1] }; // expo-out
export const motionBase   = { duration: 0.25, ease: [0.16, 1, 0.3, 1] };
export const motionSlow   = { duration: 0.40, ease: [0.16, 1, 0.3, 1] };
export const motionGentle = { duration: 0.55, ease: [0.22, 1, 0.36, 1] }; // for mood/journal reveals
```

**Reduced motion:** Every animated component must have `useReducedMotion()` check. On `true`: instant crossfade or no animation — never disable visibility-dependent transitions (content must be visible by default).

**Patterns:**
- Page enter: `opacity 0→1` + `translateY 8px→0` over 0.25s
- Card hover: `translateY -2px` + `shadow` over 0.2s
- Emotion states (mood tracker, goal badges): `scale` + `opacity` — these are the emotional core, give them slightly more life
- Data tables / analytics: no entrance animation — data should feel immediate

---

## Component patterns

**Shadcn/ui** is the component library. Standard usage applies. Modifications noted below.

### Cards

Use only when grouping truly distinct content items. Not as the default layout container for every section. Single-level only — never nest Card inside Card.

```tsx
// Standard card — bg-card, border, rounded-lg, shadow-sm
<Card className="bg-card border-border shadow-sm" />

// Elevated card (modal, floating panel)
<Card className="shadow-md ring-1 ring-border/50" />
```

### Buttons

Primary: `--primary` bg with white text. Accent: `--accent` bg with white text. Both use the mid-luminance rule (white fg, not dark).

```tsx
// In tailwind.config.ts, extend these variants or use cn() overrides:
// primary:  bg-primary text-primary-foreground hover:bg-primary/90
// accent:   bg-accent  text-accent-foreground  hover:bg-accent/90
```

### Status badges (emotion, health metric state)

Use `--accent` (rose) for emotional states; `--success` (teal) for healthy readings; `--warning` (amber) for elevated; `--destructive` for critical. Always paired with an icon or text label — never color alone.

### Journal / Therapy surfaces

Apply `--font-serif` to the text content area. Increase line-height to 1.7. Reduce visual chrome — borderless or subtle-border inputs, generous padding.

### Empty states

Each feature area needs one. Warm, honest, never apologetic. Short: one sentence + one action. No "No data available" — write for the context.

---

## Layout

**App shell:** Sidebar + main content. Sidebar uses `--sidebar-background` / `--sidebar-foreground` tokens from shadcn — these should be updated to reference the new violet palette.

**Page structure:** Consistent `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` for the main content container.

**Grid:** 2D layouts → CSS Grid (`repeat(auto-fit, minmax(280px, 1fr))`). 1D → Flexbox. No default-to-Grid.

---

## z-index scale

```css
--z-dropdown:       100;
--z-sticky:         200;
--z-modal-backdrop: 300;
--z-modal:          400;
--z-toast:          500;
--z-tooltip:        600;
```

Never use arbitrary values (`z-[999]`, `z-[9999]`).

---

## Current state / known gaps

- **Tokens**: CSS variables are still HSL (shadcn default). Migration to OKLCH is needed before new brand color is applied.
- **Typography**: `Arial, Helvetica` in globals.css. DM Sans + DM Serif Text not yet loaded.
- **Color**: completely achromatic — primary is `0 0% 9%` (near-black). No brand hue applied yet.
- **Recommended first step**: update `globals.css` with the OKLCH token set above, then set `--font-sans` and import the Google Fonts.
