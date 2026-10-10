# Next.js 16.4 upgrade and verification

Verified locally on October 10, 2026, from `origin/main` at `4773d0e` in branch `codex/nextjs-16-4`. This report records local validation completed before publication; deployment status is tracked in the pull request.

## Changes

- Upgrade Next.js and `eslint-config-next` from 16.3.4 to **16.4.0**, the registry's latest stable release on the verification date.
- Upgrade React, React DOM, and their type definitions to **19.3.0**. Keep the React type overrides aligned. Other package versions remain unchanged, apart from the corresponding Next.js platform packages and React scheduler.
- Add `await connection()` before the donation return page retrieves either a Checkout Session or Payment Intent. Stripe reads `Date.now()` before issuing its request. With the upgraded runtime, return URLs rendered successfully but also emitted an unstable-value prerendering error. The explicit request-time boundary keeps payment status live and removes that error. It sits outside the error handler so framework rendering control flow is not swallowed.
- Fix a pre-existing mobile overflow exposed by the live fundraiser exceeding its goal. The progress mascot's percentage-only positioning extended about 10 pixels past the viewport at 100%. A CSS clamp based on its responsive half-width keeps it inside the track at both ends, while preserving progress values and motion preferences.
- Retain the framework-generated heading normalization in the existing Next.js agent guidance.

Cache Components, Partial Prefetching, typed routes, the campaign design, donation caching policy, and the Webpack production build remain configured as before.

## Verification

| Check | Result |
| --- | --- |
| `pnpm lint` | Passed, including after the return-page repair |
| `pnpm exec tsc --noEmit` | Passed, including after the repair |
| `pnpm typecheck:compat` | Passed with the compatibility compiler, including after the repair |
| `pnpm exec next build --webpack` | Passed; 14 static-generation tasks completed |
| Full production Playwright suite | **29 passed**, no skips, failures, or flaky retries |
| Fundraiser checks after the mobile repair | **2 affected regressions passed**; **16 geometry checks passed** across 320, 390, 768, and 1440 px viewports and 0%, 50%, 100%, and over-goal totals; zero horizontal overflow |
| Additional production HTTP checks | **22 passed**; repeated after the repair |
| Existing motion-loading harness | All **4 scenarios passed**, including delayed and failed feature loading; repeated after the mobile repair |
| Default Turbopack development server | Started; homepage, donation, return, and birthday routes returned 200 |
| Live public APIs | Fundraiser 200 with valid data and ETag/304; birthday gallery 200 with 12 photos |
| Desktop/mobile browser inspection | Chrome desktop/mobile viewports: homepage, donation form, return, birthday archive, 404, fundraiser, and social section inspected |
| Browser navigation after repair | Return → donation → home passed; live fundraiser refreshed; no page exceptions or horizontal overflow |
| Experimental Turbopack production build | Passed; measured separately, not adopted |
| Original checkout preservation | All **172** pre-existing modified/untracked files remained hash-identical |

The full suite covers the shark interaction on desktop and touch, resize and visibility changes, reduced motion, data saving, WebGL failures, no-JavaScript fallbacks, poster-first video loading, merchandise keyboard and drag interaction, donation retry/cancellation, amount validation, fundraiser stale-data behavior, archived RSVP closure, and metadata/assets.

The additional HTTP checks exercised the actual production route handlers and server-rendered return pages. Stripe and email provider traffic went to a local synthetic service: successful checkout creation, exact public status fields without donor details, provider failure, legacy Payment Intent creation, ten return states, missing/invalid webhook signatures, and a signed synthetic webhook rendering a React 19.3 receipt into a local email sink. **No real payment, checkout session, or email was created.** After the repair, logs contained zero unstable-value/prerendering errors; intentionally triggered provider/signature errors remained expected.

Screenshots are retained locally under `output/playwright/next164/`. Raw logs, provider fixtures, analyzer graph, and measurements are under `/private/tmp/gonatego-next164-evidence/` on the verification machine. These artifacts are not part of a deployment.

