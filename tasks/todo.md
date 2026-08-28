# Homepage Video Hero

- [x] Reframe the approved slice in [tasks/context/homepage-video-hero.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/homepage-video-hero.md)
- [x] Capture the implementation boundary in [tasks/architecture/homepage-video-hero.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/architecture/homepage-video-hero.md)
- [x] Record the approved pre-build UI review in [tasks/design/homepage-video-hero.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/homepage-video-hero.md)
- [x] Reuse the existing Mux asset and create a public playback ID
- [x] Install the official Mux React player and implement the responsive hero
- [x] Verify desktop, `390x844`, player controls, accessibility, and reduced motion
- [x] Complete screenshot refinement, pre-merge review, deslop, and documentation notes
- [x] Run `pnpm lint`, `pnpm exec tsc --noEmit`, and `git diff --check`

### Video Hero Verification Notes

- Reused the ready `720p` Mux asset for the supplied `3:39.9` source and attached one public playback ID; no duplicate upload was created.
- Browser geometry at `390x844` matched document width to viewport width and kept content/CTAs before the `6:5` player, followed by the existing diagonal ribbon.
- The pre-play accessibility snapshot exposed one `video player` region and exactly one Play button; the player had no autoplay attribute.
- Enter started playback, Space paused it, and the seek value stayed fixed after pausing.
- Reduced-motion emulation disabled fish animation and transform completely and preserved the existing static ribbon fallback.
- Framer Motion now owns the six independent fish drifts; live Browser samples changed over time while reduced-motion samples remained at `transform: none`.
- The desktop screenshot confirmed a two-line campaign heading, dominant right-side video, sparse fish, restrained crop, and existing wave/shark transition.
- A full-duration contact-sheet crop audit found that 6:5 `cover` playback clipped broadcast marks and source labels, so the poster remains cropped while moving footage uses `contain` against navy.
- Live Browser playback confirmed the 1280×720 stream advances in the contained frame with the 6abc corner mark intact.
- The visible player title is omitted while Mux analytics metadata is retained; the controls backdrop uses 58% navy for contrast.
- Reconciled the release onto current production main while preserving the shared reduced-motion hook, Next.js 16.3 image API, and current direct CHOP Donate destination.
- Vercel lists encrypted `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` variables for Production and Preview; a temporary Production-scoped pull authenticated to Mux and returned the ready asset with the expected public playback ID.
- `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`, and `git diff --check` passed; the existing unrelated workspace-root warning remains non-blocking.

# Birthday Page Celebration Plan

## Homepage Campaign Marquee

- [x] Reframe the request in [tasks/context/homepage-campaign-marquee.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/homepage-campaign-marquee.md)
- [x] Complete the pre-build review in [tasks/design/homepage-campaign-marquee.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/homepage-campaign-marquee.md)
- [x] Add the campaign marquee between the hero and Nate's story
- [x] Verify seamless motion, mobile layout, and the reduced-motion fallback
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Complete screenshot review, pre-merge review, refinement, and documentation notes

### Marquee Verification Notes

- `pnpm lint` passed.
- `pnpm exec tsc --noEmit` passed.
- Desktop and mobile screenshots confirmed the ribbon keeps clear space from the hero actions and story heading.
- At 390px, document width matched viewport width and both repeated phrase groups measured 1120px.
- Reduced-motion emulation hid the moving track and displayed the static campaign line.
- The accessibility snapshot exposed one region with one copy of all five rallying cries.
- The simplify and deslop passes found no unnecessary abstraction, defensive code, comments, or style drift to remove.

## Nate's Journey Editorial Timeline

- [x] Reframe the request in [tasks/context/nates-journey-editorial-timeline.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/nates-journey-editorial-timeline.md)
- [x] Complete the pre-build review in [tasks/design/nates-journey-editorial-timeline.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/nates-journey-editorial-timeline.md)
- [x] Reshape Nate's existing story copy into the five-milestone editorial timeline
- [x] Add the family quote and compact Pediatric Brain Tumor Foundation story action
- [x] Verify desktop, mobile, and reduced-motion presentation in the browser
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Complete refinement, pre-merge review, and documentation notes

### Nate's Journey Verification Notes

- `/opt/homebrew/bin/pnpm lint` passed.
- `/opt/homebrew/bin/pnpm exec tsc --noEmit` passed.
- Desktop browser review confirmed the centered introduction, two-column chronology, quote, and compact external-story action.
- Responsive browser review confirmed stacked date/content rows and no document-level horizontal overflow at the narrow viewport.
- The story section is static rather than transform-driven, making every milestone immediately available when reduced motion is preferred.
- The Pediatric Brain Tumor Foundation action renders once and preserves the existing full-story URL.
- A slim teal rail connects the desktop date markers, inspired by Mobbin's Wise timeline pattern; the rail is hidden in the stacked mobile layout.

## Fundraising Progress Celebration

