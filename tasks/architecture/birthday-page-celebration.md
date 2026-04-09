# Birthday Page Celebration Architecture

## Summary

Refine the existing `components/birthday-rsvp-page.tsx` hero instead of creating a new route or parallel page structure. Keep the RSVP flow intact and add three presentation-layer enhancements: a page-local warm accent, a new CTA button pair, and a live countdown to May 2.

## Slice Boundary

- In scope:
- `components/birthday-rsvp-page.tsx`
- `tasks/context/birthday-page-celebration.md`
- `tasks/architecture/birthday-page-celebration.md`
- `tasks/todo.md`
- Out of scope:
- `app/api/birthday-rsvp/route.ts`
- donate checkout architecture
- shared global color tokens

## Data Flow

1. Visitor loads `/birthday`.
2. Client component computes the next May 2 target date.
3. A one-second interval updates the countdown tiles in the hero.
4. Donate and shop buttons route to `/donate` and `shop.gonatego.com`.
5. RSVP form continues posting to the existing `/api/birthday-rsvp` endpoint unchanged.

## Trust Boundaries

- Countdown state is client-only presentation logic.
- RSVP submission remains server-validated and unchanged.
- CTA buttons are simple links and do not introduce new data handling.

## Edge Cases And Failures

- On May 2, the countdown should show a birthday-day message instead of counting to the following year immediately.
- After May 2 passes, the countdown should roll to the next year automatically.
- Reduced-motion users should still see the countdown and CTA hierarchy without aggressive hover movement.

## Test Matrix

- `/birthday` renders with the existing RSVP flow intact.
- Countdown updates over time and targets the next May 2.
- Donate and Shop CTAs render and have hover states without affecting form controls.
- `pnpm lint` passes.
- `pnpm exec tsc --noEmit` passes.
