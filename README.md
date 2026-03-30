# @uncinq/design-tokens

> Framework-agnostic design tokens for Un Cinq projects — Hugo, Symfony, Shopify, or any CSS environment.

## What are design tokens?

Design tokens are the atomic decisions of a design system: colors, spacing, typography, motion. Instead of hardcoding `#ae003f` or `1rem` throughout your codebase, you name the decision — `--color-brand`, `--spacing-md` — and reference that name everywhere.

## DTCG — Design Token Community Group

The [W3C Design Token Community Group (DTCG)](https://www.w3.org/community/design-tokens/) defines a standard interchange format for design tokens, so they can travel between tools (Figma, code, documentation) without loss of meaning.

### The DTCG format

The [DTCG spec](https://tr.designtokens.org/format/) defines tokens as JSON objects with reserved `$`-prefixed keys:

```json
{
  "color-brand": {
    "$value": "#ae003f",
    "$type": "color",
    "$description": "Primary brand color — used for CTAs and highlights."
  }
}
```

| Key | Required | Description |
| --- | --- | --- |
| `$value` | ✅ | The token's value |
| `$type` | recommended | The token type (see below) |
| `$description` | optional | Human-readable documentation |
| `$extensions` | optional | Vendor-specific metadata (e.g. Figma, Tokens Studio) |

### DTCG token types

| Type | Example value | CSS usage |
| --- | --- | --- |
| `color` | `#ae003f`, `hsl(...)` | `color`, `background-color` |
| `dimension` | `1rem`, `4px` | `width`, `padding`, `font-size` |
| `fontFamily` | `"system-ui, sans-serif"` | `font-family` |
| `fontWeight` | `700` | `font-weight` |
| `duration` | `300ms` | `transition-duration` |
| `cubicBezier` | `[0.165, 0.84, 0.44, 1]` | `animation-timing-function` |
| `number` | `1.5` | `line-height`, `opacity` |
| `shadow` | `{offsetX, offsetY, blur, spread, color}` | `box-shadow` |

→ Full type list: [tr.designtokens.org/format/#types](https://tr.designtokens.org/format/#types)

### Token groups

Tokens are organized in nested objects. Groups share a `$type` by inheritance:

```json
{
  "color": {
    "$type": "color",
    "gray": {
      "100": { "$value": "#f8f9fa" },
      "900": { "$value": "#111827" }
    }
  }
}
```

→ [tr.designtokens.org/format/#groups](https://tr.designtokens.org/format/#groups)

### References (aliases)

Tokens can reference other tokens using `{dotted.path}` syntax:

```json
{
  "color-primary": {
    "$value": "{color.brand}",
    "$type": "color"
  }
}
```

This is the key mechanism behind the **primitive → semantic → component** hierarchy.

→ [tr.designtokens.org/format/#alias](https://tr.designtokens.org/format/#alias)

---

## Token architecture

This package follows the three-layer model, which maps directly to DTCG's alias mechanism:

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
- **Semantic tokens never contain raw values** — they always reference a primitive via `var()`
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
| `span` | Grid column spans | `--span-half`, `--span-third` |
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
@import '@uncinq/design-tokens/tokens/index.css';

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
    color.css             ← color palette (gray, brand, semantic palettes)
    font.css              ← font families, weights, line-heights, text-decoration
    shadow.css            ← box-shadow scale
    size.css              ← rem scale (--size-1 → --size-1920)
  semantic/
    border.css            ← border styles and widths
    color.css             ← purposeful color aliases (--color-brand, --color-bg…)
    form.css              ← form control tokens (input, label, checkbox…)
    grid.css              ← flex fractions and grid span helpers
    motion.css            ← duration, easing, transition shorthands
    radius.css            ← border-radius scale + purposeful aliases
    ratio.css             ← aspect-ratio values (16/9, 4/3…)
    size.css              ← T-shirt scale + breakpoint aliases
    spacing.css           ← spacing scale + purposeful aliases
    typography.css        ← font-size scale, heading sizes, line-heights, max-widths
```

---

## References

- [DTCG specification](https://tr.designtokens.org/format/) — W3C Community Group draft
- [DTCG GitHub](https://github.com/design-tokens/community-group) — issues, discussion
- [Style Dictionary](https://amzn.github.io/style-dictionary/) — token build pipeline (JSON → CSS/SCSS/JS)
- [MDN: CSS cascade layers](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics/Cascade_layers)
