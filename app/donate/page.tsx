"use client"

import Image from "next/image"
import Link from "next/link"
import { type ComponentProps, FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  CheckoutProvider,
  ExpressCheckoutElement,
  PaymentElement,
  useCheckout,
} from "@stripe/react-stripe-js/checkout"
import {
  loadStripe,
  type StripeCheckoutExpressCheckoutElementOptions,
  type StripeCheckoutPaymentElementOptions,
  type StripeExpressCheckoutElementConfirmEvent,
} from "@stripe/stripe-js"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ArrowLeft, Gift, Heart, ShieldCheck, Sparkles, Stethoscope } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MOTION_EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

interface CheckoutSessionResponse {
  clientSecret?: string
  error?: string
}

interface CheckoutFormProps {
  amountLabel: string
  onIntentionalNavigationChange: (isNavigating: boolean) => void
}

type PaymentElementLoadErrorEvent = Parameters<
  NonNullable<ComponentProps<typeof PaymentElement>["onLoadError"]>
>[0]
type ExpressCheckoutLoadErrorEvent = Parameters<
  NonNullable<ComponentProps<typeof ExpressCheckoutElement>["onLoadError"]>
>[0]
type StripeCheckoutLoadErrorEvent = PaymentElementLoadErrorEvent | ExpressCheckoutLoadErrorEvent

const PRESET_AMOUNTS: readonly number[] = [25, 50, 100, 250]
const MIN_DONATION_AMOUNT_IN_CENTS = 100
const MAX_DONATION_AMOUNT_IN_CENTS = 1_000_000
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
const stripePromise = publishableKey ? loadStripe(publishableKey) : null
const donationCtaClassName =
  "h-12 w-full rounded-2xl border border-[#2f6272] bg-[#42a8a9] text-base font-bold text-white shadow-[0_16px_26px_rgba(34,59,84,0.28)] transition-[background-color,transform,box-shadow] duration-150 ease-snappy-out active:scale-[0.98] hover:-translate-y-0.5 hover:bg-[#369799]"
const amountOptionBaseClass =
  "h-11 rounded-2xl border text-sm font-bold touch-manipulation transition-[background-color,border-color,color,transform,box-shadow,opacity] duration-150 ease-snappy-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6272] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
const amountOptionSelectedClass =
  "border-[#2f6272] bg-[#42a8a9] text-white shadow-[0_12px_20px_rgba(34,59,84,0.22)]"
const amountOptionDefaultClass =
  "border-[#a8c4d8] bg-white/90 text-[#223b54] hover:-translate-y-0.5 hover:border-[#42a8a9] hover:bg-white"
const paymentElementOptions: StripeCheckoutPaymentElementOptions = {
  layout: {
    type: "accordion",
    defaultCollapsed: false,
  },
  paymentMethodOrder: ["apple_pay", "google_pay", "link", "card"],
  wallets: {
    applePay: "auto",
    googlePay: "auto",
    link: "auto",
  },
}
const expressCheckoutOptions: StripeCheckoutExpressCheckoutElementOptions = {
  buttonHeight: 50,
  buttonTheme: {
    applePay: "black",
    googlePay: "black",
  },
  buttonType: {
    applePay: "donate",
    googlePay: "donate",
  },
  layout: {
    maxColumns: 2,
    maxRows: 2,
    overflow: "auto",
  },
  paymentMethodOrder: ["apple_pay", "google_pay", "link"],
  paymentMethods: {
    amazonPay: "never",
    applePay: "auto",
    googlePay: "auto",
    klarna: "never",
    link: "auto",
    paypal: "never",
  },
}

function formatUsd(amountInDollars: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amountInDollars)
}

