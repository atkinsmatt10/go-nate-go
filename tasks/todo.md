# Receipt Email Design Alignment Plan

## Artifacts

- [x] Reframe the request in [tasks/context/receipt-email-design-alignment.md](tasks/context/receipt-email-design-alignment.md)
- [x] Capture the implementation slice in [tasks/architecture/receipt-email-design-alignment.md](tasks/architecture/receipt-email-design-alignment.md)

## Tasks

- [x] Inspect the Paper artboard and identify the layout and copy differences from the current receipt template
- [x] Update the receipt template structure, spacing, and visual hierarchy to match the design
- [x] Update the email payload fields and copy blocks needed to support the design
- [x] Verify with lint, TypeScript, and a screenshot-based comparison against the Paper artboard

## Review / Results

- Rebuilt the receipt template to match the Paper `EV-1` artboard structure: dark hero, overlapping payment snapshot, receipt details card, tinted summary card, and support footer.
- Updated the send payload so the email can render the designed detail rows and copy, including split paid date/time, receipt emailed time, delivered-by text, support contact defaults, and Stripe sender metadata.
- Added explicit `Lilita One` and `Work Sans` font loading in the email head so supported clients can pick up the campaign typography instead of falling straight to system fallbacks.
- Verified the updated structure and copy against the Paper artboard screenshot and JSX export, plus a locally rendered browser preview screenshot, with minor email-client-safe approximations for overlap and spacing.
- Verification passed:
- `pnpm lint`
- `pnpm exec tsc --noEmit`

## Pre-Merge Review

### Scope Drift

- No meaningful scope drift. The slice stayed limited to the donation receipt template, the server-side mapping needed to populate it, and task artifacts.

### Structural Risks

- The template rewrite is larger than the default review-size target because the Paper design replaced most of the prior layout in a single file.
- The new Stripe sender row depends on a live Stripe account lookup, but it falls back to `receipts@stripe.com` if account retrieval fails.

### Completeness Gaps

- Web-font support still depends on the recipient client. The template now requests the design-system fonts, but clients that strip remote fonts will still fall back to the declared rounded/sans-serif backups.

### Migration And Rollback Notes

- No schema or deployment ordering changes are involved.
- Rollback is a straight revert to the previous receipt template and payload mapping.

### Prod-Only Failure Modes

- Email clients may flatten some overlap and shadow treatments, but the layout remains readable because each section is contained within table-safe card blocks.
- If Stripe account metadata is temporarily unavailable, the sender detail row falls back to a generic Stripe receipt address.

### Recommendation

- Safe to hand off as a frontend-only branding and copy alignment pass on the existing receipt flow.

## Documentation Release

### Docs Reviewed

- `README.md`
- `AGENTS.md`
- `tasks/context/receipt-email-design-alignment.md`
- `tasks/architecture/receipt-email-design-alignment.md`
- `tasks/todo.md`

### Docs Updated

- `tasks/todo.md`

### Facts Added Or Corrected

- Recorded the verification outcome and the design-alignment review notes for this slice.
- Recorded that the branch was pushed and a Vercel preview deployment was created for the updated receipt email.
- Recorded the follow-up typography pass and local rendered preview verification.

### Remaining Follow-Ups

- Send a real or test donation through the preview or production flow if a final inbox rendering check is needed before promoting the updated email to production again.
