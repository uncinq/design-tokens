---
isIndex: false
title: Dark mode
description: How the dark theme overlays 13 semantic tokens, how a page opts out, and why there is no forced-dark selector.
weight: 4
icon: moon-stars
---

The dark theme is an **overlay**, not a second palette. `tokens/themes/dark.json` re-declares 13 semantic tokens and nothing else. Every other token, including the whole primitive palette, is shared.

That is the point of the semantic layer: if a component reads `--color-background` rather than `--color-white`, it needs no dark-mode branch of its own.

## What it overrides

| Token | Light | Dark |
| --- | --- | --- |
| `--color-background` | white | gray-950 |
| `--color-background-disabled` | gray-100 | gray-900 |
| `--color-background-media` | gray-200 | gray-800 |
| `--color-background-muted` | gray-100 | gray-900 |
| `--color-background-muted-hover` | gray-200 | gray-800 |
| `--color-border` | gray-200 | gray-800 |
| `--color-heading` | black | white |
| `--color-shadow` | black | white |
| `--color-text` | gray-900 | gray-200 |
| `--color-text-disabled` | gray-300 | gray-600 |
| `--color-text-hover` | gray-700 | gray-300 |
| `--color-text-muted` | derived from `--color-text` | gray-400 |
| `--color-text-on-muted` | gray-900 | gray-200 |
| `--form-color-background` | white | gray-900 |

Two of these do more work than they look. `--color-shadow` flipping to white inverts the entire shadow system in one line, because `--color-shadow-light`, `-medium` and `-strong` all derive from it with relative color syntax. And `--color-background-surface` is not in the list at all, because it aliases `--color-background` and follows for free.

## The generated selector

```css
@layer tokens {
  @media (prefers-color-scheme: dark) {
    :root:not([data-color-scheme="light"]) {
      --color-background: var(--color-gray-950);
      /* ... */
    }
  }
}
```

Read that selector carefully, because it encodes two deliberate decisions.

**The dark scheme follows the operating system.** It activates under `prefers-color-scheme: dark` and nowhere else.

**There is no forced-dark selector.** No `[data-color-scheme="dark"]` exists, so the package will never turn a page dark on a light OS. Only the opposite is offered: `data-color-scheme="light"` on `<html>` opts a page out of dark mode even when the OS asks for it.

```html
<html data-color-scheme="light">
```

If your project needs a three-way toggle with a forced-dark option, add the missing selector in your own `@layer tokens` block after the import. The package deliberately stops short of that, because a forced-dark selector has to be paired with UI and persistence that belong to the project, not to a token package.

## Importing it

The theme ships with the full bundle:

```css
@import '@uncinq/design-tokens';       /* primitive + semantic + dark */
```

Importing a group on its own leaves it out:

```css
@import '@uncinq/design-tokens/css/primitive.css';
@import '@uncinq/design-tokens/css/semantic.css';
/* no dark theme here */
```

Add it back explicitly when you need it:

```css
@import '@uncinq/design-tokens/css/themes/dark.css';
```

## How the build resolves it

The dark pass is a second Style Dictionary build, not a post-processing step. It sources the base tokens **and** `themes/dark.json` together, so references such as `{color.gray.950}` resolve normally, then filters the output down to the dark file alone.

Without that, a dark token referencing a primitive would emit a broken reference. See [Style Dictionary](../style-dictionary/) for the config.

## Adding another theme

Drop a JSON file in `tokens/themes/`, overriding only the tokens that change, then register its selector in `style-dictionary.config.js`:

```js
'themes/dark': [{
  selector: ':root:not([data-color-scheme="light"])',
  media: '(prefers-color-scheme: dark)',
}]
```

A theme with no `media` entry generates a plain selector, which is what a forced, user-chosen theme needs. Keep the overlay small: a theme that re-declares more than a couple of dozen tokens is usually a sign that a component is reading primitives directly instead of semantic tokens.
