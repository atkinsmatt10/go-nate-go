# Birthday Flipboard Countdown Architecture

## Architecture Summary

The slice adds a reusable split-flap foundation component adapted to the repo's existing frontend stack and a countdown-specific wrapper that owns time calculations, hourly chaos triggers, and birthday-page presentation.

## Slice Boundary And Dependency Impact

- Frontend-only.
- Page-specific integration on `/birthday`.
- No backend or API changes.
- Reuses existing `cn` helper and `framer-motion`.

## Data Flow

1. `CountdownFlippingBoard` receives a target date.
2. A one-second interval computes remaining days/hours/minutes/seconds.
3. The wrapper compares the current remaining hour bucket to the previous one.
4. If the hour bucket changes, the wrapper increments a pulse key and briefly enables chaos mode.
5. Segment digits render through reusable split-flap cells.
6. Each cell animates toward its target digit and may perform a stronger scramble when chaos mode is active or when the pulse key changes.

## State Transitions

- `steady`: normal one-second updates with restrained flips.
- `chaos`: short-lived hourly pulse with more scramble steps, brighter accent churn, and slightly stronger segment motion.
- `birthday`: terminal state with all zeros and celebratory copy.

## Trust Boundaries

- Time is derived client-side from the browser clock.
- No external service or user input affects countdown rendering.

## Edge Cases And Failure Modes

- Reduced motion: cells should avoid 3D flap rotations and fall back to opacity-only transitions.
- Days may require three digits; other units remain two digits.
- When the target date is reached, the board should stop at zero instead of going negative.
- Chaos mode must resolve quickly so the board stays readable.

## Test Matrix

- Standard countdown render with nonzero values.
- Hourly pulse path by simulating a remaining-hours bucket change.
- Birthday-day zero state.
- Mobile layout without overflow.
- Reduced-motion branch.

## Rollout / Rollback / Observability

- Rollout is a direct page-component replacement on `/birthday`.
- Rollback is removing the new wrapper and restoring the current inline countdown.
- No observability changes are required.
