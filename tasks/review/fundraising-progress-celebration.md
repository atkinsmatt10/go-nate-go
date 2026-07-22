# Pre-Merge Review

## Scope Drift

None. The behavior change stays inside `FundraisingProgress`; the only dependency addition is the purpose-built NumberFlow package selected for digit transitions. The DonorDrive route, cache behavior, homepage ordering, and checkout flow are unchanged.

## Structural Risks

- The amount, donation count, fill, and shark all derive from the same SWR response and enter-view state, preventing divergent displayed progress.
- The visual percentage clamps to 0–100%, guards a zero goal, and keeps the decorative shark within the track endpoints.
- NumberFlow replaces both manual animation loops and respects the platform motion preference by default.
- Framer Motion receives a zero-duration transition under reduced motion; browser emulation confirmed the final fill appears immediately.
- The progress track retains `progressbar` semantics and communicates the full raised/goal text independently of the shark and stripes.
- Error state keeps recent values visible and discloses that the live total is unavailable.

## Completeness Gaps

The local DonorDrive upstream currently returns `404`, so the live success response was not browser-tested. The API contract and SWR data path are unchanged; fallback, error, responsive, animation, reduced-motion, semantic, and CTA behavior were verified.

## Migration And Rollback Notes

No migration or deploy ordering. Rollback is the component change plus removal of `@number-flow/react` from the manifest and lockfile.

## Prod-Only Failure Modes

- If DonorDrive returns a malformed success payload despite server validation, client number normalization could still produce an invalid display; this risk is unchanged in kind and bounded by the existing API validation.
- If the upstream remains unavailable, visitors see explicit recent fallback values rather than a blank or broken progress area.
- NumberFlow supports React 19 through its declared peer range and rendered successfully in the local Next.js 16 hydration path.

## Recommendation

Ready for review as one focused frontend slice, with the local upstream availability limitation documented.
