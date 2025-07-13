"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

export function ShirtSection() {
  return (
    <section id="shirt" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/placeholder.svg?height=500&width=500"
              width="500"
              height="500"
              alt="Nate the Great T-Shirt"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
            />
          </motion.div>
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Wear Your Support</h2>
            <p className="text-slate-600 md:text-lg/relaxed">
              Get your own 'Nate the Great' t-shirt and show your support for Nate and childhood cancer research. These
              comfortable, high-quality shirts feature a special design inspired by Nate's courage. 100% of the proceeds
              go to our fundraising goal.
            </p>
            <Link
              href="#"
              className="inline-flex h-10 items-center justify-center rounded-md bg-blue-500 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700"
              prefetch={false}
            >
              Buy Now
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
