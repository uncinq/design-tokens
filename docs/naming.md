---
isIndex: false
title: Naming
description: The naming grammar for semantic and component tokens, the rules that keep it consistent, and the scales in use.
weight: 1
icon: tag
---

A token name is an API. Once a project references `--color-text-muted`, renaming it is a breaking change, so the grammar below is worth following closely.

## Semantic tokens

```
--{category}-{subcategory?}-{variant?}-{state?}
```

| Pattern | Example |
| --- | --- |
| `--{category}` | `--color` |
| `--{category}-{subcategory}` | `--color-text` |
| `--{category}-{subcategory}-{variant}` | `--color-text-muted` |
| `--{category}-{subcategory}-{state}` | `--color-text-disabled` |

## Component tokens

```
--{component}-{property}-{sub-property?}-{state?}
```

The property mirrors the CSS property name, so the token reads the same way as the declaration it controls. Colors are the exception: `color` leads and the role follows, for the reason given in the rules below.

| Pattern | Example |
| --- | --- |
| `--{component}` | `--btn` |
| `--{component}-{property}` | `--btn-padding-inline` |
| `--{component}-{property}-{sub-property}` | `--btn-color-text-decoration` |
| `--{component}-{property}-{state}` | `--btn-color-background-hover` |

## Rules

**Lowercase kebab-case**, always.

**No component names in primitive or semantic tokens.** `--button-*` belongs in [@uncinq/component-tokens](https://github.com/uncinq/component-tokens), not here. A semantic token that names a component has stopped being semantic.

**Semantic tokens are named by intent.** They usually reference a primitive through `var()`, but they may carry a raw value when the value itself is the design decision, such as `--z-index-modal: 400` or `--radius-pill: 9999px`.

**`color-[role]` for every color token.** `color` is the category prefix and the UI role follows: `color-background`, `color-border`, `color-text`, `color-accent`, `color-placeholder`. This groups all color tokens alphabetically under `color-*`, and it makes the component token mirror the global one, `--color-background` becoming `--btn-color-background`. `background` is never abbreviated, so `color-background` and never `color-bg`.

| Token | Role | CSS property it drives |
| --- | --- | --- |
| `--btn-color-background` | background | `background-color` |
| `--btn-color-border` | border | `border-color` |
| `--btn-color-text` | text | `color` |
| `--btn-color-text-decoration` | text-decoration | `text-decoration-color` |
| `--form-color-accent` | accent | `color` |
| `--input-color-placeholder` | placeholder | `color` |

**States go last**: `-hover`, `-focus`, `-active`, `-disabled`, `-checked`.

**Alphabetical order within a file**, grouped with a comment once a file has many entries.

```css
/* Brand */
--color-brand:       var(--color-sienna-600);
--color-brand-hover: var(--color-sienna-700);

/* Text */
--color-text:        var(--color-gray-900);
--color-text-muted:  var(--color-gray-500);
```

## The `default` convention

In the JSON source, a state lives in a nested key and `default` is the unstated one. The build strips it from the generated name, so `color.brand.default` becomes `--color-brand` while `color.brand.hover` becomes `--color-brand-hover`.

```json
"brand": {
  "default": { "$value": "{color.sienna.600}", "$type": "color" },
  "hover":   { "$value": "{color.sienna.700}", "$type": "color" }
}
```

This is what lets `--color-brand` and `--color-brand-hover` sit in the same group without one of them being named `--color-brand-default`. See [DTCG format](../dtcg/) for the full set of authoring conventions.

## Scales

| Use case | Scale | Example |
| --- | --- | --- |
| Color palettes | Numeric, 50 to 950 | `--color-gray-500` |
| Heading levels | Zero-padded, 01 to 06 | `--font-size-heading-01` |
| Layout and spacing | T-shirt, `2xs xs sm md lg xl 2xl` | `--spacing-md` |
| Radius, shadow, size | T-shirt | `--radius-sm` |
| Purposeful aliases | Named | `--radius-control`, `--radius-pill` |

The zero-padding on heading levels is there so that `01` through `06` sort correctly as text, which matters because the generated CSS is ordered alphabetically.

## Category reference

| Category | Covers | Example |
| --- | --- | --- |
| `color` | All color values | `--color-brand`, `--color-text-on-dark` |
| `font-family` | Typefaces | `--font-family-heading` |
| `font-size` | Text sizes | `--font-size-sm`, `--font-size-heading-01` |
| `font-size-fluid` | Responsive fluid type scale | `--font-size-fluid-xl` |
| `font-weight` | Weight values | `--font-weight-bold` |
| `line-height` | Line heights | `--line-height-heading` |
| `letter-spacing` | Tracking | `--letter-spacing-md` |
| `text-decoration` | Decoration properties | `--text-decoration-offset` |
| `spacing` | Margin and padding | `--spacing-md`, `--spacing-section` |
| `spacing-fluid` | Responsive fluid spacing scale | `--spacing-fluid-lg` |
| `size` | Width and height | `--size-16`, `--size-tablet` |
| `max-width` | Readability caps | `--max-width-paragraph` |
| `radius` | Border radius | `--radius-md`, `--radius-pill` |
| `border` | Border style and width | `--border-width-sm` |
| `shadow` | Box shadows | `--shadow-md` |
| `blur` | Blur values | `--blur-md` |
| `gradient` | Overlay gradients | `--gradient-darken-color-from` |
| `opacity` | Opacity values | `--opacity-disabled` |
| `duration` | Animation timing | `--duration-fast` |
| `easing` | Timing functions | `--easing-out-expo` |
| `transition` | Shorthand transitions | `--transition-normal` |
| `ratio` | Aspect ratios | `--ratio-video` |
| `focus` | Focus ring tokens | `--focus-outline-width` |
| `grid` | Column counts, gaps, fractions | `--columns-tablet`, `--gap` |
| `icon` | SVG icons as data URIs | `--icon-arrow` |
| `z-index` | Stacking order | `--z-index-modal` |

For the actual values behind each of these, see the [Reference](../reference/), which is generated from the JSON sources and cannot drift.
