import type { Metadata } from "next"
import { BirthdayRsvpPage } from "@/components/birthday-rsvp-page"

const birthdayOgImage = "/birthday-og-one-tough-cookie.png"

export const metadata: Metadata = {
  title: "Nate is One Tough Cookie",
  description: "RSVP for Nate's first birthday celebration at Craft Hall in Philadelphia on Saturday, May 9, 2026.",
  alternates: {
    canonical: "/birthday",
  },
  openGraph: {
    url: "/birthday",
    title: "Nate is One Tough Cookie",
    description: "RSVP for Nate's first birthday celebration at Craft Hall in Philadelphia on Saturday, May 9, 2026.",
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
    description: "RSVP for Nate's first birthday celebration at Craft Hall in Philadelphia on Saturday, May 9, 2026.",
    images: [birthdayOgImage],
  },
}

export default function BirthdayPage() {
  return <BirthdayRsvpPage />
}
