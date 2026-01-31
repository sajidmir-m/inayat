"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Users, Calendar, Package, TrendingUp, MessageSquare, Briefcase, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { getDashboardStats } from "@/lib/actions/dashboard"
import { formatDateReadable } from "@/lib/utils/date-format"

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const data = await getDashboardStats()
    setStats(data)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  const statCards = [
    {
      title: "Active Journeys",
      value: stats?.journeys || 0,
      change: `${stats?.featuredJourneys || 0} featured`,
      trend: "neutral" as const,
      icon: Package,
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Total Bookings",
      value: stats?.bookings || 0,
      change: "All time",
      trend: "neutral" as const,
      icon: Calendar,
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Contact Inquiries",
      value: stats?.contacts || 0,
      change: `${stats?.pendingContacts || 0} pending`,
      trend: "neutral" as const,
      icon: MessageSquare,
      color: "from-orange-500 to-orange-600"
    },
    {
      title: "Active Services",
      value: stats?.services || 0,
      change: "All active",
      trend: "neutral" as const,
      icon: Briefcase,
      color: "from-slate-500 to-slate-600"
    }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's what's happening with your business today.</p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">{stat.title}</CardTitle>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="flex items-center gap-2 text-sm">
                  <p className="text-xs font-medium text-slate-500">
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card className="border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentBookings && stats.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {stats.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/50">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{booking.name}</p>
                      <p className="text-sm text-slate-600 mt-1">{booking.packages?.title || 'Package'}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDateReadable(booking.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <span className={cn(
                        "inline-block px-3 py-1 text-xs font-semibold rounded-full",
                        booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" :
                        booking.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No bookings yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card className="border-slate-200/50 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-slate-900">Recent Contact Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {stats?.recentContacts && stats.recentContacts.length > 0 ? (
              <div className="space-y-4">
                {stats.recentContacts.map((contact: any) => (
                  <div key={contact.id} className="flex items-start justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200/50">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{contact.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{contact.email}</p>
                      {contact.subject && (
                        <p className="text-sm text-slate-600 mt-2">{contact.subject}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">{formatDateReadable(contact.created_at)}</p>
                    </div>
                    <div className="ml-4">
                      <span className={cn(
                        "inline-block px-3 py-1 text-xs font-semibold rounded-full",
                        contact.status === "replied" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                      )}>
                        {contact.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-center py-8">No inquiries yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
