import { expect, test, type Page } from "@playwright/test"

// Native WebGL matches the real browser. Avoid per-action canvas screenshots in
// the trace: GPU readback can stall the clock-sensitive checks on busy machines.
test.use({
  viewport: { width: 1440, height: 1000 },
  trace: { mode: "retain-on-failure", screenshots: false, snapshots: true, sources: true },
})

const ocean = (page: Page) => page.locator(".hero-ocean")
const shark = (page: Page) => page.getByRole("button", { name: "Play shark tag", exact: true })
const fish = (page: Page) => page.locator(".hero-ocean-canvas")
const oceanPlayback = (page: Page) => page.getByRole("button", { name: /^(Play|Pause|Resume) ocean animation$/ })

test.beforeEach(async ({ page }) => {
  // Do not create a checkout or depend on the live fundraiser for this effect.
  await page.route("**/api/stripe/**", (route) => route.fulfill({ status: 503, json: { error: "Test only" } }))
  await page.route("**/api/donations", (route) => route.fulfill({
    json: { total: 7543, goal: 30000, numDonations: 66, stale: false, lastUpdated: "2026-09-16T12:00:00.000Z" },
  }))
})

async function openReadyOcean(page: Page): Promise<void> {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await expect(shark(page)).toBeVisible()
  await expect(ocean(page)).toHaveAttribute("data-ready", "true", { timeout: 20_000 })
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
  await expect(fish(page)).toHaveAttribute("data-wave-state", "calm")
  await expect(oceanPlayback(page)).toHaveCount(0)
  await expect(page.locator(".hero-fish")).toHaveCount(0)
}

async function expectNoOverflow(page: Page): Promise<void> {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1)
}

async function clickBusyShark(page: Page): Promise<void> {
  // aria-disabled advertises a running chase. A real pointer can still reach
  // the button; bypass Playwright's enabled-state wait to test those repeats.
  const bounds = await shark(page).boundingBox()
  await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2)
}

async function expectStaticShark(page: Page): Promise<void> {
  const image = shark(page).locator("img")
  await expect(image).toHaveCount(1)
  await expect(image).toBeVisible()
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0)
  await expect.poll(() => image.evaluate((element) => {
    let opacity = 1
    for (let parent: Element | null = element; parent; parent = parent.parentElement) {
      opacity *= Number(getComputedStyle(parent).opacity)
    }
    return opacity
  })).toBeGreaterThan(0.99)
  await expect(shark(page)).not.toHaveAttribute("data-scene-shark", "true")
}

test("keyboard activation completes one chase without moving content or losing focus", async ({ page }) => {
  const errors: string[] = []
  page.on("pageerror", (error) => errors.push(error.message))
  await openReadyOcean(page)
  const hero = page.locator(".hero-section")
  const donation = hero.getByRole("link", { name: "Donate to CHOP", exact: true })
  const video = page.getByRole("button", { name: "Play Nate's story · 3:40" })
  const before = await Promise.all([hero.boundingBox(), donation.boundingBox(), video.boundingBox()])
  const target = await shark(page).boundingBox()
  expect(target!.width).toBeGreaterThanOrEqual(44)
  expect(target!.height).toBeGreaterThanOrEqual(44)
  expect(await shark(page).evaluate((button) => button.closest('[aria-hidden="true"]'))).toBeNull()
  expect(await hero.evaluate((element) => element.scrollTop)).toBe(0)

  await shark(page).focus()
  expect(await hero.evaluate((element) => element.scrollTop)).toBe(0)
  await page.keyboard.press("Enter")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "anticipation")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")
  await expect(shark(page)).toBeFocused()
  expect(await shark(page).evaluate((button) => {
    const style = getComputedStyle(button)
    return style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0 || style.boxShadow !== "none"
  })).toBe(true)
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await expect(shark(page)).toHaveAttribute("data-scene-shark", "true")
  await expect(shark(page).locator("img")).toHaveCSS("visibility", "hidden")
  await expect(page.locator(".hero-ocean-canvas")).toHaveCSS("opacity", "1")
  await donation.click({ trial: true })
  await video.click({ trial: true })
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "return", { timeout: 6_000 })
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle", { timeout: 4_000 })
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")
  await expect(shark(page)).toBeFocused()
  await expectStaticShark(page)
  expect(await hero.evaluate((element) => element.scrollTop)).toBe(0)
  expect(await Promise.all([hero.boundingBox(), donation.boundingBox(), video.boundingBox()])).toEqual(before)
  await expect(donation).toHaveAttribute("href", "https://chop.donordrive.com/teams/nate-the-great")
  await expectNoOverflow(page)
  expect(errors).toEqual([])

  await page.keyboard.press("Space")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "anticipation")
  await expect(shark(page)).toBeFocused()
})

