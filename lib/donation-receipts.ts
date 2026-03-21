import "server-only"

const REQUIRED_CUSTOM_DONATION_RECEIPT_ENV_KEYS = [
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "STRIPE_WEBHOOK_SECRET",
] as const

interface CustomDonationReceiptConfigStatus {
  enabled: boolean
  missingEnvKeys: string[]
  ready: boolean
}

export function getCustomDonationReceiptConfigStatus(): CustomDonationReceiptConfigStatus {
  const enabled = process.env.ENABLE_CUSTOM_DONATION_RECEIPTS === "true"
  const missingEnvKeys = REQUIRED_CUSTOM_DONATION_RECEIPT_ENV_KEYS.filter((key) => !process.env[key])

  return {
    enabled,
    missingEnvKeys,
    ready: enabled && missingEnvKeys.length === 0,
  }
}
