---
isIndex: false
title: Colors
description: The OKLCH color space, the 19-hue primitive palette, the semantic color roles, and WCAG guidance for using them.
weight: 2
---

## Color space, OKLCH

Every primitive color is defined in OKLCH.

| Channel | Range | Meaning |
| --- | --- | --- |
| `L` | 0 to 1 | Perceptual lightness, 0 is black and 1 is white |
| `C` | 0 to about 0.4 | Chroma, or colorfulness, where 0 is gray |
| `H` | 0 to 360 degrees | Hue angle |

Why OKLCH rather than hex or HSL:

- **Perceptually uniform.** Equal steps in `L` produce equal perceived brightness differences, whatever the hue. HSL does not guarantee this: `hsl(60, 100%, 50%)` yellow looks far brighter than `hsl(240, 100%, 50%)` blue at the same stated lightness.
- **Predictable contrast.** You can reason about WCAG contrast by comparing `L` values, without converting to relative luminance first.
- **Better interpolation.** Gradients and animations between two OKLCH colors do not pass through muddy grays.
- **Composable.** The relative color syntax, `oklch(from var(--color-text) l c h / 0.6)`, lets a token derive from another without duplicating its value. Several semantic tokens in this package rely on it.

Browser support is Chrome 111, Firefox 113 and Safari 15.4 and above. No sRGB fallback is generated, so every value ships as `oklch()` and anything older needs a fallback of its own.

## Primitive palette

19 hues, 11 steps each (50 to 950), plus flat `--color-black` and `--color-white`. These are raw values with no opinion about usage.

| Hue | H angle | Character |
| --- | --- | --- |
| `amber` | 70 | Golden yellow-orange |
| `blue` | 260 | Classic blue |
| `cyan` | 215 | Bright cyan |
| `emerald` | 162 | Deep blue-green |
| `fuchsia` | 322 | Vivid magenta |
| `gray` | 264 | Cool neutral, chroma about 0.02 |
| `green` | 150 | Lush green |
| `indigo` | 277 | Blue-violet |
| `lime` | 131 | Electric yellow-green |
| `orange` | 48 | Vivid orange |
| `pink` | 354 | Bright pink |
| `purple` | 304 | Rich purple |
| `red` | 25 | Classic red |
| `rose` | 16 | Pink-red |
| `sienna` | 24 | Brick-red, the default brand |
| `sky` | 237 | Soft sky blue |
| `teal` | 183 | Blue-green |
| `violet` | 293 | Modern violet |
| `yellow` | 86 | Pure yellow |

### Step guide

`L` values below are measured from the actual palette, not estimated.

| Step | L, cool hues | L, amber / yellow / lime | L, gray | Typical use |
| --- | --- | --- | --- | --- |
| 50 | 0.97 | 0.99 | 0.98 | Tinted page backgrounds, hover on white |
| 100 | 0.95 | 0.97 | 0.97 | Muted backgrounds, badges, tags |
| 200 | 0.90 | 0.94 | 0.93 | Borders, dividers |
| 300 | 0.83 | 0.89 | 0.87 | Disabled elements, placeholder text |
| 400 | 0.73 | 0.84 | 0.71 | Secondary icons, decorative |
| 500 | 0.66 | 0.78 | 0.56 | Mid-tone, pair with dark text |
| 600 | 0.58 | 0.67 | 0.44 | **Default brand and status background.** White text passes WCAG AA for UI |
| 700 | 0.50 | 0.55 | 0.37 | Hover state, colored text on white |
| 800 | 0.44 | 0.47 | 0.28 | Deep accents, high-contrast text |
| 900 | 0.39 | 0.41 | 0.21 | Near-dark, very high contrast |
| 950 | 0.27 | 0.28 | 0.14 | Darkest tint, almost black |

Two things to read out of that table. Intrinsically bright hues (amber, yellow, lime) carry noticeably higher `L` at steps 400 to 700; that is expected behaviour of a perceptual space, not a calibration error. Gray goes the other way and runs darker than the chromatic hues from step 400 down, because it has almost no chroma to contribute to perceived brightness.

## Semantic color tokens

Semantic tokens are named by purpose and reference primitives through `var()`.

### Brand and accent

```css
--color-brand         /* primary brand color: button background, active states */
--color-brand-hover   /* hover state */
--color-brand-muted   /* tinted background for brand areas */
--color-brand-strong  /* darkest brand shade */

--color-accent        /* equals brand by default, override independently if needed */
```

The default brand is **sienna**, a warm brick-red. `--color-accent` and its variants alias brand, so overriding brand alone moves both.

```css
@layer tokens {
  :root {
    --color-brand:        var(--color-violet-600);
    --color-brand-hover:  var(--color-violet-700);
    --color-brand-muted:  var(--color-violet-100);
    --color-brand-strong: var(--color-violet-900);
  }
}
```

### Backgrounds

| Token | Default | Usage |
| --- | --- | --- |
| `--color-background` | white | Page background |
| `--color-background-surface` | equals `--color-background` | Card and panel backgrounds |
| `--color-background-muted` | gray-100 | Subtle section backgrounds |
| `--color-background-muted-hover` | gray-200 | Hover on a muted surface |
| `--color-background-media` | gray-200 | Image placeholders, skeletons |
| `--color-background-disabled` | gray-100 | Disabled controls |
| `--color-background-accent` | equals `--color-accent` | Highlighted sections |