function getAmountOptionClassName(isSelected: boolean): string {
  return `${amountOptionBaseClass} ${isSelected ? amountOptionSelectedClass : amountOptionDefaultClass}`
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizeDonorEmail(email: string): string {
  return email.trim()
}

function getDonationAmountInDollars(
  amountSelectionMode: "preset" | "custom",
  selectedPreset: number,
  customAmountInput: string,
): number | null {
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
}

function getDonationAmountInCents(donationAmountInDollars: number | null): number | null {
  if (donationAmountInDollars === null) {
    return null
  }

  return Math.round(donationAmountInDollars * 100)
}

function getDonationAmountValidationMessage(
  amountSelectionMode: "preset" | "custom",
  customAmountInput: string,
  donationAmountInCents: number | null,
): string | null {
  if (amountSelectionMode === "preset") {
    return null
  }

  if (!customAmountInput.trim()) {
    return "Enter a custom amount between $1 and $10,000."
  }

  if (donationAmountInCents === null) {
    return "Enter a valid dollar amount using numbers only."
  }

  if (donationAmountInCents < MIN_DONATION_AMOUNT_IN_CENTS) {
    return "Custom donations must be at least $1.00."
  }

  if (donationAmountInCents > MAX_DONATION_AMOUNT_IN_CENTS) {
    return "Custom donations are capped at $10,000 per checkout."
  }

  return null
}

function getEmailValidationMessage(email: string): string | null {
  if (!email) {
    return "Add an email address so Stripe can attach it to your donation."
  }

  if (!isValidEmail(email)) {
    return "Enter a valid email address to continue to checkout."
  }

  return null
}

function getPreCheckoutHelperMessage(params: {
  amountValidationMessage: string | null
  emailValidationMessage: string | null
  isCreatingSession: boolean
  isStripeConfigured: boolean
}): string {
  if (!params.isStripeConfigured) {
    return "Stripe checkout is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY."
  }

  if (params.amountValidationMessage) {
    return params.amountValidationMessage
  }

  if (params.emailValidationMessage) {
    return params.emailValidationMessage
  }

  if (params.isCreatingSession) {
    return "Preparing your secure Stripe checkout."
  }

  return "Step 1: confirm the amount and email. Step 2: review payment details in secure checkout."
}

function getStripeElementLoadErrorMessage(event: StripeCheckoutLoadErrorEvent): string {
  return (
    event.error.message ??
    "Secure checkout could not load. Refresh and try again, or use a different payment method."
  )
}

const impactHighlights = [
  {
    title: "Emergency Care",
    description:
      "Supports the CHOP teams that relieved pressure and stabilized Nate when hydrocephalus was discovered.",
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
    description:
      "Honors the doctors, nurses, staff, family, and friends who carry families through hard moments.",
    icon: Heart,
    color: "#e4f3ff",
  },
] as const

const staggerParentVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
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
      duration: 0.32,
      ease: MOTION_EASE_OUT,
    },
  },
}

