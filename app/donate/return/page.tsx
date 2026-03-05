import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Clock3, ShieldAlert, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getStripeClient } from "@/lib/stripe"

interface DonateReturnPageProps {
  searchParams: Promise<{
    payment_intent?: string | string[]
    session_id?: string | string[]
  }>
}

interface ReturnPageState {
  title: string
  detail: string
  amountText: string
  iconVariant: "success" | "processing" | "warning" | "failure"
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

function getFirstQueryValue(value?: string | string[]): string | undefined {
  return Array.isArray(value) ? value[0] : value
}

function getDefaultReturnPageState(): ReturnPageState {
  return {
    title: "Donation Status",
    detail: "We couldn't determine your payment status yet.",
    amountText: "",
    iconVariant: "warning",
  }
}

async function buildCheckoutSessionState(sessionId: string): Promise<ReturnPageState> {
  const stripe = getStripeClient()
  const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
  const amountText =
    checkoutSession.amount_total && checkoutSession.currency
      ? `Amount: ${formatAmount(checkoutSession.amount_total, checkoutSession.currency)}`
      : ""

  if (checkoutSession.status === "complete" && checkoutSession.payment_status === "paid") {
    return {
      title: "Donation Complete",
      detail: "Thank you for your donation. Stripe marked this checkout session as paid.",
      amountText,
      iconVariant: "success",
    }
  }

  if (checkoutSession.status === "complete") {
    return {
      title: "Donation Processing",
      detail: "Your donation was submitted and Stripe is still finalizing payment.",
      amountText,
      iconVariant: "processing",
    }
  }

  if (checkoutSession.status === "open") {
    return {
      title: "Donation Not Completed",
      detail: "The checkout session is still open and payment has not been completed yet.",
      amountText,
      iconVariant: "failure",
    }
  }

  return {
    title: "Checkout Expired",
    detail: "This checkout session expired before the donation was completed.",
    amountText,
    iconVariant: "failure",
  }
}

async function buildPaymentIntentState(paymentIntentId: string): Promise<ReturnPageState> {
  const stripe = getStripeClient()
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  const amountText = paymentIntent.amount
    ? `Amount: ${formatAmount(paymentIntent.amount, paymentIntent.currency)}`
    : ""

  if (paymentIntent.status === "succeeded") {
    return {
      title: "Donation Complete",
      detail: "Thank you for your donation. Your payment was successful.",
      amountText,
      iconVariant: "success",
    }
  }

  if (paymentIntent.status === "processing") {
    return {
      title: "Donation Processing",
      detail: "Your payment is processing. Stripe will finalize this shortly.",
      amountText,
      iconVariant: "processing",
    }
  }

  if (paymentIntent.status === "requires_action") {
    return {
      title: "Additional Authentication Required",
      detail: "Stripe needs extra authentication to complete this donation.",
      amountText,
      iconVariant: "warning",
    }
  }

  if (paymentIntent.status === "requires_payment_method") {
    return {
      title: "Payment Not Completed",
      detail: "A valid payment method is still required to complete this donation.",
      amountText,
      iconVariant: "failure",
    }
  }

  if (paymentIntent.status === "canceled") {
    return {
      title: "Payment Canceled",
      detail: "This donation payment intent was canceled.",
      amountText,
      iconVariant: "failure",
    }
  }

  return {
    title: "Donation Status",
    detail: "Stripe returned a payment state that still needs review.",
    amountText,
    iconVariant: "warning",
  }
}

export default async function DonateReturnPage({ searchParams }: DonateReturnPageProps) {
  const resolvedParams = await searchParams
  const sessionId = getFirstQueryValue(resolvedParams.session_id)
  const paymentIntentId = getFirstQueryValue(resolvedParams.payment_intent)

  let returnPageState = getDefaultReturnPageState()

  if (!sessionId && !paymentIntentId) {
    returnPageState.detail = "Missing session_id or payment_intent in the return URL."
  } else {
    try {
      returnPageState = sessionId
        ? await buildCheckoutSessionState(sessionId)
        : await buildPaymentIntentState(paymentIntentId!)
    } catch {
      returnPageState.detail = "Unable to load donation status from Stripe."
    }
  }

  const icon =
    returnPageState.iconVariant === "success" ? (
      <CheckCircle2 className="h-10 w-10 text-primary" />
    ) : returnPageState.iconVariant === "processing" ? (
      <Clock3 className="h-10 w-10 text-primary" />
    ) : returnPageState.iconVariant === "failure" ? (
      <XCircle className="h-10 w-10 text-destructive" />
    ) : (
      <ShieldAlert className="h-10 w-10 text-primary" />
    )

  return (
    <main
      className="relative min-h-dvh overflow-hidden text-foreground"
      style={{
        background:
          "linear-gradient(140deg, #4bb8ba 0%, #345576 34%, #223b54 66%, #15283a 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-45 mix-blend-soft-light"
        style={{
          backgroundImage:
            "radial-gradient(circle at 16% 10%, rgba(255,255,255,0.24), transparent 36%), radial-gradient(circle at 86% 4%, rgba(66,168,169,0.3), transparent 38%), repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px, transparent 2px, transparent 4px)",
          backgroundSize: "auto, auto, 6px 6px",
        }}
      />

      <div className="relative mx-auto flex min-h-dvh w-full max-w-3xl items-center px-4 py-12 sm:px-6">
        <div className="w-full rounded-3xl border border-border bg-secondary p-6 shadow-2xl md:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="space-y-3">
              <Image
                src="/Nate-the-great-logo.png"
                alt="Nate the Great"
                width={170}
                height={90}
                className="h-auto w-[130px] sm:w-[165px]"
              />
              {icon}
            </div>
            <Image
              src="/nate shark.png"
              alt="Nate shark"
              width={80}
              height={80}
              className="h-auto w-14 sm:w-16"
            />
          </div>

          <h1 className="text-3xl md:text-4xl">{returnPageState.title}</h1>
          <p className="mt-3 text-base text-muted-foreground">{returnPageState.detail}</p>
          {returnPageState.amountText ? (
            <p className="mt-2 text-lg text-foreground">{returnPageState.amountText}</p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/donate">Back to Donation Page</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-11 rounded-xl border-border bg-background/40 hover:bg-background/70"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
