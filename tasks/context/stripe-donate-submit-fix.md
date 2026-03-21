# Stripe Donate Submit Fix

## Actual user pain
- The donation page can look broken after donors click `Continue to Secure Checkout`.
- Session creation works, but the transition into the mounted Stripe checkout UI is subtle and custom-checkout load failures are not surfaced clearly.

## Requested framing
- Troubleshoot the Stripe integration on the donation page and identify the best fix.

## Rejected framing
- Do not redesign the donation experience.
- Do not replace Checkout Sessions with a different Stripe integration.
- Do not mix in unrelated payment-method cleanup unless it directly fixes the failure.

## Narrowest wedge
- Validate the existing Checkout Session flow locally and against production.
- Keep the current Checkout Sessions integration intact.
- Make the secure-checkout transition obvious and expose Stripe element load failures instead of leaving the donor guessing.

## Non-goals
- No new webhook or fulfillment architecture in this slice.
- No changes to donation copy, pricing, or return-page presentation unless required for correctness.
- No broad Stripe dashboard configuration changes in code.

## Success metric
- Donors can see that the page has advanced into secure checkout immediately after clicking continue.
- If a Stripe element fails to load, the donation form shows an actionable message instead of a silent no-op.

## Why now
- Donation UX is mission-critical for the fundraiser, and a broken submit path directly blocks contributions.

## Open assumptions or decisions
- Assume the current Checkout Session-based architecture should remain in place.
- Treat this as a UX and error-surfacing gap rather than a full Stripe outage because local and production checkout sessions both initialize successfully.
