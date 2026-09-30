---
isIndex: false
title: Fluid scales
description: The Utopia method behind the fluid font-size and spacing tokens, and when to reach for them.
weight: 9
icon: arrows-expand
---


Source: <https://utopia.fyi>

## Principle

Each fluid token is a `clamp()` expression that scales linearly between a minimum and a maximum value, with no breakpoints.

```css
property: clamp(min, intercept + slope × 1vw, max);
```

```text
slope     = (max_px − min_px) / (viewport_max − viewport_min)
intercept = min_px − slope × viewport_min   (÷ 16 → rem)
```

---

## Viewport range

All fluid tokens use the same viewport range: **375 px → 1440 px** (range = 1065).

```text
slope     = (max_px − min_px) / 1065
intercept = min_px − slope × 375   (÷ 16 → rem)
```

This range covers modern phones (375 px) to wide desktop screens (1440 px). Tokens are clamped at both ends — below 375 px they stay at `min`, above 1440 px they stay at `max`.

---

## Usage

- **Fluid** (`--spacing-fluid-*`, `--font-size-fluid-*`) for layout and headings, anything that should breathe across screen sizes.
- **Fixed** (`--spacing-*`, `--font-size-*`) for UI components where continuous scaling would break the layout: badges, labels, icons, internal gaps.

The rule of thumb is whether the element has room to grow. A heading in a page flow does. A badge sitting inside a button does not, and scaling it continuously leaves it visually unrelated to the text it labels at one end of the range or the other.

## Worked example

`--font-size-fluid-2xs` is declared as:

```css
clamp(0.625rem, 0.5810rem + 0.1878vw, 0.75rem)
```

It reads as: never smaller than `0.625rem` (10px), never larger than `0.75rem` (12px), and in between it grows linearly with the viewport. At 375px wide the middle term evaluates to the minimum, at 1440px to the maximum, which is what ties every fluid token in the package to the same two anchor widths.
