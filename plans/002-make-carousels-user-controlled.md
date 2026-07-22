# 002 — Make auto-advancing carousels user controlled

- **Status**: TODO
- **Baseline**: 302f1927 (deployed `main`)
- **Severity**: HIGH
- **Scope**: the hero and merchandise carousels plus one shared hook

## Problem

Both homepage carousels run repeating timers while mounted, including offscreen and for reduced-motion users, with no pause control.

## Target

- Advance only while the carousel is in view and autoplay is enabled.
- Default autoplay off for reduced motion.
- Add visible, keyboard-accessible pause/play controls beside the indicators.
- Keep manual dots and swipe available at all times.

## Boundaries

- Preserve image lists, 4s/5s intervals, swipe thresholds, links, and haptic behavior.
- Reuse Framer Motion and the existing haptic wrapper; add no dependency.

## Steps

1. Add a typed shared autoplay hook under `hooks/**`.
2. Replace both duplicated timer lifecycles.
3. Add pause/play controls with clear text alternatives.

## Verification

- Pause stops immediately; play resumes from the current slide.
- Offscreen carousels stop; reduced motion starts paused.
- Keyboard, dots, and swipe remain usable.
- `pnpm lint` and `pnpm exec tsc --noEmit` pass.
