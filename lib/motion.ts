import type { MotionProps, Transition, Variants } from "framer-motion"

export const MOTION_EASE_OUT = [0.23, 1, 0.32, 1] as const
export const MOTION_EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
export const MOTION_EASE_DRAWER = [0.32, 0.72, 0, 1] as const

interface RevealOptions {
  delay?: number
  distance?: number
  duration?: number
  margin?: string
}

interface ScaleInOptions {
  delay?: number
  duration?: number
  scale?: number
}

export function getRevealProps(
  prefersReducedMotion: boolean,
  options: RevealOptions = {}
): Pick<MotionProps, "initial" | "whileInView" | "viewport" | "transition"> {
  const { delay = 0, distance = 18, duration = 0.28, margin = "-72px" } = options

  return prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin },
        transition: { duration: 0.18, delay },
      }
    : {
        initial: { opacity: 0, y: distance },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin },
        transition: { duration, delay, ease: MOTION_EASE_OUT },
      }
}

export function getPageRevealProps(
  prefersReducedMotion: boolean,
  options: RevealOptions = {}
): Pick<MotionProps, "initial" | "animate" | "transition"> {
  const { delay = 0, distance = 18, duration = 0.28 } = options

  return prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.18, delay },
      }
    : {
        initial: { opacity: 0, y: distance },
        animate: { opacity: 1, y: 0 },
        transition: { duration, delay, ease: MOTION_EASE_OUT },
      }
}

export function getScaleInProps(
  prefersReducedMotion: boolean,
  options: ScaleInOptions = {}
): Pick<MotionProps, "initial" | "animate" | "transition"> {
  const { delay = 0, duration = 0.24, scale = 0.97 } = options

  return prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.18, delay },
      }
    : {
        initial: { opacity: 0, scale },
        animate: { opacity: 1, scale: 1 },
        transition: { duration, delay, ease: MOTION_EASE_OUT },
      }
}

export function getCarouselSlideVariants(
  prefersReducedMotion: boolean,
  distance = 56
): Variants {
  if (prefersReducedMotion) {
    return {
      enter: { opacity: 0 },
      center: { zIndex: 1, opacity: 1 },
      exit: { zIndex: 0, opacity: 0 },
    }
  }

  return {
    enter: (direction: number) => ({
      opacity: 0,
      x: direction > 0 ? distance : -distance,
      scale: 0.98,
    }),
    center: {
      zIndex: 1,
      opacity: 1,
      x: 0,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      opacity: 0,
      x: direction < 0 ? distance : -distance,
      scale: 0.98,
    }),
  }
}

export const CAROUSEL_TRANSITION: Transition = {
  duration: 0.22,
  ease: MOTION_EASE_OUT,
}
