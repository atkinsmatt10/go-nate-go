"use client"

import { motion } from "framer-motion"
import { Tweet } from "react-tweet"
import { InstagramEmbed } from "react-social-media-embed"
import { Suspense, useEffect } from "react"
import Script from "next/script"

// Loading skeleton component for social media posts
function PostSkeleton() {
  return (
    <div className="w-full h-[500px] bg-muted/50 rounded-lg animate-pulse flex items-center justify-center">
      <div className="text-muted-foreground text-sm">Loading...</div>
    </div>
  )
}

// Substack card component with image for posts that don't embed well
function SubstackCard({ url, title, description, image, author }: { 
  url: string; 
  title: string; 
  description?: string;
  image?: string;
  author?: string;
}) {
  return (
    <div className="w-full rounded-xl overflow-hidden" style={{ backgroundColor: '#FFFFFF' }}>
      {image && (
        <div className="relative w-full h-[300px]">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6 space-y-4">
        <h3 className="font-bold text-lg leading-tight" style={{ color: '#1a1a1a' }}>
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed" style={{ color: '#666666' }}>
            {description}
          </p>
        )}
        {author && (
          <div className="flex items-center gap-2 text-sm" style={{ color: '#666666' }}>
            <span className="font-medium">{author}</span>
          </div>
        )}
        <div className="pt-2">
          <a 
            href={url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium text-sm rounded-full transition-colors"
          >
            Read on Substack
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 11L11 1M11 1H1M11 1V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  )
}

// Substack embed component using dangerouslySetInnerHTML
function SubstackEmbed({ url, title, description }: { url: string; title: string; description?: string }) {
  const embedHTML = `
    <div class="substack-post-embed">
      <p lang="en">${title}</p>
      ${description ? `<p>${description}</p>` : ''}
      <a data-post-link href="${url}">Read on Substack</a>
    </div>
  `

  return (
    <div className="w-full" dangerouslySetInnerHTML={{ __html: embedHTML }} />
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
  // Placeholder tweet IDs - replace these with actual tweet IDs
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
      title: "Rally Around Nate The Great by The Rights To Ricky Sanchez",
      description: "This is when we're at our best."
    },
    {
      url: "https://www.fitlerfocus.com/p/fitler-square-rallies-behind-nate",
      title: "Fitler Square Rallies Behind \"Nate the Great\"",
      description: "When Nicole and Matt Atkins rushed their seven-week-old son Nate to the ER at Children's Hospital of Philadelphia, they had no idea how close they were cutting it.",
      author: "David Aragon · The Fitler Focus",
      image: "/IMG_9843.png"
    },
    {
      url: "https://www.notboring.co/p/weekly-dose-of-optimism-163",
      title: "Weekly Dose of Optimism #163 by Packy McCormick",
      description: "Germinal (+bridge recombinase), cryo organs, Sila anodes, brain is not computer, hallucination-less psychedelics + Nate the Great"
    }
  ]

  return (
    <>
      {/* Load Substack embed script */}
      <Script
        src="https://substack.com/embedjs/embed.js"
        strategy="lazyOnload"
        async
        charSet="utf-8"
      />
    <section id="social-media" className="w-full relative bg-background">
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            {/* Section Header */}
            <motion.div
              className="text-center space-y-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="inline-block rounded-lg bg-primary/20 px-4 py-2 text-sm font-medium text-primary border border-primary/30 backdrop-blur-sm">
                Social Media
              </div>
              <h2 className="text-4xl font-bold tracking-tighter sm:text-5xl text-foreground">
                Sharing Nate's Story
              </h2>
              <p className="text-muted-foreground md:text-lg max-w-2xl mx-auto">
                See how Nate's journey has touched hearts and inspired communities across social media
              </p>
            </motion.div>

              {/* Social Media Grid */}
              <motion.div
                className="columns-1 sm:columns-2 lg:columns-3 gap-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
              {/* X/Twitter Posts */}
              {tweetIds.map((tweetId, index) => (
                <motion.div
                  key={`tweet-${tweetId}`}
                  className="break-inside-avoid mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                >
                  <div className="w-full">
                    <Suspense fallback={<PostSkeleton />}>
                      <Tweet id={tweetId} />
                    </Suspense>
                  </div>
                </motion.div>
              ))}

              {/* Instagram Posts */}
              {instagramUrls.map((url, index) => (
                <motion.div
                  key={`instagram-${index}`}
                  className="break-inside-avoid mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                >
                  <div className="w-full">
                    <Suspense fallback={<PostSkeleton />}>
                      <div className="rounded-xl overflow-hidden">
                        <InstagramEmbed 
                          url={url} 
                          width="100%"
                        />
                      </div>
                    </Suspense>
                  </div>
                </motion.div>
              ))}

              {/* LinkedIn Posts */}
              {linkedInUrls.map((url, index) => (
                <motion.div
                  key={`linkedin-${index}`}
                  className="break-inside-avoid mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                >
                  <LinkedInEmbed url={url} />
                </motion.div>
              ))}

              {/* Substack Posts */}
              {substackPosts.map((post, index) => (
                <motion.div
                  key={`substack-${index}`}
                  className="break-inside-avoid mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 1.2 + index * 0.1 }}
                >
                  {'image' in post && post.image ? (
                    <SubstackCard 
                      url={post.url}
                      title={post.title}
                      description={post.description}
                      image={post.image}
                      author={'author' in post ? post.author : undefined}
                    />
                  ) : (
                    <SubstackEmbed 
                      url={post.url}
                      title={post.title}
                      description={post.description}
                    />
                  )}
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

