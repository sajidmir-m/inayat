"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Edit, Trash2, Search, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { getServices, deleteService, createService, updateService } from "@/lib/actions/services"
import { Car, Home, Camera, Map, Star, ShieldCheck } from "lucide-react"

const iconMap: { [key: string]: any } = {
  Car,
  Home,
  Camera,
  Map,
  Star,
  ShieldCheck
}

export default function ServicesAdminPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    const { data, error } = await getServices()
    if (data) {
      setServices(data)
    }
    setLoading(false)
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleAddNew = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return
    
    const { error } = await deleteService(id)
    if (!error) {
      loadServices()
    } else {
      alert("Error deleting service: " + error)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)

    const formData = new FormData(e.currentTarget)
    
    if (editingService) {
      const { error } = await updateService(editingService.id, formData)
      if (!error) {
        setIsModalOpen(false)
        loadServices()
      } else {
        alert("Error updating service: " + error)
      }
    } else {
      const { error } = await createService(formData)
      if (!error) {
        setIsModalOpen(false)
        loadServices()
      } else {
        alert("Error creating service: " + error)
      }
    }
    setSaving(false)
  }

  const filteredServices = services.filter(service =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">Services Management</h1>
          <p className="text-slate-600">Manage all your travel services and offerings</p>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl px-6 py-6 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <Plus className="w-5 h-5 mr-2" /> Add New Service
        </Button>
      </div>

      {/* Search */}
      <Card className="border-slate-200/50 shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Card className="border-slate-200/50 shadow-lg">
          <CardContent className="p-12 text-center">
            <p className="text-slate-600 text-lg mb-4">No services found.</p>
            <Button onClick={handleAddNew} className="bg-gradient-to-r from-blue-600 to-blue-700">
              <Plus className="w-4 h-4 mr-2" /> Add Your First Service
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => {
            const IconComponent = iconMap[service.icon] || Car
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-slate-200/50 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex gap-2">
                        {service.featured && (
                          <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                            Featured
                          </span>
                        )}
                        <span className={cn(
                          "px-2 py-1 text-xs font-bold rounded-full",
                          service.status === "active" ? "bg-emerald-500 text-white" : "bg-slate-500 text-white"
                        )}>
                          {service.status}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-600 leading-relaxed text-sm mb-4">
                      {service.description}
                    </p>
                  </CardContent>
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleEdit(service)}
                        className="flex-1 rounded-xl border-slate-200 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <Edit className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(service.id)}
                        className="rounded-xl hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Modal for Add/Edit Service */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmit}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {editingService ? "Edit Service" : "Add New Service"}
                  </h2>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                  >
                    <XCircle className="w-5 h-5 text-slate-600" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Service Title *</label>
                      <Input
                        name="title"
                        required
                        defaultValue={editingService?.title}
                        className="h-12 rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Icon *</label>
                      <select
                        name="icon"
                        required
                        defaultValue={editingService?.icon || 'Car'}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Car">Car</option>
                        <option value="Home">Home</option>
                        <option value="Camera">Camera</option>
                        <option value="Map">Map</option>
                        <option value="Star">Star</option>
                        <option value="ShieldCheck">ShieldCheck</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Description *</label>
                    <Textarea
                      name="description"
                      required
                      defaultValue={editingService?.description}
                      className="min-h-[120px] rounded-xl border-slate-200 focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Status</label>
                      <select
                        name="status"
                        defaultValue={editingService?.status || 'active'}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700">Featured</label>
                      <select
                        name="featured"
                        defaultValue={editingService?.featured ? 'true' : 'false'}
                        className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 rounded-xl border-slate-200 hover:bg-slate-50"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={saving}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold shadow-lg"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                        </>
                      ) : (
                        editingService ? "Update Service" : "Add Service"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}
