# Donate Flow Checkout Clarity Architecture

## Architecture summary
- Keep the existing `app/donate/page.tsx -> /api/stripe/checkout-session -> Stripe CheckoutProvider` flow.
- Improve the client-side donate form so validation is derived during render, the continue action is gated before submit, and prepared checkout behaves like a locked second step.

## Slice boundary and dependency impact
- In scope:
- `app/donate/page.tsx`
- `tasks/context/donate-flow-checkout-clarity.md`
- `tasks/architecture/donate-flow-checkout-clarity.md`
- `tasks/todo.md`
- Out of scope:
- `app/api/stripe/**`
- `app/donate/return/page.tsx`
- homepage sections and unrelated visual cleanup
- deployment configuration changes beyond creating a preview deploy

## Data flow
```text
donor selects amount + enters email
  -> client derives validation state during render
    -> continue button enables only when donation details are valid
      -> POST /api/stripe/checkout-session
        -> server returns client_secret
          -> client mounts CheckoutProvider
            -> donation details lock until donor explicitly resets the form
```

## State transitions
- Before:
- Donation details stay editable even after checkout is prepared.
- Validation mostly appears after the donor clicks continue.
- `app/donate/page.tsx` mixes cheap derived values with memoized state, making the component harder to scan.
- After:
- Pre-checkout guidance is always visible.
- The continue button only enables when donation details are valid.
- Donation details are disabled while secure checkout is active, and the donor can explicitly reset that state with a single action.
- Only the Stripe provider options remain memoized because they benefit from stable identity.

## Trust boundaries
- The browser derives readiness and manages presentation state only.
- The server remains the source of truth for amount and email acceptance when creating the Checkout Session.
- Stripe remains responsible for payment element rendering and confirmation.

## Edge cases and failure modes
- Custom amounts can be empty, malformed, below $1, or above the existing $10,000 cap.
- Stripe may be unconfigured locally.
- Donors may want to change amount or email after secure checkout is prepared; that path should be explicit and reversible.
- Existing Stripe element load and confirmation errors must still surface in the page.

## Test matrix
- Preset donation amounts still flow into Checkout Sessions.
- Invalid custom amounts and invalid email states prevent continuing and show guidance.
- Secure checkout still mounts after valid details are entered.
- Donation detail controls are disabled while checkout is active and return after reset.
- `pnpm lint` passes.
- `pnpm exec tsc --noEmit` passes.

## Rollout, rollback, and observability notes
- Rollout is a normal preview deployment.
- Rollback is a revert of the donate page patch.
- Existing Stripe server logs and inline client error panels remain the main observability surfaces.