function CheckoutForm({ amountLabel, onIntentionalNavigationChange }: CheckoutFormProps) {
  const checkoutState = useCheckout()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isCheckoutUiLoading, setIsCheckoutUiLoading] = useState<boolean>(true)
  const [hasCheckoutUiReady, setHasCheckoutUiReady] = useState<boolean>(false)

  async function confirmDonationPayment(
    expressCheckoutConfirmEvent?: StripeExpressCheckoutElementConfirmEvent,
  ): Promise<void> {
    if (checkoutState.type === "loading" || isSubmitting) {
      return
    }

    if (checkoutState.type === "error") {
      setErrorMessage(checkoutState.error.message || "Unable to load Stripe checkout.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage("")
    onIntentionalNavigationChange(true)

    try {
      const confirmResult = await checkoutState.checkout.confirm({
        expressCheckoutConfirmEvent,
        redirect: "if_required",
      })

      if (confirmResult.type === "error") {
        setErrorMessage(
          confirmResult.error.message ?? "Unable to complete donation. Check payment details and try again.",
        )
        setIsSubmitting(false)
        onIntentionalNavigationChange(false)
        return
      }

      window.location.replace(`/donate/return?session_id=${confirmResult.session.id}`)
    } catch {
      setErrorMessage("Unable to complete donation. Please refresh and try again.")
      setIsSubmitting(false)
      onIntentionalNavigationChange(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    void confirmDonationPayment()
  }

  function handleExpressCheckoutConfirm(event: StripeExpressCheckoutElementConfirmEvent): void {
    void confirmDonationPayment(event)
  }

  function handleCheckoutUiReady(): void {
    setHasCheckoutUiReady(true)
    setIsCheckoutUiLoading(false)
  }

  function handleStripeElementLoadError(event: StripeCheckoutLoadErrorEvent): void {
    setErrorMessage(getStripeElementLoadErrorMessage(event))
    setIsCheckoutUiLoading(false)
  }

  const canSubmit =
    checkoutState.type === "success" &&
    checkoutState.checkout.canConfirm &&
    !isSubmitting

  const checkoutError =
    checkoutState.type === "success" ? checkoutState.checkout.lastPaymentError?.message ?? "" : ""

  const combinedErrorMessage = errorMessage || checkoutError
  const helperMessage = combinedErrorMessage
    ? ""
    : isSubmitting
      ? "Finalizing your donation. This can take a few seconds."
      : checkoutState.type === "loading" || isCheckoutUiLoading
      ? "Secure checkout is loading below."
      : !hasCheckoutUiReady
        ? "Secure checkout is preparing your payment options."
        : canSubmit
          ? "Secure checkout is ready. Review your details and donate when you're ready."
          : "Choose Apple Pay, Google Pay, Link, or enter card details above to enable the donation button."

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-4 rounded-[1.25rem] border border-[#9fc5d8] bg-white/92 p-4 shadow-[0_14px_30px_rgba(34,59,84,0.16)] sm:p-5">
        <ExpressCheckoutElement
          options={expressCheckoutOptions}
          onConfirm={handleExpressCheckoutConfirm}
          onLoadError={handleStripeElementLoadError}
          onReady={handleCheckoutUiReady}
        />

        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#6a8396]">
          <span className="h-px flex-1 bg-[#c8dae6]" />
          Or pay with card
          <span className="h-px flex-1 bg-[#c8dae6]" />
        </div>

        <PaymentElement
          options={paymentElementOptions}
          onLoadError={handleStripeElementLoadError}
          onLoaderStart={() => {
            setIsCheckoutUiLoading(true)
          }}
          onReady={handleCheckoutUiReady}
        />
      </div>

      {helperMessage ? (
        <div
          className="rounded-xl border border-[#c8dae6] bg-[#f5fbff] px-3 py-2 text-sm font-medium text-[#46627a]"
          role="status"
          aria-live="polite"
        >
          {helperMessage}
        </div>
      ) : null}

      {combinedErrorMessage ? (
        <div
          className="rounded-xl border border-[#9bbacc] bg-[#edf6fb] px-3 py-2 text-sm font-medium text-[#223b54]"
          role="status"
          aria-live="polite"
        >
          {combinedErrorMessage}
        </div>
      ) : null}

      <Button type="submit" size="lg" className={donationCtaClassName} disabled={!canSubmit}>
        {isSubmitting ? "Finalizing Donation…" : `Donate ${amountLabel}`}
      </Button>
    </form>
  )
}

export default function DonatePage() {
  const [amountSelectionMode, setAmountSelectionMode] = useState<"preset" | "custom">("preset")
  const [selectedPreset, setSelectedPreset] = useState<number>(50)
  const [customAmountInput, setCustomAmountInput] = useState<string>("")
  const [donorEmail, setDonorEmail] = useState<string>("")
  const [checkoutClientSecret, setCheckoutClientSecret] = useState<string>("")
  const [isCreatingSession, setIsCreatingSession] = useState<boolean>(false)
  const [isIntentionalNavigationPending, setIsIntentionalNavigationPending] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>("")
  const customAmountInputRef = useRef<HTMLInputElement>(null)
  const donorEmailInputRef = useRef<HTMLInputElement>(null)
  const checkoutContainerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useReducedMotion()

  const donationAmountInDollars = getDonationAmountInDollars(
    amountSelectionMode,
    selectedPreset,
    customAmountInput,
  )
  const donationAmountInCents = getDonationAmountInCents(donationAmountInDollars)
  const normalizedDonorEmail = normalizeDonorEmail(donorEmail)
  const amountValidationMessage = getDonationAmountValidationMessage(
    amountSelectionMode,
    customAmountInput,
    donationAmountInCents,
  )
  const emailValidationMessage = getEmailValidationMessage(normalizedDonorEmail)
  const isCheckoutActive = checkoutClientSecret.length > 0
  const canPrepareCheckout =
    amountValidationMessage === null &&
    emailValidationMessage === null &&
    stripePromise !== null &&
    !isCheckoutActive
  const amountLabel =
    donationAmountInDollars === null ? "Amount" : formatUsd(donationAmountInDollars)
  const checkoutOptions = useMemo(
    () => ({
      clientSecret: checkoutClientSecret,
      elementsOptions: {
        loader: "auto" as const,
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
      },
    }),
    [checkoutClientSecret],
  )
  const preCheckoutHelperMessage = getPreCheckoutHelperMessage({
    amountValidationMessage,
    emailValidationMessage,
    isCreatingSession,
    isStripeConfigured: stripePromise !== null,
  })

  function resetCheckoutState(): void {
    setCheckoutClientSecret("")
    setErrorMessage("")
    setIsIntentionalNavigationPending(false)
  }

  useEffect(() => {
    if (isIntentionalNavigationPending) {
      return
    }

    const hasUnsavedDonationState = Boolean(checkoutClientSecret || customAmountInput.trim() || donorEmail.trim())
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
  }, [checkoutClientSecret, customAmountInput, donorEmail, isIntentionalNavigationPending])

  useEffect(() => {
    if (!checkoutClientSecret) {
      return
    }

    checkoutContainerRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "start",
    })
  }, [checkoutClientSecret, prefersReducedMotion])

  async function initializeCheckoutSession(): Promise<void> {
    if (isCheckoutActive || isCreatingSession) {
      return
    }

    if (amountValidationMessage) {
      setErrorMessage(amountValidationMessage)
      customAmountInputRef.current?.focus()
      return
    }

    if (emailValidationMessage) {
      setErrorMessage(emailValidationMessage)
      donorEmailInputRef.current?.focus()
      return
    }

    if (!stripePromise) {
      setErrorMessage("Stripe is not configured. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.")
      return
    }

    setIsCreatingSession(true)
    setErrorMessage("")

    try {
      const response = await fetch("/api/stripe/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amountInCents: donationAmountInCents,
          email: normalizedDonorEmail,
        }),
      })

      const payload = (await response.json()) as CheckoutSessionResponse

      if (!response.ok || !payload.clientSecret) {
        setErrorMessage(payload.error ?? "Unable to initialize checkout. Please try again.")
        setIsCreatingSession(false)
        return
      }

      setCheckoutClientSecret(payload.clientSecret)
      setIsCreatingSession(false)
    } catch {
      setErrorMessage("Unable to initialize checkout. Please try again.")
      setIsCreatingSession(false)
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
            className="inline-flex items-center gap-2 rounded-full border border-[#a6c0d4] bg-white/85 px-4 py-2 text-sm font-semibold text-[#223b54] shadow-sm transition-[background-color,border-color,color,transform,box-shadow] duration-150 ease-snappy-out active:scale-[0.98] hover:-translate-y-0.5 hover:border-[#42a8a9] hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6272] focus-visible:ring-offset-2"
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
                Nate was born on May 2, 2025. In late June, vomiting and unusual sleepiness led to an emergency CHOP
                visit, where doctors found hydrocephalus caused by a rare choroid plexus tumor. After multiple
                surgeries, he underwent gross total resection on January 2, 2026.
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
                            y: -2,
                          }
                    }
                    transition={{ type: "spring", duration: 0.28, bounce: 0.1 }}
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
                  We can never fully thank CHOP&apos;s neurosurgery and neuro-oncology teams, or all of the doctors,
                  nurses, and staff who cared for Nate and us. Sharing his story honors that care and helps fund
                  research for the next child.
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
                Choose an amount, add your email, then checkout with Apple Pay, Google Pay, Link, or card.
              </p>

              <fieldset className="mt-5 space-y-4" disabled={isCheckoutActive}>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#2b617a]">
                    Donation details
                  </p>
                  {isCheckoutActive ? (
                    <span className="rounded-full border border-[#a7c7d8] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#46627a]">
                      Locked for secure checkout
                    </span>
                  ) : null}
                </div>

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
                          resetCheckoutState()
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
                      resetCheckoutState()
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
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#557189]">
                        $
                      </span>
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
                        placeholder="500.00"
                        aria-describedby="donation-form-feedback"
                        aria-invalid={amountValidationMessage ? "true" : "false"}
                        value={customAmountInput}
                        onChange={(event) => {
                          setCustomAmountInput(event.target.value)
                          resetCheckoutState()
                        }}
                        className="h-12 w-full rounded-2xl border border-[#a9c3d5] bg-white pl-8 pr-3 text-base text-[#223b54] shadow-sm outline-none transition-[border-color,box-shadow,opacity] duration-200 focus:border-[#42a8a9] focus:ring-4 focus:ring-[#d6ecec] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>
                ) : null}

                <div className="space-y-2 text-left">
                  <label
                    htmlFor="donor-email"
                    className="text-xs font-bold uppercase tracking-[0.14em] text-[#2b617a]"
                  >
                    Email for donation confirmation
                  </label>
                  <input
                    ref={donorEmailInputRef}
                    id="donor-email"
                    name="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-describedby="donation-form-feedback"
                    aria-invalid={emailValidationMessage ? "true" : "false"}
                    value={donorEmail}
                    onChange={(event) => {
                      setDonorEmail(event.target.value)
                      resetCheckoutState()
                    }}
                    className="h-12 w-full rounded-2xl border border-[#a9c3d5] bg-white px-4 text-base text-[#223b54] shadow-sm outline-none transition-[border-color,box-shadow,opacity] duration-200 focus:border-[#42a8a9] focus:ring-4 focus:ring-[#d6ecec] disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </fieldset>

              <div className="mt-5 rounded-2xl border border-[#b8cfde] bg-[#eef6fb] px-4 py-3 text-[#1f344a]">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-[#4f667b]">Donation total</span>
                  <span className="text-3xl leading-none text-[#2b7d90]">{amountLabel}</span>
                </div>
                <ul className="mt-3 space-y-2 border-t border-[#c7d8e4] pt-3 text-left text-sm text-[#4f667b]">
                  <li className="flex items-start gap-2">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2f5c7b]" aria-hidden="true" />
                    Secure checkout powered by Stripe Checkout components.
                  </li>
                  <li className="flex items-start gap-2">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[#42a8a9]" aria-hidden="true" />
                    Wallet buttons show automatically when your device and browser support them.
                  </li>
                </ul>
              </div>

              <div
                id="donation-form-feedback"
                className={cn(
                  "mt-4 rounded-xl border px-3 py-2 text-sm font-medium",
                  errorMessage
                    ? "border-[#9bbacc] bg-[#edf6fb] text-[#223b54]"
                    : "border-[#c8dae6] bg-[#f5fbff] text-[#46627a]",
                )}
                role={errorMessage ? "alert" : "status"}
                aria-live="polite"
              >
                {errorMessage || preCheckoutHelperMessage}
              </div>

              <div className="mt-4">
                {!checkoutClientSecret ? (
                  <Button
                    type="button"
                    size="lg"
                    className={donationCtaClassName}
                    onClick={() => {
                      void initializeCheckoutSession()
                    }}
                    disabled={!canPrepareCheckout || isCreatingSession}
                  >
                    {isCreatingSession ? "Preparing Checkout…" : "Continue to Secure Checkout"}
                  </Button>
                ) : (
                  <div ref={checkoutContainerRef} className="space-y-4">
                    <div className="rounded-2xl border border-[#c8dae6] bg-[#f5fbff] px-4 py-3 text-sm font-medium text-[#36546c]">
                      Step 2: secure checkout is ready below. To change the amount or email, go back to donation
                      details first.
                    </div>
                    <CheckoutProvider stripe={stripePromise} options={checkoutOptions}>
                      <CheckoutForm
                        amountLabel={amountLabel}
                        onIntentionalNavigationChange={setIsIntentionalNavigationPending}
                      />
                    </CheckoutProvider>
                    <button
                      type="button"
                      onClick={resetCheckoutState}
                      className="w-full text-center text-sm font-semibold text-[#4f667b] underline-offset-4 transition-colors duration-200 hover:text-[#223b54] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2f6272] focus-visible:ring-offset-2"
                    >
                      Change Donation Details
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
