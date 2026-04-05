"use client"

import { Heart, Star, Sparkles } from "lucide-react"

// Pixel-style decorative dots component
function PixelDots({ className = "" }: { className?: string }) {
  return (
    <div className={`flex gap-1.5 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2 h-2 rounded-sm bg-[#42A8A9]"
          style={{ opacity: 0.4 + i * 0.15 }}
        />
      ))}
    </div>
  )
}

// Arcade-style HUD badge
function HudBadge({ children, variant = "cyan" }: { children: React.ReactNode; variant?: "cyan" | "pink" | "yellow" }) {
  const colors = {
    cyan: "bg-[#42A8A9] text-white",
    pink: "bg-[#FF6B9D] text-white",
    yellow: "bg-[#FFD93D] text-[#3D2914]",
  }
  return (
    <span className={`inline-block px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-md ${colors[variant]} font-sans`}>
      {children}
    </span>
  )
}

// Simple maze-line decorative border
function MazeBorder() {
  return (
    <svg className="w-full h-4" viewBox="0 0 400 16" preserveAspectRatio="none">
      <path
        d="M0 8 L20 8 L20 4 L40 4 L40 12 L60 12 L60 4 L80 4 L80 8 L100 8 L100 4 L120 4 L120 12 L140 12 L140 8 L160 8 L160 4 L180 4 L180 12 L200 12 L200 8 L220 8 L220 4 L240 4 L240 12 L260 12 L260 4 L280 4 L280 8 L300 8 L300 12 L320 12 L320 4 L340 4 L340 8 L360 8 L360 12 L380 12 L380 4 L400 4"
        fill="none"
        stroke="#42A8A9"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  )
}

// Collectible star icon
function CollectibleStar({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <Star className="w-6 h-6 fill-[#FFD93D] text-[#E5A800] drop-shadow-sm" />
      <div className="absolute inset-0 animate-pulse">
        <Star className="w-6 h-6 fill-[#FFD93D] text-[#E5A800] opacity-50" />
      </div>
    </div>
  )
}

export function BirthdayInvitation() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Offset shadow behind main card */}
      <div className="absolute inset-0 bg-[#3D2914] rounded-[2rem] translate-x-3 translate-y-3" />
      
      {/* Main console/card container */}
      <div className="relative bg-[#4DD0D6] rounded-[2rem] border-[5px] border-[#3D2914] overflow-hidden">
        {/* Top decorative bar with HUD elements */}
        <div className="bg-[#3D2914] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HudBadge variant="yellow">Player 1</HudBadge>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 fill-[#FF6B9D] text-[#FF6B9D]" />
            <Heart className="w-4 h-4 fill-[#FF6B9D] text-[#FF6B9D]" />
            <Heart className="w-4 h-4 fill-[#FF6B9D] text-[#FF6B9D]" />
          </div>
          <div className="flex items-center gap-2">
            <HudBadge variant="pink">Level 01</HudBadge>
          </div>
        </div>

        {/* Inner padding area */}
        <div className="p-4 sm:p-6">
          {/* Screen/display area */}
          <div className="relative bg-[#FFF9F2] rounded-2xl border-4 border-[#3D2914] overflow-hidden">
            {/* Inner screen shadow */}
            <div className="absolute inset-0 shadow-[inset_0_4px_12px_rgba(61,41,20,0.15)]" />
            
            {/* Screen content */}
            <div className="relative p-5 sm:p-8 text-center">
              {/* Top decorative stars */}
              <div className="flex justify-center gap-4 mb-4">
                <CollectibleStar />
                <Sparkles className="w-5 h-5 text-[#42A8A9]" />
                <CollectibleStar />
              </div>

              {/* Main title */}
              <h1 className="font-[family-name:var(--font-lilita-one)] text-4xl sm:text-5xl md:text-6xl text-[#3D2914] tracking-tight leading-none mb-2">
                NATE THE GREAT
              </h1>
              
              {/* Subtitle with arcade styling */}
              <div className="relative inline-block mb-6">
                <div className="bg-[#FF6B9D] text-white px-6 py-2 rounded-lg border-[3px] border-[#3D2914] shadow-[3px_3px_0_#3D2914]">
                  <p className="font-[family-name:var(--font-lilita-one)] text-2xl sm:text-3xl tracking-wide">
                    IS TURNING ONE!
                  </p>
                </div>
              </div>

              {/* Pixel maze decoration */}
              <MazeBorder />

              {/* Event details section */}
              <div className="mt-6 space-y-4">
                {/* Date and Time */}
                <div className="bg-[#E8F4F4] rounded-xl p-4 border-2 border-[#42A8A9]/30">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <PixelDots />
                  </div>
                  <p className="font-[family-name:var(--font-lilita-one)] text-xl sm:text-2xl text-[#3D2914]">
                    SATURDAY, MAY 9TH
                  </p>
                  <p className="font-[family-name:var(--font-work-sans)] text-lg text-[#42A8A9] font-semibold">
                    12PM TO 3PM
                  </p>
                </div>

                {/* Venue */}
                <div className="space-y-1">
                  <p className="font-[family-name:var(--font-lilita-one)] text-2xl sm:text-3xl text-[#42A8A9]">
                    CRAFT HALL
                  </p>
                  <p className="font-[family-name:var(--font-work-sans)] text-sm sm:text-base text-[#5C4A3D]">
                    901 N Delaware Ave
                  </p>
                  <p className="font-[family-name:var(--font-work-sans)] text-sm sm:text-base text-[#5C4A3D]">
                    Philadelphia, PA 19123
                  </p>
                </div>

                {/* RSVP */}
                <div className="inline-flex items-center gap-2 bg-[#42A8A9] text-white px-5 py-2 rounded-lg border-2 border-[#3D2914] shadow-[2px_2px_0_#3D2914]">
                  <span className="font-[family-name:var(--font-work-sans)] text-sm font-bold tracking-wide">RSVP:</span>
                  <span className="font-[family-name:var(--font-lilita-one)] text-lg">GONATEGO.COM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Donation info panel - styled like a bonus/info box */}
          <div className="mt-4 bg-[#FFF5E6] rounded-xl border-[3px] border-[#3D2914] p-4 shadow-[3px_3px_0_#3D2914]">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-4 h-4 fill-[#FFD93D] text-[#E5A800]" />
              <h2 className="font-[family-name:var(--font-lilita-one)] text-lg sm:text-xl text-[#3D2914]">
                NO GIFTS PLEASE
              </h2>
              <Star className="w-4 h-4 fill-[#FFD93D] text-[#E5A800]" />
            </div>
            <p className="font-[family-name:var(--font-work-sans)] text-sm text-[#5C4A3D] leading-relaxed text-center">
              In lieu of gifts, please consider a donation to CHOP Neurosurgery & Neuro-Oncology.
            </p>
            <p className="font-[family-name:var(--font-work-sans)] text-sm text-[#42A8A9] font-semibold text-center mt-2">
              gonatego.com/donations
            </p>
          </div>
        </div>

        {/* Bottom decorative controls - like arcade buttons */}
        <div className="bg-[#3D2914] px-6 py-4">
          <div className="flex items-center justify-center gap-6">
            {/* D-pad style element */}
            <div className="relative w-12 h-12">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A1D0F] rounded-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#2A1D0F] rounded-sm" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A1D0F] rounded-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A1D0F] rounded-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#2A1D0F] rounded-sm" />
            </div>

            {/* Center text */}
            <div className="text-center">
              <p className="font-[family-name:var(--font-work-sans)] text-xs text-[#FFD93D] tracking-widest uppercase font-semibold">
                Press Start
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B9D] border-2 border-[#2A1D0F] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]" />
              <div className="w-8 h-8 rounded-full bg-[#FFD93D] border-2 border-[#2A1D0F] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.3)]" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-[#FFD93D] rounded-lg border-[3px] border-[#3D2914] flex items-center justify-center rotate-12 shadow-md">
        <span className="font-[family-name:var(--font-lilita-one)] text-sm text-[#3D2914]">1</span>
      </div>
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#FF6B9D] rounded-full border-[3px] border-[#3D2914] flex items-center justify-center shadow-md">
        <Star className="w-3 h-3 fill-white text-white" />
      </div>
    </div>
  )
}
