import type React from "react"
import type { Metadata } from "next"
import { Lilita_One, Inter } from "next/font/google"
import "./globals.css"

const lilitaOne = Lilita_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-lilita-one",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Nate the Great's Fundraiser for CHOP",
  description: "Support Nate's Fight, Fund a Cure for Childhood Cancer.",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${lilitaOne.variable} ${inter.variable}`}>{children}</body>
    </html>
  )
}
