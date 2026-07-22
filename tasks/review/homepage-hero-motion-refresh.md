# Animation Review

## Findings

| Before | After | Why |
| --- | --- | --- |
| `py-12 md:py-20 lg:py-24` plus a forced `3 / 2` logo canvas | `pb-12 pt-4 ... lg:pt-10` and `aspect-[5971/2238]` in `components/hero-section.tsx:91-124` | Removes false vertical padding without shrinking the real logo artwork. |
| Parent page reveal wrapped additional logo, photo, headline, copy, and CTA reveals | Four independent groups at `components/hero-section.tsx:119-236`, staggered by `50ms` with `240–260ms` duration | Each entrance has a clear page-entry purpose; removing the nested transform prevents sluggish double movement. |
| Decorative scroll-linked wave translated continuously | Static background wave at `components/hero-section.tsx:92-115` | The parallax did not explain state or hierarchy, so deleting it is the strongest motion improvement. |
| Predetermined reveals used Motion `y`/scale shorthands | Full `translate3d(...)` and `scale(...)` strings at `lib/motion.ts:34-75` | Keeps predictable page-entry work on transform and opacity while preserving the strong shared ease-out curve. |
| Carousel dots were `8x8` buttons with Motion scale on every state change | `32x32` controls with an `8x8` visual dot and reduced-motion override at `components/hero-section.tsx:197-213` | Improves touch and keyboard affordance; state indication remains subtle and reduced motion keeps color/opacity only. |

## Verdict

**Origin, physicality, and cohesion:** the logo now uses its real ratio, the photo uses the campaign's 28px corner language, and the desktop split keeps the family image emotionally prominent without delaying the mission.

**Performance:** the decorative scroll transform and nested reveal were removed. Predetermined reveals use full transform strings. Gesture-native carousel `x`/scale variants were deliberately retained because the installed Motion renderer otherwise skips drag transforms when a raw `transform` value is present.

**Accessibility:** all shared reveal helpers retain `180ms` opacity-only reduced-motion branches, and the active carousel dot drops its scale transition under reduced motion.

**Approve this slice.** There are no feel-breaking regressions, UI durations remain under `300ms`, easing is `cubic-bezier(0.23, 1, 0.32, 1)`, and the final-state mobile/desktop screenshots show a materially clearer hierarchy. The separate auto-advance pause/control work remains a high-priority follow-up in `plans/002-make-carousels-user-controlled.md`.

# Pre-Merge Review

## Scope Drift

No scope drift. Changes stay in the hero, shared predetermined reveal helpers, and required workflow artifacts. Fundraiser copy, links, timer intervals, swipe threshold, image list, donation behavior, and later-section structure are unchanged.

## Structural Risks

- Shared reveal helpers affect multiple routes. `pnpm lint` and `pnpm exec tsc --noEmit` pass, and the reduced-motion branches keep opacity only.
- Browser smoke tests confirmed visible shared-reveal consumers settle to full opacity with identity transforms on `/birthday`, the not-found route, merchandise, and the social section.
- Carousel transform strings were reverted after inspecting the installed Motion renderer because they would suppress drag-generated `x` transforms. Gesture-native variants remain unchanged.

## Completeness Gaps

No gap inside plan 001. Plan 002 intentionally remains separate so autoplay accessibility can be reviewed and tested independently across both carousels.

## Migration And Rollback Notes

No migration or rollout ordering. Rollback is limited to `components/hero-section.tsx` and the predetermined reveal fields in `lib/motion.ts`.

## Prod-Only Failure Modes

No service, cache, API, persistence, or environment behavior changed. The main production risk is responsive layout drift, covered by `390x844` and `1440x1000` screenshots and exact element measurements.

## Recommendation

Approve plan 001 as a focused frontend slice on deployed `main` commit `302f1927`. The current campaign marquee, editorial story, fundraising animation, and official X embed work remain intact. The carousel image hint now matches its `520px` desktop frame. Keep plan 002 separate rather than bundling carousel lifecycle and controls into this review.
