"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, Cake, PartyPopper, Users, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Footer } from "@/components/footer"
import { getPageRevealProps, getScaleInProps, MOTION_EASE_OUT } from "@/lib/motion"

const inputClassName =
  "h-12 rounded-2xl border border-border bg-card/80 px-4 text-foreground shadow-sm transition-[border-color,box-shadow] duration-150 ease-snappy-out placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/25 focus:ring-offset-0"

const labelClassName = "text-sm font-semibold text-foreground"

const submitButtonClassName =
  "h-14 w-full rounded-2xl border border-primary bg-primary text-lg font-bold text-primary-foreground shadow-[0_16px_26px_rgba(66,168,169,0.2)] transition-[background-color,transform,box-shadow] duration-150 ease-snappy-out active:scale-[0.98] hover:-translate-y-0.5 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"

const cardClassName =
  "rounded-[1.5rem] border border-border bg-card/95 p-6 shadow-[0_14px_30px_rgba(42,63,84,0.16)] sm:p-8"

export default function BirthdayRSVPPage() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    guestName: "",
    email: "",
    phone: "",
    attendees: "",
    dietaryPreferences: "",
    message: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, attendees: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  const isFormValid =
    formData.guestName.trim() !== "" &&
    formData.email.trim() !== "" &&
    formData.attendees !== ""

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <main className="relative flex-1 overflow-hidden bg-background">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <svg
            viewBox="0 0 1200 120"
            className="absolute bottom-0 h-32 w-full opacity-5"
            preserveAspectRatio="none"
          >
            <path
              d="M0,60 C300,100 900,20 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
          <svg
            viewBox="0 0 1200 120"
            className="absolute bottom-0 h-40 w-full opacity-[0.02]"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C400,120 800,40 1200,80 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
        </div>

        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          {/* Back Button */}
          <motion.div
            {...getPageRevealProps(prefersReducedMotion)}
            className="mb-6"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </motion.div>

          <div className="mx-auto max-w-2xl">
            {/* Header Section */}
            <motion.div
              className="mb-8 text-center"
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.04 })}
            >
              <motion.div
                {...getScaleInProps(prefersReducedMotion, {
                  delay: 0.08,
                  scale: 0.96,
                })}
                className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-lg"
              >
                <Cake className="h-12 w-12 text-primary-foreground" />
              </motion.div>

              <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Nate&apos;s First Birthday!
              </h1>
              <p className="mx-auto max-w-md text-lg leading-relaxed text-muted-foreground">
                Join us in celebrating this incredible milestone! We&apos;d love to have
                you there to share in the joy.
              </p>
            </motion.div>

            {/* Event Details Card */}
            <motion.div
              className={`${cardClassName} mb-6`}
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.12 })}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <PartyPopper className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Save the Date
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      May 2026
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      All Ages Welcome
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      Family Friendly
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RSVP Form Card */}
            <motion.div
              className={cardClassName}
              {...getPageRevealProps(prefersReducedMotion, { delay: 0.16 })}
            >
              {isSubmitted ? (
                <motion.div
                  className="py-8 text-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: MOTION_EASE_OUT }}
                >
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary">
                    <Check className="h-10 w-10 text-primary-foreground" />
                  </div>
                  <h2 className="mb-3 text-2xl font-bold text-foreground">
                    Thank You!
                  </h2>
                  <p className="mx-auto max-w-sm text-muted-foreground">
                    Your RSVP has been received. We can&apos;t wait to celebrate with
                    you! We&apos;ll be in touch with more details soon.
                  </p>
                  <Button
                    asChild
                    className="mt-6 h-12 rounded-2xl border border-primary bg-primary px-8 font-bold text-primary-foreground shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl"
                  >
                    <Link href="/">Return Home</Link>
                  </Button>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      RSVP Form
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Please fill out the form below to let us know you&apos;re coming.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Guest Name */}
                    <div className="space-y-2">
                      <Label htmlFor="guestName" className={labelClassName}>
                        Your Name <span className="text-[#dc2626]">*</span>
                      </Label>
                      <Input
                        id="guestName"
                        name="guestName"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.guestName}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className={labelClassName}>
                        Email Address <span className="text-[#dc2626]">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className={inputClassName}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className={labelClassName}>
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={inputClassName}
                      />
                    </div>

                    {/* Number of Attendees */}
                    <div className="space-y-2">
                      <Label htmlFor="attendees" className={labelClassName}>
                        Number of Attendees{" "}
                        <span className="text-[#dc2626]">*</span>
                      </Label>
                      <Select
                        value={formData.attendees}
                        onValueChange={handleSelectChange}
                        required
                      >
                        <SelectTrigger
                          id="attendees"
                          className={inputClassName}
                        >
                          <SelectValue placeholder="Select number of guests" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border border-border bg-card shadow-lg">
                          <SelectItem value="1">1 Guest</SelectItem>
                          <SelectItem value="2">2 Guests</SelectItem>
                          <SelectItem value="3">3 Guests</SelectItem>
                          <SelectItem value="4">4 Guests</SelectItem>
                          <SelectItem value="5">5 Guests</SelectItem>
                          <SelectItem value="6+">6+ Guests</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Dietary Preferences */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="dietaryPreferences"
                        className={labelClassName}
                      >
                        Dietary Preferences or Allergies
                      </Label>
                      <Input
                        id="dietaryPreferences"
                        name="dietaryPreferences"
                        type="text"
                        placeholder="Vegetarian, nut allergy, etc."
                        value={formData.dietaryPreferences}
                        onChange={handleInputChange}
                        className={inputClassName}
                      />
                    </div>

                    {/* Message */}
                    <div className="space-y-2">
                      <Label htmlFor="message" className={labelClassName}>
                        Message for Nate
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Share a birthday wish or message for Nate..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={4}
                        className={`${inputClassName} h-auto min-h-[120px] resize-none py-3`}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      className={submitButtonClassName}
                      disabled={!isFormValid || isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit RSVP"}
                    </Button>

                    <p className="text-center text-xs font-medium text-muted-foreground">
                      We&apos;ll send confirmation and event details to your email.
                    </p>
                  </form>
                </>
              )}
            </motion.div>

            {/* Shark Mascot */}
            <motion.div
              className="mt-8 flex justify-center"
              {...getScaleInProps(prefersReducedMotion, { delay: 0.24 })}
            >
              <Image
                src="/nate shark.png"
                width={100}
                height={100}
                alt="Nate's Shark Mascot"
                className="drop-shadow-lg"
                style={{ height: "auto" }}
              />
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
