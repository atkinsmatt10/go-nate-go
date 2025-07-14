"use client"

import { motion } from "framer-motion"

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
      <div className="relative pt-[80px] md:pt-[100px] lg:pt-[120px] pb-12 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          <motion.div
            className="max-w-3xl mx-auto space-y-6"
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

            {/* First paragraph with staggered reveal */}
            <motion.p
              className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-center sm:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Nate is a cheerful and resilient 10-month-old boy with a smile that can light up any room. Recently, he
              was diagnosed with a rare form of childhood cancer. Despite the challenges, Nate's spirit remains
              unbroken. He is a true warrior, and we call him 'Nate the Great' for his incredible strength.
            </motion.p>

            {/* Second paragraph with staggered reveal */}
            <motion.p
              className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed text-center sm:text-left"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              We are raising funds to support the groundbreaking cancer research at the Children's Hospital of
              Philadelphia (CHOP), where Nate is receiving the best possible care. Every dollar raised will help fund
              vital research to find better treatments and ultimately a cure for children like Nate.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
