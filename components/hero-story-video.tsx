"use client"

import { useState, type ReactNode } from "react"
import dynamic from "next/dynamic"
import { Play } from "lucide-react"

// The import and all streaming work begin only after an intentional Play action.
const MuxPlayer = dynamic(() => import("@mux/mux-player-react"), {
  ssr: false,
  loading: () => <p role="status" className="absolute inset-x-0 bottom-5 text-center text-white">Loading video…</p>,
})

export function HeroStoryVideo({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <>
      {children}
      {isPlaying ? (
        <MuxPlayer
          playbackId="U6gmORHKl2wiwnTKeMoLSNa8Tro5RHP0000vNOLl7hfdA"
          streamType="on-demand"
          poster="/nate-story-poster.webp"
          autoPlay
          playsInline
          accentColor="#42a8a9"
          primaryColor="#f7fbff"
          secondaryColor="#102f4a"
          metadata={{ video_id: "nate-family-chop-6abc-2026", video_title: "Nate's story" }}
          className="hero-video-player absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label="Play Nate's story · 3:40"
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/10 text-white transition-colors hover:bg-black/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-white"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white bg-[#102f4a]/90 shadow-lg">
            <Play className="ml-1 h-9 w-9 fill-current" aria-hidden="true" />
          </span>
          <span className="rounded-full bg-[#102f4a]/95 px-5 py-2 text-sm font-bold">Play Nate&apos;s story · 3:40</span>
        </button>
      )}
      <noscript>
        <p className="absolute inset-x-0 bottom-0 bg-[#102f4a] p-3 text-center text-sm text-white">
          Enable JavaScript to play the video, or read Nate&apos;s story below.
        </p>
      </noscript>
    </>
  )
}
