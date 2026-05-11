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

### Format — `css/layer-config`

All tokens are wrapped in `@layer config { :root { … } }`. This is the lowest-priority layer in the Un Cinq stack, so any project can override any token by importing after this package inside its own `@layer config` block.

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

## Dark mode — `$mods.dark`

Dark mode overrides are declared **inline** on the semantic token, in a custom `$mods` extension:

```json
{
  "color": {
    "background": {
      "default": {
        "$value": "{color.gray.50}",
        "$type": "color",
        "$mods": {
          "dark": "{color.gray.950}"
        }
      }
    }
  }
}
```

The build generates a `@media (prefers-color-scheme: dark)` block inside the same `@layer config`:

```css
@layer config {
  :root {
    --color-background: var(--color-gray-50);
  }

  @media (prefers-color-scheme: dark) {
    :root {
      color-scheme: dark;
      --color-background: var(--color-gray-950);
    }
  }
}
```

`color-scheme: dark` is automatically added to the dark block so the browser renders native UI elements (scrollbars, form controls) in dark mode.

### Rules

- Only semantic tokens should carry `$mods.dark` — primitives are neutral by definition.
- The dark value follows the same `{dotted.path}` reference syntax as `$value`.
- A raw value (not a reference) is also valid: `"dark": "oklch(0.15 0 0)"`.

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
