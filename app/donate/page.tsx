"use client"

import Image from "next/image"
import Link from "next/link"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ArrowLeft, Gift, Heart, ShieldCheck, Sparkles, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaymentIntentResponse {
  clientSecret?: string
  error?: string
}

interface PaymentFormProps {
  amountLabel: string
}

const PRESET_AMOUNTS: readonly number[] = [25, 50, 100, 250]
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null
const donationCtaClassName =
  "h-12 w-full rounded-2xl border border-[#2f6272] bg-[#42a8a9] text-base font-bold text-white shadow-[0_16px_26px_rgba(34,59,84,0.28)] transition-[background-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:bg-[#369799]"
const amountOptionBaseClass =
  "h-11 rounded-2xl border text-sm font-bold touch-manipulation transition-[background-color,border-color,color,transform,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6272] focus-visible:ring-offset-2 sm:text-base"
const amountOptionSelectedClass = "border-[#2f6272] bg-[#42a8a9] text-white shadow-[0_12px_20px_rgba(34,59,84,0.22)]"
const amountOptionDefaultClass =
  "border-[#a8c4d8] bg-white/90 text-[#223b54] hover:-translate-y-0.5 hover:border-[#42a8a9] hover:bg-white"

function formatUsd(amountInDollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInDollars)
}

function getAmountOptionClassName(isSelected: boolean): string {
  return `${amountOptionBaseClass} ${isSelected ? amountOptionSelectedClass : amountOptionDefaultClass}`
}

const impactHighlights = [
  {
    title: "Emergency Care",
    description: "Supports the CHOP teams that relieved pressure and stabilized Nate when hydrocephalus was discovered.",
    icon: Stethoscope,
    color: "#d9ecf8",
  },
  {
    title: "Treatment Access",
    description: "Funds research so treatment options exist for the next child who needs them.",
    icon: Sparkles,
    color: "#d7f1f1",
  },
  {
    title: "Family Support",
    description: "Honors the doctors, nurses, staff, family, and friends who carry families through hard moments.",
    icon: Heart,
    color: "#e4f3ff",
  },
] as const

const staggerParentVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
}

const revealChildVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

function PaymentForm({ amountLabel }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")

    const returnUrl = `${window.location.origin}/donate/return`
    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
      redirect: "if_required",
    })

    if (result.error) {
      setErrorMessage(result.error.message ?? "Unable to complete donation. Check payment details and try again.")
      setIsSubmitting(false)
      return
    }

    if (result.paymentIntent?.id) {
      window.location.assign(`/donate/return?payment_intent=${result.paymentIntent.id}`)
      return
    }

    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-[1.25rem] border border-[#9fc5d8] bg-white/92 p-4 shadow-[0_14px_30px_rgba(34,59,84,0.16)] sm:p-5">
        <PaymentElement />
      </div>

      {errorMessage ? (
        <div
          className="rounded-xl border border-[#9bbacc] bg-[#edf6fb] px-3 py-2 text-sm font-medium text-[#223b54]"
          role="status"
          aria-live="polite"
        >
          {errorMessage}
        </div>
      ) : null}

      <Button
        type="submit"
        size="lg"
        className={donationCtaClassName}
        disabled={!stripe || isSubmitting}
      >
        {isSubmitting ? "Processing Donation…" : `Donate ${amountLabel}`}
      </Button>
    </form>
  )
}

