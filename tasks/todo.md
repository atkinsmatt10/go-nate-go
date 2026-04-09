# Birthday RSVP Plan

## Artifacts

- [x] Reframe the request in [tasks/context/birthday-rsvp-page.md](/Users/Matt.Atkins/.codex/worktrees/5eca/go-nate-go-1/tasks/context/birthday-rsvp-page.md)
- [x] Capture the implementation slice in [tasks/architecture/birthday-rsvp-page.md](/Users/Matt.Atkins/.codex/worktrees/5eca/go-nate-go-1/tasks/architecture/birthday-rsvp-page.md)

## Tasks

- [x] Pull the invitation details and lock the scope to a single `/birthday` RSVP flow
- [x] Build the birthday landing page in the existing Go Nate Go visual language
- [x] Add an RSVP submission endpoint that validates responses and emails the organizers
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Record verification and documentation notes

## Notes

- Scope stays focused on one reviewable slice: a public birthday page and one RSVP action.
- RSVP submissions will email the organizer inbox because the form intentionally asks only for name, party size, and attendance.
- Verification:
- `PATH="$HOME/.asdf/installs/nodejs/22.10.0/bin:$PATH" pnpm install --frozen-lockfile` completed so this worktree could run checks.
- `PATH="$HOME/.asdf/installs/nodejs/22.10.0/bin:$PATH" pnpm lint` passed.
- `PATH="$HOME/.asdf/installs/nodejs/22.10.0/bin:$PATH" pnpm exec tsc --noEmit` passed.
- `curl -I http://localhost:3000/birthday` returned `200 OK` while `pnpm dev` was running locally.
- Browser screenshot verification was not completed because the local Playwright browser bundle is missing from `~/Library/Caches/ms-playwright`.
