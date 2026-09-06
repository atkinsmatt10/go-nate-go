import { expect, test } from "@playwright/test"

// All checkout creation is intercepted. These tests never create a Stripe session.
test("failed checkout initialization stops and offers one explicit retry", async ({ page }) => {
  let attempts = 0
  await page.route("**/api/stripe/checkout-session", async (route) => {
    attempts++
    await route.fulfill({ status: 503, json: { error: "Test checkout unavailable" } })
  })
  await page.goto("/donate")
  await page.getByLabel("Email for your receipt").fill("donor@example.com")
  await expect(page.getByRole("button", { name: "Retry secure checkout" })).toBeVisible()
  await page.waitForTimeout(2_500) // Regression window: previously eight attempts in 2.2 s.
  expect(attempts).toBe(1)
  await page.getByRole("button", { name: "Retry secure checkout" }).click()
  await expect.poll(() => attempts).toBe(2)
  await expect(page.getByRole("button", { name: "Retry secure checkout" })).toBeVisible()
  await page.waitForTimeout(600)
  expect(attempts).toBe(2)
})

test("changing the amount cancels obsolete checkout work without getting stuck", async ({ page }) => {
  const amounts: number[] = []
  let releaseFirst: () => void = () => undefined
  const firstPending = new Promise<void>((resolve) => { releaseFirst = resolve })
  await page.route("**/api/stripe/checkout-session", async (route) => {
    amounts.push(route.request().postDataJSON().amountInCents)
    if (amounts.length === 1) await firstPending
    await route.fulfill({ status: 503, json: { error: "Latest request completed" } }).catch(() => undefined)
  })
  await page.goto("/donate")
  await page.getByLabel("Email for your receipt").fill("donor@example.com")
  await expect.poll(() => amounts.length).toBe(1)
  await page.getByRole("button", { name: "$100.00", exact: true }).click()
  await expect.poll(() => amounts).toEqual([5_000, 10_000])
  releaseFirst()
  await expect(page.getByRole("button", { name: "Retry secure checkout" })).toBeVisible()
  await expect(page.getByText("Preparing checkout…", { exact: true })).toHaveCount(0)
})

test("hero loads a poster but no video or social provider requests before Play", async ({ page }) => {
  const requests: string[] = []
  page.on("request", (request) => requests.push(request.url()))
  await page.goto("/")
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  const poster = page.getByAltText("Nate with his family in the story video")
  await expect(poster).toBeVisible()
  await expect.poll(() => poster.evaluate((image) => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await page.waitForTimeout(1_000)
  expect(requests.filter((url) => /stream\.mux\.com|mux-player|instagram\.com|platform\.twitter\.com/.test(url))).toEqual([])
  await page.getByRole("button", { name: "Play Nate's story · 3:40" }).click()
  await expect(page.locator("mux-player")).toHaveCount(1)
  await expect.poll(() => requests.some((url) => url.includes("stream.mux.com"))).toBe(true)
})

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } })

  test("hero and primary donation links remain visible", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator(".hero-section").getByRole("link", { name: "Donate to CHOP", exact: true })).toBeVisible()
    await expect(page.getByAltText("Nate with his family in the story video")).toBeVisible()
  })
})

test("reduced motion keeps the merchandise carousel still", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  await page.locator("#shirt").scrollIntoViewIfNeeded()
  const selected = page.locator('#shirt button[aria-pressed="true"]')
  const label = await selected.getAttribute("aria-label")
  await page.waitForTimeout(5_500)
  await expect(selected).toHaveAttribute("aria-label", label!)
  await expect(page.getByRole("button", { name: "Pause slideshow" })).toHaveCount(0)
})

test("polling pauses offscreen and failures retain the last confirmed total", async ({ page }) => {
  test.setTimeout(50_000)
  let failRequests: boolean = false
  let requests: number = 0
  await page.route("**/api/donations", async (route) => {
    requests++
    await route.fulfill(failRequests
      ? { status: 502, json: { error: "Test upstream unavailable" } }
      : { status: 200, json: { total: 7_543, goal: 30_000, numDonations: 66, stale: false, lastUpdated: "2026-09-04T12:00:00.000Z" } })
  })
  await page.goto("/")
  // Wait for the streamed Server Component to replace its Suspense fallback.
  await expect(page.locator("#donate")).toHaveCount(1, { timeout: 10_000 })
  await page.locator("#donate").scrollIntoViewIfNeeded()
  await expect.poll(() => requests).toBe(1)
  await expect(page.getByLabel("$7,543 raised", { exact: true })).toBeVisible()
  await page.waitForTimeout(15_500)
  await expect.poll(() => requests).toBe(2)
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(page.locator("#donate")).not.toBeInViewport()
  await page.waitForTimeout(15_500)
  expect(requests).toBe(2)

  failRequests = true
  await page.locator("#donate").scrollIntoViewIfNeeded()
  await expect.poll(() => requests).toBe(3)
  await expect(page.getByText(/Showing the last confirmed total/)).toBeVisible()
  await expect(page.getByLabel("$7,543 raised", { exact: true })).toBeVisible()
})

test("payment routes reject malformed values and the birthday RSVP is closed", async ({ request }) => {
  for (const path of ["checkout-session", "payment-intent"]) {
    for (const body of ["null", "[]", "{}", '{"amountInCents":-1,"email":"donor@example.com"}', '{"amountInCents":1000001,"email":"donor@example.com"}']) {
      const response = await request.post(`/api/stripe/${path}`, { data: body, headers: { "Content-Type": "application/json" } })
      expect(response.status()).toBe(400)
    }
  }
  expect((await request.post("/api/birthday-rsvp", { data: {} })).status()).toBe(410)
})

test("published metadata links and archived birthday page are valid", async ({ page, request }) => {
  expect((await request.get("/robots.txt")).status()).toBe(200)
  expect((await request.get("/sitemap.xml")).status()).toBe(200)
  await page.goto("/birthday")
  await expect(page.getByText("This celebration has ended. RSVPs are closed.")).toBeVisible()
  await expect(page.locator("form")).toHaveCount(0)
  await page.goto("/donate")
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://gonatego.com/donate")
  await expect(page.locator('link[hreflang="es-419"]')).toHaveCount(0)
  for (const href of await page.locator('link[rel="icon"]').evaluateAll((links) => links.map((link) => (link as HTMLLinkElement).href))) {
    expect((await request.get(href)).status()).toBe(200)
  }
})


test("checkout content stays opaque with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/donate")
  const heading = page.getByRole("heading", { level: 1 })
  await expect(heading).toBeVisible()
  const invisibleAncestors = await heading.evaluate((element) => {
    const hidden: string[] = []
    for (let parent: Element | null = element; parent; parent = parent.parentElement) {
      if (getComputedStyle(parent).opacity === "0") hidden.push(parent.tagName)
    }
    return hidden
  })
  expect(invisibleAncestors).toEqual([])
})
