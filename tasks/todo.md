# Receipt Email Debug Plan

## Artifacts

- [x] Reframe the request in [tasks/context/receipt-email-debug.md](tasks/context/receipt-email-debug.md)
- [x] Capture the implementation slice in [tasks/architecture/receipt-email-debug.md](tasks/architecture/receipt-email-debug.md)

## Tasks

- [x] Inspect the current receipt code path and hosted env status
- [x] Reproduce the failure with Resend CLI and a local webhook test
- [x] Add the missing runtime dependency for React email rendering
- [x] Correct the documented sender domain to match the verified Resend domain
- [x] Re-run lint and TypeScript checks
- [ ] Re-run a fully green end-to-end local webhook test

## Investigation Notes

- Local `.env.local` does not enable custom donation receipts, so local checkout normally falls back to Stripe-native receipts.
- Production Vercel env does enable custom donation receipts and includes a webhook secret.
- Production `RESEND_FROM_EMAIL` currently uses the `nicolematt.com` domain.
- Resend CLI reports `gonatego.com` as the only verified sending domain.
- Direct Resend CLI send with `donations@nicolematt.com` fails with `The nicolematt.com domain is not verified`.
- Direct Resend CLI send with `donations@gonatego.com` succeeds.
- Local webhook testing with a corrected `gonatego.com` sender initially failed before send time because `@react-email/render` was not installed and the Resend SDK could not render the React template payload.
- After installing `@react-email/render`, the webhook progressed past template rendering and failed at Resend authentication/config instead of render time.
- The local `.env.local` `RESEND_API_KEY` cannot send from `gonatego.com`.
- The production Stripe event logs provided by the user match the investigated failure shape: valid `checkout.session.completed` event, webhook 500, and receipt delivery owned by `resend`.
- Verification passed:
- `pnpm lint`
- `pnpm exec tsc --noEmit`
