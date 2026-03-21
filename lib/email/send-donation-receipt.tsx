import "server-only"
import type Stripe from "stripe"
import { DonationReceiptEmail } from "@/components/emails/donation-receipt-email"
import { getResendClient, getResendFromEmail, getResendReplyToEmail } from "@/lib/resend"

const DONATION_LABEL = "Donation to Team Nate the Great"

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
  const paidAtText = formatPaidAt(latestCharge?.created ?? session.created)
  const receiptNumber = latestCharge?.receipt_number || session.id
  const paymentMethodText = formatPaymentMethod(latestCharge)
  const siteOrigin = getSiteOrigin()
  const statusPageUrl = `${siteOrigin}/donate/return?session_id=${encodeURIComponent(session.id)}`
  const replyToEmail = getResendReplyToEmail()
  const supportPhone = process.env.DONATION_RECEIPT_SUPPORT_PHONE?.trim() || undefined
  const resend = getResendClient()
  const subjectPrefix = session.livemode ? "" : "[Test] "

  const { error } = await resend.emails.send(
    {
      from: getResendFromEmail(),
      to: recipientEmail,
      replyTo: replyToEmail,
      subject: `${subjectPrefix}Your Nate the Great receipt [${receiptNumber}]`,
      react: (
        <DonationReceiptEmail
          amountText={amountText}
          donationDateText={paidAtText}
          donationLabel={DONATION_LABEL}
          paymentMethodText={paymentMethodText}
          receiptNumber={receiptNumber}
          recipientEmail={recipientEmail}
          replyToEmail={replyToEmail}
          siteOrigin={siteOrigin}
          statusPageUrl={statusPageUrl}
          supportPhone={supportPhone}
        />
      ),
      text: buildPlainTextReceipt({
        amountText,
        donationDateText: paidAtText,
        paymentMethodText,
        receiptNumber,
        recipientEmail,
        replyToEmail,
        statusPageUrl,
        supportPhone,
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

function formatPaidAt(unixTimestampInSeconds: number): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(new Date(unixTimestampInSeconds * 1000))
}

function formatPaymentMethod(charge: Stripe.Charge | null): string {
  if (!charge?.payment_method_details) {
    return "Stripe checkout"
  }

  const { payment_method_details: paymentMethodDetails } = charge
  if (paymentMethodDetails.type === "card") {
    const brand = paymentMethodDetails.card?.brand
    const wallet = paymentMethodDetails.card?.wallet?.type
    const parts = [
      brand ? brand.toUpperCase() : "Card",
      wallet ? `via ${formatWallet(wallet)}` : null,
    ].filter(Boolean)

    return parts.join(" ")
  }

  return formatLabel(paymentMethodDetails.type)
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
  paymentMethodText: string
  receiptNumber: string
  recipientEmail: string
  replyToEmail?: string
  statusPageUrl: string
  supportPhone?: string
}

function buildPlainTextReceipt({
  amountText,
  donationDateText,
  paymentMethodText,
  receiptNumber,
  recipientEmail,
  replyToEmail,
  statusPageUrl,
  supportPhone,
}: PlainTextReceiptParams): string {
  const supportLine = replyToEmail
    ? supportPhone
      ? `${replyToEmail} or ${supportPhone}`
      : replyToEmail
    : supportPhone || "the fundraising team"

  return [
    `Receipt from Nate the Great`,
    ``,
    `Receipt number: ${receiptNumber}`,
    `Amount paid: ${amountText}`,
    `Date paid: ${donationDateText}`,
    `Payment method: ${paymentMethodText}`,
    `Donation: ${DONATION_LABEL} x 1`,
    ``,
    `Sent to: ${recipientEmail}`,
    `Donation status: ${statusPageUrl}`,
    `Support: ${supportLine}`,
    ``,
    `Thank you for supporting Nate and CHOP childhood cancer care and research.`,
  ].join("\n")
}
