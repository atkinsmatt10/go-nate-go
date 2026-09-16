"use client"

import { useEffect, useRef, useState, type JSX } from "react"
import Image from "next/image"
import type { HeroOceanScene } from "@/lib/hero-ocean-scene"

interface DataConnection extends EventTarget {
  readonly saveData?: boolean
  readonly effectiveType?: string
}

export function HeroOcean(): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sharkRef = useRef<HTMLButtonElement>(null)
  const activateSharkRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const root = rootRef.current
    const canvas = canvasRef.current
    const sharkButton = sharkRef.current
    const sharkImage = sharkButton?.querySelector("img")
    const hero = root?.closest("section")
    if (!root || !canvas || !hero || !sharkButton || !sharkImage) return

    const connection = (navigator as Navigator & { connection?: DataConnection }).connection
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)")
    let scene: HeroOceanScene | undefined
    let frame = 0
    let elapsed = 0
    let lastFrame = 0
    let visible = false
    let disposed = false
    let loading = false
    let failed = false
    let idle: number | undefined
    let startupTimer: ReturnType<typeof setTimeout> | undefined
    let acknowledgmentTimer: ReturnType<typeof setTimeout> | undefined
    let sharkState = "idle"

    function setSharkState(state: string): void {
      if (sharkState === state) return
      sharkState = state
      root!.dataset.sharkState = state
      sharkButton!.dataset.sceneShark = String(state !== "idle" && state !== "acknowledgment")
      // aria-disabled communicates the busy state without dropping keyboard focus.
      sharkButton!.setAttribute("aria-disabled", String(state !== "idle"))
    }

    function restoreShark(): void {
      if (acknowledgmentTimer !== undefined) clearTimeout(acknowledgmentTimer)
      acknowledgmentTimer = undefined
      setSharkState("idle")
    }

    function preferencesAllowChase(): boolean {
      return !media.matches && !connection?.saveData
        && connection?.effectiveType !== "slow-2g" && connection?.effectiveType !== "2g"
    }

    function stop(): void {
      cancelAnimationFrame(frame)
      frame = 0
      lastFrame = 0
    }

    function tick(now: number): void {
      frame = requestAnimationFrame(tick)
      if (lastFrame && now - lastFrame < 1000 / 30) return
      elapsed += lastFrame ? Math.min((now - lastFrame) / 1000, 0.1) : 0
      lastFrame = now
      const state = scene?.render(elapsed)
      if (state && sharkState !== "acknowledgment") setSharkState(state)
      if (!scene?.isActive()) stop()
    }

    function resize(): void {
      stop()
      restoreShark()
      if (!scene) return
      const bounds = hero!.getBoundingClientRect()
      const logo = hero!.querySelector("[data-ocean-logo]")?.getBoundingClientRect()
      const heading = hero!.querySelector("h1")?.getBoundingClientRect()
      const video = hero!.querySelector("[data-ocean-video]")?.getBoundingClientRect()
      const content = hero!.querySelector(".hero-content")?.getBoundingClientRect()
      const illustration = sharkImage!.getBoundingClientRect()
      const mobile = bounds.width < 1024
      scene.resize({
        width: bounds.width,
        height: bounds.height,
        waterTop: Math.max(video?.bottom ?? bounds.top, content?.bottom ?? bounds.top) - bounds.top + 4,
        shark: { x: illustration.left - bounds.left, y: illustration.top - bounds.top, width: illustration.width, height: illustration.height },
      }, {
        left: mobile ? 62 : (logo?.left ?? bounds.left) - bounds.left + 65,
        right: mobile ? bounds.width - 62 : (logo?.right ?? bounds.right) - bounds.left - 65,
        y: mobile && logo && heading
          ? (logo.bottom + heading.top) / 2 - bounds.top
          : Math.max(30, (logo?.top ?? bounds.top + 100) - bounds.top - 38),
      })
      scene.render(elapsed)
    }

    function prepareShark(): void {
      scene?.prepareShark(sharkImage!)
    }

    function activateShark(): void {
      if (sharkState !== "idle") return
      // A click never overrides the visitor's motion or data preferences.
      if (scene && visible && !document.hidden && preferencesAllowChase()) {
        prepareShark()
        if (scene.beginChase(elapsed)) {
          setSharkState(scene.render(elapsed))
          syncPlayback()
          return
        }
      }
      setSharkState("acknowledgment")
      acknowledgmentTimer = setTimeout(restoreShark, 650)
    }

    async function start(): Promise<void> {
      if (scene || loading || failed || disposed || !visible || document.hidden || !preferencesAllowChase()) return
      loading = true
      try {
        const { createHeroOceanScene } = await import("@/lib/hero-ocean-scene")
        if (disposed || !visible || document.hidden || !preferencesAllowChase()) return
        scene = createHeroOceanScene(canvas!)
        resize()
        prepareShark()
        setReady(true)
        syncPlayback()
      } catch {
        failed = true
        restoreShark()
        scene?.dispose()
        scene = undefined
        setReady(false)
      } finally {
        loading = false
      }
    }

    function scheduleStart(): void {
      if (idle !== undefined || startupTimer !== undefined || !preferencesAllowChase()) return
      if ("requestIdleCallback" in window) {
        idle = window.requestIdleCallback(() => {
          idle = undefined
          void start()
        }, { timeout: 2000 })
      } else {
        startupTimer = setTimeout(() => {
          startupTimer = undefined
          void start()
        }, 250)
      }
    }

    function syncPlayback(): void {
      if (!preferencesAllowChase()) {
        stop()
        restoreShark()
        scene?.dispose()
        scene = undefined
        setReady(false)
        return
      }
      const onscreen = visible && !document.hidden
      // Render one still frame on load. The shared loop runs only for a visit
      // initiated by the shark, and suspends offscreen or in a hidden tab.
      if (scene?.isActive() && onscreen && !frame) frame = requestAnimationFrame(tick)
      if (!onscreen || !scene?.isActive()) stop()
      if (!scene && onscreen) scheduleStart()
    }

    function movePointer(event: PointerEvent): void {
      if (!finePointer.matches || !scene?.isActive()) return
      const bounds = hero!.getBoundingClientRect()
      scene?.point(
        ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
        -((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
      )
    }

    function resetPointer(): void {
      scene?.point(0, 0)
    }

    function contextLost(event: Event): void {
      event.preventDefault()
      stop()
      failed = true
      restoreShark()
      scene?.dispose()
      scene = undefined
      setReady(false)
    }

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      syncPlayback()
    }, { threshold: 0 })
    const resizeObserver = new ResizeObserver(resize)
    visibilityObserver.observe(hero)
    resizeObserver.observe(hero)
    const content = hero.querySelector(".hero-content")
    if (content) resizeObserver.observe(content)
    resizeObserver.observe(sharkImage)
    sharkImage.addEventListener("load", prepareShark)
    hero.addEventListener("pointermove", movePointer, { passive: true })
    hero.addEventListener("pointerleave", resetPointer)
    canvas.addEventListener("webglcontextlost", contextLost)
    document.addEventListener("visibilitychange", syncPlayback)
    media.addEventListener("change", syncPlayback)
    connection?.addEventListener("change", syncPlayback)
    activateSharkRef.current = activateShark

    return () => {
      disposed = true
      stop()
      restoreShark()
      if (idle !== undefined) window.cancelIdleCallback(idle)
      if (startupTimer !== undefined) clearTimeout(startupTimer)
      visibilityObserver.disconnect()
      resizeObserver.disconnect()
      sharkImage.removeEventListener("load", prepareShark)
      hero.removeEventListener("pointermove", movePointer)
      hero.removeEventListener("pointerleave", resetPointer)
      canvas.removeEventListener("webglcontextlost", contextLost)
      document.removeEventListener("visibilitychange", syncPlayback)
      media.removeEventListener("change", syncPlayback)
      connection?.removeEventListener("change", syncPlayback)
      activateSharkRef.current = null
      scene?.dispose()
    }
  }, [])

  return (
    <div ref={rootRef} className="hero-ocean pointer-events-none absolute inset-0" data-ready={ready} data-shark-state="idle">
      <canvas ref={canvasRef} aria-hidden="true" data-fish-visibility="hidden" data-wave-state="calm" className="hero-ocean-canvas absolute inset-0 h-full w-full" />
      <button
        ref={sharkRef}
        type="button"
        aria-label="Play shark tag"
        aria-disabled="false"
        data-scene-shark="false"
        onClick={() => activateSharkRef.current?.()}
        className="hero-shark pointer-events-auto absolute bottom-0 right-3 z-20 min-h-11 min-w-11 w-24 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8eff5] sm:right-8 sm:w-28 lg:right-[5%] lg:w-32"
      >
        <Image src="/nate shark.png" width={132} height={128} sizes="(max-width: 639px) 96px, (max-width: 1023px) 112px, 128px" alt="" loading="eager" draggable={false} className="h-auto w-full drop-shadow-[0_12px_20px_rgb(7_27_43_/_26%)]" />
        <span aria-hidden="true" className="hero-shark-hello absolute inset-x-0 top-3 text-center text-sm font-bold text-[#f7fbff]">Hi, friend!</span>
      </button>
    </div>
  )
}
