# @uncinq/design-tokens

> Framework-agnostic design tokens for Un Cinq projects — Hugo, Symfony, Shopify, or any CSS environment.

<img width="1280" height="640" alt="share-design-tokens" src="https://github.com/user-attachments/assets/66b8ce73-b07d-4cd0-bcb7-f8e0f7a5bb98" />

## What are design tokens?

Design tokens are the atomic decisions of a design system: colors, spacing, typography, motion. Instead of hardcoding `#ae003f` or `1rem` throughout your codebase, you name the decision — `--color-brand`, `--spacing-md` — and reference that name everywhere.

## Token architecture

This package follows the [DTCG](docs/dtcg.md) three-layer model — primitive → semantic → component:

```
primitive   →   semantic   →   component
(raw values)    (purpose)      (component-scoped, not in this package)
```

### Layer 1 — Primitive

Raw, context-free values. No opinions about where they're used.

```css
--color-indigo-600: #4338ca;
--size-16: 1rem;
--font-weight-bold: 700;
```

A primitive token answers: **"what is the value?"**

### Layer 2 — Semantic

Named by purpose, not by appearance. References primitives via CSS `var()`.

```css
--color-brand:   var(--color-indigo-600);
--spacing-md:    var(--size-30);
--font-weight-heading: var(--font-weight-bold);
```

A semantic token answers: **"what is this value for?"**

This is the layer that gives portability: all projects consuming `@uncinq/design-tokens` share the same semantic API. When the brand color changes, you update one primitive — all semantic tokens that reference it update automatically.

### Layer 3 — Component

