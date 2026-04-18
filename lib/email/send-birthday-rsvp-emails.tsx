import "server-only"

import { BirthdayRsvpEmail } from "@/components/emails/birthday-rsvp-email"
import { getResendClient, getResendFromEmail, getResendReplyToEmail } from "@/lib/resend"

type BirthdayAttendance = "yes" | "no"

interface SendBirthdayRsvpAttendeeEmailsParams {
  attendeeCount: number
  attendance: BirthdayAttendance
  email: string
  name: string
}

const birthdaySupportEmail = "support@gonatego.com"
const birthdayCalendarTitle = "Nate is One Tough Cookie Birthday Party"
const birthdayCalendarLocation = "Craft Hall, 901 N Delaware Ave, Philadelphia, PA 19123"
const birthdayPartyDateText = "Saturday, May 9, 2026"
const birthdayPartyTimeText = "12 PM to 3 PM"
const birthdayReminderScheduledAt = "2026-05-08T16:00:00.000Z"

export async function sendBirthdayRsvpAttendeeEmails({
  attendeeCount,
  attendance,
  email,
  name,
}: SendBirthdayRsvpAttendeeEmailsParams): Promise<void> {
  const resend = getResendClient()
  const fromEmail = getResendFromEmail()
  const replyToEmail = getResendReplyToEmail() || birthdaySupportEmail
  const siteOrigin = getSiteOrigin()
  const subjectPrefix = process.env.VERCEL_ENV === "production" ? "" : "[Test] "

  const confirmationResult = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      replyTo: replyToEmail,
      subject:
        attendance === "yes"
          ? `${subjectPrefix}We got your RSVP for Nate’s birthday`
          : `${subjectPrefix}Thanks for your RSVP for Nate’s birthday`,
      react: (
        <BirthdayRsvpEmail
          attendeeCount={attendeeCount}
          attendance={attendance}
          name={name}
          siteOrigin={siteOrigin}
          variant="confirmation"
        />
      ),
      text: buildConfirmationText({ attendeeCount, attendance, name, siteOrigin }),
      tags: [
        { name: "category", value: "birthday_rsvp_confirmation" },
        { name: "campaign", value: "nate-the-great" },
      ],
    },
    {
      idempotencyKey: `birthday-rsvp-confirmation:${email}:${attendance}:${attendeeCount}`,
    },
  )

  if (confirmationResult.error) {
    throw new Error(`Resend error sending birthday RSVP confirmation: ${confirmationResult.error.message}`)
  }

  if (attendance !== "yes" || !shouldScheduleBirthdayReminder()) {
    return
  }

  const reminderResult = await resend.emails.send(
    {
      from: fromEmail,
      to: email,
      replyTo: replyToEmail,
      subject: `${subjectPrefix}Reminder: Nate’s birthday party is tomorrow`,
      react: (
        <BirthdayRsvpEmail
          attendeeCount={attendeeCount}
          attendance={attendance}
          name={name}
          siteOrigin={siteOrigin}
          variant="reminder"
        />
      ),
      scheduledAt: birthdayReminderScheduledAt,
      text: buildReminderText({ attendeeCount, name, siteOrigin }),
      tags: [
        { name: "category", value: "birthday_rsvp_reminder" },
        { name: "campaign", value: "nate-the-great" },
      ],
    },
    {
      idempotencyKey: `birthday-rsvp-reminder:${email}`,
    },
  )

  if (reminderResult.error) {
    throw new Error(`Resend error scheduling birthday RSVP reminder: ${reminderResult.error.message}`)
  }
}

function buildConfirmationText({
  attendeeCount,
  attendance,
  name,
  siteOrigin,
}: {
  attendeeCount: number
  attendance: BirthdayAttendance
  name: string
  siteOrigin: string
}): string {
  const intro =
    attendance === "yes"
      ? `Thanks for RSVPing, ${name}. We’ve got ${formatPartySize(attendeeCount)} down for Nate’s birthday party.`
      : `Thanks for letting us know, ${name}. We’re sorry you can’t make it, and we appreciate the heads up.`

  return [
    birthdayCalendarTitle,
    "",
    intro,
    "",
    "Event details",
    birthdayPartyDateText,
    birthdayPartyTimeText,
    birthdayCalendarLocation,
    "",
    `Party page: ${siteOrigin}/birthday`,
    attendance === "yes" ? "Add it to your calendar from the party page if you haven't already." : "",
  ]
    .filter(Boolean)
    .join("\n")
}

function buildReminderText({
  attendeeCount,
  name,
  siteOrigin,
}: {
  attendeeCount: number
  name: string
  siteOrigin: string
}): string {
  return [
    `Hi ${name},`,
    "",
    `This is a reminder that Nate’s first birthday party is tomorrow. We’ve got ${formatPartySize(attendeeCount)} down for the celebration.`,
    "",
    "Event details",
    birthdayPartyDateText,
    birthdayPartyTimeText,
    birthdayCalendarLocation,
    "",
    `Party page: ${siteOrigin}/birthday`,
  ].join("\n")
}

function formatPartySize(attendeeCount: number): string {
  return `${attendeeCount} guest${attendeeCount === 1 ? "" : "s"}`
}

function getSiteOrigin(): string {
  const explicitSiteUrl = normalizeSiteOrigin(process.env.NEXT_PUBLIC_SITE_URL)

  if (explicitSiteUrl) {
    return explicitSiteUrl
  }

  const candidates =
    process.env.VERCEL_ENV === "production"
      ? [process.env.VERCEL_PROJECT_PRODUCTION_URL, process.env.VERCEL_URL]
      : [process.env.VERCEL_URL, process.env.VERCEL_PROJECT_PRODUCTION_URL]

  for (const candidate of candidates) {
    const normalizedCandidate = normalizeSiteOrigin(candidate)
    if (normalizedCandidate) {
      return normalizedCandidate
    }
  }

  return process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://gonatego.com"
}

function normalizeSiteOrigin(candidate: string | undefined): string | null {
  if (!candidate) {
    return null
  }

  const trimmedCandidate = candidate.trim()
  if (!trimmedCandidate) {
    return null
  }

  if (trimmedCandidate.startsWith("http://") || trimmedCandidate.startsWith("https://")) {
    return trimmedCandidate.replace(/\/$/, "")
  }

  return `https://${trimmedCandidate.replace(/\/$/, "")}`
}

function shouldScheduleBirthdayReminder(): boolean {
  return Date.now() < new Date(birthdayReminderScheduledAt).getTime()
}
