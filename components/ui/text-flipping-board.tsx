"use client"

import { motion, useReducedMotion } from "motion/react"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const FLAP_CHARS = " 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$()-+&=;:'\"%,./?"

interface AccentTone {
  top: string
  bottom: string
  text: string
}

const ACCENT_TONES: readonly AccentTone[] = [
  { top: "#d16b5c", bottom: "#b65143", text: "#fffaf3" },
  { top: "#d8943b", bottom: "#c1731e", text: "#fff8ec" },
  { top: "#d7b34a", bottom: "#bc9031", text: "#13283d" },
  { top: "#5f9b8e", bottom: "#4f8075", text: "#f7fbff" },
  { top: "#4e83b9", bottom: "#355f8b", text: "#f7fbff" },
  { top: "#8265c6", bottom: "#694faa", text: "#f7fbff" },
]

const BASE_TONE: AccentTone = {
  top: "#f3f7fb",
  bottom: "#dde9f4",
  text: "#17324b",
}

const BASE_PREVIOUS_TONE: AccentTone = {
  top: "#d7e4ef",
  bottom: "#c4d5e2",
  text: "#17324b",
}

function getRandomAccent(): AccentTone {
  return ACCENT_TONES[Math.floor(Math.random() * ACCENT_TONES.length)] ?? BASE_TONE
}

export interface SplitFlapCellProps {
  target: string
  delay?: number
  stepMs?: number
  flipDuration?: number
  pulseKey?: number
  chaosMode?: boolean
  className?: string
  characterClassName?: string
}

