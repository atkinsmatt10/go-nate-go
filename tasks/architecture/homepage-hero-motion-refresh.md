# Architecture Review

## Slice Boundary

Change `components/hero-section.tsx` for responsive composition and hero-specific motion. Change `lib/motion.ts` only to express its predetermined reveal translation/scale values as full `transform` strings. Keep carousel `x`/scale variants gesture-native because Motion combines those values with drag state. Do not change page copy, downstream section structure, carousel timing, routes, APIs, or dependencies.

## Architecture Summary

The hero remains a client component with the same image state, timer, haptic feedback, drag gestures, and links. The DOM is reorganized into a responsive grid so logo, carousel, story, and actions can occupy independent grid areas. Page-entry motion stays on those meaningful groups instead of nesting every group inside another animated wrapper. The decorative scroll-linked wave becomes a static background treatment.

## Data Flow

```text
app/page.tsx
  -> HeroSection
       -> responsive grid groups
       -> currentImage + direction
       -> shared reveal helpers from lib/motion.ts
            -> full transform-string variants
       -> gesture-native carousel variants from lib/motion.ts
```

No server, persistence, or external-service flow changes.

## State Transitions

- Initial render: logo, carousel, story, and actions settle with short, staggered ease-out entrances.
- Reduced motion: each entrance keeps opacity feedback and drops positional or scale movement.
- Timer or manual dot selection: `currentImage` and `direction` change as they do today.
- Drag end: the existing swipe threshold chooses the next or previous image.

## Trust Boundaries

There are no new trust boundaries. Existing internal image paths, internal donation link, external shop link, and haptic wrapper remain unchanged.

## Edge Cases And Failure Modes

- The logo must not distort or reserve height beyond its intrinsic ratio.
- The grid must preserve mobile reading order and avoid horizontal overflow at `390px`.
- Desktop copy must remain readable without making the carousel dominate the mission.
- Directional carousel transforms must keep the same sign semantics on enter and exit.
- Reduced-motion variants must not retain translation or scale.
- The shared reveal-helper change also affects later pages and sections, so those surfaces must retain their current entrance behavior.
- Raw carousel transform strings are intentionally rejected because Motion's installed renderer skips generated drag transforms when `latestValues.transform` is present.

## Test Matrix

| Case | Expected result |
| --- | --- |
| `390x844` initial hero | Minimal top dead space; logo, photo, and headline maintain clear hierarchy |
| `1440x1000` initial hero | Two-column composition; mission and donation action visible in first viewport |
| `prefers-reduced-motion: reduce` | Opacity-only entrances and carousel crossfade |
| Dot selection | Correct image and directional transition; haptic wrapper still called |
| Swipe left/right | Existing threshold and wraparound behavior preserved |
| Hero and merchandise carousels | Gesture-native variants preserve directional drag behavior |
| `/birthday`, `/donate`, and not-found routes | Shared reveal helpers retain their current visual result |
| Static checks | `pnpm lint` and `pnpm exec tsc --noEmit` pass |

## Rollout, Rollback, And Observability

This is a frontend-only, reviewable slice with no migration or rollout ordering. Rollback is a two-file revert. Visual screenshots at mobile and desktop sizes are the primary observability evidence; no production instrumentation changes are needed.
