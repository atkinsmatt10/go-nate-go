import Stripe from "stripe"

const API_VERSION: Stripe.LatestApiVersion = "2026-02-25.clover"

let stripeClient: Stripe | null = null

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!secretKey) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable")
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: API_VERSION,
    })
  }

  return stripeClient
}
