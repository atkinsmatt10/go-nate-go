# Modernization measurement method

Recorded September 7, 2026. The preserved baseline is `output/modernization/baseline/`. The earlier `after/` results are provisional experiments; use the accepted implementation's `final/` results for the final comparison and `compiler/` for the separate React Compiler experiment. Do not combine measurements from different candidates.

## Reproduction

Run from the relevant isolated worktree with its frozen dependency installation. Keep the same machine, Node, pnpm, Chrome version, environment, and measurement script. Finish builds and installations before browser timing; do not run other builds or browser suites during timing. Use a fresh output label when repeating a run.

The timed build command used a dummy public Stripe key so the donation page followed its configured UI path. This value is not a working payment credential. The initial `baseline/unconfigured/` builds are excluded from comparisons.

```sh
measurement_label=rerun-baseline
mkdir -p "output/modernization/$measurement_label"

for trial in 1 2 3; do
  rm -rf .next tsconfig.tsbuildinfo
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_site_review \
    /usr/bin/time -p pnpm exec next build --webpack \
    > "output/modernization/$measurement_label/build-$trial.log" 2>&1
done

for trial in 1 2 3; do
  rm -f tsconfig.tsbuildinfo
  /usr/bin/time -p pnpm exec tsc --noEmit \
    > "output/modernization/$measurement_label/type-cold-$trial.log" 2>&1
  /usr/bin/time -p pnpm exec tsc --noEmit \
    > "output/modernization/$measurement_label/type-warm-$trial.log" 2>&1
done
```

These are elapsed `real` times. Each build removes compiler output and incremental state; the OS filesystem cache and pnpm store are retained. Cold standalone type checking removes `tsconfig.tsbuildinfo`; the immediately following warm check retains it. Generated Next route types remain available after the production build. Framework builds also run their configured TypeScript check.

Start the production server with the explicit server-side fixture:

```sh
NODE_OPTIONS=--import=./scripts/benchmark-fixtures.mjs \
  pnpm exec next start --hostname localhost --port 3194
```

The fixture replaces only `https://chop.donordrive.com/api/1.6/teams/nate-the-great`: goal $30,000, raised $7,543, 66 donations. Other server fetches retain their normal implementation. This removes variable upstream response time from homepage streaming. The application never imports the fixture. The preserved baseline server can run separately on port 3196, but recorded baseline and `after` timing both used port 3194.

In another terminal, from the same worktree and matching `.next` build:

```sh
node scripts/measure-modernization.mjs \
  --base-url http://localhost:3194 \
  --project-root "$PWD" \
  --label rerun-baseline \
  --runs 3 \
  --out output/modernization/rerun-baseline
```

Each trial launches a fresh headless Chrome for `/`, then a fresh Chrome for `/donate`. Browser cache and service workers are disabled. Conditions are 390×844 CSS pixels, DPR 3, mobile/touch, 4× CPU slowdown, 150ms network latency, 1.6Mbps download and 750Kbps upload. Locale is `en-US`, time zone `America/New_York`, light color scheme, and normal motion preference. The capture occurs four seconds after `load`, before scrolling or tapping.

All external browser requests are aborted. `/api/donations` returns the same fixed total; `/api/stripe/**` and other writes are intercepted locally with HTTP 503. No real checkout is created. Mobile screenshots are taken in the first trial. Separate desktop/full-page visual captures and `verify-motion-loading.mjs` are functional checks, not timing samples.

## Metric definitions

- **Requested document-script gzip:** local gzip level 9 sizes of HTML script references actually requested by Chrome before the snapshot. This excludes the 39,373-byte `nomodule` polyfill. The older all-document field includes that unused polyfill and must not be presented as bytes Chrome downloaded. The baseline requested-document field was derived from its saved raw paths and byte sizes without remeasurement.
- **Initial JavaScript encoded/decoded bytes:** Resource Timing totals for completed same-origin `.js` requests before the snapshot, including asynchronous imports and prefetches. Encoded bytes reflect response compression; decoded bytes reflect uncompressed bodies. Neither includes inline script text. Inline bytes and transfer bytes are separately retained in raw JSON. An import moved out of HTML can still appear in this total; report both measures when evaluating lazy loading.
- **FCP/LCP:** observed paint times from navigation start. LCP is the latest observed candidate at the initial snapshot. **CLS** uses the maximum session window, excluding shifts with recent input, over this initial observation period.
- **Long-task blocking:** sum of `max(duration − 50ms, 0)` for observed long tasks starting after FCP and before the snapshot. This is a fixed-window approximation, not Lighthouse TBT.
- **Lab interactions:** three trusted touchscreen taps per route per trial: merchandise selections on `/`, amount selections on `/donate`. Each waits 700ms after scrolling, then records input timestamp to the second animation frame and Event Timing duration. Reported values are medians across nine taps per route. Event Timing takes the maximum observed entry per tap, is quantized, and has a 16ms threshold; null means no qualifying entry. These are response proxies, not displayed-pixel measurements or field INP.

## Preserved baseline

Hardware: Apple M1, 8 logical CPUs, 16GiB memory, macOS/arm64; Node 26.8.1; Chrome 152.0.7977.83. The recorded baseline, accepted `final`, and `compiler` files have identical hardware, browser version, and browser configuration. Baseline browser capture completed at `2026-09-07T21:15:16.921Z`.

| Median metric | Home | Donate |
| --- | ---: | ---: |
| Requested document-script gzip bytes | 213,542 | 203,870 |
| Initial JS encoded bytes | 214,368 | 228,312 |
| Initial JS decoded bytes | 688,594 | 727,956 |
| FCP | 1,020ms | 952ms |
| LCP | 1,492ms | 952ms |
| CLS | 0.000256 | 0.000053 |
| Long-task blocking approximation | 114ms | 76ms |
| Lab input-to-second-frame latency | 46.3ms | 47.5ms |
| Lab Event Timing maximum per tap | 40ms | 32ms |

| Development timing | Baseline runs, seconds | Baseline median | Accepted `final` median |
| --- | --- | ---: | ---: |
| Clean webpack production build | 19.64 / 19.69 / 18.69 | 19.64s | 19.37s |
| Cold standalone type check | 4.72 / 4.01 / 4.00 | 4.01s | 1.56s |
| Warm standalone type check | 2.40 / 2.38 / 2.38 | 2.38s | 1.19s |

## Interpretation limits

Three runs are a small sample, with host scheduling, thermal state, filesystem caches, and initial server work still variable. Baseline home LCP ranged from 1,488–2,072ms; the provisional `after` range was 1,476–1,584ms. Small median changes are not evidence of a loading or interaction speedup. Preserve individual runs alongside medians and report regressions as well as gains.

Blocking external requests makes comparison repeatable but excludes actual Stripe loading, Mux playback, social embeds, analytics, third-party latency, and real payment completion. The exact expected `Failed to load Stripe.js` rejection is identified separately from application errors. These local results do not establish production Core Web Vitals, field INP, or Vercel network performance. Preview behavior and the deployment runtime require separate verification.
