import type {} from "react/canary"
import { type ReactNode, ViewTransition } from "react"

const directionalTransition = {
  "nav-back": "nav-back",
  "nav-forward": "nav-forward",
  default: "none",
}

interface PageTransitionProps {
  children: ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  return (
    <ViewTransition
      default="none"
      enter={directionalTransition}
      exit={directionalTransition}
    >
      {children}
    </ViewTransition>
  )
}
