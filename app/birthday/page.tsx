import type { Metadata } from "next"
import { BirthdayRsvpPage } from "@/components/birthday-rsvp-page"
import { PageTransition } from "@/components/page-transition"

const birthdayOgImage = "/birthday-og-one-tough-cookie.png"

export const metadata: Metadata = {
  title: "Nate is One Tough Cookie",
  description: "Nate's first birthday celebration at Craft Hall on May 9, 2026. RSVPs are closed. Thank you for celebrating with us.",
  alternates: {
    canonical: "/birthday",
  },
  openGraph: {
    url: "/birthday",
    title: "Nate is One Tough Cookie",
    description: "Nate's first birthday celebration at Craft Hall on May 9, 2026. RSVPs are closed. Thank you for celebrating with us.",
    images: [
      {
        url: birthdayOgImage,
        width: 2400,
        height: 1260,
        alt: "One Tough Cookie birthday card with Nate's shark mascot",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nate is One Tough Cookie",
    description: "Nate's first birthday celebration at Craft Hall on May 9, 2026. RSVPs are closed. Thank you for celebrating with us.",
    images: [birthdayOgImage],
  },
}

export default function BirthdayPage() {
  return (
    <PageTransition>
      <BirthdayRsvpPage />
    </PageTransition>
  )
}
