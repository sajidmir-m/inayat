"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getJourneyById, updateJourney } from "@/lib/actions/journeys"
import { compressImage, validateImageFile } from "@/lib/utils/image-compression"

export default function EditJourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [journey, setJourney] = useState<any>(null)
  const [mainImage, setMainImage] = useState<File | null>(null)
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null)
  const [imageDeleted, setImageDeleted] = useState(false)
  const [compressing, setCompressing] = useState(false)

  useEffect(() => {
    loadJourney()
  }, [id])

  const loadJourney = async () => {
    const { data, error } = await getJourneyById(id)
    if (data) {
      setJourney(data)
      if (data.main_image_url) {
        setMainImagePreview(data.main_image_url)
      }
    }
    setLoading(false)
  }

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file
    const validationError = validateImageFile(file, 10) // Allow up to 10MB before compression
    if (validationError) {
      setError(validationError)
      return
    }

    setCompressing(true)
    setError("")

    try {
      // Compress image before setting
      const compressedFile = await compressImage(file, 1920, 1080, 0.85, 2)
      setMainImage(compressedFile)
      setMainImagePreview(URL.createObjectURL(compressedFile))
      setImageDeleted(false)
      
      if (compressedFile.size < file.size) {
        const originalSize = (file.size / 1024 / 1024).toFixed(2)
        const compressedSize = (compressedFile.size / 1024 / 1024).toFixed(2)
        console.log(`Image compressed: ${originalSize}MB → ${compressedSize}MB`)
      }
    } catch (err) {
      console.error('Image compression error:', err)
      // If compression fails, use original file
      setMainImage(file)
      setMainImagePreview(URL.createObjectURL(file))
      setImageDeleted(false)
    } finally {
      setCompressing(false)
    }
  }

  const handleDeleteImage = () => {
    setMainImage(null)
    setMainImagePreview(null)
    setImageDeleted(true)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    
    // Handle image: upload new one or delete existing
    if (imageDeleted) {
      formData.append('deleteImage', 'true')
    } else if (mainImage) {
      formData.append('mainImage', mainImage)
    }

    const { data, error: actionError } = await updateJourney(id, formData)
    
    if (actionError) {
      setError(actionError)
      setSaving(false)
    } else {
      router.push('/admin/journeys')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600">Journey not found</p>
        <Link href="/admin/journeys">
          <Button className="mt-4">Back to Journeys</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/journeys">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-4xl font-serif font-bold text-slate-900">Edit Journey</h1>
          <p className="text-slate-600">Update journey details</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Journey Title *</label>
                  <Input name="title" required defaultValue={journey.title} className="rounded-xl" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Price (₹) *</label>
                    <Input name="price" type="number" required defaultValue={journey.price} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Duration *</label>
                    <Input name="duration" required defaultValue={journey.duration} className="rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Days *</label>
                    <Input name="days" type="number" required defaultValue={journey.days} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Nights *</label>
                    <Input name="nights" type="number" required defaultValue={journey.nights} className="rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Location *</label>
                    <Input name="location" required defaultValue={journey.location || ''} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Category *</label>
                    <select name="category" required defaultValue={journey.category || ''} className="w-full h-10 rounded-xl border border-slate-200 px-3 focus:ring-2 focus:ring-blue-500">
                      <option value="">Select Category</option>
                      <option value="Family">Family</option>
                      <option value="Honeymoon">Honeymoon</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Group">Group</option>
                      <option value="Offbeat">Offbeat</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Description *</label>
                  <Textarea name="description" required defaultValue={journey.description || ''} className="rounded-xl min-h-[120px]" />
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Journey Image</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                    {compressing ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                        <p className="text-sm text-slate-600">Compressing image...</p>
                      </div>
                    ) : mainImagePreview ? (
                      <div className="relative w-full h-64 rounded-xl overflow-hidden group">
                        <Image src={mainImagePreview} alt="Preview" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center gap-4">
                          <button
                            type="button"
                            onClick={handleDeleteImage}
                            className="opacity-0 group-hover:opacity-100 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2"
                          >
                            <X className="w-4 h-4" /> Delete
                          </button>
                          <label className="opacity-0 group-hover:opacity-100 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2">
                            <Upload className="w-4 h-4" /> Replace
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleMainImageChange}
                              disabled={compressing}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="cursor-pointer block">
                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-300">
                          <Upload className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                          <p className="text-slate-600 font-medium mb-1">Click to upload image</p>
                          <p className="text-xs text-slate-500">JPG, PNG or WebP (max 10MB, auto-compressed)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleMainImageChange}
                          disabled={compressing}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {mainImagePreview && !compressing && (
                    <p className="text-xs text-slate-500 text-center">
                      {mainImage ? (
                        <>
                          New image selected ({mainImage.size > 1024 * 1024 
                            ? `${(mainImage.size / 1024 / 1024).toFixed(2)}MB` 
                            : `${(mainImage.size / 1024).toFixed(0)}KB`}). Click 'Save Changes' to update.
                        </>
                      ) : (
                        "Current image. Hover to delete or replace."
                      )}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="border-slate-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select name="status" defaultValue={journey.status || 'active'} className="w-full h-10 rounded-xl border border-slate-200 px-3 focus:ring-2 focus:ring-blue-500">
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" name="featured" value="true" defaultChecked={journey.featured} className="w-4 h-4 rounded" />
                    <span className="text-sm font-semibold text-slate-700">Featured Journey</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <p className="text-sm text-red-700">{error}</p>
                </CardContent>
              </Card>
            )}

            <div className="flex gap-4">
              <Link href="/admin/journeys" className="flex-1">
                <Button type="button" variant="outline" className="w-full rounded-xl">
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-xl font-semibold"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

