"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Building2, FileText } from "lucide-react"

export default function Association() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200/50 p-8 md:p-12">
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/80 backdrop-blur-sm rounded-full border border-blue-200/50 mb-6"
              >
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 tracking-[0.15em] uppercase text-xs font-bold">
                  Associated With
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
                Gulmarg Venture Pvt Ltd
              </h2>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="relative w-48 h-48 md:w-64 md:h-64 rounded-2xl overflow-hidden bg-white shadow-lg border-2 border-slate-200/50 flex items-center justify-center p-4"
              >
                <Image
                  src="/Gulmarg Venture PVt ltd.jpeg"
                  alt="Gulmarg Venture Pvt Ltd"
                  fill
                  className="object-contain p-4"
                  priority
                />
              </motion.div>

              {/* Company Details */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex-1 space-y-4 text-center md:text-left"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">Corporate Identification Number</p>
                      <p className="text-lg font-bold text-slate-900 font-mono">U79110JK2024PTC015740</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 leading-relaxed pt-4">
                    We are proud to be associated with <span className="font-semibold text-slate-900">Gulmarg Venture Pvt Ltd</span>, 
                    a trusted partner in delivering exceptional travel experiences across Kashmir.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

