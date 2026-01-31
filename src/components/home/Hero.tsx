"use client"

import { motion } from "framer-motion"
import { ArrowRight, MapPin, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-slate-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
                Discover the Paradise
              </span>
            </motion.div>

            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-slate-900 leading-[1.1]">
                Kashmir, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-slate-600 italic font-normal">
                  Unveiled.
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-xl leading-relaxed font-light">
                Experience the timeless beauty of the valley. From the serene Dal Lake to the snow-capped peaks of Gulmarg, let us curate your perfect escape.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/packages">
                <Button 
                  size="lg" 
                  className="group bg-slate-900 hover:bg-blue-700 text-white rounded-full px-8 py-7 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Explore Journeys 
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button 
                  size="lg" 
                  variant="outline"
                  className="rounded-full px-8 py-7 text-lg font-medium border-2 border-slate-300 hover:border-slate-900 hover:bg-slate-900 hover:text-white transition-all duration-300"
                >
                  Plan Your Trip
                </Button>
              </Link>
            </div>

            {/* Stats/Social Proof */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-8 grid grid-cols-3 gap-8 border-t border-slate-200"
            >
              <div>
                <p className="text-4xl font-serif font-bold text-slate-900">5k+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider mt-1">Happy Travelers</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-slate-900">50+</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider mt-1">Destinations</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-slate-900">24/7</p>
                <p className="text-sm text-slate-500 uppercase tracking-wider mt-1">Support</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Image Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative h-[650px] hidden lg:block"
          >
            {/* Main Image with Modern Frame */}
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-2xl z-20 border-4 border-white">
              <Image
                src="/dallake.png"
                alt="Dal Lake Shikara"
                fill
                className="object-cover hover:scale-110 transition-transform duration-[2000ms] ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
            </div>

            {/* Floating Card 1 */}
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
              className="absolute -bottom-12 -left-8 z-30 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl max-w-xs border border-slate-100"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Gulmarg</p>
                  <p className="text-xs text-slate-500 font-medium">Top Rated Destination</p>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">"The meadow of flowers awaits your arrival."</p>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute -top-8 -right-8 w-48 h-48 border-2 border-blue-200/50 rounded-full z-0 opacity-60"></div>
            <div className="absolute top-1/2 -right-16 w-32 h-32 bg-blue-100/60 rounded-full blur-2xl opacity-50 z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-slate-200/40 rounded-full blur-xl z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
