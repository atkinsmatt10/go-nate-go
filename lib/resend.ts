import "server-only"
import { Resend } from "resend"

let resendClient: Resend | null = null

export function getResendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY environment variable")
  }

  if (!resendClient) {
    resendClient = new Resend(apiKey)
  }

  return resendClient
}

export function getResendFromEmail(): string {
  const fromEmail = process.env.RESEND_FROM_EMAIL?.trim()

  if (!fromEmail) {
    throw new Error("Missing RESEND_FROM_EMAIL environment variable")
  }

  return fromEmail
}

export function getResendReplyToEmail(): string | undefined {
  const replyToEmail = process.env.RESEND_REPLY_TO_EMAIL?.trim()
  return replyToEmail || undefined
}
