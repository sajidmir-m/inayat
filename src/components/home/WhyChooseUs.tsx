"use client"

import { motion } from "framer-motion"
import { Shield, Clock, Heart, Users, Sparkles } from "lucide-react"

const features = [
  {
    icon: Users,
    title: "Local Experts",
    description: "Our team consists of locals who know Kashmir inside out, ensuring authentic experiences.",
    color: "from-blue-500 to-blue-600"
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "We are available round the clock to assist you during your journey.",
    color: "from-slate-500 to-slate-600"
  },
  {
    icon: Shield,
    title: "Best Price Guarantee",
    description: "Luxury experiences at the most competitive market prices.",
    color: "from-emerald-500 to-emerald-600"
  },
  {
    icon: Heart,
    title: "Custom Itineraries",
    description: "Tailor-made packages designed specifically for your preferences and budget.",
    color: "from-pink-500 to-pink-600"
  }
]

export default function WhyChooseUs() {
  return (
    <section className="py-28 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-100/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
              Why Choose Us
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-6">
            Your Trusted Travel Partner
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We don't just sell tour packages; we craft unforgettable memories. Here is why travelers trust us.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-200/50 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 h-full">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-base">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
