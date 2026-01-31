"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, Eye, Star, Calendar, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { getJourneys, deleteJourney } from "@/lib/actions/journeys"
import { useRouter } from "next/navigation"

export default function JourneysAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [journeys, setJourneys] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    loadJourneys()
  }, [])

  const loadJourneys = async () => {
    setLoading(true)
    const { data, error } = await getJourneys()
    if (data) {
      setJourneys(data)
    }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this journey?")) return
    
    setDeletingId(id)
    const { error } = await deleteJourney(id)
    if (!error) {
      loadJourneys()
    } else {
      alert("Error deleting journey: " + error)
    }
    setDeletingId(null)
  }

  const filteredJourneys = journeys.filter(journey => {
    const matchesSearch = journey.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          journey.location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || journey.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Journeys Management</h1>
          <p className="text-slate-600">Manage all your travel packages and journeys</p>
        </div>
        <Link href="/admin/journeys/new">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
            <Plus className="w-5 h-5 mr-2" /> Add New Journey
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input
                placeholder="Search journeys..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Family">Family</option>
              <option value="Honeymoon">Honeymoon</option>
              <option value="Adventure">Adventure</option>
              <option value="Group">Group</option>
              <option value="Offbeat">Offbeat</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Journeys Grid */}
      {filteredJourneys.length === 0 ? (
        <Card className="border-slate-200/50 shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">No journeys found.</p>
            <Link href="/admin/journeys/new">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700">
                <Plus className="w-4 h-4 mr-2" /> Add Your First Journey
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJourneys.map((journey, index) => (
            <motion.div
              key={journey.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                <div className="relative h-48 w-full">
                  {journey.image ? (
                    <Image
                      src={journey.image}
                      alt={journey.title || 'Journey'}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                      <span className="text-slate-400">No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {journey.featured && (
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full shadow-lg">
                        Featured
                      </span>
                    )}
                    <span className={cn(
                      "px-3 py-1 text-xs font-bold rounded-full shadow-lg",
                      journey.status === "active" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                    )}>
                      {journey.status || 'active'}
                    </span>
                  </div>
                  {journey.rating > 0 && (
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-slate-900 flex items-center gap-1 shadow-lg">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      {journey.rating}
                    </div>
                  )}
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-slate-900 mb-2">{journey.title}</CardTitle>
                  <div className="flex items-center text-slate-500 text-sm gap-4">
                    {journey.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-blue-600" />
                        <span>{journey.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span>{journey.days}D/{journey.nights}N</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">₹{parseFloat(journey.price).toLocaleString()}</p>
                      <p className="text-xs text-slate-500">per person</p>
                    </div>
                    {journey.category && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                        {journey.category}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/packages/${journey.id}`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-slate-50">
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                    </Link>
                    <Link href={`/admin/journeys/${journey.id}/edit`} className="flex-1">
                      <Button variant="outline" className="w-full rounded-xl border-slate-200 hover:bg-blue-50 hover:border-blue-300">
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                    </Link>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(journey.id)}
                      disabled={deletingId === journey.id}
                      className="rounded-xl hover:bg-red-700"
                    >
                      {deletingId === journey.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
