# View Transition Animation Slice

## Actual user pain
- The site already has section-level Framer Motion reveals, but the most important transitions still feel disconnected.
- Moving from the homepage to the donation page is abrupt, the donation form swaps states without continuity, and Suspense-loaded social embeds pop in instead of revealing calmly.

## Requested framing
- Use the new view-transitions skill to review current animation behavior, then implement the best first slice.

## Rejected framing
- Do not redesign the whole campaign site.
- Do not replace Framer Motion everywhere just because React View Transitions are available.
- Do not mix Stripe backend changes or unrelated copy changes into this patch.

## Narrowest wedge
- Keep the slice frontend-only.
- Add route continuity between the homepage and donate page.
- Add explicit state transitions inside the donate checkout panel.
- Add Suspense reveal transitions where async social embeds load.

## Non-goals
- No changes to `/api/stripe/**` or `/api/donations`.
- No new routes or navigation structure.
- No broad component library restyling.

## Success metric
- Home to donate navigation feels like one connected journey rather than two separate pages.
- The donation form communicates placeholder, loading, and ready states with clear visual continuity.
- Social embeds reveal in a way that feels intentional and calm instead of abrupt.

## Why now
- Donation UX is mission-critical, and animation should reinforce trust and continuity on the highest-value path instead of feeling ornamental.

## Open assumptions or decisions
- Assume preview-only verification is sufficient unless production deployment is explicitly requested.
- Keep existing Framer Motion section reveals that already fit the campaign; use View Transitions only where the skill says they communicate continuity better.
