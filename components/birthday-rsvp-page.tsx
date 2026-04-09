"use client"

import Image from "next/image"
import Link from "next/link"
import { type MouseEvent, FormEvent, useState } from "react"
import { motion, useMotionTemplate, useReducedMotion, useSpring } from "framer-motion"
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

const coverImage = "/nate shark.png"
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
                onMouseMove={handleCoverPointerMove}
                onMouseLeave={handleCoverPointerLeave}
              >
                <div className="relative aspect-[6/5] overflow-hidden bg-[linear-gradient(135deg,#4d7093_0%,#2a3f54_46%,#25485d_100%)] sm:aspect-[16/10] lg:aspect-[16/8]">
                  <motion.div className="absolute inset-0" style={{ backgroundImage: coverGlow }} />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(216,239,245,0.24),transparent_24%),radial-gradient(circle_at_84%_18%,rgba(66,168,169,0.24),transparent_26%),radial-gradient(circle_at_52%_82%,rgba(247,251,255,0.08),transparent_32%)]" />

                  <div className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-[rgba(247,251,255,0.12)] px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f7fbff] backdrop-blur-sm">
                    Nate&apos;s birthday shark
                  </div>

                  <motion.div
                    className="absolute inset-0 [transform-style:preserve-3d]"
                    style={{
                      rotateX: coverRotateX,
                      rotateY: coverRotateY,
                      x: coverTranslateX,
                      y: coverTranslateY,
                      transformPerspective: 1400,
                    }}
                  >
                    <div className="absolute inset-x-[6%] bottom-[-4%] top-[8%]">
                      <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle_at_center,rgba(66,168,169,0.34),transparent_58%)] blur-3xl" />
                      <Image
                        src={coverImage}
                        alt="Nate the Great shark eating a cookie"
                        fill
                        className="object-contain drop-shadow-[0_32px_54px_rgba(15,34,47,0.36)]"
                        priority
                      />
                    </div>
                  </motion.div>

                  <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(20,35,47,0)_0%,rgba(20,35,47,0.24)_100%)]" />
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

                <div className="grid gap-3 grid-cols-2">
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
    <div className="rounded-[24px] border border-white/14 bg-[rgba(247,251,255,0.08)] p-3 shadow-[0_18px_34px_rgba(16,31,44,0.14)] sm:p-5">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/14 bg-white/8 text-[#d8eff5] sm:h-14 sm:w-14 sm:rounded-[20px]">
          <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>

        <div className="min-w-0 space-y-1.5 sm:space-y-2">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#9fc5d8]">{label}</p>
          <p className="text-lg leading-tight text-white sm:text-2xl">{title}</p>
          <p className="text-sm leading-5 text-[#d8eff5] sm:leading-6">{description}</p>
        </div>
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
        d="M35 148C48 113 70 67 96 54C110 47 124 58 118 79C111 102 91 133 81 157C75 171 90 167 101 153C126 121 152 88 180 60C191 49 214 36 223 46C232 56 217 84 205 99C188 120 167 138 149 156C141 164 152 162 165 155C188 142 215 127 240 118C248 115 257 113 265 113"
        delay={0}
        duration={1.2}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M286 118C298 118 307 110 315 101C323 92 332 73 322 67C311 60 292 79 286 90C276 111 286 144 305 144C329 144 348 123 360 106C368 94 379 70 370 63C359 55 340 76 334 88C323 110 332 143 351 143C374 143 399 120 421 96"
        delay={0.92}
        duration={1.05}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M434 99C450 84 470 63 491 54C503 49 513 58 507 72C498 94 472 126 461 149C455 162 469 157 478 149C503 129 532 95 559 73C571 63 591 51 604 56C621 62 617 84 608 97C590 125 561 145 536 159C526 164 515 170 506 178"
        delay={1.76}
        duration={1.2}
        prefersReducedMotion={prefersReducedMotion}
      />
      <SignatureStroke
        d="M470 177C511 187 557 191 604 190C641 189 669 184 694 177"
        delay={2.72}
        duration={0.9}
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
