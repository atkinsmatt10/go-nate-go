import { NextResponse } from "next/server"
import { getStripeClient } from "@/lib/stripe"

export const runtime = "nodejs"

interface PaymentIntentRequestBody {
  amountInCents?: unknown
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

export async function POST(request: Request) {
  let body: PaymentIntentRequestBody

  try {
    body = (await request.json()) as PaymentIntentRequestBody
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

  try {
    const stripe = getStripeClient()
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "usd",
      description: "Donation to Team Nate the Great",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        campaign: "nate-the-great",
        type: "donation",
      },
    })

    if (!paymentIntent.client_secret) {
      return NextResponse.json(
        { error: "Unable to create payment intent" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error("Stripe payment intent error:", error)
    return NextResponse.json(
      { error: "Unable to initialize donation payment" },
      { status: 500 },
    )
  }
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const paymentIntentId = requestUrl.searchParams.get("payment_intent")

  if (!paymentIntentId) {
    return NextResponse.json({ error: "Missing payment_intent" }, { status: 400 })
  }

  try {
    const stripe = getStripeClient()
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      description: paymentIntent.description,
    })
  } catch (error) {
    console.error("Stripe payment intent retrieval error:", error)
    return NextResponse.json(
      { error: "Unable to retrieve payment intent" },
      { status: 500 },
    )
  }
}
