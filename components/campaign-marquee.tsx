import type { JSX } from "react"

const rallyingCries = [
  "One Tough Cookie",
  "Go Nate Go",
  "Our Little Fighter",
  "Natey Shark",
  "100% Supports CHOP",
] as const

const marqueeCopies = ["first", "second"] as const

export function CampaignMarquee(): JSX.Element {
  return (
    <section
      className="campaign-marquee relative z-20 -my-6 w-full overflow-hidden py-8"
      aria-label="Campaign rallying cries"
    >
      <p className="sr-only">{rallyingCries.join(". ")}.</p>

      <div className="campaign-marquee__ribbon" aria-hidden="true">
        <div className="campaign-marquee__track">
          {marqueeCopies.map((copy) => (
            <div className="campaign-marquee__group" key={copy}>
              {rallyingCries.map((rallyingCry) => (
                <span className="campaign-marquee__item" key={rallyingCry}>
                  <span>{rallyingCry}</span>
                  <span className="campaign-marquee__sparkle">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>

        <p className="campaign-marquee__reduced">
          <span>Go Nate Go</span>
          <span className="campaign-marquee__sparkle">✦</span>
          <span>One Tough Cookie</span>
        </p>
      </div>
    </section>
  )
}
