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
