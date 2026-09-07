# Go Nate Go modernization

September 7, 2026. Isolated branch `modernize/stable-performance`, based on `754db477`. The original checkout's 147 dirty/untracked files remain byte-for-byte unchanged. No production deployment or merge was performed.

## Adopted

- **Security:** Next.js and its ESLint config 16.3.1 → 16.3.4; React/React DOM 19.2.0 → 19.2.8. These include the maintainer's current security fixes; synchronized React/Node types and exact replacements for floating `latest` selectors keep installation reproducible. The registry audit reports zero vulnerabilities, but the official Next advisory—not that audit alone—motivated the patch. [Next security release](https://nextjs.org/blog/august-2026-security-release), [complete dependency audit](modernization-dependency-audit.md).
- **Animation:** consolidated duplicate Framer Motion/Motion installations into Motion 13.2.0. Strict LazyMotion loads homepage drag features only near the fundraising section; donate/404 use the smaller animation bundle. Delayed/failed downloads keep content and donation controls usable. The progress bar follows refreshed totals even if animations fail. Native image/link dragging no longer interrupts the merchandise carousel's intended drag; keyboard shop activation remains available.
- **Compatibility:** SWR 2.3.4 → 2.5.1 with donation polling regressions; Tailwind Merge 2.5.5 → 3.6.0 to match Tailwind 4. No Tailwind redesign or payment SDK migration.
- **TypeScript:** native 7.0.2 for `pnpm exec tsc --noEmit` / `pnpm typecheck`, alongside Microsoft's TypeScript 6 compatibility package for Next/ESLint's JavaScript compiler API. `pnpm typecheck:compat` checks that path too. A direct TS7-only replacement failed with those API consumers; the documented two-package arrangement passes both compilers and the production build. Strict checks remain enabled; obsolete `baseUrl` was removed and global types made explicit. [Microsoft compatibility recipe](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/).

Payment API handlers, checkout request construction, return states, receipt emails, DonorDrive ETag/cache behavior, factual copy, destinations, and campaign layout remain unchanged.

## Measured results

Three-run medians, same Mac/Chrome, cold browser, 390×844 mobile viewport, 4× CPU slowdown, 150ms latency and 1.6Mbps download. Local production servers use identical fixed donation data; external browser requests are blocked. JS includes asynchronous downloads completed four seconds after load, before any interaction. Decimal KB below. [Exact method and commands](modernization-measurement-method.md).

| Metric | Before | Accepted upgrade | Interpretation |
| --- | ---: | ---: | --- |
| Home initial JS, compressed | 214.37 KB | 198.67 KB | **7.3% less** |
| Donate initial JS, compressed | 228.31 KB | 228.58 KB | 0.1% more; essentially unchanged |
| Home requested HTML-script gzip | 213.54 KB | 197.92 KB | 7.3% less |
| Donate requested HTML-script gzip | 203.87 KB | 187.06 KB | 8.2% less; remaining features arrive asynchronously |
| Home LCP | 1,492 ms | 1,528 ms | Essentially unchanged |
| Donate LCP | 952 ms | 968 ms | Essentially unchanged |
| Home tap-to-second-frame proxy | 46.3 ms | 46.5 ms | No demonstrated improvement |
| Donate tap-to-second-frame proxy | 47.5 ms | 46.9 ms | No demonstrated improvement |
| Clean webpack build | 19.64 s | 19.37 s | Unchanged |
| Cold standalone type check | 4.01 s | 1.56 s | **61.1% faster** |
| Warm standalone type check | 2.38 s | 1.19 s | **50.0% faster** |

Event Timing medians remain 40ms home / 32ms donate; initial CLS is unchanged at approximately 0.00026 / 0.00005. The sample establishes less homepage JavaScript and faster standalone type checking, not faster field loading or improved INP. Timing ranges and individual runs are retained in the raw data. Final measurements were repeated after removing the compiler trial package; the disabled-compiler control remains separately archived.

**React Compiler 1.0.0 was tested and deferred.** With the same accepted code and `reactCompiler: true`, initial JS grew to 202.03 KB home / 232.25 KB donate, adding 3.36 / 3.67 KB versus the delivered dependency set. Tap response was 47.5 / 48.0ms, and the build median was 20.15s. No meaningful interaction improvement justified the added payload; its dependency and configuration were removed. This is a decision about this site's measured interactions, not a general compiler recommendation.

Other deferrals: Stripe SDK/API majors, Zod/ESLint/Lucide majors, email migrations, unrelated UI catalogs, and a Tailwind release beyond the targeted merge fix. They add compatibility scope without an identified feature or measured gain here. Existing React 19 peer warnings from the legacy Twitter embed wrapper remain; the wrapper is still loaded on intent/visibility and its official-link fallback is preserved. See the dependency audit for all current stable versions and rationale.

## Verification and preview

- `git diff --check`, `pnpm lint`, TS7 `tsc --noEmit`, TS6 `tsc6 --noEmit`, frozen install, and clean production build passed.
- Final production browser suite: **16 tests passed**. Coverage includes donation validation, cancellation/retry, visible/offscreen/error polling, poster-first media, no-JavaScript content, reduced motion, keyboard, mouse drag, and trusted touch swipe.
- Four manifest-based delayed/failed animation-loading scenarios passed, including refreshed progress geometry and donation state preservation.
- Ten normal/reduced-motion screenshot pairs match in visible copy, destinations, geometry, styles, and page height, with no horizontal overflow. See the [visual review](../output/modernization/visuals/README.md).
- Final npm audit: zero reported low, moderate, high, or critical vulnerabilities. Original checkout: all 147 recorded file hashes match.
- Vercel preview: [open preview](https://nate-the-great-4bb7yd20h-atkinsmatt10s-projects.vercel.app), deployment `dpl_DQFqkw1NPiujPhQs87LHSyWgdwB8`, source commit `6aaa3be`. READY with preview target, no production alias; cloud install, compilation, and type checking passed. Live Chrome verification passed with zero page errors: hero/poster, deferred features, merchandise selection, donation amount selection, and missing-details return state. The live donation proxy returned HTTP 200 ($8,450 / $30,000, 88 donations at verification) and conditional ETag revalidation returned 304. Preview Stripe keys are not configured; live payment completion cannot be demonstrated in that environment. Local checkout behavior is covered with intercepted responses; no real payment was submitted.

## Evidence

- [Baseline raw measurements](../output/modernization/baseline/measurements.json), [accepted raw measurements](../output/modernization/final/measurements.json), [compiler trial](../output/modernization/compiler/measurements.json).
- [Live preview verification](../output/modernization/preview/verification.json), [preview homepage](../output/modernization/preview/home-mobile.png), [preview checkout unavailable state](../output/modernization/preview/donate-mobile.png).
- [Home mobile screenshot](../output/modernization/final/home-mobile.png), [donate mobile screenshot](../output/modernization/final/donate-mobile.png).
- [Before/after screenshot gallery](../output/modernization/visuals/README.md), [animation-loading results](../output/modernization/final/motion-loading/verification.json), [production regression log](../output/modernization/final/regressions.log).
- [Source review and preservation evidence](../tasks/review/modernization.md), [animation architecture](modernization-motion-review.md).

Screenshots and raw logs remain local under `output/modernization/` and are excluded from both Git and Vercel uploads. The report, audit, reproduction scripts, and focused implementation commits are reviewable on the isolated branch.
