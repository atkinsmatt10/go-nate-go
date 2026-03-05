import Image from "next/image"
import Link from "next/link"
import { CheckCircle2, Clock3, ShieldAlert, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getStripeClient } from "@/lib/stripe"

interface DonateReturnPageProps {
  searchParams: Promise<{
    payment_intent?: string | string[]
  }>
}

function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100)
}

export default async function DonateReturnPage({ searchParams }: DonateReturnPageProps) {
  const resolvedParams = await searchParams
  const paymentIntentParam = resolvedParams.payment_intent
  const paymentIntentId = Array.isArray(paymentIntentParam)
    ? paymentIntentParam[0]
    : paymentIntentParam

  let title = "Donation Status"
  let detail = "We couldn't determine your payment status yet."
  let amountText = ""
  let iconVariant: "success" | "processing" | "warning" | "failure" = "warning"

  if (!paymentIntentId) {
    detail = "Missing payment_intent in the return URL."
  } else {
    try {
      const stripe = getStripeClient()
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

      if (paymentIntent.status === "succeeded") {
        title = "Donation Complete"
        detail = "Thank you for your donation. Your payment was successful."
        iconVariant = "success"
      } else if (paymentIntent.status === "processing") {
        title = "Donation Processing"
        detail = "Your payment is processing. Stripe will finalize this shortly."
        iconVariant = "processing"
      } else if (paymentIntent.status === "requires_action") {
        title = "Additional Authentication Required"
        detail = "Stripe needs extra authentication to complete this donation."
        iconVariant = "warning"
      } else if (paymentIntent.status === "requires_payment_method") {
        title = "Payment Not Completed"
        detail = "A valid payment method is still required to complete this donation."
        iconVariant = "failure"
      } else if (paymentIntent.status === "canceled") {
        title = "Payment Canceled"
        detail = "This donation payment intent was canceled."
        iconVariant = "failure"
      }

      amountText = paymentIntent.amount
        ? `Amount: ${formatAmount(paymentIntent.amount, paymentIntent.currency)}`
        : ""
    } catch {
      detail = "Unable to load payment status from Stripe."
    }
  }

  const icon =
    iconVariant === "success" ? (
      <CheckCircle2 className="h-10 w-10 text-primary" />
    ) : iconVariant === "processing" ? (
      <Clock3 className="h-10 w-10 text-primary" />
    ) : iconVariant === "failure" ? (
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

          <h1 className="text-3xl md:text-4xl">{title}</h1>
          <p className="mt-3 text-base text-muted-foreground">{detail}</p>
          {amountText ? <p className="mt-2 text-lg text-foreground">{amountText}</p> : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-11 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/donate">Back to Donation Page</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-11 rounded-xl border-border bg-background/40 hover:bg-background/70">
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