Scoped to a specific component. Generic component tokens are provided by [@uncinq/component-tokens](https://github.com/uncinq/component-tokens); project-specific ones live in each project's own design system.

```css
--alert-border-radius: var(--radius-none);
--btn-padding-x: var(--spacing-control);
--btn-padding-y: var(--spacing-control);
```

---

## Naming convention

### Semantic tokens

Global semantic tokens follow: `--{category}-{subcategory?}-{variant}-{state?}`

```
--{category}                     --color
  -{subcategory}                 --color-text
    -{variant}                   --color-text-muted
      -{state}                   --color-text-disabled
```

### Component tokens

Component tokens follow: `--{component}-{property}-{sub-property?}-{state?}`

The property mirrors the CSS property name — `background-color`, `border-color`, `text-decoration-color` — so the token reads the same way as the CSS declaration it controls.

```
--{component}                    --btn
  -{property}                    --btn-background-color
    -{sub-property}              --btn-text-decoration-color  (text-decoration + color)
      -{state}                   --btn-background-color-hover
```

### Rules

- **Lowercase kebab-case** — always
- **No component names** in primitive or semantic tokens (`--button-*` belongs in component tokens, not here)
- **Semantic tokens are named by intent** — they may reference a primitive via `var()` or carry a raw value when the value itself has design intent (e.g. `--z-index-modal: 400`, `--radius-pill: 9999px`)
- **`color-[role]` pour tous les tokens couleur** — `color` est le préfixe catégorie, le rôle UI suit : `color-background`, `color-border`, `color-text`, `color-accent`, `color-placeholder`. Cela groupe tous les tokens couleur alphabétiquement sous `color-*` et reflète la structure des tokens sémantiques globaux (`--color-background` → `--btn-color-background`). `background` n'est jamais abrégé : `color-background` pas `color-bg`.
- **States at the end** — `-hover`, `-focus`, `-active`, `-disabled`, `-checked`
- **Alphabetical order** — tokens within a file are sorted alphabetically within each group; group related tokens with a comment when the file has many entries:

| Token | Rôle | CSS property appliquée |
| --- | --- | --- |
| `--btn-color-background` | background | `background-color` |
| `--btn-color-border` | border | `border-color` |
| `--btn-color-text` | text | `color` |
| `--btn-color-text-decoration` | text-decoration | `text-decoration-color` |
| `--form-color-accent` | accent | `color` |
| `--input-color-placeholder` | placeholder | `color` |

```css
/* Brand */
--color-brand:       var(--color-indigo-600);
--color-brand-hover: var(--color-indigo-700);

/* Text */
--color-text:        var(--color-gray-900);
--color-text-muted:  var(--color-gray-500);
```

### Scales

| Use case | Scale | Example |
| --- | --- | --- |
| Color palettes | Numeric `100–900` | `--color-gray-500` |
| Heading levels | Zero-padded `01–06` | `--font-size-heading-01` |
| Layout / spacing | T-shirt `2xs xs sm md lg xl 2xl` | `--spacing-md` |
| Radius, shadow, size | T-shirt `2xs xs sm md lg xl 2xl` | `--radius-sm` |
| Purposeful aliases | Named | `--radius-control`, `--radius-pill` |

### Category reference

| Category | Covers | Example tokens |
| --- | --- | --- |
| `color` | All color values | `--color-brand`, `--color-background-muted`, `--color-text-on-dark` |
| `font-family` | Typefaces | `--font-family-sans`, `--font-family-heading` |
| `font-size` | Text sizes | `--font-size-sm`, `--font-size-heading-01` |
| `font-weight` | Weight values | `--font-weight-bold`, `--font-weight-heading` |
| `line-height` | Line heights | `--line-height-tight`, `--line-height-heading` |
| `letter-spacing` | Tracking | `--letter-spacing-large` |
| `text-decoration` | Decoration props | `--text-decoration-offset` |
| `spacing` | Margin / padding | `--spacing-md`, `--spacing-section` |
| `size` | Width / height | `--size-16`, `--size-tablet` |
| `radius` | Border radius | `--radius-md`, `--radius-pill` |
| `border` | Border style/width | `--border-width-normal`, `--border-style-normal` |
| `shadow` | Box shadows | `--shadow-md`, `--shadow-center-sm` |
| `duration` | Animation timing | `--duration-fast` |
| `easing` | Timing functions | `--easing-bounce` |
| `transition` | Shorthand transitions | `--transition-normal`, `--transition-color` |
| `ratio` | Aspect ratios | `--ratio-16-9` |
| `fluid-text` | Responsive fluid type scale (Utopia) | `--fluid-text-sm`, `--fluid-text-xl` |
| `fluid-spacing` | Responsive fluid spacing scale (Utopia) | `--fluid-spacing-sm`, `--fluid-spacing-lg` |
| `focus` | Focus ring tokens | `--focus-color`, `--focus-outline-width` |
| `opacity` | Opacity values | `--opacity-disabled`, `--opacity-overlay` |
| `span` | Grid column spans | `--span-full`, `--span-half` |
| `z-index` | Stacking order | `--z-index-modal`, `--z-index-dropdown` |
| `max-width` | Readability caps | `--max-width-paragraph` |

---

## Colors

### Color space — OKLCH

All primitive color values are defined in **OKLCH** (`oklch(L C H)`):

| Channel | Range | Meaning |
|---------|-------|---------|
| `L` | `0 → 1` | Perceptual lightness (0 = black, 1 = white) |
| `C` | `0 → ~0.4` | Chroma / colorfulness (0 = gray) |
| `H` | `0° → 360°` | Hue angle |

**Why OKLCH over hex/HSL?**

- **Perceptually uniform** — equal steps in L produce equal perceived brightness differences, regardless of hue. HSL does not guarantee this (`hsl(60, 100%, 50%)` yellow looks far brighter than `hsl(240, 100%, 50%)` blue at the same L).
- **Predictable contrast** — you can reason about WCAG contrast by comparing L values without converting to relative luminance.
- **Better interpolation** — gradients and animations between two OKLCH colors don't pass through muddy grays.
- **Future-proof** — native in all modern browsers, the color space used by Tailwind v4, Radix, and the W3C Design Tokens spec.

> Browser support: Chrome 111+, Firefox 113+, Safari 15.4+. Legacy browsers receive the nearest sRGB fallback automatically.

### Primitive palette

The primitive palette provides **11 steps per hue** (50 → 950), named numerically. These are raw values with no opinion about usage.

| Hue | H angle | Character |
|-----|---------|-----------|
| `amber` | ≈ 70° | Golden yellow-orange |
| `blue` | ≈ 260° | Classic blue |
| `cyan` | ≈ 215° | Bright cyan |
| `gray` | neutral | Cool neutral |
| `green` | ≈ 150° | Lush green |
| `indigo` | ≈ 277° | Blue-violet |
| `lime` | ≈ 131° | Electric yellow-green |
| `orange` | ≈ 48° | Vivid orange |
| `pink` | ≈ 354° | Bright pink |
| `purple` | ≈ 304° | Rich purple |
| `red` | ≈ 25° | Classic red |
| `rose` | ≈ 16° | Pink-red |
| `sienna` | ≈ 23° | Brick-red (crimson × terracotta) |
| `sky` | ≈ 237° | Soft sky blue |
| `teal` | ≈ 183° | Blue-green |
| `violet` | ≈ 293° | Modern violet |
| `yellow` | ≈ 86° | Pure yellow |

Plus `--color-black` and `--color-white` (with `*-rgb` variants for `rgb()` opacity usage).

**Step guide:**

| Step | L (avg) | L amber/yellow/lime | Typical use |
|------|---------|---------------------|-------------|
| 50  | ≈ 0.97 | ≈ 0.98 | Page tinted backgrounds, hover states on white |
| 100 | ≈ 0.94 | ≈ 0.96 | Muted backgrounds, badges, tags |
| 200 | ≈ 0.90 | ≈ 0.93 | Borders, dividers |
| 300 | ≈ 0.83 | ≈ 0.88 | Disabled elements, placeholder text |
| 400 | ≈ 0.72 | ≈ 0.83 | Secondary icons, decorative |
| 500 | ≈ 0.63 | ≈ 0.77 | Mid-tone — use with dark text for UI |
| 600 | ≈ 0.53 | ≈ 0.67 | **Default brand/status bg** — white text passes WCAG AA (UI) |
| 700 | ≈ 0.46 | ≈ 0.55 | Hover state, colored text on white background |
| 800 | ≈ 0.39 | ≈ 0.47 | Deep accents, high-contrast text |
| 900 | ≈ 0.33 | ≈ 0.41 | Near-dark, very high contrast |
| 950 | ≈ 0.22 | ≈ 0.28 | Darkest tint, almost black |

> **Note OKLCH** — L est perceptuellement uniforme, mais les hues intrinsèquement brillantes (amber, yellow, lime) ont des valeurs L naturellement plus élevées aux steps 400–700. C'est un comportement attendu, pas une erreur de calibration. Gray va dans l'autre sens (chroma ≈ 0, pas de boost de brillance, L légèrement plus bas). La colonne "L avg" est représentative des hues chromatiques froides (blue, red, green, violet…).

### Semantic color tokens

Semantic tokens are named by **purpose**, not by value. They reference primitives via `var()`.

#### Brand & accent

```css
--color-brand:        /* primary brand color (button bg, active states…) */
--color-brand-muted:  /* tinted background for brand areas */
--color-brand-hover:  /* hover state of brand */
--color-brand-strong: /* darkest brand shade */

--color-accent:       /* = brand by default; override independently if needed */
```

The default brand is **sienna** — a warm brick-red. Override it in your project:

```css
@layer config {
  :root {
    --color-brand:        var(--color-violet-600);
    --color-brand-muted:  var(--color-violet-100);
    --color-brand-hover:  var(--color-violet-700);
    --color-brand-strong: var(--color-violet-900);
  }
}
```

#### Backgrounds

| Token | Default | Usage |
|-------|---------|-------|
| `--color-background` | white | Page background |
| `--color-background-muted` | gray-100 | Subtle section backgrounds |
| `--color-background-surface` | = `--color-background` | Card / panel backgrounds |
| `--color-background-media` | gray-200 | Image placeholders, skeleton loaders |
| `--color-background-accent` | = `--color-accent` | Highlighted sections |

#### Text

| Token | Default | Usage |
|-------|---------|-------|
| `--color-text` | gray-900 | Body text |
| `--color-text-muted` | gray-500 | Secondary, captions |
| `--color-text-disabled` | gray-300 | Disabled UI |
| `--color-heading` | black | Headings |
| `--color-link` | = `--color-text` | Default link color |
| `--color-link-hover` | = `--color-accent` | Link hover |
| `--color-active` | = `--color-accent` | Active nav item |
| `--color-credit` | = `--color-text-muted` | Bylines, captions |

#### Text on colored backgrounds

Used to ensure contrast when a color is the background:

```css
--color-text-on-brand      /* white */
--color-text-on-accent     /* white */
--color-text-on-dark       /* white */
--color-text-on-light      /* gray-900 */
--color-text-on-surface    /* = --color-text */
--color-text-on-danger     /* white */
--color-text-on-info       /* white */
--color-text-on-success    /* white */
--color-text-on-warning    /* gray-900 — amber is bright, dark text required */
```

#### Status / semantic variants

| Token | Primitive | Notes |
|-------|-----------|-------|
| `--color-danger` | red-600 | Errors, destructive actions |
| `--color-success` | green-600 | Confirmations |
| `--color-warning` | amber-500 | Warnings — use with `--color-text-on-warning` |
| `--color-info` | blue-600 | Informational |
| `--color-secondary` | gray-500 | De-emphasized UI |
| `--color-dark` | gray-900 | Dark surfaces |
| `--color-light` | gray-200 | Light surfaces |

Each variant has `-muted` (tinted bg) and `-strong` (hover / emphasis) companions:

```css
--color-danger-muted:   var(--color-red-100);
--color-danger-strong:  var(--color-red-800);  /* used for hover */
```

### Accessibility (WCAG)

| Ratio | Requirement |
|-------|-------------|
| **4.5 : 1** | Normal text (< 18px / non-bold < 14px) — WCAG AA |
| **3 : 1** | Large text, UI components (buttons, inputs, icons) — WCAG AA |
| **7 : 1** | Any text — WCAG AAA |

**Rules of thumb for this palette:**

- **White text on a colored background** — use step **600 or darker**. Steps 500 and below are typically too light (3–3.5 : 1 ratio).
- **Colored text on white** — use step **700 or darker** for normal text.
- **Warning (amber-500)** — always pair with `--color-text-on-warning` (gray-900). Never white text on amber-500.
- **Decorative only** — any step is fine when color carries no information (icons, borders, illustrations).

### Adding a custom hue

Add a new primitive scale in `tokens/primitive/color.css` following the existing pattern:

```css
/* ── Coral — H ≈ 35° ──────────────────────────────────────────────── */
--color-coral-50:  oklch(0.975 0.014 35.0);
--color-coral-100: oklch(0.948 0.032 35.0);
/* … 11 steps … */
--color-coral-950: oklch(0.225 0.078 35.0);
```

Then reference it in `tokens/semantic/color.css` or your project's `@layer config` override.

---

## CSS cascade layers

All tokens are declared inside `@layer config`, the lowest-priority layer in the stack:

```css
@layer config, base, layouts, vendors, components;
```

This means any project can **override any token** in its own `@layer config` block, simply by importing after this package:

```css
@import '@uncinq/design-tokens/tokens/index.css'; /* package defaults */

/* your project overrides — same layer, wins by order */
@layer config {
  :root {
    --color-brand: #0070f3;
    --font-family-sans: 'Inter', system-ui, sans-serif;
  }
}
```

→ MDN: [Using CSS cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)

---

## Installation

```bash
npm install @uncinq/design-tokens
# or
yarn add @uncinq/design-tokens
```

### Usage — CSS import

```css
/* everything */
@import '@uncinq/design-tokens';

/* or by layer */
@import '@uncinq/design-tokens/tokens/primitive.css';
@import '@uncinq/design-tokens/tokens/semantic.css';

/* or file by file */
@import '@uncinq/design-tokens/tokens/primitive/color.css';
@import '@uncinq/design-tokens/tokens/semantic/color.css';
```

### Usage — CDN (no build step)

```html
<link rel="stylesheet" href="https://unpkg.com/@uncinq/design-tokens/tokens/index.css">
```

---

## File structure

```
tokens/
  index.css               ← imports all layers in order
  primitive/
    color.css             ← color palette (Tailwind v3 — amber, blue, gray, green…)
    font.css              ← font families, weights, line-heights, text-decoration
    opacity.css           ← opacity scale (0 → 1)
    shadow.css            ← box-shadow scale
    size.css              ← rem scale (--size-1 → --size-1920)
  semantic/
    border.css            ← border styles and widths
    color.css             ← purposeful color aliases (--color-brand, --color-background…)
    fluid.css             ← responsive clamp() scales (--fluid-text-*, --fluid-spacing-*)
    focus.css             ← focus ring tokens (color, style, width, offset)
    form.css              ← form control tokens (input, label, checkbox, switch…)
    grid.css              ← columns, gap, flex fractions
    motion.css            ← duration, easing (standard + expressive + spring), transitions
    opacity.css           ← purposeful opacity aliases (disabled, overlay)
    radius.css            ← border-radius scale + purposeful aliases
    ratio.css             ← aspect-ratio values (16/9, 4/3…)
    size.css              ← T-shirt scale + breakpoint aliases
    spacing.css           ← spacing scale + purposeful aliases
    typography.css        ← font-size scale (fixed + fluid), heading sizes, max-widths
    z-index.css           ← stacking order (below → tooltip)
```

---

## References

- [DTCG — format and concepts](docs/dtcg.md)
- [DTCG specification](https://tr.designtokens.org/format/) — W3C Community Group draft
- [Style Dictionary](https://amzn.github.io/style-dictionary/) — token build pipeline (JSON → CSS/SCSS/JS)
- [MDN: CSS cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
