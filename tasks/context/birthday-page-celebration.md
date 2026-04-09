# Birthday Page Celebration

## Actual user pain
- The RSVP page exists, but it still reads mostly like a functional invite rather than a birthday-specific celebration.
- The page uses the campaign navy system well, but it lacks a warmer accent to signal birthday energy.
- There is no live countdown or polished CTA pair to make the page feel time-bound and dynamic.

## Requested framing
- Improve the existing `/birthday` page by adding a birthday-specific accent, more polished CTA interactions, and a live countdown to May 2.

## Rejected framing
- Do not redesign the full invite or RSVP flow from scratch.
- Do not change the RSVP API contract or organizer-email flow.
- Do not apply the birthday accent globally across the fundraiser site.

## Narrowest wedge
- Keep the existing RSVP page structure and backend intact.
- Add a hero-level countdown, a page-local celebratory accent, and a dedicated Donate Now / Shop Now CTA group with better interaction states.

## Non-goals
- No backend changes.
- No new RSVP fields.
- No site-wide theme refactor.

## Success metric
- `/birthday` feels noticeably more celebratory while remaining aligned with the campaign brand.
- The CTA buttons feel alive on hover.
- The page shows a live countdown to May 2 and handles the birthday date itself sensibly.

## Why now
- The branch already has the birthday RSVP experience, so this is the right moment to polish the page before review or launch.

## Open assumptions or decisions
- Assume the page should still prioritize RSVP completion even after adding Donate Now and Shop Now.
- Assume the countdown should target the next May 2, with a special same-day birthday message on May 2 itself.
