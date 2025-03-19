import type React from "react"
import AdminNavbar from "@/components/admin/AdminNavBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <AdminNavbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

