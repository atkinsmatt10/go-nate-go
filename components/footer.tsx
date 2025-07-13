import { Fish, Twitter, Facebook, Instagram } from "lucide-react"
import Link from "next/link"

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
        <div className="flex items-center gap-4">
          <Link href="#" prefetch={false}>
            <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </Link>
          <Link href="#" prefetch={false}>
            <Facebook className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </Link>
          <Link href="#" prefetch={false}>
            <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
