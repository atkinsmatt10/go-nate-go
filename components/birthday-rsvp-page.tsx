"use client"

import Image from "next/image"
import Link from "next/link"
import { type ComponentType, FormEvent, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { CalendarDays, CheckCircle2, MapPin, PartyPopper } from "lucide-react"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPageRevealProps, getRevealProps, getScaleInProps } from "@/lib/motion"
import { cn } from "@/lib/utils"

type AttendanceValue = "yes" | "no" | ""

interface SubmissionState {
  tone: "success" | "error"
  message: string
}

const posterImage = "/birthday-poster-card.png"
const googleMapsUrl = "https://maps.google.com/?q=Craft+Hall+901+N+Delaware+Ave+Philadelphia+PA+19123"
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
        <section className="relative isolate">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(66,168,169,0.32),_transparent_38%),linear-gradient(180deg,_#2a3f54_0%,_#355270_100%)]" />
          <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_center,_rgba(247,251,255,0.14),_transparent_65%)]" />

          <div className="container relative px-4 py-10 md:px-6 md:py-16">
            <motion.div
              className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14"
              {...getPageRevealProps(prefersReducedMotion, { distance: 0, duration: 0.24 })}
            >
              <motion.div
                className="order-2 lg:order-1"
                {...getRevealProps(prefersReducedMotion, { delay: 0.04, distance: 20 })}
              >
                <div className="mx-auto max-w-xl space-y-6 text-center lg:text-left">
                  <Badge className="mx-auto w-fit rounded-full border border-[#9fc5d8] bg-[#d8eff5] px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#223b54] lg:mx-0">
                    Nate turns one on May 9, 2026
                  </Badge>

                  <div className="space-y-4">
                    <h1 className="text-4xl leading-none text-white sm:text-5xl md:text-6xl">
                      One tough cookie is turning one.
                    </h1>
                    <p className="max-w-xl text-base leading-7 text-[#eef5fb] sm:text-lg">
                      Join us for Nate the Great&apos;s first birthday celebration at Craft Hall. We kept the page warm,
                      simple, and easy to trust, just like the rest of Go Nate Go.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <EventStat icon={CalendarDays} label="When" value="Saturday, May 9, 2026" />
                    <EventStat icon={PartyPopper} label="Time" value="12 PM to 3 PM" />
                    <EventStat icon={MapPin} label="Where" value="Craft Hall" />
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
                    <Button
                      asChild
                      size="lg"
                      className="h-14 rounded-[20px] bg-[#42a8a9] px-7 text-base font-extrabold text-white shadow-[0_18px_38px_rgba(27,56,77,0.3)] hover:bg-[#369799]"
                    >
                      <Link href="#rsvp">RSVP now</Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-14 rounded-[20px] border-[#9fc5d8] bg-white/10 px-7 text-base font-bold text-[#f7fbff] hover:bg-white/15 hover:text-white"
                    >
                      <Link href={googleMapsUrl} target="_blank" rel="noreferrer">
                        Get directions
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="order-1 lg:order-2"
                {...getScaleInProps(prefersReducedMotion, { delay: 0.08, duration: 0.28, scale: 0.98 })}
              >
                <div className="mx-auto max-w-md rounded-[32px] border border-white/35 bg-[#f7f1e7] p-4 shadow-[0_28px_60px_rgba(18,35,49,0.32)]">
                  <div className="overflow-hidden rounded-[26px] border border-[#eadfc8] bg-[#fffaf2]">
                    <Image
                      src={posterImage}
                      alt="Nate the Great first birthday invitation poster"
                      width={1024}
                      height={1536}
                      className="h-auto w-full"
                      priority
                    />
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#eef5fb] py-12 md:py-16">
          <div className="container grid gap-8 px-4 md:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <motion.div className="space-y-5" {...getRevealProps(prefersReducedMotion, { distance: 20 })}>
              <div className="space-y-3">
                <Badge className="rounded-full border border-[#9fc5d8] bg-white px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#3f5d81]">
                  Event details
                </Badge>
                <h2 className="text-3xl leading-none text-[#223b54] sm:text-4xl">Craft Hall, cookies, and a room full of people who love Nate.</h2>
                <p className="max-w-xl text-base leading-7 text-[#3f5d81]">
                  The party is at Craft Hall, 901 N Delaware Ave, Philadelphia, PA 19123. The invite asks for no gifts.
                  If you want to honor Nate, the family suggests a donation to CHOP Neurosurgery & Neuro-Oncology instead.
                </p>
              </div>

              <div className="rounded-[30px] border border-[#d8eff5] bg-white p-6 shadow-[0_16px_30px_rgba(42,63,84,0.08)]">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#42a8a9]">Venue</p>
                    <p className="mt-2 text-2xl text-[#223b54]">Craft Hall</p>
                    <p className="mt-1 text-sm leading-6 text-[#3f5d81]">901 N Delaware Ave<br />Philadelphia, PA 19123</p>
                  </div>
                  <div className="h-px bg-[#d8eff5]" />
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#42a8a9]">Gift note</p>
                    <p className="mt-2 text-sm leading-6 text-[#3f5d81]">
                      No gifts please. In lieu of gifts, consider a donation to CHOP Neurosurgery & Neuro-Oncology.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button asChild className="h-12 rounded-[18px] bg-[#42a8a9] px-5 font-extrabold text-white hover:bg-[#369799]">
                      <Link href={donationUrl}>Donate to CHOP</Link>
                    </Button>
                    <Button asChild variant="outline" className="h-12 rounded-[18px] border-[#9fc5d8] bg-[#f7fbff] px-5 font-bold text-[#223b54] hover:bg-white">
                      <Link href={googleMapsUrl} target="_blank" rel="noreferrer">
                        Open in maps
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              id="rsvp"
              className="rounded-[32px] border border-[#9fc5d8] bg-white p-6 shadow-[0_18px_36px_rgba(42,63,84,0.12)] md:p-8"
              {...getRevealProps(prefersReducedMotion, { delay: 0.06, distance: 18 })}
            >
              <div className="space-y-2">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#42a8a9]">RSVP</p>
                <h2 className="text-3xl leading-none text-[#223b54] sm:text-4xl">Let the family know if you&apos;re coming.</h2>
                <p className="text-sm leading-6 text-[#3f5d81]">
                  Share your name, how many people are in your party, and whether you&apos;re able to make it.
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

interface EventStatProps {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}

function EventStat({ icon: Icon, label, value }: EventStatProps) {
  return (
    <div className="rounded-[24px] border border-white/15 bg-white/10 p-4 text-left backdrop-blur-sm">
      <div className="flex items-center gap-2 text-[#d8eff5]">
        <Icon className="h-4 w-4" />
        <p className="text-xs font-extrabold uppercase tracking-[0.22em]">{label}</p>
      </div>
      <p className="mt-3 text-sm font-semibold leading-6 text-white">{value}</p>
    </div>
  )
}
