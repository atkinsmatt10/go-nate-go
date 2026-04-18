# Birthday Drive Gallery Architecture

## Summary

Add a small server route that reads the public Google Drive folder via `embeddedfolderview`, extracts image files, and returns normalized photo data for the `/birthday` carousel. The client keeps the existing local gallery as a fallback so the page remains stable if Drive fetches fail.

## Slice Boundary

- Frontend: update the existing birthday photo carousel to fetch gallery data from one route.
- Backend: add one read-only route for Drive-backed photo discovery.
- Config: extend Next image remote host allowlist for Google-hosted images.
- No auth, no database, no changes to RSVP submission or Stripe flows.

## Data Flow

1. Visitor loads `/birthday`.
2. The birthday carousel renders immediately with the existing local photo list.
3. Client fetches `GET /api/birthday-photos`.
4. The route requests the public Drive folder's `embeddedfolderview` HTML and parses file IDs and titles for image entries.
5. The route returns normalized photo objects with stable Google-hosted image URLs by file ID.
6. If the response has photos, the carousel swaps to the Drive-backed list; otherwise it stays on the local fallback.

## Trust Boundaries

- The browser trusts only the app's own API route, not raw Drive HTML.
- The route treats remote Drive HTML as untrusted input and extracts only expected file IDs and titles.
- The Google folder is public-by-link, so no private credentials are introduced into the repo or runtime.

## Edge Cases And Failures

- If the Drive folder fetch fails or returns malformed HTML, the API returns an empty photo list and the client keeps the local gallery.
- Non-image files in the folder are ignored.
- If Google changes the `embeddedfolderview` markup, the fallback gallery preserves page continuity.
- If the Drive folder is emptied, the local gallery remains visible until valid remote photos are available again.

## Test Matrix

- Load `/birthday` with a successful Drive photo response and verify carousel images switch to remote photos.
- Load `/birthday` when the API route fails and verify the existing local photos still render.
- Confirm only image files are returned from the folder.
- Verify Next image rendering works for `lh3.googleusercontent.com`.
- Run `pnpm lint` and `pnpm exec tsc --noEmit`.
