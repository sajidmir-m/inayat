"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Calendar, MapPin, DollarSign, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function SearchWidget() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative -mt-20 z-20 max-w-6xl mx-auto px-4"
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-slate-200/50">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center">
            <Search className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-serif font-bold text-slate-900">Find Your Perfect Journey</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" /> Destination
            </label>
            <Input 
              placeholder="Where to?" 
              className="border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-12 rounded-xl" 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-600" /> Duration
            </label>
            <select className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
              <option value="">Any Duration</option>
              <option value="3-5">3-5 Days</option>
              <option value="5-7">5-7 Days</option>
              <option value="7+">7+ Days</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" /> Budget
            </label>
            <select className="flex h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors">
              <option value="">Any Budget</option>
              <option value="budget">Budget Friendly</option>
              <option value="standard">Standard</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <Search className="w-5 h-5 mr-2" /> Search Tours
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
