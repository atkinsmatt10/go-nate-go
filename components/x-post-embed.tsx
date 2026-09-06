"use client"

import type { JSX } from "react"
import { useEffect, useRef, useState } from "react"

export type XScriptStatus = "error" | "loading" | "ready"

interface XWidgetOptions {
  readonly align: "center"
  readonly conversation: "none"
  readonly dnt: true
  readonly theme: "dark"
}

interface XWidgets {
  createTweet(id: string, container: HTMLElement, options: XWidgetOptions): Promise<HTMLElement | undefined>
}

interface XRuntime {
  ready(callback: () => void): void
  readonly widgets?: XWidgets
}

interface XWindow extends Window {
  twttr: XRuntime | undefined
}

interface XPostEmbedProps {
  readonly id: string
  readonly scriptStatus: XScriptStatus
}

type XPostRenderStatus = "fallback" | "loading" | "ready"

const X_EMBED_TIMEOUT_MS = 10_000

export function getXRuntime(): XRuntime | undefined {
  return (window as XWindow).twttr
}

export function XPostEmbed({ id, scriptStatus }: XPostEmbedProps): JSX.Element {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [renderStatus, setRenderStatus] = useState<XPostRenderStatus>("loading")
  const postUrl = `https://x.com/i/web/status/${id}`

  useEffect(() => {
    if (scriptStatus === "error") {
      return
    }

    let isActive = true
    let isSettled = false
    const container = containerRef.current

    function settle(status: XPostRenderStatus): void {
      if (!isActive || isSettled) {
        return
      }

      isSettled = true
      window.clearTimeout(timeoutId)

      if (status === "fallback") {
        container?.replaceChildren()
      }

      setRenderStatus(status)
    }

    const timeoutId = window.setTimeout(() => {
      settle("fallback")
    }, X_EMBED_TIMEOUT_MS)

    const widgets = getXRuntime()?.widgets

    if (scriptStatus === "ready" && container && widgets) {
      container.replaceChildren()

      void widgets
        .createTweet(id, container, {
          align: "center",
          conversation: "none",
          dnt: true,
          theme: "dark",
        })
        .then((element) => {
          if (!isActive || isSettled) {
            element?.remove()
            return
          }

          settle(element ? "ready" : "fallback")
        })
        .catch(() => {
          settle("fallback")
        })
    }

    return () => {
      isActive = false
      window.clearTimeout(timeoutId)
      container?.replaceChildren()
    }
  }, [id, scriptStatus])

  const showFallback = scriptStatus === "error" || renderStatus === "fallback"
  const isLoading = !showFallback && renderStatus !== "ready"

  return (
    <div className={isLoading ? "relative min-h-[440px] w-full" : "w-full"} aria-busy={isLoading}>
      {isLoading ? (
        <div
          className="absolute inset-0 z-10 flex min-h-[440px] w-full flex-col items-center justify-center gap-3 rounded-xl border border-primary/20 bg-background p-6 text-center"
          role="status"
        >
          <span
            className="h-8 w-8 animate-pulse rounded-full border-2 border-primary/30 border-t-primary motion-reduce:animate-none"
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-muted-foreground">Loading X post…</span>
        </div>
      ) : null}

      {showFallback ? (
        <a
          href={postUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-48 w-full items-center justify-center rounded-xl border border-primary/25 bg-background/70 p-6 text-center font-semibold text-primary transition-colors hover:bg-primary/10 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          View post on X
        </a>
      ) : null}

      <div ref={containerRef} className={showFallback ? "hidden" : "w-full"} aria-hidden={isLoading || undefined} />
    </div>
  )
}
