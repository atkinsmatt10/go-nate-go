# Birthday Page Celebration Plan

## Artifacts

- [x] Reframe the request in [tasks/context/birthday-page-celebration.md](/Users/Matt.Atkins/.codex/worktrees/be28/go-nate-go-1/tasks/context/birthday-page-celebration.md)
- [x] Capture the implementation slice in [tasks/architecture/birthday-page-celebration.md](/Users/Matt.Atkins/.codex/worktrees/be28/go-nate-go-1/tasks/architecture/birthday-page-celebration.md)

## Tasks

- [x] Fetch the latest birthday-page code from GitHub and work from the existing `/birthday` implementation
- [x] Keep the scope frontend-only and limited to page-specific celebration polish
- [x] Introduce a warm birthday accent without breaking the RSVP page's core structure
- [x] Add polished Donate Now and Shop Now CTA interactions
- [x] Add a live countdown to May 2 in the hero
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Record verification notes for this birthday-page pass

## Notes

- Scope stays focused on one reviewable slice inside the existing `/birthday` page.
- The RSVP backend contract stays unchanged.
- The requested CTAs are additive to the RSVP invitation page rather than replacing RSVP as the primary action.
- Verification passed with `pnpm lint` and `pnpm exec tsc --noEmit` using the repo's `asdf` Node 22.10.0 runtime.

## Countdown Polish Follow-Up

- [x] Capture the UI review in [tasks/design/birthday-countdown-signature.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/birthday-countdown-signature.md)
- [x] Move the birthday countdown below the closing signature and remove the standalone card treatment
- [x] Add subtle countdown entrance/value motion that respects reduced motion
- [x] Re-run `pnpm lint` and `pnpm exec tsc --noEmit` for the birthday page follow-up

## Flipboard Countdown Slice

- [x] Reframe the request in [tasks/context/birthday-flipboard-countdown.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/birthday-flipboard-countdown.md)
- [x] Capture the implementation slice in [tasks/architecture/birthday-flipboard-countdown.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/architecture/birthday-flipboard-countdown.md)
- [x] Adapt the provided split-flap concept to the repo's upgraded Tailwind 4 stack in `@/components/ui`
- [x] Build a countdown-specific board with days, hours, minutes, seconds, and hourly chaos mode
- [x] Replace the current `/birthday` countdown UI with the new board without disturbing the rest of the page
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Review the rendered `/birthday` page in a browser screenshot via `agent-browser`
- [x] Run a focused cleanup pass for social embeds and responsive image warnings, then smoke-test `/`, `/birthday`, and `/donate` with `agent-browser`

## Cleanup Notes

- The homepage social embeds now load client-only to avoid third-party hydration mismatches.
- `agent-browser` smoke checks passed on `/`, `/birthday`, and `/donate` with screenshots captured under `/tmp/`.
- Remaining browser noise is environment-specific: local DonorDrive TLS certificate failure on `/api/donations`, Stripe's expected HTTP dev warning on `/donate`, and one generic browser library warning about scroll offset container positioning.
