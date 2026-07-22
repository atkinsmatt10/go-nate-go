# Context

## Requested Framing

Redesign the homepage fundraising section to resemble the supplied campaign-focused reference and animate the raised amount and progress bar with an appropriate UI library.

## Actual User Pain

The current section communicates the live total, but its generic heading, standard progress bar, and small labels make the fundraiser feel like a utility widget instead of an emotional campaign milestone.

## Rejected Framing

- A dashboard card with generic statistics and charts.
- A dependency-heavy animation system or a hand-built digit animation.
- An API or checkout rewrite.
- Decorative motion that obscures the real amount or ignores reduced-motion preferences.

## Narrowest Wedge

Replace the presentation inside `FundraisingProgress` with the supplied hierarchy: campaign eyebrow, emphatic headline, mission copy, large animated total, shark-led progress track, supporter count, and direct donation action. Preserve the existing SWR polling and `/api/donations` contract.

## Non-Goals

- No changes to DonorDrive team `15164`, API caching, ETag behavior, Stripe checkout, or donation routing.
- No changes to other homepage sections.
- No new image asset; reuse the existing campaign shark.
- No animation after the initial reveal unless the live donation data changes.

## Success Metric

Visitors can identify the amount raised, goal, progress, supporter count, and donation action in a single scan. The amount and progress animate smoothly on entry, remain accurate when SWR refreshes, and become immediate when reduced motion is preferred.

## Why Now

The updated journey and marquee establish a more campaign-specific homepage rhythm; the fundraising section should now carry that same visual and emotional clarity into the primary donation moment.

## Assumptions And Open Questions

- The supplied `$16,250`, `$25,000`, and `62 donations` values are appropriate recent fallbacks when live DonorDrive data is unavailable.
- The existing `/donate` route remains the destination for the primary action.
- NumberFlow is the purpose-built choice for digit transitions; the already-installed Framer Motion remains the right tool for the bar fill and shark position.
