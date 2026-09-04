import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Your donation · Team Nate the Great",
  robots: { index: false, follow: false },
  alternates: { canonical: "/donate/return" },
}

export default function DonationReturnLayout({ children }: { children: ReactNode }) {
  return children
}
