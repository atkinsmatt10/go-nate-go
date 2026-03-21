/* eslint-disable @next/next/no-img-element */

interface DonationReceiptEmailProps {
  amountText: string
  donationDateText: string
  donationLabel: string
  paymentMethodText: string
  receiptNumber: string
  recipientEmail: string
  replyToEmail?: string
  siteOrigin: string
  statusPageUrl: string
  supportPhone?: string
}

const colors = {
  ink: "#223B54",
  shell: "#2A3F54",
  section: "#3F5D81",
  teal: "#42A8A9",
  snow: "#F7FBFF",
  surface: "#EEF5FB",
  mist: "#D8EFF5",
  border: "#9FC5D8",
}

const bodyFontFamily = '"Work Sans", Arial, Helvetica, sans-serif'
const headingFontFamily = '"Lilita One", "Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif'

export function DonationReceiptEmail({
  amountText,
  donationDateText,
  donationLabel,
  paymentMethodText,
  receiptNumber,
  recipientEmail,
  replyToEmail,
  siteOrigin,
  statusPageUrl,
  supportPhone,
}: DonationReceiptEmailProps) {
  const logoUrl = `${siteOrigin}/Nate-the-great-logo.png`
  const sharkUrl = `${siteOrigin}/nate%20shark.png`

  return (
    <html>
      <body
        style={{
          margin: 0,
          backgroundColor: colors.shell,
          color: colors.ink,
          fontFamily: bodyFontFamily,
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ display: "none", maxHeight: 0, overflow: "hidden", opacity: 0 }}>
          Your Nate the Great donation receipt for {amountText}.
        </div>
        <table
          role="presentation"
          width="100%"
          cellPadding="0"
          cellSpacing="0"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background:
              "linear-gradient(180deg, rgba(42,63,84,1) 0%, rgba(63,93,129,1) 100%)",
          }}
        >
          <tbody>
            <tr>
              <td style={{ padding: "28px 16px" }} align="center">
                <table
                  role="presentation"
                  width="100%"
                  cellPadding="0"
                  cellSpacing="0"
                  style={{
                    width: "100%",
                    maxWidth: "640px",
                    borderCollapse: "collapse",
                  }}
                >
                  <tbody>
                    <tr>
                      <td style={{ paddingBottom: "16px", textAlign: "right" }}>
                        <a
                          href={statusPageUrl}
                          style={{
                            color: "#D8EFF5",
                            fontFamily: bodyFontFamily,
                            fontSize: "12px",
                            textDecoration: "underline",
                          }}
                        >
                          View donation status online
                        </a>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <table
                          role="presentation"
                          width="100%"
                          cellPadding="0"
                          cellSpacing="0"
                          style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            backgroundColor: colors.surface,
                            border: `1px solid ${colors.border}`,
                            borderRadius: "28px",
                            overflow: "hidden",
                            boxShadow: "0 18px 40px rgba(17, 39, 61, 0.24)",
                          }}
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  padding: "30px 28px 24px",
                                  background:
                                    "linear-gradient(145deg, #2A3F54 0%, #345576 48%, #42A8A9 100%)",
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
                                      <td style={{ verticalAlign: "top", paddingRight: "16px" }}>
                                        <img
                                          src={logoUrl}
                                          alt="Nate the Great"
                                          width="180"
                                          style={{
                                            display: "block",
                                            width: "180px",
                                            maxWidth: "100%",
                                            height: "auto",
                                            marginBottom: "18px",
                                          }}
                                        />
                                        <div
                                          style={{
                                            fontFamily: headingFontFamily,
                                            fontSize: "34px",
                                            lineHeight: "1.05",
                                            color: colors.snow,
                                          }}
                                        >
                                          Donation receipt
                                        </div>
                                        <div
                                          style={{
                                            marginTop: "10px",
                                            fontSize: "16px",
                                            lineHeight: "1.6",
                                            color: "#EAF5FA",
                                          }}
                                        >
                                          Thank you for showing up for Nate and for the families who
                                          depend on CHOP childhood cancer care and research.
                                        </div>
                                      </td>
                                      <td
                                        style={{
                                          width: "84px",
                                          textAlign: "right",
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <img
                                          src={sharkUrl}
                                          alt="Nate shark"
                                          width="68"
                                          style={{
                                            display: "inline-block",
                                            width: "68px",
                                            height: "auto",
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td style={{ padding: "28px" }}>
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
                                          padding: "0 0 20px",
                                          fontSize: "14px",
                                          lineHeight: "1.7",
                                          color: "#45627B",
                                        }}
                                      >
                                        This email was sent to <strong>{recipientEmail}</strong>. Keep
                                        it for your records.
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "20px" }}>
                                        <table
                                          role="presentation"
                                          width="100%"
                                          cellPadding="0"
                                          cellSpacing="0"
                                          style={{
                                            width: "100%",
                                            borderCollapse: "separate",
                                            borderSpacing: 0,
                                            backgroundColor: "#FFFFFF",
                                            border: `1px solid ${colors.border}`,
                                            borderRadius: "24px",
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  padding: "22px 22px 12px",
                                                  fontFamily: headingFontFamily,
                                                  fontSize: "24px",
                                                  color: colors.ink,
                                                }}
                                              >
                                                Receipt summary
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style={{ padding: "0 22px 22px" }}>
                                                <table
                                                  role="presentation"
                                                  width="100%"
                                                  cellPadding="0"
                                                  cellSpacing="0"
                                                  style={{
                                                    width: "100%",
                                                    borderCollapse: "collapse",
                                                  }}
                                                >
                                                  <tbody>
                                                    <ReceiptRow label="Receipt number" value={receiptNumber} />
                                                    <ReceiptRow label="Amount paid" value={amountText} emphasize />
                                                    <ReceiptRow label="Date paid" value={donationDateText} />
                                                    <ReceiptRow label="Payment method" value={paymentMethodText} />
                                                    <ReceiptRow
                                                      label="Donation"
                                                      value={`${donationLabel} × 1`}
                                                    />
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td style={{ paddingBottom: "20px" }}>
                                        <table
                                          role="presentation"
                                          width="100%"
                                          cellPadding="0"
                                          cellSpacing="0"
                                          style={{
                                            width: "100%",
                                            borderCollapse: "separate",
                                            borderSpacing: 0,
                                            backgroundColor: "#FFFFFF",
                                            border: `1px solid ${colors.border}`,
                                            borderRadius: "24px",
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  padding: "22px 22px 10px",
                                                  fontFamily: headingFontFamily,
                                                  fontSize: "22px",
                                                  color: colors.ink,
                                                }}
                                              >
                                                Need help?
                                              </td>
                                            </tr>
                                            <tr>
                                              <td
                                                style={{
                                                  padding: "0 22px 22px",
                                                  fontSize: "14px",
                                                  lineHeight: "1.7",
                                                  color: "#45627B",
                                                }}
                                              >
                                                Questions about this donation or your receipt can go to{" "}
                                                {replyToEmail ? (
                                                  <a
                                                    href={`mailto:${replyToEmail}`}
                                                    style={{ color: colors.teal, fontWeight: 700 }}
                                                  >
                                                    {replyToEmail}
                                                  </a>
                                                ) : (
                                                  "the fundraising team"
                                                )}
                                                {supportPhone ? (
                                                  <>
                                                    {" "}
                                                    or <span style={{ fontWeight: 700 }}>{supportPhone}</span>
                                                  </>
                                                ) : null}
                                                .
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td>
                                        <a
                                          href={statusPageUrl}
                                          style={{
                                            display: "inline-block",
                                            padding: "15px 22px",
                                            borderRadius: "18px",
                                            backgroundColor: colors.teal,
                                            color: "#FFFFFF",
                                            fontSize: "15px",
                                            fontWeight: 800,
                                            textDecoration: "none",
                                          }}
                                        >
                                          View donation status
                                        </a>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          paddingTop: "20px",
                                          fontSize: "12px",
                                          lineHeight: "1.7",
                                          color: "#5D7890",
                                        }}
                                      >
                                        Payment processing was completed by Stripe. This email confirms
                                        the donation payment details captured for Team Nate the Great.
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td
                                style={{
                                  padding: "0 28px 26px",
                                  fontSize: "12px",
                                  lineHeight: "1.7",
                                  color: "#5D7890",
                                }}
                              >
                                Nate the Great thanks you for every act of support. Your generosity
                                helps this fundraiser stay hopeful, personal, and focused on families
                                facing pediatric brain cancer.
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

interface ReceiptRowProps {
  label: string
  value: string
  emphasize?: boolean
}

function ReceiptRow({ label, value, emphasize = false }: ReceiptRowProps) {
  return (
    <tr>
      <td
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${colors.mist}`,
          fontSize: "13px",
          lineHeight: "1.5",
          color: "#5D7890",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </td>
      <td
        align="right"
        style={{
          padding: "12px 0",
          borderTop: `1px solid ${colors.mist}`,
          fontSize: emphasize ? "20px" : "15px",
          lineHeight: emphasize ? "1.2" : "1.5",
          color: colors.ink,
          fontWeight: emphasize ? 800 : 700,
        }}
      >
        {value}
      </td>
    </tr>
  )
}
