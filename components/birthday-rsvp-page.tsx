"use client"

import Image from "next/image"
import Link from "next/link"
import { type FormEvent, type MouseEvent, type ReactNode, useEffect, useState } from "react"
import { motion, useMotionTemplate, useReducedMotion, useSpring } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  MapPin,
  type LucideIcon,
} from "lucide-react"
import { Footer } from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { CountdownFlippingBoard } from "@/components/ui/countdown-flipping-board"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getPageRevealProps, getRevealProps } from "@/lib/motion"
import { cn } from "@/lib/utils"

type AttendanceValue = "yes" | "no" | ""

interface SubmissionState {
  tone: "success" | "error"
  message: string
}

const coverImage = "/01KK50NH25Q9J200T43XRW1K6V.png"
const googleMapsUrl = "https://maps.google.com/?q=Craft+Hall+901+N+Delaware+Ave+Philadelphia+PA+19123"
const googleMapsEmbedUrl =
  "https://www.google.com/maps?q=Craft+Hall+901+N+Delaware+Ave+Philadelphia+PA+19123&z=15&output=embed"
const birthdayAccent = "#F2C66D"
const birthdayAccentSoft = "#FFF1C2"
const birthdayAccentDeep = "#E2A94A"
const birthdayCalendarTitle = "Nate is One Tough Cookie Birthday Party"
const birthdayCalendarDescription = "Celebrate Nate's first birthday at Craft Hall in Philadelphia."
const birthdayCalendarLocation = "Craft Hall, 901 N Delaware Ave, Philadelphia, PA 19123"
const birthdayCalendarStart = "2026-05-09T12:00:00-04:00"
const birthdayCalendarEnd = "2026-05-09T15:00:00-04:00"
const attendanceOptions = [
  { value: "yes", label: "We’ll be there", description: "Save some seats and cookies for us." },
  { value: "no", label: "Can’t make it", description: "We’ll be cheering Nate on from afar." },
] as const
const birthdayGalleryPhotos = [
  {
    src: "/Nate-image.png",
    alt: "Nate in a pale green sleeper and hat, wide-eyed and cozy",
    caption: "Wide-eyed and cozy at home.",
  },
  {
    src: "/Nicole baby park.png",
    alt: "Nate sleeping in Nicole's arms outdoors",
    caption: "Fresh-air snuggles with mom.",
  },
  {
    src: "/IMG_9609.png",
    alt: "Nate resting on a striped hospital blanket",
    caption: "Tiny but already tough.",
  },
  {
    src: "/IMG_9684.png",
    alt: "Nate sleeping while swaddled shortly after birth",
    caption: "A very peaceful first nap.",
  },
  {
    src: "/IMG_9908.png",
    alt: "Nate lying on a couch in a blue sleeper and looking toward the camera",
    caption: "Stillness, curiosity, and big eyes.",
  },
] as const

function formatCalendarDateForGoogle(dateValue: string): string {
  return new Date(dateValue).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function buildGoogleCalendarUrl(): string {
  const searchParams = new URLSearchParams({
    action: "TEMPLATE",
    text: birthdayCalendarTitle,
    details: birthdayCalendarDescription,
    location: birthdayCalendarLocation,
    dates: `${formatCalendarDateForGoogle(birthdayCalendarStart)}/${formatCalendarDateForGoogle(birthdayCalendarEnd)}`,
    ctz: "America/New_York",
  })

  return `https://calendar.google.com/calendar/render?${searchParams.toString()}`
}

function buildOutlookCalendarUrl(): string {
  const searchParams = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: birthdayCalendarTitle,
    body: birthdayCalendarDescription,
    location: birthdayCalendarLocation,
    startdt: birthdayCalendarStart,
    enddt: birthdayCalendarEnd,
  })

  return `https://outlook.live.com/calendar/0/deeplink/compose?${searchParams.toString()}`
}

function BirthdayCalendarActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 p-0 text-sm font-semibold leading-5 text-[#f8e7b4] underline decoration-[#f2c66d]/80 underline-offset-4 transition-colors duration-150 ease-snappy-out hover:text-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#f2c66d] focus-visible:ring-offset-2 focus-visible:ring-offset-[#304a67]"
        >
          <span>Add to calendar</span>
          <ArrowUpRight className="size-3.5 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-60 rounded-[20px] border-[#9fc5d8] bg-[#f7fbff] p-2 text-[#223b54] shadow-[0_20px_36px_rgba(42,63,84,0.18)]"
      >
        <DropdownMenuLabel className="px-3 pb-1 pt-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#3f5d81]">
          Add to calendar
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#d8eff5]" />
        <DropdownMenuItem asChild className="rounded-[14px] px-3 py-2.5 focus:bg-[#eef5fb] focus:text-[#223b54]">
          <a href={buildGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4 text-[#42a8a9]" />
            Google Calendar
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-[14px] px-3 py-2.5 focus:bg-[#eef5fb] focus:text-[#223b54]">
          <a href={buildOutlookCalendarUrl()} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4 text-[#42a8a9]" />
            Outlook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="rounded-[14px] px-3 py-2.5 focus:bg-[#eef5fb] focus:text-[#223b54]">
          <a href="/nate-first-birthday.ics">
            <Download className="size-4 text-[#42a8a9]" />
            Apple Calendar / .ics
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function BirthdayRsvpPage() {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [attendeeCount, setAttendeeCount] = useState("1")
  const [attendance, setAttendance] = useState<AttendanceValue>("")
  const [submissionState, setSubmissionState] = useState<SubmissionState | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const coverRotateX = useSpring(0, { stiffness: 180, damping: 20, mass: 0.4 })
  const coverRotateY = useSpring(0, { stiffness: 180, damping: 20, mass: 0.4 })
  const coverTranslateX = useSpring(0, { stiffness: 180, damping: 20, mass: 0.4 })
  const coverTranslateY = useSpring(0, { stiffness: 180, damping: 20, mass: 0.4 })
  const coverGlowX = useSpring(50, { stiffness: 160, damping: 24, mass: 0.5 })
  const coverGlowY = useSpring(28, { stiffness: 160, damping: 24, mass: 0.5 })
  const coverGlow = useMotionTemplate`radial-gradient(circle at ${coverGlowX}% ${coverGlowY}%, rgba(247,251,255,0.38), transparent 28%)`

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmissionState(null)

    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
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

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setSubmissionState({
        tone: "error",
        message: "Enter a valid email address if you’d like a confirmation and reminder.",
      })
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
          email: trimmedEmail,
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
            ? trimmedEmail
              ? `Thanks, ${trimmedName}. We’ve got you down for ${parsedAttendeeCount} guest${parsedAttendeeCount === 1 ? "" : "s"}, and we’ll send a confirmation now plus a reminder closer to the party.`
              : `Thanks, ${trimmedName}. We’ve got you down for ${parsedAttendeeCount} guest${parsedAttendeeCount === 1 ? "" : "s"} and can’t wait to celebrate with you.`
            : trimmedEmail
              ? `Thanks, ${trimmedName}. We’ll miss you, and we’ve sent a quick confirmation to your inbox.`
              : `Thanks, ${trimmedName}. We’ll miss you and really appreciate the heads up.`,
      })
      setName("")
      setEmail("")
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

  const handleCoverPointerMove = (event: MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) {
      return
    }

    const rect = event.currentTarget.getBoundingClientRect()
    const pointerX = (event.clientX - rect.left) / rect.width
    const pointerY = (event.clientY - rect.top) / rect.height
    const normalizedX = pointerX - 0.5
    const normalizedY = pointerY - 0.5

    coverRotateX.set(-normalizedY * 18)
    coverRotateY.set(normalizedX * 22)
    coverTranslateX.set(normalizedX * 16)
    coverTranslateY.set(normalizedY * 12)
    coverGlowX.set(pointerX * 100)
    coverGlowY.set(pointerY * 100)
  }

  const handleCoverPointerLeave = () => {
    coverRotateX.set(0)
    coverRotateY.set(0)
    coverTranslateX.set(0)
    coverTranslateY.set(0)
    coverGlowX.set(50)
    coverGlowY.set(28)
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <main className="overflow-hidden">
        <section className="relative isolate bg-[linear-gradient(180deg,#2a3f54_0%,#304a67_100%)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(242,198,109,0.24),transparent_38%),radial-gradient(circle_at_85%_12%,rgba(247,251,255,0.12),transparent_22%),radial-gradient(circle_at_18%_22%,rgba(255,241,194,0.18),transparent_18%)]" />

          <div className="container relative px-4 py-8 md:px-6 md:py-12 lg:py-14">
            <motion.div
              className="mx-auto max-w-5xl space-y-8"
              {...getPageRevealProps(prefersReducedMotion, { distance: 0, duration: 0.24 })}
            >
              <CountdownFlippingBoard className="mx-auto w-full max-w-5xl pt-2" />

              <motion.div
                className="relative"
                {...getRevealProps(prefersReducedMotion, { delay: 0.04, distance: 18 })}
                onMouseMove={handleCoverPointerMove}
                onMouseLeave={handleCoverPointerLeave}
              >
                <div className="relative aspect-6/5 overflow-hidden sm:aspect-16/10 lg:aspect-16/8">
                  <motion.div className="absolute inset-0" style={{ backgroundImage: coverGlow }} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(255,241,194,0.24),transparent_22%),radial-gradient(circle_at_84%_18%,rgba(242,198,109,0.2),transparent_24%),radial-gradient(circle_at_52%_82%,rgba(247,251,255,0.08),transparent_30%)]" />

                  <motion.div
                    className="absolute inset-0 transform-3d"
                    style={{
                      rotateX: coverRotateX,
                      rotateY: coverRotateY,
                      x: coverTranslateX,
                      y: coverTranslateY,
                      transformPerspective: 1400,
                    }}
                  >
                    <div className="absolute inset-x-[8%] bottom-[4%] top-[6%] sm:inset-x-[12%] sm:bottom-[6%] sm:top-[10%] lg:inset-x-[15%] lg:bottom-[8%] lg:top-[10%]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(242,198,109,0.32),transparent_56%)] blur-3xl" />
                      <Image
                        src={coverImage}
                        alt="Nate the Great shark eating a cookie"
                        fill
                        className="object-contain drop-shadow-[0_36px_60px_rgba(15,34,47,0.38)]"
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 45vw, 420px"
                        priority
                      />
                    </div>
                  </motion.div>

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(20,35,47,0)_0%,rgba(20,35,47,0.18)_100%)]" />
                </div>
              </motion.div>

              <motion.div className="space-y-6" {...getRevealProps(prefersReducedMotion, { delay: 0.08, distance: 18 })}>
                <div className="space-y-4">
                  <Badge
                    className="w-fit rounded-full border px-4 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.24em] text-[#223b54] shadow-[0_12px_24px_rgba(242,198,109,0.16)]"
                    style={{
                      borderColor: "rgba(242,198,109,0.7)",
                      background: "linear-gradient(135deg, rgba(255,241,194,0.98), rgba(242,198,109,0.96))",
                    }}
                  >
                    First birthday party
                  </Badge>

                  <div className="space-y-3">
                    <h1 className="max-w-3xl text-4xl leading-[0.96] text-white sm:text-5xl md:text-6xl">
                      Nate is one tough cookie, and he&apos;s turning one.
                    </h1>
                    <p className="max-w-2xl text-base leading-7 text-[#eef5fb] sm:text-lg">
                      We&apos;d love to celebrate with you at Craft Hall in Philadelphia.
                    </p>
                  </div>
                </div>
                <div className="grid gap-5 border-y border-white/10 py-5 md:grid-cols-2 md:gap-8 md:py-6">
                  <EventMetaRow
                    icon={CalendarDays}
                    label="Date & time"
                    title="Saturday, May 9, 2026"
                    description="12 PM to 3 PM"
                    descriptionAction={<BirthdayCalendarActions />}
                  >
                  </EventMetaRow>
                  <EventMetaRow
                    icon={MapPin}
                    label="Location"
                    title="Craft Hall"
                    description="901 N Delaware Ave, Philadelphia, PA 19123"
                  />
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
                  Let us know if you&apos;ll be there.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#3f5d81]">
                  Share your name, how many are coming with you, and whether we should save your crew a spot.
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
                      placeholder="Your name"
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

                  <div className="space-y-2">
                    <Label htmlFor="birthday-email" className="text-sm font-bold text-[#223b54]">
                      Email
                      <span className="ml-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#42a8a9]">
                        Optional
                      </span>
                    </Label>
                    <Input
                      id="birthday-email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="h-14 rounded-[20px] border-[#9fc5d8] bg-[#f7fbff] px-4 text-base text-[#223b54] placeholder:text-[#6f8ea4] focus-visible:ring-[#42a8a9]"
                      maxLength={160}
                      autoComplete="email"
                      disabled={isSubmitting}
                    />
                    <p className="text-sm leading-6 text-[#3f5d81]">
                      For a reminder before the party.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-bold text-[#223b54]">Will you be celebrating with us?</Label>
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
                              "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#42a8a9] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
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

                  <div className="rounded-[22px] border border-[#d8eff5] bg-[#f7fbff] px-4 py-4 text-center">
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#42a8a9]">
                      Your presence is enough
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[#3f5d81]">
                      If you&apos;d like to celebrate with a gift, please consider a{" "}
                      <Link href="/donate" className="font-bold text-[#2f6272] underline decoration-[#42a8a9]/50 underline-offset-4">
                        donation to CHOP Neurosurgery & Neuro-Oncology
                      </Link>
                      .
                    </p>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="h-14 w-full rounded-[20px] text-base font-extrabold text-[#223b54] shadow-[0_18px_32px_rgba(242,198,109,0.22)] transition-[transform,filter,box-shadow] duration-200 ease-snappy-out hover:brightness-105"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${birthdayAccentSoft} 0%, ${birthdayAccent} 54%, ${birthdayAccentDeep} 100%)`,
                    }}
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
                  This is where we&apos;ll be celebrating. Take a quick look at the map before the party.
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
                    className="h-12 rounded-[18px] border-[#d8eff5] bg-[#f7fbff] px-5 font-bold text-[#223b54] hover:border-[#f2c66d] hover:bg-white"
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

        <section className="bg-[#eef5fb] pb-16 md:pb-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              {...getRevealProps(prefersReducedMotion, { distance: 16 })}
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-[#42a8a9]">With love</p>
              <div className="mt-6 rounded-[30px] border border-[#d8eff5] bg-white px-6 py-8 shadow-[0_18px_36px_rgba(42,63,84,0.1)] md:px-10">
                <BirthdaySignature />
                <p className="mt-4 text-sm font-semibold tracking-[0.22em] text-[#3f5d81]">
                  Nate the Great
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-[#eef5fb] pb-16 md:pb-24">
          <div className="container px-4 md:px-6">
            <motion.div
              className="mx-auto max-w-5xl"
              {...getRevealProps(prefersReducedMotion, { distance: 18 })}
            >
              <BirthdayPhotoCarousel />
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

interface EventMetaRowProps {
  icon: LucideIcon
  label: string
  title: string
  description: string
  descriptionAction?: ReactNode
}

function EventMetaRow({ icon: Icon, label, title, description, descriptionAction }: EventMetaRowProps) {
  return (
    <div className="flex items-start gap-3 md:gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/14 bg-white/8 text-[#f8e7b4] shadow-[0_12px_24px_rgba(16,31,44,0.14)] sm:h-14 sm:w-14 sm:rounded-[20px]">
        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
      </div>

      <div className="min-w-0 space-y-1.5">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f8e7b4] sm:text-xs">
          {label}
        </p>
        <p className="text-xl leading-tight text-white sm:text-[2rem]">{title}</p>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <p className="text-sm leading-5 text-[#d8eff5] sm:text-base sm:leading-6">{description}</p>
          {descriptionAction}
        </div>
      </div>
    </div>
  )
}

function BirthdayPhotoCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    const syncSlide = () => {
      setCurrentSlide(api.selectedScrollSnap())
    }

    syncSlide()
    api.on("select", syncSlide)
    api.on("reInit", syncSlide)

    return () => {
      api.off("select", syncSlide)
      api.off("reInit", syncSlide)
    }
  }, [api])

  return (
    <div className="space-y-5">
      <Carousel setApi={setApi} opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent>
          {birthdayGalleryPhotos.map((photo) => (
            <CarouselItem key={photo.src} className="basis-[88%] md:basis-[72%] lg:basis-[58%]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-[#d8eff5] shadow-[0_22px_40px_rgba(42,63,84,0.16)]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 72vw, 58vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full border-[#9fc5d8] bg-white/90 text-[#223b54] hover:border-[#42a8a9] hover:bg-white"
          onClick={() => api?.scrollPrev()}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous photo</span>
        </Button>

        <div className="flex items-center gap-2">
          {birthdayGalleryPhotos.map((photo, index) => (
            <span
              key={photo.src}
              className={cn(
                "h-2.5 rounded-full transition-all duration-200 ease-snappy-out",
                index === currentSlide ? "w-7 bg-[#42a8a9]" : "w-2.5 bg-[#c8dfea]",
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full border-[#9fc5d8] bg-white/90 text-[#223b54] hover:border-[#42a8a9] hover:bg-white"
          onClick={() => api?.scrollNext()}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next photo</span>
        </Button>
      </div>
    </div>
  )
}

function BirthdaySignature() {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <motion.svg
      viewBox="0 0 720 210"
      fill="none"
      className="mx-auto h-auto w-full max-w-[560px] overflow-visible text-[#2f6272] drop-shadow-[0_10px_18px_rgba(42,63,84,0.14)]"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.7 }}
    >
      <SignatureStroke
        d="M78 154C88 118 102 86 118 65C126 55 138 53 145 61C151 68 151 83 148 100C143 122 133 144 129 156C143 141 159 123 178 103C200 81 221 61 237 61C247 61 253 71 250 82C244 103 233 127 224 155"
        delay={0}
        duration={0.96}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M248 131C260 113 278 104 294 107C307 109 313 121 309 134C305 147 293 154 280 153C267 152 258 143 258 131C258 115 272 93 290 89C313 84 329 99 327 123C325 142 318 154 314 159"
        delay={0.72}
        duration={0.8}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M366 84C377 72 390 63 402 61C410 60 415 66 414 75C412 87 405 103 400 121C395 139 393 151 397 157C403 164 417 160 432 151C444 144 454 135 463 124"
        delay={1.34}
        duration={0.72}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M358 99C377 97 395 94 415 91"
        delay={1.88}
        duration={0.32}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M479 130C492 111 510 103 525 105C537 106 543 116 540 126C535 140 519 146 506 146C490 145 483 134 483 122C483 101 501 83 526 80C551 77 572 90 589 109C606 127 624 144 655 151"
        delay={2.08}
        duration={0.88}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M505 163C546 171 592 173 656 165"
        delay={2.74}
        duration={0.54}
        prefersReducedMotion={prefersReducedMotion}
      />
    </motion.svg>
  )
}

interface SignatureStrokeProps {
  d: string
  delay: number
  duration: number
  prefersReducedMotion: boolean
}

function SignatureStroke({ d, delay, duration, prefersReducedMotion }: SignatureStrokeProps) {
  return (
    <motion.path
      d={d}
      stroke="currentColor"
      strokeWidth="7"
      strokeLinecap="round"
      strokeLinejoin="round"
      variants={{
        initial: {
          opacity: prefersReducedMotion ? 1 : 0,
          pathLength: prefersReducedMotion ? 1 : 0,
        },
        animate: {
          opacity: 1,
          pathLength: 1,
          transition: prefersReducedMotion
            ? { duration: 0.01 }
            : {
                opacity: { duration: 0.01, delay },
                pathLength: { duration, delay, ease: [0.35, 0, 0.25, 1] },
              },
        },
      }}
    />
  )
}
