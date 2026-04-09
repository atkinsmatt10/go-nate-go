# Birthday RSVP Refinement Plan

## Artifacts

- [x] Reframe the request in [tasks/context/birthday-rsvp-page.md](/Users/Matt.Atkins/.codex/worktrees/5eca/go-nate-go-1/tasks/context/birthday-rsvp-page.md)
- [x] Capture the implementation slice in [tasks/architecture/birthday-rsvp-page.md](/Users/Matt.Atkins/.codex/worktrees/5eca/go-nate-go-1/tasks/architecture/birthday-rsvp-page.md)

## Tasks

- [x] Pull the invitation details and lock the scope to a single `/birthday` RSVP flow
- [x] Build the first birthday landing page and RSVP flow
- [x] Add an RSVP submission endpoint that validates responses and emails the organizers
- [ ] Refine the `/birthday` page hierarchy to prioritize title, venue, date/time, and RSVP in a cleaner sequence
- [ ] Add a bottom-of-page location section with an embedded Craft Hall map
- [ ] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [ ] Record verification and documentation notes for the hierarchy pass

## Notes

- Scope stays focused on one reviewable slice: a public birthday page and one RSVP action.
- RSVP submissions will email the organizer inbox because the form intentionally asks only for name, party size, and attendance.
- This refinement slice is frontend-only. The RSVP backend contract stays unchanged.
