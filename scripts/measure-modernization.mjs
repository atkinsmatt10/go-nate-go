#!/usr/bin/env node
// Reproducible local production-build lab. Never reports field INP.
import { createRequire } from "node:module"
import { mkdir, readFile, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { gzipSync } from "node:zlib"

const flags = Object.fromEntries(process.argv.slice(2).map((arg, index, all) =>
  arg.startsWith("--") ? [arg.slice(2), all[index + 1]] : null).filter(Boolean))
const projectRoot = path.resolve(flags["project-root"] ?? process.cwd())
const baseUrl = new URL(flags["base-url"] ?? "http://localhost:3194")
if (!["localhost", "127.0.0.1", "[::1]"].includes(baseUrl.hostname)) {
  throw new Error("This fixture-based benchmark only allows a local production server.")
}
const label = (flags.label ?? "measurement").replace(/[^a-zA-Z0-9_-]/g, "-")
const outDir = path.resolve(flags.out ?? path.join(projectRoot, "output", "modernization", label))
const runs = Number(flags.runs ?? 3)
if (!Number.isInteger(runs) || runs < 1 || runs > 10) throw new Error("--runs must be an integer from 1 to 10")
const require = createRequire(path.join(projectRoot, "package.json"))
const { chromium } = require("@playwright/test")
const settleMs = 4000
const mobile = {
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  locale: "en-US",
  timezoneId: "America/New_York",
  colorScheme: "light",
  reducedMotion: "no-preference",
  serviceWorkers: "block",
}
const network = {
  offline: false,
  latency: 150,
  downloadThroughput: 1600000 / 8,
  uploadThroughput: 750000 / 8,
  connectionType: "cellular4g",
}
const donationFixture = {
  goal: 30000, numDonations: 66, total: 7543,
  lastUpdated: "2026-09-07T12:00:00.000Z", stale: false,
}
await mkdir(outDir, { recursive: true })

function installPerformanceObservers() {
  const lab = window.__modernizationLab = {
    lcp: null, shifts: [], longTasks: [], events: [], tap: null,
    supportedEntryTypes: PerformanceObserver.supportedEntryTypes,
  }
  performance.setResourceTimingBufferSize(3000)
  for (const type of ["largest-contentful-paint", "layout-shift", "longtask", "event"]) {
    if (!PerformanceObserver.supportedEntryTypes.includes(type)) continue
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (type === "largest-contentful-paint") {
          lab.lcp = { startTime: entry.startTime, size: entry.size, tagName: entry.element?.tagName ?? null }
        } else if (type === "layout-shift") {
          lab.shifts.push({ startTime: entry.startTime, value: entry.value, hadRecentInput: entry.hadRecentInput })
        } else if (type === "longtask") {
          lab.longTasks.push({ startTime: entry.startTime, duration: entry.duration })
        } else {
          lab.events.push({
            name: entry.name, startTime: entry.startTime, duration: entry.duration,
            processingStart: entry.processingStart, processingEnd: entry.processingEnd,
            interactionId: entry.interactionId,
          })
        }
      }
    }).observe(type === "event" ? { type, buffered: true, durationThreshold: 16 } : { type, buffered: true })
  }
}

async function setNetworkPolicy(context, counts) {
  await context.route("**/*", async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    if (url.origin !== baseUrl.origin) {
      counts.externalBlocked += 1
      return route.abort("blockedbyclient")
    }
    if (url.pathname.startsWith("/api/stripe/")) {
      counts.checkoutIntercepted += 1
      return route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Lab checkout is intentionally unavailable." }) })
    }
    if (url.pathname === "/api/donations") {
      counts.donationFixtures += 1
      return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(donationFixture) })
    }
    // Disallow any other mutating request. This lab does not submit real forms.
    if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
      counts.otherWritesBlocked += 1
      return route.fulfill({ status: 503, body: "Lab writes disabled" })
    }
    return route.continue()
  })
}

