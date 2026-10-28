# Go Nate Go modernization — 2026-09-07

Worktree: `/private/tmp/go-nate-go-modernize`, branch `modernize/stable-performance`, base `754db477` from freshly fetched origin/main. Original checkout and its uncommitted experiments must remain unchanged.

Goal: patch stable security/compatibility gaps and adopt only measured, useful performance/tooling changes. Preserve factual copy, campaign design, accessibility, donation requests/status states, DonorDrive ETag/cache behavior, carousel swipe/keyboard/reduced motion, and intent-loaded media. Preview only; no production alias or deployment.

Plan and review batches:
1. Record installed/latest stable dependencies and primary-source advisories. Establish three-run clean webpack builds and cold/warm type checks, initial critical JS, throttled mobile loading, and controlled lab interactions.
2. Patch Next/React and focused compatible dependencies; pin formerly floating manifest selectors without opportunistic major migrations.
3. Measure a LazyMotion feature split retaining carousel drag. Keep only if it improves the critical bundle without UX regressions.
4. Evaluate stable TypeScript 7 with necessary compiler-API compatibility and React Compiler with measured build/interaction tradeoffs. Adopt or document deferral.
5. Run lint, standalone TypeScript, production build and production browser regressions; independently review diff and compare screenshots. Deploy and verify Vercel preview. Deliver raw data, methods, screenshots, decisions, and local-work preservation evidence.

Available local Next.js version-matched lazy-loading, React Compiler and TypeScript guides have been read. Historical custom workflow and TypeScript skill paths are absent (searched relocated skill roots); apply this explicit plan/refinement pass and existing strict compiler/lint rules. Vercel deploy skill found in vendor imports; preview verification is explicitly requested by the user.

Measurements are controlled lab data, not field INP or a production-network promise. Keep browser/hardware/throttling/cache/fixtures identical. Do not run builds or dependency installs concurrently with timing runs.
