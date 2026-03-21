# Stripe Donate Submit Fix Plan

## Tasks
- [x] Reframe the Stripe donation failure in [tasks/context/stripe-donate-submit-fix.md](tasks/context/stripe-donate-submit-fix.md)
- [x] Capture the implementation slice in [tasks/architecture/stripe-donate-submit-fix.md](tasks/architecture/stripe-donate-submit-fix.md)
- [x] Reproduce session creation locally and against production to isolate the failing stage
- [x] Patch the donate-page secure-checkout UX to make the mounted Stripe state and element failures obvious
- [x] Verify with lint, TypeScript, and targeted runtime checks

## Review / Results
- No Stripe MCP server was available in this session, so validation used the repo, runtime checks, browser automation, Stripe SDK typings, and official Stripe docs instead.
- Local and production `POST /api/stripe/checkout-session` calls both returned valid Checkout Session client secrets, so the break is not in session creation.
- Browser validation showed the embedded checkout UI mounts successfully after session initialization on both local and production.
- The actual UX gap was that the post-continue state did not clearly announce that secure checkout had mounted, and Stripe element load failures had no explicit inline handling.
- Updated the donate page to scroll donors into the secure-checkout block, show helper copy while Stripe loads and when it is ready, handle `onLoadError` for both Stripe elements, and let Stripe auto-detect wallet availability.
- Verification passed:
- `pnpm lint`
- `pnpm exec tsc --noEmit`
- Local browser validation at `http://localhost:3001/donate` still initialized embedded checkout after entering email and continuing to secure checkout.
- The local browser path now explicitly shows `Secure checkout is ready below. Choose a wallet or enter card details to continue.` after clicking `Continue to Secure Checkout`.
