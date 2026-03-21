/* eslint-disable @next/next/no-img-element */

interface DonationReceiptEmailProps {
  amountText: string
  deliveredByText: string
  donationDateText: string
  donationLabel: string
  donationTimeText: string
  paymentMethodText: string
  receiptEmailedText: string
  receiptNumber: string
  recipientEmail: string
  replyToSupportText: string
  siteOrigin: string
  statusPageUrl: string
  stripeSenderText: string
  supportEmail: string
  supportPhone: string
}

const colors = {
  border: "#D8E8F2",
  dark: "#304964",
  ink: "#223B54",
  lightBlue: "#EAF3FB",
  muted: "#6D8398",
  pale: "#EEF5FB",
  paleBorder: "#DCEAF4",
  pill: "#42A8A924",
  shell: "#F7FBFF",
  snow: "#F7FBFF",
  teal: "#42A8A9",
  white: "#FFFFFF",
}

const bodyFontFamily = '"Work Sans", Arial, Helvetica, sans-serif'
const headingFontFamily = '"Lilita One", "Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif'

export function DonationReceiptEmail({
  amountText,
  deliveredByText,
  donationDateText,
  donationLabel,
  donationTimeText,
  paymentMethodText,
  receiptEmailedText,
  receiptNumber,
  recipientEmail,
  replyToSupportText,
  siteOrigin,
  statusPageUrl,
  stripeSenderText,
  supportEmail,
  supportPhone,
}: DonationReceiptEmailProps) {
  const sharkUrl = `${siteOrigin}/nate%20shark.png`
  const footerMetaText = `Go Nate Go donation receipt\nReceipt #${receiptNumber}`

  return (
    <html>
      <body
        style={{
          margin: 0,
          backgroundColor: colors.lightBlue,
          color: colors.ink,
          fontFamily: bodyFontFamily,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ display: "none", maxHeight: 0, overflow: "hidden", opacity: 0 }}>
          Thank you for showing up for Nate. Your donation receipt is below.
        </div>
        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{ width: "100%", borderCollapse: "collapse", backgroundColor: colors.lightBlue }}
        >
          <tbody>
            <tr>
              <td align="center" style={{ padding: "44px 16px 72px" }}>
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    width: "100%",
                    maxWidth: "640px",
                    borderCollapse: "collapse",
                    backgroundColor: colors.shell,
                    border: `1px solid ${colors.border}`,
                    borderRadius: "36px",
                    overflow: "hidden",
                    boxShadow: "0 28px 60px rgba(42,63,84,0.12)",
                  }}
                >
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "28px 28px 32px",
                          background: "linear-gradient(180deg, #304964 0%, #36506a 100%)",
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
                              <td style={{ paddingBottom: "18px" }}>
                                <table
                                  role="presentation"
                                  width="100%"
                                  cellPadding="0"
                                  cellSpacing="0"
                                  style={{ width: "100%", borderCollapse: "collapse" }}
                                >
                                  <tbody>
                                    <tr>
                                      <td style={{ verticalAlign: "top" }}>
                                        <table
                                          role="presentation"
                                          cellPadding="0"
                                          cellSpacing="0"
                                          style={{ borderCollapse: "collapse" }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  width: "56px",
                                                  paddingRight: "14px",
                                                  verticalAlign: "top",
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    width: "56px",
                                                    height: "56px",
                                                    borderRadius: "999px",
                                                    backgroundColor: "rgba(239,245,251,0.16)",
                                                    border: "1px solid rgba(216,239,245,0.3)",
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  <img
                                                    src={sharkUrl}
                                                    alt="Go Nate Go"
                                                    width="40"
                                                    style={{
                                                      display: "block",
                                                      width: "40px",
                                                      height: "40px",
                                                      margin: "8px auto 0",
                                                    }}
                                                  />
                                                </div>
                                              </td>
                                              <td style={{ verticalAlign: "middle" }}>
                                                <div
                                                  style={{
                                                    color: colors.snow,
                                                    fontFamily: headingFontFamily,
                                                    fontSize: "26px",
                                                    lineHeight: "1.05",
                                                  }}
                                                >
                                                  Go Nate Go
                                                </div>
                                                <div
                                                  style={{
                                                    marginTop: "4px",
                                                    color: "#BFECEF",
                                                    fontSize: "12px",
                                                    letterSpacing: "1.1px",
                                                    lineHeight: "1.3",
                                                    textTransform: "uppercase",
                                                  }}
                                                >
                                                  Donation receipt for Nate&apos;s fundraiser
                                                </div>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td style={{ textAlign: "right", verticalAlign: "top" }}>
                                        <span
                                          style={{
                                            display: "inline-block",
                                            padding: "10px 14px",
                                            borderRadius: "999px",
                                            backgroundColor: colors.pill,
                                            border: "1px solid rgba(159,197,216,0.35)",
                                            color: "#BFECEF",
                                            fontSize: "11px",
                                            letterSpacing: "1.2px",
                                            lineHeight: "1.2",
                                            textTransform: "uppercase",
                                          }}
                                        >
                                          Donation Receipt
                                        </span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <div
                                  style={{
                                    color: colors.snow,
                                    fontFamily: headingFontFamily,
                                    fontSize: "42px",
                                    lineHeight: "1.02",
                                  }}
                                >
                                  Thank You For Showing Up For Nate
                                </div>
                                <div
                                  style={{
                                    marginTop: "10px",
                                    color: "rgba(247,251,255,0.9)",
                                    fontSize: "18px",
                                    lineHeight: "1.6",
                                  }}
                                >
                                  Your donation receipt is below. This gift supports Nate&apos;s
                                  fundraiser for CHOP childhood cancer care and research, and means a
                                  great deal to our family.
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "0 20px" }}>
                        <div
                          style={{
                            marginTop: "-18px",
                            background:
                              "linear-gradient(180deg, rgba(248,252,255,1) 0%, rgba(244,249,253,1) 100%)",
                            border: "1px solid #D8EFF5",
                            borderRadius: "30px",
                            padding: "22px",
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
                                <td style={{ verticalAlign: "bottom", paddingBottom: "18px" }}>
                                  <table
                                    role="presentation"
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    style={{ width: "100%", borderCollapse: "collapse" }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td style={{ verticalAlign: "bottom" }}>
                                          <div
                                            style={{
                                              color: colors.teal,
                                              fontSize: "12px",
                                              letterSpacing: "1.2px",
                                              lineHeight: "1.2",
                                              textTransform: "uppercase",
                                            }}
                                          >
                                            Amount Paid
                                          </div>
                                          <div
                                            style={{
                                              marginTop: "6px",
                                              color: colors.ink,
                                              fontFamily: headingFontFamily,
                                              fontSize: "52px",
                                              lineHeight: "1",
                                            }}
                                          >
                                            {amountText}
                                          </div>
                                        </td>
                                        <td style={{ textAlign: "right", verticalAlign: "bottom" }}>
                                          <div
                                            style={{
                                              color: "#6A839B",
                                              fontSize: "12px",
                                              letterSpacing: "1.2px",
                                              lineHeight: "1.2",
                                              textTransform: "uppercase",
                                            }}
                                          >
                                            Receipt #{receiptNumber}
                                          </div>
                                          <div style={{ marginTop: "10px" }}>
                                            <span
                                              style={{
                                                display: "inline-block",
                                                padding: "10px 14px",
                                                borderRadius: "999px",
                                                backgroundColor: "#D8EFF5",
                                                border: "1px solid #9FC5D8",
                                                color: colors.ink,
                                                fontSize: "14px",
                                                lineHeight: "1.2",
                                              }}
                                            >
                                              {paymentMethodText}
                                            </span>
                                          </div>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <table
                                    role="presentation"
                                    width="100%"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    style={{ width: "100%", borderCollapse: "collapse" }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td style={{ width: "50%", paddingRight: "7px" }}>
                                          <InfoCard
                                            label="Date Paid"
                                            primaryText={donationDateText}
                                            secondaryText={donationTimeText}
                                          />
                                        </td>
                                        <td style={{ width: "50%", paddingLeft: "7px" }}>
                                          <InfoCard
                                            label="Donation For"
                                            primaryText="Team Nate the Great"
                                            secondaryText={`${donationLabel} × 1`}
                                          />
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "20px 20px 0" }}>
                        <Card>
                          <SectionEyebrow>Receipt Details</SectionEyebrow>
                          <BodyCopy>
                            Your Stripe receipt details, preserved in the Go Nate Go brand.
                          </BodyCopy>
                          <StripedDetailRows
                            rows={[
                              { label: "Sent to", value: recipientEmail },
                              { label: "Reply-to support", value: replyToSupportText },
                              { label: "Receipt emailed", value: receiptEmailedText },
                              { label: "Delivered by", value: deliveredByText },
                              { label: "Stripe sender", value: stripeSenderText },
                            ]}
                          />
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "20px 20px 0" }}>
                        <Card tint>
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                            style={{ width: "100%", borderCollapse: "collapse" }}
                          >
                            <tbody>
                              <tr>
                                <td style={{ verticalAlign: "top", paddingBottom: "16px" }}>
                                  <SectionEyebrow>Summary</SectionEyebrow>
                                  <div
                                    style={{
                                      marginTop: "6px",
                                      color: colors.ink,
                                      fontFamily: headingFontFamily,
                                      fontSize: "34px",
                                      lineHeight: "1.05",
                                    }}
                                  >
                                    Donation To Team Nate the Great
                                  </div>
                                </td>
                                <td style={{ textAlign: "right", verticalAlign: "top" }}>
                                  <span
                                    style={{
                                      display: "inline-block",
                                      padding: "8px 12px",
                                      borderRadius: "999px",
                                      backgroundColor: colors.white,
                                      border: "1px solid #CFE0EC",
                                      color: "#4F667D",
                                      fontSize: "13px",
                                      lineHeight: "1.2",
                                    }}
                                  >
                                    Qty 1
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={2}>
                                  <div
                                    style={{
                                      backgroundColor: colors.white,
                                      border: "1px solid #DBE8F2",
                                      borderRadius: "22px",
                                      overflow: "hidden",
                                    }}
                                  >
                                    <SummaryRow
                                      label="Donation to Team Nate the Great"
                                      detail={`${donationLabel} × 1`}
                                      value={amountText}
                                    />
                                    <SummaryTotalRow label="Amount paid" value={amountText} />
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Card>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "20px 20px 24px" }}>
                        <Card>
                          <div
                            style={{
                              color: colors.ink,
                              fontFamily: headingFontFamily,
                              fontSize: "28px",
                              lineHeight: "1.05",
                            }}
                          >
                            Questions About Your Donation?
                          </div>
                          <BodyCopy>
                            Contact Nate the Great at{" "}
                            <a
                              href={`mailto:${supportEmail}`}
                              style={{ color: colors.ink, fontWeight: 700, textDecoration: "none" }}
                            >
                              {supportEmail}
                            </a>{" "}
                            or call{" "}
                            <span style={{ color: colors.ink, fontWeight: 700 }}>{supportPhone}</span>.
                          </BodyCopy>
                          <div
                            style={{
                              marginTop: "4px",
                              backgroundColor: colors.pale,
                              border: `1px solid ${colors.paleBorder}`,
                              borderRadius: "22px",
                              padding: "16px 18px",
                            }}
                          >
                            <div style={{ fontSize: "14px", lineHeight: "1.55", color: "#4F667D" }}>
                              Something wrong with the email?{" "}
                              <a
                                href={statusPageUrl}
                                style={{ color: colors.ink, fontWeight: 700, textDecoration: "none" }}
                              >
                                View it in your browser.
                              </a>
                            </div>
                            <div
                              style={{
                                marginTop: "12px",
                                fontSize: "14px",
                                lineHeight: "1.55",
                                color: "#4F667D",
                              }}
                            >
                              You&apos;re receiving this email because you made a donation to Nate the
                              Great, which partners with Stripe to provide invoicing and payment
                              processing.
                            </div>
                          </div>
                          <table
                            role="presentation"
                            width="100%"
                            cellPadding="0"
                            cellSpacing="0"
                            style={{ width: "100%", borderCollapse: "collapse", marginTop: "18px" }}
                          >
                            <tbody>
                              <tr>
                                <td style={{ verticalAlign: "middle" }}>
                                  <table
                                    role="presentation"
                                    cellPadding="0"
                                    cellSpacing="0"
                                    style={{ borderCollapse: "collapse" }}
                                  >
                                    <tbody>
                                      <tr>
                                        <td style={{ width: "42px", paddingRight: "10px" }}>
                                          <div
                                            style={{
                                              width: "42px",
                                              height: "42px",
                                              borderRadius: "999px",
                                              backgroundColor: "#D8EFF5",
                                              textAlign: "center",
                                            }}
                                          >
                                            <img
                                              src={sharkUrl}
                                              alt="Go Nate Go"
                                              width="30"
                                              style={{
                                                display: "block",
                                                width: "30px",
                                                height: "30px",
                                                margin: "6px auto 0",
                                              }}
                                            />
                                          </div>
                                        </td>
                                        <td
                                          style={{
                                            color: colors.muted,
                                            fontSize: "13px",
                                            lineHeight: "1.5",
                                            whiteSpace: "pre-line",
                                          }}
                                        >
                                          {footerMetaText}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                                <td
                                  style={{
                                    textAlign: "right",
                                    verticalAlign: "middle",
                                    color: colors.muted,
                                    fontSize: "13px",
                                    lineHeight: "1.5",
                                  }}
                                >
                                  Nate the Great
                                  <br />
                                  {donationDateText}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </Card>
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

