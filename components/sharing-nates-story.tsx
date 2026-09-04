"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"
import Script from "next/script"
import { getRevealProps } from "@/lib/motion"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { getXRuntime, XPostEmbed, type XScriptStatus } from "@/components/x-post-embed"

const InstagramPostEmbed = dynamic(
  () => import("react-social-media-embed").then((module) => module.InstagramEmbed),
  {
    ssr: false,
    loading: () => <PostSkeleton />,
  },
)

// Loading skeleton component for social media posts
function PostSkeleton() {
  return (
    <div className="w-full h-[500px] bg-muted/50 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  )
}

// Substack card component that mimics the actual Substack embed UI
function SubstackCard({ 
  url, 
  title, 
  subtitle,
  description, 
  image, 
  author,
  date,
}: { 
  url: string; 
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  author?: string;
  date?: string;
}) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-xs hover:shadow-md transition-shadow">
      {/* Image */}
      {image && (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div className="relative w-full aspect-video">
            <Image
              src={image} 
              alt={title}
              fill
              className="w-full h-full object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        </a>
      )}
      
      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <a href={url} target="_blank" rel="noopener noreferrer" className="block">
          <h3 className="font-bold text-xl leading-tight text-gray-900 hover:text-gray-700 transition-colors">
            {title}
          </h3>
        </a>

        {/* Subtitle */}
        {subtitle && (
          <p className="text-base text-gray-600 leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* Description/Post Preview */}
        {description && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {description}
          </p>
        )}

        {/* Author */}
        {author && (
          <div className="text-sm text-gray-600">
            {author}
          </div>
        )}

        {/* Date */}
        {date && (
          <div className="text-sm text-gray-500">
            {date}
          </div>
        )}

        {/* Read on Substack Button */}
        <div className="pt-2">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md font-medium text-sm transition-colors"
            style={{ 
              backgroundColor: '#b83e00',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#953300'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#b83e00'}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0h16v16H0V0z" fill="none"/>
              <path d="M0 13.333h16V16H0v-2.667zM0 8h16v2.667H0V8zm0-5.333h16V5.333H0V2.667z" fill="currentColor"/>
            </svg>
            Read on Substack
          </a>
        </div>
      </div>
    </div>
  )
}

// Instagram creates its iframe asynchronously. Label every replacement frame too.
function AccessibleInstagramPost({ url, title, load }: { url: string; title: string; load: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const labelFrames = () => {
      container.querySelectorAll("iframe").forEach((frame) => {
        if (frame.title !== title) frame.title = title
      })
    }
    const observer = new MutationObserver(labelFrames)
    observer.observe(container, { childList: true, subtree: true })
    labelFrames()
    return () => observer.disconnect()
  }, [title])
  return (
    <div ref={containerRef} className="overflow-hidden rounded-xl">
      {load ? <InstagramPostEmbed url={url} width="100%" /> : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="flex h-[500px] items-center justify-center rounded-xl bg-white px-6 text-center text-[#223b54] underline">
          {title}
        </a>
      )}
    </div>
  )
}

// LinkedIn iframe embed component
function LinkedInEmbed({ url }: { url: string }) {
  // Extract the URN from the URL
  // URL format: https://www.linkedin.com/feed/update/urn:li:activity:7359300295270522882/
  const urnMatch = url.match(/urn:li:(activity|share):(\d+)/)
  
  if (!urnMatch) {
    return null
  }

  const [, type, id] = urnMatch
  // LinkedIn embed URLs use the format: /embed/feed/update/urn:li:share:ID
  // We'll try with activity first
  const embedUrl = `https://www.linkedin.com/embed/feed/update/urn:li:${type}:${id}`

  return (
    <div className="w-full">
      <iframe 
        src={embedUrl}
        loading="lazy"
        height="584" 
        width="100%" 
        frameBorder="0" 
        allowFullScreen
        title="Embedded LinkedIn post"
        className="rounded-lg"
      />
    </div>
  )
}