async function initialHtmlScripts(html, initialJavaScript) {
  const paths = [...new Set([...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"/gi)].map((match) => match[1]))]
  const scriptFiles = []
  for (const src of paths) {
    const url = new URL(src.replaceAll("&amp;", "&"), baseUrl)
    const scriptPath = url.pathname
    if (url.origin !== baseUrl.origin || !scriptPath.startsWith("/_next/static/")) continue
    const file = path.join(projectRoot, ".next", decodeURIComponent(scriptPath.slice("/_next/".length)))
    try {
      const data = await readFile(file)
      scriptFiles.push({ path: scriptPath, fileBytes: data.length, gzip9Bytes: gzipSync(data, { level: 9 }).length })
    } catch (error) {
      scriptFiles.push({ path: scriptPath, unavailable: error.code ?? "read-failed" })
    }
  }
  const inlineScriptBytes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/\bsrc=/.test(match[1]))
    .reduce((sum, match) => sum + Buffer.byteLength(match[2]), 0)
  const requestedPaths = new Set(initialJavaScript.scripts.map((script) => script.path))
  return {
    scriptFiles,
    scriptFileBytes: scriptFiles.reduce((sum, file) => sum + (file.fileBytes ?? 0), 0),
    scriptFileGzip9Bytes: scriptFiles.reduce((sum, file) => sum + (file.gzip9Bytes ?? 0), 0),
    browserRequestedDocumentScriptGzip9Bytes: scriptFiles
      .filter((file) => requestedPaths.has(file.path))
      .reduce((sum, file) => sum + (file.gzip9Bytes ?? 0), 0),
    inlineScriptBytes,
  }
}

function safeErrorMessage(message) {
  return message
    .replace(/https?:\/\/[^\s)]+/g, (text) => {
      try { const url = new URL(text); return `${url.origin}${url.pathname}` } catch { return "[url]" }
    })
    .replace(/\b(?:sk|pk|rk)_(?:live|test)_[a-zA-Z0-9]+\b/g, "[redacted-key]")
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]")
    .slice(0, 300)
}

async function readInitialMetrics(page) {
  return page.evaluate(() => {
    const lab = window.__modernizationLab
    const measuredAtMs = performance.now()
    const navigation = performance.getEntriesByType("navigation")[0]
    const fcp = performance.getEntriesByName("first-contentful-paint")[0]?.startTime ?? null
    let cls = 0, sessionValue = 0, sessionStart = 0, lastShift = 0
    for (const shift of lab.shifts.filter((entry) => !entry.hadRecentInput)) {
      if (sessionValue && shift.startTime - lastShift < 1000 && shift.startTime - sessionStart < 5000) {
        sessionValue += shift.value
      } else {
        sessionValue = shift.value
        sessionStart = shift.startTime
      }
      lastShift = shift.startTime
      cls = Math.max(cls, sessionValue)
    }
    const scripts = performance.getEntriesByType("resource")
      .filter((entry) => new URL(entry.name).origin === location.origin && /\.m?js$/.test(new URL(entry.name).pathname))
      .map((entry) => ({
        path: new URL(entry.name).pathname, initiatorType: entry.initiatorType,
        startTime: entry.startTime, duration: entry.duration, responseEnd: entry.responseEnd,
        encodedBodySize: entry.encodedBodySize, decodedBodySize: entry.decodedBodySize, transferSize: entry.transferSize,
      }))
    const longTasks = lab.longTasks.filter((entry) => entry.startTime >= (fcp ?? 0) && entry.startTime <= measuredAtMs)
    return {
      measuredAtMs,
      navigation: { responseStartMs: navigation.responseStart, domContentLoadedMs: navigation.domContentLoadedEventEnd, loadMs: navigation.loadEventEnd },
      fcpMs: fcp, lcpMs: lab.lcp?.startTime ?? null, lcpElementTag: lab.lcp?.tagName ?? null, cls,
      longTaskBlockingMs: longTasks.reduce((sum, entry) => sum + Math.max(0, entry.duration - 50), 0),
      longTaskCount: longTasks.length,
      initialJavaScript: {
        requestCount: scripts.length,
        encodedBodyBytes: scripts.reduce((sum, entry) => sum + entry.encodedBodySize, 0),
        decodedBodyBytes: scripts.reduce((sum, entry) => sum + entry.decodedBodySize, 0),
        transferBytes: scripts.reduce((sum, entry) => sum + entry.transferSize, 0), scripts,
      },
      supportedPerformanceEntryTypes: lab.supportedEntryTypes,
      horizontalOverflow: document.documentElement.scrollWidth > innerWidth,
    }
  })
}

