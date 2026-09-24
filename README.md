# @uncinq/design-tokens

> Framework-agnostic design tokens — Hugo, Symfony, Shopify, or any CSS environment.

<img width="1280" height="640" alt="share-design-tokens" src="https://github.com/user-attachments/assets/66b8ce73-b07d-4cd0-bcb7-f8e0f7a5bb98" />

Primitive and semantic design tokens, authored in [DTCG](https://tr.designtokens.org/format/) JSON and compiled to CSS custom properties by [Style Dictionary](https://styledictionary.com/).

## Installation

```bash
npm install @uncinq/design-tokens
```

```css
/* everything: primitive + semantic + dark theme */
@import '@uncinq/design-tokens';

/* or by layer */
@import '@uncinq/design-tokens/css/primitive.css';
@import '@uncinq/design-tokens/css/semantic.css';

/* or file by file */
@import '@uncinq/design-tokens/css/semantic/color.css';
```

Without a build step:

```html
<link rel="stylesheet" href="https://unpkg.com/@uncinq/design-tokens">
```

Every generated file declares `@layer tokens` itself. Declaring the full layer order is the consuming project's job, and it must happen before any import.

## Token architecture

```
primitive   →   semantic   →   component
(raw values)    (purpose)      (@uncinq/component-tokens)
```

```css
--color-sienna-600: oklch(0.53 0.195 22);    /* primitive: what is the value? */
--color-brand:      var(--color-sienna-600); /* semantic:  what is it for?   */
--btn-color-background: var(--color-brand);  /* component: where is it used? */
```

Overriding the semantic layer is how a project rebrands without forking:

```css
@import '@uncinq/design-tokens';

@layer tokens {
  :root {
    --color-brand:       var(--color-violet-600);
    --color-brand-hover: var(--color-violet-700);
  }
}
```

## At a glance

- **19 hues** at 11 steps each, all in OKLCH, plus black and white
- **661 tokens** across 23 source files
- **CSS output only**, because custom properties are the one format that works unchanged everywhere
- **Dark theme** as a 13-token overlay, following the OS setting

## Documentation

Full documentation: **[socle.uncinq.dev/docs/design-tokens/](https://socle.uncinq.dev/docs/design-tokens/)**

It is also versioned with the code in [`docs/`](docs/), and ships inside the npm package, so it is readable offline and from `node_modules`:

- [Naming](docs/naming.md) — the grammar, the rules, the scales, the category list
- [Colors](docs/colors.md) — OKLCH, the palette, the semantic roles, WCAG guidance
- [Dark mode](docs/dark-mode.md) — the overlay model and how to opt out
- [Customizing](docs/customizing.md) — the two override strategies
- [Reference](docs/reference.md) — every token, generated from the sources
- [DTCG format](docs/dtcg.md) — the authoring format
- [Style Dictionary](docs/style-dictionary.md) — the build pipeline
- [Fluid scales](docs/utopia.md) — the Utopia method

## Build

```bash
npm install
npm run build     # tokens/**/*.json → dist/css/**
```

`dist/` is generated and committed. Never edit it by hand.

## References

- [DTCG specification](https://tr.designtokens.org/format/) — W3C Community Group draft
- [Style Dictionary v5](https://styledictionary.com/)
- [Utopia](https://utopia.fyi) — the fluid scale method
- [`@uncinq/component-tokens`](https://github.com/uncinq/component-tokens) — the component layer
- [`@uncinq/css-base`](https://github.com/uncinq/css-base) — the CSS foundation consuming these tokens

## License

MIT © [Un Cinq](https://uncinq.dev/)