test("fish appear only on activation, leave after 12 seconds, and repeated taps do not restart the chase", async ({ page }) => {
  test.setTimeout(40_000)
  await openReadyOcean(page)
  await page.waitForTimeout(600)
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
  await shark(page).click()
  const started = Date.now()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")
  await expect(fish(page)).toHaveAttribute("data-wave-state", "active")
  for (let index = 0; index < 3; index++) {
    await page.waitForTimeout(500)
    await clickBusyShark(page)
  }
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle", { timeout: 4_000 })
  expect(Date.now() - started).toBeLessThan(6500)
  await page.waitForTimeout(1_000)
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden", { timeout: 9_000 })
  await expect(fish(page)).toHaveAttribute("data-wave-state", "calm")
  expect(Date.now() - started).toBeGreaterThanOrEqual(10_000)
  expect(Date.now() - started).toBeLessThan(15_000)
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expectStaticShark(page)
})

test("another completed activation gives fish a fresh 12-second visit", async ({ page }) => {
  test.setTimeout(50_000)
  await openReadyOcean(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle", { timeout: 8_000 })
  await page.waitForTimeout(4_000)
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")

  await shark(page).focus()
  await page.keyboard.press("Space")
  const restarted = Date.now()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle", { timeout: 8_000 })
  // The original visit would already have expired; the accepted activation
  // keeps this school visible for its own full visit.
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")
  await expect(shark(page)).toBeFocused()
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden", { timeout: 10_000 })
  expect(Date.now() - restarted).toBeGreaterThanOrEqual(10_000)
  expect(Date.now() - restarted).toBeLessThan(15_000)
})

test("the ocean stays still before and after a shark visit without playback controls", async ({ page }) => {
  test.setTimeout(45_000)
  await openReadyOcean(page)
  await expect(fish(page)).toHaveCSS("opacity", "1")
  await page.evaluate(() => document.fonts.ready.then(() => undefined))
  // Capture the real composited canvas; mask foreground controls so their
  // hover/focus styling cannot look like ocean motion in the pixel comparison.
  const captureOcean = () => fish(page).screenshot({
    animations: "disabled",
    mask: [page.locator(".hero-content"), shark(page)],
  })
  const initial = await captureOcean()
  await page.waitForTimeout(1_200)
  expect((await captureOcean()).toString("base64")).toBe(initial.toString("base64"))

  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await expect(fish(page)).toHaveAttribute("data-wave-state", "active")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")
  await expect(oceanPlayback(page)).toHaveCount(0)
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden", { timeout: 15_000 })
  await expect(fish(page)).toHaveAttribute("data-wave-state", "calm")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  const settled = await captureOcean()
  await page.waitForTimeout(1_200)
  expect((await captureOcean()).toString("base64")).toBe(settled.toString("base64"))
  await expect(oceanPlayback(page)).toHaveCount(0)
})

test("resize resets an active chase safely and permits another activation", async ({ page }) => {
  await openReadyOcean(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await page.setViewportSize({ width: 1024, height: 900 })
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
  await expect(fish(page)).toHaveAttribute("data-wave-state", "calm")
  await expect(shark(page)).toBeVisible()
  await expectNoOverflow(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "anticipation")
})

test("offscreen and hidden-tab suspension preserve the shared chase clock", async ({ page }) => {
  test.setTimeout(40_000)
  await openReadyOcean(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "anticipation")
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
  await expect(page.locator(".hero-section")).not.toBeInViewport()
  await page.waitForTimeout(1_200)
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "anticipation")
  await page.evaluate(() => window.scrollTo(0, 0))
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")

  // Chromium's headless tabs do not reliably become hidden when another tab is
  // focused. Dispatch the platform visibility event with its matching property.
  const suspendedPhase = await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true })
    document.dispatchEvent(new Event("visibilitychange"))
    return document.querySelector(".hero-ocean")?.getAttribute("data-shark-state")
  })
  // Capture at the visibility event itself: a busy GPU may advance from chase
  // into return between separate Playwright protocol calls.
  expect(["chase", "return"]).toContain(suspendedPhase)
  await page.waitForTimeout(5_600)
  await expect(ocean(page)).toHaveAttribute("data-shark-state", suspendedPhase!)
  await expect(fish(page)).toHaveAttribute("data-wave-state", "active")
  await page.evaluate(() => {
    Reflect.deleteProperty(document, "hidden")
    document.dispatchEvent(new Event("visibilitychange"))
  })
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle", { timeout: 8_000 })
})

