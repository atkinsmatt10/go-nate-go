"use client"

import type { JSX } from "react"
import Image from "next/image"
import Link from "next/link"
import MuxPlayer from "@mux/mux-player-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { getPageRevealProps, getScaleInProps } from "@/lib/motion"

const NATE_STORY_PLAYBACK_ID = "U6gmORHKl2wiwnTKeMoLSNa8Tro5RHP0000vNOLl7hfdA"

interface DecorativeFish {
  readonly className: string
  readonly delay: number
  readonly driftX: number
  readonly driftY: number
  readonly duration: number
  readonly flip?: boolean
}

interface FishSilhouetteProps extends DecorativeFish {
  readonly prefersReducedMotion: boolean
}

const decorativeFish = [
  {
    className: "left-[5%] top-[9%] hidden w-14 sm:block lg:w-16",
    delay: -4.2,
    driftX: 10,
    driftY: -6,
    duration: 12.4,
  },
  {
    className: "right-[7%] top-[6%] w-12 lg:w-16",
    delay: -8.1,
    driftX: -9,
    driftY: 7,
    duration: 15.2,
    flip: true,
  },
  {
    className: "left-[2%] top-[51%] w-10 sm:w-12",
    delay: -1.7,
    driftX: 8,
    driftY: 5,
    duration: 10.8,
  },
  {
    className: "right-[3%] top-[43%] w-11 sm:w-14",
    delay: -6.3,
    driftX: -12,
    driftY: -4,
    duration: 13.7,
    flip: true,
  },
  {
    className: "bottom-[15%] left-[34%] hidden w-12 md:block",
    delay: -10.4,
    driftX: 11,
    driftY: 6,
    duration: 16,
  },
  {
    className: "bottom-[8%] right-[26%] hidden w-10 lg:block",
    delay: -3.6,
    driftX: -8,
    driftY: -7,
    duration: 11.6,
    flip: true,
  },
] satisfies readonly DecorativeFish[]

