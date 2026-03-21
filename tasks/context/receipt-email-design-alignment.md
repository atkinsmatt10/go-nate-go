# Context

## Requested Framing

Update the receipt email so it aligns with the Paper artboard `EV-1`, including both visual design and copy.

## Actual User Pain

The current receipt email works functionally, but it does not yet match the designed donor-facing presentation. The user needs the shipped email to feel like the approved campaign artifact rather than a first-pass branded template.

## Rejected Framing

Do not reopen the webhook, env, or delivery architecture. This is a frontend/content alignment pass on the existing receipt template and payload only.

## Narrowest Wedge

Adjust the receipt email component and the send payload so the rendered email matches the linked Paper artboard’s:

- section order
- visual hierarchy
- tone and copy
- support/footer details

## Non-Goals

- changing webhook behavior
- changing the Stripe event model
- changing donation checkout UX
- adding new persistence or account features

## Success Metric

The email template visually tracks the `EV-1` artboard closely enough that the main differences are email-client constraints rather than layout or copy drift.

## Why Now

The delivery path is now wired. The remaining quality gap is donor-facing polish, and the design reference is already available in Paper.

## Assumptions And Open Questions

- The Paper artboard is the source of truth for both layout and copy.
- Support email and phone should follow the design unless overridden by env.
- The email can approximate overlap and spacing where email-client CSS support is weaker than the Paper canvas.
