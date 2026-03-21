import type Stripe from "stripe"
import { NextResponse } from "next/server"
import { getCustomDonationReceiptConfigStatus } from "@/lib/donation-receipts"
import { sendDonationReceiptEmail } from "@/lib/email/send-donation-receipt"
import { constructStripeEvent, getStripeClient } from "@/lib/stripe"

export const runtime = "nodejs"

const SUPPORTED_WEBHOOK_EVENTS = new Set<Stripe.Event.Type>([
  "checkout.session.async_payment_succeeded",
  "checkout.session.completed",
])

export async function POST(request: Request): Promise<Response> {
  const customDonationReceiptConfig = getCustomDonationReceiptConfigStatus()

  if (!customDonationReceiptConfig.ready) {
    return NextResponse.json({ received: true, ignored: true, reason: "custom_receipts_disabled" })
  }

  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
  }

  const payload = await request.text()

  let event: Stripe.Event
  try {
    event = constructStripeEvent(payload, signature)
  } catch (error) {
    console.error("Stripe webhook signature verification failed.", error)
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 })
  }

  if (!SUPPORTED_WEBHOOK_EVENTS.has(event.type)) {
    return NextResponse.json({ received: true, ignored: true })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed" && session.payment_status !== "paid") {
    return NextResponse.json({ received: true, ignored: true, reason: "payment_not_paid" })
  }

  try {
    const stripe = getStripeClient()
    const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["payment_intent.latest_charge"],
    })

    await sendDonationReceiptEmail({
      eventId: event.id,
      session: expandedSession,
    })

    return NextResponse.json({ received: true, handled: true })
  } catch (error) {
    console.error("Stripe webhook receipt delivery failed.", {
      error,
      eventId: event.id,
      eventType: event.type,
      sessionId: session.id,
    })
    return NextResponse.json({ error: "Webhook handling failed" }, { status: 500 })
  }
}
