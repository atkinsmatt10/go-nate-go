# Pre-Merge Review

## Scope Drift

None. The change is limited to the homepage X post renderer, the section-level official widget script, removal of the unused `react-tweet` dependency, and task evidence. Instagram, LinkedIn, Substack, fundraising data, and donation checkout behavior are unchanged.

## Structural Risks

- `next/script` owns one lazy-loaded copy of X's official widget runtime for the section.
- Each post owns one container, one bounded timeout, and cleanup that removes stale widget DOM after unmount or a superseded attempt.
- The widget container remains measurable while the loading overlay is visible, which is required for X to calculate a responsive iframe width.
- Script failure, factory rejection, an unavailable post, and timeout all converge on the same direct-link fallback.
- No API key, server route, secret, or authenticated X API call is introduced.
- `dnt: true` reduces personalization but the browser still loads third-party X resources.

## Completeness Gaps

The official widget is third-party code and can still be blocked by a visitor's privacy tooling or network policy. That is an expected runtime condition covered by the permalink fallback rather than an integration defect.

## Migration And Rollback Notes

No migration or deploy ordering is required. Rollback is restoring the previous renderer and adding `react-tweet` back to the dependency manifest and lockfile.

## Prod-Only Failure Modes

- X can change or remove post content after deployment; the affected card will fall back to its permalink after the bounded timeout.
- A strict production CSP that omits X widget and iframe origins would trigger the same fallback path.
- Third-party post heights vary with media and text; the existing masonry layout accommodates that variation.

## Recommendation

Ready for review as one focused frontend integration. Official rendering, blocked-script fallback, desktop geometry, narrow responsive geometry, cleanup behavior, and static checks passed locally.
