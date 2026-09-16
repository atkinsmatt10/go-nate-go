import type { JSX } from "react"
import Image from "next/image"
import Link from "next/link"
import { HeroStoryVideo } from "@/components/hero-story-video"
import { HeroOcean } from "@/components/hero-ocean"
import storyPoster from "@/public/nate-story-poster.webp"

import { Button } from "@/components/ui/button"

export function HeroSection(): JSX.Element {
  return (
    <section className="hero-section relative isolate w-full overflow-clip pb-20 pt-[calc(1.25rem+env(safe-area-inset-top,0px))] sm:pb-28 sm:pt-[calc(2rem+env(safe-area-inset-top,0px))] lg:pb-32 lg:pt-[calc(3rem+env(safe-area-inset-top,0px))]">
      <HeroOcean />
      <div className="pointer-events-none absolute inset-0 z-0 text-[#9fc5d8]" aria-hidden="true">
        <svg
          viewBox="0 0 1200 120"
          className="hero-ocean-fallback absolute bottom-0 h-28 w-full text-[#3f5d81]/45 sm:h-32"
          preserveAspectRatio="none"
        >
          <path d="M0 68C280 114 612 32 1200 70V120H0Z" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          className="hero-ocean-fallback absolute bottom-0 h-20 w-full text-[#42a8a9]/22 sm:h-24"
          preserveAspectRatio="none"
        >
          <path d="M0 82C340 118 760 46 1200 76V120H0Z" fill="currentColor" />
        </svg>
      </div>

      <div className="hero-content relative z-10 w-full px-4 md:px-6">
        <div className="mx-auto grid max-w-[1440px] items-center gap-4 sm:gap-9 lg:grid-cols-[minmax(360px,0.76fr)_minmax(560px,1.24fr)] lg:gap-12 xl:gap-16">
          <div className="mx-auto flex w-full max-w-xl flex-col lg:mx-0">
            <div
              data-ocean-logo
              className="relative aspect-[5971/2238] w-full max-w-[270px] self-center sm:max-w-[310px] lg:max-w-[540px] lg:self-start"

            >
              <Image
                src="/Nate-the-great-logo.png"
                alt="Nate the Great"
                fill
                className="object-contain"
                sizes="(max-width: 1023px) 310px, 540px"
                preload
              />
            </div>

            <div
              className="mt-12 text-center sm:mt-10 lg:mt-7 lg:text-left"

            >
              <h1 className="mx-auto max-w-[340px] text-balance text-[2.35rem] font-bold leading-[0.98] tracking-tight text-[#f7fbff] sm:max-w-none sm:text-5xl lg:mx-0 lg:text-[3.75rem]">
                Help Nate Fight
                <span className="block">Childhood Cancer</span>
              </h1>

              <p className="mx-auto mt-4 max-w-[330px] text-base leading-6 text-[#eef5fb] sm:mt-5 sm:max-w-[34rem] sm:text-lg sm:leading-8 lg:mx-0 lg:mt-6 lg:max-w-[31rem]">
                At eight weeks old, Nate was diagnosed at CHOP with a rare brain tumor. Today he&apos;s home and thriving.
              </p>
            </div>

            <div
              className="mx-auto mt-5 grid w-full max-w-[330px] grid-cols-2 gap-4 sm:mt-8 sm:max-w-lg lg:mx-0 lg:mt-9"

            >
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[18px] px-4 text-sm font-bold shadow-[0_14px_30px_rgb(5_24_39_/_28%)] transition-[box-shadow,transform] duration-150 ease-snappy-out hover:shadow-[0_18px_36px_rgb(5_24_39_/_34%)] sm:h-14 sm:text-xl"
              >
                <Link href="https://chop.donordrive.com/teams/nate-the-great" prefetch={false}>
                  Donate to CHOP
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                haptic="light"
                className="h-12 rounded-[18px] border-2 border-primary bg-transparent px-4 text-sm font-bold text-primary shadow-xs transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-snappy-out hover:bg-primary hover:text-primary-foreground sm:h-14 sm:text-xl"
              >
                <Link href="https://shop.gonatego.com" target="_blank" rel="noopener noreferrer" prefetch={false}>
                  Shop
                </Link>
              </Button>
            </div>
          </div>

          <div
            data-ocean-video
            className="relative mx-auto aspect-[6/5] w-full max-w-[330px] overflow-hidden rounded-[28px] border-[3px] border-primary shadow-[0_28px_80px_rgb(5_24_39_/_38%)] sm:max-w-[780px] sm:rounded-[32px] lg:max-w-none lg:justify-self-end"

          >
            <HeroStoryVideo>
              <Image
                src={storyPoster}
                alt="Nate with his family in the story video"
                fill
                preload
                sizes="(max-width: 639px) 330px, (max-width: 1023px) 780px, 860px"
                className="object-cover"
              />
            </HeroStoryVideo>
          </div>
        </div>
      </div>
    </section>
  )
}