interface CardProps {
  children: React.ReactNode
  tint?: boolean
}

function Card({ children, tint = false }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: tint ? colors.pale : colors.white,
        border: `1px solid ${tint ? colors.paleBorder : "#E1EAF2"}`,
        borderRadius: "28px",
        boxShadow: tint ? "none" : "0 10px 26px rgba(42,63,84,0.06)",
        padding: "24px",
      }}
    >
      {children}
    </div>
  )
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: colors.teal,
        fontSize: "12px",
        letterSpacing: "1.2px",
        lineHeight: "1.2",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  )
}

function BodyCopy({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: "6px",
        color: "#4F667D",
        fontSize: "18px",
        lineHeight: "1.55",
      }}
    >
      {children}
    </div>
  )
}

interface InfoCardProps {
  label: string
  primaryText: string
  secondaryText: string
}

function InfoCard({ label, primaryText, secondaryText }: InfoCardProps) {
  return (
    <div
      style={{
        backgroundColor: colors.white,
        border: "1px solid #E0EAF2",
        borderRadius: "22px",
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          color: "#7A90A6",
          fontSize: "11px",
          letterSpacing: "1px",
          lineHeight: "1.2",
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
      <div
        style={{
          marginTop: "6px",
          color: colors.ink,
          fontSize: "18px",
          fontWeight: 700,
          lineHeight: "1.45",
        }}
      >
        {primaryText}
      </div>
      <div style={{ color: "#5D7389", fontSize: "15px", lineHeight: "1.45" }}>{secondaryText}</div>
    </div>
  )
}

interface StripedDetailRowsProps {
  rows: ReadonlyArray<{ label: string; value: string }>
}

function StripedDetailRows({ rows }: StripedDetailRowsProps) {
  return (
    <div
      style={{
        marginTop: "16px",
        border: "1px solid #E5EEF5",
        borderRadius: "22px",
        overflow: "hidden",
      }}
    >
      {rows.map((row, index) => (
        <div
          key={row.label}
          style={{
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
            padding: "16px 18px",
            backgroundColor: index % 2 === 0 ? "#F9FCFF" : colors.white,
          }}
        >
          <div style={{ color: "#6F859A", fontSize: "14px", lineHeight: "1.45" }}>{row.label}</div>
          <div
            style={{
              color: colors.ink,
              fontSize: "15px",
              fontWeight: 700,
              lineHeight: "1.45",
              textAlign: "right",
            }}
          >
            {row.value}
          </div>
        </div>
      ))}
    </div>
  )
}

interface SummaryRowProps {
  detail: string
  label: string
  value: string
}

function SummaryRow({ detail, label, value }: SummaryRowProps) {
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
          <td style={{ padding: "18px", verticalAlign: "top" }}>
            <div style={{ color: colors.ink, fontSize: "17px", fontWeight: 700, lineHeight: "1.45" }}>
              {label}
            </div>
            <div style={{ color: "#6E859A", fontSize: "14px", lineHeight: "1.45" }}>{detail}</div>
          </td>
          <td
            style={{
              padding: "18px",
              verticalAlign: "top",
              textAlign: "right",
              color: colors.ink,
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "1.45",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  )
}

function SummaryTotalRow({ label, value }: { label: string; value: string }) {
  return (
    <table
      role="presentation"
      width="100%"
      cellPadding="0"
      cellSpacing="0"
      style={{
        width: "100%",
        borderCollapse: "collapse",
        borderTop: "1px solid #E5EEF5",
        backgroundColor: "#F8FBFE",
      }}
    >
      <tbody>
        <tr>
          <td style={{ padding: "18px", color: "#4F667D", fontSize: "15px", lineHeight: "1.45" }}>
            {label}
          </td>
          <td
            style={{
              padding: "18px",
              textAlign: "right",
              color: colors.ink,
              fontSize: "22px",
              fontWeight: 800,
              lineHeight: "1.2",
              whiteSpace: "nowrap",
            }}
          >
            {value}
          </td>
        </tr>
      </tbody>
    </table>
  )
}
