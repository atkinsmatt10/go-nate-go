import { Suspense, type JSX } from "react"
import type { Viewport } from "next"
import { connection } from "next/server"

import { CampaignMarquee } from "@/components/campaign-marquee"
import { HeroSection } from "@/components/hero-section"
import { NatesStory } from "@/components/nates-story"
import { FundraisingProgress } from "@/components/fundraising-progress"
import { SharingNatesStory } from "@/components/sharing-nates-story"
import { ShirtSection } from "@/components/shirt-section"
import { Footer } from "@/components/footer"
import { PageTransition } from "@/components/page-transition"
import { getDonationProgress } from "@/lib/donations"

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#102f4a",
}

async function LiveFundraisingProgress(): Promise<JSX.Element> {
  await connection()
  const initialData = await getDonationProgress()
  return <FundraisingProgress initialData={initialData} />
}

export default function Component(): JSX.Element {
  return (
    <PageTransition>
      <div className="home-page flex min-h-dvh flex-col bg-background text-foreground">
        <main className="flex-1">
          <HeroSection />
          <CampaignMarquee />
          <NatesStory />
          <Suspense fallback={<FundraisingProgress />}>
            <LiveFundraisingProgress />
          </Suspense>
          <ShirtSection />
          <SharingNatesStory />
        </main>
        <Footer />
      </div>
    </PageTransition>
  )
}
