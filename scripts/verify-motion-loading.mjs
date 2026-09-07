#!/usr/bin/env node
// Production-browser regressions for optional animation loading. Not a benchmark.
import assert from "node:assert/strict"
import { createRequire } from "node:module"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const flags = Object.fromEntries(process.argv.slice(2).map((arg, index, all) =>
  arg.startsWith("--") ? [arg.slice(2), all[index + 1]] : null).filter(Boolean))
const projectRoot = path.resolve(flags["project-root"] ?? process.cwd())
const baseUrl = new URL(flags["base-url"] ?? "http://localhost:3194")
if (!["localhost", "127.0.0.1", "[::1]"].includes(baseUrl.hostname)) {
  throw new Error("Motion verification only allows a local production server.")
}
const outDir = path.resolve(flags.out ?? path.join(projectRoot, "output", "modernization", "motion-loading"))
const require = createRequire(path.join(projectRoot, "package.json"))
const { chromium } = require("@playwright/test")
const manifestKey = "components/motion-provider.tsx -> @/lib/motion-features"
const manifest = JSON.parse(await readFile(path.join(projectRoot, ".next", "react-loadable-manifest.json"), "utf8"))
assert.ok(manifest[manifestKey], `Production loadable manifest must contain ${manifestKey}`)
const featurePaths = manifest[manifestKey].files.filter((file) => file.endsWith(".js")).map((file) => `/_next/${file}`)
assert.ok(featurePaths.length, "Manifest must identify at least one feature script")
await mkdir(outDir, { recursive: true })

const routeAssets = {}
for (const routePath of ["/", "/donate"]) {
  const response = await fetch(new URL(routePath, baseUrl))
  assert.ok(response.ok, `Production document ${routePath} must load`)
  const html = await response.text()
  const documentScriptPaths = [...new Set([...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)]
    .map((match) => new URL(match[1].replaceAll("&amp;", "&"), baseUrl).pathname))]
  // A feature manifest can list a shared initial React/runtime chunk. Never gate it.
  const deferredFeaturePaths = featurePaths.filter((file) => !documentScriptPaths.includes(file))
  assert.ok(deferredFeaturePaths.length, `Route ${routePath} must have a genuinely deferred feature script`)
  routeAssets[routePath] = { documentScriptPaths, deferredFeaturePaths }
}

function safeMessage(message) {
  return String(message)
    .replace(/https?:\/\/[^\s)]+/g, (text) => {
      try { const url = new URL(text); return `${url.origin}${url.pathname}` } catch { return "[url]" }
    })
    .replace(/\b(?:sk|pk|rk)_(?:live|test)_[a-zA-Z0-9]+\b/g, "[redacted-key]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]")
    .slice(0, 300)
}

async function withTimeout(promise, description, milliseconds = 10000) {
  let timer
  try {
    return await Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(new Error(`Timed out: ${description}`)), milliseconds)
    })])
  } finally { clearTimeout(timer) }
}

async function paintable(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    if (rect.width <= 0 || rect.height <= 0) return false
    for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
      const style = getComputedStyle(ancestor)
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) <= 0.05) return false
    }
    return true
  })
}

async function approachMotionScope(page) {
  await page.locator("[data-motion-state]").first().evaluate((element) => {
    const documentTop = element.getBoundingClientRect().top + scrollY
    // 100px below the viewport is inside the provider's 200px preload margin.
    scrollTo({ top: Math.max(0, documentTop - innerHeight - 100), behavior: "instant" })
  })
}

async function waitForState(page, state) {
  await page.locator(`[data-motion-state="${state}"]`).first().waitFor({ state: "attached", timeout: 10000 })
}

function check(result, condition, description) {
  result.assertions.push({ description, passed: Boolean(condition) })
  assert.ok(condition, description)
}

