import { HeroSection } from "@/components/hero-section"
import { NatesStory } from "@/components/nates-story"
import { FundraisingProgress } from "@/components/fundraising-progress"
import { ShirtSection } from "@/components/shirt-section"
import { Footer } from "@/components/footer"

export default function Component() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1">
        <HeroSection />
        <NatesStory />
        <FundraisingProgress />
        <ShirtSection />
      </main>
      <Footer />
    </div>
  )
}
