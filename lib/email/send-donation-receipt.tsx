import "server-only"
import type Stripe from "stripe"
import { DonationReceiptEmail } from "@/components/emails/donation-receipt-email"
import { getResendClient, getResendFromEmail, getResendReplyToEmail } from "@/lib/resend"

const DONATION_LABEL = "Donation to Team Nate the Great"
const DEFAULT_SUPPORT_EMAIL = "help@gonatego.com"

interface SendDonationReceiptParams {
  eventId: string
  session: Stripe.Checkout.Session
}

export async function sendDonationReceiptEmail({
  eventId,
  session,
}: SendDonationReceiptParams): Promise<void> {
  const recipientEmail = getRecipientEmail(session)

  if (!recipientEmail) {
    console.warn("Skipping donation receipt email because donor email is missing.", {
      sessionId: session.id,
      eventId,
    })
    return
  }

  const paymentIntent =
    typeof session.payment_intent === "string" || !session.payment_intent
      ? null
      : session.payment_intent
  const latestCharge =
    !paymentIntent || typeof paymentIntent.latest_charge === "string" || !paymentIntent.latest_charge
      ? null
      : paymentIntent.latest_charge

  const amountText = formatAmount(session.amount_total, session.currency)
  const paidAt = new Date((latestCharge?.created ?? session.created) * 1000)
  const { dateText: donationDateText, timeText: donationTimeText } = formatDateAndTime(paidAt)
  const paymentMethodText = formatPaymentMethod(latestCharge)
  const siteOrigin = getSiteOrigin()
  const statusPageUrl = `${siteOrigin}/donate/return?session_id=${encodeURIComponent(session.id)}`
  const replyToEmail = getSupportEmail()
  const resend = getResendClient()
  const subjectPrefix = session.livemode ? "" : "[Test] "

  const { error } = await resend.emails.send(
    {
      from: getResendFromEmail(),
      to: recipientEmail,
      replyTo: replyToEmail,
      subject: `${subjectPrefix}Your Go Nate Go donation receipt`,
      react: (
        <DonationReceiptEmail
          amountText={amountText}
          donationDateText={donationDateText}
          donationLabel={DONATION_LABEL}
          donationTimeText={donationTimeText}
          paymentMethodText={paymentMethodText}
          recipientEmail={recipientEmail}
          siteOrigin={siteOrigin}
          statusPageUrl={statusPageUrl}
          supportEmail={DEFAULT_SUPPORT_EMAIL}
        />
      ),
      text: buildPlainTextReceipt({
        amountText,
        donationDateText,
        donationTimeText,
        paymentMethodText,
        recipientEmail,
        statusPageUrl,
        supportEmail: DEFAULT_SUPPORT_EMAIL,
      }),
      tags: [
        { name: "category", value: "donation_receipt" },
        { name: "campaign", value: "nate-the-great" },
      ],
    },
    {
      idempotencyKey: `stripe-receipt:${eventId}`,
    },
  )

  if (error) {
    throw new Error(`Resend error sending donation receipt: ${error.message}`)
  }
}

function getSupportEmail(): string {
  return getResendReplyToEmail() || DEFAULT_SUPPORT_EMAIL
}

function getRecipientEmail(session: Stripe.Checkout.Session): string | null {
  const emailCandidates = [
    session.customer_details?.email,
    typeof session.customer_email === "string" ? session.customer_email : null,
    session.metadata?.donor_email,
  ]

  for (const email of emailCandidates) {
    if (email?.trim()) {
      return email.trim().toLowerCase()
    }
  }

  return null
}

function formatAmount(amountInCents: number | null, currency: string | null): string {
  if (!amountInCents || !currency) {
    return "Amount unavailable"
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amountInCents / 100)
}

function formatDateAndTime(date: Date): { dateText: string; timeText: string } {
  return {
    dateText: new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeZone: "America/New_York",
    }).format(date),
    timeText: new Intl.DateTimeFormat("en-US", {
      timeStyle: "medium",
      timeZone: "America/New_York",
    }).format(date),
  }
}

function formatPaymentMethod(charge: Stripe.Charge | null): string {
  if (!charge?.payment_method_details) {
    return "Payment method unavailable"
  }

  const { payment_method_details: paymentMethodDetails } = charge
  if (paymentMethodDetails.type === "card") {
    const wallet = paymentMethodDetails.card?.wallet?.type

    return wallet ? `Paid with ${formatWallet(wallet)}` : "Paid with Card"
  }

  return `Paid with ${formatLabel(paymentMethodDetails.type)}`
}

function formatWallet(wallet: string): string {
  if (wallet === "apple_pay") {
    return "Apple Pay"
  }

  if (wallet === "google_pay") {
    return "Google Pay"
  }

  return formatLabel(wallet)
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ")
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

interface PlainTextReceiptParams {
  amountText: string
  donationDateText: string
  donationTimeText: string
  paymentMethodText: string
  recipientEmail: string
  statusPageUrl: string
  supportEmail: string
}

function buildPlainTextReceipt({
  amountText,
  donationDateText,
  donationTimeText,
  paymentMethodText,
  recipientEmail,
  statusPageUrl,
  supportEmail,
}: PlainTextReceiptParams): string {
  return [
    `Thank You For Showing Up For Nate`,
    ``,
    `Your donation receipt is below. This gift supports Nate's fundraiser for CHOP childhood cancer care and research, and means a great deal to our family.`,
    ``,
    `Amount paid: ${amountText}`,
    `Date paid: ${donationDateText}`,
    `Time paid: ${donationTimeText}`,
    `Payment method: ${paymentMethodText}`,
    `Donation: ${DONATION_LABEL} x 1`,
    ``,
    `Sent to: ${recipientEmail}`,
    ``,
    `Shop Natey Shark gear: https://shop.gonatego.com`,
    `Featured merch: Heavyweight Tee ($35), Premium Crew ($55), Thermal Waffle Beanie ($25)`,
    ``,
    `Questions about donations?`,
    `Email: ${supportEmail}`,
    `View in your browser: ${statusPageUrl}`,
  ].join("\n")
}
