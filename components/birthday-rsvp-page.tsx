"use client"

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CalendarDays, CheckCircle2, MapPin, type LucideIcon } from "lucide-react"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPageRevealProps, getRevealProps } from "@/lib/motion"
import { cn } from "@/lib/utils"

type AttendanceValue = "yes" | "no" | ""

interface SubmissionState {
  tone: "success" | "error"
  message: string
}

const coverImage = "/IMG_9908.png"
const googleMapsUrl = "https://maps.google.com/?q=Craft+Hall+901+N+Delaware+Ave+Philadelphia+PA+19123"
const googleMapsEmbedUrl =
  "https://www.google.com/maps?q=Craft+Hall+901+N+Delaware+Ave+Philadelphia+PA+19123&z=15&output=embed"
const donationUrl = "/donate"
const attendanceOptions = [
  { value: "yes", label: "We’ll be there", description: "Save seats and cookies for us." },
  { value: "no", label: "Can’t make it", description: "Let the family know we’re cheering Nate on from afar." },
] as const

export function BirthdayRsvpPage() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [name, setName] = useState("")
  const [attendeeCount, setAttendeeCount] = useState("1")
  const [attendance, setAttendance] = useState<AttendanceValue>("")
  const [submissionState, setSubmissionState] = useState<SubmissionState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionState(null)

    const trimmedName = name.trim()
    const parsedAttendeeCount = Number.parseInt(attendeeCount, 10)

    if (!trimmedName) {
      setSubmissionState({ tone: "error", message: "Please enter your name before sending your RSVP." })
      return
    }

    if (!Number.isInteger(parsedAttendeeCount) || parsedAttendeeCount < 1 || parsedAttendeeCount > 12) {
      setSubmissionState({ tone: "error", message: "Enter a party size between 1 and 12." })
      return
    }

    if (attendance !== "yes" && attendance !== "no") {
      setSubmissionState({ tone: "error", message: "Choose whether your party is coming or not." })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/birthday-rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          attendeeCount: parsedAttendeeCount,
          attendance,
        }),
      })

      const payload = (await response.json()) as { error?: string; message?: string }

      if (!response.ok) {
        throw new Error(payload.error ?? "Your RSVP could not be sent right now. Please try again.")
      }

      setSubmissionState({
        tone: "success",
        message:
          attendance === "yes"
            ? `Thanks, ${trimmedName}. Your RSVP is in and we’ll be ready for ${parsedAttendeeCount} guest${parsedAttendeeCount === 1 ? "" : "s"}.`
            : `Thanks, ${trimmedName}. Your RSVP is in, and the Atkins family appreciates the heads up.`,
      })
      setName("")
      setAttendeeCount("1")
      setAttendance("")
    } catch (error) {
      setSubmissionState({
        tone: "error",
        message: error instanceof Error ? error.message : "Your RSVP could not be sent right now. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="overflow-hidden">
        <section className="relative isolate bg-[linear-gradient(180deg,_#2a3f54_0%,_#304a67_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(66,168,169,0.24),_transparent_40%),radial-gradient(circle_at_85%_12%,_rgba(247,251,255,0.12),_transparent_22%)]" />

          <div className="container relative px-4 py-8 md:px-6 md:py-12 lg:py-14">
            <motion.div
              className="mx-auto max-w-5xl space-y-8"
              {...getPageRevealProps(prefersReducedMotion, { distance: 0, duration: 0.24 })}
            >
              <motion.div
                className="overflow-hidden rounded-[32px] border border-white/14 bg-[rgba(247,251,255,0.08)] shadow-[0_24px_54px_rgba(16,31,44,0.24)]"
                {...getRevealProps(prefersReducedMotion, { delay: 0.04, distance: 18 })}
              >
                <div className="relative aspect-[6/5] sm:aspect-[16/10] lg:aspect-[16/8]">
                  <Image
                    src={coverImage}
                    alt="Nate smiling in the birthday page cover image"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(22,37,51,0.06)_0%,rgba(22,37,51,0.3)_100%)]" />
                </div>
              </motion.div>

              <motion.div className="space-y-6" {...getRevealProps(prefersReducedMotion, { delay: 0.08, distance: 18 })}>
                <div className="space-y-4">
                  <Badge className="w-fit rounded-full border border-[#9fc5d8] bg-[#d8eff5] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#223b54]">
                    First birthday party
                  </Badge>

                  <div className="space-y-3">
                    <h1 className="max-w-3xl text-4xl leading-[0.96] text-white sm:text-5xl md:text-6xl">
                      One tough cookie is turning one.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-[#eef5fb] sm:text-lg">
                      Come celebrate Nate the Great with us at Craft Hall in Philadelphia.
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <EventMetaCard
                    icon={CalendarDays}
                    label="Date & time"
                    title="Saturday, May 9, 2026"
                    description="12 PM to 3 PM"
                  />
                  <EventMetaCard
                    icon={MapPin}
                    label="Location"
                    title="Craft Hall"
                    description="901 N Delaware Ave, Philadelphia, PA 19123"
                  />
                </div>

                <div className="rounded-[24px] border border-white/14 bg-[rgba(247,251,255,0.08)] px-5 py-4 text-[#eef5fb] shadow-[0_18px_34px_rgba(16,31,44,0.14)]">
                  <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#9fc5d8]">
                    Your presence is enough
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#d8eff5]">
                    If you&apos;d like to celebrate with a gift, please consider a donation to CHOP Neurosurgery &
                    Neuro-Oncology.
                  </p>
                  <div className="mt-4">
                    <Button
                      asChild
                      className="h-11 rounded-[18px] bg-[#42a8a9] px-5 font-extrabold text-white hover:bg-[#369799]"
                    >
                      <Link href={donationUrl}>Donate to CHOP</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    asChild
                    size="lg"
                    className="h-14 rounded-[20px] bg-[#42a8a9] px-7 text-base font-extrabold text-white shadow-[0_18px_38px_rgba(27,56,77,0.26)] hover:bg-[#369799]"
                  >
                    <Link href="#rsvp">RSVP now</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="h-14 rounded-[20px] border-[#9fc5d8] bg-white/8 px-7 text-base font-bold text-[#f7fbff] hover:bg-white/12 hover:text-white"
                  >
                    <Link href={googleMapsUrl} target="_blank" rel="noreferrer">
                      Get directions
                    </Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#eef5fb] py-12 md:py-16">
          <div className="container px-4 md:px-6">
            <motion.div
              id="rsvp"
              className="mx-auto max-w-3xl rounded-[34px] border border-[#9fc5d8] bg-white shadow-[0_20px_40px_rgba(42,63,84,0.12)]"
              {...getRevealProps(prefersReducedMotion, { distance: 18 })}
            >
              <div className="border-b border-[#d8eff5] bg-[#f7fbff] px-6 py-5 md:px-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#42a8a9]">RSVP</p>
                <h2 className="mt-3 text-3xl leading-none text-[#223b54] sm:text-4xl">
                  Let the family know if you&apos;re coming.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#3f5d81]">
                  Share your name, how many people are in your party, and whether you&apos;re able to make it.
                </p>
              </div>

              <div className="px-6 py-6 md:px-8 md:py-8">
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <Label htmlFor="birthday-name" className="text-sm font-bold text-[#223b54]">
                      Your name
                    </Label>
                    <Input
                      id="birthday-name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder="Nate's biggest fan"
                      className="h-14 rounded-[20px] border-[#9fc5d8] bg-[#f7fbff] px-4 text-base text-[#223b54] placeholder:text-[#6f8ea4] focus-visible:ring-[#42a8a9]"
                      maxLength={80}
                      autoComplete="name"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthday-attendees" className="text-sm font-bold text-[#223b54]">
                      Number of attendees
                    </Label>
                    <Input
                      id="birthday-attendees"
                      type="number"
                      min={1}
                      max={12}
                      inputMode="numeric"
                      value={attendeeCount}
                      onChange={(event) => setAttendeeCount(event.target.value)}
                      className="h-14 rounded-[20px] border-[#9fc5d8] bg-[#f7fbff] px-4 text-base text-[#223b54] focus-visible:ring-[#42a8a9]"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-[#223b54]">Will your party be there?</Label>
                    <div className="grid gap-3">
                      {attendanceOptions.map((option) => {
                        const isSelected = attendance === option.value

                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setAttendance(option.value)}
                            disabled={isSubmitting}
                            className={cn(
                              "rounded-[24px] border p-4 text-left transition-[transform,background-color,border-color,box-shadow] duration-150 ease-snappy-out",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#42a8a9] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                              isSelected
                                ? "border-[#2f6272] bg-[#d8eff5] shadow-[0_10px_24px_rgba(66,168,169,0.18)]"
                                : "border-[#d8eff5] bg-[#f7fbff] hover:-translate-y-0.5 hover:border-[#9fc5d8] hover:bg-white",
                            )}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-base font-extrabold text-[#223b54]">{option.label}</p>
                                <p className="mt-1 text-sm leading-6 text-[#3f5d81]">{option.description}</p>
                              </div>
                              {isSelected ? <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#2f6272]" /> : null}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {submissionState ? (
                    <div
                      className={cn(
                        "rounded-[22px] border px-4 py-3 text-sm leading-6",
                        submissionState.tone === "success"
                          ? "border-[#bfe7dc] bg-[#ecfbf4] text-[#215b47]"
                          : "border-[#f3c2c2] bg-[#fff3f3] text-[#8a3333]",
                      )}
                    >
                      {submissionState.message}
                    </div>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-[20px] bg-[#42a8a9] text-base font-extrabold text-white shadow-[0_18px_32px_rgba(42,63,84,0.18)] hover:bg-[#369799]"
                  >
                    {isSubmitting ? "Sending RSVP..." : "Send RSVP"}
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#eef5fb] pb-14 md:pb-20">
          <div className="container px-4 md:px-6">
            <motion.div
              className="mx-auto max-w-5xl rounded-[34px] border border-[#9fc5d8] bg-white shadow-[0_20px_40px_rgba(42,63,84,0.12)]"
              {...getRevealProps(prefersReducedMotion, { distance: 18 })}
            >
              <div className="border-b border-[#d8eff5] px-6 py-5 md:px-8">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#42a8a9]">Location</p>
                <h2 className="mt-3 text-3xl leading-none text-[#223b54] sm:text-4xl">Craft Hall</h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#3f5d81]">
                  901 N Delaware Ave, Philadelphia, PA 19123. Use the live map below to get oriented before the
                  party.
                </p>
              </div>

              <div className="space-y-5 px-6 py-6 md:px-8 md:py-8">
                <div className="overflow-hidden rounded-[28px] border border-[#d8eff5] bg-[#eef5fb] shadow-[0_14px_30px_rgba(42,63,84,0.08)]">
                  <iframe
                    title="Map showing Craft Hall in Philadelphia"
                    src={googleMapsEmbedUrl}
                    className="h-[320px] w-full border-0 md:h-[380px]"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm leading-6 text-[#3f5d81]">
                    <p className="font-extrabold uppercase tracking-[0.2em] text-[#42a8a9]">Address</p>
                    <p className="mt-2 text-base font-semibold text-[#223b54]">Craft Hall</p>
                    <p>901 N Delaware Ave</p>
                    <p>Philadelphia, PA 19123</p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    className="h-12 rounded-[18px] border-[#9fc5d8] bg-[#f7fbff] px-5 font-bold text-[#223b54] hover:bg-white"
                  >
                    <Link href={googleMapsUrl} target="_blank" rel="noreferrer">
                      Open in Google Maps
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

interface EventMetaCardProps {
  icon: LucideIcon
  label: string
  title: string
  description: string
}

function EventMetaCard({ icon: Icon, label, title, description }: EventMetaCardProps) {
  return (
    <div className="rounded-[26px] border border-white/14 bg-[rgba(247,251,255,0.08)] p-5 shadow-[0_18px_34px_rgba(16,31,44,0.14)]">
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[20px] border border-white/14 bg-white/8 text-[#d8eff5]">
          <Icon className="h-5 w-5" />
        </div>

        <div className="space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#9fc5d8]">{label}</p>
          <p className="text-xl leading-tight text-white sm:text-2xl">{title}</p>
          <p className="text-sm leading-6 text-[#d8eff5]">{description}</p>
        </div>
      </div>
    </div>
  )
}
