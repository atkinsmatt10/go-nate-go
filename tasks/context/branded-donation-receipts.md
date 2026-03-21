# Context

## Requested Framing

Add customizable donation receipt emails to the site using Resend, with campaign branding that matches the existing Nate the Great design system.

## Actual User Pain

The current donation flow relies on Stripe receipt behavior that is either not brandable enough or not under the site's control. The user needs a receipt email that feels native to the fundraiser, uses the existing visual language, and can be owned inside the codebase.

## Rejected Framing

Do not treat this as a frontend redesign of the donation flow or as a hosted-template migration project. The core problem is reliable, branded post-payment receipt delivery, not a broader checkout rewrite.

## Narrowest Wedge

Implement a webhook-driven receipt path for the active Stripe Checkout Session flow only:

- keep the existing donate UI intact
- add a Resend-backed branded receipt template in code
- send the receipt from a Stripe webhook after confirmed payment success
- document the new environment variables and local setup

## Non-Goals

- redesigning the donate page
- adding donor accounts or receipt history
- changing the legacy direct Payment Intent flow
- creating a full Resend hosted template workflow in the dashboard
- making tax-deductibility claims or legal receipt language beyond facts already known in the repo

## Success Metric

A completed Stripe Checkout donation can trigger exactly one branded receipt email via Resend, using campaign colors/logo/typography, with the amount, timestamp, payment reference, and support contact info preserved.

## Why Now

Receipt emails are donor-facing trust material. Leaving them generic weakens the fundraiser experience, and wiring them through a webhook now keeps the behavior reliable before more donation traffic accumulates.

## Assumptions And Open Questions

- The current active path is Checkout Session based, so this slice will not change the legacy Payment Intent route.
- The verified Resend sending domain already exists, but the repo still needs `ENABLE_CUSTOM_DONATION_RECEIPTS=true` plus the `RESEND_*` environment variables.
- If Stripe dashboard customer receipts remain enabled, donors may still receive a second Stripe-native receipt. The code will stop setting `receipt_email`, but dashboard settings may still need adjustment.
