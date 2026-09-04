import { connection, NextRequest, NextResponse } from "next/server"
import { getDonationSnapshot } from "@/lib/donations"
import { DONATION_CACHE_CONTROL, matchesDonationEtag } from "@/lib/donordrive"

export async function GET(request: NextRequest) {
  await connection()
  try {
    const { etag, ...progress } = await getDonationSnapshot()
    const headers = new Headers({ "Cache-Control": DONATION_CACHE_CONTROL })
    if (progress.stale) {
      // A stale representation must reach the client so it can display its age.
      headers.set("Warning", '110 - "Response is stale"')
    } else if (etag) {
      headers.set("ETag", etag)
      if (matchesDonationEtag(request.headers.get("if-none-match"), etag)) {
        return new NextResponse(null, { status: 304, headers })
      }
    }
    return NextResponse.json(progress, { headers })
  } catch {
    console.error("Donation API unavailable: no validated snapshot in the cache")
    return NextResponse.json(
      { error: "Live fundraising totals are temporarily unavailable. Please try again shortly." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    )
  }
}
