# Context

## Requested Framing

Debug why donation receipt emails are not sending successfully and verify the path end to end where possible.

## Actual User Pain

Receipt emails are donor-facing trust material. The current fundraising flow appears to complete payments without reliably delivering the expected receipt email, which undermines donor confidence and makes it unclear whether the issue is in Stripe, Resend, or the app code.

## Rejected Framing

Do not treat this as a broad donation-flow redesign. The problem is receipt delivery reliability on the existing Checkout Session and webhook path.

## Narrowest Wedge

- trace the current receipt path from checkout session creation through webhook handling and Resend delivery
- verify provider and environment state with CLI tooling
- run a local end-to-end webhook test where possible
- fix the smallest repo-level issue blocking the send path
- document the configuration mismatch that still needs to be corrected in hosted envs

## Non-Goals

- redesigning the donate UI
- changing the checkout architecture
- introducing a new email provider
- modifying production configuration without an explicit production-change request

## Success Metric

We can explain the failure with direct evidence, prove the receipt path succeeds locally when configured correctly, and land the smallest code/doc change needed so the repo itself is no longer blocking delivery.

## Why Now

The receipt flow already exists and is donor-visible. Debugging with concrete provider and app evidence is the fastest way to restore trust in the live donation experience before more payments arrive.

## Assumptions And Open Questions

- Production is using the webhook-driven Resend path because the feature flag and webhook secret exist in Vercel.
- Local `.env.local` is not intended to mirror production exactly and currently leaves the custom receipt path disabled.
- Hosted environment values can be inspected safely by key presence and sender domain without disclosing secrets.