async function measureTap(page, locator, name, verify) {
  await locator.scrollIntoViewIfNeeded()
  // Settle reveal/scroll animations consistently before dispatching a trusted touch.
  await page.waitForTimeout(700)
  await page.evaluate(() => {
    const lab = window.__modernizationLab
    lab.tap = { armedAt: performance.now(), clickAt: null, eventTimestamp: null, secondFrameAt: null }
    window.addEventListener("click", (event) => {
      lab.tap.clickAt = performance.now()
      lab.tap.eventTimestamp = event.timeStamp
      requestAnimationFrame(() => requestAnimationFrame(() => { lab.tap.secondFrameAt = performance.now() }))
    }, { capture: true, once: true })
  })
  await locator.tap()
  await page.waitForFunction(() => window.__modernizationLab.tap?.secondFrameAt !== null, null, { timeout: 5000 })
  await page.waitForTimeout(150)
  const measurement = await page.evaluate(() => {
    const lab = window.__modernizationLab
    const tap = lab.tap
    const events = lab.events.filter((event) => event.startTime >= tap.armedAt && event.interactionId > 0)
    return {
      clickToSecondAnimationFrameMs: tap.secondFrameAt - tap.clickAt,
      inputTimestampToSecondAnimationFrameMs: tap.secondFrameAt - tap.eventTimestamp,
      eventTimingMaxMs: events.length ? Math.max(...events.map((event) => event.duration)) : null,
      eventTimingEntries: events,
    }
  })
  const verified = await verify()
  if (!verified) throw new Error(`Regression: ${name} did not update the expected accessible state`)
  return { name, ...measurement, verified }
}

async function measureRoute(routePath, runIndex) {
  const browser = await chromium.launch({ channel: "chrome", headless: true })
  const browserVersion = browser.version()
  const context = await browser.newContext(mobile)
  const counts = { externalBlocked: 0, checkoutIntercepted: 0, donationFixtures: 0, otherWritesBlocked: 0 }
  await setNetworkPolicy(context, counts)
  await context.addInitScript(installPerformanceObservers)
  const page = await context.newPage()
  const errors = { pageErrorCount: 0, pageErrorMessages: [], consoleErrorCount: 0 }
  page.on("pageerror", (error) => {
    errors.pageErrorCount += 1
    if (errors.pageErrorMessages.length < 10) errors.pageErrorMessages.push(safeErrorMessage(error.message))
  })
  page.on("console", (message) => { if (message.type() === "error") errors.consoleErrorCount += 1 })
  const cdp = await context.newCDPSession(page)
  await cdp.send("Network.enable")
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true })
  await cdp.send("Network.emulateNetworkConditions", network)
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 })
  try {
    const response = await page.goto(new URL(routePath, baseUrl).href, { waitUntil: "load", timeout: 60000 })
    if (!response?.ok()) throw new Error(`Navigation failed with HTTP ${response?.status()}`)
    const html = await response.text()
    await page.waitForTimeout(settleMs)
    const initial = await readInitialMetrics(page)
    const documentScripts = await initialHtmlScripts(html, initial.initialJavaScript)
    const screenshots = []
    if (runIndex === 1) {
      const filename = `${routePath === "/" ? "home" : "donate"}-mobile.png`
      await page.screenshot({ path: path.join(outDir, filename), animations: "disabled" })
      screenshots.push(filename)
    }
    const interactions = []
    if (routePath === "/") {
      const targetNames = ["Nate the Great Premium Midweight Crew", "Nate the Great Thermal Waffle Beanie", "Nate the Great Heavyweight Tee"]
      for (const productName of targetNames) {
        const button = page.getByRole("button", { name: `Go to ${productName}`, exact: true })
        interactions.push(await measureTap(page, button, `shirt: ${productName}`, async () =>
          (await button.getAttribute("aria-pressed")) === "true"))
      }
    } else {
      for (const amount of ["$25.00", "$100.00", "$50.00"]) {
        const button = page.getByRole("button", { name: amount, exact: true })
        interactions.push(await measureTap(page, button, `donation amount: ${amount}`, async () =>
          (await button.getAttribute("aria-pressed")) === "true"))
      }
    }
    return { route: routePath, run: runIndex, browserVersion, initial, documentScripts, interactions, screenshots, interceptedRequests: counts, errors }
  } finally {
    await browser.close()
  }
}

