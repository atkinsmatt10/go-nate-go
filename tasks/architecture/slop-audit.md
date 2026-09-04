# Architecture Review

## Slice Boundary
Independent cleanup slices: retired birthday implementation; duplicate/unused helpers; regression-test assertions and their server configuration. Keep the shared UI catalog and payment endpoints.

## Architecture Summary
Trace static imports, re-exports, require calls, and dynamic imports with the installed TypeScript parser. Treat App Router files and tests as entry points, then confirm deletion candidates with repository text search.

## Data Flow
Existing pages -> active components -> canonical hooks/helpers. The closed RSVP route already returns 410 without importing its old email code; the birthday archive and gallery stay active.

## State Transitions
No production state transitions change. Test offscreen polling during successful requests before testing retention after an error.

## Trust Boundaries
Preserve Stripe validation, receipt delivery, DonorDrive cache and ETag behavior, server/client boundaries, and third-party accessibility handling.

## Edge Cases And Failure Modes
Check dynamic imports and framework entry points before deletion. Keep the canonical toast hook. Leave the birthday photo API contract intact. Existing user edits in the hero and CSS remain byte-for-byte unchanged.

Verification found that reusing an unrelated server omits the test Stripe configuration, and Next.js blocks development resources on the configured numeric loopback origin. Use localhost, a selectable test port, and a fresh server for deterministic checks.

## Test Matrix
- Static references: deleted files have no retained importers.
- Lint and TypeScript: clean before and after.
- Production build: all routes compile.
- Existing 13 regressions: checkout failures, amount changes, media loading, no-JavaScript content, reduced motion, donation polling, malformed requests, metadata, and birthday archive.

## Rollout, Rollback, And Observability
Local reviewable changes only. Revert each cleanup slice independently; no data migration, external configuration, or new monitoring is needed.
