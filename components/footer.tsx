import Image from "next/image"

export function Footer() {
  return (
    <footer className="border-t border-border py-8 px-4 md:px-6">
      <div className="container mx-auto flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Nate the Great. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/nate shark.png"
            width={40}
            height={40}
            alt="Nate's Shark Mascot"
            className="object-contain"
          />
          <p className="text-xs text-muted-foreground text-center">
            Built with ❤️ for Nate the Great
          </p>
        </div>
      </div>
    </footer>
  )
}
