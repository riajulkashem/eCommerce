"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LogOut,
  User,
  Lock,
  ShoppingBag
} from "lucide-react"


export default function AdminNavbar() {

  // Mock user data - in a real app, this would come from authentication
  const user = {
    name: "Riajul Kashem",
    email: "john.doe@example.com",
    image: "https://avatars.githubusercontent.com/u/36927903?v=4",
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Logo and Site Name */}
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <ShoppingBag className="h-6 w-6 text-primary" />
          </div>
          <span className="hidden text-lg font-bold md:inline-block">eCommerce Platform</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Image
                src={user.image || "/placeholder.svg"}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/profile?tab=password" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/auth/login" className="flex items-center gap-2 text-destructive">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

