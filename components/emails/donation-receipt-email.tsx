/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-page-custom-font */

import { Button, Preview } from "@react-email/components"
import type { ReactNode } from "react"

interface DonationReceiptEmailProps {
  amountText: string
  donationDateText: string
  donationLabel: string
  paymentMethodText: string
  receiptNumberText?: string
  recipientEmail: string
  siteOrigin: string
  supportEmail: string
}

const colors = {
  body: "#3D5D81",
  blue: "#2A3F54",
  border: "#D8EFF5",
  heroLabel: "#7FAFC4",
  heroSub: "#D8EFF5",
  ink: "#223B54",
  mist: "#EEF5FB",
  muted: "#4A6F84",
  snow: "#F7FBFF",
  teal: "#42A8A9",
  tealDark: "#1E7A7B",
  white: "#FFFFFF",
}

const bodyFontFamily = '"Work Sans", Arial, Helvetica, sans-serif'
const headingFontFamily = '"Lilita One", "Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif'

const merchItems = [
  {
    href: "https://shop.gonatego.com/products/unisex-garment-dyed-heavyweight-t-shirt",
    imagePath: "/unisex-garment-dyed-heavyweight-t-shirt-navy-front-68a5f15854564.jpg",
    label: "Tee",
    price: "$35",
  },
  {
    href: "https://shop.gonatego.com/products/unisex-premium-sweatshirt",
    imagePath: "/unisex-premium-sweatshirt-navy-blazer-front-68a5f05c76dd3.jpg",
    label: "Crew",
    price: "$55",
  },
  {
    href: "https://shop.gonatego.com/products/waffle-beanie",
    imagePath: "/waffle-beanie-navy-front-68a5f0a9e7b3c.jpg",
    label: "Hat",
    price: "$25",
  },
] as const

