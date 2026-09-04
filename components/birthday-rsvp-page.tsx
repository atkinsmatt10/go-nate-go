import Image from "next/image"
import Link from "next/link"
import { BirthdayPhotoCarousel } from "@/components/birthday-photo-carousel"
import { Footer } from "@/components/footer"

export function BirthdayRsvpPage() {
  return (
    <>
      <main className="min-h-dvh bg-[#eef5fb] px-4 py-8 text-[#223b54] sm:px-6 sm:py-12">
        <div className="mx-auto max-w-5xl">
          <Link href="/" className="inline-flex rounded-full border border-[#9fc5d8] bg-white px-5 py-3 font-semibold underline-offset-4 hover:underline">
            Back to Go Nate Go
          </Link>
          <section className="mt-8 overflow-hidden rounded-[32px] border border-[#9fc5d8] bg-white shadow-sm">
            <div className="grid items-center gap-8 p-6 sm:p-10 md:grid-cols-2">
              <Image src="/01KK50NH25Q9J200T43XRW1K6V.png" alt="Nate is One Tough Cookie birthday illustration" width={800} height={800} className="h-auto w-full rounded-[24px]" />
              <div className="space-y-5">
                <p className="text-sm font-bold uppercase tracking-widest text-[#36546c]">May 9, 2026 · Craft Hall, Philadelphia</p>
                <h1 className="text-5xl leading-tight sm:text-6xl">One Tough Cookie</h1>
                <p className="text-xl leading-relaxed">Thank you for celebrating Nate&apos;s first birthday and surrounding our family with so much love.</p>
                <p className="rounded-[20px] bg-[#d8eff5] p-5 text-base font-semibold">This celebration has ended. RSVPs are now closed.</p>
                <p className="leading-relaxed">We&apos;re grateful for every person cheering Nate on. You can keep following his story and supporting childhood cancer care and research at CHOP.</p>
                <Link href="/#donate" className="inline-flex rounded-[18px] bg-[#42a8a9] px-6 py-4 font-bold text-[#102f4a]">Support Team Nate the Great</Link>
              </div>
            </div>
          </section>
          <section className="py-14" aria-labelledby="birthday-photos-title">
            <h2 id="birthday-photos-title" className="mb-8 text-center text-4xl sm:text-5xl">Growing with Nate</h2>
            <BirthdayPhotoCarousel />
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
