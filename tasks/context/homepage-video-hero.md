# Context

## Actual User Pain

The homepage hero currently leads with an auto-advancing family-photo carousel, while the approved campaign direction leads with Nate's story video. The first screen needs to make that video feel trustworthy, intentional, and easy to start without weakening the donation and shop actions.

## Requested Framing

Implement the approved desktop and mobile video-hero mockups using the existing Go Nate Go campaign system, the supplied family video, and the linked Mux account.

## Rejected Framing

- Generating another hero concept or broad homepage redesign.
- Autoplaying the story video or adding a second watch action.
- Replacing the diagonal campaign ribbon with a generic divider.
- Rebuilding donation checkout, changing CTA destinations, or editing unrelated pages.
- Uploading a duplicate when the supplied source is already present in Mux.

## Narrowest Wedge

Replace the image carousel inside `components/hero-section.tsx` with one responsive Mux player, shorten the hero paragraph to the already-approved mockup presentation, and add low-opacity decorative fish and the existing wave/shark motifs around the retained campaign ribbon. Keep the rest of the homepage unchanged.

## Non-Goals

- No donation API, Stripe, DonorDrive, or checkout changes.
- No production deploy or production environment-variable changes.
- No navigation or downstream-section redesign.
- No new asset-management UI, upload route, or runtime Mux API dependency.

## Success Metric

At desktop and `390x844`, the hero follows the approved left-content/right-video and stacked content-first layouts; the video is visibly central, does not autoplay, exposes exactly one accessible play button before first playback, and then provides keyboard-usable playback controls. Decorative motion is subtle and fully disabled by `prefers-reduced-motion`.

## Why Now

The desktop and mobile mockups are approved, the final source video is available, and the user has authorized the linked-account Mux setup needed to implement the player.

## Open Assumptions Or Decisions

- The existing `Nate-the-great-logo.png` remains the canonical hero mark at both breakpoints; the mobile mockup's alternate lettering is treated as layout direction rather than a new brand asset.
- The approved shortened paragraph is a presentation change, not a new factual claim.
- The existing ready Mux asset with the matching filename, `219.903s` duration, `16:9` aspect ratio, and `720p` resolution is the supplied source video.
- A public playback ID is appropriate because this is a public fundraising homepage.
