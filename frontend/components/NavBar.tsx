"use client"
import Link from "next/link"
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
    ShoppingBag, Cog
} from "lucide-react"
import {useAuth} from "@/contexts/AuthContext";
import {Button} from "@/components/ui/button";



export default function NavBar() {
    const {user, logoutUser} = useAuth()

    const handleLogOut = async () => {
        await logoutUser()
    }

    return (
        <header
            className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background px-4 md:px-6">
            {/* Logo and Site Name */}
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md">
                        <ShoppingBag className="h-6 w-6 text-primary"/>
                    </div>
                    <span className="hidden text-lg font-bold md:inline-block">eCommerce Platform</span>
                </Link>
            </div>

            <div className="flex items-center gap-2">
                {
                    user
                        ? <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                        <span className="flex items-center gap-1">
                        <User className="h-7 w-7"/>
                        <span>{user?.first_name + " " + user?.last_name}</span>
                        </span>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex flex-col space-y-1 p-2">
                                    <p className="text-sm font-medium">{user?.first_name + " " + user?.last_name}</p>
                                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                                </div>
                                <DropdownMenuSeparator/>
                                {
                                    user.is_staff
                                        ? <DropdownMenuItem asChild>
                                            <Link href="/admin" className="flex items-center gap-2 text-red-500">
                                                <Cog className="h-4 w-4"/>
                                                <span>Admin Panel</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        : null
                                }
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile" className="flex items-center gap-2">
                                        <User className="h-4 w-4"/>
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/profile?tab=password" className="flex items-center gap-2">
                                        <Lock className="h-4 w-4"/>
                                        <span>Change Password</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem asChild>
                                    <Link href="" onClick={handleLogOut}
                                          className="flex items-center gap-2 text-destructive">
                                        <LogOut className="h-4 w-4"/>
                                        <span>Logout</span>
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        : <Button variant="default" size="sm" asChild className="hidden md:flex">
                            <Link href="/auth/login">Sign In</Link>
                        </Button>
                }


            </div>
        </header>
    )
}