test.describe("touch", () => {
  test.use({ viewport: { width: 390, height: 1000 }, isMobile: true, hasTouch: true })

  test("mobile taps complete a chase below the video and survive an orientation change", async ({ page }) => {
    await openReadyOcean(page)
    const initialHero = await page.locator(".hero-section").boundingBox()
    const video = page.getByRole("button", { name: "Play Nate's story · 3:40" })
    const videoBounds = await video.boundingBox()
    const sharkBounds = await shark(page).boundingBox()
    expect(sharkBounds!.y + sharkBounds!.height / 2).toBeGreaterThan(videoBounds!.y + videoBounds!.height)
    await page.touchscreen.tap(sharkBounds!.x + sharkBounds!.width / 2, sharkBounds!.y + sharkBounds!.height / 2)
    await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
    await expect(fish(page)).toHaveAttribute("data-fish-visibility", "visible")
    await page.touchscreen.tap(sharkBounds!.x + sharkBounds!.width / 2, sharkBounds!.y + sharkBounds!.height / 2)
    await expect(ocean(page)).toHaveAttribute("data-shark-state", "return", { timeout: 6_000 })
    await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
    expect(await page.locator(".hero-section").boundingBox()).toEqual(initialHero)
    expect(await page.locator(".hero-section").evaluate((element) => element.scrollTop)).toBe(0)
    await expectNoOverflow(page)

    await shark(page).tap()
    await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
    await page.setViewportSize({ width: 844, height: 390 })
    await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
    await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
    await expect(fish(page)).toHaveAttribute("data-wave-state", "calm")
    await expectNoOverflow(page)
    await video.click({ trial: true })
  })
})

for (const preference of ["reduced motion", "data saving"] as const) {
  test(`${preference} gives a stationary acknowledgment without starting WebGL`, async ({ page }) => {
    if (preference === "reduced motion") {
      await page.emulateMedia({ reducedMotion: "reduce" })
    } else {
      await page.addInitScript(() => {
        Object.defineProperty(navigator, "connection", {
          configurable: true,
          value: Object.assign(new EventTarget(), { saveData: true, effectiveType: "4g" }),
        })
      })
    }
    const deferredRequests: string[] = []
    page.on("request", (request) => {
      if (request.resourceType() === "script" && new URL(request.url()).pathname.startsWith("/_next/static/chunks/")) {
        deferredRequests.push(request.url())
      }
    })
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expectStaticShark(page)
    await page.waitForTimeout(500)
    const initialRequests = [...deferredRequests]
    const bounds = await shark(page).boundingBox()
    await shark(page).click()
    await expect(ocean(page)).toHaveAttribute("data-shark-state", "acknowledgment")
    await expect(ocean(page)).toHaveAttribute("data-ready", "false")
    await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
    await expect(page.locator(".hero-fish")).toHaveCount(0)
    expect(await shark(page).boundingBox()).toEqual(bounds)
    await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
    await expectStaticShark(page)
    await expect(oceanPlayback(page)).toHaveCount(0)
    expect(deferredRequests).toEqual(initialRequests)
  })
}

test("enabling data saving during a chase immediately hands the shark back to the static illustration", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: Object.assign(new EventTarget(), { saveData: false, effectiveType: "4g" }),
    })
  })
  await openReadyOcean(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await expect(shark(page)).toHaveAttribute("data-scene-shark", "true")
  await page.evaluate(() => {
    const connection = (navigator as Navigator & { connection: EventTarget & { saveData: boolean } }).connection
    connection.saveData = true
    connection.dispatchEvent(new Event("change"))
  })
  await expect(ocean(page)).toHaveAttribute("data-ready", "false")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
  // A retiring canvas must disappear in the same handoff as the DOM artwork;
  // polling opacity here could conceal a duplicate shark during a CSS fade.
  expect(await page.locator(".hero-ocean-canvas").evaluate((canvas) => getComputedStyle(canvas).opacity)).toBe("0")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expectStaticShark(page)
})

test("WebGL context loss restores the illustration and safe stationary interaction", async ({ page }) => {
  await openReadyOcean(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "chase")
  await page.locator(".hero-ocean-canvas").evaluate((canvas) => {
    const context = (canvas as HTMLCanvasElement).getContext("webgl2")
    const extension = context?.getExtension("WEBGL_lose_context")
    if (!extension) throw new Error("The browser must expose WEBGL_lose_context for this check")
    extension.loseContext()
  })
  await expect(ocean(page)).toHaveAttribute("data-ready", "false")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
  await expectStaticShark(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "acknowledgment")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expectStaticShark(page)
})

test("WebGL startup failure leaves the illustration and main controls usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null
      return Reflect.apply(original, this, [type, ...args])
    } as typeof original
  })
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await expectStaticShark(page)
  await shark(page).click()
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "acknowledgment")
  await expect(ocean(page)).toHaveAttribute("data-shark-state", "idle")
  await expect(ocean(page)).toHaveAttribute("data-ready", "false")
  await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
  await expectStaticShark(page)
  await page.getByRole("button", { name: "Play Nate's story · 3:40" }).click({ trial: true })
  await page.locator(".hero-section").getByRole("link", { name: "Donate to CHOP", exact: true }).click({ trial: true })
})

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 390, height: 1000 } })

  test("the original shark and fundraising content remain present", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" })
    await expectStaticShark(page)
    await expect(fish(page)).toHaveAttribute("data-fish-visibility", "hidden")
    await expect(page.locator(".hero-fish")).toHaveCount(0)
    await expect(oceanPlayback(page)).toHaveCount(0)
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
    await expect(page.getByAltText("Nate with his family in the story video")).toBeVisible()
    await expect(page.locator(".hero-section").getByRole("link", { name: "Donate to CHOP", exact: true })).toBeVisible()
    await expectNoOverflow(page)
  })
})
