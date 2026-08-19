export interface DonationProgressData {
  readonly goal: number
  readonly numDonations: number
  readonly total: number
}

export const FALLBACK_DONATION_PROGRESS: DonationProgressData = {
  goal: 25_000,
  numDonations: 62,
  total: 16_250,
}
