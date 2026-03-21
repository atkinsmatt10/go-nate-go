import "server-only"
import type Stripe from "stripe"
import { DonationReceiptEmail } from "@/components/emails/donation-receipt-email"
import { getResendClient, getResendFromEmail, getResendReplyToEmail } from "@/lib/resend"
import { getStripeClient } from "@/lib/stripe"

const DONATION_LABEL = "Donation to Team Nate the Great"
const DEFAULT_SUPPORT_EMAIL = "atkinsmatt10@gmail.com"
const DEFAULT_SUPPORT_PHONE = "+1 781-864-8780"

let cachedStripeSenderText: string | null = null

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
  const receiptSentAt = new Date()
  const { dateText: donationDateText, timeText: donationTimeText } = formatDateAndTime(paidAt)
  const receiptNumber = latestCharge?.receipt_number || session.id
  const paymentMethodText = formatPaymentMethod(latestCharge)
  const siteOrigin = getSiteOrigin()
  const statusPageUrl = `${siteOrigin}/donate/return?session_id=${encodeURIComponent(session.id)}`
  const replyToEmail = getSupportEmail()
  const supportPhone = process.env.DONATION_RECEIPT_SUPPORT_PHONE?.trim() || DEFAULT_SUPPORT_PHONE
  const stripeSenderText = await getStripeSenderText()
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
          deliveredByText="Stripe for Nate the Great"
          donationDateText={donationDateText}
          donationLabel={DONATION_LABEL}
          donationTimeText={donationTimeText}
          paymentMethodText={paymentMethodText}
          receiptEmailedText={formatReceiptEmailedAt(receiptSentAt)}
          receiptNumber={receiptNumber}
          recipientEmail={recipientEmail}
          replyToSupportText={`Nate the Great <${replyToEmail}>`}
          siteOrigin={siteOrigin}
          statusPageUrl={statusPageUrl}
          stripeSenderText={stripeSenderText}
          supportEmail={replyToEmail}
          supportPhone={supportPhone}
        />
      ),
      text: buildPlainTextReceipt({
        amountText,
        deliveredByText: "Stripe for Nate the Great",
        donationDateText,
        donationTimeText,
        paymentMethodText,
        receiptEmailedText: formatReceiptEmailedAt(receiptSentAt),
        receiptNumber,
        recipientEmail,
        replyToEmail,
        statusPageUrl,
        stripeSenderText,
        supportEmail: replyToEmail,
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

function formatReceiptEmailedAt(date: Date): string {
  const dateText = new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "America/New_York",
  }).format(date)
  const timeText = new Intl.DateTimeFormat("en-US", {
    timeStyle: "short",
    timeZone: "America/New_York",
  }).format(date)

  return `${dateText} at ${timeText}`
}

function formatPaymentMethod(charge: Stripe.Charge | null): string {
  if (!charge?.payment_method_details) {
    return "Paid with Stripe"
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
  deliveredByText: string
  donationDateText: string
  donationTimeText: string
  paymentMethodText: string
  receiptEmailedText: string
  receiptNumber: string
  recipientEmail: string
  replyToEmail?: string
  statusPageUrl: string
  stripeSenderText: string
  supportEmail: string
  supportPhone?: string
}

function buildPlainTextReceipt({
  amountText,
  deliveredByText,
  donationDateText,
  donationTimeText,
  paymentMethodText,
  receiptEmailedText,
  receiptNumber,
  recipientEmail,
  replyToEmail,
  statusPageUrl,
  stripeSenderText,
  supportEmail,
  supportPhone,
}: PlainTextReceiptParams): string {
  const supportLine = supportPhone ? `${supportEmail} or ${supportPhone}` : supportEmail

  return [
    `Thank You For Showing Up For Nate`,
    ``,
    `Your donation receipt is below. This gift supports Nate's fundraiser for CHOP childhood cancer care and research, and means a great deal to our family.`,
    ``,
    `Receipt number: ${receiptNumber}`,
    `Amount paid: ${amountText}`,
    `Date paid: ${donationDateText}`,
    `Time paid: ${donationTimeText}`,
    `Payment method: ${paymentMethodText}`,
    `Donation: ${DONATION_LABEL} x 1`,
    ``,
    `Receipt details`,
    `Sent to: ${recipientEmail}`,
    `Reply-to support: Nate the Great <${replyToEmail ?? supportEmail}>`,
    `Receipt emailed: ${receiptEmailedText}`,
    `Delivered by: ${deliveredByText}`,
    `Stripe sender: ${stripeSenderText}`,
    ``,
    `Questions about your donation?`,
    `Support: ${supportLine}`,
    `View in your browser: ${statusPageUrl}`,
    ``,
    `You're receiving this email because you made a donation to Nate the Great, which partners with Stripe to provide invoicing and payment processing.`,
  ].join("\n")
}

async function getStripeSenderText(): Promise<string> {
  if (cachedStripeSenderText) {
    return cachedStripeSenderText
  }

  try {
    const account = await getStripeClient().accounts.retrieve()
    cachedStripeSenderText = `receipts+${account.id}@stripe.com`
  } catch {
    cachedStripeSenderText = "receipts@stripe.com"
  }

  return cachedStripeSenderText
}
