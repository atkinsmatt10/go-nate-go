"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

// Client-side cache
let clientCache: { count: number; timestamp: number } | null = null
const CLIENT_CACHE_DURATION = 2 * 60 * 1000 // 2 minutes

export function ShirtSection() {
  const [shirtCount, setShirtCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchShirtCount = async () => {
      // Check client-side cache first
      const now = Date.now()
      if (clientCache && (now - clientCache.timestamp) < CLIENT_CACHE_DURATION) {
        setShirtCount(clientCache.count)
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch('/api/shirt-count')
        const data = await response.json()
        setShirtCount(data.count)
        
        // Update client cache
        clientCache = {
          count: data.count,
          timestamp: now
        }
      } catch (error) {
        console.error('Failed to fetch shirt count:', error)
        setShirtCount(0) // fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchShirtCount()
  }, [])

  const formatCount = (count: number | null) => {
    if (count === null) return "Loading supporters..."
    if (count === 0) return "Be the first amazing supporter"
    if (count === 1) return "1 shirt from amazing supporters"
    return `${count} shirts from amazing supporters`
  }

  return (
    <section id="shirt" className="w-full py-16 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer group">
                  <Image
                    src="/Nate shirt.png"
                    width="500"
                    height="500"
                    alt="Nate the Great T-Shirt - Click to view larger"
                    className="mx-auto aspect-square overflow-hidden rounded-xl object-contain object-center sm:w-full transition-transform group-hover:scale-105"
                  />
                  {/* Click indicator */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-gray-800 shadow-lg border border-white/20 transform scale-95 group-hover:scale-100 transition-transform duration-200">
                      🔍 Click to enlarge
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-full">
                <DialogTitle className="sr-only">
                  Nate the Great T-Shirt - Enlarged View
                </DialogTitle>
                <div className="relative">
                  <Image
                    src="/Nate shirt.png"
                    width="800"
                    height="800"
                    alt="Nate the Great T-Shirt - Large View"
                    className="w-full h-auto object-contain rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
          
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-3">
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Join the Natey Shark Team
              </h2>
              <div className="flex justify-start">
                <div className={`bg-slate-700/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm transition-all duration-300 border border-slate-300/30 hover:border-slate-300/50 ${
                  isLoading ? 'animate-pulse' : 'hover:bg-slate-600/90'
                }`}>
                  {formatCount(shirtCount)}
                </div>
              </div>
            </div>
            
            <p className="text-muted-foreground md:text-lg/relaxed">
              Inspired by his family nickname, 'Natey Shark,' this t-shirt represents our son's incredible strength and fun-loving spirit. By wearing one, you become part of our team, spreading awareness and showing your support for Nate wherever you go. All proceeds help fund the vital cancer research at CHOP that gives our family so much hope.
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
              <Link
                href="https://shop.gonatego.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                prefetch={false}
              >
                Buy Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
