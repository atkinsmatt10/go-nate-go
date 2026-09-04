import { expect, test } from "@playwright/test"
import { fetchDonationSnapshot, matchesDonationEtag } from "../lib/donordrive"
import { checkoutSessionRequestSchema } from "../lib/donation-request"

test("DonorDrive rejects malformed successes instead of replacing a confirmed snapshot", async () => {
  const originalFetch = globalThis.fetch
  try {
    for (const payload of [null, [], {}, { sumDonations: -10, fundraisingGoal: 30000, numDonations: 1 }, { sumDonations: 10, fundraisingGoal: 0, numDonations: 1 }]) {
      globalThis.fetch = async () => Response.json(payload)
      await expect(fetchDonationSnapshot()).rejects.toThrow()
    }
    globalThis.fetch = async () => new Response("Unavailable", { status: 503 })
    await expect(fetchDonationSnapshot()).rejects.toThrow("503")
    globalThis.fetch = async () => new Response("not json")
    await expect(fetchDonationSnapshot()).rejects.toThrow()
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("DonorDrive validates a team array and preserves its ETag", async () => {
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async (_url, options) => {
      expect(options?.signal).toBeInstanceOf(AbortSignal)
      expect(options?.cache).toBe("no-store")
      return Response.json([{ sumDonations: 7450.25, fundraisingGoal: 30000, numDonations: 65 }], { headers: { ETag: 'W/"team-v1"' } })
    }
    const result = await fetchDonationSnapshot()
    expect(result).toMatchObject({ total: 7450.25, goal: 30000, numDonations: 65, etag: 'W/"team-v1"' })
    expect(Number.isFinite(Date.parse(result.lastUpdated))).toBe(true)
    expect(matchesDonationEtag('"older", "team-v1"', result.etag)).toBe(true)
    expect(matchesDonationEtag('"older"', result.etag)).toBe(false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("DonorDrive aborts a hung upstream request within five seconds", async () => {
  const originalFetch = globalThis.fetch
  try {
    globalThis.fetch = async (_url, options) => new Promise<Response>((_resolve, reject) => {
      options?.signal?.addEventListener("abort", () => reject(options.signal?.reason), { once: true })
    })
    const started = performance.now()
    await expect(fetchDonationSnapshot()).rejects.toThrow()
    expect(performance.now() - started).toBeLessThan(6_000)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("payment validation normalizes email and rejects unsafe amounts", () => {
  expect(checkoutSessionRequestSchema.parse({ amountInCents: 5000, email: " Donor@Example.com " }).email).toBe("donor@example.com")
  for (const amountInCents of [0, 99, 1.5, Infinity, NaN, 1000001]) {
    expect(checkoutSessionRequestSchema.safeParse({ amountInCents, email: "donor@example.com" }).success).toBe(false)
  }
  for (const input of [null, [], "donor@example.com", { amountInCents: 5000, email: "not-an-email" }]) {
    expect(checkoutSessionRequestSchema.safeParse(input).success).toBe(false)
  }
})
