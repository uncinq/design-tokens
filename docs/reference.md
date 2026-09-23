---
isIndex: false
title: Reference
description: Every token in the package, generated from the JSON sources so it can never drift from the shipped CSS.
weight: 5
---

Every table below is generated at build time from `dist/tokens.json`, which Style Dictionary produces from the same JSON sources as the CSS. Nothing here is written by hand, so a token cannot appear in the reference without existing in the package, or change value without the page changing with it.

Values are shown as they are emitted. A semantic token that references a primitive shows `var(--the-primitive)` rather than a flattened value, because that is literally what ships, and it is what makes an override of the primitive propagate.

{{< alert-block state="info" >}}
Reading this offline, from the repository or from `node_modules`? The tables below are rendered by the documentation site. The same data, in machine-readable form, sits in `dist/tokens.json`, and the final CSS is in `dist/css/`.
{{< /alert-block >}}

## Primitive

Raw, context-free values. These answer "what is the value?" and carry no opinion about usage.

### Color palette

19 hues at 11 steps, plus black and white. See [Colors](../colors/) for the hue table and the step guide.

{{< tokens pkg="design" file="primitive/color" >}}

### Size scale

{{< tokens pkg="design" file="primitive/size" >}}

### Font primitives

{{< tokens pkg="design" file="primitive/font" >}}

### Shadow scale

{{< tokens pkg="design" file="primitive/shadow" >}}

### Blur scale

{{< tokens pkg="design" file="primitive/blur" >}}

## Semantic

Named by purpose. These answer "what is this value for?" and are the layer a project should override.

### Color roles

{{< tokens pkg="design" file="semantic/color" >}}

### Typography

Font sizes (fixed and fluid), heading sizes, line heights, letter spacing, and the `--max-width-*` readability caps, which are authored as a `maxWidth` group in this file.

{{< tokens pkg="design" file="semantic/typography" >}}

### Spacing

{{< tokens pkg="design" file="semantic/spacing" >}}

### Size aliases

{{< tokens pkg="design" file="semantic/size" >}}

### Grid

{{< tokens pkg="design" file="semantic/grid" >}}

### Radius

{{< tokens pkg="design" file="semantic/radius" >}}

### Border

{{< tokens pkg="design" file="semantic/border" >}}

### Shadow aliases

{{< tokens pkg="design" file="semantic/shadow" >}}

### Blur aliases

{{< tokens pkg="design" file="semantic/blur" >}}

### Gradient

{{< tokens pkg="design" file="semantic/gradient" >}}

### Opacity

{{< tokens pkg="design" file="semantic/opacity" >}}

### Motion

Durations, easing curves and the transition shorthands built from them.

{{< tokens pkg="design" file="semantic/motion" >}}

### Ratio

{{< tokens pkg="design" file="semantic/ratio" >}}

### Focus

{{< tokens pkg="design" file="semantic/focus" >}}

### Form

The largest semantic file. It covers inputs, labels, checkboxes, radios, switches, selects and textareas, and is what [@uncinq/css-base](../../css-base/base/) reads to style native form controls.

{{< tokens pkg="design" file="semantic/form" >}}

### Icon

SVG icons encoded as `url('data:image/svg+xml;utf8,...')`, usable as a `background-image` or a `mask-image`.

{{< tokens pkg="design" file="semantic/icon" >}}

### Z-index

{{< tokens pkg="design" file="semantic/z-index" >}}

## Themes

### Dark

The overlay applied under `prefers-color-scheme: dark`. See [Dark mode](../dark-mode/) for how the selector works and how to opt out.

{{< tokens pkg="design" file="themes/dark" >}}
