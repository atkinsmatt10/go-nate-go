# Dependency and release audit

Checked on 2026-09-07 against baseline commit `754db477` in the isolated modernization worktree. Versions are exact lockfile resolutions; “latest” means the live npm registry `latest` tag, verified with `pnpm outdated --format json` and targeted `pnpm view` reads. No prerelease tags are recommended. These are audit recommendations; the modernization report records the final adopted batches and measured results.

## Highest-value recommendations

1. **Patch Next.js and React first.** Move Next.js and its ESLint config from 16.3.1 to 16.3.4, and React/React DOM from 19.2.0 to 19.2.8. Next's August security release patched two critical issues at 16.3.3. The AVIF optimizer issue is relevant to a configuration enabling AVIF with remote images; the Windows-only mixed-router issue does not match this App Router/cache-components app on Vercel. Patched Next releases disable unsafe AVIF optimization pending the upstream fix. The React patch also includes RSC decoding performance improvements. Keep the two React packages synchronized. [Next security release](https://nextjs.org/blog/august-2026-security-release), [React 19.2.8](https://github.com/react/react/releases/tag/v19.2.8).
2. **Use one animation package and measure lazy features.** The baseline resolves `framer-motion` 12.23.3 alongside unused direct `motion` 12.38.0, which itself resolves another Framer Motion. Consolidate on stable Motion 13.2.0 and its supported imports, or use 12.43.0 if the migration exposes a problem. Motion 13 removes implicit Emotion prop filtering; this app uses Tailwind and no Styled Components/Emotion styling imports were found. `motion/react-m` with `LazyMotion` permits deferring features after hydration. Use `domAnimation` for transforms, variants, exits and hover/tap; retain `domMax` where drag/layout are used. Normal `motion` components inside the lazy tree erase the saving; `strict` can detect them. Avoid hiding essential content while the feature chunk loads. Vendor size examples are not this site's measurements. [Upgrade guide](https://motion.dev/docs/react-upgrade-guide), [bundle guidance](https://motion.dev/docs/react-reduce-bundle-size).
3. **Evaluate stable TypeScript 7.0.2 using actual timings.** TypeScript 7 is a stable native compiler, released July 8, 2026. Next 16.3's bundled docs say it invokes project-local `tsc` by default. The baseline `baseUrl` must be removed because TS7 no longer supports it; existing `paths` already use relative values. Explicit global `types` and side-effect module declarations may be needed due to changed defaults. TS7 has no JavaScript compiler API. If ESLint or editor tooling needs it, Microsoft documents `typescript: npm:@typescript/typescript6@6.0.2` with a second alias `@typescript/native: npm:typescript@7.0.2`; the latter provides `tsc`, the former provides `tsc6` and the legacy API. Keep only if lint, full type checking and Next build all agree and elapsed time improves. [Microsoft release and compatibility recipe](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [Next TypeScript guide](https://nextjs.org/docs/app/api-reference/config/typescript).
4. **Evaluate React Compiler 1.0.0 separately.** Its stable automatic memoization can reduce render work; it does not guarantee lower initial JS or faster builds. Use Next's stable `reactCompiler` option and stable `babel-plugin-react-compiler` 1.0.0. Test in an independent batch using identical interactions and build settings; annotation mode allows a narrower adoption if useful. Adopt only with measured benefit and passing behavior tests. [React stable release](https://react.dev/blog/2025/10/07/react-compiler-1), [Next configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/reactCompiler).
5. **Correct Tailwind's merge compatibility.** Baseline Tailwind is 4.2.2 but `tailwind-merge` is 2.5.5, the Tailwind 3 line. Stable `tailwind-merge` 3.6.0 supports Tailwind 4.3. Its class-conflict behavior can alter CSS output, so update in a discrete batch with screenshots. Tailwind and its PostCSS plugin have a stable 4.3.3 release; pair them if adopted. [Tailwind Merge 3.6.0 release](https://github.com/dcastil/tailwind-merge/releases/tag/v3.6.0), [v3 migration](https://github.com/dcastil/tailwind-merge/releases/tag/v3.0.0).
6. **Consider SWR 2.5.1 with donation polling tests.** It includes cache hydration/remount/subscription fixes. The fundraising card uses SWR directly, so preserve polling visibility/error behavior, ETag handling and route cache headers in regressions. [SWR 2.5.1](https://github.com/vercel/swr/releases/tag/v2.5.1).

## Security audit limitation

Baseline `pnpm audit --json` returned zero low, moderate, high or critical advisories across 656 dependencies. That conflicts with the independently verified Next security release applicable to the old framework version. It is evidence of what the registry audit reported, not proof that the baseline is fully patched. Prioritize the official maintainer advisory and rerun audit after the dependency changes.

## Deliberate deferrals

- **Stripe SDK majors:** `stripe` 20.4.0 -> 22.6.1; browser wrappers also have major updates. `lib/stripe.ts` deliberately pins API version `2026-02-25.clover` as `Stripe.LatestApiVersion`. Stripe's major SDK releases can accompany API breaking changes. No feature requiring a payment migration was identified. Retain existing checkout/session/return paths and upgrade in a dedicated payment project with Stripe test-mode contract coverage. [Stripe versioning policy](https://docs.stripe.com/sdks/versioning), [Stripe Node SDK](https://github.com/stripe/stripe-node).
- **Unused catalogs and dependencies:** Radix and other catalog packages have available updates, but changing every UI package adds review/regression scope without proving a homepage gain. Existing local slop-audit documentation plus source searches identify unused direct `dayjs`, `@hookform/resolvers` and `motion`; remove only after import/peer checks. The canonical future `motion` package replaces, rather than duplicates, `framer-motion`.
- **Email:** `@react-email/components` 1.0.12 is marked deprecated by registry metadata, while the baseline receipt imports `Button` and `Preview` from this package. Do not swap email components or remove `@react-email/render` blindly; rendering is required by the Resend path. Keep receipt work in a separate render-verified batch. Mux 3.13.2, Number Flow 0.6.2, Resend 6.26.0 and web-haptics 0.0.6 were not reported outdated.
- **Other unrelated majors:** Zod 4, ESLint 10, Lucide 1, calendar/panel majors and Vercel analytics 2 need their own compatibility/behavior rationale. Upgrade React types in step with runtime patches if useful, but retain a Node type major matching the deployment runtime instead of following `@types/node@latest` mechanically. Changing Playwright during the benchmark would change Chromium conditions; hold its version/browser fixed for before/after measurements.
- **Runtime and reproducibility:** Keep the measured host Node 26 and Vercel Node 22 environments explicit; do not change runtime or pnpm majors during comparison. The current stable `@types/node` 22 maintenance release is 22.20.1. Replace floating `latest` manifest specifications with their currently locked versions first, so subsequent upgrades remain deliberate and reviewable; a frozen pnpm lockfile continues to govern installation.
- **Prereleases:** Registry tags include Next `16.4.0-canary.19` and TypeScript `7.1.0-dev.20260907.1`; both are excluded. Stable TypeScript 7.0.2 and React Compiler 1.0.0 should not be mislabeled preview software.

## Complete direct dependency inventory

Stable versions are point-in-time observations. No update in this table implies an automatic recommendation to install it.

| Package | Baseline locked | Registry latest stable | Change |
| --- | --- | --- | --- |
| `@emotion/is-prop-valid` | 1.3.1 | 1.4.0 | Minor |
| `@hookform/resolvers` | 3.9.1 | 5.9.1 | Major |
| `@mux/mux-player-react` | 3.13.2 | 3.13.2 | Current stable |
| `@number-flow/react` | 0.6.2 | 0.6.2 | Current stable |
| `@playwright/test` | 1.62.1 | 1.63.0 | Minor |
| `@radix-ui/react-accordion` | 1.2.11 | 1.2.20 | Patch |
| `@radix-ui/react-alert-dialog` | 1.1.14 | 1.1.23 | Patch |
| `@radix-ui/react-aspect-ratio` | 1.1.7 | 1.1.15 | Patch |
| `@radix-ui/react-avatar` | 1.1.10 | 1.2.6 | Minor |
| `@radix-ui/react-checkbox` | 1.3.2 | 1.3.11 | Patch |
| `@radix-ui/react-collapsible` | 1.1.11 | 1.1.20 | Patch |
| `@radix-ui/react-context-menu` | 2.2.15 | 2.3.7 | Minor |
| `@radix-ui/react-dialog` | 1.1.14 | 1.1.23 | Patch |
| `@radix-ui/react-dropdown-menu` | 2.1.15 | 2.1.24 | Patch |
| `@radix-ui/react-hover-card` | 1.1.14 | 1.1.23 | Patch |
| `@radix-ui/react-label` | 2.1.7 | 2.1.15 | Patch |
| `@radix-ui/react-menubar` | 1.1.15 | 1.1.24 | Patch |
| `@radix-ui/react-navigation-menu` | 1.2.13 | 1.2.22 | Patch |
| `@radix-ui/react-popover` | 1.1.14 | 1.1.23 | Patch |
| `@radix-ui/react-progress` | 1.1.7 | 1.1.16 | Patch |
| `@radix-ui/react-radio-group` | 1.3.7 | 1.4.7 | Minor |
| `@radix-ui/react-scroll-area` | 1.2.9 | 1.2.18 | Patch |
| `@radix-ui/react-select` | 2.2.5 | 2.3.7 | Minor |
| `@radix-ui/react-separator` | 1.1.7 | 1.1.15 | Patch |
| `@radix-ui/react-slider` | 1.3.5 | 1.4.7 | Minor |
| `@radix-ui/react-slot` | 1.2.3 | 1.3.3 | Minor |
| `@radix-ui/react-switch` | 1.2.5 | 1.3.7 | Minor |
| `@radix-ui/react-tabs` | 1.1.12 | 1.1.21 | Patch |
| `@radix-ui/react-toast` | 1.2.14 | 1.2.23 | Patch |
| `@radix-ui/react-toggle` | 1.1.9 | 1.1.18 | Patch |
| `@radix-ui/react-toggle-group` | 1.1.10 | 1.1.19 | Patch |
| `@radix-ui/react-tooltip` | 1.2.7 | 1.2.16 | Patch |
| `@react-email/components` | 1.0.10 | 1.0.12 | Patch |
| `@react-email/render` | 2.0.4 | 2.1.0 | Minor |
| `@stripe/react-stripe-js` | 5.6.1 | 6.9.0 | Major |
| `@stripe/stripe-js` | 8.9.0 | 9.15.0 | Major |
| `@tailwindcss/postcss` | 4.2.2 | 4.3.3 | Minor |
| `@types/node` | 22.0.0 | 26.5.0 | Major |
| `@types/react` | 19.2.4 | 19.2.18 | Patch |
| `@types/react-dom` | 19.2.3 | 19.2.7 | Patch |
| `@vercel/analytics` | 1.5.0 | 2.0.1 | Major |
| `@vercel/speed-insights` | 1.2.0 | 2.0.0 | Major |
| `class-variance-authority` | 0.7.1 | 0.7.1 | Current stable |
| `clsx` | 2.1.1 | 2.1.1 | Current stable |
| `cmdk` | 1.1.1 | 1.1.1 | Current stable |
| `date-fns` | 4.1.0 | 4.4.0 | Minor |
| `dayjs` | 1.11.13 | 1.11.23 | Patch |
| `embla-carousel-react` | 8.6.0 | 8.6.0 | Current stable |
| `eslint` | 9.39.1 | 10.10.0 | Major |
| `eslint-config-next` | 16.3.1 | 16.3.4 | Patch |
| `framer-motion` | 12.23.3 | 13.2.0 | Major |
| `input-otp` | 1.4.2 | 1.5.0 | Minor |
| `lucide-react` | 0.454.0 | 1.42.0 | Major |
| `motion` | 12.38.0 | 13.2.0 | Major |
| `next` | 16.3.1 | 16.3.4 | Patch |
| `next-themes` | 0.4.6 | 0.4.6 | Current stable |
| `postcss` | 8.5.28 | 8.5.28 | Current stable |
| `react` | 19.2.0 | 19.2.8 | Patch |
| `react-day-picker` | 9.8.0 | 10.0.1 | Major |
| `react-dom` | 19.2.0 | 19.2.8 | Patch |
| `react-hook-form` | 7.60.0 | 7.87.0 | Minor |
| `react-resizable-panels` | 3.0.3 | 4.12.4 | Major |
| `react-social-media-embed` | 2.5.18 | 2.5.18 | Current stable |
| `recharts` | 3.1.0 | 3.10.1 | Minor |
| `resend` | 6.26.0 | 6.26.0 | Current stable |
| `sonner` | 2.0.6 | 2.0.8 | Patch |
| `stripe` | 20.4.0 | 22.6.1 | Major |
| `swr` | 2.3.4 | 2.5.1 | Minor |
| `tailwind-merge` | 2.5.5 | 3.6.0 | Major |
| `tailwindcss` | 4.2.2 | 4.3.3 | Minor |
| `tailwindcss-animate` | 1.0.7 | 1.0.7 | Current stable |
| `typescript` | 5.9.3 | 7.0.2 | Major |
| `vaul` | 1.1.2 | 1.1.2 | Current stable |
| `web-haptics` | 0.0.6 | 0.0.6 | Current stable |
| `zod` | 3.24.1 | 4.5.4 | Major |
