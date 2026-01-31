"use client"

import { useState, useEffect } from "react"
import AdminSidebar from "@/components/admin/AdminSidebar"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const publicPages = ['/admin/login', '/admin/register', '/admin/fix-user', '/admin/setup-demo', '/admin/test-connection']

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isPublicPage, setIsPublicPage] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setIsPublicPage(publicPages.includes(pathname || ''))
  }, [pathname])

  // Show children without layout during SSR to prevent hydration mismatch
  if (!mounted || isPublicPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 lg:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
