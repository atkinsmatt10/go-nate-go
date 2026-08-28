# UI Design Review

## Approved Direction

The supplied desktop and mobile mockups are the design target. The implementation should reproduce their hierarchy rather than reinterpret it:

- deep navy campaign shell with sparse, low-opacity fish silhouettes
- canonical hero mark, short emphatic Lilita headline, restrained Work Sans story copy
- Donate and Shop as the only hero CTAs
- large rounded teal-framed video, right-aligned on desktop and stacked after actions on mobile
- one centered teal Play control on the poster
- the existing diagonal campaign ribbon as the transition into the next section
- soft wave and shark motifs kept subordinate to the mission and video

## Responsive Composition

- Desktop: use a wide two-column grid with the content column sized for a two-line headline and the video column allowed to dominate without crowding the actions.
- Mobile: preserve a single reading path—mark, headline, copy, CTA row, video—before the campaign ribbon.
- Keep the player near a `6 / 5` presentation frame. Crop the poster with `cover` to match the approved close family composition, then show the 16:9 moving footage with `contain` so broadcast graphics and people near the edges remain visible.

## Interaction And Motion Review

- Keep the existing short page-entry reveals for meaningful content groups.
- Fish drift is the only new ambient motion: 8–12px, 10–16 seconds, low opacity, no interaction.
- Do not animate the logo, paragraph lines, Play control, or banner angle continuously.
- Use Mux Player's accessible media state and keyboard handling instead of recreating playback controls.
- Under reduced motion, fish are static and all existing reduced-motion branches remain active.

## AI-Slop Risks Rejected Before Build

- No glassmorphism, badges, duration chips, statistics, testimonial copy, or extra watch CTA.
- No generic SaaS card grid, tiny corner radii, hard shadows, or saturated gradient stack.
- No decorative elements over faces or controls.
- No invented copy, navigation, or fundraiser claims.

## Post-Build Review

The Browser review confirmed the approved hierarchy at a representative desktop viewport and at an exact `390x844` viewport. The refinement pass reduced the narrow-layout mark, headline, CTA, and player widths so the waves, shark, and existing diagonal ribbon remain visible in the first mobile screen. The desktop headline now holds the approved two-line break while the video remains the dominant element.

The player rendered one accessible central Play control before playback. Enter started the on-demand stream, Space paused it, and the paused seek value remained stationary. The final motion pass uses Framer Motion for the fish: live transform samples changed over time within their 8–12px bounds, while reduced-motion samples remained `none` across repeated checks. The existing static ribbon fallback also remained intact. No extra watch action, duration badge, autoplay behavior, overflow, or campaign-style drift remained after refinement.

A representative playback crop audit sampled the source throughout its 3:39 runtime. A simulated 6:5 `cover` crop removed the 6abc corner mark and clipped edge-aligned source labels in multiple scenes, so the final presentation keeps the approved cover poster and uses `contain` for moving footage against the navy player surface. Live Browser playback confirmed the 1280×720 stream advances in the contained frame with the corner mark intact. The visible title was removed while the analytics title remains in metadata, and the controls backdrop is now 58% navy for legibility over bright footage.
