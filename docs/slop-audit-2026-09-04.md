# Go Nate Go slop audit — September 4, 2026

Audited application code, shared components, hooks, helpers, dependencies, and all 13 tests. Traced imports, re-exports, `require`, and dynamic imports with the installed TypeScript parser, starting from App Router files and tests, then checked candidate names across the repository.

## Cleaned up

| Finding | Evidence and change | Net source lines removed |
| --- | --- | ---: |
| Retired birthday RSVP email implementation | `/api/birthday-rsvp` unconditionally returns 410. Deleted the unreferenced sender and its email template; donation receipt email remains active. | 501 |
| Retired birthday countdown | No route or retained component imports the countdown or its split-flap implementation. Deleted both files. | 525 |
| Duplicate toast store | `components/ui/use-toast.ts` had no importers and duplicated `hooks/use-toast.ts`. Deleted the duplicate; retained the canonical hook and shared toast components. | 196 |
| Unused theme wrapper | `components/theme-provider.tsx` had no importers. Removed it. | 11 |
| Unused animation exports | Removed `MOTION_EASE_IN_OUT` and `MOTION_EASE_DRAWER`; neither had callers. | 2 |
| Redundant fundraising aliases | Used `raised`, `numDonations`, and `progressPercentage` directly instead of three identity aliases. | 3 |

Total: **1,238 net production source lines removed; six files deleted.** This measures maintenance reduction, not browser bundle savings. Also updated the README to describe the birthday archive and removed obsolete RSVP setup instructions.

## Tests

Kept all 13 tests. They exercise checkout failures and cancellation, malformed upstream responses, request timeouts, payment validation, media loading, JavaScript-disabled rendering, reduced motion, polling, metadata, and the birthday archive.

Fixed weaknesses in the existing tests and their configuration:

- Offscreen polling was checked only after an HTTP 502. SWR's error behavior could stop normal polling even if offscreen pausing were broken. The test now verifies successful polling, checks that it stops offscreen while responses still succeed, and then verifies failure retention after returning onscreen.
- Invalid checkout amounts lacked a valid email, so the route test could fail on email alone. Those payloads now include a valid email.
- The JavaScript-disabled test manually managed a browser context and hardcoded the server address. It now uses scoped Playwright fixtures and the configured base URL.
- Verification exposed two test-server issues: an existing server could be silently reused without the test Stripe configuration, and Next.js blocked development resources on `127.0.0.1`. Tests now start a fresh server using `localhost`; `PLAYWRIGHT_PORT` selects an available port and controls both the server and browser URL.

## Retained deliberately

- `PageTransition` shares transition configuration across routes.
- `HeroStoryVideo` owns the interactive video boundary and deferred player loading.
- `useHapticFeedback` centralizes supported haptic behavior and is required by the project guide.
- Donation cache helpers preserve validated snapshots and serve the homepage and API. Request validation, timeouts, ETags, and stale-data handling are useful safeguards.
- Carousel pause/reduced-motion state and Instagram iframe labeling implement user-facing behavior and accessibility.
- The payment-intent endpoint and return state remain part of the documented compatibility surface; internal import reachability alone cannot establish that a public endpoint is unused.

## Remaining candidates

1. **Unused shared UI catalog:** 46 retained files under `components/ui/` (4,571 lines) are unreachable from current routes and tests. Only `button.tsx` and `carousel.tsx` are currently reachable. The project explicitly treats this directory as a reusable shadcn layer, so catalog removal should be a separate, reviewable slice paired with dependency cleanup. Large examples are `sidebar.tsx`, `chart.tsx`, `menubar.tsx`, and the menu/form families.
2. **Unused direct dependencies:** `motion`, `dayjs`, and `@hookform/resolvers` have no remaining source imports. Remove these in a dependency/lockfile cleanup. Do not blindly remove every package without imports: Resend declares `@react-email/render` as a peer, Framer Motion declares `@emotion/is-prop-valid`, and the retained calendar dependency uses `date-fns`.
3. **Imperative hover styling:** the Substack link in `components/sharing-nates-story.tsx` uses two mouse handlers solely for colors; ordinary CSS hover classes could replace them in a small UI cleanup.
4. **Unused gallery captions:** birthday photo captions are produced and validated but never displayed. Simplifying them would touch a public response contract and should account for older open clients.
5. **Stale contributor instructions:** `AGENTS.md` points at an old home directory and deployment root, mentions a team ID different from the current source, and claims TypeScript build errors are ignored although the current `next.config.mjs` no longer sets that option. Reported without changing campaign facts or contributor configuration during this code cleanup.

## Verification

- Baseline lint and strict TypeScript: passed.
- Updated production build (`pnpm exec next build --webpack`): passed. Google Drive DNS was unavailable during prerendering; the existing birthday-photo fallback handled it.
- Final `pnpm lint`, `pnpm exec tsc --noEmit`, and `git diff --check`: passed.
- `PLAYWRIGHT_PORT=3194 pnpm test`: **13 passed**, including both checkout regressions and the strengthened polling test.
- Mutation check: temporarily disabling both offscreen polling guards produced a third request and failed the intended assertion (expected two, received three). Restored the exact source, then passed the full suite.
- No retained imports reference the six removed files. The user’s hero and mobile Safari changes remain intact.

The development run emitted Next.js router/stream/Fast Refresh errors, including a JSON parse error, plus media/image warnings; passing the behavior assertions does not establish a clean browser console. These runtime messages were not addressed by this cleanup. The production build passed, but production-mode browser tests with a test-key build were not run. Initial test attempts also exposed the server-origin/configuration issues corrected above.

## Review

The cleanup changes no routes, payment contracts, caches, campaign copy, or rendering structure. Existing hero/mobile Safari changes were preserved; a separate commit recorded those changes while this audit was running. Shared UI dependencies and assets remain intact. Each deletion group can be restored independently from Git without migrations or configuration changes. No deployment was performed.
