# Birthday RSVP Architecture

## Summary

Add a new App Router page at `/birthday` that reuses the campaign palette, typography, motion, and rounded surfaces. Pair it with a `POST /api/birthday-rsvp` route that validates form data and sends a Resend email to the organizers.

## Slice Boundary

- Frontend: one new page component and one small client form component.
- Backend: one route handler for RSVP submission.
- No persistence layer, no auth, no changes to donate checkout.

## Data Flow

1. Visitor loads `/birthday` and reads the event details from static page content.
2. Visitor enters `name`, `attendeeCount`, and `attendance`.
3. Client posts JSON to `/api/birthday-rsvp`.
4. Route validates input, resolves the organizer email target, and sends an RSVP summary through Resend.
5. Client shows inline success or error feedback.

## Trust Boundaries

- Browser input is untrusted and validated with Zod on the server.
- Resend configuration is server-only and resolved from environment variables.

## Edge Cases And Failures

- Missing or invalid fields return `400`.
- Missing recipient or Resend config returns `503`.
- Email transport failure returns `500` with a generic error message.
- Reduced-motion users still get the page without animated transforms.

## Test Matrix

- Submit attending RSVP with valid values.
- Submit not-attending RSVP with valid values.
- Reject blank name or out-of-range attendee count.
- Verify organizer email content includes attendance state, attendee count, and timestamp.
- Run lint and TypeScript checks.
