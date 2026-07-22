# Context

## Requested Framing

Add an animated banner between the homepage hero and the following section, using the supplied reference as the visual direction.

## Actual User Pain

The transition out of the hero currently has no energetic campaign moment. The page needs a branded bridge that carries the Go Nate Go voice into Nate's story without adding another content-heavy section.

## Rejected Framing

- A generic announcement bar with a single centered message.
- A new call-to-action or navigation surface.
- A JavaScript-driven carousel or interactive ticker.
- A redesign of either the hero or Nate's story.

## Narrowest Wedge

Add one static campaign-marquee component directly between `HeroSection` and `NatesStory`. Use a seamless, linear CSS transform for predetermined motion and a static alternative when reduced motion is requested.

## Non-Goals

- No changes to donation, shop, or story links.
- No copy changes elsewhere on the homepage.
- No backend, analytics, or content-management work.
- No new animation dependency.

## Success Metric

The marquee looks intentional at desktop and mobile widths, loops without a visible jump, does not create horizontal page overflow, and becomes static under `prefers-reduced-motion`.

## Why Now

The user supplied a concrete visual reference for the missing transition and asked to bring that branded motion into the live homepage.

## Assumptions And Open Questions

- The reference phrases are the intended initial campaign copy: One Tough Cookie, Go Nate Go, Our Little Fighter, Natey Shark, and 100% Supports CHOP.
- The ribbon is decorative campaign energy rather than a clickable control.
- This is a small frontend-only slice, so a separate architecture artifact is unnecessary.
