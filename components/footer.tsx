import { Baby, Twitter, Facebook, Instagram } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-6 px-4 md:px-6">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Baby className="h-5 w-5 text-blue-500" />
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} Nate the Great. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="#" prefetch={false}>
            <Twitter className="h-5 w-5 text-slate-600 hover:text-blue-500" />
          </Link>
          <Link href="#" prefetch={false}>
            <Facebook className="h-5 w-5 text-slate-600 hover:text-blue-500" />
          </Link>
          <Link href="#" prefetch={false}>
            <Instagram className="h-5 w-5 text-slate-600 hover:text-blue-500" />
          </Link>
        </div>
      </div>
    </footer>
  )
}
