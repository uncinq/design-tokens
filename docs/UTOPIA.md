# Fluid scales — Utopia method

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

All fluid tokens use the same viewport range: **320 px → 1440 px** (range = 1120).

```text
slope     = (max_px − min_px) / 1120
intercept = min_px − slope × 320   (÷ 16 → rem)
```

This range covers small phones (320 px) to wide desktop screens (1440 px). Tokens are clamped at both ends — below 320 px they stay at `min`, above 1440 px they stay at `max`.

---

## Usage

- **Fluid** (`--spacing-fluid-*`, `--font-size-fluid-*`) — pour les mises en page et les titres qui doivent respirer à toutes les tailles d'écran.
- **Fixed** (`--spacing-*`, `--font-size-*`) — pour les composants UI où un scaling continu casserait le layout (badges, labels, icônes, gaps internes).
