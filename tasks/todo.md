# Donation Page Design Upgrade Plan

## Tasks
- [x] Define and apply a clear visual concept for `/donate` (playful pastel kids aesthetic)
- [x] Redesign layout with stronger hierarchy, atmosphere, and brand storytelling while keeping payment UX clear
- [x] Add orchestrated motion (staggered entrance + hover/ambient effects) with accessibility-safe behavior
- [x] Preserve donation logic and Stripe payment flow end-to-end
- [x] Run lint to verify production readiness

## Review / Results
- `pnpm lint`: passed
- `pnpm exec tsc --noEmit`: passed
- `pnpm build`: passed
- Preserved behavior: preset/custom amount selection, PaymentIntent creation, Stripe PaymentElement confirmation, return redirect flow.

# Donation Page Web Guidelines Compliance Plan

## Tasks
- [x] Audit `app/donate/page.tsx` against the Vercel web-interface guideline checklist
- [x] Apply targeted accessibility, form, focus, and copy updates without changing Stripe flow behavior
- [x] Run validation checks for touched TypeScript (`pnpm lint`, `pnpm exec tsc --noEmit`)
- [x] Record results and residual risks

## Review / Results
- `pnpm lint`: passed
- `pnpm exec tsc --noEmit`: passed
- Updated `/donate` for skip-link support, aria-live status updates, explicit transition properties, focus-visible states, form metadata (`name`, `autocomplete`, numeric input config), and guideline-compliant copy (`…`, Title Case button labels).
- Residual risk: unsaved-change warning currently uses `beforeunload` for browser/tab exits only, not a custom in-app route transition modal.

# Stripe Integration Smoke Test Plan

## Tasks
- [x] Confirm local app boots with test Stripe keys and loads `/donate`
- [x] Complete a test-card donation flow through Stripe PaymentElement
- [x] Verify return page shows successful payment status and amount
- [x] Verify created test PaymentIntent in Stripe via MCP/CLI evidence

## Review / Results
- Used local app at `http://localhost:3001/donate` with Stripe test keys from `.env.local`.
- Completed donation with Stripe test card flow (`4242 4242 4242 4242`, `12/34`, `123`, ZIP `10001`) via browser automation.
- Return URL reached: `http://localhost:3001/donate/return?payment_intent=pi_3T7bx76sv3pYqwb3025ori4V`.
- Return page confirms success and amount: `Donation Complete` and `Amount: $50.00`.
- API verification: `GET /api/stripe/payment-intent?payment_intent=pi_3T7bx76sv3pYqwb3025ori4V` returned `status: succeeded`.
- Direct Stripe API verification (test secret key): `paymentIntents.retrieve("pi_3T7bx76sv3pYqwb3025ori4V")` returned `status: succeeded`, `amount: 5000`, `currency: usd`.
- Artifacts: `/tmp/stripe-playwright-before-submit.png`, `/tmp/stripe-playwright-return.png`.

# Donations Wallet Optimization Plan

## Tasks
- [x] Add Stripe Express Checkout (Apple Pay, Google Pay, Link) above the existing Payment Element on `/donate`
- [x] Keep the current PaymentIntent + PaymentElement fallback flow intact for unsupported devices/browsers
- [x] Improve wallet visibility and guidance text to make one-tap payment options obvious
- [x] Run validation checks for touched TypeScript (`pnpm lint`, `pnpm exec tsc --noEmit`)
- [x] Record review/results and launch prerequisites (dashboard/payment method domain setup)

## Review / Results
- `pnpm lint`: passed
- `pnpm exec tsc --noEmit`: passed
- Added `ExpressCheckoutElement` with wallet-first ordering and donation-specific button types (`apple_pay`, `google_pay`, `link`) before the card form.
- Preserved fallback behavior: if wallets are unavailable or fail to load, the standard `PaymentElement` checkout remains available.
- Updated donation copy to explicitly call out Apple Pay, Google Pay, Link, and card options.
- Launch prerequisites:
- Enable Apple Pay, Google Pay, and Link in Stripe Dashboard payment method settings.
- Add production domain in Stripe Payment Method Domains (required for Apple Pay on web and recommended for wallet reliability).
- Serve checkout over HTTPS in production; wallet availability depends on browser/device capability.
