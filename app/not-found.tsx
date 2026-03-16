"use client"

import Image from "next/image"
import Link from "next/link"
import { motion, useReducedMotion } from "framer-motion"
import { getPageRevealProps, getScaleInProps } from "@/lib/motion"

export default function NotFound() {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 text-center max-w-2xl mx-auto"
            {...getPageRevealProps(prefersReducedMotion)}
          >
            {/* Large 404 */}
            <motion.div className="text-center" {...getScaleInProps(prefersReducedMotion, { duration: 0.24, scale: 0.96 })}>
              <h1 className="text-8xl md:text-9xl font-bold text-primary">404</h1>
            </motion.div>

            {/* Nate Shark on its own line */}
            <motion.div className="flex justify-center" {...getPageRevealProps(prefersReducedMotion, { delay: 0.06, distance: 12 })}>
              <Image
                src="/nate shark.png"
                width={120}
                height={120}
                alt="Nate's Shark - Looks like you're lost!"
                className="drop-shadow-lg"
                style={{ height: "auto" }}
              />
            </motion.div>

            {/* Headline */}
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-foreground"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.1 })}
            >
              Oops! Looks like you&apos;re swimming in uncharted waters
            </motion.h2>
            
            {/* Description */}
            <motion.p
              className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-md"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.14 })}
            >
              The page you&apos;re looking for doesn&apos;t exist, but don&apos;t worry - Nate&apos;s shark friend will help guide you back to safety!
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col gap-4 w-full max-w-sm"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.18 })}
            >
              {/* Go Home Button */}
              <Link
                href="/"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-xl font-bold text-primary-foreground shadow-lg transition-[background-color,box-shadow,transform] duration-150 ease-snappy-out active:scale-[0.98] hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Go Home
              </Link>
              
              {/* Donate Button */}
              <Link
                href="/donate"
                className="inline-flex h-14 items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 text-xl font-bold text-primary shadow-sm transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-snappy-out active:scale-[0.98] hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Support Nate Instead
              </Link>
            </motion.div>

            {/* Additional Links */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 pt-4"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.22, distance: 0 })}
            >
              <Link 
                href="/#story" 
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Read Nate&apos;s Story
              </Link>
              <Link 
                href="/#shirt" 
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Shop Now
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  )
} 
