# Architecture Review

## Slice Boundary
One editorial change across existing pages and components. Preserve production styles, destinations, and integrations. An isolated release worktree excludes all Three.js files, dependency changes, CSS, and hero integration/spacing changes; the original checkout retains the experiment.

## Architecture Summary
Replace text literals and remove redundant prose blocks. No new dependencies, components, state, or abstractions.

## Data Flow
Existing text literals -> existing server/client components -> rendered page and metadata.

## State Transitions
Checkout, payment return, fundraising loading/stale states, and archived RSVP behavior stay unchanged.

## Trust Boundaries
Keep provider messages and third-party posts intact. Preserve recipient and payment details. No external writes or payments are needed for verification.

## Edge Cases And Failure Modes
Avoid unclear short labels, lost medical details, premature payment-success claims, duplicate prompts, clipped mobile text, and stale test locators.

## Test Matrix
- Run lint, TypeScript, diff checks, and a production build.
- Update existing copy-dependent regression locators, then run the existing suite with payment requests intercepted.
- Inspect rendered homepage and secondary pages at desktop/mobile widths, including reduced motion.
- Review the final copy independently from the implementation diff.

## Rollout, Rollback, And Observability
After local and preview review, the user requested production shipment without the Three.js experiment. Reverify the isolated release, commit only the copy slice, merge through GitHub, and confirm Vercel production uses that merge. Do not promote either experimental preview. Revert the copy commit for rollback. No instrumentation changes.
