# DTCG — Design Token Community Group

The [W3C Design Token Community Group (DTCG)](https://www.w3.org/community/design-tokens/) defines a standard interchange format for design tokens, so they can travel between tools (Figma, code, documentation) without loss of meaning.

`@uncinq/design-tokens` is **CSS-first** — tokens are shipped as CSS custom properties, not as DTCG JSON. The DTCG spec informs the architecture (primitive → semantic → component, naming conventions, token types) but there is no JSON source file. If a Figma → DTCG → CSS pipeline is needed in the future, [Style Dictionary](https://amzn.github.io/style-dictionary/) is the recommended build tool.

---

## The DTCG format

The [DTCG spec](https://tr.designtokens.org/format/) defines tokens as JSON objects with reserved `$`-prefixed keys:

```json
{
  "color-brand": {
    "$value": "#4338ca",
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

---

## DTCG token types

| Type | Example value | CSS usage |
| --- | --- | --- |
| `color` | `#4338ca`, `hsl(...)` | `color`, `background-color` |
| `dimension` | `1rem`, `4px` | `width`, `padding`, `font-size` |
| `fontFamily` | `"system-ui, sans-serif"` | `font-family` |
| `fontWeight` | `700` | `font-weight` |
| `duration` | `300ms` | `transition-duration` |
| `cubicBezier` | `[0.165, 0.84, 0.44, 1]` | `animation-timing-function` |
| `number` | `1.5` | `line-height`, `opacity` |
| `shadow` | `{offsetX, offsetY, blur, spread, color}` | `box-shadow` |

→ Full type list: [tr.designtokens.org/format/#types](https://tr.designtokens.org/format/#types)

> **Note on `clamp()` values:** DTCG has no native `fluid` type. Fluid tokens (`--fluid-sm`, `--font-size-fluid-md`) use `$type: "dimension"` as the closest match — a documented gap in the spec.

---

## Token groups

Tokens are organized in nested objects. Groups share a `$type` by inheritance:

```json
{
  "color": {
    "$type": "color",
    "gray": {
      "100": { "$value": "#f3f4f6" },
      "900": { "$value": "#111827" }
    }
  }
}
```

→ [tr.designtokens.org/format/#groups](https://tr.designtokens.org/format/#groups)

---

## References (aliases)

Tokens can reference other tokens using `{dotted.path}` syntax:

```json
{
  "color-primary": {
    "$value": "{color.brand}",
    "$type": "color"
  }
}
```

In CSS, this maps to `var()`:

```css
--color-primary: var(--color-brand);
```

This is the key mechanism behind the **primitive → semantic → component** hierarchy.

→ [tr.designtokens.org/format/#alias](https://tr.designtokens.org/format/#alias)

---

## References

- [DTCG specification](https://tr.designtokens.org/format/) — W3C Community Group draft
- [DTCG GitHub](https://github.com/design-tokens/community-group) — issues, discussion
- [Style Dictionary](https://amzn.github.io/style-dictionary/) — token build pipeline (JSON → CSS/SCSS/JS)
- [Tokens Studio](https://tokens.studio/) — Figma plugin for DTCG workflows
