import { defineConfig } from "@playwright/test"

const port = process.env.PLAYWRIGHT_PORT ?? "3100"
const baseURL = `http://localhost:${port}`

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL,
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: process.env.PLAYWRIGHT_USE_PRODUCTION
      ? `pnpm exec next start --port ${port}`
      : `pnpm exec next dev --webpack --port ${port}`,
    url: baseURL,
    timeout: 120_000,
    reuseExistingServer: false,
    env: { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_site_review" },
  },
})
