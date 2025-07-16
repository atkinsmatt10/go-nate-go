"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export function NatesStory() {
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Nate's Journey tag - integrated into the peak of the wave area */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-block rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-primary border border-primary/30 backdrop-blur-sm">
                Nate's Journey
              </div>
            </motion.div>

            {/* Main Headline with reveal animation */}
            <motion.h2
              className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Our Little Fighter
            </motion.h2>

            {/* Story Block 1: Early Life & Diagnosis */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/50 text-foreground">
                  Diagnosis
                </Badge>
              </div>
              <p className="text-muted-foreground md:text-lg/relaxed text-center sm:text-left">
                In just a few short months of life, our son Nate has already touched more hearts than we can count. His smile truly lights up every room.
                <br /><br />
                But our world changed when Nate was diagnosed with a rare brain tumor. Since that day, he has shown more bravery than most do in a lifetime.
              </p>
            </motion.div>

            {/* Story Block 2: Treatment & Journey */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="flex justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/50 text-foreground">
                  Treatment
                </Badge>
              </div>
              <p className="text-muted-foreground md:text-lg/relaxed text-center sm:text-left">
                Enduring surgeries and long hospital stays with incredible strength, he is, without a doubt, our hero. We are endlessly grateful for the incredible team at Children's Hospital of Philadelphia.
                <br /><br />
                From his neurosurgeons and oncologists to the nurses, therapists, and social workers, every single person has played a role in supporting Nate and our family.
              </p>
            </motion.div>

            {/* Story Block 3: Recovery & Hope */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <div className="flex justify-center sm:justify-start">
                <Badge variant="outline" className="text-xs font-medium bg-background/80 backdrop-blur-sm border-primary/50 text-foreground">
                  Hope
                </Badge>
              </div>
              <p className="text-muted-foreground md:text-lg/relaxed text-center sm:text-left">
                While Nate has a long road ahead, he is doing well. Every donation helps fund the critical research, clinical trials, and compassionate care that gives children like him a fighting chance.
                <br /><br />
                Thank you for supporting our 'Nate the Great' and the amazing work being done at CHOP.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
