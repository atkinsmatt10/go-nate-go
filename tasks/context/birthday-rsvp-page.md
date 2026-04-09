# Birthday RSVP Reframe

- Actual user pain: the fundraiser site needs a clear, trustworthy place to invite friends and collect first-birthday RSVPs without breaking from the campaign brand.
- Requested framing: add a landing page at `/birthday` with event details and an RSVP form.
- Rejected framing: do not redesign the broader site, add a database-backed guest manager, or mix this with donation-flow work.
- Narrowest wedge: one public page plus one submission path that emails RSVP details to the organizers.
- Non-goals: payments, attendee self-service edits, calendar exports, or a separate admin dashboard.
- Success metric: a visitor can understand the event in one screen, submit a yes/no RSVP with name and party size, and the organizers receive the response.
- Why now: the party is on May 9, 2026, so the page needs to be publishable as a standalone route soon.
- Open assumptions: RSVP emails should go to a configured organizer inbox, with `BIRTHDAY_RSVP_TO_EMAIL` preferred and existing Resend settings used as fallback.
