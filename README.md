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

### Layer 3 — Component (not in this package)

Scoped to a specific component. Lives in each project's own design system.

```css
/* in hugolify-theme-design-system, not here */
--alert-border-radius: var(--radius-none);
--button-padding: var(--spacing-control);
```

---

## Naming convention

All tokens follow the pattern: `--{category}-{subcategory?}-{variant}-{state?}`

```
--{category}                     --color
  -{subcategory}                 --color-text
    -{variant}                   --color-text-muted
      -{state}                   --color-text-disabled
```

### Rules

- **Lowercase kebab-case** — always
- **No component names** in primitive or semantic tokens (`--button-*` belongs in component tokens, not here)
- **Semantic tokens are named by intent** — they may reference a primitive via `var()` or carry a raw value when the value itself has design intent (e.g. `--z-index-modal: 400`, `--radius-pill: 9999px`)
- **States at the end** — `-hover`, `-focus`, `-active`, `-disabled`, `-checked`
- **`color-*` prefix for all color values** — even when the CSS property is `background-color`, `border-color`, etc.

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
| `color` | All color values | `--color-brand`, `--color-bg-muted`, `--color-text-on-dark` |
| `font-family` | Typefaces | `--font-family-sans`, `--font-family-heading` |
| `font-size` | Text sizes | `--font-size-sm`, `--font-size-heading-01` |
| `font-weight` | Weight values | `--font-weight-bold`, `--font-weight-heading` |
| `line-height` | Line heights | `--line-height-tight`, `--line-height-heading` |
| `letter-spacing` | Tracking | `--letter-spacing-large` |
| `text-decoration` | Decoration props | `--text-decoration-underline`, `--text-decoration-offset` |
| `spacing` | Margin / padding | `--spacing-md`, `--spacing-section` |
| `size` | Width / height | `--size-16`, `--size-tablet` |
| `radius` | Border radius | `--radius-md`, `--radius-pill` |
| `border` | Border style/width | `--border-width-normal`, `--border-style-solid` |
| `shadow` | Box shadows | `--shadow-md`, `--shadow-center-sm` |
| `duration` | Animation timing | `--duration-fast` |
| `easing` | Timing functions | `--easing-bounce` |
| `transition` | Shorthand transitions | `--transition-normal`, `--transition-color` |
| `ratio` | Aspect ratios | `--ratio-16-9` |
| `flex` | Flex-basis fractions | `--flex-half`, `--flex-third` |
| `fluid` | Responsive clamp() scale | `--fluid-sm`, `--fluid-lg` |
| `focus` | Focus ring tokens | `--focus-color`, `--focus-outline-width` |
| `opacity` | Opacity values | `--opacity-disabled`, `--opacity-overlay` |
| `span` | Grid column spans | `--span-6`, `--span-4` |
| `z-index` | Stacking order | `--z-index-modal`, `--z-index-dropdown` |
| `max-width` | Readability caps | `--max-width-paragraph` |

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
    color.css             ← purposeful color aliases (--color-brand, --color-bg…)
    fluid.css             ← responsive clamp() scale (--fluid-2xs → --fluid-2xl)
    focus.css             ← focus ring tokens (color, style, width, offset)
    form.css              ← form control tokens (input, label, checkbox, switch…)
    grid.css              ← columns, gap, flex fractions, integer spans (--span-1 → --span-24)
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
