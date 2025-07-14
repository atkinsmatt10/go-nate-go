import { Fish } from "lucide-react"
import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border py-6 px-4 md:px-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Fish className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nate the Great. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Image
            src="/nate shark.png"
            width={40}
            height={40}
            alt="Nate's Shark Mascot"
            className="object-contain"
          />
          <p className="text-xs text-muted-foreground">
            Made with love in Philadelphia
          </p>
        </div>
      </div>
    </footer>
  )
}
