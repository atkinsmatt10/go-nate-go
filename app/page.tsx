import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { NatesStory } from "@/components/nates-story"
import { FundraisingProgress } from "@/components/fundraising-progress"
import { ShirtSection } from "@/components/shirt-section"
import { Footer } from "@/components/footer"

export default function Component() {
  return (
    <div className="flex flex-col min-h-dvh bg-slate-50 text-slate-800">
      <Header />
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
