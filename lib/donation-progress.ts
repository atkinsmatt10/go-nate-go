export interface DonationProgressData {
  readonly goal: number
  readonly numDonations: number
  readonly total: number
  readonly lastUpdated: string
  readonly stale: boolean
}
