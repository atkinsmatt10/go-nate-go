import { NextResponse } from "next/server"
import { z } from "zod"
import { sendBirthdayRsvpAttendeeEmails } from "@/lib/email/send-birthday-rsvp-emails"
import { getResendClient, getResendFromEmail, getResendReplyToEmail } from "@/lib/resend"

const defaultBirthdayRsvpRecipient = "support@gonatego.com"

const birthdayRsvpSchema = z.object({
  name: z.string().trim().min(2).max(80),
  attendeeCount: z.number().int().min(1).max(12),
  attendance: z.enum(["yes", "no"]),
  email: z.string().trim().max(160).optional(),
})

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const parsed = birthdayRsvpSchema.safeParse(payload)
    const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()
    const hasResendApiKey = Boolean(process.env.RESEND_API_KEY?.trim())

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please enter a valid name, party size, RSVP choice, and email if you want a reminder." },
        { status: 400 },
      )
    }

    const recipients = getBirthdayRsvpRecipients()
    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "RSVP email is not configured yet. Please try again later." },
        { status: 503 },
      )
    }

    if (!hasResendApiKey || !fromEmail) {
      return NextResponse.json(
        { error: "RSVP email is not configured yet. Please try again later." },
        { status: 503 },
      )
    }

    const { attendeeCount, attendance, email, name } = parsed.data
    const normalizedEmail = normalizeBirthdayEmail(email)

    if (normalizedEmail && !z.string().email().safeParse(normalizedEmail).success) {
      return NextResponse.json(
        { error: "Please enter a valid email address if you’d like a confirmation and reminder." },
        { status: 400 },
      )
    }

    const resend = getResendClient()
    const submittedAt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "America/New_York",
    }).format(new Date())

    const attendanceLabel = attendance === "yes" ? "Attending" : "Not attending"

    const { error } = await resend.emails.send({
      from: fromEmail ?? getResendFromEmail(),
      to: recipients,
      replyTo: getResendReplyToEmail(),
      subject: `Birthday RSVP: ${name} · ${attendanceLabel}`,
      text: [
        "Nate the Great birthday RSVP",
        "",
        `Name: ${name}`,
        `Attendance: ${attendanceLabel}`,
        `Party size: ${attendeeCount}`,
        `Reminder email: ${normalizedEmail || "Not provided"}`,
        `Submitted: ${submittedAt}`,
        "",
        "Event details",
        "Saturday, May 9, 2026",
        "12:00 PM to 3:00 PM",
        "Craft Hall",
        "901 N Delaware Ave",
        "Philadelphia, PA 19123",
      ].join("\n"),
    })

    if (error) {
      console.error("Failed to send birthday RSVP email.", error)
      return NextResponse.json(
        { error: "Your RSVP could not be sent right now. Please try again." },
        { status: 500 },
      )
    }

    if (normalizedEmail) {
      try {
        await sendBirthdayRsvpAttendeeEmails({
          attendeeCount,
          attendance,
          email: normalizedEmail,
          name,
        })
      } catch (attendeeEmailError) {
        console.error("Birthday RSVP attendee email delivery failed.", attendeeEmailError)
      }
    }

    return NextResponse.json({ message: "RSVP sent." }, { status: 201 })
  } catch (error) {
    console.error("Unexpected birthday RSVP submission failure.", error)
    return NextResponse.json(
      { error: "Your RSVP could not be sent right now. Please try again." },
      { status: 500 },
    )
  }
}

function getBirthdayRsvpRecipients(): string[] {
  const configuredRecipients =
    process.env.BIRTHDAY_RSVP_TO_EMAIL?.trim() ||
    defaultBirthdayRsvpRecipient ||
    getResendReplyToEmail() ||
    parseEmailAddress(process.env.RESEND_FROM_EMAIL)

  return configuredRecipients
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean)
}

function parseEmailAddress(emailValue: string | undefined): string {
  if (!emailValue?.trim()) {
    return ""
  }

  const match = emailValue.match(/<([^>]+)>/)
  return match?.[1]?.trim() ?? emailValue.trim()
}

function normalizeBirthdayEmail(emailValue: string | undefined): string | undefined {
  const trimmedEmail = emailValue?.trim().toLowerCase()
  return trimmedEmail ? trimmedEmail : undefined
}
