                                       import Link from "next/link"
import { ShoppingBag, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  return (
    <header
        className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="hidden text-xl font-bold sm:inline-block">eCommerce</span>
          </Link>
        </div>

        <nav className="hidden gap-6 md:flex">
          <Link href="" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link href="" className="text-sm font-medium transition-colors hover:text-primary">
            Products
          </Link>
          <Link href="" className="text-sm font-medium transition-colors hover:text-primary">
            Categories
          </Link>
          <Link href="" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
          <Link href="" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2">

          <Button variant="ghost" size="icon" asChild>
            <Link href="">
              <User className="h-5 w-5" />
              <span className="sr-only">User account</span>
            </Link>
          </Button>

          <Button variant="default" size="sm" asChild className="hidden md:flex">
            <Link href="">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

