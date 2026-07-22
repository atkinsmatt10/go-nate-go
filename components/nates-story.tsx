import type { JSX } from "react"
import Image from "next/image"
import { ExternalLink } from "lucide-react"

interface JourneyMilestone {
  readonly dateLines: readonly string[]
  readonly description: string
  readonly title: string
}

const journeyMilestones = [
  {
    dateLines: ["May 2,", "2025"],
    title: "Nate arrives",
    description: "Our son Nate was born and instantly became the center of our world.",
  },
  {
    dateLines: ["Late June", "2025"],
    title: "Something's wrong",
    description:
      "At eight weeks old, Nate began vomiting and became unusually sleepy. At CHOP, imaging showed hydrocephalus caused by a rare choroid plexus tumor.",
  },
  {
    dateLines: ["One", "week"],
    title: "Three surgeries",
    description:
      "Over the next week, Nate underwent three surgeries, including an EVD placement and biopsy. Because he was so young and the tumor so vascular, a shunt controlled the hydrocephalus and gave him time to grow.",
  },
  {
    dateLines: ["Jan 2,", "2026"],
    title: "The comeback",
    description:
      "Six months later, bigger and stronger, Nate's neurosurgeon completed a gross total resection. Recovery later required another shunt, but Nate did amazing.",
  },
  {
    dateLines: ["Today"],
    title: "Home, crawling, grinning",
    description:
      "Nate is home and thriving — crawling, pulling himself up, smiling at everyone, and the happiest kid in any room. He's here because of the extraordinary team at CHOP.",
  },
] satisfies readonly JourneyMilestone[]

export function NatesStory(): JSX.Element {
  return (
    <section id="story" className="relative w-full overflow-hidden bg-secondary py-24 sm:py-28 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-5xl">
          <header className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-primary">
              Nate&apos;s Journey
            </p>
            <h2 className="mt-5 text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Our Little Fighter
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl md:leading-9">
              The whole story, the way we lived it — the scary parts and the ones worth cheering for.
            </p>
          </header>

          <ol className="mt-16 border-y border-foreground/10 md:mt-20">
            {journeyMilestones.map((milestone, index) => (
              <li
                key={milestone.title}
                className="grid gap-4 border-t border-foreground/10 py-8 first:border-t-0 md:grid-cols-[11rem_1rem_minmax(0,1fr)] md:gap-x-6 md:py-10"
              >
                <p className="font-[family-name:var(--font-lilita-one)] text-2xl leading-tight text-primary md:text-3xl">
                  {milestone.dateLines.map((dateLine) => (
                    <span className="block" key={dateLine}>
                      {dateLine}
                    </span>
                  ))}
                </p>

                <div className="relative hidden self-stretch md:block" aria-hidden="true">
                  <span
                    className={`absolute left-1/2 w-px -translate-x-1/2 bg-primary/35 ${
                      index === 0 ? "top-[1.125rem]" : "-top-10"
                    } ${
                      index === journeyMilestones.length - 1
                        ? "bottom-[calc(100%-1.125rem)]"
                        : "-bottom-10"
                    }`}
                  />
                  <span className="absolute left-1/2 top-[1.125rem] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-secondary bg-primary shadow-[0_0_0_3px_rgb(66_168_169_/_18%)]" />
                </div>

                <div>
                  <h3 className="text-2xl leading-tight text-foreground md:text-3xl">
                    {milestone.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
                    {milestone.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <figure className="py-20 text-center md:py-24">
            <span
              aria-hidden="true"
              className="block h-12 font-[family-name:var(--font-lilita-one)] text-7xl leading-[0.7] text-primary/45"
            >
              “
            </span>
            <blockquote>
              <p className="font-[family-name:var(--font-lilita-one)] text-4xl leading-tight text-foreground md:text-5xl">
                One very tough cookie.
              </p>
            </blockquote>
            <figcaption className="mt-5 text-xs font-bold uppercase tracking-[0.24em] text-primary md:text-sm">
              — Nate&apos;s parents
            </figcaption>
          </figure>

          <div className="grid items-center gap-5 rounded-[24px] border border-primary/35 bg-background/20 p-5 shadow-[0_16px_40px_rgb(20_43_64_/_12%)] md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-6 md:p-6">
            <div className="relative h-14 w-36 justify-self-center md:justify-self-start">
              <Image
                src="/logo1-color.webp"
                alt="Pediatric Brain Tumor Foundation"
                fill
                className="object-contain"
                sizes="144px"
              />
            </div>

            <p className="text-center text-sm leading-6 text-muted-foreground md:text-left md:text-base md:leading-7">
              Read the full story — diagnosis, surgeries, recovery, and the care team that saved his life — on the
              Pediatric Brain Tumor Foundation site.
            </p>

            <a
              href="https://curethekids.org/story/nates-journey-strength-beyond-his-seven-weeks/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-[16px] border border-foreground/10 bg-background/20 px-5 text-base font-bold text-foreground transition-[transform,background-color,border-color] duration-150 ease-snappy-out active:scale-[0.98] focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-secondary hover:border-primary/50 hover:bg-background/35 md:w-auto"
            >
              Read Nate&apos;s Full Story
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