const browser = await chromium.launch({ channel: "chrome", headless: true })
const results = []
async function scenario(name, routePath, mode, verify, initialDonationTotal = 7543) {
  const result = { name, route: routePath, featureMode: mode, assertions: [], featureRequests: [], donationFixtureTotals: [], interceptedRequests: { external: 0, checkout: 0, otherWrites: 0 }, pageErrors: [] }
  let donationTotal = initialDonationTotal
  const setDonationFixtureTotal = (total) => { donationTotal = total }
  results.push(result)
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
    locale: "en-US", timezoneId: "America/New_York", reducedMotion: "no-preference", serviceWorkers: "block",
  })
  let releaseFeatures
  let notifyFeatureAttempt
  const gate = new Promise((resolve) => { releaseFeatures = resolve })
  const attempted = new Promise((resolve) => { notifyFeatureAttempt = resolve })
  const deferredPaths = new Set(routeAssets[routePath].deferredFeaturePaths)
  await context.route("**/*", async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (url.origin !== baseUrl.origin) {
      result.interceptedRequests.external += 1
      return route.abort("blockedbyclient")
    }
    if (url.pathname.startsWith("/api/stripe/")) {
      result.interceptedRequests.checkout += 1
      return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Lab checkout is intentionally unavailable." }) })
    }
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      result.interceptedRequests.otherWrites += 1
      return route.fulfill({ status: 503, body: "Lab writes disabled" })
    }
    if (url.pathname === "/api/donations") {
      result.donationFixtureTotals.push(donationTotal)
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({
        goal: 30000, numDonations: 66, total: donationTotal, lastUpdated: "2026-09-07T12:00:00.000Z", stale: false,
      }) })
    }
    if (deferredPaths.has(url.pathname)) {
      result.featureRequests.push({ path: url.pathname, outcome: mode === "fail" ? "aborted" : mode === "gate" ? "gated-then-continued" : "continued" })
      notifyFeatureAttempt()
      if (mode === "fail") return route.abort("failed")
      if (mode === "gate") await gate
    }
    return route.continue()
  })
  await context.addInitScript(() => {
    window.__motionUnhandledRejections = []
    window.addEventListener("unhandledrejection", (event) => {
      // Observe without preventing the error or masking application behavior.
      window.__motionUnhandledRejections.push(String(event.reason?.message ?? event.reason).slice(0, 300))
    })
  })
  const page = await context.newPage()
  page.on("pageerror", (error) => result.pageErrors.push(safeMessage(error.message)))
  try {
    const response = await page.goto(new URL(routePath, baseUrl).href, { waitUntil: "domcontentloaded", timeout: 30000 })
    check(result, response?.ok(), "Route loads with HTTP success")
    await page.locator("[data-motion-state]").first().waitFor({ state: "attached" })
    await verify({ page, result, releaseFeatures, attempted, setDonationFixtureTotal })
    result.unhandledRejections = (await page.evaluate(() => window.__motionUnhandledRejections)).map(safeMessage)
    const isExpectedExternalError = (message) => message === "Failed to load Stripe.js"
    result.expectedExternalErrors = [...result.pageErrors, ...result.unhandledRejections].filter(isExpectedExternalError)
    const unexpectedErrors = [...result.pageErrors, ...result.unhandledRejections].filter((message) => !isExpectedExternalError(message))
    check(result, unexpectedErrors.length === 0, "No unexpected page error or unhandled promise rejection")
    check(result, result.interceptedRequests.checkout === 0 && result.interceptedRequests.otherWrites === 0, "Amount/carousel interactions send no payment or other write request")
    result.passed = true
  } catch (error) {
    result.passed = false
    result.error = safeMessage(error.message)
    await page.screenshot({ path: path.join(outDir, `${name}-assertion-failure.png`), animations: "disabled", timeout: 5000 }).catch(() => {})
  } finally {
    releaseFeatures()
    await context.unrouteAll({ behavior: "wait" })
    await context.close()
    process.stdout.write(`${result.passed ? "PASS" : "FAIL"} ${name}${result.error ? `: ${result.error}` : ""}\n`)
  }
}

