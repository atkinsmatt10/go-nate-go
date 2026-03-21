# Branded Donation Receipt Plan

## Artifacts

- [x] Reframe the request in [tasks/context/branded-donation-receipts.md](tasks/context/branded-donation-receipts.md)
- [x] Capture the implementation slice in [tasks/architecture/branded-donation-receipts.md](tasks/architecture/branded-donation-receipts.md)

## Tasks

- [x] Add the Resend dependency and minimal server-only config helpers
- [x] Update Checkout Session creation to attach receipt metadata and stop forcing Stripe-native receipt emails
- [x] Add a signed Stripe webhook route for paid completion events
- [x] Add a branded donation receipt email template and Resend sender
- [x] Document required environment variables and local webhook setup
- [x] Verify with lint, TypeScript, and a focused pre-merge review

## Review / Results

- Resend CLI validation passed locally:
- `resend whoami --json`
- `resend doctor --json`
- `resend domains list --json`
- Added a Stripe webhook route that verifies signatures and only sends receipt emails for paid Checkout Session completion events.
- Checkout Session creation now stores receipt metadata and no longer sets `payment_intent_data.receipt_email`, which removes the code-level trigger for Stripe-native receipts in this flow.
- Custom receipts are gated behind `ENABLE_CUSTOM_DONATION_RECEIPTS=true` and fall back to Stripe receipt delivery until the webhook path is explicitly ready.
- Added a branded React email template and plain-text fallback for Nate the Great receipts, sent with a Resend idempotency key derived from the Stripe event ID.
- Verification passed:
- `pnpm lint`
- `pnpm exec tsc --noEmit`

## Pre-Merge Review

### Scope Drift

- No meaningful scope drift. The slice stayed backend-focused and did not alter the donate page UI or the legacy Payment Intent path.

### Structural Risks

- Residual operational risk remains if Stripe dashboard customer receipts are still enabled. The code removed the explicit `receipt_email` send path, but dashboard settings may still need adjustment to avoid duplicate donor receipts.
- The rollout gap identified in review was fixed by adding an explicit enable flag and keeping Stripe receipt delivery as the fallback until custom receipt config is ready.

### Completeness Gaps

- No durable receipt persistence layer was added, so the webhook and Resend idempotency key are the only duplicate-suppression mechanisms in this slice.

### Migration And Rollback Notes

- Roll forward by adding the Resend and Stripe webhook env vars plus the Stripe webhook endpoint registration.
- Roll back by removing the webhook endpoint registration or unsetting the Resend env vars; Checkout itself remains unchanged.

### Prod-Only Failure Modes

- Missing `RESEND_*` or `STRIPE_WEBHOOK_SECRET` env vars will surface only when Stripe posts to the webhook.
- Preview and local environments now prefer `VERCEL_URL` or `http://localhost:3000` before falling back to production URLs for receipt links and asset origins.

### Recommendation

- Safe to hand off once the deployment environment variables are set and the Stripe webhook endpoint is registered.

## Documentation Release

### Docs Reviewed

- `README.md`
- `AGENTS.md`

### Docs Updated

- `README.md`
- `tasks/context/branded-donation-receipts.md`
- `tasks/architecture/branded-donation-receipts.md`
- `tasks/todo.md`

### Facts Added Or Corrected

- Documented the new Resend and Stripe webhook environment variables.
- Documented the Resend CLI checks used for onboarding validation.
- Documented the Stripe local webhook forwarding command and the duplicate-receipt ownership note.

### Remaining Follow-Ups

- Register the production Stripe webhook endpoint after deploy.
- Decide whether Stripe dashboard customer receipts should stay on or be disabled for this fundraiser flow.
