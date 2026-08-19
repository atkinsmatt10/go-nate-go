import "server-only"

import { cacheLife } from "next/cache"
import { FALLBACK_DONATION_PROGRESS, type DonationProgressData } from "@/lib/donation-progress"

interface DonorDriveTeam {
  fundraisingGoal?: unknown
  numDonations?: unknown
  sumDonations?: unknown
}

// The alias currently resolves to team 16431 and survives annual event ID changes.
const donorDriveTeamUrl = "https://chop.donordrive.com/api/1.6/teams/nate-the-great"

export async function getDonationProgress(): Promise<DonationProgressData> {
  "use cache: remote"
  cacheLife({ stale: 15, revalidate: 15, expire: 60 })

  try {
    const response = await fetch(donorDriveTeamUrl, {
      signal: AbortSignal.timeout(5_000),
    })

    if (!response.ok) {
      return FALLBACK_DONATION_PROGRESS
    }

    const payload: unknown = await response.json()
    const team = (Array.isArray(payload) ? payload[0] : payload) as DonorDriveTeam | undefined

    if (!team || typeof team.sumDonations !== "number") {
      return FALLBACK_DONATION_PROGRESS
    }

    return {
      goal:
        typeof team.fundraisingGoal === "number"
          ? team.fundraisingGoal
          : FALLBACK_DONATION_PROGRESS.goal,
      numDonations: typeof team.numDonations === "number" ? team.numDonations : 0,
      total: team.sumDonations,
    }
  } catch {
    return FALLBACK_DONATION_PROGRESS
  }
}