Vercel-only analytics scripts return 404 on a local Next server. Third-party iframe permission warnings and the existing React peer-range warning from transitive `react-twitter-embed` remain nonblocking. Instagram and LinkedIn content loaded; X cards retained their working external-link fallback. Live Stripe payment-element completion, payment processing, external email delivery, and a deployed Vercel release were not exercised.

## Measured bundle comparison

Same source and production environment for the two 16.4 bundlers, with the return-page repair included. Measurements were captured before the small mascot-positioning fix. Values are decimal kB: the sum of gzip-compressed script files referenced in each emitted HTML document, including the `nomodule` script. They exclude later dynamic imports and third-party downloads, and are **not** browser transfer measurements, LCP, or field INP.

| Route | 16.3.4 Webpack | 16.4.0 Webpack | 16.4.0 Turbopack |
| --- | ---: | ---: | ---: |
| `/` | 239.1 kB | 240.0 kB | 254.1 kB |
| `/donate` | 226.5 kB | 227.3 kB | 241.2 kB |
| `/donate/return` | 200.3 kB | 201.1 kB | 223.6 kB |
| `/birthday` | 223.6 kB | 224.2 kB | 233.6 kB |

The normal upgrade adds about 0.3–0.4% to these Webpack totals. Turbopack produces 4.2–11.2% larger totals than 16.4 Webpack for this site, so changing the production bundler is not justified by bundle size. Its shared runtime could still improve cache reuse across navigations, which would need a separate browser benchmark. The tested Webpack build was restored after the experiment.

## Performance opportunities

1. **Use the new analyzer to reduce optional homepage work.** `pnpm exec next analyze --output --snapshot next164` and `next analyze export` identify approximately 534 kB of uncompressed Three.js module code and 510 kB of HLS code across reachable client chunks, including asynchronous chunks. These are not initial-load totals. The Mux player is already deferred until Play and passed the no-video-before-Play test. The ocean module is dynamically imported during idle time whenever the hero is visible. A useful next experiment is to defer its initialization until shark intent or activation, retaining the static illustration and reduced-motion/data-saving behavior. Measure first-tap delay and main-thread work before adoption. [Bundle analyzer documentation](https://nextjs.org/docs/app/guides/package-bundling)

2. **Protect intentionally static pages with `ensureStatic`.** `/birthday` is a direct candidate for `ensureStatic = 'navigation'`. `/donate` is already static, but its page is a Client Component and its layout also contains the dynamic return route; do not place a navigation-static requirement on that shared layout. Homepage and return-page shells can be assessed for `ensureStatic = 'shell'` or `'prefetch'`. Those levels control which stage can do request-time work; only `'navigation'` enforces a fully static route. Keep live fundraiser and payment status work dynamic. [Static-output requirements](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config/ensureStatic)

3. **Try lazy dynamic compilation for development.** The existing dynamic imports for Three.js, Mux, social embeds, and Motion make this app a good candidate for `experimental.turbopackLazyDynamicImports`. It reduces compilation of unused code during `next dev`; it does not reduce visitors' production JavaScript. `turbopackGc` is another optional experiment for long development sessions. The default 16.4 development cache/HMR improvements need no new flags. [Lazy dynamic imports](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopackLazyDynamicImports)

4. **Benchmark the Rust React Compiler before enabling it.** Test the donation form and merchandise carousel under matched CPU/network conditions, measuring interaction work, output size, and compile time. This remains experimental. Existing route transitions already use React's `ViewTransition`, now stable in React 19.3; another transition layer is unnecessary. [Next.js 16.4 features](https://nextjs.org/blog/next-16-4)

Separately, the donation page initializes Stripe.js at module load. Loading it on clear donation intent is worth measuring, but it can trade initial-load savings for checkout delay and wallet behavior. Preserve the tested retry and amount-change cancellation paths if pursuing that optimization.

No optional caching, bundler, or compiler experiments were enabled in the final application configuration.
