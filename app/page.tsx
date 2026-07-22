import type { JSX } from "react"

import { CampaignMarquee } from "@/components/campaign-marquee"
import { HeroSection } from "@/components/hero-section"
import { NatesStory } from "@/components/nates-story"
import { FundraisingProgress } from "@/components/fundraising-progress"
import { SharingNatesStory } from "@/components/sharing-nates-story"
import { ShirtSection } from "@/components/shirt-section"
import { Footer } from "@/components/footer"

export default function Component(): JSX.Element {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1">
        <HeroSection />
        <CampaignMarquee />
        <NatesStory />
        <FundraisingProgress />
        <ShirtSection />
        <SharingNatesStory />
      </main>
      <Footer />
    </div>
  )
}
