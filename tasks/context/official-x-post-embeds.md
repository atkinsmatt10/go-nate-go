# Context

## Requested Framing

Replace the temporary X post link cards with an official X integration.

## Actual User Pain

The homepage should show the referenced X posts as recognizable, media-rich posts without relying on the `react-tweet` parser that crashed on current X payloads.

## Rejected Framing

Do not introduce X API credentials, paid Post reads, or a custom clone of X's post UI just to display three fixed public posts. Do not preserve copied post text when X no longer makes a post available.

## Narrowest Wedge

Use X for Websites' official `widgets.js` factory for the existing three Post IDs, enable do-not-track, reserve stable loading space, and retain a direct permalink fallback when the widget is blocked or unavailable.

## Non-Goals

- Searching X or discovering posts dynamically
- Server-side X API access or analytics
- Redesigning the wider social-media masonry section
- Changing Instagram, LinkedIn, or Substack embeds
- Solving the site's broader cookie-consent policy in this slice

## Success Metric

All three X posts render through X's official widget when it is available; if it is blocked or fails, every post remains accessible through a clear X permalink without crashing the page or leaving indefinite loading UI.

## Why Now

The previous third-party renderer caused a homepage runtime error, and the temporary link tiles do not present the post content the user expects.

## Assumptions And Open Questions

- The three current Post IDs remain the curated source of truth.
- X's third-party script may be blocked by privacy tools or unavailable, so failure is a normal UI state.
- The production privacy notice and consent behavior should be reviewed before release because X's widget remains a third-party embed even with do-not-track enabled.
