# 001 — Tighten the homepage hero and clarify its motion

- **Status**: DONE
- **Baseline**: 302f1927 (deployed `main`)
- **Severity**: HIGH
- **Scope**: `components/hero-section.tsx` and `lib/motion.ts`

## Problem

The `5971x2238` logo was placed in a `3 / 2` wrapper, adding false vertical space. The hero also stacked a parent reveal with child reveals and continuously translated a decorative wave. On production, the mobile headline began around `674px`; on desktop, the mission and actions fell below the first viewport.

## Target

- Use the logo's real aspect ratio and `pt-4` through `lg:pt-10`.
- Preserve mobile order: logo → photo → story → actions.
- Use a two-column editorial composition at `lg`.
- Remove the parent reveal and scroll parallax.
- Use independent `240–260ms` entrances with `10–14px` travel and the shared ease-out curve.
- Keep reduced motion opacity-only.
- Use full transform strings for predetermined reveals while retaining gesture-native carousel `x` and scale values.

## Steps

1. Rebuild the hero wrapper as a responsive grid.
2. Correct the logo ratio and keep the photo within the campaign's 24–32px corner range.
3. Preserve copy, links, timer, swipe, and haptic behavior.
4. Simplify predetermined reveal transforms in `lib/motion.ts`.
5. Verify shared helper consumers outside the hero.

## Boundaries

- No fundraiser copy, facts, routes, APIs, donation behavior, dependencies, or later-section redesigns.
- No carousel lifecycle/control work; that remains plan 002.
- No production deployment.

## Verification

- `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `git diff --check` pass.
- At `390x844`, document width matches the viewport, the logo starts at `16px`, the headline starts at `600px`, and both CTAs are `56px` tall.
- At `1440x1000`, the complete mission and both actions fit before the campaign ribbon.
- Reduced motion uses identity transforms and the static ribbon.
- Birthday, not-found, merchandise, and visible social reveals settle to full opacity with identity transforms.
