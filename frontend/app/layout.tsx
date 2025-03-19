
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import {Toaster} from "@/components/ui/sonner";
import {AuthProvider} from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "eCommerce Platform",
  description: "A modern eCommerce website with admin dashboard",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
          <AuthProvider>
              <main>{children}</main>
          </AuthProvider>
          <Toaster richColors  />
      </body>
    </html>
  )
}
