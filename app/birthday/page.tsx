import type { Metadata } from "next"
import { BirthdayRsvpPage } from "@/components/birthday-rsvp-page"

export const metadata: Metadata = {
  title: "Nate's First Birthday RSVP",
  description: "RSVP for Nate the Great's first birthday celebration at Craft Hall on Saturday, May 9, 2026.",
  alternates: {
    canonical: "/birthday",
  },
}

export default function BirthdayPage() {
  return <BirthdayRsvpPage />
}