function median(values) {
  const sorted = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b)
  if (!sorted.length) return null
  const center = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[center] : (sorted[center - 1] + sorted[center]) / 2
}

const rawRuns = []
for (let run = 1; run <= runs; run += 1) {
  for (const routePath of ["/", "/donate"]) {
    process.stdout.write(`[${label}] ${routePath} cold-browser run ${run}/${runs}\n`)
    rawRuns.push(await measureRoute(routePath, run))
    await writeFile(path.join(outDir, "runs.partial.json"), JSON.stringify(rawRuns, null, 2) + "\n")
  }
}
const medians = Object.fromEntries(["/", "/donate"].map((routePath) => {
  const routeRuns = rawRuns.filter((run) => run.route === routePath)
  return [routePath, {
    fcpMs: median(routeRuns.map((run) => run.initial.fcpMs)),
    lcpMs: median(routeRuns.map((run) => run.initial.lcpMs)),
    cls: median(routeRuns.map((run) => run.initial.cls)),
    longTaskBlockingMs: median(routeRuns.map((run) => run.initial.longTaskBlockingMs)),
    documentScriptGzip9Bytes: median(routeRuns.map((run) => run.documentScripts.scriptFileGzip9Bytes)),
    browserRequestedDocumentScriptGzip9Bytes: median(routeRuns.map((run) => run.documentScripts.browserRequestedDocumentScriptGzip9Bytes)),
    initialJavaScriptEncodedBytes: median(routeRuns.map((run) => run.initial.initialJavaScript.encodedBodyBytes)),
    initialJavaScriptDecodedBytes: median(routeRuns.map((run) => run.initial.initialJavaScript.decodedBodyBytes)),
    labTapToSecondAnimationFrameMs: median(routeRuns.flatMap((run) => run.interactions.map((interaction) => interaction.inputTimestampToSecondAnimationFrameMs))),
    labEventTimingMaxMs: median(routeRuns.flatMap((run) => run.interactions.map((interaction) => interaction.eventTimingMaxMs))),
  }]
}))
const result = {
  label, measuredAt: new Date().toISOString(),
  hardware: { platform: os.platform(), arch: os.arch(), cpuModel: os.cpus()[0]?.model, logicalCpuCount: os.cpus().length, memoryBytes: os.totalmem(), nodeVersion: process.version },
  config: { baseUrl: baseUrl.origin, runsPerRoute: runs, browserChannel: "chrome", headless: true, mobile, cpuSlowdown: 4, network, cacheDisabled: true, coldBrowserPerRun: true, postLoadSettleMs: settleMs, externalRequests: "blocked", donationFixture },
  limitations: [
    "Local production server with deterministic donation data. All external browser requests are blocked; external media/payment availability and real user network latency are outside this lab.",
    "Initial JS includes all completed same-origin JavaScript resource requests by four seconds after load, before any scroll or tap. Document scripts are measured separately with filesystem gzip level 9: all HTML script references include nomodule polyfills; browser-requested document scripts intersect those paths with actual initial JS resource requests.",
    "LCP and session-window CLS are observed only up to the initial snapshot. Long-task blocking is sum(max(duration-50,0)) after FCP to snapshot; it is a fixed-window approximation, not Lighthouse TBT.",
    "Interactions use trusted touchscreen taps. Event Timing is quantized and has a 16ms minimum threshold; null means no event at or above that threshold. The second-animation-frame latency is a lab response proxy, not actual displayed-pixel time or field INP.",
    "Three runs describe a small lab sample and are sensitive to host load. Compare before and after from this exact harness, server configuration, browser version, and host.",
    "Checkout requests are intercepted with HTTP 503 and no real payment or form submission is performed.",
  ],
  medians, runs: rawRuns,
}
await writeFile(path.join(outDir, "measurements.json"), JSON.stringify(result, null, 2) + "\n")
process.stdout.write(JSON.stringify({ label, medians, output: path.join(outDir, "measurements.json") }, null, 2) + "\n")