- [x] Reframe the request in [tasks/context/fundraising-progress-celebration.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/fundraising-progress-celebration.md)
- [x] Record the data and animation plan in [tasks/architecture/fundraising-progress-celebration.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/architecture/fundraising-progress-celebration.md)
- [x] Complete the pre-build review in [tasks/design/fundraising-progress-celebration.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/fundraising-progress-celebration.md)
- [x] Add NumberFlow and replace the hand-built counter loops
- [x] Rebuild the section hierarchy, shark-led progress track, supporter pill, and CTA
- [x] Verify fallback data, preserve the live contract, and check desktop, mobile, reduced-motion, semantics, and CTA presentation
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Complete refinement, pre-merge review, and documentation notes

### Fundraising Progress Verification Notes

- `/opt/homebrew/bin/pnpm lint` passed.
- `/opt/homebrew/bin/pnpm exec tsc --noEmit` passed.
- NumberFlow replaced both hand-written `requestAnimationFrame` loops and rendered accessible raised/supporter labels.
- Desktop screenshot review confirmed the supplied hierarchy and a 64.8% fill for the `$16,250` / `$25,000` fallback values.
- Normal-motion browser geometry measured the fill at 21.9% during entry and 64.8% at rest.
- Reduced-motion emulation reported the preference and rendered the final 64.8% immediately.
- Responsive geometry confirmed document width equals viewport width and the headline, amount, track, supporter content, and CTA stay within the mobile content area.
- The local upstream returns `404`; the fallback disclosure rendered correctly, while the live `/api/donations` and 15-second SWR refresh contracts remain unchanged.
- The simplify and deslop passes removed the nested status ternary and unnecessary `will-change` hint; no other scope or style drift remained.

## Drive Gallery Slice

- [x] Reframe the request in [tasks/context/birthday-drive-gallery.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/birthday-drive-gallery.md)
- [x] Capture the implementation slice in [tasks/architecture/birthday-drive-gallery.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/architecture/birthday-drive-gallery.md)
- [x] Add a read-only `GET /api/birthday-photos` route that parses the public Google Drive folder
- [x] Update the `/birthday` carousel to prefer Drive-backed photos and fall back to local images
- [x] Allow Next image loading from the Google image host used by the Drive-backed gallery
- [x] Document how to add photos through the shared Google Drive folder
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Record verification notes for the Drive-backed birthday gallery

### Drive Gallery Verification Notes

- `pnpm lint` passed.
- `pnpm exec tsc --noEmit` passed.
- `curl http://localhost:3000/api/birthday-photos` returned live Google Drive image entries with `lh3.googleusercontent.com` image URLs.
- The route keeps the existing bundled birthday photos as client fallback if the Google Drive fetch fails or returns no images.

## Artifacts

- [x] Reframe the request in [tasks/context/birthday-page-celebration.md](/Users/Matt.Atkins/.codex/worktrees/be28/go-nate-go-1/tasks/context/birthday-page-celebration.md)
- [x] Capture the implementation slice in [tasks/architecture/birthday-page-celebration.md](/Users/Matt.Atkins/.codex/worktrees/be28/go-nate-go-1/tasks/architecture/birthday-page-celebration.md)

## Tasks

- [x] Fetch the latest birthday-page code from GitHub and work from the existing `/birthday` implementation
- [x] Keep the scope frontend-only and limited to page-specific celebration polish
- [x] Introduce a warm birthday accent without breaking the RSVP page's core structure
- [x] Add polished Donate Now and Shop Now CTA interactions
- [x] Add a live countdown to May 2 in the hero
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Record verification notes for this birthday-page pass

## Notes

- Scope stays focused on one reviewable slice inside the existing `/birthday` page.
- The RSVP backend contract stays unchanged.
- The requested CTAs are additive to the RSVP invitation page rather than replacing RSVP as the primary action.
- Verification passed with `pnpm lint` and `pnpm exec tsc --noEmit` using the repo's `asdf` Node 22.10.0 runtime.

## Countdown Polish Follow-Up

- [x] Capture the UI review in [tasks/design/birthday-countdown-signature.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/birthday-countdown-signature.md)
- [x] Move the birthday countdown below the closing signature and remove the standalone card treatment
- [x] Add subtle countdown entrance/value motion that respects reduced motion
- [x] Re-run `pnpm lint` and `pnpm exec tsc --noEmit` for the birthday page follow-up

## Flipboard Countdown Slice

- [x] Reframe the request in [tasks/context/birthday-flipboard-countdown.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/birthday-flipboard-countdown.md)
- [x] Capture the implementation slice in [tasks/architecture/birthday-flipboard-countdown.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/architecture/birthday-flipboard-countdown.md)
- [x] Adapt the provided split-flap concept to the repo's upgraded Tailwind 4 stack in `@/components/ui`
- [x] Build a countdown-specific board with days, hours, minutes, seconds, and hourly chaos mode
- [x] Replace the current `/birthday` countdown UI with the new board without disturbing the rest of the page
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Review the rendered `/birthday` page in a browser screenshot via `agent-browser`
- [x] Run a focused cleanup pass for social embeds and responsive image warnings, then smoke-test `/`, `/birthday`, and `/donate` with `agent-browser`