export function DonationReceiptEmail({
  amountText,
  donationDateText,
  donationLabel,
  paymentMethodText,
  receiptNumberText,
  recipientEmail,
  siteOrigin,
  supportEmail,
}: DonationReceiptEmailProps) {
  const sharkUrl = `${siteOrigin}/nate%20shark.png`
  const donationForText = formatDonationForLabel(donationLabel)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>Your Go Nate Go donation receipt</title>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lilita+One&family=Work+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          backgroundColor: colors.mist,
          color: colors.body,
          fontFamily: bodyFontFamily,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <Preview>Thank you for showing up for Nate. Your donation receipt is below.</Preview>
        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", backgroundColor: colors.mist }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "24px 16px 36px" }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{ width: "100%", maxWidth: "600px", borderCollapse: "collapse" }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "36px 32px 32px",
                          backgroundColor: colors.blue,
                          borderBottomLeftRadius: "32px",
                          borderBottomRightRadius: "32px",
                        }}
                      >
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          style={{ width: "100%", borderCollapse: "collapse" }}
                        >
                          <tbody>
                            <tr>
                              <td align="center" style={{ paddingBottom: "12px" }}>
                                <table
                                  role="presentation"
                                  cellPadding="0"
                                  cellSpacing="0"
                                  style={{ borderCollapse: "collapse" }}
                                >
                                  <tbody>
                                    <tr>
                                      <td style={{ width: "36px", paddingRight: "10px" }}>
                                        <img
                                          src={sharkUrl}
                                          alt="Go Nate Go"
                                          width="36"
                                          style={{
                                            display: "block",
                                            width: "36px",
                                            height: "36px",
                                            objectFit: "contain",
                                          }}
                                        />
                                      </td>
                                      <td
                                        style={{
                                          color: colors.teal,
                                          fontFamily: bodyFontFamily,
                                          fontSize: "18px",
                                          fontWeight: 800,
                                          letterSpacing: "-0.02em",
                                          lineHeight: "1.2",
                                        }}
                                      >
                                        Go Nate Go
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="center"
                                style={{
                                  paddingBottom: "24px",
                                  color: colors.heroLabel,
                                  fontSize: "14px",
                                  letterSpacing: "2px",
                                  lineHeight: "1.15",
                                  textTransform: "uppercase",
                                }}
                              >
                                Donation Receipt
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="center"
                                style={{
                                  color: colors.white,
                                  fontFamily: headingFontFamily,
                                  fontSize: "32px",
                                  lineHeight: "1.08",
                                  paddingBottom: "18px",
                                }}
                              >
                                Thank You For
                                <br />
                                Showing Up For Nate
                              </td>
                            </tr>
                            <tr>
                              <td
                                align="center"
                                style={{
                                  color: colors.heroSub,
                                  fontSize: "15px",
                                  lineHeight: "1.6",
                                }}
                              >
                                Your gift supports Nate&apos;s fundraiser for CHOP childhood cancer
                                care and research.
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td
                        align="center"
                        style={{ padding: "28px 32px 0", textAlign: "center" }}
                      >
                        <div
                          style={{
                            color: colors.tealDark,
                            fontSize: "13px",
                            fontWeight: 500,
                            letterSpacing: "2px",
                            lineHeight: "1.15",
                            textTransform: "uppercase",
                          }}
                        >
                          Amount Paid
                        </div>
                        <div
                          style={{
                            color: colors.ink,
                            fontFamily: headingFontFamily,
                            fontSize: "48px",
                            lineHeight: "1",
                            marginTop: "10px",
                          }}
                        >
                          {amountText}
                        </div>
                        <div style={{ marginTop: "12px" }}>
                          <span
                            style={{
                              display: "inline-block",
                              padding: "8px 14px",
                              borderRadius: "20px",
                              backgroundColor: colors.mist,
                              border: `1px solid ${colors.border}`,
                              color: colors.ink,
                              fontSize: "13px",
                              fontWeight: 600,
                              lineHeight: "1.2",
                            }}
                          >
                            {paymentMethodText}
                          </span>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "20px 24px 0" }}>
                        <Card>
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                            style={{ width: "100%", borderCollapse: "collapse" }}
                          >
                            <tbody>
                              <tr>
                                <td
                                  style={{
                                    color: colors.ink,
                                    fontFamily: headingFontFamily,
                                    fontSize: "18px",
                                    lineHeight: "1.2",
                                    paddingBottom: "18px",
                                  }}
                                >
                                  Receipt Details
                                </td>
                                <td
                                  align="right"
                                  style={{
                                    paddingBottom: "18px",
                                    color: colors.muted,
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    lineHeight: "1.2",
                                  }}
                                >
                                  {receiptNumberText || ""}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <DetailRow label="Date" value={donationDateText} />
                          <DetailRow label="Donation for" value={donationForText} />
                          <DetailRow label="Sent to" value={recipientEmail} />
                          <DetailRow
                            label="Total"
                            value={amountText}
                            valueColor={colors.teal}
                            valueWeight={800}
                          />
                        </Card>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "12px 24px 0" }}>
                        <CenteredCard>
                          <IconCircle backgroundColor={colors.teal}>
                            <div
                              style={{
                                color: colors.white,
                                fontSize: "22px",
                                fontWeight: 700,
                                lineHeight: "24px",
                                textAlign: "center",
                              }}
                            >
                              {"\u2665"}
                            </div>
                          </IconCircle>
                          <CardHeading>Every Dollar Counts</CardHeading>
                          <CardBody>
                            100% of your donation goes directly to CHOP&apos;s childhood cancer care
                            and research programs. Thank you for being part of Team Nate.
                          </CardBody>
                        </CenteredCard>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ padding: "12px 24px 0" }}>
                        <CenteredCard>
                          <IconCircle backgroundColor={colors.blue}>
                            <img
                              src={sharkUrl}
                              alt=""
                              width="24"
                              height="24"
                              style={{
                                display: "block",
                                width: "24px",
                                height: "24px",
                                margin: "0 auto",
                                objectFit: "contain",
                              }}
                            />
                          </IconCircle>
                          <CardHeading>Rep Team Nate!</CardHeading>
                          <CardBody>
                            Show your support with exclusive Nate the Great merch. Every purchase
                            helps fund childhood cancer research.
                          </CardBody>
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                            style={{ width: "100%", borderCollapse: "collapse", marginTop: "4px" }}
                          >
                            <tbody>
                              <tr>
                                {merchItems.map((item) => (
                                  <td
                                    key={item.href}
                                    width="33.33%"
                                    style={{ padding: "0 4px", verticalAlign: "top" }}
                                  >
                                    <a
                                      href={item.href}
                                      style={{ textDecoration: "none", color: colors.ink }}
                                    >
                                      <div
                                        style={{
                                          backgroundColor: "#F1F7FB",
                                          borderRadius: "18px",
                                          padding: "12px 6px 14px",
                                          textAlign: "center",
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: "80px",
                                            height: "80px",
                                            margin: "0 auto 10px",
                                            borderRadius: "12px",
                                            backgroundColor: colors.blue,
                                            overflow: "hidden",
                                          }}
                                        >
                                          <img
                                            src={`${siteOrigin}${item.imagePath}`}
                                            alt={item.label}
                                            width="80"
                                            height="80"
                                            style={{
                                              display: "block",
                                              width: "80px",
                                              height: "80px",
                                              objectFit: "cover",
                                            }}
                                          />
                                        </div>
                                        <div
                                          style={{
                                            fontSize: "15px",
                                            fontWeight: 700,
                                            lineHeight: "1.25",
                                          }}
                                        >
                                          {item.label}
                                        </div>
                                        <div
                                          style={{
                                            color: colors.teal,
                                            fontSize: "14px",
                                            lineHeight: "1.25",
                                            marginTop: "6px",
                                          }}
                                        >
                                          {item.price}
                                        </div>
                                      </div>
                                    </a>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                          <div style={{ marginTop: "4px" }}>
                            <BulletproofButton href="https://shop.gonatego.com">Shop</BulletproofButton>
                          </div>
                        </CenteredCard>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style={{ padding: "28px 32px 40px" }}>
                        <div
                          style={{
                            color: colors.body,
                            fontSize: "14px",
                            lineHeight: "1.5",
                            textAlign: "center",
                          }}
                        >
                          Questions about your donation?
                        </div>
                        <div style={{ marginTop: "16px" }}>
                          <BulletproofButton href={`mailto:${supportEmail}`}>
                            Contact Nate the Great
                          </BulletproofButton>
                        </div>
                        <div
                          style={{
                            marginTop: "14px",
                            color: colors.muted,
                            fontSize: "16px",
                            lineHeight: "1.4",
                            textAlign: "center",
                          }}
                        >
                          <a
                            href={`mailto:${supportEmail}`}
                            style={{ color: colors.muted, textDecoration: "none" }}
                          >
                            {supportEmail}
                          </a>
                        </div>
                        <div
                          style={{
                            width: "40px",
                            height: "1px",
                            backgroundColor: "#D6E3EC",
                            margin: "18px auto 0",
                          }}
                        />
                        <div
                          style={{
                            marginTop: "18px",
                            color: colors.muted,
                            fontSize: "13px",
                            lineHeight: "1.55",
                            textAlign: "center",
                          }}
                        >
                          You&apos;re receiving this email because you made a donation to Nate the
                          Great, which partners with Stripe to provide invoicing and payment
                          processing.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  )
}

interface ButtonLinkProps {
  children: ReactNode
  href: string
}

function BulletproofButton({ children, href }: ButtonLinkProps) {
  return (
    <Button
      href={href}
      style={{
        backgroundColor: colors.teal,
        borderRadius: "24px",
        boxSizing: "border-box",
        color: colors.white,
        display: "inline-block",
        fontFamily: bodyFontFamily,
        fontSize: "14px",
        fontWeight: 600,
        lineHeight: "14px",
        minWidth: "217px",
        padding: "16px 32px",
        textAlign: "center",
        textDecoration: "none",
      }}
    >
      {children}
    </Button>
  )
}

interface CardProps {
  children: ReactNode
}

function Card({ children }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: `1px solid ${colors.border}`,
        borderRadius: "24px",
        padding: "24px",
      }}
    >
      {children}
    </div>
  )
}

