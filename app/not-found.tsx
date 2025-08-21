"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-dvh bg-background text-foreground">
      <main className="flex-1 flex items-center justify-center">
        <div className="container px-4 md:px-6">
          <motion.div
            className="flex flex-col items-center justify-center space-y-8 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Large 404 */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-8xl md:text-9xl font-bold text-primary">404</h1>
            </motion.div>

            {/* Nate Shark on its own line */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, rotate: -10 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.4 }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
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
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Oops! Looks like you're swimming in uncharted waters
            </motion.h2>
            
            {/* Description */}
            <motion.p 
              className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              The page you're looking for doesn't exist, but don't worry - Nate's shark friend will help guide you back to safety!
            </motion.p>

            {/* Action Buttons */}
            <motion.div 
              className="flex flex-col gap-4 w-full max-w-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {/* Go Home Button */}
              <Link
                href="/"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-xl font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Go Home
              </Link>
              
              {/* Donate Button */}
              <Link
                href="https://chop.donordrive.com/teams/15164?wait=1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center justify-center rounded-lg border-2 border-primary bg-transparent px-8 text-xl font-bold text-primary shadow-sm transition-all hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Support Nate Instead
              </Link>
            </motion.div>

            {/* Additional Links */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <Link 
                href="/#story" 
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Read Nate's Story
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