try {
  await scenario("home-defers-until-near-content", "/", "allow", async ({ page, result, attempted }) => {
    await page.waitForTimeout(4500)
    check(result, result.featureRequests.length === 0, "No actual deferred feature script is requested during 4.5 seconds at the initial homepage viewport")
    check(result, await page.locator("[data-motion-state]").first().getAttribute("data-motion-state") === "pending", "Homepage motion scope remains pending before scroll")
    check(result, await paintable(page.getByRole("heading", { level: 1 })), "Homepage heading is paintable before optional features load")
    await approachMotionScope(page)
    await withTimeout(attempted, "feature request after approaching homepage motion scope")
    await waitForState(page, "ready")
    check(result, true, "Feature loading starts within the 200px preload margin and reaches ready")
    for (const product of ["Nate the Great Premium Midweight Crew", "Nate the Great Thermal Waffle Beanie"]) {
      const button = page.getByRole("button", { name: `Go to ${product}`, exact: true })
      await button.tap()
      check(result, await button.getAttribute("aria-pressed") === "true", `Manual carousel selects ${product} after features load`)
    }
    const counts = result.featureRequests.reduce((all, request) => ({ ...all, [request.path]: (all[request.path] ?? 0) + 1 }), {})
    check(result, Object.values(counts).every((count) => count === 1), "Each actual deferred feature script is requested exactly once across scroll and carousel interactions")
  })

  await scenario("donation-usable-while-features-gated", "/donate", "gate", async ({ page, result, releaseFeatures, attempted }) => {
    await withTimeout(attempted, "donation feature request to be gated")
    await page.waitForTimeout(500)
    check(result, await page.locator("[data-motion-state]").first().getAttribute("data-motion-state") === "pending", "Donation feature scripts remain gated while the scope is pending")
    check(result, await paintable(page.getByRole("heading", { name: "Make a Donation", exact: true })), "Donation form is paintable while feature scripts are held")
    for (const amount of ["$100.00", "$25.00"]) {
      const button = page.getByRole("button", { name: amount, exact: true })
      await button.tap()
      check(result, await button.getAttribute("aria-pressed") === "true", `${amount} selection updates while motion features remain unavailable`)
    }
    releaseFeatures()
    await waitForState(page, "ready")
    check(result, await page.getByRole("button", { name: "$25.00", exact: true }).getAttribute("aria-pressed") === "true", "Selected donation amount survives feature completion without remounting")
  })

  await scenario("home-feature-failure-fallback", "/", "fail", async ({ page, result, attempted, setDonationFixtureTotal }) => {
    await approachMotionScope(page)
    await withTimeout(attempted, "homepage feature failure")
    await waitForState(page, "failed")
    check(result, true, "Failed feature requests enter the visible fallback state")
    check(result, await paintable(page.getByRole("heading", { name: "For the Next Child", exact: true })), "Fundraising heading remains paintable after feature failure")
    check(result, await paintable(page.getByRole("heading", { name: "Team Natey Shark", exact: true })), "Merchandise heading remains paintable after feature failure")

    const progress = page.getByRole("progressbar", { name: "Fundraising progress", exact: true })
    const initialFixtureResponse = page.waitForResponse((response) => new URL(response.url()).pathname === "/api/donations", { timeout: 10000 })
    await progress.scrollIntoViewIfNeeded()
    await initialFixtureResponse
    await page.waitForFunction(() => document.querySelector('[role="progressbar"][aria-label="Fundraising progress"]')?.getAttribute("aria-valuenow") === "7543")
    check(result, result.donationFixtureTotals.includes(7543), "Visible fundraiser receives the initial $7,543 fixture after feature failure")

    setDonationFixtureTotal(15000)
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }))
    // Let the existing visibility effect pause polling and clear SWR's two-second deduplication window.
    await page.waitForTimeout(2200)
    const updatedFixtureResponse = page.waitForResponse((response) => new URL(response.url()).pathname === "/api/donations", { timeout: 10000 })
    await progress.scrollIntoViewIfNeeded()
    await updatedFixtureResponse
    await page.waitForFunction(() => document.querySelector('[role="progressbar"][aria-label="Fundraising progress"]')?.getAttribute("aria-valuenow") === "15000")
    check(result, result.donationFixtureTotals.includes(15000), "Returning to the fundraiser revalidates the fixture to $15,000")
    await page.waitForTimeout(1100) // Allow the production 900ms CSS progress transition to finish.
    result.failedFeatureProgressGeometry = await progress.evaluate((track) => {
      const fill = track.firstElementChild
      const shark = track.parentElement.querySelector('[aria-hidden="true"]')
      const trackRect = track.getBoundingClientRect()
      const fillRect = fill.getBoundingClientRect()
      const sharkRect = shark.getBoundingClientRect()
      return {
        ariaValueNow: Number(track.getAttribute("aria-valuenow")),
        ariaValueMax: Number(track.getAttribute("aria-valuemax")),
        trackWidth: trackRect.width,
        trackContentWidth: track.clientWidth,
        fillWidth: fillRect.width,
        fillFraction: fillRect.width / track.clientWidth,
        sharkCenterFraction: (sharkRect.left + sharkRect.width / 2 - trackRect.left) / trackRect.width,
      }
    })
    check(result, result.failedFeatureProgressGeometry.ariaValueNow === 15000, "Progress accessibility value follows the new total with failed animation features")
    check(result, Math.abs(result.failedFeatureProgressGeometry.fillFraction - 0.5) <= 0.02, "Progress bar visually fills approximately 50% after the total changes with failed animation features")
    check(result, Math.abs(result.failedFeatureProgressGeometry.sharkCenterFraction - 0.5) <= 0.02, "Shark visually centers approximately 50% along the track after the total changes with failed animation features")
    await page.screenshot({ path: path.join(outDir, "fundraiser-updated-feature-failure-mobile.png"), animations: "disabled" })

    const button = page.getByRole("button", { name: "Go to Nate the Great Premium Midweight Crew", exact: true })
    await button.tap()
    check(result, await button.getAttribute("aria-pressed") === "true", "Carousel selection remains usable with failed animation features")
    await page.screenshot({ path: path.join(outDir, "home-feature-failure-mobile.png"), animations: "disabled" })
  })

  await scenario("donation-feature-failure-fallback", "/donate", "fail", async ({ page, result, attempted }) => {
    await withTimeout(attempted, "donation feature failure")
    await waitForState(page, "failed")
    check(result, await paintable(page.getByRole("heading", { name: "Make a Donation", exact: true })), "Donation form remains paintable after feature failure")
    const button = page.getByRole("button", { name: "$100.00", exact: true })
    await button.tap()
    check(result, await button.getAttribute("aria-pressed") === "true", "Donation amount remains usable with failed animation features")
    await page.screenshot({ path: path.join(outDir, "donation-feature-failure-mobile.png"), animations: "disabled" })
  })
} finally {
  await browser.close()
}

const report = {
  verifiedAt: new Date().toISOString(), baseUrl: baseUrl.origin, browserChannel: "chrome",
  description: "Functional production-build checks only; no CPU/network throttling or performance claims. External browser requests are blocked and all payment/write requests are locally intercepted.",
  featureManifestKey: manifestKey, featurePaths, routeAssets,
  expectedExternalError: "Failed to load Stripe.js is explicitly separated because external requests are intentionally blocked.",
  passed: results.every((result) => result.passed), scenarios: results,
}
await writeFile(path.join(outDir, "verification.json"), JSON.stringify(report, null, 2) + "\n")
process.stdout.write(`Motion loading verification: ${report.passed ? "PASS" : "FAIL"}; ${path.join(outDir, "verification.json")}\n`)
if (!report.passed) process.exitCode = 1
