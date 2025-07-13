import { Baby } from "lucide-react"
import Link from "next/link"

export function Header() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center bg-white shadow-sm">
      <Link href="#" className="flex items-center justify-center" prefetch={false}>
        <Baby className="h-6 w-6 text-blue-500" />
        <span className="ml-2 text-lg font-bold text-slate-800">Nate the Great</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link href="#story" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Nate's Story
        </Link>
        <Link href="#donate" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Donate
        </Link>
        <Link href="#shirt" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Get a Shirt
        </Link>
      </nav>
    </header>
  )
}
