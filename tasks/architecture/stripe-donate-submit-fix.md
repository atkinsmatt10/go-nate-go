# Stripe Donate Submit Fix Architecture

## Architecture summary
- Keep the existing Checkout Session + custom UI integration.
- Improve the client-side secure-checkout transition so donors can tell when Stripe has mounted.
- Surface Stripe element load failures directly in the donation UI.

## Slice boundary and dependency impact
- In scope:
- `app/donate/page.tsx`
- `tasks/todo.md`
- workflow artifacts for this slice
- Out of scope:
- Stripe server initialization
- checkout session creation schema
- donation return-page content
- unrelated payment-method or UI cleanup

## Data flow
```text
donor enters amount + email
  -> POST /api/stripe/checkout-session
    -> server creates Checkout Session with return_url
      -> client mounts CheckoutProvider with client_secret
        -> page scrolls donor into the secure-checkout block
          -> Stripe Elements emit ready / load-error events
            -> donor sees either payment options or an actionable error
```

## State transitions
- Before:
- Session creation succeeds locally and in production.
- The page swaps into the checkout state, but the change can look like a no-op because the surrounding UI barely changes and Stripe element load failures are silent.
- After:
- The page scrolls to the mounted secure-checkout block and shows clear helper copy when Stripe is loading or ready.
- Stripe element load failures are surfaced in the existing inline status panel.
- Wallet availability follows Stripe's automatic detection instead of forcing unsupported wallet buttons.

## Trust boundaries
- The server remains the source of truth for amount, email validation, and the Checkout Session configuration.
- The browser should only confirm the existing session and handle recoverable UI state.
- Stripe owns redirect behavior after confirmation.

## Edge cases and failure modes
- Stripe can load the checkout session but still fail to render one or more Elements.
- Unsupported wallet contexts should not force broken-looking Apple Pay or Google Pay states.
- The donate button can stay disabled until Stripe reports confirmable input; the donor needs explicit copy explaining why.

## Test matrix
- Local `POST /api/stripe/checkout-session` still returns a client secret.
- The donate page still initializes embedded checkout after amount + email entry.
- The post-continue state shows explicit helper copy indicating that secure checkout has mounted.
- `pnpm lint` passes.
- `pnpm exec tsc --noEmit` passes.

## Rollout, rollback, and observability notes
- Rollout is a normal preview deploy.
- Rollback is a revert of the donate-page client UX patch.
- Existing server-side Stripe error logging remains the main observability surface for session creation, while inline UI errors now cover Stripe element mount failures.
