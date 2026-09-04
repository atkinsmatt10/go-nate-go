import { z } from "zod"

const donationAmount = z.number().int().min(100).max(1_000_000)

export const paymentIntentRequestSchema = z.object({ amountInCents: donationAmount })

export const checkoutSessionRequestSchema = paymentIntentRequestSchema.extend({
  email: z.string().trim().toLowerCase().max(254).email(),
})
