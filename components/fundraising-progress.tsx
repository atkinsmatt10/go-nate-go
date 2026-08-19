"use client"

import type { JSX } from "react"
import { useRef, useSyncExternalStore } from "react"
import NumberFlow, { type Format } from "@number-flow/react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import useSWR from "swr"

import { Button } from "@/components/ui/button"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { FALLBACK_DONATION_PROGRESS, type DonationProgressData } from "@/lib/donation-progress"

interface FundraisingProgressProps {
  initialData?: DonationProgressData
}

const NUMBER_FORMAT: Format = {
  maximumFractionDigits: 0,
  useGrouping: true,
}
const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
  currency: "USD",
  maximumFractionDigits: 0,
  style: "currency",
})

function subscribeToHydration(): () => void {
  return () => undefined
}

async function fetchDonationProgress(url: string): Promise<DonationProgressData> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Donation API request failed with status ${response.status}`)
  }

  return response.json() as Promise<DonationProgressData>
}

function getProgressPercentage(raised: number, goal: number): number {
  if (goal <= 0) {
    return 0
  }

  return Math.min(Math.max((raised / goal) * 100, 0), 100)
}

function getDonationStatusMessage(hasError: boolean, isLoading: boolean): string {
  if (hasError) {
    return "Live total unavailable — showing recent campaign values."
  }

  if (isLoading) {
    return "Updating the live fundraising total."
  }

  return "Live fundraising total updated."
}

export function FundraisingProgress({ initialData }: FundraisingProgressProps = {}): JSX.Element {
  const sectionRef = useRef<HTMLElement | null>(null)
  const hasHydrated = useSyncExternalStore(subscribeToHydration, () => true, () => false)
  const isInView = useInView(sectionRef, { amount: 0.25, once: true })
  const prefersReducedMotion = usePrefersReducedMotion()
  const { data, error, isLoading } = useSWR<DonationProgressData, Error>(
    "/api/donations",
    fetchDonationProgress,
    {
      fallbackData: initialData,
      refreshInterval: 15000,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )

  const raised = Math.max(Math.round(data?.total ?? FALLBACK_DONATION_PROGRESS.total), 0)
  const goal = Math.max(Math.round(data?.goal ?? FALLBACK_DONATION_PROGRESS.goal), 0)
  const numDonations = Math.max(
    Math.round(data?.numDonations ?? FALLBACK_DONATION_PROGRESS.numDonations),
    0,
  )
  const hasError = error !== undefined
  const progressPercentage = getProgressPercentage(raised, goal)
  const shouldShowProgress = hasHydrated && isInView
  const displayedRaised = shouldShowProgress ? raised : 0
  const displayedDonations = shouldShowProgress ? numDonations : 0
  const displayedProgress = shouldShowProgress ? progressPercentage : 0
  const sharkPosition = Math.min(Math.max(displayedProgress, 4), 96)
  const progressTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.9, ease: [0.23, 1, 0.32, 1] as const }
  const donationStatusMessage = getDonationStatusMessage(hasError, isLoading)

  return (
    <section ref={sectionRef} id="donate" className="w-full bg-background py-24 sm:py-28 lg:py-36">
      <div className="container px-4 md:px-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <header>
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
              Fundraising for CHOP
            </p>
            <h2 className="mt-5 text-5xl leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Every Dollar Is a Cheer
            </h2>
            <p className="mx-auto mt-7 max-w-4xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
              We&apos;re raising money to honor the care that saved Nate, help families spot concerning signs sooner,
              and fund research so better treatments exist for the next child who needs them.
            </p>
          </header>

          <div className="mt-14 flex w-full flex-col items-center justify-center gap-4 lg:mt-16 lg:flex-row lg:items-end lg:gap-8">
            <NumberFlow
              aria-label={`${CURRENCY_FORMATTER.format(displayedRaised)} raised`}
              className="font-[family-name:var(--font-lilita-one)] text-[clamp(3.8rem,17vw,8rem)] leading-[0.85] tracking-[-0.035em] text-primary tabular-nums [--number-flow-mask-height:0.14em]"
              format={NUMBER_FORMAT}
              isolate
              opacityTiming={{ duration: 220, easing: "ease-out" }}
              prefix="$"
              spinTiming={{ duration: 700, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              transformTiming={{ duration: 700, easing: "cubic-bezier(0.23, 1, 0.32, 1)" }}
              value={displayedRaised}
            />
            <p className="text-xl font-bold text-foreground sm:text-2xl lg:pb-3 lg:text-3xl">
              raised of {CURRENCY_FORMATTER.format(goal)}
            </p>
          </div>

          <div className="mt-12 w-full max-w-4xl sm:mt-14">
            <div className="relative pt-16 sm:pt-20">
              <motion.div
                aria-hidden="true"
                animate={{ left: `${sharkPosition}%` }}
                className="absolute top-0 z-10 h-20 w-20 -translate-x-1/2 drop-shadow-[0_12px_18px_rgb(20_43_64_/_28%)] sm:h-24 sm:w-24"
                initial={false}
                transition={progressTransition}
              >
                <Image src="/nate shark.png" alt="" fill className="object-contain object-bottom" sizes="96px" />
              </motion.div>

              <div
                role="progressbar"
                aria-label="Fundraising progress"
                aria-valuemax={goal}
                aria-valuemin={0}
                aria-valuenow={Math.min(raised, goal)}
                aria-valuetext={`${CURRENCY_FORMATTER.format(raised)} raised of ${CURRENCY_FORMATTER.format(goal)}`}
                className="relative h-6 overflow-hidden rounded-full border border-white/25 bg-secondary/65 shadow-inner"
              >
                <motion.div
                  animate={{ width: `${displayedProgress}%` }}
                  className="h-full rounded-full bg-primary"
                  initial={false}
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(130deg, rgb(255 255 255 / 0.03) 0 18px, rgb(255 255 255 / 0.15) 18px 36px)",
                  }}
                  transition={progressTransition}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-between text-sm font-bold text-foreground sm:text-base">
              <span>$0</span>
              <span>{CURRENCY_FORMATTER.format(goal)}</span>
            </div>
          </div>

          <div className="mt-10 inline-flex flex-wrap items-baseline justify-center gap-x-2 rounded-full border border-white/20 bg-background/20 px-6 py-3 text-base text-muted-foreground shadow-[0_12px_30px_rgb(20_43_64_/_10%)] sm:text-lg">
            <span className="font-bold text-primary">
              <NumberFlow
                aria-label={`${displayedDonations} donations`}
                format={NUMBER_FORMAT}
                value={displayedDonations}
              />
              <span aria-hidden="true">donations</span>
            </span>
            <span>from amazing supporters</span>
          </div>

          <p className={hasError ? "mt-4 text-sm text-muted-foreground" : "sr-only"} role="status">
            {donationStatusMessage}
          </p>

          <Button
            asChild
            size="lg"
            className="mt-10 h-16 rounded-[18px] px-10 text-lg font-bold shadow-[0_16px_32px_rgb(20_43_64_/_20%)] transition-[box-shadow,transform] duration-150 ease-snappy-out hover:shadow-[0_20px_38px_rgb(20_43_64_/_28%)] active:scale-[0.98] sm:text-xl"
          >
            <Link href="https://chop.donordrive.com/teams/nate-the-great" prefetch={false}>Donate Directly</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
