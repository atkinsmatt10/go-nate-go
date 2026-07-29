"use client"

import type { JSX } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import {
  CAROUSEL_TRANSITION,
  getCarouselSlideVariants,
  getPageRevealProps,
  getScaleInProps,
} from "@/lib/motion"

const images = [
  {
    src: "/IMG_9843.png",
    alt: "Nate's precious moment"
  },
  {
    src: "/IMG_9908.png",
    alt: "Nate's beautiful moment"
  },
  {
    src: "/Nate-image.png",
    alt: "Nate - Our Little Fighter"
  },
  {
    src: "/Nicole baby park.png",
    alt: "Nicole with baby Nate in the park"
  },
  {
    src: "/IMG_9684.png",
    alt: "Nate's special moment"
  },
  {
    src: "/IMG_9609.png",
    alt: "Another precious moment with Nate"
  }
]

export function HeroSection(): JSX.Element {
  const [currentImage, setCurrentImage] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const { trigger } = useHapticFeedback()
  const prefersReducedMotion = useReducedMotion() ?? false

  // Function to start the auto-advance timer
  const startAutoAdvance = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      setDirection(1)
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 4000) // Change image every 4 seconds
  }, [])

  // Function to reset the timer (used when user manually navigates)
  const resetTimer = useCallback(() => {
    startAutoAdvance()
  }, [startAutoAdvance])

  useEffect(() => {
    startAutoAdvance()
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startAutoAdvance])

  const handleImageClick = (index: number) => {
    setDirection(index > currentImage ? 1 : -1)
    setCurrentImage(index)
    trigger("selection")
    resetTimer() // Reset the auto-advance timer
  }

  // Animation variants for the carousel
  const slideVariants = getCarouselSlideVariants(prefersReducedMotion)

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <section className="relative isolate w-full overflow-hidden pb-12 pt-4 sm:pb-16 sm:pt-6 lg:pb-20 lg:pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <svg
          viewBox="0 0 1200 120"
          className="absolute bottom-0 w-full h-32 opacity-10"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-primary/20"
          />
        </svg>
        <svg
          viewBox="0 0 1200 120"
          className="absolute bottom-0 w-full h-40 opacity-5"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C400,120 800,40 1200,80 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-primary/30"
          />
        </svg>
      </div>

      <div className="container px-4 md:px-6">
        <div className="mx-auto grid max-w-6xl items-center gap-y-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] lg:gap-x-14 lg:gap-y-6">
          <motion.div
            className="lg:col-start-1 lg:row-start-1"
            {...getPageRevealProps(prefersReducedMotion, { distance: 10, duration: 0.24 })}
          >
            <div
              className="relative mx-auto aspect-[5971/2238] w-full max-w-[640px] lg:mx-0 lg:max-w-[620px]"
            >
              <Image
                src="/Nate-the-great-logo.png"
                alt="Nate the Great Title Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 620px"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            className="relative mx-auto w-full max-w-md lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:max-w-[520px] lg:justify-self-end"
            {...getScaleInProps(prefersReducedMotion, { delay: 0.05, duration: 0.26, scale: 0.98 })}
          >
            <div className="relative aspect-square overflow-hidden rounded-[28px] border border-white/10 shadow-[0_24px_70px_rgba(12,28,44,0.28)]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentImage}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={CAROUSEL_TRANSITION}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={prefersReducedMotion ? 0.05 : 0.18}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x)

                    if (swipe < -swipeConfidenceThreshold) {
                      setDirection(1)
                      setCurrentImage((prev) => (prev + 1) % images.length)
                      trigger("selection")
                      resetTimer() // Reset the auto-advance timer
                    } else if (swipe > swipeConfidenceThreshold) {
                      setDirection(-1)
                      setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
                      trigger("selection")
                      resetTimer() // Reset the auto-advance timer
                    }
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                >
                  <Image
                    src={images[currentImage].src}
                    width={400}
                    height={400}
                    alt={images[currentImage].alt}
                    className="w-full h-full object-cover object-center"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 520px"
                    priority={currentImage === 0}
                  />
                </motion.div>
              </AnimatePresence>
              <motion.div
                className="absolute -bottom-2 -right-2 z-10"
                {...getPageRevealProps(prefersReducedMotion, { delay: 0.18, distance: 12 })}
              >
                <Image
                  src="/nate shark.png"
                  width={80}
                  height={80}
                  alt="Nate's Shark Mascot"
                  className="h-20 w-20 drop-shadow-lg sm:h-24 sm:w-24"
                />
              </motion.div>
            </div>

            <div className="mt-3 flex justify-center gap-1">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 ease-snappy-out active:scale-[0.96] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Go to image ${index + 1}`}
                  aria-current={index === currentImage ? "true" : undefined}
                >
                  <span
                    className={`h-2 w-2 rounded-full transition-[background-color,opacity,transform] duration-200 ease-snappy-out motion-reduce:scale-100 motion-reduce:transition-[background-color,opacity] ${
                      index === currentImage
                        ? "scale-125 bg-primary opacity-100"
                        : "bg-white/55 opacity-70"
                    }`}
                  />
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="space-y-4 text-center lg:col-start-1 lg:row-start-2 lg:text-left"
            {...getPageRevealProps(prefersReducedMotion, { delay: 0.1, distance: 14, duration: 0.26 })}
          >
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Help Nate Fight Childhood Cancer
            </h1>

            <p className="mx-auto max-w-[700px] text-base leading-relaxed text-muted-foreground sm:text-lg lg:mx-0 lg:max-w-[640px]">
              Born in May 2025, Nate&apos;s world changed at just eight weeks old. Vomiting and extreme sleepiness led to a
              terrifying diagnosis at CHOP: a rare choroid plexus tumor causing hydrocephalus. Emergency surgeries saved his
              life, and after months of fighting, surgeons removed the tumor entirely. Today, he&apos;s home, crawling, smiling, and
              here because of the extraordinary team at CHOP.
            </p>
          </motion.div>

          <motion.div
            className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row lg:col-start-1 lg:row-start-3 lg:mx-0 lg:max-w-xl"
            {...getPageRevealProps(prefersReducedMotion, { delay: 0.15, distance: 14, duration: 0.26 })}
          >
            <Button
              asChild
              size="lg"
              className="h-14 rounded-[18px] text-lg font-bold shadow-lg transition-[box-shadow,transform] duration-150 ease-snappy-out hover:shadow-xl sm:flex-1 sm:text-xl"
            >
              <Link href="https://chop.donordrive.com/teams/nate-the-great" prefetch={false}>Donate Now</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              haptic="light"
              className="h-14 rounded-[18px] border-2 border-primary bg-transparent text-lg font-bold text-primary shadow-xs transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-snappy-out hover:bg-primary hover:text-primary-foreground sm:flex-1 sm:text-xl"
            >
              <Link
                href="https://shop.gonatego.com"
                target="_blank"
                rel="noopener noreferrer"
                prefetch={false}
              >
                Shop Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
