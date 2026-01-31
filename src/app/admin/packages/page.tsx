"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function PackagesAdminPage() {
  const router = useRouter()
  
  useEffect(() => {
    router.replace("/admin/journeys")
  }, [router])

  return null
}
