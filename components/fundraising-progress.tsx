"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import Link from "next/link"

export function FundraisingProgress() {
  const [progress, setProgress] = useState(0)
  const goal = 25000
  const raised = 16250

  useEffect(() => {
    const calculatedProgress = (raised / goal) * 100
    const timer = setTimeout(() => setProgress(calculatedProgress), 500)
    return () => clearTimeout(timer)
  }, [raised, goal])

  return (
    <section id="donate" className="w-full py-12 md:py-24 lg:py-32">
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
              <span>Raised: ${raised.toLocaleString()}</span>
              <span>Goal: ${goal.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-6">
            <Link
              href="#"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
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
