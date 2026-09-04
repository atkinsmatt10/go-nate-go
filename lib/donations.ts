import "server-only"

import { unstable_cache } from "next/cache"
import { DONATION_STALE_AFTER_MS, fetchDonationSnapshot } from "@/lib/donordrive"
import type { DonationProgressData } from "@/lib/donation-progress"

// Use the persistent Data Cache deliberately: unsuccessful revalidation retains the
// last validated snapshot. Never cache a fabricated total or an error as a success.
// This shared entry serves both the homepage and the API across server instances.
const getCachedDonationSnapshot = unstable_cache(
  fetchDonationSnapshot,
  ["donordrive-nate-the-great-v2"],
  { revalidate: 15 },
)

export async function getDonationSnapshot() {
  const snapshot = await getCachedDonationSnapshot()
  return {
    ...snapshot,
    stale: Date.now() - Date.parse(snapshot.lastUpdated) > DONATION_STALE_AFTER_MS,
  }
}

export async function getDonationProgress(): Promise<DonationProgressData | undefined> {
  try {
    const { total, goal, numDonations, lastUpdated, stale } = await getDonationSnapshot()
    return { total, goal, numDonations, lastUpdated, stale }
  } catch {
    console.error("Donation progress unavailable: no validated snapshot in the cache")
    return undefined
  }
}
