# UI Design Review

## Pre-Build Review

The supplied screenshots and local DOM measurements confirm a hierarchy problem rather than a need for more decoration:

- the source logo is `5971x2238` (`2.67:1`) but the current wrapper forces `3:2`, creating a tall empty canvas around the visible mark
- at `390x844`, the current headline begins at approximately `674px`
- at `1440x1000`, the current headline begins at approximately `932px`, leaving the primary donation action below the first viewport
- the hero applies a parent page reveal and additional child reveals, so the same content is translated or scaled twice

The design direction is a tighter editorial hero: correct logo proportions, restrained section padding, a large-screen split between mission and family photography, 24–32px image corners, and short ease-out entrances. Mobile keeps the current emotional sequence.

### Animation Opportunities

| # | Location | Today | Purpose | Frequency | Suggested motion |
| --- | --- | --- | --- | --- | --- |
| 1 | `components/hero-section.tsx:131` | Parent and child entrances stack, making the hero feel slower | Preventing a jarring change | Rare / page entry | Remove the parent reveal; settle logo, photo, story, and actions with `240–260ms` `cubic-bezier(0.23, 1, 0.32, 1)`, `10–14px` maximum travel, and `40–60ms` stagger. Reduced motion keeps a `180ms` opacity fade only. |
| 2 | `components/hero-section.tsx:211` | Carousel state is visible only through small dots | State indication | Occasional | Preserve the dot state transition at `220ms` ease-out and make the hit targets larger without increasing visual noise. |
| 3 | `components/shirt-section.tsx:163` | Product name and price teleport while the image slides | Preventing a jarring change | Occasional | Crossfade product metadata with `opacity: 0` plus `translate3d(0, 8px, 0)` to settled over `220ms` ease-out; reduced motion uses opacity only. |
| 4 | `components/sharing-nates-story.tsx:22` | Skeletons disappear into variable-height embeds abruptly | Preventing a jarring change | Rare / async load | Crossfade the loading surface over `220ms` ease-out; keep the content readable immediately and avoid animated layout properties. |

### Rejected Candidates

- Ambient logo bobbing — **rejected at Purpose**: it would be decorative motion on the most visible brand element with no state or explanation value.
- Line-by-line paragraph reveals — **rejected at Function**: the copy is sensitive, information-dense, and should remain stable for reading.
- Decorative scroll parallax on the background wave — **rejected at Function**: the movement does not explain hierarchy or state and adds continuous work during scrolling.
- More pronounced CTA hover lift — **rejected at Frequency**: the existing `150ms` press feedback is already sufficient for a repeatedly used control.

### UI Library Decision

Keep Framer Motion, which is already installed and is the curated choice for gesture-driven and enter/exit animation. Do not add a library. Use the existing CSS transition layer for buttons and other predetermined feedback.

## Risks To Address Before Coding

- Preserve the fundraiser copy and existing links exactly.
- Do not let the desktop split make the photo feel like a product card.
- Preserve mobile order and keep the logo large enough to remain recognizable after removing the false canvas height.
- Avoid hover-only meaning and keep reduced-motion branches explicit.
- Do not expand the slice into unrelated section cleanup.

## Post-Build Screenshot Review

Browser captures of the homepage reconciled onto deployed `main` (`302f1927`) were reviewed at `390x844` and `1440x1000`.

- Mobile: the logo begins at `16px`, fills a `358x134` box at its real ratio, and the headline begins at `600px` instead of the `674px` production baseline. The photo remains the emotional focus, the 28px corners align with the campaign system, and document width matches the `390px` viewport.
- Mobile actions: both Donate and Shop retain `358x56` targets in the stacked layout. The campaign ribbon follows the hero without clipping or a hard visual break.
- Desktop: the hero is `751px` tall; the logo begins at `40px`, the headline begins at `280px`, and the Donate action begins at `615px`. The complete mission and both actions are visible inside the `1440x1000` first viewport, with the campaign ribbon beginning at `727px`.
- The desktop split feels editorial rather than card-based: logo, mission, and actions form a clear left-hand reading path while the photo and carousel state sit on the right.
- Reduced-motion emulation reported the preference as active, left hero transforms at identity, hid the moving marquee track, and displayed the static campaign line.
- The initial post-build pass exposed a Next image-ratio warning and a mobile flex-basis regression. Explicit height preservation removed the warning, and scoping `flex-1` to the row breakpoint restored both mobile actions to `56px` tall.

## Remaining Polish Or UX Issues

- Both homepage carousels still need a visible pause/play control and should stop advancing when offscreen; this remains the separate plan `002-make-carousels-user-controlled.md`.
- Merchandise name and price still change outside the image transition. That is a worthwhile later polish slice, but not part of the first-screen spacing fix.
- A real-device or extension-free browser pass at slow playback remains the best final feel check for the `50ms` stagger.