function CenteredCard({ children }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: colors.snow,
        border: `1px solid ${colors.border}`,
        borderRadius: "24px",
        padding: "28px 24px",
        textAlign: "center",
      }}
    >
      {children}
    </div>
  )
}

function CardHeading({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: colors.ink,
        fontFamily: headingFontFamily,
        fontSize: "18px",
        lineHeight: "1.2",
        marginTop: "16px",
      }}
    >
      {children}
    </div>
  )
}

function CardBody({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        color: colors.body,
        fontSize: "14px",
        lineHeight: "1.6",
        marginTop: "12px",
      }}
    >
      {children}
    </div>
  )
}

function IconCircle({
  backgroundColor,
  children,
}: {
  backgroundColor: string
  children: ReactNode
}) {
  return (
    <div
      style={{
        width: "44px",
        height: "44px",
        margin: "0 auto",
        borderRadius: "22px",
        backgroundColor,
        textAlign: "center",
        lineHeight: 0,
      }}
    >
      <div style={{ paddingTop: "10px" }}>{children}</div>
    </div>
  )
}

interface DetailRowProps {
  label: string
  value: string
  valueColor?: string
  valueWeight?: number
}

function DetailRow({
  label,
  value,
  valueColor = colors.ink,
  valueWeight = 700,
}: DetailRowProps) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{ width: "100%", borderCollapse: "collapse" }}
    >
      <tbody>
        <tr>
          <td
            style={{
              borderTop: `1px solid ${colors.border}`,
              color: colors.muted,
              fontSize: "14px",
              lineHeight: "1.5",
              padding: "14px 0",
            }}
          >
            {label}
          </td>
          <td
            align="right"
            style={{
              borderTop: `1px solid ${colors.border}`,
              color: valueColor,
              fontSize: "14px",
              fontWeight: valueWeight,
              lineHeight: "1.5",
              padding: "14px 0",
            }}
          >
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function formatDonationForLabel(donationLabel: string): string {
  return donationLabel.replace(/^Donation to /, "").trim() || donationLabel
}
