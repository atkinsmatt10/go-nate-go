# Context

## Requested Framing

Reduce the excessive top padding visible on mobile and desktop, then improve the homepage design and animation quality using the requested motion-review skills.

## Actual User Pain

The first screen spends too much vertical space on an incorrectly sized logo canvas and a single-column stack. On desktop, the mission headline begins near the bottom of a 1000px viewport and the donation actions are pushed below it. The nested entrance motion adds movement without improving the hierarchy.

## Rejected Framing

“Add more animation throughout the site” would make a sensitive fundraising experience busier and slower. The useful change is to remove dead space, make the first-screen hierarchy more legible, and keep only motion that explains entry or carousel state.

## Narrowest Wedge

Refresh the homepage hero and its existing shared reveal helpers:

- size the logo with its real `5971 / 2238` aspect ratio
- tighten top padding at mobile and desktop breakpoints
- use an editorial two-column composition on large screens while preserving the current mobile content order
- remove the redundant parent reveal and decorative scroll parallax
- preserve concise, staggered entry motion and the existing reduced-motion behavior
- move predetermined shared reveal transforms to full GPU-friendly transform strings

## Non-Goals

- Rewriting fundraiser copy or changing any factual detail
- Changing donation, DonorDrive, Stripe, or merchandise behavior
- Redesigning later homepage sections
- Adding a new UI or animation dependency
- Deploying or changing production state

## Success Metric

- At `390x844`, the visible logo begins near the top of the page and the headline moves materially higher than the current `674px` baseline.
- At `1440x1000`, the hero headline and primary donation action are visible in the first viewport.
- Carousel transitions remain gesture-native, directional, interruptible, under `300ms`, and reduced-motion users receive an opacity-only transition.
- `pnpm lint` and `pnpm exec tsc --noEmit` pass.

## Why Now

The supplied production screenshots show the first-screen hierarchy is dominated by empty background. This is the highest-leverage place to improve trust, clarity, and perceived craft before adding any further animation.

## Assumptions And Open Questions

- The current logo artwork and factual copy remain source of truth.
- A large-screen split layout is within the requested design improvement; mobile keeps the familiar logo → photo → story → actions order.
- The existing Framer Motion dependency remains the correct tool for gesture-driven carousel motion; CSS transitions remain preferable for button feedback.
