"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import Link from "next/link"
import useSWR from 'swr'

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
})

export function FundraisingProgress() {
  const [progress, setProgress] = useState(0)
  const fallbackAmount = 16250
  const fallbackGoal = 25000
  const [animatedRaised, setAnimatedRaised] = useState(0)
  const [animatedDonations, setAnimatedDonations] = useState(0)

  // Fetch real-time donation data
  const { data, error, isLoading } = useSWR('/api/donations', fetcher, {
    refreshInterval: 15000, // Refresh every 15 seconds
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })

  const raised = data?.total || fallbackAmount // Fallback to previous value
  const goal = data?.goal || fallbackGoal // Use dynamic goal from API
  const numDonations = data?.numDonations || 0
  
  useEffect(() => {
    const calculatedProgress = (raised / goal) * 100
    const timer = setTimeout(() => setProgress(calculatedProgress), 500)
    return () => clearTimeout(timer)
  }, [raised, goal])

  // Animate the raised amount when it changes
  useEffect(() => {
    if (raised !== animatedRaised) {
      const duration = 800
      const startValue = animatedRaised
      const endValue = raised
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3)
        const currentValue = startValue + (endValue - startValue) * eased
        
        setAnimatedRaised(Math.round(currentValue))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [raised, animatedRaised])

  // Animate the donation count when it changes
  useEffect(() => {
    if (numDonations !== animatedDonations) {
      const duration = 600
      const startValue = animatedDonations
      const endValue = numDonations
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        
        // Easing function for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3)
        const currentValue = startValue + (endValue - startValue) * eased
        
        setAnimatedDonations(Math.round(currentValue))
        
        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      
      requestAnimationFrame(animate)
    }
  }, [numDonations, animatedDonations])

  return (
    <section id="donate" className="w-full py-16 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">Help Us Reach Our Goal</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              All proceeds from shirt sales and donations go directly to cancer research at CHOP.
            </p>
          </div>
          <div className="w-full max-w-2xl space-y-4">
            <Progress value={progress} className="w-full h-4 bg-secondary" />
            <div className="flex justify-between font-medium text-lg text-foreground">
              <span className="flex items-center gap-2">
                Raised: ${animatedRaised.toLocaleString()}
                {isLoading && <span className="text-sm text-muted-foreground">(updating...)</span>}
                {error && <span className="text-sm text-orange-500" title="Failed to fetch latest data">(offline)</span>}
              </span>
              <span>Goal: ${goal.toLocaleString()}</span>
            </div>
            <div className="flex justify-center">
              <Badge variant="outline">
                {animatedDonations} donation{animatedDonations !== 1 ? 's' : ''} from amazing supporters
              </Badge>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="https://chop.donordrive.com/teams/15164?wait=1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-lg bg-primary px-8 text-xl font-bold text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Donate Directly
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
