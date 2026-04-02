# UI Design Review

## Pre-Build Review
- The user job is trust-building continuity on the journey from story to donation, not animation for its own sake.
- The most important states are:
- home-to-donate navigation
- donation panel placeholder/loading/ready states
- social embed loading/reveal
- The campaign already has strong section-level motion, so the new work should fill continuity gaps rather than stack more independent reveals.

## Risks To Address Before Coding
- Directional route motion could feel too app-like for a fundraiser if it is too strong.
- Shared element motion can look gimmicky if it is applied to too many elements; limit it to the logo.
- Frosted donate surfaces may smear during page captures if not isolated.
- Social embeds sit in a masonry layout, so reveal motion must not introduce height thrash.

## Post-Build Screenshot Review
- Home screenshot shows the route-entry shell unchanged visually and the hero CTA remains prominent.
- Donate screenshots confirm the new shared route continuity and the donate shell still reads cleanly without obvious blur smearing on the frosted panels.
- Donate state screenshots confirm the panel now transitions from placeholder into secure checkout rather than hard-swapping.
- Social screenshot confirms the embed area still renders after adding Suspense reveal boundaries.

## Remaining Polish Or UX Issues
- Existing Instagram embeds still emit hydration-mismatch warnings because the third-party component generates non-deterministic IDs between server and client.
- Homepage console noise still includes unrelated 404/500 requests that predate this slice.
