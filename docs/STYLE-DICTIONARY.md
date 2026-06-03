# Style Dictionary — build pipeline

[Style Dictionary v5](https://styledictionary.com/) transforms the DTCG JSON token files into CSS custom properties.

## Run the build

```bash
npm run build
```

Output is written to `dist/css/`. One CSS file is generated per JSON source file, preserving the same directory structure:

```
tokens/primitive/color.json   →   dist/css/primitive/color.css
tokens/semantic/color.json    →   dist/css/semantic/color.css
```

---

## Config — `style-dictionary.config.js`

The config is a single ES module. It registers a custom name transform and a custom format, then maps every JSON file to a CSS output.

### Name transform — `name/kebab/strip-default`

Converts the token path to a kebab-case CSS custom property name, dropping any `default` segment:

```
color.background.default   →   --color-background
color.text.muted           →   --color-text-muted
```

### Format — `css/layer-tokens`

All tokens are wrapped in `@layer tokens { :root { … } }`. This is a low-priority layer in the Un Cinq stack (order: `reset, tokens, base, layouts, vendors, components`), so any project can override any token by importing after this package inside its own `@layer tokens` block.

References are preserved as `var()` — tokens are **not** resolved to their final values:

```css
/* output */
--color-text: var(--color-gray-900);   /* not oklch(0.208 0.006 264.542) */
```

This is done by reading `token.original.$value` and replacing every `{path.to.token}` reference with `var(--path-to-token)`. References embedded in a string value are also handled:

```json
{ "$value": "{size.8} {size.12}" }
```

```css
--file-button-padding: var(--size-8) var(--size-12);
```

### Composite tokens

Tokens whose `$value` is an object or an array of objects (e.g. `shadow`) are serialized as a space-separated CSS value. References inside the composite are converted to `var()`.

**Property order matters** — list properties in the order CSS expects them. For `box-shadow`:

```json
{
  "shadow": {
    "sm": {
      "$type": "shadow",
      "$value": [
        {
          "offsetX": "0",
          "offsetY": "1px",
          "blur": "2px",
          "spread": "0",
          "color": "{color.shadow.normal}",
          "inset": false
        }
      ]
    }
  }
}
```

```css
--shadow-sm: 0 1px 2px 0 var(--color-shadow-normal);
```

`inset` is always treated as a boolean prefix (`inset` or nothing), not a positional value.

---

## Dark mode — `themes/dark.json`

Dark mode is a **separate token set**, `tokens/themes/dark.json` — **not** declared inline on tokens (there is no `$mods`/`$modes` extension).

The model is **default + override**:

- The `semantic` layer carries the **default (light)** values, at their natural place (`semantic/color.json`, `semantic/form.json`). There is **no** `themes/light.json` — light is the baseline, not a mode you switch into.
- `themes/dark.json` holds **only the tokens that differ** in dark mode (background, text, heading, shadow, border, form background). Everything mode-invariant (brand, accent, status, …) is inherited automatically through `var()`.

This mirrors the DTCG **Resolver** philosophy (a base set + an overlay holding only the differences), so it stays forward-compatible as the Resolver spec stabilises.

### Generated output

The build emits `dist/css/themes/dark.css` with a single rule, inside `@layer tokens`:

```css
@layer tokens {
  @media (prefers-color-scheme: dark) {
    :root:not([data-color-scheme="light"]) {
      --color-background: var(--color-gray-950);
      /* … */
    }
  }
}
```

The light defaults stay in `dist/css/semantic/*.css` on `:root`. The dark file is purely additive — a light-only (mono-mode) site never needs to load it.

### Activation matrix

Dark mode follows the OS preference. The only attribute that does anything is `data-color-scheme="light"`, which **forces light** even when the OS prefers dark. Forcing dark against a light OS is intentionally **not** supported (there is no `[data-color-scheme="dark"]` rule).

| `data-color-scheme` on `<html>` | OS preference | Result | Why |
| --- | --- | --- | --- |
| *(none)* | light | **light** | `:root` defaults; the media query is inactive |
| *(none)* | dark | **dark** | the media rule matches `:root` (not forced light) |
| `light` | dark | **light** | `:not([data-color-scheme="light"])` excludes it → `:root` defaults |
| `light` | light | **light** | `:root` defaults; the media query is inactive |
| *(any other)* | dark | **dark** | the media rule still matches — only `light` opts out |

> **Note** — `color-scheme: dark` is intentionally absent from the generated block. The `color-scheme` property is managed at the HTML level by the consuming application (e.g. via `<meta name="color-scheme">`), not by the token layer.

### Rules

- Only colour tokens that actually change between modes belong in `themes/dark.json`; everything mode-invariant stays in `semantic`.
- Dark values follow the same `{dotted.path}` reference syntax as `$value` (e.g. `{color.gray.950}`).

---

## Adding a new token file

1. Create a JSON file anywhere under `tokens/` with DTCG structure.
2. Run `npm run build` — the file is detected automatically.
3. A matching CSS file is generated in `dist/css/`.

No changes to `style-dictionary.config.js` are needed.

---

## References

- [Style Dictionary v5 docs](https://styledictionary.com/)
- [DTCG format](DTCG.md) — token structure and types
- [Utopia fluid scales](UTOPIA.md) — `clamp()` values in spacing and typography tokens
