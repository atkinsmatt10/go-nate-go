# View Transition Animation Slice Plan

## Artifacts

- [x] Reframe the request in [tasks/context/view-transition-animation-slice.md](tasks/context/view-transition-animation-slice.md)
- [x] Capture the implementation slice in [tasks/architecture/view-transition-animation-slice.md](tasks/architecture/view-transition-animation-slice.md)
- [x] Record the UI review in [tasks/design/view-transition-animation-slice.md](tasks/design/view-transition-animation-slice.md)

## Tasks

- [x] Audit current animation patterns across home, donate, and Suspense-driven social embeds
- [x] Enable Next.js view transitions and add the shared CSS primitives in the global stylesheet
- [x] Add route continuity between home and donate, including a shared logo element
- [x] Add explicit donation form state transitions for placeholder, loading, and ready checkout states
- [x] Add Suspense reveal transitions for social embeds
- [x] Verify with `pnpm lint`
- [x] Verify with `pnpm exec tsc --noEmit`
- [x] Run a post-build visual review and record any remaining polish gaps

## Notes

- Scope stays frontend-only and reviewable.
- Stripe APIs and donation data fetching stay unchanged in this slice.
- The goal is continuity and trust, not adding more decorative motion.
- Verification:
- `pnpm lint` passed.
- `pnpm exec tsc --noEmit` passed.
- Browser review passed on local home and donate pages using a temporary Playwright install with the system Chrome binary.
- Screenshots captured at `/tmp/gonatego-home.png`, `/tmp/gonatego-donate.png`, `/tmp/gonatego-social.png`, and `/tmp/gonatego-donate-ready-settled.png`.
- Residual issues observed during browser review:
- Existing Instagram embed hydration mismatches still log in the console.
- Existing 404/500 console noise appears during homepage load and was not introduced or changed by this slice.