export function SplitFlapCell({
  target,
  delay = 0,
  stepMs = 55,
  flipDuration = 0.34,
  pulseKey = 0,
  chaosMode = false,
  className,
  characterClassName,
}: SplitFlapCellProps) {
  const prefersReducedMotion = useReducedMotion() ?? false
  const [current, setCurrent] = useState(" ")
  const [previous, setPrevious] = useState(" ")
  const [flipId, setFlipId] = useState(0)
  const [accent, setAccent] = useState<AccentTone | null>(null)
  const [previousAccent, setPreviousAccent] = useState<AccentTone | null>(null)
  const currentRef = useRef(" ")
  const targetRef = useRef<string | null>(null)
  const pulseRef = useRef<number | null>(null)
  const accentRef = useRef<AccentTone | null>(null)
  const startTimerRef = useRef<number | null>(null)
  const stepTimerRef = useRef<number | null>(null)

  useEffect(() => {
    if (startTimerRef.current) {
      clearTimeout(startTimerRef.current)
    }
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current)
    }

    const normalized = FLAP_CHARS.includes(target.toUpperCase()) ? target.toUpperCase() : " "
    const pulseChanged = pulseRef.current !== pulseKey
    const shouldRunChaos = chaosMode || pulseChanged

    if (normalized === targetRef.current && !pulseChanged) {
      return
    }

    if (normalized === " " && currentRef.current === " " && !pulseChanged) {
      targetRef.current = normalized
      pulseRef.current = pulseKey
      return
    }

    targetRef.current = normalized
    pulseRef.current = pulseKey

    const scrambleCount =
      normalized === " "
        ? shouldRunChaos
          ? 10 + Math.floor(Math.random() * 6)
          : 4 + Math.floor(Math.random() * 3)
        : shouldRunChaos
          ? 26 + Math.floor(Math.random() * 10)
          : 9 + Math.floor(Math.random() * 5)

    const accentChance = shouldRunChaos ? 0.72 : 0.16

    const runStep = (step: number) => {
      const isLast = step === scrambleCount
      const nextCharacter = isLast
        ? normalized
        : FLAP_CHARS[1 + Math.floor(Math.random() * (FLAP_CHARS.length - 1))] ?? " "

      const nextAccent = isLast ? null : Math.random() < accentChance ? getRandomAccent() : null

      setPrevious(currentRef.current)
      setPreviousAccent(accentRef.current)
      currentRef.current = nextCharacter
      accentRef.current = nextAccent
      setCurrent(nextCharacter)
      setAccent(nextAccent)
      setFlipId((value) => value + 1)

      if (!isLast) {
        stepTimerRef.current = window.setTimeout(
          () => runStep(step + 1),
          prefersReducedMotion ? Math.max(stepMs * 0.75, 28) : stepMs,
        )
      }
    }

    startTimerRef.current = window.setTimeout(() => runStep(1), delay)

    return () => {
      if (startTimerRef.current) {
        clearTimeout(startTimerRef.current)
      }
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current)
      }
      startTimerRef.current = null
      stepTimerRef.current = null
    }
  }, [chaosMode, delay, flipDuration, prefersReducedMotion, pulseKey, stepMs, target])

  const visibleCharacter = current === " " ? "\u00A0" : current
  const previousCharacter = previous === " " ? "\u00A0" : previous
  const activeTone = accent ?? BASE_TONE
  const lastTone = previousAccent ?? BASE_PREVIOUS_TONE

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[8px] border border-white/12 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_18px_rgba(8,20,31,0.18)]",
        className,
      )}
      style={{ aspectRatio: "7 / 10" }}
    >
      <div className="absolute inset-0" style={{ backgroundColor: activeTone.bottom }} />

      <div
        className="absolute inset-x-0 top-0 h-1/2 overflow-hidden border-b border-black/10"
        style={{ backgroundColor: activeTone.top }}
      >
        <span
          className={cn(
            "absolute inset-x-0 top-0 flex h-[200%] items-center justify-center font-mono font-black tabular-nums",
            characterClassName,
          )}
          style={{ color: activeTone.text }}
        >
          {visibleCharacter}
        </span>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden">
        <span
          className={cn(
            "absolute inset-x-0 bottom-0 flex h-[200%] items-center justify-center font-mono font-black tabular-nums",
            characterClassName,
          )}
          style={{ color: activeTone.text }}
        >
          {visibleCharacter}
        </span>
      </div>

      {!prefersReducedMotion && flipId > 0 ? (
        <>
          <motion.div
            key={`top-${flipId}`}
            className="absolute inset-x-0 top-0 z-10 h-1/2 origin-bottom overflow-hidden border-b border-black/10"
            style={{
              backgroundColor: lastTone.top,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            initial={{ rotateX: 0 }}
            animate={{ rotateX: -90 }}
            transition={{ duration: flipDuration, ease: [0.55, 0.055, 0.675, 0.19] }}
          >
            <span
              className={cn(
                "absolute inset-x-0 top-0 flex h-[200%] items-center justify-center font-mono font-black tabular-nums",
                characterClassName,
              )}
              style={{ color: lastTone.text }}
            >
              {previousCharacter}
            </span>
          </motion.div>

          <motion.div
            key={`bottom-${flipId}`}
            className="absolute inset-x-0 bottom-0 z-10 h-1/2 origin-top overflow-hidden"
            style={{
              backgroundColor: activeTone.bottom,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
            initial={{ rotateX: 90 }}
            animate={{ rotateX: 0 }}
            transition={{
              duration: flipDuration * 0.88,
              delay: flipDuration * 0.52,
              ease: [0.33, 1.55, 0.64, 1],
            }}
          >
            <span
              className={cn(
                "absolute inset-x-0 bottom-0 flex h-[200%] items-center justify-center font-mono font-black tabular-nums",
                characterClassName,
              )}
              style={{ color: activeTone.text }}
            >
              {visibleCharacter}
            </span>
          </motion.div>
        </>
      ) : flipId > 0 ? (
        <motion.div
          key={`fade-${flipId}`}
          className="absolute inset-0 z-10"
          initial={{ opacity: 0.28 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.24 }}
          style={{ backgroundColor: activeTone.top }}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-black/12" />
      <div className="pointer-events-none absolute inset-x-0 top-[8%] h-[18%] bg-linear-to-b from-white/20 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-linear-to-t from-black/10 to-transparent" />
    </div>
  )
}

export interface TextFlippingBoardProps {
  rows?: readonly string[]
  text?: string
  className?: string
  pulseKey?: number
  chaosMode?: boolean
  stepMs?: number
  flipDuration?: number
  cellClassName?: string
  characterClassName?: string
}

function normalizeRows(rows: readonly string[] | undefined, text: string | undefined): readonly string[] {
  if (rows && rows.length > 0) {
    return rows
  }

  if (!text) {
    return []
  }

  return text.split("\n")
}

export function TextFlippingBoard({
  rows,
  text,
  className,
  pulseKey = 0,
  chaosMode = false,
  stepMs = 55,
  flipDuration = 0.34,
  cellClassName,
  characterClassName,
}: TextFlippingBoardProps) {
  const resolvedRows = normalizeRows(rows, text)
  const columnCount = resolvedRows.reduce((max, row) => Math.max(max, row.length), 0)

  if (resolvedRows.length === 0 || columnCount === 0) {
    return null
  }

  return (
    <div
      className={cn(
        "w-full rounded-[28px] border border-white/10 bg-[#10263a] p-4 shadow-[0_22px_55px_rgba(15,34,47,0.28)]",
        className,
      )}
    >
      <div className="grid gap-1.5 md:gap-2" style={{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }}>
        {resolvedRows.map((row, rowIndex) =>
          row.padEnd(columnCount, " ").split("").map((character, columnIndex) => (
            <SplitFlapCell
              key={`${rowIndex}-${columnIndex}`}
              target={character}
              pulseKey={pulseKey}
              chaosMode={chaosMode}
              delay={rowIndex * 28 + columnIndex * 18}
              stepMs={stepMs}
              flipDuration={flipDuration}
              className={cellClassName}
              characterClassName={characterClassName}
            />
          )),
        )}
      </div>
    </div>
  )
}
