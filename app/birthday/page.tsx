import type { Metadata } from "next"
import { BirthdayInvitation } from "@/components/birthday-invitation"

export const metadata: Metadata = {
  title: "Nate's First Birthday · May 9th",
  description: "Join us to celebrate Nate the Great turning ONE! A retro arcade-themed birthday celebration.",
  openGraph: {
    title: "Nate the Great is Turning ONE!",
    description: "Join us Saturday, May 9th at Craft Hall in Philadelphia for Nate's first birthday celebration!",
    type: "website",
  },
}

export default function BirthdayPage() {
  return (
    <main className="min-h-screen bg-[#FFF5E6] flex items-center justify-center p-4 sm:p-8">
      <BirthdayInvitation />
    </main>
  )
}
