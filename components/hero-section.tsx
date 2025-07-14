"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect, useRef, useCallback } from "react"

const images = [
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
    resetTimer() // Reset the auto-advance timer
  }

  // Animation variants for the carousel
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15,
    }),
  }

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <Image
            src="/Nate-the-great-logo.png"
            width="600"
            height="400"
            alt="Nate the Great Title Logo"
            className="mx-auto max-w-full h-auto object-contain"
            priority
          />

          <div className="space-y-6">
            {/* Powerful Headline */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Help Nate Fight Childhood Cancer
            </h1>
            
            {/* Sub-headline */}
            <p className="max-w-[700px] mx-auto text-muted-foreground text-lg md:text-xl leading-relaxed">
              Join us in supporting 10-month-old Nate and raising funds for childhood cancer research at the Children's
              Hospital of Philadelphia (CHOP). Your contribution makes a difference.
            </p>
          </div>

          {/* Call-to-Action Buttons - MOVED ABOVE THE FOLD */}
          <div className="flex flex-col gap-4 w-full max-w-sm sm:max-w-md">
            {/* Primary CTA - Donate Now */}
            <Link
              href="#donate"
              className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-xl font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Donate Now
            </Link>
            
            {/* Secondary CTA - Buy a Shirt */}
            <Link
              href="#shirt"
              className="inline-flex h-14 items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 text-xl font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Buy a Shirt
            </Link>
          </div>

          {/* Enhanced Photo Carousel with Smooth Animations */}
          <motion.div
            className="relative w-full max-w-md mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl shadow-lg">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentImage}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.3 },
                    rotateY: { duration: 0.3 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x)

                    if (swipe < -swipeConfidenceThreshold) {
                      setDirection(1)
                      setCurrentImage((prev) => (prev + 1) % images.length)
                      resetTimer() // Reset the auto-advance timer
                    } else if (swipe > swipeConfidenceThreshold) {
                      setDirection(-1)
                      setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
                      resetTimer() // Reset the auto-advance timer
                    }
                  }}
                  className="absolute inset-0 cursor-grab active:cursor-grabbing"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Image
                    src={images[currentImage].src}
                    width={400}
                    height={400}
                    alt={images[currentImage].alt}
                    className="w-full h-full object-cover object-center"
                    quality={85}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </motion.div>
              </AnimatePresence>
              
              {/* Peeking Shark Mascot */}
              <motion.div
                className="absolute -bottom-2 -right-2 z-10"
                initial={{ opacity: 0, y: 20, rotate: -5 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{ duration: 0.8, delay: 1, type: "spring", bounce: 0.4 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Image
                  src="/nate shark.png"
                  width={80}
                  height={80}
                  alt="Nate's Shark Mascot"
                  className="drop-shadow-lg"
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
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    scale: index === currentImage ? 1.2 : 1,
                    opacity: index === currentImage ? 1 : 0.7
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
