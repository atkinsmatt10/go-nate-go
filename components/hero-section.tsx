"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { ViewTransition, useState, useEffect, useRef, useCallback } from "react"
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

export function HeroSection() {
  const [currentImage, setCurrentImage] = useState(0)
  const [direction, setDirection] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { trigger } = useHapticFeedback()
  const prefersReducedMotion = useReducedMotion() ?? false

  // Parallax wave animation
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"]
  })
  const waveY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

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
    <section ref={sectionRef} className="relative w-full py-12 md:py-20 lg:py-24 overflow-hidden">
      {/* Subtle Parallax Wave Background */}
      <motion.div
        style={prefersReducedMotion ? undefined : { y: waveY }}
        className="absolute inset-0 -z-10 pointer-events-none"
        {...getPageRevealProps(prefersReducedMotion, { distance: 0, duration: 0.3 })}
      >
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
      </motion.div>

      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          {...getPageRevealProps(prefersReducedMotion)}
        >
          {/* Logo */}
          <motion.div {...getScaleInProps(prefersReducedMotion, { duration: 0.26, scale: 0.96 })}>
            <ViewTransition name="campaign-logo" share="morph" default="none">
              <Image
                src="/Nate-the-great-logo.png"
                width="600"
                height="400"
                alt="Nate the Great Title Logo"
                className="mx-auto max-w-full h-auto object-contain"
                priority
              />
            </ViewTransition>
          </motion.div>

          {/* Enhanced Photo Carousel with Smooth Animations - MOVED UP */}
          <motion.div className="relative w-full max-w-md mx-auto" {...getScaleInProps(prefersReducedMotion, { delay: 0.04, scale: 0.98 })}>
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
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
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                >
                  <Image
                    src={images[currentImage].src}
                    width={400}
                    height={400}
                    alt={images[currentImage].alt}
                    className="w-full h-full object-cover object-center"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={currentImage === 0}
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Peeking Shark Mascot */}
              <motion.div className="absolute -bottom-2 -right-2 z-10" {...getPageRevealProps(prefersReducedMotion, { delay: 0.18, distance: 12 })}>
                <Image
                  src="/nate shark.png"
                  width={80}
                  height={80}
                  alt="Nate's Shark Mascot"
                  className="drop-shadow-lg"
                  style={{ height: "auto" }}
                />
              </motion.div>
            </div>
            
            {/* Enhanced Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-4">
              {images.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleImageClick(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentImage ? 'bg-primary' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                  whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                  animate={{
                    scale: index === currentImage ? 1.12 : 1,
                    opacity: index === currentImage ? 1 : 0.7
                  }}
                  transition={CAROUSEL_TRANSITION}
                />
              ))}
            </div>
          </motion.div>

          <div className="space-y-4">
            {/* Powerful Headline */}
            <motion.h1
              className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.08 })}
            >
              Help Nate Fight Childhood Cancer
            </motion.h1>
            
            {/* Sub-headline */}
            <motion.p
              className="max-w-[700px] mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.12 })}
            >
              Born in May 2025, Nate&apos;s world changed at just eight weeks old. Vomiting and extreme sleepiness led to a
              terrifying diagnosis at CHOP: a rare choroid plexus tumor causing hydrocephalus. Emergency surgeries saved his
              life, and after months of fighting, surgeons removed the tumor entirely. Today, he&apos;s home, crawling, smiling, and
              here because of the extraordinary team at CHOP.
            </motion.p>
          </div>

          {/* Call-to-Action Buttons */}
          <motion.div
            className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md"
            {...getPageRevealProps(prefersReducedMotion, { delay: 0.16 })}
          >
            {/* Primary CTA - Donate Now */}
            <Button
              asChild
              size="lg"
              className="h-14 text-xl font-bold shadow-lg transition-[box-shadow,transform] duration-150 ease-snappy-out hover:shadow-xl"
            >
              <Link
                href="/donate"
                transitionTypes={["nav-forward"]}
              >
                Donate Now
              </Link>
            </Button>
            
            {/* Secondary CTA - Shop Now */}
            <Button
              asChild
              variant="outline"
              size="lg"
              haptic="light"
              className="h-14 border-2 border-primary bg-transparent text-xl font-bold text-primary shadow-sm transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-snappy-out hover:bg-primary hover:text-primary-foreground"
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
        </motion.div>
      </div>
    </section>
  )
}