### Text

| Token | Default | Usage |
| --- | --- | --- |
| `--color-text` | gray-900 | Body text |
| `--color-text-hover` | gray-700 | Text hover |
| `--color-text-muted` | `--color-text` at `--opacity-muted` | Secondary text, captions |
| `--color-text-disabled` | gray-300 | Disabled UI |
| `--color-heading` | black | Headings |
| `--color-link` | equals `--color-text` | Default link color |
| `--color-link-hover` | equals `--color-accent` | Link hover |
| `--color-link-active` | equals `--color-active` | Current link |
| `--color-credit` | equals `--color-text-muted` | Bylines, captions |

`--color-text-muted` is derived rather than aliased: `oklch(from var(--color-text) l c h / var(--opacity-muted))`. It therefore follows any override of `--color-text` automatically, which is why it is not simply an alias of gray-500. The dark theme is the one place that overrides it outright, to gray-400, because a transparent text color over a dark background does not mute the same way it does over a light one.

### Text on colored backgrounds

These exist so that contrast holds when a color becomes the background.

```css
--color-text-on-brand      /* white */
--color-text-on-accent     /* white */
--color-text-on-dark       /* white */
--color-text-on-black      /* white */
--color-text-on-light      /* gray-900 */
--color-text-on-white      /* black */
--color-text-on-surface    /* equals --color-text */
--color-text-on-muted      /* gray-900 */
--color-text-on-neutral    /* white */
--color-text-on-danger     /* white */
--color-text-on-info       /* white */
--color-text-on-success    /* white */
--color-text-on-highlight  /* gray-900 */
--color-text-on-warning    /* gray-900, amber is bright so dark text is required */
```

### Status and surface variants

| Token | Primitive | Notes |
| --- | --- | --- |
| `--color-danger` | red-600 | Errors, destructive actions |
| `--color-success` | green-600 | Confirmations |
| `--color-warning` | amber-500 | Warnings, pair with `--color-text-on-warning` |
| `--color-info` | blue-600 | Informational |
| `--color-highlight` | yellow-100 | Marked or highlighted text |
| `--color-neutral` | gray-500 | Neutral emphasis |
| `--color-dark` | gray-900 | Dark surfaces |
| `--color-light` | gray-200 | Light surfaces |

Each of these carries a `-hover`, `-muted` and `-strong` companion:

```css
--color-danger:        var(--color-red-600);
--color-danger-hover:  var(--color-red-700);
--color-danger-muted:  var(--color-red-100);
--color-danger-strong: var(--color-red-800);
```

### Derived utility colors

Four tokens use relative color syntax rather than an alias, so they track their base automatically:

| Token | Derived from |
| --- | --- |
| `--color-backdrop` | `--color-black` at `--opacity-backdrop` |
| `--color-shadow-light` | `--color-shadow` at `--opacity-shadow` |
| `--color-shadow-medium` | `--color-shadow` at `--opacity-backdrop` |
| `--color-shadow-strong` | `--color-shadow` at `--opacity-overlay` |

`--color-shadow` is one of the tokens the dark theme flips, from black to white. Because the three shadow variants derive from it, the whole shadow system inverts with a single override. See [Dark mode](../dark-mode/).

## Accessibility

| Ratio | Requirement |
| --- | --- |
| 4.5 : 1 | Normal text, under 18px, or non-bold under 14px. WCAG AA |
| 3 : 1 | Large text and UI components such as buttons, inputs, icons. WCAG AA |
| 7 : 1 | Any text. WCAG AAA |

Rules of thumb for this palette:

- **White text on a colored background** needs step **600 or darker**. Step 500 and below typically land around 3 to 3.5 : 1, which fails for normal text.
- **Colored text on white** needs step **700 or darker** for normal text.
- **Warning** is the exception that proves the rule. `--color-warning` is amber-500, whose `L` is about 0.78, so it must be paired with `--color-text-on-warning` (gray-900). Never put white text on it.
- **Decorative use** is unconstrained. Any step is fine when color carries no information, as in borders, illustrations or icons that duplicate a visible label.

These are starting points, not a substitute for measuring. Contrast depends on both colors, and an override of `--color-brand` invalidates the assumptions above.

## Adding a custom hue

Add a primitive scale in `tokens/primitive/color.json`, one DTCG color object per step:

```json
{
  "color": {
    "coral": {
      "50":  { "$value": { "colorSpace": "oklch", "components": [0.975, 0.014, 35.0] }, "$type": "color" },
      "100": { "$value": { "colorSpace": "oklch", "components": [0.948, 0.032, 35.0] }, "$type": "color" },
      "950": { "$value": { "colorSpace": "oklch", "components": [0.225, 0.078, 35.0] }, "$type": "color" }
    }
  }
}
```

Run `npm run build`, then reference the generated `--color-coral-*` from `tokens/semantic/color.json`, or from your own project's `@layer tokens` override. Keeping `H` constant across the steps and varying `L` and `C` is what makes a scale read as one hue.
