/* app/layout.tsx */
import type { Metadata, Viewport } from "next"
import { Lilita_One, Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita-one",
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

/* ---------- Viewport ---------- */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  /* remove maximumScale to allow pinch-zoom */
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#42a8a9" },
    { media: "(prefers-color-scheme: dark)", color: "#0d3b3c" },
  ],
}

/* ---------- Metadata ---------- */
export const metadata: Metadata = {
  metadataBase: new URL("https://gonatego.com"),

  title: "Nate the Great's Fundraiser · CHOP",
  description: "Join Nate's fight against childhood brain cancer and help fund breakthrough research at CHOP.",
  keywords: [
    "childhood brain cancer",
    "choroid plexus papilloma",
    "CHOP fundraiser",
    "pediatric oncology",
    "donate to cure cancer",
  ],

  authors: [{ name: "The Atkins Family", url: "https://gonatego.com" }],
  creator: "Matthew & Nicole Atkins",
  publisher: "Nate the Great Foundation",

  alternates: {
    canonical: "/",
    languages: { "en-US": "/", "es-419": "/es" }, // future-proof i18n
  },

  openGraph: {
    url: "https://gonatego.com",
    siteName: "GoNateGo",
    title: "Nate the Great's Fundraiser for CHOP",
    description:
      "Help us smash our fundraising goal and accelerate new treatments for pediatric brain tumors.",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/IMG_99081.png",
        width: 1200,
        height: 630,
        alt: "Nate the Great – Our Little Fighter",
        type: "image/png",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@GoNateGo",     // if available
    creator: "@AtkinsMatt", // if available
    title: "Nate the Great's Fundraiser for CHOP",
    description:
      "Support Nate's fight against childhood brain cancer by donating today.",
    images: ["/IMG_99081.png"],
  },

  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", type: "image/png" },
      { url: "/favicon-16x16.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      {
        rel: "manifest",
        url: "/site.webmanifest",
      },
    ],
  },

  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${lilitaOne.variable} ${inter.variable}`}>
        {children}
        <Analytics />
        {/* --- Structured data for rich results --- */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SocialActionCampaign",
              name: "Nate the Great's Fundraiser for CHOP",
              url: "https://gonatego.com",
              startDate: "2025-07-01",
              actionPlatform: ["http://schema.org/DonateAction"],
              cause: { "@type": "MedicalCause", name: "Pediatric Brain Tumor" },
              organizer: {
                "@type": "Person",
                name: "Matthew Atkins",
              },
            }),
          }}
        />
      </body>
    </html>
  )
}