## Cleanup Notes

- The homepage social embeds now load client-only to avoid third-party hydration mismatches.
- `agent-browser` smoke checks passed on `/`, `/birthday`, and `/donate` with screenshots captured under `/tmp/`.
- Remaining browser noise is environment-specific: local DonorDrive TLS certificate failure on `/api/donations`, Stripe's expected HTTP dev warning on `/donate`, and one generic browser library warning about scroll offset container positioning.

## Official X Post Embeds

- [x] Reframe the request in [tasks/context/official-x-post-embeds.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/official-x-post-embeds.md)
- [x] Capture the integration plan in [tasks/architecture/official-x-post-embeds.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/architecture/official-x-post-embeds.md)
- [x] Complete the pre-build review in [tasks/design/official-x-post-embeds.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/official-x-post-embeds.md)
- [x] Replace the temporary links with X's official embedded-post widget and remove `react-tweet`
- [x] Verify official rendering plus loading, failure, desktop, and mobile states in Browser
- [x] Run `pnpm lint`, `pnpm exec tsc --noEmit`, and `git diff --check`
- [x] Complete refinement, pre-merge review, screenshot review, and documentation notes

### Official X Embed Verification Notes

- X's official `widgets.createTweet()` factory rendered all three Nate posts in the existing masonry section with dark theme, centered alignment, hidden parent conversation, and `dnt: true`.
- The render target stays measurable beneath a 440px loading overlay; this prevents the official iframe from initializing at zero width while still reserving layout space.
- Desktop Browser geometry measured three completed widget iframes at 309px wide with no loading cards, fallback links, or horizontal overflow.
- The narrow Browser pass rendered all three widgets in one column without document-level overflow; the Browser backend clamped its requested 390px emulation to a 481px viewport.
- A deliberately missing widget script switched all three posts directly to usable X permalinks with no iframes or indefinite loading state.
- `react-tweet` was removed from the direct dependency manifest and lockfile.
- `/opt/homebrew/bin/pnpm lint`, `/opt/homebrew/bin/pnpm exec tsc --noEmit`, and `git diff --check` passed.

## Homepage Hero Motion Refresh

- [x] Reframe the slice in [tasks/context/homepage-hero-motion-refresh.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/context/homepage-hero-motion-refresh.md)
- [x] Capture the architecture boundary in [tasks/architecture/homepage-hero-motion-refresh.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/architecture/homepage-hero-motion-refresh.md)
- [x] Record the pre-build UI and animation review in [tasks/design/homepage-hero-motion-refresh.md](/Users/Matt.Atkins/Code/go-nate-go-1/tasks/design/homepage-hero-motion-refresh.md)
- [x] Write self-contained animation improvement plans under `plans/`
- [x] Tighten the responsive hero composition and correct the logo aspect ratio
- [x] Simplify the hero entrance and remove decorative scroll parallax
- [x] Move predetermined shared reveal translation to full transform strings
- [x] Run `pnpm lint` and `pnpm exec tsc --noEmit`
- [x] Capture and review mobile, desktop, and reduced-motion browser states
- [x] Complete pre-merge, simplification, deslop, and documentation passes

### Homepage Hero Verification Notes

- Local `main` was fast-forwarded to deployed commit `302f1927` before the scoped patch was reapplied.
- `pnpm lint` passed.
- `pnpm exec tsc --noEmit` passed.
- `pnpm build` passed after allowing the configured Google font fetches.
- The local homepage returned HTTP `200`.
- At `390x844`, the logo begins at `16px`, the headline moved from approximately `674px` to `600px`, document width matches the viewport, and both CTA targets are `56px` tall.
- At `1440x1000`, the hero is `751px` tall and the primary donation action begins at `615px`, inside the first viewport.
- Reduced-motion emulation keeps hero transforms at identity and replaces the moving campaign ribbon with its static line.
- Shared reveal smoke tests passed on `/birthday`, the not-found route, merchandise, and every social element visible in the viewport.
- The screenshot review caught and fixed a mobile flex-basis regression and a Next image-ratio warning before handoff.
- The simplification pass removed the nested parent reveal, decorative parallax, and one unused styling hook; the deslop pass found no defensive code, casts, or explanatory comments to remove.

### Homepage Hero Documentation Release

- Reviewed `README.md`, `AGENTS.md`, the active context, architecture, design, plan, and review artifacts.
- No README or contributor-guide update is needed because routes, setup, APIs, environment variables, and operational behavior are unchanged.
- Updated the plan index and task records with the completed behavior and verification evidence.
