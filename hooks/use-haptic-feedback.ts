"use client"

import { useCallback } from "react"
import { useWebHaptics } from "web-haptics/react"

export type HapticIntent =
  | "success"
  | "warning"
  | "error"
  | "light"
  | "medium"
  | "heavy"
  | "selection"

export function useHapticFeedback() {
  const haptics = useWebHaptics()

  const trigger = useCallback(
    (intent: HapticIntent = "medium") => {
      void haptics.trigger(intent)
    },
    [haptics]
  )

  return {
    trigger,
    isSupported: haptics.isSupported,
  }
}
