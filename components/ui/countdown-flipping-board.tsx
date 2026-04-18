"use client"

import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { SplitFlapCell } from "@/components/ui/text-flipping-board"
import { cn } from "@/lib/utils"

interface CountdownParts {
  days: string
  hours: string
  minutes: string
  seconds: string
}

interface CountdownSnapshot {
  hourBucket: number
  isBirthday: boolean
  parts: CountdownParts
}

interface CountdownFlippingBoardProps {
  className?: string
}

interface CountdownSegment {
  label: string
  value: string
}

function getBirthdayCountdown(now: Date): CountdownSnapshot {
  const month = now.getMonth()
  const day = now.getDate()

  if (month === 4 && day === 2) {
    return {
      hourBucket: 0,
      isBirthday: true,
      parts: {
        days: "000",
        hours: "00",
        minutes: "00",
        seconds: "00",
      },
    }
  }

  const targetYear = month > 4 || (month === 4 && day > 2) ? now.getFullYear() + 1 : now.getFullYear()
  const targetDate = new Date(targetYear, 4, 2, 0, 0, 0, 0)
  const differenceInSeconds = Math.max(Math.floor((targetDate.getTime() - now.getTime()) / 1000), 0)

  return {
    hourBucket: Math.floor(differenceInSeconds / 3600),
    isBirthday: false,
    parts: {
      days: String(Math.floor(differenceInSeconds / 86400)).padStart(3, "0"),
      hours: String(Math.floor((differenceInSeconds % 86400) / 3600)).padStart(2, "0"),
      minutes: String(Math.floor((differenceInSeconds % 3600) / 60)).padStart(2, "0"),
      seconds: String(differenceInSeconds % 60).padStart(2, "0"),
    },
  }
}

function getSegments(parts: CountdownParts): readonly CountdownSegment[] {
  return [
    { label: "Days", value: parts.days },
    { label: "Hours", value: parts.hours },
    { label: "Minutes", value: parts.minutes },
    { label: "Seconds", value: parts.seconds },
  ]
}

export function CountdownFlippingBoard({ className }: CountdownFlippingBoardProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [countdown, setCountdown] = useState<CountdownSnapshot>(() => getBirthdayCountdown(new Date()))
  const [pulseKey, setPulseKey] = useState(0)
  const [chaosMode, setChaosMode] = useState(false)
  const previousHourBucketRef = useRef<number | null>(null)

  useEffect(() => {
    const updateCountdown = () => {
      const nextSnapshot = getBirthdayCountdown(new Date())

      if (
        previousHourBucketRef.current !== null &&
        previousHourBucketRef.current !== nextSnapshot.hourBucket &&
        !nextSnapshot.isBirthday
      ) {
        setChaosMode(true)
        setPulseKey((current) => current + 1)
      }

      previousHourBucketRef.current = nextSnapshot.hourBucket
      setCountdown(nextSnapshot)
    }

    updateCountdown()
    const intervalId = window.setInterval(updateCountdown, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [])

  useEffect(() => {
    if (!chaosMode) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      setChaosMode(false)
    }, prefersReducedMotion ? 500 : 1600)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [chaosMode, prefersReducedMotion])

  const segments = getSegments(countdown.parts)

  return (
    <motion.div
      className={cn("flex flex-col items-center gap-4 text-center", className)}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
      whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5, margin: "-24px" }}
      transition={{ duration: prefersReducedMotion ? 0.18 : 0.32, ease: [0.23, 1, 0.32, 1] }}
    >
      {countdown.isBirthday ? (
        <div className="max-w-2xl rounded-[28px] border border-[#cfe3f0] bg-white px-6 py-6 shadow-[0_18px_44px_rgba(42,63,84,0.12)]">
          <p className="text-2xl text-[#223b54] sm:text-3xl">Happy Birthday, Nate.</p>
          <p className="mt-3 text-base leading-7 text-[#4f667b]">
            Today is for celebrating one very tough cookie and everyone who helped him get here.
          </p>
        </div>
      ) : (
        <div className="w-full max-w-5xl px-1 sm:px-0">
          <div className="flex flex-nowrap items-start justify-center gap-1 sm:gap-4 md:gap-5">
            {segments.map((segment, segmentIndex) => (
              <motion.div
                key={segment.label}
                className="flex min-w-0 flex-col items-center gap-1.5 sm:gap-3"
                animate={
                  prefersReducedMotion || !chaosMode
                    ? undefined
                    : {
                        rotate: [0, segmentIndex % 2 === 0 ? -1.8 : 1.8, 0],
                        y: [0, -5, 0],
                        scale: [1, 1.03, 1],
                      }
                }
                transition={{
                  duration: 0.95,
                  delay: segmentIndex * 0.05,
                  ease: [0.23, 1, 0.32, 1],
                }}
              >
                <div className="rounded-[14px] border border-white/10 bg-[#1a3650] p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] sm:rounded-[22px] sm:p-2.5">
                  <div className="flex gap-0.5 sm:gap-2">
                    {segment.value.split("").map((digit, digitIndex) => (
                      <SplitFlapCell
                        key={`${segment.label}-${digitIndex}`}
                        target={digit}
                        pulseKey={pulseKey}
                        chaosMode={chaosMode}
                        delay={segmentIndex * 70 + digitIndex * 22}
                        stepMs={chaosMode ? 34 : 0}
                        flipDuration={chaosMode ? 0.22 : 0.24}
                        className="w-[1.375rem] sm:w-11 md:w-12"
                        characterClassName="text-[0.85rem] sm:text-[clamp(1.25rem,3vw,2rem)]"
                      />
                    ))}
                  </div>
                </div>
                <span className="text-[8px] font-extrabold uppercase tracking-[0.18em] text-[#b9d0e1] sm:text-[10px] sm:tracking-[0.24em]">
                  {segment.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