export function SharingNatesStory() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const loadEmbeds = useInView(sectionRef, { once: true, margin: "600px 0px" })
  const [xScriptStatus, setXScriptStatus] = useState<XScriptStatus>("loading")

  function handleXScriptReady(): void {
    const runtime = getXRuntime()

    if (!runtime) {
      setXScriptStatus("error")
      return
    }

    runtime.ready(() => {
      setXScriptStatus(runtime.widgets ? "ready" : "error")
    })
  }

  // X posts about Nate
  const tweetIds = [
    "1983295045806546968", // PBTF tweet about Nate
    "1967256596313936211", // Second tweet about Nate
    "1953562871839002944", // Third tweet about Nate
  ]

  // Instagram posts about Nate
  const instagramUrls = [
    "https://www.instagram.com/p/DO_xXgckRxR/",
    "https://www.instagram.com/p/DMqIEaWgJO9/",
    "https://www.instagram.com/p/DO6Wl3DjHIK/",
    "https://www.instagram.com/p/DNMNlQhuPW0/",
  ]

  // LinkedIn posts about Nate
  const linkedInUrls = [
    "https://www.linkedin.com/feed/update/urn:li:activity:7359300295270522882/",
  ]

  // Substack posts about Nate
  const substackPosts = [
    {
      url: "https://www.rightstorickysanchez.com/p/rally-around-nate-the-great",
      title: "Rally Around Nate The Great",
      subtitle: "This is when we're at our best.",
      description: "Nate was born on May 2, 2025. In late June, he began vomiting and became unusually sleepy. At CHOP, imaging showed hydrocephalus caused by a rare choroid plexus tumor.",
      author: "Spike Eskin",
      image: "/24592c16-57c4-4073-816a-8bb97f89b491_3024x1684.jpg",
      date: "Jul 28",



    },
    {
      url: "https://www.fitlerfocus.com/p/fitler-square-rallies-behind-nate",
      title: "Fitler Square Rallies Behind \"Nate the Great\"",
      subtitle: "A community rallies around a family facing their toughest challenge",
      description: "Because complete resection was not safe at first, Nate had a shunt placed to control hydrocephalus and came home to grow. On January 2, 2026, his neurosurgeon completed a gross total resection.",
      author: "David Aragon",
      image: "/74d33c63-44e5-459f-94d0-4bebc5f07995_6048x5356.jpg",
      date: "Sep 22",



    },
    {
      url: "https://www.notboring.co/p/weekly-dose-of-optimism-163",
      title: "Weekly Dose of Optimism #163",
      subtitle: "not boring • week 163",
      description: "Sharing Nate's story is our way of honoring the care that saved him, helping other families spot concerning signs sooner, and raising money to fund research for the next child who needs treatment.",
      author: "Packy McCormick",
      image: "/Weeklydose.png",
      date: "Sep 26",



    }
  ]

  return (
    <>
      {loadEmbeds && (
      <Script
        id="x-widgets-script"
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onReady={handleXScriptReady}
        onError={() => setXScriptStatus("error")}
      />
      )}
    <section ref={sectionRef} id="social-media" className="w-full relative bg-background">
      {/* Wave Shape at the top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-[60px] md:h-[80px] lg:h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V7.23C0,65.52,268.63,112.77,600,112.77S1200,65.52,1200,7.23V0Z"
            className="fill-background"
          ></path>
        </svg>
      </div>

      {/* Content with top padding to account for wave */}
      <div className="relative pt-[60px] md:pt-[80px] lg:pt-[100px] pb-16 md:pb-24 lg:pb-32">
        <div className="container px-4 md:px-6">
          <motion.div
            className="max-w-7xl mx-auto space-y-12"
            {...getRevealProps(prefersReducedMotion, { distance: 0, duration: 0.22, margin: "-100px" })}
          >
            {/* Section Header */}
            <motion.div
              className="text-center space-y-4"
              {...getRevealProps(prefersReducedMotion, { delay: 0.04, margin: "-50px" })}
            >
              <div className="inline-block rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-[#9fe1de] border border-primary/30 backdrop-blur-xs">
                Social Media
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Sharing Nate&apos;s Story
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Sharing Nate&apos;s story is our way of honoring the care that saved him, helping other families spot concerning
                signs sooner, and raising money to fund research so that treatments exist for the next child who needs them.
              </p>
            </motion.div>

              {/* Social Media Grid */}
              <motion.div
                className="columns-1 sm:columns-2 lg:columns-3 gap-6"
                {...getRevealProps(prefersReducedMotion, { delay: 0.08, margin: "-50px" })}
              >
              {/* X/Twitter Posts */}
              {tweetIds.map((tweetId, index) => (
                <motion.div
                  key={`tweet-${tweetId}`}
                  className="break-inside-avoid mb-6"
                  {...getRevealProps(prefersReducedMotion, { delay: 0.1 + index * 0.04 })}
                >
                  <div className="w-full">
                    <XPostEmbed id={tweetId} scriptStatus={xScriptStatus} />
                  </div>
                </motion.div>
              ))}

              {/* Instagram Posts */}
              {instagramUrls.map((url, index) => (
                <motion.div
                  key={url}
                  className="break-inside-avoid mb-6"
                  {...getRevealProps(prefersReducedMotion, { delay: 0.16 + index * 0.04 })}
                >
                  <div className="w-full">
                    <div className="rounded-xl overflow-hidden">
                      <AccessibleInstagramPost url={url} title={`Instagram post about Nate ${index + 1}`} load={loadEmbeds} />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* LinkedIn Posts */}
              {linkedInUrls.map((url, index) => (
                <motion.div
                  key={`linkedin-${index}`}
                  className="break-inside-avoid mb-6"
                  {...getRevealProps(prefersReducedMotion, { delay: 0.22 + index * 0.04 })}
                >
                  <LinkedInEmbed url={url} />
                </motion.div>
              ))}

              {/* Substack Posts */}
              {substackPosts.map((post, index) => (
                <motion.div
                  key={`substack-${index}`}
                  className="break-inside-avoid mb-6"
                  {...getRevealProps(prefersReducedMotion, { delay: 0.18 + index * 0.04 })}
                >
                    <SubstackCard 
                      url={post.url}
                      title={post.title}
                      subtitle={post.subtitle}
                      description={post.description}
                      image={post.image}
                      author={post.author}
                      date={post.date}
                    />

                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
    </>
  )
}
