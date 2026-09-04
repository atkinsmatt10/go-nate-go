"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"
import { cn } from "@/lib/utils"

interface BirthdayGalleryPhoto {
  alt: string
  caption: string
  src: string
}

interface BirthdayGalleryResponse {
  photos: BirthdayGalleryPhoto[]
}

const defaultBirthdayGalleryPhotos: readonly BirthdayGalleryPhoto[] = [
  {
    src: "/Nate-image.png",
    alt: "Nate in a pale green sleeper and hat, wide-eyed and cozy",
    caption: "Wide-eyed and cozy at home.",
  },
  {
    src: "/Nicole baby park.png",
    alt: "Nate sleeping in Nicole's arms outdoors",
    caption: "Fresh-air snuggles with mom.",
  },
  {
    src: "/IMG_9609.png",
    alt: "Nate resting on a striped hospital blanket",
    caption: "Tiny but already tough.",
  },
  {
    src: "/IMG_9684.png",
    alt: "Nate sleeping while swaddled shortly after birth",
    caption: "A very peaceful first nap.",
  },
  {
    src: "/IMG_9908.png",
    alt: "Nate lying on a couch in a blue sleeper and looking toward the camera",
    caption: "Stillness, curiosity, and big eyes.",
  },
] as const

function isBirthdayGalleryPhoto(value: unknown): value is BirthdayGalleryPhoto {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Record<string, unknown>

  return (
    typeof candidate.src === "string" &&
    typeof candidate.alt === "string" &&
    typeof candidate.caption === "string"
  )
}

function isBirthdayGalleryResponse(value: unknown): value is BirthdayGalleryResponse {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as { photos?: unknown }

  return Array.isArray(candidate.photos) && candidate.photos.every(isBirthdayGalleryPhoto)
}

export function BirthdayPhotoCarousel() {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [api, setApi] = useState<CarouselApi>()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [photos, setPhotos] = useState<readonly BirthdayGalleryPhoto[]>(defaultBirthdayGalleryPhotos)

  useEffect(() => {
    if (!api) {
      return
    }

    const syncSlide = () => {
      setCurrentSlide(api.selectedScrollSnap())
    }

    syncSlide()
    api.on("select", syncSlide)
    api.on("reInit", syncSlide)

    return () => {
      api.off("select", syncSlide)
      api.off("reInit", syncSlide)
    }
  }, [api])

  useEffect(() => {
    let isActive = true
    const controller = new AbortController()

    const loadBirthdayPhotos = async (): Promise<void> => {
      try {
        const response = await fetch("/api/birthday-photos", { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(8_000)]) })

        if (!response.ok) {
          return
        }

        const payload: unknown = await response.json()

        if (!isBirthdayGalleryResponse(payload) || payload.photos.length === 0 || !isActive) {
          return
        }

        setPhotos(payload.photos)
      } catch (error) {
        console.error("Unable to load birthday photos from Google Drive.", error)
      }
    }

    void loadBirthdayPhotos()

    return () => {
      isActive = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    api.scrollTo(0, true)
  }, [api, photos])

  return (
    <div className="space-y-5">
      <Carousel setApi={setApi} opts={{ align: "start", loop: true, duration: prefersReducedMotion ? 0 : 25 }} className="w-full">
        <CarouselContent>
          {photos.map((photo) => (
            <CarouselItem key={photo.src} className="basis-[88%] md:basis-[72%] lg:basis-[58%]">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[30px] bg-[#d8eff5] shadow-[0_22px_40px_rgba(42,63,84,0.16)]">
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 88vw, (max-width: 1024px) 72vw, 58vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="flex items-center justify-center gap-4">
        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full border-[#9fc5d8] bg-white/90 text-[#223b54] transition-[transform,border-color,background-color,box-shadow] duration-200 ease-snappy-out active:scale-[0.98] hover:-translate-y-0.5 hover:border-[#42a8a9] hover:bg-white hover:shadow-[0_12px_24px_rgba(42,63,84,0.14)]"
          onClick={() => api?.scrollPrev(prefersReducedMotion)}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Previous photo</span>
        </Button>

        <div className="flex items-center gap-2">
          {photos.map((photo, index) => (
            <span
              key={photo.src}
              className={cn(
                "h-2.5 rounded-full transition-[width,background-color] duration-200 ease-snappy-out",
                index === currentSlide ? "w-7 bg-[#42a8a9]" : "w-2.5 bg-[#c8dfea]",
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          size="icon"
          variant="outline"
          className="h-10 w-10 rounded-full border-[#9fc5d8] bg-white/90 text-[#223b54] transition-[transform,border-color,background-color,box-shadow] duration-200 ease-snappy-out active:scale-[0.98] hover:-translate-y-0.5 hover:border-[#42a8a9] hover:bg-white hover:shadow-[0_12px_24px_rgba(42,63,84,0.14)]"
          onClick={() => api?.scrollNext(prefersReducedMotion)}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next photo</span>
        </Button>
      </div>
    </div>
  )
}
