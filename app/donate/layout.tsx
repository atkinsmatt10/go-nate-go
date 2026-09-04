import type { Metadata } from "next"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Donate to Team Nate the Great · CHOP",
  description: "Support CHOP childhood cancer care and research with a donation to Team Nate the Great.",
  alternates: { canonical: "/donate" },
  openGraph: { url: "/donate", title: "Donate to Team Nate the Great · CHOP" },
}

export default function DonateLayout({ children }: { children: ReactNode }) {
  return children
}
