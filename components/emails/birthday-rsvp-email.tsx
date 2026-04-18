/* eslint-disable @next/next/no-head-element */
/* eslint-disable @next/next/no-page-custom-font */

import { Button, Preview } from "@react-email/components"

type BirthdayAttendance = "yes" | "no"
type BirthdayRsvpEmailVariant = "confirmation" | "reminder"

interface BirthdayRsvpEmailProps {
  attendeeCount: number
  attendance: BirthdayAttendance
  name: string
  siteOrigin: string
  variant: BirthdayRsvpEmailVariant
}

const colors = {
  blue: "#2A3F54",
  border: "#D8EFF5",
  gold: "#F2C66D",
  goldSoft: "#FFF1C2",
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
const birthdayCalendarTitle = "Nate is One Tough Cookie Birthday Party"
const birthdayCalendarDescription = "Celebrate Nate's first birthday at Craft Hall in Philadelphia."
const birthdayCalendarLocation = "Craft Hall, 901 N Delaware Ave, Philadelphia, PA 19123"
const birthdayCalendarStart = "2026-05-09T12:00:00-04:00"
const birthdayCalendarEnd = "2026-05-09T15:00:00-04:00"

export function BirthdayRsvpEmail({
  attendeeCount,
  attendance,
  name,
  siteOrigin,
  variant,
}: BirthdayRsvpEmailProps) {
  const isReminder = variant === "reminder"
  const isAttending = attendance === "yes"
  const partySizeLabel = formatPartySize(attendeeCount)
  const title = isReminder
    ? "Nate's Party Is Almost Here"
    : isAttending
      ? "Your RSVP Is In"
      : "Thanks For Letting Us Know"
  const eyebrow = isReminder ? "Party reminder" : "RSVP received"
  const previewText = isReminder
    ? "A quick reminder about Nate's first birthday party at Craft Hall tomorrow."
    : isAttending
      ? "Thanks for RSVPing to Nate's first birthday party. We've saved room for your crew."
      : "Thanks for sending your RSVP for Nate's first birthday party."
  const bodyCopy = isReminder
    ? `We’re excited to celebrate with you tomorrow. We’ve got ${partySizeLabel} down for cookies, hugs, and one very loved little shark.`
    : isAttending
      ? `Thanks for RSVPing, ${name}. We’ve got ${partySizeLabel} down for Nate’s birthday party and can’t wait to celebrate with you at Craft Hall.`
      : `Thanks for letting us know, ${name}. We’ll miss you at the party, and we really appreciate the heads up.`
  const buttonHref = isReminder ? `${siteOrigin}/birthday` : buildGoogleCalendarUrl()
  const buttonLabel = isReminder ? "Open party details" : "Add to calendar"

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1.0" name="viewport" />
        <title>{title}</title>
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
          color: colors.ink,
          fontFamily: bodyFontFamily,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <Preview>{previewText}</Preview>
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
                          padding: "36px 32px 28px",
                          backgroundColor: colors.blue,
                          borderBottomLeftRadius: "32px",
                          borderBottomRightRadius: "32px",
                        }}
                      >
                        <div
                          style={{
                            color: colors.goldSoft,
                            fontSize: "12px",
                            fontWeight: 800,
                            letterSpacing: "0.22em",
                            textAlign: "center",
                            textTransform: "uppercase",
                          }}
                        >
                          {eyebrow}
                        </div>
                        <div
                          style={{
                            color: colors.white,
                            fontFamily: headingFontFamily,
                            fontSize: "34px",
                            lineHeight: "1.05",
                            marginTop: "18px",
                            textAlign: "center",
                          }}
                        >
                          {title}
                        </div>
                        <div
                          style={{
                            color: colors.gold,
                            fontSize: "15px",
                            fontWeight: 700,
                            lineHeight: "1.5",
                            marginTop: "18px",
                            textAlign: "center",
                          }}
                        >
                          {birthdayCalendarTitle}
                        </div>
                        <div
                          style={{
                            color: colors.snow,
                            fontSize: "16px",
                            lineHeight: "1.7",
                            marginTop: "16px",
                            textAlign: "center",
                          }}
                        >
                          {bodyCopy}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ paddingTop: "24px" }}>
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            border: `1px solid ${colors.border}`,
                            borderRadius: "28px",
                            backgroundColor: colors.white,
                            overflow: "hidden",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ padding: "24px 24px 10px" }}>
                                <div
                                  style={{
                                    color: colors.tealDark,
                                    fontSize: "12px",
                                    fontWeight: 800,
                                    letterSpacing: "0.18em",
                                    textTransform: "uppercase",
                                  }}
                                >
                                  Event details
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: "0 24px 24px" }}>
                                <div
                                  style={{
                                    color: colors.ink,
                                    fontSize: "22px",
                                    fontWeight: 700,
                                    lineHeight: "1.3",
                                  }}
                                >
                                  Saturday, May 9, 2026
                                </div>
                                <div
                                  style={{
                                    color: colors.muted,
                                    fontSize: "16px",
                                    lineHeight: "1.7",
                                    marginTop: "8px",
                                  }}
                                >
                                  12 PM to 3 PM
                                  <br />
                                  Craft Hall
                                  <br />
                                  901 N Delaware Ave, Philadelphia, PA 19123
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: "0 24px 24px" }}>
                                <Button
                                  href={buttonHref}
                                  style={{
                                    backgroundColor: colors.gold,
                                    borderRadius: "18px",
                                    color: colors.ink,
                                    display: "inline-block",
                                    fontFamily: bodyFontFamily,
                                    fontSize: "15px",
                                    fontWeight: 800,
                                    padding: "14px 22px",
                                    textDecoration: "none",
                                  }}
                                >
                                  {buttonLabel}
                                </Button>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: "0 24px 24px" }}>
                                <a
                                  href={`${siteOrigin}/birthday`}
                                  style={{
                                    color: colors.tealDark,
                                    fontSize: "14px",
                                    fontWeight: 700,
                                    textDecorationColor: colors.teal,
                                    textUnderlineOffset: "3px",
                                  }}
                                >
                                  View the party page
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
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

function formatPartySize(attendeeCount: number): string {
  return `${attendeeCount} guest${attendeeCount === 1 ? "" : "s"}`
}

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
