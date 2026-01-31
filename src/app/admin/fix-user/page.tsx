"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function FixUserPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-slate-200/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-blue-600 to-blue-700 text-white p-8 text-center">
            <CardTitle className="text-3xl font-serif font-bold">Fix User Record</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">Database not configured. Please set up your database first.</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