function FishSilhouette({
  className,
  delay,
  driftX,
  driftY,
  duration,
  flip = false,
  prefersReducedMotion,
}: FishSilhouetteProps): JSX.Element {
  return (
    <motion.span
      className={`absolute ${className}`}
      initial={{ x: 0, y: 0 }}
      animate={prefersReducedMotion ? { x: 0, y: 0 } : { x: driftX, y: driftY }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : {
              delay,
              duration,
              ease: "easeInOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }
      }
      style={{ opacity: 0.09 }}
    >
      <svg
        viewBox="0 0 64 32"
        className={`h-auto w-full ${flip ? "-scale-x-100" : ""}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 16C14.5 5.5 28 4.25 42 10.25L57 3L53.25 16L57 29L42 21.75C28 27.75 14.5 26.5 5 16Z"
          fill="currentColor"
        />
      </svg>
    </motion.span>
  )
}

export function HeroSection(): JSX.Element {
  const prefersReducedMotion = usePrefersReducedMotion()

  return (
    <section className="relative isolate w-full overflow-hidden bg-[radial-gradient(circle_at_72%_18%,#173f60_0%,#102f4a_42%,#0d2942_100%)] pb-20 pt-5 sm:pb-28 sm:pt-8 lg:pb-32 lg:pt-12">
      <div className="pointer-events-none absolute inset-0 z-0 text-[#9fc5d8]" aria-hidden="true">
        {decorativeFish.map((fish) => (
          <FishSilhouette
            key={`${fish.className}-${fish.duration}`}
            className={fish.className}
            delay={fish.delay}
            driftX={fish.driftX}
            driftY={fish.driftY}
            duration={fish.duration}
            flip={fish.flip}
            prefersReducedMotion={prefersReducedMotion}
          />
        ))}

        <svg
          viewBox="0 0 1200 120"
          className="absolute bottom-0 h-28 w-full text-[#3f5d81]/45 sm:h-32"
          preserveAspectRatio="none"
        >
          <path d="M0 68C280 114 612 32 1200 70V120H0Z" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          className="absolute bottom-0 h-20 w-full text-[#42a8a9]/22 sm:h-24"
          preserveAspectRatio="none"
        >
          <path d="M0 82C340 118 760 46 1200 76V120H0Z" fill="currentColor" />
        </svg>
        <Image
          src="/nate shark.png"
          width={132}
          height={128}
          alt=""
          loading="eager"
          className="absolute -bottom-3 right-3 h-auto w-24 drop-shadow-[0_12px_20px_rgb(7_27_43_/_26%)] sm:right-8 sm:w-28 lg:right-[5%] lg:w-32"
        />
      </div>

      <div className="relative z-10 w-full px-4 md:px-6">
        <div className="mx-auto grid max-w-[1440px] items-center gap-4 sm:gap-9 lg:grid-cols-[minmax(360px,0.76fr)_minmax(560px,1.24fr)] lg:gap-12 xl:gap-16">
          <div className="mx-auto flex w-full max-w-xl flex-col lg:mx-0">
            <motion.div
              className="relative aspect-[5971/2238] w-full max-w-[270px] self-center sm:max-w-[310px] lg:max-w-[540px] lg:self-start"
              {...getPageRevealProps(prefersReducedMotion, { distance: 10, duration: 0.24 })}
            >
              <Image
                src="/Nate-the-great-logo.png"
                alt="Nate the Great"
                fill
                className="object-contain"
                sizes="(max-width: 1023px) 310px, 540px"
                preload
              />
            </motion.div>

            <motion.div
              className="mt-5 text-center lg:mt-7 lg:text-left"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.06, distance: 12, duration: 0.26 })}
            >
              <h1 className="mx-auto max-w-[340px] text-balance text-[2.35rem] font-bold leading-[0.98] tracking-tight text-[#f7fbff] sm:max-w-none sm:text-5xl lg:mx-0 lg:text-[3.75rem]">
                Help Nate Fight
                <span className="block">Childhood Cancer</span>
              </h1>

              <p className="mx-auto mt-4 max-w-[330px] text-base leading-6 text-[#eef5fb] sm:mt-5 sm:max-w-[34rem] sm:text-lg sm:leading-8 lg:mx-0 lg:mt-6 lg:max-w-[31rem]">
                At just eight weeks old, Nate was diagnosed at CHOP with a rare brain tumor. Today he&apos;s home,
                thriving, and inspiring a community to fight for every child.
              </p>
            </motion.div>

            <motion.div
              className="mx-auto mt-5 grid w-full max-w-[330px] grid-cols-2 gap-4 sm:mt-8 sm:max-w-lg lg:mx-0 lg:mt-9"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.12, distance: 12, duration: 0.26 })}
            >
              <Button
                asChild
                size="lg"
                className="h-12 rounded-[18px] px-4 text-sm font-bold shadow-[0_14px_30px_rgb(5_24_39_/_28%)] transition-[box-shadow,transform] duration-150 ease-snappy-out hover:shadow-[0_18px_36px_rgb(5_24_39_/_34%)] sm:h-14 sm:text-xl"
              >
                <Link href="https://chop.donordrive.com/teams/nate-the-great" prefetch={false}>
                  Donate Now
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
                  Shop Now
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            className="relative mx-auto aspect-[6/5] w-full max-w-[330px] overflow-hidden rounded-[28px] border-[3px] border-primary shadow-[0_28px_80px_rgb(5_24_39_/_38%)] sm:max-w-[780px] sm:rounded-[32px] lg:max-w-none lg:justify-self-end"
            {...getScaleInProps(prefersReducedMotion, { delay: 0.08, duration: 0.28, scale: 0.985 })}
          >
            <MuxPlayer
              playbackId={NATE_STORY_PLAYBACK_ID}
              streamType="on-demand"
              thumbnailTime={18}
              preload="metadata"
              playsInline
              accentColor="#42a8a9"
              primaryColor="#f7fbff"
              secondaryColor="#102f4a"
              metadata={{
                video_id: "nate-family-chop-6abc-2026",
                video_title: "Nate's story",
              }}
              className="hero-video-player absolute inset-0 h-full w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
