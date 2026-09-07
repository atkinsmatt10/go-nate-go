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

  test("hero and fundraising donation links remain visible", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.locator(".hero-section").getByRole("link", { name: "Donate to CHOP", exact: true })).toBeVisible()
    await expect(page.getByAltText("Nate with his family in the story video")).toBeVisible()
    const fundraisingSection = page.locator("#donate:visible")
    await fundraisingSection.scrollIntoViewIfNeeded()
    await expect(fundraisingSection.getByRole("heading", { name: "For the Next Child" })).toBeVisible()
    await expect(fundraisingSection.getByRole("link", { name: "Donate to CHOP", exact: true })).toBeVisible()
    await expect(fundraisingSection.getByRole("link", { name: "Donate to CHOP", exact: true }))
      .toHaveAttribute("href", "https://chop.donordrive.com/teams/nate-the-great")
    const merchandiseHeading = page.getByRole("heading", { name: "Team Natey Shark", exact: true })
    await merchandiseHeading.scrollIntoViewIfNeeded()
    const opacity = await merchandiseHeading.evaluate((element) => {
      let visibleOpacity = 1
      for (let parent: Element | null = element; parent; parent = parent.parentElement) {
        visibleOpacity *= Number(getComputedStyle(parent).opacity)
      }
      return visibleOpacity
    })
    expect(opacity).toBe(1)
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

test("merchandise selection works by keyboard with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/")
  const merchandise = page.locator("#shirt")
  await merchandise.scrollIntoViewIfNeeded()

  const beanie = merchandise.getByRole("button", { name: "Go to Nate the Great Thermal Waffle Beanie" })
  await beanie.focus()
  await beanie.press("Space")
  await expect(beanie).toHaveAttribute("aria-pressed", "true")
  await expect(merchandise.getByRole("heading", { name: "Nate the Great Thermal Waffle Beanie", exact: true })).toBeVisible()
  await expect(merchandise.getByAltText("Shop Nate the Great Thermal Waffle Beanie")).toBeVisible()
  await expect(merchandise.locator('a[href="https://shop.gonatego.com/products/waffle-beanie"]')).toBeVisible()

  const shirt = merchandise.getByRole("button", { name: "Go to Nate the Great Heavyweight Tee" })
  await shirt.focus()
  await shirt.press("Enter")
  await expect(shirt).toHaveAttribute("aria-pressed", "true")
  await expect(merchandise.getByAltText("Shop Nate the Great Heavyweight Tee")).toBeVisible()
  await expect(merchandise.locator('button[aria-pressed="true"]')).toHaveCount(1)
})

test("merchandise drag advances the product and a click opens its shop link", async ({ page }) => {
  await page.context().route("https://shop.gonatego.com/**", (route) => route.fulfill({ body: "Test shop destination" }))
  await page.goto("/")
  const merchandise = page.locator("#shirt")
  await merchandise.scrollIntoViewIfNeeded()
  await merchandise.getByRole("button", { name: "Pause slideshow" }).click()
  const firstProduct = merchandise.getByAltText("Shop Nate the Great Heavyweight Tee")
  await firstProduct.scrollIntoViewIfNeeded()
  await firstProduct.click({ trial: true }) // Wait for stable, actionable geometry without activating the link.
  const box = await firstProduct.boundingBox()
  if (!box) throw new Error("The merchandise image must be visible for the swipe interaction")

  const startX = box.x + box.width * 0.8
  const y = box.y + box.height * 0.5
  const pagesBeforeDrag = page.context().pages().length
  await page.mouse.move(startX, y)
  await page.mouse.down()
  for (let step = 1; step <= 8; step++) {
    await page.mouse.move(startX - box.width * 0.65 * step / 8, y)
    await page.waitForTimeout(16) // Frame-paced movement produces a realistic swipe velocity.
  }
  await page.mouse.up()

  await expect(merchandise.getByRole("button", { name: "Go to Nate the Great Premium Midweight Crew" }))
    .toHaveAttribute("aria-pressed", "true")
  await expect(merchandise.getByRole("heading", { name: "Nate the Great Premium Midweight Crew", exact: true })).toBeVisible()
  expect(page.context().pages()).toHaveLength(pagesBeforeDrag)

  const productLink = merchandise.locator('a[href="https://shop.gonatego.com/products/unisex-premium-sweatshirt"]')
  for (const activation of ["keyboard", "pointer"]) {
    const shopPagePromise = page.waitForEvent("popup")
    if (activation === "keyboard") {
      // No new pointerdown: keyboard activation must work immediately after a drag.
      await productLink.focus()
      await productLink.press("Enter")
    } else {
      await productLink.click()
    }
    const shopPage = await shopPagePromise
    await expect(shopPage).toHaveURL("https://shop.gonatego.com/products/unisex-premium-sweatshirt")
    await shopPage.close()
  }
})

test.describe("touchscreen merchandise", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true })

  test("a horizontal touch swipe advances the product", async ({ page }) => {
    await page.goto("/")
    const merchandise = page.locator("#shirt")
    await merchandise.scrollIntoViewIfNeeded()
    await merchandise.getByRole("button", { name: "Pause slideshow" }).tap()
    const firstProduct = merchandise.getByAltText("Shop Nate the Great Heavyweight Tee")
    await firstProduct.scrollIntoViewIfNeeded()
    await firstProduct.tap({ trial: true })
    const box = await firstProduct.boundingBox()
    if (!box) throw new Error("The merchandise image must be visible for the touch interaction")

    const x = box.x + box.width * 0.8
    const y = box.y + box.height * 0.5
    // The Chrome test project uses trusted browser input, not dispatched DOM events.
    const input = await page.context().newCDPSession(page)
    await input.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] })
    for (let step = 1; step <= 8; step++) {
      await input.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - box.width * 0.65 * step / 8, y }],
      })
      await page.waitForTimeout(16)
    }
    await input.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] })
    await input.detach()

    await expect(merchandise.getByRole("button", { name: "Go to Nate the Great Premium Midweight Crew" }))
      .toHaveAttribute("aria-pressed", "true")
    await expect(merchandise.getByAltText("Shop Nate the Great Premium Midweight Crew")).toBeVisible()
  })
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
