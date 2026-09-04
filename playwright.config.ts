import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 30_000,
  use: {
    baseURL: "http://127.0.0.1:3100",
    channel: "chrome",
    headless: true,
    trace: "retain-on-failure",
  },
  webServer: {
    command: process.env.PLAYWRIGHT_USE_PRODUCTION
      ? "pnpm exec next start --port 3100"
      : "pnpm exec next dev --webpack --port 3100",
    url: "http://127.0.0.1:3100",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
    env: { NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: "pk_test_site_review" },
  },
})
