import { NextResponse } from "next/server"
import { getCustomDonationReceiptConfigStatus } from "@/lib/donation-receipts"
import { getStripeClient } from "@/lib/stripe"

export const runtime = "nodejs"

const DONATION_DESCRIPTION =
  "Supports Team Nate the Great and CHOP childhood cancer care and research."
const RECEIPT_TEMPLATE_VERSION = "2026-03-21"

interface CheckoutSessionRequestBody {
  amountInCents?: unknown
  email?: unknown
}

function parseDonationAmount(amountInCents: unknown): number | null {
  if (typeof amountInCents !== "number") {
    return null
  }

  if (!Number.isSafeInteger(amountInCents)) {
    return null
  }

  if (amountInCents < 100 || amountInCents > 1_000_000) {
    return null
  }

  return amountInCents
}

function parseDonorEmail(email: unknown): string | null {
  if (typeof email !== "string") {
    return null
  }

  const normalizedEmail = email.trim().toLowerCase()
  if (!normalizedEmail) {
    return null
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(normalizedEmail) ? normalizedEmail : null
}

export async function POST(request: Request) {
  let body: CheckoutSessionRequestBody

  try {
    body = (await request.json()) as CheckoutSessionRequestBody
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 })
  }

  const amountInCents = parseDonationAmount(body.amountInCents)
  if (amountInCents === null) {
    return NextResponse.json(
      { error: "Donation amount must be between $1 and $10,000" },
      { status: 400 },
    )
  }

  const donorEmail = parseDonorEmail(body.email)
  if (donorEmail === null) {
    return NextResponse.json(
      { error: "Enter a valid email address to continue to checkout" },
      { status: 400 },
    )
  }

  try {
    const stripe = getStripeClient()
    const requestOrigin = new URL(request.url).origin
    const customDonationReceiptConfig = getCustomDonationReceiptConfigStatus()
    const donationMetadata = {
      campaign: "nate-the-great",
      donation_amount_in_cents: String(amountInCents),
      donation_currency: "usd",
      donor_email: donorEmail,
      receipt_template_version: RECEIPT_TEMPLATE_VERSION,
      receipt_delivery: customDonationReceiptConfig.ready ? "resend" : "stripe",
      type: "donation",
    }

    if (customDonationReceiptConfig.enabled && !customDonationReceiptConfig.ready) {
      console.warn(
        "ENABLE_CUSTOM_DONATION_RECEIPTS is true, but required config is missing. Falling back to Stripe receipts.",
        {
          missingEnvKeys: customDonationReceiptConfig.missingEnvKeys,
        },
      )
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      ui_mode: "custom",
      mode: "payment",
      billing_address_collection: "auto",
      currency: "usd",
      customer_creation: "always",
      customer_email: donorEmail,
      metadata: donationMetadata,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation to Team Nate the Great",
              description: DONATION_DESCRIPTION,
            },
            unit_amount: amountInCents,
          },
        },
      ],
      payment_intent_data: {
        description: "Donation to Team Nate the Great",
        metadata: donationMetadata,
        receipt_email: customDonationReceiptConfig.ready ? undefined : donorEmail,
      },
      return_url: `${requestOrigin}/donate/return?session_id={CHECKOUT_SESSION_ID}`,
    })

    if (!checkoutSession.client_secret) {
      return NextResponse.json(
        { error: "Unable to create checkout session" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      clientSecret: checkoutSession.client_secret,
      sessionId: checkoutSession.id,
    })
  } catch (error) {
    console.error("Stripe checkout session error:", error)
    return NextResponse.json(
      { error: "Unable to initialize donation checkout" },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const sessionId = requestUrl.searchParams.get("session_id")

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 })
  }

  try {
    const stripe = getStripeClient()
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)

    return NextResponse.json({
      amountTotal: checkoutSession.amount_total,
      currency: checkoutSession.currency,
      customerDetails: checkoutSession.customer_details,
      id: checkoutSession.id,
      paymentStatus: checkoutSession.payment_status,
      status: checkoutSession.status,
    })
  } catch (error) {
    console.error("Stripe checkout session retrieval error:", error)
    return NextResponse.json(
      { error: "Unable to retrieve checkout session" },
      { status: 500 },
    )
  }
}
