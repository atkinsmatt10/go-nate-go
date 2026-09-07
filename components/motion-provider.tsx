"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { LazyMotion, useInView, type FeatureBundle } from "motion/react"

const loadFeatures = () => import("@/lib/motion-features").then((module) => module.default)

function createFeatureRequest() {
  let resolveFeatures: (features: FeatureBundle) => void = () => undefined
  const promise = new Promise<FeatureBundle>((resolve) => { resolveFeatures = resolve })
  return { load: () => promise, resolve: resolveFeatures }
}

export function MotionProvider({ children, defer = false }: { children: ReactNode; defer?: boolean }) {
  const scopeRef = useRef<HTMLDivElement>(null)
  const isNearViewport = useInView(scopeRef, { once: true, margin: "200px 0px", initial: !defer })
  const [request] = useState(createFeatureRequest)
  const [status, setStatus] = useState<"pending" | "ready" | "failed">("pending")

  useEffect(() => {
    if (!isNearViewport) return
    let isActive = true
    void loadFeatures().then((features) => {
      if (!isActive) return
      request.resolve(features)
      setStatus("ready")
    }).catch((error: unknown) => {
      if (!isActive) return
      setStatus("failed")
      console.warn("Animations unavailable; keeping campaign content accessible.", error)
    })
    return () => { isActive = false }
  }, [isNearViewport, request])

  return (
    <div ref={scopeRef} data-motion-state={status} className={defer ? undefined : "contents"}>
      {/* Keep the same subtree mounted while features load, preserving form and polling state. */}
      <LazyMotion features={request.load} strict>
        {children}
      </LazyMotion>
      <noscript>
        <style>{"[data-motion-state] [data-motion-reveal] { opacity: 1 !important; transform: none !important; }"}</style>
      </noscript>
    </div>
  )
}
