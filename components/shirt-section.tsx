"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useHapticFeedback } from "@/hooks/use-haptic-feedback"
import {
  CAROUSEL_TRANSITION,
  getCarouselSlideVariants,
  getRevealProps,
} from "@/lib/motion"

// Merchandise items for carousel
const merchandiseItems = [
  {
    src: "/unisex-garment-dyed-heavyweight-t-shirt-navy-front-68a5f15854564.jpg",
    alt: "Nate the Great Heavyweight Tee",
    productUrl: "https://shop.gonatego.com/products/unisex-garment-dyed-heavyweight-t-shirt",
    price: "$35.00"
  },
  {
    src: "/unisex-premium-sweatshirt-navy-blazer-front-68a5f05c76dd3.jpg",
    alt: "Nate the Great Premium Midweight Crew",
    productUrl: "https://shop.gonatego.com/products/unisex-premium-sweatshirt",
    price: "$55.00"
  },
  {
    src: "/waffle-beanie-navy-front-68a5f0a9e7b3c.jpg",
    alt: "Nate the Great Thermal Waffle Beanie",
    productUrl: "https://shop.gonatego.com/products/waffle-beanie",
    price: "$25.00"
  },
  {
    src: "/baby-short-sleeve-one-piece-black-front-68a5f10c1bf9a.jpg",
    alt: "Nate the Great Baby One-Piece",
    productUrl: "https://shop.gonatego.com/products/baby-short-sleeve-one-piece",
    price: "$25.00"
  }
]

export function ShirtSection() {
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
      setCurrentImage((prev) => (prev + 1) % merchandiseItems.length)
    }, 5000) // Change image every 5 seconds
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
    <section id="shirt" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            className="relative"
            {...getRevealProps(prefersReducedMotion, { distance: 12 })}
          >
            {/* Merchandise Carousel */}
            <div className="relative w-full max-w-lg mx-auto">
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
                        setCurrentImage((prev) => (prev + 1) % merchandiseItems.length)
                        trigger("selection")
                        resetTimer()
                      } else if (swipe > swipeConfidenceThreshold) {
                        setDirection(-1)
                        setCurrentImage((prev) => (prev - 1 + merchandiseItems.length) % merchandiseItems.length)
                        trigger("selection")
                        resetTimer()
                      }
                    }}
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
                  >
                    <Link
                      href={merchandiseItems[currentImage].productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-pointer group w-full h-full block"
                    >
                      <Image
                        src={merchandiseItems[currentImage].src}
                        width={500}
                        height={500}
                        alt={`${merchandiseItems[currentImage].alt} - Click to shop`}
                        className="w-full h-full object-contain object-center transition-transform duration-200 ease-snappy-out group-hover:scale-[1.02]"
                        quality={85}
                        sizes="(max-width: 768px) 100vw, 500px"
                        priority={currentImage === 0}
                      />
                      {/* Click indicator */}
                      <div className="absolute inset-0 rounded-2xl bg-black/0 opacity-0 transition-[background-color,opacity] duration-200 ease-snappy-out group-hover:bg-black/20 group-hover:opacity-100 flex items-center justify-center">
                        <div className="bg-white/95 backdrop-blur-sm rounded-lg px-4 py-3 text-sm font-semibold text-gray-800 shadow-lg border border-white/20 transform scale-95 group-hover:scale-100 transition-transform duration-150 ease-snappy-out">
                          <div className="text-center">
                            <div className="text-primary text-lg font-bold">{merchandiseItems[currentImage].price}</div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              🛒 Click to shop
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Product Info */}
              <div className="text-center mt-4">
                <h3 className="font-semibold text-lg text-foreground">
                  {merchandiseItems[currentImage].alt}
                </h3>
                <p className="text-primary font-bold text-xl">
                  {merchandiseItems[currentImage].price}
                </p>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center space-x-2 mt-4">
                {merchandiseItems.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleImageClick(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                      index === currentImage ? 'bg-primary' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to ${merchandiseItems[index].alt}`}
                    whileTap={prefersReducedMotion ? undefined : { scale: 0.92 }}
                    animate={{
                      scale: index === currentImage ? 1.12 : 1,
                      opacity: index === currentImage ? 1 : 0.7
                    }}
                    transition={CAROUSEL_TRANSITION}
                  />
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="space-y-4"
            {...getRevealProps(prefersReducedMotion, { delay: 0.06 })}
          >
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Join the Natey Shark Team
              </h2>
              <div className="flex justify-start">
                <div className="rounded-full border border-slate-300/30 bg-slate-700/90 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm transition-[background-color,border-color] duration-200 ease-snappy-out hover:border-slate-300/50 hover:bg-slate-600/90">
                  100+ shirts from amazing supporters
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground md:text-lg/relaxed">
              Inspired by his family nickname, &apos;Natey Shark,&apos; our merchandise collection represents our son&apos;s incredible strength and fun-loving spirit. By wearing any of these items, you become part of our team, spreading awareness and showing your support for Nate wherever you go. All proceeds help fund the vital cancer research at CHOP that gives our family so much hope.
            </p>
            
            {/* CHOP logo highlight */}
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-primary/20">
              <Image
                src="/idcxwIXBiY_1752452732503.jpeg"
                width={60}
                height={60}
                alt="CHOP - Children's Hospital of Philadelphia"
                className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
              />
              <div>
                <p className="font-semibold text-primary text-sm sm:text-base">100% of proceeds</p>
                <p className="text-xs sm:text-sm text-muted-foreground">go directly to childhood cancer research</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                asChild
                size="lg"
                className="h-14 text-xl font-bold shadow-lg transition-[box-shadow,transform] duration-150 ease-snappy-out hover:shadow-xl"
              >
                <Link
                  href="https://shop.gonatego.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
                >
                  Buy Now
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
