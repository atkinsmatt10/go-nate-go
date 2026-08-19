export interface DonationProgressData {
  readonly goal: number
  readonly numDonations: number
  readonly total: number
}

export const FALLBACK_DONATION_PROGRESS: DonationProgressData = {
  goal: 30_000,
  numDonations: 53,
  total: 5_845,
}
