"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, Home, Camera, Map, Star, ShieldCheck, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

const services = [
  {
    icon: Car,
    title: "Cab Rentals",
    description: "Comfortable and reliable cab services for airport pickups, sightseeing, and intercity travel. Choose from Sedans, SUVs, and Luxury travelers.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Home,
    title: "Hotel Bookings",
    description: "From luxury 5-star hotels to cozy boutique stays and authentic houseboats. We have partnerships with the best properties in Kashmir.",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Camera,
    title: "Sightseeing Tours",
    description: "Guided tours to famous landmarks like Dal Lake, Mughal Gardens, Gulmarg Gondola, and hidden gems known only to locals.",
    color: "from-purple-500 to-purple-600"
  },
  {
    icon: Star,
    title: "Honeymoon Specials",
    description: "Romantic getaways with special inclusions like candlelight dinners, flower decorations, and private photography sessions.",
    color: "from-pink-500 to-pink-600"
  },
  {
    icon: ShieldCheck,
    title: "Adventure Activities",
    description: "Booking assistance for skiing, trekking, river rafting, and paragliding with certified operators and safety equipment.",
    color: "from-orange-500 to-orange-600"
  },
  {
    icon: Map,
    title: "Custom Itineraries",
    description: "Don't like pre-made packages? We build a day-by-day plan tailored specifically to your interests and pace.",
    color: "from-slate-500 to-slate-600"
  }
]

export default function ServicesPage() {
  return (
    <div className="bg-gradient-to-b from-white to-slate-50/50 min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
              Our Services
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6">Our Services</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need for a perfect Kashmir vacation, all under one roof.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-2xl transition-all duration-300 border-slate-200/50 shadow-lg bg-white h-full group">
                <CardHeader>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-slate-900">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed text-base">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
