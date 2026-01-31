"use client"

import { use, useState, useEffect } from "react"
import BookingForm from "@/components/packages/BookingForm"
import { Clock, Star, MapPin, CheckCircle, XCircle, Loader2 } from "lucide-react"
import Image from "next/image"
import { notFound, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { getJourneyById } from "@/lib/actions/journeys"

export default function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [pkg, setPkg] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadPackage()
  }, [id])

  const loadPackage = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await getJourneyById(id)
    
    if (fetchError || !data) {
      setError(fetchError?.message || "Package not found")
      setLoading(false)
      return
    }

    // Transform data to match expected format
    const transformedPackage = {
      ...data,
      image: data.main_image_url || data.images?.[0]?.image_url || "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=2070&auto=format&fit=crop",
      rating: data.rating || 4.5,
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      inclusions: Array.isArray(data.inclusions) ? data.inclusions : [],
      exclusions: Array.isArray(data.exclusions) ? data.exclusions : []
    }

    setPkg(transformedPackage)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50/50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-600">Loading package details...</p>
        </div>
      </div>
    )
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-slate-50/50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Package Not Found</h1>
          <p className="text-slate-600 mb-6">{error || "The package you're looking for doesn't exist."}</p>
          <button
            onClick={() => router.push('/packages')}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            View All Packages
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50/50 pb-20">
      {/* Hero Image */}
      <div className="relative h-[70vh] w-full overflow-hidden">
        <Image 
          src={pkg.image} 
          alt={pkg.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-0 left-0 w-full p-8 md:p-12 text-white"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-blue-300">
              <MapPin className="w-5 h-5" />
              <span className="font-medium">{pkg.location}</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-6">{pkg.title}</h1>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Clock className="w-5 h-5 text-blue-300" />
                <span className="font-medium">{pkg.days} Days / {pkg.nights} Nights</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                <span className="font-medium">{pkg.rating} Rating</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8"
            >
              <h2 className="text-3xl font-serif font-bold mb-6 text-slate-900">Overview</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {pkg.description}
              </p>
            </motion.div>

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8"
              >
                <h2 className="text-3xl font-serif font-bold mb-8 text-slate-900">Itinerary</h2>
                <div className="space-y-6">
                  {pkg.itinerary.map((item: any, index: number) => (
                    <div key={index} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-lg">
                          {item.day || index + 1}
                        </div>
                        {index !== pkg.itinerary.length - 1 && (
                          <div className="w-1 h-full bg-gradient-to-b from-blue-200 to-transparent my-2"></div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title || `Day ${index + 1}`}</h3>
                        <p className="text-slate-600 leading-relaxed">{item.desc || item.description || item}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Inclusions & Exclusions */}
            {(pkg.inclusions?.length > 0 || pkg.exclusions?.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pkg.inclusions && pkg.inclusions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8"
                  >
                    <h3 className="text-xl font-bold mb-6 text-emerald-700 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6" /> Inclusions
                    </h3>
                    <ul className="space-y-3">
                      {pkg.inclusions.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <span className="mt-2 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
                {pkg.exclusions && pkg.exclusions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8"
                  >
                    <h3 className="text-xl font-bold mb-6 text-red-700 flex items-center gap-3">
                      <XCircle className="w-6 h-6" /> Exclusions
                    </h3>
                    <ul className="space-y-3">
                      {pkg.exclusions.map((item: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <span className="mt-2 w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar Booking Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <BookingForm packageId={id} packageTitle={pkg.title} price={Number(pkg.price)} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
