"use client"

import { motion, useReducedMotion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { getRevealProps } from "@/lib/motion"

export function NatesStory() {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <section id="story" className="w-full relative bg-secondary">
      {/* Wave Shape at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[60px] md:h-[80px] lg:h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
            className="fill-secondary"
          ></path>
        </svg>
      </div>

      {/* Content with top padding to account for wave */}
      <div className="relative pt-[60px] md:pt-[80px] lg:pt-[100px] pb-16 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          <motion.div
            className="max-w-3xl mx-auto space-y-8"
            {...getRevealProps(prefersReducedMotion, { distance: 0, duration: 0.22, margin: "-100px" })}
          >
            {/* Nate's Journey tag - integrated into the peak of the wave area */}
            <motion.div
              className="flex justify-center"
              {...getRevealProps(prefersReducedMotion, { delay: 0.04, margin: "-50px" })}
            >
              <div className="inline-block rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-primary border border-primary/30 backdrop-blur-xs">
                Nate&apos;s Journey
              </div>
            </motion.div>

            {/* Main Headline with reveal animation */}
            <motion.h2
              className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground text-center"
              {...getRevealProps(prefersReducedMotion, { delay: 0.08, margin: "-50px" })}
            >
              Our Little Fighter
            </motion.h2>

            {/* Story Block 1: Early Life & Diagnosis */}
            <motion.div
              className="space-y-4"
              {...getRevealProps(prefersReducedMotion, { delay: 0.12, margin: "-50px" })}
            >
              <div className="flex justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs font-medium bg-background/80 backdrop-blur-xs border-primary/50 text-foreground">
                  Diagnosis
                </Badge>
              </div>
              <p className="text-muted-foreground md:text-lg/relaxed text-center sm:text-left">
                Nate was born on May 2, 2025. In late June, he began vomiting and became unusually sleepy, changes that set off
                alarms for us that something was wrong.
                <br /><br />
                We brought him to Children&apos;s Hospital of Philadelphia (CHOP) emergency room, where imaging showed
                hydrocephalus caused by a rare choroid plexus tumor. Within hours, the neurosurgery team had a plan to relieve
                pressure and stabilize him.
              </p>
            </motion.div>

            {/* Story Block 2: Treatment & Journey */}
            <motion.div
              className="space-y-4"
              {...getRevealProps(prefersReducedMotion, { delay: 0.16, margin: "-50px" })}
            >
              <div className="flex justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs font-medium bg-background/80 backdrop-blur-xs border-primary/50 text-foreground">
                  Treatment
                </Badge>
              </div>
              <p className="text-muted-foreground md:text-lg/relaxed text-center sm:text-left">
                Over the next week, he underwent three surgeries, including an EVD placement and biopsy.
                <br /><br />
                Because of Nate&apos;s young age, tiny body weight, and the vascular nature of the tumor, the neurosurgery team
                determined that complete resection was not safe at that time. Instead, he underwent another surgery to place a
                shunt that controlled the hydrocephalus, and we were able to bring him home and give him time to grow.
              </p>
            </motion.div>

            {/* Story Block 3: Recovery & Hope */}
            <motion.div
              className="space-y-4"
              {...getRevealProps(prefersReducedMotion, { delay: 0.2, margin: "-50px" })}
            >
              <div className="flex justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs font-medium bg-background/80 backdrop-blur-xs border-primary/50 text-foreground">
                  Hope
                </Badge>
              </div>
              <p className="text-muted-foreground md:text-lg/relaxed text-center sm:text-left">
                Fast forward 6 months, Nate was bigger and stronger and ready for surgery to remove the tumor completely. On
                January 2, 2026, his neurosurgeon completed a gross total resection.
                <br /><br />
                Recovery brought its own challenges, including placing another shunt that will likely be there for life, but Nate
                did amazing. He is now nearly 10 months old, at home, crawling and pulling himself up, and is the happiest kid in
                the room.
                <br /><br />
                We will never be able to truly convey the gratitude we have for CHOP&apos;s neurosurgery and neuro-oncology teams,
                as well as all of the doctors, nurses, and staff that took care of him and us on this journey. We also will never
                be able to thank our family and friends enough who were there for us during the hardest of times.
                <br /><br />
                Sharing Nate&apos;s story is our way of honoring the care that saved him, helping other families spot concerning
                signs sooner, and raising money to fund research so that treatments exist for the next child who needs them.
              </p>
            </motion.div>

            {/* Read Full Story Card with Logo */}
            <motion.div
              {...getRevealProps(prefersReducedMotion, { delay: 0.24, margin: "-50px" })}
            >
              <a
                href="https://curethekids.org/story/nates-journey-strength-beyond-his-seven-weeks/"
                target="_blank"
                rel="noopener noreferrer"
                className="block group"
              >
                <Card className="cursor-pointer overflow-hidden border-primary/30 bg-background/80 backdrop-blur-xs transition-[box-shadow,border-color] duration-200 ease-snappy-out hover:border-primary/60 hover:shadow-lg">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-6">
                      {/* Logo Section */}
                      <div className="shrink-0">
                        <div className="relative w-40 h-32 sm:w-48 sm:h-36">
                          <Image
                            src="/logo1-color.webp"
                            alt="Pediatric Brain Tumor Foundation"
                            fill
                            className="object-contain"
                            sizes="(max-width: 640px) 160px, 192px"
                          />
                        </div>
                      </div>
                      
                      {/* Text Content */}
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          Read Nate&apos;s Full Story
                        </h3>
                        <p className="text-muted-foreground text-sm md:text-base">
                          Read about Nate&apos;s diagnosis, surgeries, recovery, and the care team that helped save his life.
                        </p>
                      </div>
                      
                      {/* Icon */}
                      <div className="shrink-0">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <ExternalLink className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
