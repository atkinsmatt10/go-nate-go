import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Nate's first birthday celebration has ended. RSVPs are closed." },
    { status: 410, headers: { "Cache-Control": "no-store" } },
  )
}
