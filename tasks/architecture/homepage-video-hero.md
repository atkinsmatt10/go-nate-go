# Architecture Review

## Slice Boundary

Change the homepage hero presentation, add the official Mux React player dependency, and record the public playback ID in frontend configuration. Keep `app/page.tsx`, the existing `CampaignMarquee` component and copy, CTA routes, donation flows, downstream sections, and all server APIs unchanged. Any global CSS additions are limited to hero decoration, Mux-player presentation, and reduced-motion behavior.

## Architecture Summary

`HeroSection` remains a client component because it uses the existing Framer Motion entrance helpers. The photo-carousel state, timer, drag gestures, and haptics leave the hero. A single official Mux React player receives a hardcoded public playback ID, on-demand stream metadata, and an approved thumbnail time. Mux Player supplies the accessible central play control and post-start media controls; no separate watch button or custom playback state machine is added. The visible `videoTitle` configuration is omitted so the poster presents only the Play action, while `metadata.video_title` remains available to Mux analytics.

Decorative fish are inline SVG silhouettes in an `aria-hidden`, pointer-events-disabled layer. Each silhouette uses the existing Framer Motion runtime for an 8–12px transform-only drift with varied 10–16 second durations and delays. The shared `usePrefersReducedMotion()` hook keeps every fish at a zero transform instead of starting a loop.

## Data Flow

```text
public playback ID in frontend configuration
  -> HeroSection
       -> MuxPlayer (no autoplay, on-demand stream)
            -> poster from image.mux.com at approved thumbnail time
            -> adaptive HLS playback from stream.mux.com after user presses Play

MUX_TOKEN_ID + MUX_TOKEN_SECRET (encrypted Vercel integration credentials)
  -> administrative Mux API inspection / playback-ID creation
  -> available to Production and Preview, but unused by application runtime
  -> never imported by or bundled into the client application
```

## State Transitions

- Initial render: the approved 6:5 cover poster is visible; Mux Player exposes one central Play control; media remains paused.
- Play activation: a pointer or keyboard action starts playback, the widescreen video uses `contain` against the navy player surface, and Mux Player exposes its normal on-demand controls.
- Pause/resume/seek/fullscreen: Mux Player owns the control state and accessibility behavior.
- Reduced motion: hero entrance helpers use their opacity-only branch, fish motion stays at a zero transform, and marquee scroll is disabled.

## Trust Boundaries

- `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` are encrypted Vercel integration credentials used only for authenticated Mux administration. The homepage runtime does not read them, and they are never printed, committed, or exposed to the client.
- The playback ID is intentionally public and may be bundled in client code.
- Mux hosts the public poster and stream. Failure to load must not block the Donate or Shop actions.
- The Shop link preserves its existing new-tab destination and safety attributes. Donate preserves the current direct CHOP team destination and label.

## Edge Cases And Failure Modes

- The existing Mux asset may be ready without a playback ID; add a public ID to that asset instead of uploading a duplicate.
- Player poster cropping must keep Nate and his family visible in the approved 6:5 frame at both responsive sizes. Moving footage must use `contain` because a representative source-footage crop audit showed that `cover` removes broadcast marks and edge-aligned source labels.
- The controls backdrop must use a translucent navy strong enough to preserve white-control contrast over bright footage without presenting as a black toolbar.
- Player chrome must not expose a second visible or focusable Play control before playback.
- A slow Mux response must preserve the poster frame geometry and prevent layout shift.
- Decorative fish must not intercept input, enter the accessibility tree, or move under reduced motion.
- The diagonal ribbon must retain its overlap without causing page-level horizontal overflow.
- The hero must preserve CTA labels, routes, and minimum target sizes at narrow widths.

## Test Matrix

| Case | Expected result |
| --- | --- |
| Desktop representative viewport | Left content and CTAs, large right-side 6:5 video, diagonal ribbon retained |
| `390x844` | Logo/copy/actions first, video second, no horizontal overflow |
| Initial video state | Paused poster with exactly one central Play control |
| Keyboard playback | Play, pause, seek, and player controls remain keyboard usable |
| Reduced motion | Fish transforms remain `none`; hero entrance is opacity-only; ribbon uses its static line |
| Mux unavailable or slow | Hero layout and Donate/Shop actions remain usable |
| Static verification | `pnpm lint`, `pnpm exec tsc --noEmit`, focused browser checks, and `git diff --check` pass |

## Rollout, Rollback, And Observability

This is a frontend-only review slice plus one public playback-ID creation on the existing Mux asset. There is no database migration or application runtime secret dependency. Code rollback is a focused component/CSS/dependency revert; the public playback ID may remain harmlessly attached to the asset if the code is rolled back. Local screenshots, accessibility snapshots, computed reduced-motion styles, live player interaction, and an authenticated Production-scoped Mux API check provide verification evidence. The follow-up release is explicitly authorized: push a feature branch for preview verification, merge the reviewed pull request, then track the exact merged SHA to a READY production deployment.
