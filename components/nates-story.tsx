"use client"

import Image from "next/image"
import { motion } from "framer-motion"

export function NatesStory() {
  return (
    <section id="story" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-block rounded-lg bg-primary/20 px-3 py-1 text-sm font-medium text-primary">
              Nate's Journey
            </div>
            <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">Our Little Fighter</h2>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              Nate is a cheerful and resilient 10-month-old boy with a smile that can light up any room. Recently, he
              was diagnosed with a rare form of childhood cancer. Despite the challenges, Nate's spirit remains
              unbroken. He is a true warrior, and we call him 'Nate the Great' for his incredible strength.
            </p>
            <p className="text-muted-foreground md:text-lg/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
              We are raising funds to support the groundbreaking cancer research at the Children's Hospital of
              Philadelphia (CHOP), where Nate is receiving the best possible care. Every dollar raised will help fund
              vital research to find better treatments and ultimately a cure for children like Nate.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Image
              src="/placeholder.svg?height=400&width=600"
              width="600"
              height="400"
              alt="Nate playing"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
