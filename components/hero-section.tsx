"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src="/nate-the-great-shirt.png"
            width="300"
            height="300"
            alt="Nate the Great Shark Illustration"
            className="mx-auto aspect-square overflow-hidden rounded-xl object-contain"
          />
          <div className="space-y-4">
            <h1 className="text-6xl font-bold tracking-tighter sm:text-8xl xl:text-9xl/none text-primary uppercase">
              Nate the Great
            </h1>
            <p className="max-w-[600px] mx-auto text-muted-foreground md:text-xl">
              Join us in supporting 10-month-old Nate and raising funds for childhood cancer research at the Children's
              Hospital of Philadelphia (CHOP). Your contribution makes a difference.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link
              href="#shirt"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-bold text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Buy a Shirt
            </Link>
            <Link
              href="#donate"
              className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-transparent px-8 text-lg font-bold shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              prefetch={false}
            >
              Donate Now
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