export default function DonatePage() {
  const [amountSelectionMode, setAmountSelectionMode] = useState<"preset" | "custom">("preset")
  const [selectedPreset, setSelectedPreset] = useState<number>(50)
  const [customAmountInput, setCustomAmountInput] = useState<string>("")
  const [clientSecret, setClientSecret] = useState<string>("")
  const [isCreatingIntent, setIsCreatingIntent] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const customAmountInputRef = useRef<HTMLInputElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const donationAmountInDollars = useMemo(() => {
    if (amountSelectionMode === "preset") {
      return selectedPreset
    }

    if (!customAmountInput.trim()) {
      return null
    }

    const parsedAmount = Number(customAmountInput)
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return null
    }

    return Math.round(parsedAmount * 100) / 100
  }, [amountSelectionMode, customAmountInput, selectedPreset])

  const donationAmountInCents = useMemo(() => {
    if (donationAmountInDollars === null) {
      return null
    }

    return Math.round(donationAmountInDollars * 100)
  }, [donationAmountInDollars])

  const amountLabel = useMemo(() => {
    if (donationAmountInDollars === null) {
      return "Amount"
    }
    return formatUsd(donationAmountInDollars)
  }, [donationAmountInDollars])

  const elementsOptions = useMemo(
    () => ({
      clientSecret,
      appearance: {
        theme: "stripe" as const,
        variables: {
          fontFamily: "Work Sans, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
          colorPrimary: "#42a8a9",
          colorBackground: "#f7fbff",
          colorText: "#223b54",
          colorDanger: "#dc2626",
          borderRadius: "14px",
          spacingUnit: "4px",
        },
        rules: {
          ".Input": {
            border: "1px solid #9bb7cc",
            boxShadow: "none",
            backgroundColor: "#fff",
          },
          ".Input:focus": {
            border: "1px solid #42a8a9",
            boxShadow: "0 0 0 3px rgba(66,168,169,0.25)",
          },
          ".Label": {
            color: "#223b54",
            fontWeight: "600",
          },
        },
      },
    }),
    [clientSecret],
  )

  function resetPaymentState(): void {
    setClientSecret("")
    setErrorMessage("")
  }

  useEffect(() => {
    const hasUnsavedDonationState = Boolean(clientSecret || customAmountInput.trim())
    if (!hasUnsavedDonationState) {
      return
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [clientSecret, customAmountInput])

  async function initializePaymentIntent(): Promise<void> {
    if (donationAmountInCents === null || donationAmountInCents < 100) {
      setErrorMessage("Please enter a valid donation amount (minimum $1.00).")
      customAmountInputRef.current?.focus()
      return
    }

    if (!stripePromise) {
      setErrorMessage("Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.")
      return
    }

    setIsCreatingIntent(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/stripe/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amountInCents: donationAmountInCents }),
      })

      const payload = (await response.json()) as PaymentIntentResponse

      if (!response.ok || !payload.clientSecret) {
        setErrorMessage(payload.error ?? "Unable to initialize payment. Please try again.")
        setIsCreatingIntent(false)
        return
      }

      setClientSecret(payload.clientSecret)
      setIsCreatingIntent(false)
    } catch {
      setErrorMessage("Unable to initialize payment. Please try again.")
      setIsCreatingIntent(false)
    }
  }

  return (
    <main className="relative min-h-dvh overflow-hidden bg-[#f4fbff] text-[#1f3147]">
      <a
        href="#donation-form"
        className="sr-only absolute left-3 top-3 z-30 rounded-md bg-white px-3 py-2 text-sm font-semibold text-[#1d344d] focus:not-sr-only focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6272] focus-visible:ring-offset-2"
      >
        Skip to Donation Form
      </a>
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, #f8fcff 0%, #e7f1f8 46%, #d3e3ef 100%), linear-gradient(120deg, rgba(66,168,169,0.16) 0%, rgba(34,59,84,0.14) 52%, rgba(66,168,169,0.08) 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-35 mix-blend-soft-light"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.32) 0px, rgba(255,255,255,0.32) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(34,59,84,0.08) 0px, rgba(34,59,84,0.08) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(135deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, transparent 1px, transparent 6px)",
            backgroundSize: "4px 4px, 5px 5px, 7px 7px",
          }}
        />
      </div>

      <motion.div
        className="relative mx-auto w-full max-w-6xl px-4 pb-10 pt-4 sm:px-6 sm:pt-6 lg:pb-16 lg:pt-8"
        variants={prefersReducedMotion ? undefined : staggerParentVariants}
        initial={prefersReducedMotion ? undefined : "hidden"}
        animate={prefersReducedMotion ? undefined : "show"}
      >
        <motion.header
          className="mb-6 flex items-center justify-between lg:mb-8"
          variants={prefersReducedMotion ? undefined : revealChildVariants}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[#a6c0d4] bg-white/85 px-4 py-2 text-sm font-semibold text-[#223b54] shadow-sm transition-[background-color,border-color,color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-[#42a8a9] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6272] focus-visible:ring-offset-2"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back Home
          </Link>

          <Image
            src="/Nate-the-great-logo.png"
            alt="Nate the Great"
            width={170}
            height={90}
            className="h-auto w-[126px] sm:w-[164px]"
            priority
          />
        </motion.header>

        <div className="grid items-start gap-6 lg:grid-cols-[1.1fr_0.95fr] lg:gap-8">
          <motion.section
            className="order-2 relative overflow-hidden rounded-[2rem] border border-[#b6cfdf] bg-white/84 p-5 shadow-[0_24px_60px_rgba(34,59,84,0.2)] backdrop-blur-sm sm:p-7 lg:order-1"
            variants={prefersReducedMotion ? undefined : revealChildVariants}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#42a8a9]/14 via-transparent to-[#2f5c7b]/14" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9eb8cc] to-transparent" />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#d8eff5] px-4 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#1f4f68]">
                <Gift className="h-3.5 w-3.5" aria-hidden="true" />
                100% Supports CHOP
              </p>

              <h1 className="mt-4 max-w-[14ch] text-balance text-4xl leading-[1.04] text-[#1d344d] sm:text-6xl">
                Help Nate Fight Childhood Cancer
              </h1>

              <p className="mt-4 max-w-xl text-base text-[#314c65] sm:text-lg">
                Nate was born on May 2, 2025. In late June, vomiting and unusual sleepiness led to an emergency CHOP visit,
                where doctors found hydrocephalus caused by a rare choroid plexus tumor. After multiple surgeries, he underwent
                gross total resection on January 2, 2026.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              {impactHighlights.map((item, index) => {
                const Icon = item.icon

                return (
                  <motion.article
                    key={item.title}
                    className="rounded-2xl border border-white/80 bg-white/85 p-3 shadow-[0_10px_24px_rgba(34,59,84,0.12)]"
                    style={{
                      transform: `rotate(${index === 1 ? "-1.4deg" : index === 2 ? "1.4deg" : "0deg"})`,
                    }}
                    whileHover={
                      prefersReducedMotion
                        ? undefined
                        : {
                            y: -4,
                          }
                    }
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  >
                    <span
                      className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-xl text-slate-800"
                      style={{ backgroundColor: item.color }}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-lg leading-tight text-[#20384f]">{item.title}</h3>
                    <p className="mt-1 text-sm text-[#4a637b]">{item.description}</p>
                  </motion.article>
                )
              })}
            </div>

            <div className="mt-6 flex flex-col gap-3 rounded-3xl border border-[#b9d0df] bg-[#eef6fb] p-3 sm:flex-row sm:items-center sm:p-4">
              <Image
                src="/nate shark.png"
                alt="Nate shark"
                width={106}
                height={106}
                className="h-[84px] w-[84px] rounded-2xl border border-[#a9c4d8] bg-white p-1 object-contain shadow-sm"
              />

              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#2d7088]">From Our Family</p>
                <p className="mt-1 text-sm text-[#314d66]">
                  We can never fully thank CHOP&apos;s neurosurgery and neuro-oncology teams, or all of the doctors, nurses, and
                  staff who cared for Nate and us. Sharing his story honors that care and helps fund research for the next child.
                </p>
              </div>
            </div>
          </motion.section>

          <motion.section
            id="donation-form"
            className="order-1 relative scroll-mt-24 overflow-hidden rounded-[2rem] border border-[#aac6d9] bg-white/92 p-5 shadow-[0_24px_56px_rgba(34,59,84,0.22)] backdrop-blur-sm sm:p-6 lg:order-2"
            variants={prefersReducedMotion ? undefined : revealChildVariants}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-[#2f5c7b]/14 via-transparent to-[#42a8a9]/14" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#9eb8cc] to-transparent" />

            <div className="relative">
              <h2 className="text-balance text-3xl leading-tight text-[#1d344d] sm:text-4xl">Make a Donation</h2>
              <p className="mt-2 text-sm text-[#526a7f] sm:text-base">
                Choose an amount, then complete checkout with Stripe.
              </p>

              <section className="mt-5 space-y-4">
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-5">
                  {PRESET_AMOUNTS.map((amount) => {
                    const isSelected = selectedPreset === amount && amountSelectionMode === "preset"

                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setAmountSelectionMode("preset")
                          setSelectedPreset(amount)
                          resetPaymentState()
                        }}
                        className={getAmountOptionClassName(isSelected)}
                      >
                        {formatUsd(amount)}
                      </button>
                    )
                  })}

                  <button
                    type="button"
                    onClick={() => {
                      setAmountSelectionMode("custom")
                      resetPaymentState()
                    }}
                    className={getAmountOptionClassName(amountSelectionMode === "custom")}
                  >
                    Custom
                  </button>
                </div>

                {amountSelectionMode === "custom" ? (
                  <div className="space-y-2 text-left">
                    <label
                      htmlFor="custom-amount"
                      className="text-xs font-bold uppercase tracking-[0.14em] text-[#2b617a]"
                    >
                      Custom amount
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#557189]">$</span>
                      <input
                        ref={customAmountInputRef}
                        id="custom-amount"
                        name="customAmount"
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        autoComplete="off"
                        min="1"
                        max="10000"
                        placeholder="500.00…"
                        aria-describedby={errorMessage ? "donation-form-error" : undefined}
                        aria-invalid={errorMessage ? "true" : "false"}
                        value={customAmountInput}
                        onChange={(event) => {
                          setCustomAmountInput(event.target.value)
                          resetPaymentState()
                        }}
                        className="h-12 w-full rounded-2xl border border-[#a9c3d5] bg-white pl-8 pr-3 text-base text-[#223b54] shadow-sm outline-none transition-[border-color,box-shadow] duration-200 focus:border-[#42a8a9] focus:ring-4 focus:ring-[#d6ecec]"
                      />
                    </div>
                  </div>
                ) : null}
              </section>

              <div className="mt-5 rounded-2xl border border-[#b8cfde] bg-[#eef6fb] px-4 py-3 text-[#1f344a]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#4f667b]">Donation total</span>
                  <span className="text-3xl leading-none text-[#2b7d90]">{amountLabel}</span>
                </div>
                <ul className="mt-3 space-y-2 border-t border-[#c7d8e4] pt-3 text-left text-sm text-[#4f667b]">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2f5c7b]" aria-hidden="true" />
                    Secure checkout with Stripe.
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#42a8a9]" aria-hidden="true" />
                    A receipt is sent immediately after payment.
                  </li>
                </ul>
              </div>

              {errorMessage ? (
                <div
                  id="donation-form-error"
                  className="mt-4 rounded-xl border border-[#9bbacc] bg-[#edf6fb] px-3 py-2 text-sm font-medium text-[#223b54]"
                  role="status"
                  aria-live="polite"
                >
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-4">
                {!clientSecret ? (
                  <Button
                    type="button"
                    size="lg"
                    className={donationCtaClassName}
                    onClick={initializePaymentIntent}
                    disabled={isCreatingIntent}
                  >
                    {isCreatingIntent ? "Preparing Payment…" : "Continue to Payment"}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Elements stripe={stripePromise} options={elementsOptions}>
                      <PaymentForm amountLabel={amountLabel} />
                    </Elements>
                    <button
                      type="button"
                      onClick={resetPaymentState}
                      className="w-full text-center text-sm font-semibold text-[#4f667b] underline-offset-4 transition-colors duration-200 hover:text-[#223b54] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6272] focus-visible:ring-offset-2"
                    >
                      Change Donation Amount
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  )
}
