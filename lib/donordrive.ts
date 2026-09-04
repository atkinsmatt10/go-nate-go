import { z } from "zod"

const donorDriveTeamSchema = z.object({
  fundraisingGoal: z.number().finite().positive(),
  numDonations: z.number().int().nonnegative(),
  sumDonations: z.number().finite().nonnegative(),
  name: z.string().optional(),
})

// The alias resolves to team 16431 and survives annual event ID changes.
const DONOR_DRIVE_TEAM_URL = "https://chop.donordrive.com/api/1.6/teams/nate-the-great"
export const DONATION_CACHE_CONTROL = "s-maxage=15, stale-while-revalidate=60"
export const DONATION_STALE_AFTER_MS = 75_000

export async function fetchDonationSnapshot() {
  const response = await fetch(DONOR_DRIVE_TEAM_URL, {
    cache: "no-store",
    signal: AbortSignal.timeout(5_000),
  })
  if (!response.ok) throw new Error(`DonorDrive returned ${response.status}`)

  const payload: unknown = await response.json()
  const team = donorDriveTeamSchema.parse(Array.isArray(payload) ? payload[0] : payload)
  return {
    total: team.sumDonations,
    goal: team.fundraisingGoal,
    numDonations: team.numDonations,
    teamName: team.name ?? "Team Nate the Great",
    lastUpdated: new Date().toISOString(),
    etag: response.headers.get("etag"),
  }
}

export function matchesDonationEtag(ifNoneMatch: string | null, etag: string | null): boolean {
  if (!ifNoneMatch || !etag) return false
  const normalize = (value: string) => value.trim().replace(/^W\//, "")
  return ifNoneMatch.split(",").some((value) => value.trim() === "*" || normalize(value) === normalize(etag))
}
