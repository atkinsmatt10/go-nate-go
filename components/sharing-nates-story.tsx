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

// Substack card component that mimics the actual Substack embed UI
function SubstackCard({ 
  url, 
  title, 
  subtitle,
  description, 
  image, 
  author,
  date,
  likes = 6,
  replies = 1
}: { 
  url: string; 
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  author?: string;
  date?: string;
  likes?: number;
  replies?: number;
}) {
  return (
    <div className="w-full rounded-lg overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      {image && (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div className="relative w-full aspect-[16/9]">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
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

        {/* Interaction Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-6">
            {/* Like Button */}
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="text-sm">{likes}</span>
            </button>

            {/* Reply Button */}
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              <span className="text-sm">{replies} {replies === 1 ? 'reply' : 'replies'}</span>
            </button>

            {/* Share Button */}
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>

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
              backgroundColor: '#FF6719',
              color: '#FFFFFF'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E85D15'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FF6719'}
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
      title: "Rally Around Nate The Great",
      subtitle: "This is when we're at our best.",
      description: "We got a note from Nicole, a member of the Ricky community. Nicole and Matt's son Nate was diagnosed with a rare brain tumor at the age of eight weeks old.",
      author: "Spike Eskin",
      image: "/24592c16-57c4-4073-816a-8bb97f89b491_3024x1684.jpg",
      date: "Jul 28",
      likes: 6,
      replies: 1,
      useCard: true
    },
    {
      url: "https://www.fitlerfocus.com/p/fitler-square-rallies-behind-nate",
      title: "Fitler Square Rallies Behind \"Nate the Great\"",
      subtitle: "A community rallies around a family facing their toughest challenge",
      description: "Matt and Nicole Atkins with their son Nate, who was diagnosed with a rare brain tumor at just seven weeks old. A ten-minute drive to CHOP saved his life—and their Fitler Square neighbors stepped up in the aftermath, helping the family raise over $60,000 for pediatric cancer research.",
      author: "David Aragon",
      image: "/74d33c63-44e5-459f-94d0-4bebc5f07995_6048x5356.jpg",
      date: "Sep 22",
      likes: 7,
      replies: 0,
      useCard: true
    },
    {
      url: "https://www.notboring.co/p/weekly-dose-of-optimism-163",
      title: "Weekly Dose of Optimism #163",
      subtitle: "not boring • week 163",
      description: "Germinal (+bridge recombinase), cryo organs, Sila anodes, brain is not computer, hallucination-less psychedelics + Nate the Great",
      author: "Packy McCormick",
      image: "/Weeklydose.png",
      date: "Sep 26",
      likes: 93,
      replies: 11,
      useCard: true
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
                  {post.useCard ? (
                    <SubstackCard 
                      url={post.url}
                      title={post.title}
                      subtitle={post.subtitle}
                      description={post.description}
                      image={post.image}
                      author={post.author}
                      date={post.date}
                      likes={post.likes}
                      replies={post.replies}
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

