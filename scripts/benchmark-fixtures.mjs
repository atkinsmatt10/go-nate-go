// Lab only: opt in with NODE_OPTIONS=--import=./scripts/benchmark-fixtures.mjs.
// The production application never imports this file.
const donorDriveUrl = "https://chop.donordrive.com/api/1.6/teams/nate-the-great"
const originalFetch = globalThis.fetch

globalThis.fetch = function benchmarkFetch(input, init) {
  const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url
  if (url === donorDriveUrl) {
    return Promise.resolve(new Response(JSON.stringify({
      fundraisingGoal: 30000,
      numDonations: 66,
      sumDonations: 7543,
      name: "Team Nate",
    }), {
      status: 200,
      headers: { "content-type": "application/json", etag: '"modernization-lab-fixture"' },
    }))
  }
  return originalFetch.call(globalThis, input, init)
}
