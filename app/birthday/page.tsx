"use client"

import { useState, useEffect } from "react"

export default function BirthdayPage() {
  const [blinkOn, setBlinkOn] = useState(true)
  const [selectedOption, setSelectedOption] = useState(0)

  // Classic blinking cursor effect
  useEffect(() => {
    const interval = setInterval(() => {
      setBlinkOn((prev) => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  const menuOptions = ["RSVP YES!", "VIEW MAP", "CALL MOM"]

  return (
    <div className="min-h-screen bg-[#0f380f] flex items-center justify-center p-4">
      {/* Game Boy Screen Container */}
      <div className="w-full max-w-md">
        {/* Outer Game Boy Shell */}
        <div className="bg-[#c4cfa1] rounded-[2rem] p-4 shadow-2xl border-4 border-[#8b956d]">
          {/* Screen Bezel */}
          <div className="bg-[#1a1a2e] rounded-lg p-3 mb-4">
            {/* LCD Screen */}
            <div
              className="bg-[#9bbc0f] rounded-sm p-4 font-mono text-[#0f380f] relative overflow-hidden"
              style={{
                boxShadow: "inset 0 0 20px rgba(15, 56, 15, 0.3)",
                imageRendering: "pixelated",
              }}
            >
              {/* Scanline Effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-10"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
                }}
              />

              {/* Header */}
              <div className="text-center mb-4 relative">
                <div className="text-xs tracking-widest mb-1">★ LEVEL 02 ★</div>
                <h1
                  className="text-2xl font-bold tracking-tight leading-none"
                  style={{ fontFamily: "monospace" }}
                >
                  NATE&apos;S
                </h1>
                <h2
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "monospace" }}
                >
                  BIRTHDAY
                </h2>
                <div className="text-xs mt-1">QUEST</div>
              </div>

              {/* Pixel Art Divider */}
              <div className="flex justify-center gap-1 my-3">
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-[#0f380f]"
                    style={{
                      opacity: i % 2 === 0 ? 1 : 0.5,
                    }}
                  />
                ))}
              </div>

              {/* Party Stats */}
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-16">DATE:</span>
                  <span className="font-bold">JUL 26, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16">TIME:</span>
                  <span className="font-bold">11:00 AM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16">PLACE:</span>
                  <span className="font-bold text-xs">CHUCK E. CHEESE</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-16">ADDR:</span>
                  <span className="font-bold text-xs">123 ARCADE LN</span>
                </div>
              </div>

              {/* Health/Lives Display */}
              <div className="flex justify-between items-center mb-4 text-xs">
                <div className="flex items-center gap-1">
                  <span>HP</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-3 h-2 bg-[#0f380f]" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <span>AGE</span>
                  <span className="text-lg font-bold">02</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>FUN</span>
                  <span className="font-bold">MAX!</span>
                </div>
              </div>

              {/* Menu Options */}
              <div className="border-2 border-[#0f380f] p-2 mb-3">
                {menuOptions.map((option, index) => (
                  <button
                    key={option}
                    onClick={() => setSelectedOption(index)}
                    className="w-full text-left px-2 py-1 flex items-center gap-2 hover:bg-[#8bac0f] transition-colors"
                  >
                    <span className="w-4">
                      {selectedOption === index ? "▶" : " "}
                    </span>
                    <span>{option}</span>
                  </button>
                ))}
              </div>

              {/* Bottom Message */}
              <div className="text-center text-xs">
                <p>PRESS START TO JOIN</p>
                <p>THE ADVENTURE!</p>
                <span
                  className="inline-block mt-1"
                  style={{ opacity: blinkOn ? 1 : 0 }}
                >
                  ▼
                </span>
              </div>
            </div>
          </div>

          {/* Game Boy Label */}
          <div className="text-center mb-3">
            <div
              className="inline-block bg-[#4a4a6a] text-[#c4cfa1] px-4 py-1 rounded text-xs font-bold tracking-widest"
              style={{ fontFamily: "monospace" }}
            >
              NATE BOY™
            </div>
          </div>

          {/* D-Pad and Buttons */}
          <div className="flex justify-between items-center px-4">
            {/* D-Pad */}
            <div className="relative w-20 h-20">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#1a1a2e] rounded-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#1a1a2e] rounded-sm" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a2e] rounded-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a2e] rounded-sm" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#1a1a2e] rounded-full" />
            </div>

            {/* A/B Buttons */}
            <div className="flex gap-3 -rotate-12">
              <button className="w-10 h-10 bg-[#9b2257] rounded-full shadow-lg border-2 border-[#6b1a3f] flex items-center justify-center text-[#c4cfa1] font-bold text-xs active:scale-95 transition-transform">
                B
              </button>
              <button className="w-10 h-10 bg-[#9b2257] rounded-full shadow-lg border-2 border-[#6b1a3f] flex items-center justify-center text-[#c4cfa1] font-bold text-xs active:scale-95 transition-transform">
                A
              </button>
            </div>
          </div>

          {/* Start/Select Buttons */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="text-center">
              <div className="w-10 h-3 bg-[#8b956d] rounded-full shadow-inner" />
              <span className="text-[8px] text-[#4a4a6a] font-bold">SELECT</span>
            </div>
            <div className="text-center">
              <div className="w-10 h-3 bg-[#8b956d] rounded-full shadow-inner" />
              <span className="text-[8px] text-[#4a4a6a] font-bold">START</span>
            </div>
          </div>

          {/* Speaker Grille */}
          <div className="flex justify-end mt-4 pr-4">
            <div className="flex gap-1 -rotate-45">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-8 bg-[#8b956d] rounded-full" />
              ))}
            </div>
          </div>
        </div>

        {/* RSVP Info Below */}
        <div className="mt-6 text-center text-[#9bbc0f] font-mono text-sm">
          <p className="mb-2">
            {">"} RSVP BY JUL 19 {"<"}
          </p>
          <p className="text-xs opacity-80">
            CONTACT: MOM & DAD
            <br />
            555-GAME-ON
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="px-3 py-1 border border-[#9bbc0f] text-xs">
              INSERT COIN
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
